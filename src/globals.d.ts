declare global {
    interface Window {
        gameThread: Promise<T>;
    }
}

export {}