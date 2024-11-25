import type { ClassKey } from 'keycloakify/account/lib/kcClsx';
import type { Snippet } from 'svelte';
import type { Readable } from 'svelte/store';

export type TemplateProps<KcContext, I18n> = {
  kcContext: KcContext;
  i18n: Readable<I18n>;
  doUseDefaultCss: boolean;
  classes?: Partial<Record<ClassKey, string>>;
  children: Snippet;

  active: string;
};

export type { ClassKey };
