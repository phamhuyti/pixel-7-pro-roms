#!/usr/bin/env bash
# Auto-flash LineageOS official cho Google Pixel 7 Pro (cheetah).
# Bám wiki: https://wiki.lineageos.org/devices/cheetah/install/
# Không khóa bootloader. Không flash máy khác cheetah.
set -euo pipefail

DEVICE_CODENAME="cheetah"
DEVICE_NAME="Pixel 7 Pro"
API_BUILDS="https://download.lineageos.org/api/v2/devices/${DEVICE_CODENAME}/builds"
WIKI_INSTALL="https://wiki.lineageos.org/devices/cheetah/install/"
WIKI_FIRMWARE="https://wiki.lineageos.org/devices/cheetah/fw_update/"

WORK_DIR=""
GAPPS_ZIP=""
SKIP_DOWNLOAD=0
ASSUME_YES=0
ONLY_DOWNLOAD=0
ROM_ZIP_OVERRIDE=""

RED=$'\033[31m'
GREEN=$'\033[32m'
YELLOW=$'\033[33m'
CYAN=$'\033[36m'
BOLD=$'\033[1m'
RESET=$'\033[0m'

log() { printf '%s%s%s\n' "$CYAN" "$*" "$RESET"; }
ok() { printf '%s%s%s\n' "$GREEN" "$*" "$RESET"; }
warn() { printf '%s%s%s\n' "$YELLOW" "$*" "$RESET" >&2; }
die() { printf '%sERROR:%s %s\n' "$RED" "$RESET" "$*" >&2; exit 1; }

usage() {
  cat <<EOF
${BOLD}lineageos-cheetah-flash.sh${RESET} — auto flash LineageOS cho ${DEVICE_NAME} (${DEVICE_CODENAME})

Theo wiki official. Script chỉ tự động phần fastboot/adb; Format data và
Apply from ADB trên recovery bạn phải chọn tay khi được nhắc.

USAGE:
  $0 [options]

OPTIONS:
  -d, --dir DIR          Thư mục làm việc (mặc định: ./lineage-cheetah-flash)
  -g, --gapps FILE       Sideload MindTheGapps (arm64) sau ROM, trước boot đầu
  -r, --rom FILE         Dùng zip ROM local thay vì tải nightly mới nhất
      --skip-download    Không tải; dùng file đã có trong --dir
      --download-only    Chỉ tải + kiểm tra SHA256, không flash
  -y, --yes              Bỏ qua xác nhận wipe (vẫn dừng khi recovery cần tay)
  -h, --help             Hiện trợ giúp

FILE CẦN CÓ (cùng bản build):
  boot.img  dtbo.img  vendor_kernel_boot.img  vendor_boot.img
  lineage-*-cheetah-signed.zip

VÍ DỤ:
  $0                         # tải nightly mới + flash
  $0 --dir ~/los --gapps ~/MindTheGapps-arm64.zip
  $0 --skip-download --dir ~/los
  $0 --download-only

YÊU CẦU:
  - platform-tools (adb, fastboot) trong PATH
  - curl hoặc wget; sha256sum hoặc shasum
  - Bootloader đã unlock; firmware stock Android 16 mới nhất
  - Không chạy trên máy không phải ${DEVICE_CODENAME}

Wiki: ${WIKI_INSTALL}
EOF
}

need_cmd() {
  command -v "$1" >/dev/null 2>&1 || die "Thiếu lệnh '$1'. Cài Android platform-tools / curl."
}

confirm() {
  local prompt=$1
  if [[ "$ASSUME_YES" -eq 1 ]]; then
    return 0
  fi
  local reply
  printf '%s%s [y/N]: %s' "$YELLOW" "$prompt" "$RESET"
  read -r reply
  [[ "$reply" == "y" || "$reply" == "Y" || "$reply" == "yes" ]]
}

pause() {
  local msg=${1:-"Nhấn Enter khi xong bước trên máy…"}
  printf '%s%s%s' "$BOLD" "$msg" "$RESET"
  read -r _
}

have_downloader() {
  if command -v curl >/dev/null 2>&1; then
    echo curl
  elif command -v wget >/dev/null 2>&1; then
    echo wget
  else
    die "Cần curl hoặc wget để tải bản build."
  fi
}

