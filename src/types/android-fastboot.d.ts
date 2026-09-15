declare module "android-fastboot" {
  export class FastbootError extends Error {
    status: string;
    constructor(status: string, message: string);
  }

  export class UsbError extends Error {}
  export class TimeoutError extends Error {}

  export const USER_ACTION_MAP: Record<string, string>;

  export function setDebugLevel(level: number): void;
  export function configureZip(options: {
    workerScripts?: { inflate?: string[] };
  }): void;

  export class FastbootDevice {
    isConnected: boolean;
    connect(): Promise<void>;
    runCommand(command: string): Promise<{ text: string }>;
    getVariable(name: string): Promise<string | null>;
    reboot(
      target?: string,
      wait?: boolean,
      onReconnect?: () => void | Promise<void>,
    ): Promise<void>;
    flashBlob(
      partition: string,
      blob: Blob,
      onProgress?: (progress: number) => void,
    ): Promise<void>;
    flashFactoryZip(
      blob: Blob,
      wipe: boolean,
      onReconnect: () => void | Promise<void>,
      onProgress?: (action: string, item: string, progress: number) => void,
    ): Promise<void>;
  }
}
