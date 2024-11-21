export type KcContextLike = {
    url: {
        resourcesCommonPath: string;
        resourcesPath: string;
        ssoLoginInOtherTabsUrl: string;
    };
    scripts?: string[];
};
export declare function useInitialize(params: {
    kcContext: KcContextLike;
    doUseDefaultCss: boolean;
}): {
    isReadyToRender: import("svelte/store").Readable<boolean>;
};
