export function useConst(getValue) {
    const value = getValue();
    return value;
}
