import { useState } from '@keycloakify/svelte/tools/useState';
import {
  type LanguageTag as LanguageTag_defaultSet,
  type MessageKey as MessageKey_defaultSet,
} from 'keycloakify/login/i18n/messages_defaultSet/types';
import type { GenericI18n_noJsx } from 'keycloakify/login/i18n/noJsx/GenericI18n_noJsx';
import { createGetI18n, type KcContextLike } from 'keycloakify/login/i18n/noJsx/getI18n';
import { createRawSnippet, onMount, type Snippet } from 'svelte';
import type { Readable } from 'svelte/store';
import { Reflect } from 'tsafe/Reflect';
import type { GenericI18n_svelte } from './i18n';

export type ReturnTypeOfCreateUseI18n<
  MessageKey_themeDefined extends string,
  LanguageTag_notInDefaultSet extends string,
> = {
  useI18n: (params: { kcContext: KcContextLike }) => {
    i18n: Readable<
      GenericI18n_svelte<
        MessageKey_defaultSet | MessageKey_themeDefined,
        LanguageTag_defaultSet | LanguageTag_notInDefaultSet
      >
    >;
  };
  ofTypeI18n: GenericI18n_svelte<
    MessageKey_defaultSet | MessageKey_themeDefined,
    LanguageTag_defaultSet | LanguageTag_notInDefaultSet
  >;
};

export type { KcContextLike };

export function createUseI18n<
  ThemeName extends string = string,
  MessageKey_themeDefined extends string = never,
  LanguageTag_notInDefaultSet extends string = never,
>(params: {
  extraLanguageTranslations: {
    [languageTag in LanguageTag_notInDefaultSet]: {
      label: string;
      getMessages: () => Promise<{ default: Record<MessageKey_defaultSet, string> }>;
    };
  };
  messagesByLanguageTag_themeDefined: Partial<{
    [languageTag in LanguageTag_defaultSet | LanguageTag_notInDefaultSet]: {
      [key in MessageKey_themeDefined]: string | Record<ThemeName, string>;
    };
  }>;
}): ReturnTypeOfCreateUseI18n<MessageKey_themeDefined, LanguageTag_notInDefaultSet> {
  const { extraLanguageTranslations, messagesByLanguageTag_themeDefined } = params;

  type LanguageTag = LanguageTag_defaultSet | LanguageTag_notInDefaultSet;

  type MessageKey = MessageKey_defaultSet | MessageKey_themeDefined;
  type I18n = GenericI18n_svelte<MessageKey, LanguageTag>;
  type Result = { i18n: Readable<I18n> };

  const { withSvelte } = (() => {
    const cache = new WeakMap<
      GenericI18n_noJsx<MessageKey, LanguageTag>,
      GenericI18n_svelte<MessageKey, LanguageTag>
    >();

    function renderHtmlString(params: { htmlString: string; msgKey: string }): Snippet {
      const { htmlString, msgKey } = params;
      return createRawSnippet(() => ({
        render: () => `<div data-kc-msg="${msgKey}">${htmlString}</div>`,
      }));
    }

    function withSvelte(i18n_noJsx: GenericI18n_noJsx<MessageKey, LanguageTag>): I18n {
      use_cache: {
        const i18n = cache.get(i18n_noJsx);

        if (i18n === undefined) {
          break use_cache;
        }

        return i18n;
      }

      const i18n: I18n = {
        ...i18n_noJsx,
        msg: (msgKey, ...args) => renderHtmlString({ htmlString: i18n_noJsx.msgStr(msgKey, ...args), msgKey }),
        advancedMsg: (msgKey, ...args) =>
          renderHtmlString({ htmlString: i18n_noJsx.advancedMsgStr(msgKey, ...args), msgKey }),
      };

      cache.set(i18n_noJsx, i18n);

      return i18n;
    }

    return { withSvelte };
  })();

  add_style: {
    const attributeName = 'data-kc-i18n';

    // Check if already exists in head
    if (document.querySelector(`style[${attributeName}]`) !== null) {
      break add_style;
    }

    const styleElement = document.createElement('style');
    styleElement.attributes.setNamedItem(document.createAttribute(attributeName));
    styleElement.textContent = `[data-kc-msg] { display: inline-block; }`;
    document.head.prepend(styleElement);
  }

  const { getI18n } = createGetI18n({ extraLanguageTranslations, messagesByLanguageTag_themeDefined });

  function useI18n(params: { kcContext: KcContextLike }): Result {
    const { kcContext } = params;

    const { i18n, prI18n_currentLanguage } = getI18n({ kcContext });

    const [i18n_toReturn, setI18n_toReturn] = useState<I18n>(withSvelte(i18n));

    onMount(() => {
      let isActive = true;

      prI18n_currentLanguage?.then((i18n) => {
        if (!isActive) {
          return;
        }

        setI18n_toReturn(withSvelte(i18n));
      });

      return () => {
        isActive = false;
      };
    });

    return { i18n: i18n_toReturn };
  }

  return { useI18n, ofTypeI18n: Reflect<I18n>() };
}