download_file() {
  local url=$1
  local out=$2
  local dl
  dl=$(have_downloader)
  log "Tải: $(basename "$out")"
  if [[ "$dl" == curl ]]; then
    curl -fL --retry 3 --retry-delay 2 -o "$out" "$url"
  else
    wget -O "$out" "$url"
  fi
}

sha256_of() {
  local file=$1
  if command -v sha256sum >/dev/null 2>&1; then
    sha256sum "$file" | awk '{print $1}'
  elif command -v shasum >/dev/null 2>&1; then
    shasum -a 256 "$file" | awk '{print $1}'
  else
    die "Cần sha256sum hoặc shasum để đối chiếu hash."
  fi
}

verify_sha256() {
  local file=$1
  local expect=$2
  [[ -n "$expect" ]] || return 0
  local got
  got=$(sha256_of "$file")
  if [[ "$got" != "$expect" ]]; then
    die "SHA256 lệch cho $(basename "$file"): expect $expect, got $got"
  fi
  ok "SHA256 OK: $(basename "$file")"
}

json_latest_build() {
  # Trả JSON object build đầu (mới nhất). Không cần jq.
  local raw
  if command -v curl >/dev/null 2>&1; then
    raw=$(curl -fsSL "$API_BUILDS")
  else
    raw=$(wget -qO- "$API_BUILDS")
  fi
  # Cắt phần tử mảng đầu tiên bằng brace matching thô: lấy từ [ đầu tới }],[
  python3 -c '
import json,sys
builds=json.load(sys.stdin)
if not builds:
    sys.exit("API không trả build nào cho cheetah")
print(json.dumps(builds[0]))
' <<<"$raw" 2>/dev/null || {
    # Fallback không python: lấy raw và parse bằng sed (kém chắc hơn)
    die "Cần python3 để đọc API LineageOS (hoặc dùng --skip-download / --rom)."
  }
}

file_meta_from_build() {
  local build_json=$1
  local name=$2
  python3 -c '
import json,sys
build=json.loads(sys.argv[1])
want=sys.argv[2]
for f in build["files"]:
    if f["filename"]==want or (want=="rom" and f["filename"].endswith("-cheetah-signed.zip") and f["filename"].startswith("lineage-")):
        print(f["url"])
        print(f.get("sha256",""))
        print(f["filename"])
        sys.exit(0)
sys.exit(f"Không thấy file {want} trong build")
' "$build_json" "$name"
}

download_latest() {
  local dir=$1
  mkdir -p "$dir"
  log "Lấy danh sách build official cho ${DEVICE_CODENAME}…"
  local build
  build=$(json_latest_build)
  local date version
  date=$(python3 -c 'import json,sys; print(json.loads(sys.argv[1])["date"])' "$build")
  version=$(python3 -c 'import json,sys; print(json.loads(sys.argv[1])["version"])' "$build")
  ok "Nightly mới nhất: LineageOS ${version} (${date})"

  local needed=(boot.img dtbo.img vendor_kernel_boot.img vendor_boot.img rom)
  local name url sha fname meta_line i
  for name in "${needed[@]}"; do
    url=""; sha=""; fname=""; i=0
    while IFS= read -r meta_line; do
      case $i in
        0) url=$meta_line ;;
        1) sha=$meta_line ;;
        2) fname=$meta_line ;;
      esac
      i=$((i + 1))
    done < <(file_meta_from_build "$build" "$name")
    [[ -n "$url" && -n "$fname" ]] || die "Không parse được metadata cho $name"
    local out="$dir/$fname"
    if [[ -f "$out" ]]; then
      local got
      got=$(sha256_of "$out")
      if [[ -n "$sha" && "$got" == "$sha" ]]; then
        ok "Đã có và khớp hash: $fname"
        continue
      fi
      warn "File cũ lệch hash, tải lại: $fname"
    fi
    download_file "$url" "$out"
    verify_sha256 "$out" "$sha"
  done
}

find_rom_zip() {
  local dir=$1
  if [[ -n "$ROM_ZIP_OVERRIDE" ]]; then
    [[ -f "$ROM_ZIP_OVERRIDE" ]] || die "Không thấy --rom: $ROM_ZIP_OVERRIDE"
    echo "$ROM_ZIP_OVERRIDE"
    return
  fi
  local z
  z=$(find "$dir" -maxdepth 1 -type f -name 'lineage-*-cheetah-signed.zip' | sort | tail -n 1 || true)
  [[ -n "$z" ]] || die "Không thấy lineage-*-cheetah-signed.zip trong $dir"
  echo "$z"
}

