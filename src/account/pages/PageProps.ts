import { type ClassKey, type TemplateProps } from '@keycloakify/svelte/account/TemplateProps';
import type { Component } from 'svelte';
import type { Readable } from 'svelte/store';

export type PageProps<NarrowedKcContext, I18n> = {
  Template: Component<TemplateProps<NarrowedKcContext, I18n>>;
  kcContext: NarrowedKcContext;
  i18n: Readable<I18n>;
  doUseDefaultCss: boolean;
  classes?: Partial<Record<ClassKey, string>>;
};
