export interface INativeModule {
    hello(): string;
    sum(x: number, y: number): number;
    log_message(content: string): void;
}
