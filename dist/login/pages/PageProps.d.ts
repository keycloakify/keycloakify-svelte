import { type ClassKey, type TemplateProps } from '../TemplateProps';
import type { Component } from 'svelte';
export type PageProps<NarrowedKcContext, I18n> = {
    Template: Component<TemplateProps<NarrowedKcContext, I18n>>;
    kcContext: NarrowedKcContext;
    i18n: I18n;
    doUseDefaultCss: boolean;
    classes?: Partial<Record<ClassKey, string>>;
};
