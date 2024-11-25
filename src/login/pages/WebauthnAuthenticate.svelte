<script lang="ts">
  import type { PageProps } from '@keycloakify/svelte/login/pages/PageProps';
  import { useScript } from '@keycloakify/svelte/login/pages/WebauthnAuthenticate.useScript';
  import { type ClassKey, getKcClsx } from 'keycloakify/login/lib/kcClsx';
  import { clsx } from 'keycloakify/tools/clsx';
  import type { CxArg } from 'keycloakify/tools/clsx_withTransform';
  import type { KcContext } from '../KcContext';
  import type { I18n } from '../i18n';

  const {
    Template,
    kcContext,
    i18n,
    doUseDefaultCss,
    classes,
  }: PageProps<Extract<KcContext, { pageId: 'webauthn-authenticate.ftl' }>, I18n> = $props();

  const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });

  const { url, realm, registrationDisabled, authenticators, shouldDisplayAuthenticators } = kcContext;

  const { msg, msgStr, advancedMsg } = $i18n;

  const authButtonId = 'authenticateWebAuthnButton';

  useScript({
    authButtonId,
    kcContext,
    i18n,
  });
</script>

<Template
  {kcContext}
  {i18n}
  {doUseDefaultCss}
  {classes}
  displayInfo={realm.registrationAllowed && !registrationDisabled}
>
  {#snippet headerNode()}
    {@render msg('webauthn-login-title')()}
  {/snippet}
  {#snippet infoNode()}
    <div id="kc-registration">
      <span>
        {@render msg('noAccount')()}{' '}
        <a
          tabindex={6}
          href={url.registrationUrl}
        >
          {@render msg('doRegister')()}
        </a>
      </span>
    </div>
  {/snippet}
  <div
    id="kc-form-webauthn"
    class={kcClsx('kcFormClass')}
  >
    <form
      id="webauth"
      action={url.loginAction}
      method="post"
    >
      <input
        type="hidden"
        id="clientDataJSON"
        name="clientDataJSON"
      />
      <input
        type="hidden"
        id="authenticatorData"
        name="authenticatorData"
      />
      <input
        type="hidden"
        id="signature"
        name="signature"
      />
      <input
        type="hidden"
        id="credentialId"
        name="credentialId"
      />
      <input
        type="hidden"
        id="userHandle"
        name="userHandle"
      />
      <input
        type="hidden"
        id="error"
        name="error"
      />
    </form>
    <div class={clsx(kcClsx('kcFormGroupClass'), 'no-bottom-margin')}>
      {#if authenticators}
        <form
          id="authn_select"
          class={kcClsx('kcFormClass')}
        >
          {#each authenticators.authenticators as authenticator}
            <input
              type="hidden"
              name="authn_use_chk"
              value={authenticator.credentialId}
            />
          {/each}
        </form>

        {#if shouldDisplayAuthenticators}
          {#if authenticators.authenticators.length > 1}
            <p class={kcClsx('kcSelectAuthListItemTitle')}>{@render msg('webauthn-available-authenticators')()}</p>
          {/if}
          <div class={kcClsx('kcFormOptionsClass')}>
            {#each authenticators.authenticators as authenticator, i}
              <div
                id={`kc-webauthn-authenticator-item-${i}`}
                class={kcClsx('kcSelectAuthListItemClass')}
              >
                <div class={kcClsx('kcSelectAuthListItemIconClass')}>
                  <i
                    class={clsx(
                      (() => {
                        const klass = kcClsx(authenticator.transports.iconClass as CxArg<ClassKey>);
                        if (klass === authenticator.transports.iconClass) {
                          return kcClsx('kcWebAuthnDefaultIcon');
                        }
                        return klass;
                      })(),
                      kcClsx('kcSelectAuthListItemIconPropertyClass'),
                    )}
                  ></i>
                </div>
                <div class={kcClsx('kcSelectAuthListItemArrowIconClass')}>
                  <div
                    id={`kc-webauthn-authenticator-label-${i}`}
                    class={kcClsx('kcSelectAuthListItemHeadingClass')}
                  >
                    {@render advancedMsg(authenticator.label)()}
                  </div>
                  {#if authenticator.transports.displayNameProperties?.length}
                    <div
                      id={`kc-webauthn-authenticator-transport-${i}`}
                      class={kcClsx('kcSelectAuthListItemDescriptionClass')}
                    >
                      {#each authenticator.transports.displayNameProperties as displayNameProperty, i}
                        {@const hasNext = i !== authenticator.transports.displayNameProperties.length - 1}
                        {@render advancedMsg(displayNameProperty)()}
                        {#if hasNext}<span>, </span>{/if}
                      {/each}
                    </div>
                  {/if}
                  <div class={kcClsx('kcSelectAuthListItemDescriptionClass')}>
                    <span id={`kc-webauthn-authenticator-createdlabel-${i}`}>
                      {@render msg('webauthn-createdAt-label')()}
                    </span>
                    <span id={`kc-webauthn-authenticator-created-${i}`}>{authenticator.createdAt}</span>
                  </div>
                  <div class={kcClsx('kcSelectAuthListItemFillClass')}></div>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      {/if}
      <div
        id="kc-form-buttons"
        class={kcClsx('kcFormButtonsClass')}
      >
        <!-- svelte-ignore a11y_autofocus -->
        <input
          id={authButtonId}
          type="button"
          autofocus
          value={msgStr('webauthn-doAuthenticate')}
          class={kcClsx('kcButtonClass', 'kcButtonPrimaryClass', 'kcButtonBlockClass', 'kcButtonLargeClass')}
        />
      </div>
    </div>
  </div>
</Template>
