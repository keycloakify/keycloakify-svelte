type $$ComponentProps = {
    kcClsx: KcClsx;
    i18n: I18n;
    passwordInputId: string;
    children: Component;
};
import type { KcClsx } from 'keycloakify/login/lib/kcClsx';
import type { Component } from 'svelte';
import type { I18n } from '../i18n';
declare const PasswordWrapper: Component<$$ComponentProps, {}, "">;
type PasswordWrapper = ReturnType<typeof PasswordWrapper>;
export default PasswordWrapper;
