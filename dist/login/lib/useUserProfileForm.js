/* eslint-disable @typescript-eslint/no-namespace */
import { useState } from '../../tools/useState';
import * as reactlessApi from 'keycloakify/login/lib/getUserProfileApi';
import { createRawSnippet, onMount } from 'svelte';
import { derived } from 'svelte/store';
import { assert } from 'tsafe/assert';
export { getButtonToDisplayForMultivaluedAttributeField } from 'keycloakify/login/lib/getUserProfileApi';
{
    assert();
}
{
    assert();
}
{
    assert();
}
{
    assert();
}
{
    assert();
}
{
    assert();
}
export function useUserProfileForm(params) {
    const { doMakeUserConfirmPassword, i18n, kcContext } = params;
    const api = reactlessApi.getUserProfileApi({
        kcContext,
        doMakeUserConfirmPassword,
    });
    const [formState_reactless, setFormState_reactless] = useState(api.getFormState());
    onMount(() => {
        const { unsubscribe } = api.subscribeToFormState(() => {
            setFormState_reactless(api.getFormState());
        });
        return () => unsubscribe();
    });
    const { advancedMsg, advancedMsgStr } = i18n;
    const formState = derived(formState_reactless, ($formState) => ({
        isFormSubmittable: $formState.isFormSubmittable,
        formFieldStates: $formState.formFieldStates.map((formFieldState_reactless) => ({
            attribute: formFieldState_reactless.attribute,
            valueOrValues: formFieldState_reactless.valueOrValues,
            displayableErrors: formFieldState_reactless.displayableErrors.map((formFieldError_reactless) => ({
                errorMessage: createRawSnippet(() => ({
                    render: () => `${advancedMsg(...formFieldError_reactless.advancedMsgArgs)}`,
                })),
                errorMessageStr: advancedMsgStr(...formFieldError_reactless.advancedMsgArgs),
                source: formFieldError_reactless.source,
                fieldIndex: formFieldError_reactless.fieldIndex,
            })),
        })),
    }));
    return {
        formState,
        dispatchFormAction: ((_, { ...args }) => {
            if (args) {
                api.dispatchFormAction(args);
                return true;
            }
            return false;
        }),
    };
}
