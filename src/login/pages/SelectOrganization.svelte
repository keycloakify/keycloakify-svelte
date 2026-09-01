<script lang="ts">
  import type { PageProps } from '@keycloakify/svelte/login/pages/PageProps';
  import { getKcClsx } from 'keycloakify/login/lib/kcClsx';
  import type { KcContext } from '../KcContext';
  import type { I18n } from '../i18n';

  const {
    Template,
    kcContext,
    i18n,
    doUseDefaultCss,
    classes,
  }: PageProps<Extract<KcContext, { pageId: 'select-organization.ftl' }>, I18n> = $props();

  const { kcClsx } = $derived(
    getKcClsx({
      doUseDefaultCss,
      classes,
    }),
  );

  const { url, user } = $derived(kcContext);

  const { msg } = $derived($i18n);

  let isSubmitting = $state(false);
  let formElement: HTMLFormElement | undefined = $state();
  let organizationInputElement: HTMLInputElement | undefined = $state();

  const onOrganizationClick = (organizationAlias: string) => (event: MouseEvent) => {
    event.preventDefault();

    if (!organizationInputElement || !formElement) {
      return;
    }

    organizationInputElement.value = organizationAlias;
    isSubmitting = true;

    if (typeof formElement.requestSubmit === 'function') {
      formElement.requestSubmit();
      return;
    }

    formElement.submit();
  };

  const organizations = $derived(user.organizations ?? []);
  const shouldDisplayGrid = $derived(organizations.length > 3);
</script>

<Template
  {kcContext}
  {i18n}
  {doUseDefaultCss}
  {classes}
>
  {#snippet headerNode()}
    <!-- Intentionally empty: this page has no header, mirroring React's headerNode={null}. -->
  {/snippet}
  <form
    bind:this={formElement}
    action={url.loginAction}
    class="form-vertical"
    method="post"
  >
    <div
      id="kc-user-organizations"
      class={kcClsx('kcFormGroupClass')}
    >
      <h2>{@render msg('organization.select')()}</h2>
      <ul class={kcClsx('kcFormSocialAccountListClass', shouldDisplayGrid && 'kcFormSocialAccountListGridClass')}>
        {#each organizations as { alias, name } (alias)}
          <li>
            <button
              id={`organization-${alias}`}
              class={kcClsx('kcFormSocialAccountListButtonClass', shouldDisplayGrid && 'kcFormSocialAccountGridItem')}
              type="button"
              onclick={onOrganizationClick(alias)}
              disabled={isSubmitting}
            >
              <span class={kcClsx('kcFormSocialAccountNameClass')}>{name ?? alias}</span>
            </button>
          </li>
        {/each}
      </ul>
    </div>
    <input
      bind:this={organizationInputElement}
      type="hidden"
      name="kc.org"
    />
  </form>
</Template>
