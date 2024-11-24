<script lang="ts">
  import type { FormFieldError } from '../lib/useUserProfileForm';
  import type { Attribute } from 'keycloakify/login/KcContext';
  import type { KcClsx } from 'keycloakify/login/lib/kcClsx';

  type FieldErrorProps = {
    attribute: Attribute;
    displayableErrors: FormFieldError[];
    fieldIndex: number | undefined;
    kcClsx: KcClsx;
  };
  const { attribute, fieldIndex, kcClsx, displayableErrors: _displayableErrors }: FieldErrorProps = $props();
  const displayableErrors = _displayableErrors.filter((error) => error.fieldIndex === fieldIndex);
</script>

{#if displayableErrors.length !== 0}
  <span
    id={`input-error-${attribute.name}${fieldIndex === undefined ? '' : `-${fieldIndex}`}`}
    class={kcClsx('kcInputErrorMessageClass')}
    aria-live="polite"
  >
    {#each displayableErrors as displayableError, i}
      {@const { errorMessage } = displayableError}
      {@render errorMessage()}
      {#if displayableErrors.length - 1 !== i}<br />{/if}
    {/each}
  </span>
{/if}
