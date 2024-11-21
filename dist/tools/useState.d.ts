import { type Readable } from 'svelte/store';
export declare const useState: <T>(initialState: T) => [Readable<T>, (newState: T) => void];
