<script lang="ts">
  import LogoutOtherSessions from '@keycloakify/svelte/login/components/LogoutOtherSessions.svelte';
  import { useScript } from '@keycloakify/svelte/login/pages/LoginRecoveryAuthnCodeConfig.useScript';
  import type { PageProps } from '@keycloakify/svelte/login/pages/PageProps';
  import { getKcClsx } from 'keycloakify/login/lib/kcClsx';
  import { clsx } from 'keycloakify/tools/clsx';
  import type { I18n } from '../i18n';
  import type { KcContext } from '../KcContext';

  const {
    Template,
    kcContext,
    i18n,
    doUseDefaultCss,
    classes,
  }: PageProps<Extract<KcContext, { pageId: 'login-recovery-authn-code-config.ftl' }>, I18n> = $props();

  const { kcClsx } = getKcClsx({
    doUseDefaultCss,
    classes,
  });

  const { recoveryAuthnCodesConfigBean, isAppInitiatedAction } = kcContext;

  const { msg, msgStr } = $i18n;

  const olRecoveryCodesListId = 'kc-recovery-codes-list';

  useScript({ olRecoveryCodesListId, i18n });
</script>

<Template
  {kcContext}
  {i18n}
  {doUseDefaultCss}
  {classes}
>
  {#snippet headerNode()}
    {@render msg('recovery-code-config-header')()}
  {/snippet}
  <div
    class={clsx('pf-c-alert', 'pf-m-warning', 'pf-m-inline', kcClsx('kcRecoveryCodesWarning'))}
    aria-label="Warning alert"
  >
    <div class="pf-c-alert__icon">
      <i
        class="pficon-warning-triangle-o"
        aria-hidden="true"
      ></i>
    </div>
    <h4 class="pf-c-alert__title">
      <span class="pf-screen-reader">Warning alert:</span>
      {@render msg('recovery-code-config-warning-title')()}
    </h4>
    <div class="pf-c-alert__description">
      <p>{@render msg('recovery-code-config-warning-message')()}</p>
    </div>
  </div>

  <ol
    id={olRecoveryCodesListId}
    class={kcClsx('kcRecoveryCodesList')}
  >
    {#each recoveryAuthnCodesConfigBean.generatedRecoveryAuthnCodesList as code, index (code)}
      <li>
        <span>{index + 1}:</span>
        {code.slice(0, 4)}-{code.slice(4, 8)}-{code.slice(8)}
      </li>
    {/each}
  </ol>

  <!-- actions -->
  <div class={kcClsx('kcRecoveryCodesActions')}>
    <button
      id="printRecoveryCodes"
      class={clsx('pf-c-button', 'pf-m-link')}
      type="button"
    >
      <i
        class="pficon-print"
        aria-hidden="true"
      ></i>
      {@render msg('recovery-codes-print')()}
    </button>
    <button
      id="downloadRecoveryCodes"
      class={clsx('pf-c-button', 'pf-m-link')}
      type="button"
    >
      <i
        class="pficon-save"
        aria-hidden="true"
      ></i>
      {@render msg('recovery-codes-download')()}
    </button>
    <button
      id="copyRecoveryCodes"
      class={clsx('pf-c-button', 'pf-m-link')}
      type="button"
    >
      <i
        class="pficon-blueprint"
        aria-hidden="true"
      ></i>
      {@render msg('recovery-codes-copy')()}
    </button>
  </div>

  <!-- confirmation checkbox -->
  <div class={kcClsx('kcFormOptionsClass')}>
    <input
      class={kcClsx('kcCheckInputClass')}
      type="checkbox"
      id="kcRecoveryCodesConfirmationCheck"
      name="kcRecoveryCodesConfirmationCheck"
      onchange={(event) => {
        //@ts-expect-error: This is inherited from the original code
        document.getElementById('saveRecoveryAuthnCodesBtn').disabled = !event.currentTarget.checked;
      }}
    />
    <label for="kcRecoveryCodesConfirmationCheck">{@render msg('recovery-codes-confirmation-message')()}</label>
  </div>

  <form
    action={kcContext.url.loginAction}
    class={kcClsx('kcFormGroupClass')}
    id="kc-recovery-codes-settings-form"
    method="post"
  >
    <input
      type="hidden"
      name="generatedRecoveryAuthnCodes"
      value={recoveryAuthnCodesConfigBean.generatedRecoveryAuthnCodesAsString}
    />
    <input
      type="hidden"
      name="generatedAt"
      value={recoveryAuthnCodesConfigBean.generatedAt}
    />
    <input
      type="hidden"
      id="userLabel"
      name="userLabel"
      value={msgStr('recovery-codes-label-default')}
    />

    <LogoutOtherSessions
      {kcClsx}
      {i18n}
    />

    {#if isAppInitiatedAction}
      <input
        type="submit"
        class={kcClsx('kcButtonClass', 'kcButtonPrimaryClass', 'kcButtonLargeClass')}
        id="saveRecoveryAuthnCodesBtn"
        value={msgStr('recovery-codes-action-complete')}
        disabled
      />
      <button
        type="submit"
        class={kcClsx('kcButtonClass', 'kcButtonDefaultClass', 'kcButtonLargeClass')}
        id="cancelRecoveryAuthnCodesBtn"
        name="cancel-aia"
        value="true"
      >
        {@render msg('recovery-codes-action-cancel')()}
      </button>
    {:else}
      <input
        type="submit"
        class={kcClsx('kcButtonClass', 'kcButtonPrimaryClass', 'kcButtonBlockClass', 'kcButtonLargeClass')}
        id="saveRecoveryAuthnCodesBtn"
        value={msgStr('recovery-codes-action-complete')}
        disabled
      />
    {/if}
  </form>
</Template>
