<script lang="ts">
  import FieldErrors from './FieldErrors.svelte';
  import GroupLabel from './GroupLabel.svelte';
  import InputFieldByType from './InputFieldByType.svelte';
  import { useUserProfileForm } from '../lib/useUserProfileForm';
  import type { UserProfileFormFieldsProps } from './UserProfileFormFieldsProps';
  import { onMount } from 'svelte';
  import type { I18n } from '../i18n';
  import type { KcContext } from '../KcContext';

  const props: UserProfileFormFieldsProps<KcContext, I18n> = $props();
  const {
    kcContext,
    i18n,
    kcClsx,
    onIsFormSubmittableValueChange,
    doMakeUserConfirmPassword,
    beforeField,
    afterField,
  } = props;

  const { advancedMsg } = i18n;

  const { formState, dispatchFormAction } = useUserProfileForm({
    kcContext,
    i18n,
    doMakeUserConfirmPassword,
  });
  onMount(() => {
    const unsubscribe = formState.subscribe(({ isFormSubmittable }) => {
      onIsFormSubmittableValueChange(isFormSubmittable);
    });
    return () => unsubscribe();
  });

  const groupNameRef = { current: '' };
</script>

{#each $formState.formFieldStates as formFieldState}
  {@const { attribute, displayableErrors, valueOrValues } = formFieldState}
  <GroupLabel
    {attribute}
    {groupNameRef}
    {i18n}
    {kcClsx}
  />
  {#if beforeField}
    {@render beforeField({ attribute, dispatchFormAction, displayableErrors, valueOrValues, kcClsx, i18n })}
  {/if}
  <div
    class={kcClsx('kcFormGroupClass')}
    style:display={attribute.name === 'password-confirm' && !doMakeUserConfirmPassword ? 'none' : undefined}
  >
    <div class={kcClsx('kcLabelWrapperClass')}>
      <label
        for={attribute.name}
        class={kcClsx('kcLabelClass')}
      >
        {@render advancedMsg(attribute.displayName ?? '')()}
      </label>
      {#if attribute.required}
        *{/if}
    </div>
    <div class={kcClsx('kcInputWrapperClass')}>
      {#if attribute.annotations.inputHelperTextBefore !== undefined}
        <div
          class={kcClsx('kcInputHelperTextBeforeClass')}
          id={`form-help-text-before-${attribute.name}`}
          aria-live="polite"
        >
          {@render advancedMsg(attribute.annotations.inputHelperTextBefore)()}
        </div>
      {/if}
      <InputFieldByType
        {attribute}
        {valueOrValues}
        {displayableErrors}
        {dispatchFormAction}
        {kcClsx}
        {i18n}
      />
      <FieldErrors
        {attribute}
        {displayableErrors}
        {kcClsx}
        fieldIndex={undefined}
      />
      {#if attribute.annotations.inputHelperTextAfter !== undefined}
        <div
          class={kcClsx('kcInputHelperTextAfterClass')}
          id={`form-help-text-after-${attribute.name}`}
          aria-live="polite"
        >
          {@render advancedMsg(attribute.annotations.inputHelperTextAfter)()}
        </div>
      {/if}

      {#if afterField}
        {@render afterField({ attribute, dispatchFormAction, displayableErrors, valueOrValues, kcClsx, i18n })}
      {/if}
      <!-- NOTE: Downloading of html5DataAnnotations scripts is done in the useUserProfileForm hook -->
    </div>
  </div>
{/each}
