<script lang="ts">
  import type { Attribute } from 'keycloakify/login/KcContext';
  import type { KcClsx } from 'keycloakify/login/lib/kcClsx';
  import { assert } from 'keycloakify/tools/assert';
  import { createRawSnippet } from 'svelte';
  import type { I18n } from '../i18n';
  import type { Readable } from 'svelte/store';

  type GroupLabelProps = {
    attribute: Attribute;
    isGroupStart: boolean;
    i18n: Readable<I18n>;
    kcClsx: KcClsx;
  };
  const { attribute, isGroupStart, i18n, kcClsx }: GroupLabelProps = $props();
  const { advancedMsg } = $derived($i18n);

  const isGrouplabel = $derived.by(() => {
    if (!isGroupStart) {
      return false;
    }

    assert(attribute.group !== undefined);
    return true;
  });

  const html5DataAnnotations = $derived({
    ...Object.fromEntries(
      Object.entries(attribute.group?.html5DataAnnotations ?? {}).map(([key, value]) => [`data-${key}`, value]),
    ),
  });
</script>

{#if isGrouplabel}
  {@const groupDisplayHeader = attribute.group?.displayHeader ?? ''}
  {@const groupDisplayDescription = attribute.group?.displayDescription ?? ''}
  {@const groupHeaderText =
    groupDisplayHeader !== ''
      ? advancedMsg(groupDisplayHeader)
      : createRawSnippet(() => ({ render: () => attribute.group?.name ?? '' }))}
  <div
    class={kcClsx('kcFormGroupClass')}
    {...html5DataAnnotations}
  >
    <div class={kcClsx('kcContentWrapperClass')}>
      <label
        id={`header-${attribute.group?.name}`}
        class={kcClsx('kcFormGroupHeader')}
      >
        {@render groupHeaderText()}
      </label>
    </div>
    {#if groupDisplayDescription !== ''}
      {@const groupDescriptionText = advancedMsg(groupDisplayDescription)}
      <div class={kcClsx('kcLabelWrapperClass')}>
        <label
          id={`description-${attribute.group?.name}`}
          class={kcClsx('kcLabelClass')}
        >
          {@render groupDescriptionText()}
        </label>
      </div>
    {/if}
  </div>
{/if}
