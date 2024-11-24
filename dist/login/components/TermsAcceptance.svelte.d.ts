import type { KcClsx } from 'keycloakify/login/lib/kcClsx';
import type { KcContext } from '../KcContext';
import type { I18n } from '../i18n';
declare const TermsAcceptance: import("svelte").Component<{
    i18n: I18n;
    kcClsx: KcClsx;
    messagesPerField: Pick<KcContext["messagesPerField"], "existsError" | "get">;
    areTermsAccepted: boolean;
    onAreTermsAcceptedValueChange: (areTermsAccepted: boolean) => void;
}, {}, "">;
type TermsAcceptance = ReturnType<typeof TermsAcceptance>;
export default TermsAcceptance;
