import { useInsertScriptTags } from '#keycloakify-svelte/tools/useInsertScriptTags.js';
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
};

assert<keyof KcContextLike extends keyof KcContext.LoginPasskeysConditionalAuthenticate ? true : false>();
assert<KcContext.LoginPasskeysConditionalAuthenticate extends KcContextLike ? true : false>();

type I18nLike = {
  msgStr: (key: 'webauthn-unsupported-browser-text' | 'passkey-unsupported-browser-text') => string;
  isFetchingTranslations: boolean;
};

export function useScript(params: { authButtonId: string; kcContext: KcContextLike; i18n: Readable<I18nLike> }) {
  const { authButtonId, kcContext, i18n } = params;

  const { url, isUserIdentified, challenge, userVerification, rpId, createTimeout } = kcContext;

  onMount(() => {
    let hasInserted = false;

    const unsubscribe = i18n.subscribe(($i18n) => {
      if (hasInserted) {
        return;
      }

      const { msgStr, isFetchingTranslations } = $i18n;

      if (isFetchingTranslations) {
        return;
      }

      const { insertScriptTags } = useInsertScriptTags({
        componentOrHookName: 'LoginPasskeysConditionalAuthenticate',
        scriptTags: [
          {
            type: 'module',
            textContent: () => `
                    import { authenticateByWebAuthn } from "${url.resourcesPath}/js/webauthnAuthenticate.js";
                    import { initAuthenticate } from "${url.resourcesPath}/js/passkeysConditionalAuth.js";

                    const authButton = document.getElementById("${authButtonId}");
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
                    }, available => {
                        const loginForm = document.getElementById("kc-form-login");
                        const passkeyButton = document.getElementById("kc-form-passkey-button");

                        if (!loginForm || !passkeyButton) {
                            return;
                        }

                        if (available) {
                            loginForm.style.display = "block";
                        } else {
                            passkeyButton.style.display = "block";
                        }
                    });
                `,
          },
        ],
      });

      hasInserted = true;

      (async () => {
        await waitForElementMountedOnDom({
          elementId: authButtonId,
        });

        insertScriptTags();
      })();
    });
    return () => unsubscribe();
  });
}
