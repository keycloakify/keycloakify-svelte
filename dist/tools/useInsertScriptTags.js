/* eslint-disable @typescript-eslint/no-namespace */
import { onMount } from 'svelte';
import { assert } from 'tsafe/assert';
const alreadyMountedComponentOrHookNames = new Set();
/**
 * NOTE: The component that use this hook can only be mounded once!
 * And can't rerender with different scriptTags.
 * If it's mounted again the page will be reloaded.
 * This simulates the behavior of a server rendered page that imports javascript in the head.
 *
 * The returned function is supposed to be called in a useEffect and
 * will not download the scripts multiple times event if called more than once (react strict mode).
 *
 */
export function useInsertScriptTags(params) {
    const { scriptTags, componentOrHookName } = params;
    onMount(() => {
        const isAlreadyMounted = alreadyMountedComponentOrHookNames.has(componentOrHookName);
        if (isAlreadyMounted) {
            reload: {
                if (new URL(window.location.href).searchParams.get('viewMode') === 'docs') {
                    // NOTE: Special case for Storybook, we want to avoid infinite reload loop.
                    break reload;
                }
                window.location.reload();
            }
            return;
        }
        alreadyMountedComponentOrHookNames.add(componentOrHookName);
    });
    let areScriptsInserted = false;
    const insertScriptTags = () => {
        if (areScriptsInserted) {
            return;
        }
        scriptTags.forEach((scriptTag) => {
            // NOTE: Avoid loading same script twice. (Like jQuery for example)
            {
                const scripts = document.getElementsByTagName('script');
                for (let i = 0; i < scripts.length; i++) {
                    const script = scripts[i];
                    if ('textContent' in scriptTag) {
                        const textContent = typeof scriptTag.textContent === 'function' ? scriptTag.textContent() : scriptTag.textContent;
                        if (script.textContent === textContent) {
                            return;
                        }
                        continue;
                    }
                    if ('src' in scriptTag) {
                        if (script.getAttribute('src') === scriptTag.src) {
                            return;
                        }
                        continue;
                    }
                    assert(false);
                }
            }
            const htmlElement = document.createElement('script');
            htmlElement.type = scriptTag.type;
            (() => {
                if ('textContent' in scriptTag) {
                    const textContent = typeof scriptTag.textContent === 'function' ? scriptTag.textContent() : scriptTag.textContent;
                    htmlElement.textContent = textContent;
                    return;
                }
                if ('src' in scriptTag) {
                    htmlElement.src = scriptTag.src;
                    return;
                }
                assert(false);
            })();
            document.head.appendChild(htmlElement);
        });
        areScriptsInserted = true;
    };
    return { insertScriptTags };
}
