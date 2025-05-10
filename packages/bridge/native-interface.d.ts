export interface INativeModule {
    hello(): string;
    sum(x: number, y: number): number;
    log_message(module:"main"|"render",content: string): void;
    get_clipboard_file_paths(): string[];
}
