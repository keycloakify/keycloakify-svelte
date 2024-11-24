type GroupLabelProps = {
    attribute: Attribute;
    groupNameRef: {
        current: string;
    };
    i18n: I18n;
    kcClsx: KcClsx;
};
import type { Attribute } from 'keycloakify/login/KcContext';
import type { KcClsx } from 'keycloakify/login/lib/kcClsx';
import type { I18n } from '../i18n';
declare const GroupLabel: import("svelte").Component<GroupLabelProps, {}, "">;
type GroupLabel = ReturnType<typeof GroupLabel>;
export default GroupLabel;
