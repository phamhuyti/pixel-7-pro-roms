const CACHE_DB_NAME = "LineageBlobStore";
const CACHE_DB_VERSION = 1;
const STORE = "files";

/**
 * IndexedDB blob cache — cùng ý tưởng BlobStore trên grapheneos.org/install/web.
 */
export class BlobStore {
  private db: IDBDatabase | null = null;

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
    if (this.db) return;
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
  }

  async saveFile(name: string, blob: Blob): Promise<void> {
    await this.init();
    const tx = this.db!.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put({ name, blob });
    await this.wrapTx(tx);
  }

  async loadFile(name: string): Promise<Blob | null> {
    await this.init();
    try {
      const row = await this.wrapReq<{ name: string; blob: Blob } | undefined>(
        this.db!.transaction(STORE).objectStore(STORE).get(name),
      );
      return row?.blob ?? null;
    } catch {
      return null;
    }
  }

  async hasFile(name: string): Promise<boolean> {
    return (await this.loadFile(name)) !== null;
  }
}
