import { useInsertScriptTags } from '@keycloakify/svelte/tools/useInsertScriptTags';
import { assert } from 'keycloakify/tools/assert';
import { waitForElementMountedOnDom } from 'keycloakify/tools/waitForElementMountedOnDom';
import { onMount } from 'svelte';
import { get, type Readable } from 'svelte/store';
import type { KcContext } from '../KcContext';

type KcContextLike = {
  url: {
    resourcesPath: string;
  };
  isUserIdentified: 'true' | 'false';
  challenge: string;
  userVerification: KcContext.WebauthnAuthenticate['userVerification'];
  rpId: string;
  createTimeout: number | string;
  enableWebAuthnConditionalUI?: boolean;
};

assert<keyof KcContextLike extends keyof KcContext.LoginPassword ? true : false>();
assert<KcContext.LoginPassword extends KcContextLike ? true : false>();

type I18nLike = {
  msgStr: (key: 'webauthn-unsupported-browser-text' | 'passkey-unsupported-browser-text') => string;
  isFetchingTranslations: boolean;
};

export function useScript(params: { webAuthnButtonId: string; kcContext: KcContextLike; i18n: Readable<I18nLike> }) {
  const { webAuthnButtonId, kcContext, i18n } = params;

  const { url, isUserIdentified, challenge, userVerification, rpId, createTimeout } = kcContext;

  // NOTE: In the React source this is called unconditionally, but there `useInsertScriptTags`
  // only registers the "mounted once" guard, it never inserts anything when the flag is off.
  // In Svelte that guard reloads the page as soon as a second LoginPassword mounts, so bailing out
  // early keeps the guard scoped to the pages that actually insert the script.
  if (kcContext.enableWebAuthnConditionalUI !== true) {
    return;
  }

  // NOTE: Must be called during component initialization, once. The `textContent` closure is
  // evaluated lazily, at insertion time, so it picks up the translations that are current then.
  const { insertScriptTags } = useInsertScriptTags({
    componentOrHookName: 'LoginPassword',
    scriptTags: [
      {
        type: 'module',
        textContent: () => {
          const { msgStr } = get(i18n);

          return `
                    import { authenticateByWebAuthn } from "${url.resourcesPath}/js/webauthnAuthenticate.js";
                    import { initAuthenticate } from "${url.resourcesPath}/js/passkeysConditionalAuth.js";

                    const authButton = document.getElementById("${webAuthnButtonId}");
                    const input = {
                        isUserIdentified : ${isUserIdentified},
                        challenge : ${JSON.stringify(challenge)},
                        userVerification : ${JSON.stringify(userVerification)},
                        rpId : ${JSON.stringify(rpId)},
                        createTimeout : ${JSON.stringify(createTimeout)}
                    };
                    authButton.addEventListener("click", () => {
                        authenticateByWebAuthn({
                            ...input,
                            errmsg : ${JSON.stringify(msgStr('webauthn-unsupported-browser-text'))}
                        });
                    }, { once: true });

                    initAuthenticate({
                        ...input,
                        errmsg : ${JSON.stringify(msgStr('passkey-unsupported-browser-text'))}
                    });
                `;
        },
      },
    ],
  });

  onMount(() => {
    const unsubscribe = i18n.subscribe(($i18n) => {
      const { isFetchingTranslations } = $i18n;

      if (isFetchingTranslations) {
        return;
      }

      (async () => {
        await waitForElementMountedOnDom({
          elementId: webAuthnButtonId,
        });

        insertScriptTags();
      })();
    });
    return () => unsubscribe();
  });
}
