import type { KcContext } from '@keycloakify/svelte/login/KcContext';
import { useInsertLinkTags } from '@keycloakify/svelte/tools/useInsertLinkTags';
import { useInsertScriptTags } from '@keycloakify/svelte/tools/useInsertScriptTags';
import { assert } from 'keycloakify/tools/assert';
import { onMount } from 'svelte';

export type KcContextLike = {
  url: {
    resourcesCommonPath: string;
    resourcesPath: string;
    ssoLoginInOtherTabsUrl: string;
  };
  scripts?: string[];
  authenticationSession?: {
    authSessionIdHash: string;
  };
};

assert<keyof KcContextLike extends keyof KcContext ? true : false>();
assert<KcContext extends KcContextLike ? true : false>();

export function useInitialize(params: { kcContext: KcContextLike; doUseDefaultCss: boolean }) {
  const { kcContext, doUseDefaultCss } = params;

  const { url, scripts } = kcContext;

  const { areAllStyleSheetsLoaded } = useInsertLinkTags({
    componentOrHookName: 'Template',
    hrefs: !doUseDefaultCss
      ? []
      : [
          `${url.resourcesCommonPath}/node_modules/@patternfly/patternfly/patternfly.min.css`,
          `${url.resourcesCommonPath}/node_modules/patternfly/dist/css/patternfly.min.css`,
          `${url.resourcesCommonPath}/node_modules/patternfly/dist/css/patternfly-additions.min.css`,
          `${url.resourcesCommonPath}/lib/pficon/pficon.css`,
          `${url.resourcesPath}/css/login.css`,
        ],
  });

  const { insertScriptTags } = useInsertScriptTags({
    componentOrHookName: 'Template',
    scriptTags: [
      // NOTE: The importmap is added in by the FTL script because it's too late to add it here.
      {
        type: 'module',
        src: `${url.resourcesPath}/js/menu-button-links.js`,
      },
      ...(scripts === undefined
        ? []
        : scripts.map((src) => ({
            type: 'text/javascript' as const,
            src,
          }))),
      {
        type: 'module',
        textContent: [
          `import { startSessionPolling, checkAuthSession } from "${url.resourcesPath}/js/authChecker.js";`,
          ``,
          `startSessionPolling("${kcContext.url.ssoLoginInOtherTabsUrl}");`,
          kcContext.authenticationSession === undefined
            ? ''
            : `checkAuthSession("${kcContext.authenticationSession.authSessionIdHash}");`,
        ].join('\n'),
      },
    ],
  });

  onMount(() => {
    const unsubscriber = areAllStyleSheetsLoaded.subscribe((isReadyToRender) => {
      if (isReadyToRender) {
        insertScriptTags();
      }
    });
    return () => unsubscriber();
  });

  return { isReadyToRender: areAllStyleSheetsLoaded };
}
