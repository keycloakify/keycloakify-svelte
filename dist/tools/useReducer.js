import { derived, writable } from 'svelte/store';
export const useReducer = (reducer, initialState) => {
    const state = writable(initialState);
    const dispatch = (action) => state.update((currentState) => reducer(currentState, action));
    const readableState = derived(state, ($state) => $state);
    return [readableState, dispatch];
};
