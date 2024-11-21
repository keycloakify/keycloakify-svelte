export type ScriptTag = ScriptTag.TextContent | ScriptTag.Src;
export declare namespace ScriptTag {
    type Common = {
        type: 'text/javascript' | 'module';
    };
    export type TextContent = Common & {
        textContent: string | (() => string);
    };
    export type Src = Common & {
        src: string;
    };
    export {};
}
/**
 * NOTE: The component that use this hook can only be mounded once!
 * And can't rerender with different scriptTags.
 * If it's mounted again the page will be reloaded.
 * This simulates the behavior of a server rendered page that imports javascript in the head.
 *
 * The returned function is supposed to be called in a useEffect and
 * will not download the scripts multiple times event if called more than once (react strict mode).
 *
 */
export declare function useInsertScriptTags(params: {
    componentOrHookName: string;
    scriptTags: ScriptTag[];
}): {
    insertScriptTags: () => void;
};
