import { type FormAction } from '../lib/useUserProfileForm';
import type { Attribute } from 'keycloakify/login/KcContext';
import type { EventDispatcher } from 'svelte';
import type { I18n } from '../i18n';
declare const AddRemoveButtonsMultiValuedAttribute: import("svelte").Component<{
    attribute: Attribute;
    values: string[];
    fieldIndex: number;
    dispatchFormAction: EventDispatcher<{
        formAction: Extract<FormAction, {
            action: "update";
        }>;
    }>;
    i18n: I18n;
}, {}, "">;
type AddRemoveButtonsMultiValuedAttribute = ReturnType<typeof AddRemoveButtonsMultiValuedAttribute>;
export default AddRemoveButtonsMultiValuedAttribute;
