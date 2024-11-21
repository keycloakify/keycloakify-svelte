import { type Readable } from 'svelte/store';
export declare const useReducer: <T, R = void>(reducer: (state: T, action: R) => T, initialState: T) => [Readable<T>, (action: R) => void];
