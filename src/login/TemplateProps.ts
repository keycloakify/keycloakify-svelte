import type { ClassKey } from 'keycloakify/login/lib/kcClsx';
import type { Snippet } from 'svelte';

export type TemplateProps<KcContext, I18n> = {
  kcContext: KcContext;
  i18n: I18n;
  doUseDefaultCss: boolean;
  classes?: Partial<Record<ClassKey, string>>;
  children: Snippet;

  displayInfo?: boolean;
  displayMessage?: boolean;
  displayRequiredFields?: boolean;
  showAnotherWayIfPresent?: boolean;
  headerNode: Snippet;
  socialProvidersNode?: Snippet | null;
  infoNode?: Snippet | null;
  documentTitle?: string;
  bodyClassName?: string;
};

export type { ClassKey };