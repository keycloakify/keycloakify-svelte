import { useState } from '../../tools/useState';
import {} from 'keycloakify/login/i18n/messages_defaultSet/types';
import { createGetI18n } from 'keycloakify/login/i18n/noJsx/getI18n';
import { createRawSnippet, onMount } from 'svelte';
import { Reflect } from 'tsafe/Reflect';
export function createUseI18n(params) {
    const { extraLanguageTranslations, messagesByLanguageTag_themeDefined } = params;
    const { withSvelte } = (() => {
        const cache = new WeakMap();
        function renderHtmlString(params) {
            const { htmlString, msgKey } = params;
            return createRawSnippet(() => ({
                render: () => `<div data-kc-msg="${msgKey}">${htmlString}</div>`,
            }));
        }
        function withSvelte(i18n_noJsx) {
            use_cache: {
                const i18n = cache.get(i18n_noJsx);
                if (i18n === undefined) {
                    break use_cache;
                }
                return i18n;
            }
            const i18n = {
                ...i18n_noJsx,
                msg: (msgKey, ...args) => renderHtmlString({ htmlString: i18n_noJsx.msgStr(msgKey, ...args), msgKey }),
                advancedMsg: (msgKey, ...args) => renderHtmlString({ htmlString: i18n_noJsx.advancedMsgStr(msgKey, ...args), msgKey }),
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
    function useI18n(params) {
        const { kcContext } = params;
        const { i18n, prI18n_currentLanguage } = getI18n({ kcContext });
        const [i18n_toReturn, setI18n_toReturn] = useState(withSvelte(i18n));
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
    return { useI18n, ofTypeI18n: Reflect() };
}
