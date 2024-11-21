import { derived, writable } from 'svelte/store';
export const useState = (initialState) => {
    const state = writable(initialState);
    const dispatch = (newState) => state.set(newState);
    const readableState = derived(state, ($state) => $state);
    return [readableState, dispatch];
};
