declare const $electron: {
    emit: (action: string, args?: any) => void;
    on: (action: string, handler: (...args: any[]) => void) => void;
    request: (action: string, args?: any) => Promise<any>;
};
