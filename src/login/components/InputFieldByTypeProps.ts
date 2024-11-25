import type { FormAction, FormFieldError } from '@keycloakify/svelte/login/lib/useUserProfileForm';
import type { Attribute } from 'keycloakify/login/KcContext';
import type { KcClsx } from 'keycloakify/login/lib/kcClsx';
import type { EventDispatcher } from 'svelte';
import type { I18n } from '../i18n';
import type { Readable } from 'svelte/store';

export type InputFieldByTypeProps = {
  attribute: Attribute;
  valueOrValues: string | string[];
  displayableErrors: FormFieldError[];
  dispatchFormAction: EventDispatcher<{ formAction: FormAction }>;
  i18n: Readable<I18n>;
  kcClsx: KcClsx;
};
