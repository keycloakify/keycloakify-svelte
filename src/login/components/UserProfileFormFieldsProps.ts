/* eslint-disable @typescript-eslint/no-explicit-any */
import { type FormAction, type FormFieldError } from '@keycloakify/svelte/login/lib/useUserProfileForm';
import type { Attribute } from 'keycloakify/login/KcContext';
import type { KcClsx } from 'keycloakify/login/lib/kcClsx';
import type { EventDispatcher, Snippet } from 'svelte';
import type { Readable } from 'svelte/store';

export type UserProfileFormFieldsProps<KcContext = any, I18n = any> = {
  kcContext: Extract<KcContext, { profile: unknown }>;
  i18n: Readable<I18n>;
  kcClsx: KcClsx;
  onIsFormSubmittableValueChange: (isFormSubmittable: boolean) => void;
  doMakeUserConfirmPassword: boolean;
  beforeField?: Snippet<[BeforeAfterFieldProps<I18n>]> | null;
  afterField?: Snippet<[BeforeAfterFieldProps<I18n>]> | null;
};

type BeforeAfterFieldProps<I18n> = {
  attribute: Attribute;
  dispatchFormAction: EventDispatcher<{ formAction: FormAction }>;
  displayableErrors: FormFieldError[];
  valueOrValues: string | string[];
  kcClsx: KcClsx;
  i18n: Readable<I18n>;
};
