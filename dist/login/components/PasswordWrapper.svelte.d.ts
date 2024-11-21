type $$ComponentProps = {
    kcClsx: KcClsx;
    i18n: I18n;
    passwordInputId: string;
    children: Snippet;
};
import type { KcClsx } from 'keycloakify/login/lib/kcClsx';
import type { Snippet } from 'svelte';
import type { I18n } from '../i18n';
declare const PasswordWrapper: import("svelte").Component<$$ComponentProps, {}, "">;
type PasswordWrapper = ReturnType<typeof PasswordWrapper>;
export default PasswordWrapper;
