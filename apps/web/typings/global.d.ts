declare const $electron: {
    emit: (action: string, data: any, handler: (...args: any[]) => void) => (() => void) | null;
    on: (action: string, handler: (...args: any[]) => void) => (() => void) | null;
    request: (action: string, args?: any) => Promise<any>;
    broadcast: (action: string, args?: any) => void;
    debug: (...args: any) => void;
    warn: (...args: any) => void;
    info: (...args: any) => void;
    error: (...args: any) => void;
};
