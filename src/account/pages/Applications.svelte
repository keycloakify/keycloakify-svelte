<script lang="ts">
  import type { PageProps } from '@keycloakify/svelte/account/pages/PageProps';
  import type { KcContext } from '../KcContext';
  import type { I18n } from '../i18n';
  import { getKcClsx } from 'keycloakify/account/lib/kcClsx';

  const {
    kcContext,
    i18n,
    doUseDefaultCss,
    Template,
    classes,
  }: PageProps<Extract<KcContext, { pageId: 'applications.ftl' }>, I18n> = $props();

  const { kcClsx } = getKcClsx({
    doUseDefaultCss,
    classes,
  });

  const {
    url,
    applications: { applications },
    stateChecker,
  } = kcContext;

  const { msg, advancedMsg } = $i18n;

  function isArrayWithEmptyObject(variable: unknown): boolean {
    return (
      Array.isArray(variable) &&
      variable.length === 1 &&
      typeof variable[0] === 'object' &&
      Object.keys(variable[0]).length === 0
    );
  }
</script>

<Template
  {kcContext}
  {i18n}
  {doUseDefaultCss}
  {classes}
  active="applications"
>
  <div class="row">
    <div class="col-md-10">
      <h2>{@render msg('applicationsHtmlTitle')()}</h2>
    </div>

    <form
      action={url.applicationsUrl}
      method="post"
    >
      <input
        type="hidden"
        id="stateChecker"
        name="stateChecker"
        value={stateChecker}
      />
      <input
        type="hidden"
        id="referrer"
        name="referrer"
        value={stateChecker}
      />

      <table class="table table-striped table-bordered">
        <thead>
          <tr>
            <td>{@render msg('application')()}</td>
            <td>{@render msg('availableRoles')()}</td>
            <td>{@render msg('grantedPermissions')()}</td>
            <td>{@render msg('additionalGrants')()}</td>
            <td>{@render msg('action')()}</td>
          </tr>
        </thead>

        <tbody>
          {#each applications as application, i (i)}
            <tr>
              <td>
                {#if application.effectiveUrl}
                  <a href={application.effectiveUrl}>
                    {#if application.client.name}
                      {@render advancedMsg(application.client.name)()}
                    {:else}
                      {application.client.clientId}
                    {/if}
                  </a>
                {/if}
                {#if !application.effectiveUrl && application.client.name}
                  {@render advancedMsg(application.client.name)()}
                {:else}
                  {application.client.clientId}
                {/if}
              </td>

              <td>
                {#if !isArrayWithEmptyObject(application.realmRolesAvailable)}
                  {#each application.realmRolesAvailable as role, index (role.name)}
                    <span>
                      {@render (role.description ? advancedMsg(role.description) : advancedMsg(role.name))()}
                      {#if index < application.realmRolesAvailable.length - 1},&nbsp;{/if}
                    </span>
                  {/each}
                  {#if application.resourceRolesAvailable}
                    {#each Object.keys(application.resourceRolesAvailable) as resource (resource)}
                      <span>
                        {#if !isArrayWithEmptyObject(application.realmRolesAvailable)},&nbsp;{/if}
                        {#each application.resourceRolesAvailable[resource] as clientRole (clientRole.roleName)}
                          <span>
                            {@render (clientRole.roleDescription
                              ? advancedMsg(clientRole.roleDescription)
                              : advancedMsg(clientRole.roleName))()}&nbsp:
                            {@render msg('inResource')()}&nbsp:
                            <strong>
                              {#if clientRole.clientName}
                                {@render advancedMsg(clientRole.clientName)()}
                              {:else}
                                {clientRole.clientId}
                              {/if}
                            </strong>
                            {#if clientRole !== application.resourceRolesAvailable[resource][application.resourceRolesAvailable[resource].length - 1]},&nbsp;{/if}
                          </span>
                        {/each}
                      </span>
                    {/each}
                  {/if}
                {/if}
              </td>

              <td>
                {#if application.client.consentRequired}
                  {#each application.clientScopesGranted as claim (claim)}
                    <span>
                      {@render advancedMsg(claim)()}
                      {#if claim !== application.clientScopesGranted[application.clientScopesGranted.length - 1]},&nbsp;{/if}
                    </span>
                  {/each}
                {:else}
                  <strong>{@render msg('fullAccess')()}</strong>
                {/if}
              </td>

              <td>
                {#each application.additionalGrants as grant (grant)}
                  <span>
                    {@render advancedMsg(grant)()}
                    {#if grant !== application.additionalGrants[application.additionalGrants.length - 1]},&nbsp;{/if}
                  </span>
                {/each}
              </td>

              <td>
                {#if (application.client.consentRequired && application.clientScopesGranted.length > 0) || application.additionalGrants.length > 0}
                  <button
                    type="submit"
                    class={kcClsx('kcButtonPrimaryClass', 'kcButtonClass')}
                    id={`revoke-${application.client.clientId}`}
                    name="clientId"
                    value={application.client.id}
                  >
                    {@render msg('revoke')()}
                  </button>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </form>
  </div>
</Template>