require_imgs() {
  local dir=$1
  local f
  for f in boot.img dtbo.img vendor_kernel_boot.img vendor_boot.img; do
    [[ -f "$dir/$f" ]] || die "Thiếu $dir/$f — cùng bản với zip ROM."
  done
}

adb_wait() {
  log "Chờ thiết bị adb…"
  adb wait-for-device
}

fastboot_wait() {
  log "Chờ thiết bị fastboot…"
  local i=0
  while true; do
    if fastboot devices 2>/dev/null | grep -qE '[[:space:]](fastboot|fastbootd)$'; then
      return 0
    fi
    i=$((i + 1))
    if [[ $i -gt 120 ]]; then
      die "Không thấy máy ở fastboot sau 2 phút. Kiểm tra cáp / driver."
    fi
    sleep 1
  done
}

fastboot_getvar() {
  local key=$1
  # stdout dạng "product: cheetah" hoặc "(bootloader) product: cheetah"
  fastboot getvar "$key" 2>&1 | sed -n "s/.*${key}:[[:space:]]*//p" | head -n1 | tr -d '\r'
}

assert_cheetah_fastboot() {
  fastboot_wait
  local product unlocked
  product=$(fastboot_getvar product)
  unlocked=$(fastboot_getvar unlocked)
  log "fastboot product=${product:-?} unlocked=${unlocked:-?}"
  if [[ "$product" != "$DEVICE_CODENAME" ]]; then
    die "Máy báo product='$product', không phải ${DEVICE_CODENAME}. Dừng để tránh brick."
  fi
  local unlocked_lc
  unlocked_lc=$(printf '%s' "$unlocked" | tr '[:upper:]' '[:lower:]')
  if [[ "$unlocked_lc" != "yes" ]]; then
    die "Bootloader chưa unlock (unlocked=$unlocked). Mở khóa trước — xem wiki / trang unlock catalog."
  fi
}

reboot_to_bootloader() {
  if fastboot devices 2>/dev/null | grep -qE '[[:space:]](fastboot|fastbootd)$'; then
    ok "Đã ở fastboot."
    return
  fi
  if adb devices 2>/dev/null | grep -qE '[[:space:]]device$'; then
    log "adb reboot bootloader…"
    adb -d reboot bootloader
  else
    warn "Không thấy adb device. Tắt máy → giữ Volume xuống + Nguồn vào Fastboot, rồi Enter."
    pause
  fi
  fastboot_wait
}

flash_partitions() {
  local dir=$1
  assert_cheetah_fastboot
  log "Flash boot / dtbo / vendor_kernel_boot…"
  fastboot flash boot "$dir/boot.img"
  fastboot flash dtbo "$dir/dtbo.img"
  fastboot flash vendor_kernel_boot "$dir/vendor_kernel_boot.img"
  fastboot reboot bootloader
  fastboot_wait
  assert_cheetah_fastboot
  log "Flash Lineage Recovery (vendor_boot)…"
  fastboot flash vendor_boot "$dir/vendor_boot.img"
  ok "Đã flash recovery. Trên Fastboot: Volume chọn Recovery → Nguồn."
  warn "Phải thấy logo Lineage. Nếu không, dừng và chạy lại từ đầu mục recovery (wiki)."
  pause "Đã vào Lineage Recovery chưa? Enter để tiếp…"
}

sideload_zip() {
  local zip=$1
  local label=$2
  warn "Trên recovery: Apply update → Apply from ADB."
  pause "Đã chọn Apply from ADB? Enter để sideload ${label}…"
  log "adb sideload $(basename "$zip") …"
  set +e
  adb -d sideload "$zip"
  local rc=$?
  set -e
  # Wiki: dừng ~47% + "failed to read command: Success" vẫn có thể OK.
  if [[ $rc -ne 0 ]]; then
    warn "adb sideload thoát mã $rc — wiki ghi một số lỗi 'failed to read command' vẫn thành công."
    warn "Đọc chữ trên recovery. Nếu báo cài xong / hỏi reboot recovery cho add-on → tiếp."
    if ! confirm "Recovery báo sideload thành công?"; then
      die "Dừng theo lựa chọn của bạn. Xem $WIKI_INSTALL"
    fi
  else
    ok "Sideload ${label} xong (adb exit 0)."
  fi
}

