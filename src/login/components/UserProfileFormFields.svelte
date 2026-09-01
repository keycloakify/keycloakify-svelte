<script lang="ts">
  import FieldErrors from '@keycloakify/svelte/login/components/FieldErrors.svelte';
  import GroupLabel from '@keycloakify/svelte/login/components/GroupLabel.svelte';
  import InputFieldByType from '@keycloakify/svelte/login/components/InputFieldByType.svelte';
  import type { UserProfileFormFieldsProps } from '@keycloakify/svelte/login/components/UserProfileFormFieldsProps';
  import { useUserProfileForm } from '@keycloakify/svelte/login/lib/useUserProfileForm';
  import { onMount, untrack } from 'svelte';
  import { derived } from 'svelte/store';
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
  } = $derived(props);

  const { advancedMsg } = $derived($i18n);

  const { formState, dispatchFormAction } = useUserProfileForm({
    kcContext: untrack(() => kcContext),
    i18n: untrack(() => $i18n),
    doMakeUserConfirmPassword: untrack(() => doMakeUserConfirmPassword),
  });
  onMount(() => {
    const unsubscribe = formState.subscribe(({ isFormSubmittable }) => {
      onIsFormSubmittableValueChange(isFormSubmittable);
    });
    return () => unsubscribe();
  });

  const formFieldStates = derived(formState, ($formState) => $formState.formFieldStates);
  const displayableErrors = derived(formFieldStates, ($formFieldStates) =>
    $formFieldStates.map((f) => f.displayableErrors),
  );

  // NOTE: Mirrors React's `groupNameRef` mutable object scoped to the enclosing `.map()`: a
  // synchronous, single-pass computation of which attribute opens a new group, instead of
  // recomputing it per-item inside GroupLabel (where it can't be kept in render order).
  const groupStartFlags = $derived.by(() => {
    const flags: boolean[] = [];
    let currentGroupName = '';

    for (const { attribute } of $formFieldStates) {
      const groupName = attribute.group?.name ?? '';

      if (groupName !== currentGroupName) {
        currentGroupName = groupName;
        flags.push(groupName !== '');
        continue;
      }

      flags.push(false);
    }

    return flags;
  });
</script>

{#each $formFieldStates as formFieldState, i (i)}
  {@const { attribute, valueOrValues } = formFieldState}
  <GroupLabel
    {attribute}
    isGroupStart={groupStartFlags[i]}
    {i18n}
    {kcClsx}
  />
  {#if beforeField}
    {@render beforeField({
      attribute,
      dispatchFormAction,
      displayableErrors: $displayableErrors[i],
      valueOrValues,
      kcClsx,
      i18n,
    })}
  {/if}
  <div
    class={kcClsx('kcFormGroupClass')}
    style:display={attribute.annotations.inputType === 'hidden' ||
    (attribute.name === 'password-confirm' && !doMakeUserConfirmPassword)
      ? 'none'
      : undefined}
  >
    <div class={kcClsx('kcLabelWrapperClass')}>
      <label
        for={attribute.name}
        class={kcClsx('kcLabelClass')}
      >
        {@render advancedMsg(attribute.displayName ?? '')()}
      </label>
      {#if attribute.required}
        *
      {/if}
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
        displayableErrors={$displayableErrors[i]}
        {dispatchFormAction}
        {kcClsx}
        {i18n}
      />
      <FieldErrors
        {attribute}
        bind:displayableErrors={$displayableErrors[i]}
        {kcClsx}
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
        {@render afterField({
          attribute,
          dispatchFormAction,
          displayableErrors: $displayableErrors[i],
          valueOrValues,
          kcClsx,
          i18n,
        })}
      {/if}
      <!-- NOTE: Downloading of html5DataAnnotations scripts is done in the useUserProfileForm hook -->
    </div>
  </div>
{/each}
