declare const $electron: {
    emit: (
        action: IpcActionNames,
        data?: any,
        handler?: (...args: any[]) => void
    ) => (() => void) | null;
    request: (action: IpcActionNames, args?: any) => Promise<any>;
    on: (action: RenderIpcActionNames, handler: (...args: any[]) => void) => (() => void) | null;
    broadcast: (action: RenderIpcActionNames, args?: any) => void;
    debug: (...args: any) => void;
    warn: (...args: any) => void;
    info: (...args: any) => void;
    error: (...args: any) => void;
};
