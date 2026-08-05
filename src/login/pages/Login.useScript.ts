import { useInsertScriptTags } from '@keycloakify/svelte/tools/useInsertScriptTags';
import { assert } from 'keycloakify/tools/assert';
import { waitForElementMountedOnDom } from 'keycloakify/tools/waitForElementMountedOnDom';
import { onMount } from 'svelte';
import type { Readable } from 'svelte/store';
import type { KcContext } from '../KcContext';

type KcContextLike = {
  url: {
    resourcesPath: string;
  };
  isUserIdentified: boolean | 'true' | 'false';
  challenge: string;
  userVerification: string;
  rpId: string;
  createTimeout: number | string;
  enableWebAuthnConditionalUI?: boolean;
};

assert<keyof KcContextLike extends keyof KcContext.Login ? true : false>();
assert<KcContext.Login extends KcContextLike ? true : false>();

type I18nLike = {
  msgStr: (key: 'webauthn-unsupported-browser-text' | 'passkey-unsupported-browser-text') => string;
  isFetchingTranslations: boolean;
};

export function useScript(params: { webAuthnButtonId: string; kcContext: KcContextLike; i18n: Readable<I18nLike> }) {
  const { webAuthnButtonId, kcContext, i18n } = params;

  const { url, isUserIdentified, challenge, userVerification, rpId, createTimeout } = kcContext;

  onMount(() => {
    const unsubscribe = i18n.subscribe(($i18n) => {
      const { msgStr, isFetchingTranslations } = $i18n;

      const { insertScriptTags } = useInsertScriptTags({
        componentOrHookName: 'Login',
        scriptTags: [
          {
            type: 'module',
            textContent: () => `
                    import { authenticateByWebAuthn } from "${url.resourcesPath}/js/webauthnAuthenticate.js";
                    import { initAuthenticate } from "${url.resourcesPath}/js/passkeysConditionalAuth.js";

                    const authButton = document.getElementById("${webAuthnButtonId}");
                    const input = {
                        isUserIdentified : ${isUserIdentified},
                        challenge : ${JSON.stringify(challenge)},
                        userVerification : ${JSON.stringify(userVerification)},
                        rpId : ${JSON.stringify(rpId)},
                        createTimeout : ${createTimeout}
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
                `,
          },
        ],
      });

      if (isFetchingTranslations || kcContext.enableWebAuthnConditionalUI !== true) {
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
