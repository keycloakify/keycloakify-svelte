<script lang="ts">
  import type { PageProps } from '@keycloakify/svelte/account/pages/PageProps';
  import { getKcClsx } from 'keycloakify/account/lib/kcClsx';
  import type { KcContext } from '../KcContext';
  import type { I18n } from '../i18n';

  const {
    kcContext,
    i18n,
    doUseDefaultCss,
    Template,
    classes,
  }: PageProps<Extract<KcContext, { pageId: 'sessions.ftl' }>, I18n> = $props();

  const { kcClsx } = getKcClsx({
    doUseDefaultCss,
    classes,
  });

  const { url, stateChecker, sessions } = kcContext;

  const { msg } = $i18n;
</script>

<Template
  {kcContext}
  {i18n}
  {doUseDefaultCss}
  {classes}
  active="sessions"
>
  <div class={kcClsx('kcContentWrapperClass')}>
    <div class="col-md-10">
      <h2>{@render msg('sessionsHtmlTitle')()}</h2>
    </div>
  </div>

  <table class="table table-striped table-bordered">
    <thead>
      <tr>
        <th>{@render msg('ip')()}</th>
        <th>{@render msg('started')()}</th>
        <th>{@render msg('lastAccess')()}</th>
        <th>{@render msg('expires')()}</th>
        <th>{@render msg('clients')()}</th>
      </tr>
    </thead>

    <!-- svelte-ignore a11y_no_redundant_roles -->
    <tbody role="rowgroup">
      {#each sessions.sessions as session}
        <tr>
          <td>{session.ipAddress}</td>
          <td>{session?.started}</td>
          <td>{session?.lastAccess}</td>
          <td>{session?.expires}</td>
          <td>
            {#each session.clients as client}
              <div>
                {client}
                <br />
              </div>
            {/each}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>

  <form
    action={url.sessionsUrl}
    method="post"
  >
    <input
      type="hidden"
      id="stateChecker"
      name="stateChecker"
      value={stateChecker}
    />
    <button
      id="logout-all-sessions"
      type="submit"
      class={kcClsx('kcButtonDefaultClass', 'kcButtonClass')}
    >
      {@render msg('doLogOutAllSessions')()}
    </button>
  </form>
</Template>
