"use client";

import {
  Adb,
  AdbDaemonTransport,
} from "@yume-chan/adb";
import AdbWebCredentialStore from "@yume-chan/adb-credential-web";
import {
  AdbDaemonWebUsbDevice,
  AdbDaemonWebUsbDeviceManager,
} from "@yume-chan/adb-daemon-webusb";

/** AOSP `sideload-host` chunk size (64 KiB). */
export const ADB_SIDELOAD_CHUNK_SIZE = 65536;

const DONE = "DONEDONE";
const FAIL = "FAILFAIL";

const credentialStore = new AdbWebCredentialStore("pixel-7-pro-roms-lineage");

export type SideloadProgress = (sent: number, total: number) => void;

function ascii(bytes: Uint8Array): string {
  return new TextDecoder().decode(bytes);
}

class ByteQueue {
  private chunks: Uint8Array[] = [];
  private length = 0;

  push(chunk: Uint8Array) {
    if (chunk.byteLength === 0) return;
    this.chunks.push(chunk);
    this.length += chunk.byteLength;
  }

  async read(
    reader: {
      read(): Promise<{ done: boolean; value?: Uint8Array }>;
    },
    n: number,
  ): Promise<Uint8Array | null> {
    while (this.length < n) {
      const { value, done } = await reader.read();
      if (done) {
        if (this.length === 0) return null;
        return this.take(this.length);
      }
      if (!value) continue;
      this.push(value);
    }
    return this.take(n);
  }

  private take(n: number): Uint8Array {
    const out = new Uint8Array(n);
    let offset = 0;
    while (offset < n) {
      const head = this.chunks[0];
      if (!head) break;
      const need = n - offset;
      if (head.byteLength <= need) {
        out.set(head, offset);
        offset += head.byteLength;
        this.chunks.shift();
      } else {
        out.set(head.subarray(0, need), offset);
        this.chunks[0] = head.subarray(need);
        offset += need;
      }
    }
    this.length -= offset;
    return out.subarray(0, offset);
  }
}

export async function connectAdbForSideload(): Promise<Adb> {
  const manager = AdbDaemonWebUsbDeviceManager.BROWSER;
  if (!manager) {
    throw new Error("Trình duyệt không hỗ trợ WebUSB ADB.");
  }
  const device = await manager.requestDevice();
  if (!device) {
    throw new Error("Bạn đã hủy chọn thiết bị ADB.");
  }
  let connection;
  try {
    connection = await device.connect();
  } catch (error) {
    if (error instanceof AdbDaemonWebUsbDevice.DeviceBusyError) {
      throw new Error(
        "USB đang bị chương trình khác chiếm (adb/fastboot trên máy tính). Chạy `adb kill-server` rồi thử lại.",
      );
    }
    throw error;
  }

  const transport = await AdbDaemonTransport.authenticate({
    serial: device.serial,
    connection,
    credentialStore,
  });

  const adb = new Adb(transport);
  const id = adb.banner.device ?? adb.banner.product;
  if (id && id !== "cheetah") {
    await adb.close().catch(() => undefined);
    throw new Error(
      `ADB báo máy '${id}', không phải cheetah. Dừng sideload.`,
    );
  }
  return adb;
}

/**
 * Sideload zip qua recovery `sideload-host` (cùng protocol `adb sideload`).
 * Wiki: dừng ~47% / mất kết nối sau khi recovery nhận xong vẫn có thể thành công.
 */
export async function sideloadZip(
  adb: Adb,
  data: Blob,
  onProgress: SideloadProgress = () => undefined,
): Promise<{ ok: boolean; note?: string }> {
  const socket = await adb.createSocket(
    `sideload-host:${data.size}:${ADB_SIDELOAD_CHUNK_SIZE}`,
  );
  const reader = socket.readable.getReader();
  const writer = socket.writable.getWriter();
  const buf = new ByteQueue();
  let transmitted = 0;

  try {
    while (true) {
      const msgBytes = await buf.read(reader, 8);
      if (msgBytes === null) {
        if (transmitted / data.size >= 0.4) {
          return {
            ok: true,
            note: "ADB cắt kết nối sau khi gửi phần lớn zip — wiki Lineage ghi hiện tượng ~47% vẫn có thể thành công. Đọc chữ trên recovery.",
          };
        }
        throw new Error("ADB đóng kết nối trước khi sideload xong.");
      }
      const msg = ascii(msgBytes).replace(/\0/g, "").trim();
      if (msg === DONE || msg.startsWith("DONE")) {
        onProgress(data.size, data.size);
        return { ok: true };
      }
      if (msg === FAIL || msg.startsWith("FAIL")) {
        throw new Error("Recovery báo FAIL khi sideload (file hỏng hoặc sai máy).");
      }

      const requestedBlock = Number.parseInt(msg, 10);
      if (!Number.isFinite(requestedBlock) || requestedBlock < 0) {
        throw new Error(`Sideload nhận lệnh lạ từ recovery: ${JSON.stringify(msg)}`);
      }
      const offset = requestedBlock * ADB_SIDELOAD_CHUNK_SIZE;
      if (offset > data.size) {
        throw new Error(
          `Recovery xin block ${requestedBlock} vượt kích thước zip (${data.size}).`,
        );
      }
      const end = Math.min(offset + ADB_SIDELOAD_CHUNK_SIZE, data.size);
      const chunk = new Uint8Array(await data.slice(offset, end).arrayBuffer());
      await writer.write(chunk);
      transmitted = end;
      onProgress(transmitted, data.size);
    }
  } catch (error) {
    if (
      transmitted / data.size >= 0.4 &&
      error instanceof Error &&
      /disconnect|closed|ended|network|transfer/i.test(error.message)
    ) {
      return {
        ok: true,
        note: `${error.message} — wiki ghi sideload vẫn có thể thành công. Đọc recovery.`,
      };
    }
    throw error;
  } finally {
    try {
      writer.releaseLock();
    } catch {
      /* ignore */
    }
    try {
      reader.releaseLock();
    } catch {
      /* ignore */
    }
    try {
      await socket.close();
    } catch {
      /* ignore */
    }
  }
}
