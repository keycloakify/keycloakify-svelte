type FieldErrorProps = {
    attribute: Attribute;
    displayableErrors: FormFieldError[];
    fieldIndex: number | undefined;
    kcClsx: KcClsx;
};
import type { FormFieldError } from '../lib/useUserProfileForm';
import type { Attribute } from 'keycloakify/login/KcContext';
import type { KcClsx } from 'keycloakify/login/lib/kcClsx';
declare const FieldErrors: import("svelte").Component<FieldErrorProps, {}, "">;
type FieldErrors = ReturnType<typeof FieldErrors>;
export default FieldErrors;