main_flash() {
  local dir=$1
  require_imgs "$dir"
  local rom
  rom=$(find_rom_zip "$dir")
  ok "ROM: $rom"

  if [[ -n "$GAPPS_ZIP" ]]; then
    [[ -f "$GAPPS_ZIP" ]] || die "Không thấy GApps: $GAPPS_ZIP"
    ok "GApps: $GAPPS_ZIP"
  fi

  cat <<EOF

${BOLD}CẢNH BÁO${RESET}
  - Xóa toàn bộ dữ liệu nội bộ (Format data).
  - Chỉ cho ${DEVICE_NAME} (${DEVICE_CODENAME}).
  - Cần firmware stock ${BOLD}Android 16 mới nhất${RESET} trước khi flash.
    Không chắc → flash.android.com rồi quay lại. Wiki: ${WIKI_FIRMWARE}
  - ${BOLD}KHÔNG${RESET} chạy fastboot flashing lock khi đang ở LineageOS.
  - Wiki official thắng nếu lệch: ${WIKI_INSTALL}

EOF

  confirm "Bạn đã backup và muốn tiếp tục wipe + flash LineageOS?" || die "Đã hủy."

  need_cmd adb
  need_cmd fastboot

  reboot_to_bootloader
  flash_partitions "$dir"

  warn "Recovery → Factory reset → Format data / factory reset → về menu chính. Chưa reboot hệ thống."
  pause "Đã Format data xong? Enter…"

  sideload_zip "$rom" "LineageOS"

  if [[ -n "$GAPPS_ZIP" ]]; then
    warn "Recovery hỏi reboot recovery để cài add-on → chọn Yes."
    pause "Đã ở lại / vào lại recovery sẵn sideload GApps? Enter…"
    warn "GApps thường báo Signature verification failed → chọn Yes trên máy."
    sideload_zip "$GAPPS_ZIP" "GApps"
  else
    log "Không có --gapps. Bỏ qua MindTheGapps (có thể cài vanilla)."
  fi

  warn "Trên recovery: Back → Reboot system now. Boot đầu thường dưới 15 phút."
  ok "Xong phần máy tính. Không khóa bootloader."
  cat <<EOF

${BOLD}Sau khi boot:${RESET}
  - Updater app cho nightly; nâng major (22→23) phải sideload tay.
  - Device integrity trên wiki là quirk đã biết.
  - Magisk (nếu cần): patch init_boot — xem guide root catalog, không khóa bootloader.

EOF
}

parse_args() {
  while [[ $# -gt 0 ]]; do
    case "$1" in
      -d|--dir) WORK_DIR=$2; shift 2 ;;
      -g|--gapps) GAPPS_ZIP=$2; shift 2 ;;
      -r|--rom) ROM_ZIP_OVERRIDE=$2; shift 2 ;;
      --skip-download) SKIP_DOWNLOAD=1; shift ;;
      --download-only) ONLY_DOWNLOAD=1; shift ;;
      -y|--yes) ASSUME_YES=1; shift ;;
      -h|--help) usage; exit 0 ;;
      *) die "Không nhận option: $1 (thử --help)" ;;
    esac
  done
}

main() {
  parse_args "$@"
  if [[ -z "$WORK_DIR" ]]; then
    WORK_DIR="$(pwd)/lineage-cheetah-flash"
  fi
  mkdir -p "$WORK_DIR"
  WORK_DIR=$(cd "$WORK_DIR" && pwd)

  log "Thư mục làm việc: $WORK_DIR"
  log "Thiết bị đích: ${DEVICE_NAME} (${DEVICE_CODENAME})"

  if [[ "$SKIP_DOWNLOAD" -eq 0 && -z "$ROM_ZIP_OVERRIDE" ]]; then
    need_cmd python3
    download_latest "$WORK_DIR"
  elif [[ -n "$ROM_ZIP_OVERRIDE" && "$SKIP_DOWNLOAD" -eq 0 ]]; then
    require_imgs "$WORK_DIR"
    warn "Dùng --rom local; vẫn cần 4 file .img cùng build trong $WORK_DIR"
  else
    log "Bỏ qua tải (--skip-download)."
  fi

  if [[ "$ONLY_DOWNLOAD" -eq 1 ]]; then
    ok "Download-only xong. File trong $WORK_DIR"
    find_rom_zip "$WORK_DIR" >/dev/null
    require_imgs "$WORK_DIR"
    exit 0
  fi

  main_flash "$WORK_DIR"
}

main "$@"
