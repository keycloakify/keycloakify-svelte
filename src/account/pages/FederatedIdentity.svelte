<script lang="ts">
  import type { PageProps } from '@keycloakify/svelte/account/pages/PageProps';
  import type { KcContext } from '../KcContext';
  import type { I18n } from '../i18n';

  const {
    kcContext,
    i18n,
    doUseDefaultCss,
    Template,
    classes,
  }: PageProps<Extract<KcContext, { pageId: 'federatedIdentity.ftl' }>, I18n> = $props();

  const { url, federatedIdentity, stateChecker } = kcContext;
  const { msg } = $i18n;
</script>

<Template
  {kcContext}
  {i18n}
  {doUseDefaultCss}
  {classes}
  active="social"
>
  <div class="main-layout social">
    <div class="row">
      <div class="col-md-10">
        <h2>{@render msg('federatedIdentitiesHtmlTitle')()}</h2>
      </div>
    </div>
    <div id="federated-identities">
      {#each federatedIdentity.identities as identity (identity.providerId)}
        <div class="row margin-bottom">
          <div class="col-sm-2 col-md-2">
            <label
              for={identity.providerId}
              class="control-label"
            >
              {identity.displayName}
            </label>
          </div>
          <div class="col-sm-5 col-md-5">
            <input
              disabled
              class="form-control"
              value={identity.userName}
            />
          </div>
          <div class="col-sm-5 col-md-5">
            {#if identity.connected}
              {#if federatedIdentity.removeLinkPossible}
                <form
                  action={url.socialUrl}
                  method="post"
                  class="form-inline"
                >
                  <input
                    type="hidden"
                    name="stateChecker"
                    value={stateChecker}
                  />
                  <input
                    type="hidden"
                    name="action"
                    value="remove"
                  />
                  <input
                    type="hidden"
                    name="providerId"
                    value={identity.providerId}
                  />
                  <button
                    id={`remove-link-${identity.providerId}`}
                    class="btn btn-default"
                  >
                    {@render msg('doRemove')()}
                  </button>
                </form>
              {/if}
            {:else}
              <form
                action={url.socialUrl}
                method="post"
                class="form-inline"
              >
                <input
                  type="hidden"
                  name="stateChecker"
                  value={stateChecker}
                />
                <input
                  type="hidden"
                  name="action"
                  value="add"
                />
                <input
                  type="hidden"
                  name="providerId"
                  value={identity.providerId}
                />
                <button
                  id={`add-link-${identity.providerId}`}
                  class="btn btn-default"
                >
                  {@render msg('doAdd')()}
                </button>
              </form>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </div>
</Template>
