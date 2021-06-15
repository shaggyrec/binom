export const currentScript = (): Node => (
    document.currentScript || ((): Node => {
        const scripts = document.getElementsByTagName('script');
        return scripts[scripts.length - 1];
    })()
);