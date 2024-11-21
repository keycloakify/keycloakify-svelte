import type { ClassKey } from 'keycloakify/login/lib/kcClsx';
import type { Component } from 'svelte';
export type TemplateProps<KcContext, I18n> = {
    kcContext: KcContext;
    i18n: I18n;
    doUseDefaultCss: boolean;
    classes?: Partial<Record<ClassKey, string>>;
    children: Component;
    displayInfo?: boolean;
    displayMessage?: boolean;
    displayRequiredFields?: boolean;
    showAnotherWayIfPresent?: boolean;
    headerNode: Component;
    socialProvidersNode?: Component | null;
    infoNode?: Component | null;
    documentTitle?: string;
    bodyClassName?: string;
};
export type { ClassKey };
