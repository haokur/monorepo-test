import { onMounted, onBeforeUnmount, ref, Ref } from 'vue';

export function useElectronEvent(
    event: RenderIpcActionNames,
    callback: (...args: any[]) => void,
    options?: { immediate?: boolean }
): [() => void, () => void, Ref<boolean, boolean>] {
    const active = ref(false);
    let stop: (() => void) | null = null;

    const start = () => {
        if (!active.value) {
            stop = $electron.on(event, callback);
            active.value = true;
        }
    };

    const stopListening = () => {
        if (active.value && stop) {
            stop();
            active.value = false;
        }
    };

    onMounted(() => {
        if (options?.immediate !== false) {
            start();
        }
    });

    onBeforeUnmount(() => {
        stopListening();
    });

    return [stopListening, start, active];
}
