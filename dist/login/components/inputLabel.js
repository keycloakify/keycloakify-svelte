import { createRawSnippet } from 'svelte';
export const inputLabel = (i18n, attribute, option) => {
    const { advancedMsg } = i18n;
    if (attribute.annotations.inputOptionLabels !== undefined) {
        const { inputOptionLabels } = attribute.annotations;
        return advancedMsg(inputOptionLabels[option] ?? option);
    }
    if (attribute.annotations.inputOptionLabelsI18nPrefix !== undefined) {
        return advancedMsg(`${attribute.annotations.inputOptionLabelsI18nPrefix}.${option}`);
    }
    return createRawSnippet(() => ({ render: () => option }));
};
