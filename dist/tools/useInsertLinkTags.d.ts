/**
 * NOTE: The component that use this hook can only be mounded once!
 * And can't rerender with different hrefs.
 * If it's mounted again the page will be reloaded.
 * This simulates the behavior of a server rendered page that imports css stylesheet in the head.
 */
export declare function useInsertLinkTags(params: {
    componentOrHookName: string;
    hrefs: string[];
}): {
    areAllStyleSheetsLoaded: import("svelte/store").Readable<boolean>;
};
