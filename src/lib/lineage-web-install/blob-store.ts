const CACHE_DB_NAME = "LineageBlobStore";
const CACHE_DB_VERSION = 1;
const STORE = "files";

/**
 * IndexedDB blob cache — cùng ý tưởng BlobStore trên grapheneos.org/install/web.
 * File picker File objects stay in a memory map for the tab even if IDB quota
 * cannot hold the ~1.4 GiB ROM zip.
 */
export class BlobStore {
  private db: IDBDatabase | null = null;
  private idbFailed = false;
  private memory = new Map<string, Blob>();

  private wrapReq<T>(request: IDBRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error ?? new Error("IDB error"));
    });
  }

  private wrapTx(tx: IDBTransaction): Promise<void> {
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error ?? new Error("IDB tx error"));
      tx.onabort = () => reject(tx.error ?? new Error("IDB tx abort"));
    });
  }

  async init(): Promise<void> {
    if (this.db || this.idbFailed) return;
    try {
      this.db = await new Promise((resolve, reject) => {
        const req = indexedDB.open(CACHE_DB_NAME, CACHE_DB_VERSION);
        req.onupgradeneeded = () => {
          const db = req.result;
          if (!db.objectStoreNames.contains(STORE)) {
            db.createObjectStore(STORE, { keyPath: "name" });
          }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error ?? new Error("IDB open failed"));
      });
    } catch {
      this.idbFailed = true;
      this.db = null;
    }
  }

  /**
   * Keep the blob for this tab. Persist to IndexedDB when possible.
   * @returns false when only memory has the file (quota / private mode).
   */
  async saveFile(name: string, blob: Blob): Promise<boolean> {
    this.memory.set(name, blob);
    await this.init();
    if (!this.db) return false;
    try {
      const tx = this.db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).put({ name, blob });
      await this.wrapTx(tx);
      return true;
    } catch {
      return false;
    }
  }

  async loadFile(name: string): Promise<Blob | null> {
    const fromMem = this.memory.get(name);
    if (fromMem) return fromMem;
    await this.init();
    if (!this.db) return null;
    try {
      const row = await this.wrapReq<{ name: string; blob: Blob } | undefined>(
        this.db.transaction(STORE).objectStore(STORE).get(name),
      );
      const blob = row?.blob ?? null;
      if (blob) this.memory.set(name, blob);
      return blob;
    } catch {
      return null;
    }
  }

  async hasFile(name: string): Promise<boolean> {
    if (this.memory.has(name)) return true;
    await this.init();
    if (!this.db) return false;
    try {
      const store = this.db.transaction(STORE).objectStore(STORE);
      if (typeof store.getKey === "function") {
        const key = await this.wrapReq(store.getKey(name));
        return key !== undefined;
      }
    } catch {
      // fall through to loadFile
    }
    return (await this.loadFile(name)) !== null;
  }
}
