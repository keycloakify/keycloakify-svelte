<script lang="ts">
  import type { InputFieldByTypeProps } from '@keycloakify/svelte/login/components/InputFieldByTypeProps';
  import InputTag from '@keycloakify/svelte/login/components/InputTag.svelte';
  import InputTagSelects from '@keycloakify/svelte/login/components/InputTagSelects.svelte';
  import PasswordWrapper from '@keycloakify/svelte/login/components/PasswordWrapper.svelte';
  import SelectTag from '@keycloakify/svelte/login/components/SelectTag.svelte';
  import TextareaTag from '@keycloakify/svelte/login/components/TextareaTag.svelte';
  const props: InputFieldByTypeProps = $props();
  const { attribute, valueOrValues } = props;
  const inputType = attribute.annotations.inputType ?? '';
</script>

{#if inputType === 'textarea'}
  <TextareaTag {...props} />
{:else if ['select', 'multiselect'].includes(inputType)}
  <SelectTag {...props} />
{:else if ['select-radiobuttons', 'multiselect-checkboxes'].includes(inputType)}
  <InputTagSelects {...props} />
{:else}
  <!-- default -->
  {#if valueOrValues instanceof Array}
    {#each valueOrValues as _, i}
      <InputTag
        {...props}
        fieldIndex={i}
      />
    {/each}
  {:else}
    {#snippet inputNode()}
      <InputTag {...props} />
    {/snippet}
    {#if ['password', 'password-confirm'].includes(attribute.name)}
      <PasswordWrapper
        kcClsx={props.kcClsx}
        i18n={props.i18n}
        passwordInputId={attribute.name}
      >
        {@render inputNode()}
      </PasswordWrapper>
    {:else}
      {@render inputNode()}
    {/if}
  {/if}
{/if}
