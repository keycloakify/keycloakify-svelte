<script lang="ts">
  import type { PageProps } from '@keycloakify/svelte/login/pages/PageProps';
  import { useState } from '@keycloakify/svelte/tools/useState';
  import { getKcClsx } from 'keycloakify/login/lib/kcClsx';
  import { clsx } from 'keycloakify/tools/clsx';
  import type { KcContext } from '../KcContext';
  import type { I18n } from '../i18n';

  const {
    Template,
    kcContext,
    i18n,
    doUseDefaultCss,
    classes,
  }: PageProps<Extract<KcContext, { pageId: 'login-username.ftl' }>, I18n> = $props();

  const { kcClsx } = getKcClsx({
    doUseDefaultCss,
    classes,
  });

  const { social, realm, url, usernameHidden, login, registrationDisabled, messagesPerField } = kcContext;

  const { msg, msgStr } = $i18n;

  const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);
</script>

<Template
  {kcContext}
  {i18n}
  {doUseDefaultCss}
  {classes}
  displayMessage={!messagesPerField.existsError('username')}
  displayInfo={realm.password && realm.registrationAllowed && !registrationDisabled}
>
  {#snippet headerNode()}
    {@render msg('doLogIn')()}
  {/snippet}
  {#snippet infoNode()}
    <div id="kc-registration">
      <span>
        {@render msg('noAccount')()}
        <a
          tabindex={6}
          href={url.registrationUrl}
        >
          {@render msg('doRegister')()}
        </a>
      </span>
    </div>
  {/snippet}
  {#snippet socialProvidersNode()}
    {#if realm.password && social?.providers !== undefined && social.providers.length !== 0}
      <div
        id="kc-social-providers"
        class={kcClsx('kcFormSocialAccountSectionClass')}
      >
        <hr />
        <h2>{@render msg('identity-provider-login-label')()}</h2>
        <ul
          class={kcClsx(
            'kcFormSocialAccountListClass',
            social.providers.length > 3 && 'kcFormSocialAccountListGridClass',
          )}
        >
          {#each social.providers as p (p.providerId)}
            <li>
              <a
                id={`social-${p.alias}`}
                class={kcClsx(
                  'kcFormSocialAccountListButtonClass',
                  social.providers.length > 3 && 'kcFormSocialAccountGridItem',
                )}
                type="button"
                href={p.loginUrl}
              >
                {#if p.iconClasses}
                  <i
                    class={clsx(kcClsx('kcCommonLogoIdP'), p.iconClasses)}
                    aria-hidden="true"
                  ></i>
                {/if}
                <span class={clsx(kcClsx('kcFormSocialAccountNameClass'), p.iconClasses && 'kc-social-icon-text')}>
                  {p.displayName}
                </span>
              </a>
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  {/snippet}

  <div id="kc-form">
    <div id="kc-form-wrapper">
      {#if realm.password}
        <form
          id="kc-form-login"
          onsubmit={() => {
            setIsLoginButtonDisabled(true);
            return true;
          }}
          action={url.loginAction}
          method="post"
        >
          {#if !usernameHidden}
            <div class={kcClsx('kcFormGroupClass')}>
              <label
                for="username"
                class={kcClsx('kcLabelClass')}
              >
                {#if !realm.loginWithEmailAllowed}
                  {@render msg('username')()}
                {:else if !realm.registrationEmailAsUsername}
                  {@render msg('usernameOrEmail')()}
                {:else}
                  {@render msg('email')()}
                {/if}
              </label>
              <!-- svelte-ignore a11y_autofocus -->
              <input
                tabindex={2}
                id="username"
                class={kcClsx('kcInputClass')}
                name="username"
                value={login.username ?? ''}
                type="text"
                autofocus
                autocomplete="off"
                aria-invalid={messagesPerField.existsError('username')}
              />
              {#if messagesPerField.existsError('username')}
                <span
                  id="input-error"
                  class={kcClsx('kcInputErrorMessageClass')}
                  aria-live="polite"
                >
                  {messagesPerField.getFirstError('username')}
                </span>
              {/if}
            </div>
          {/if}

          <div class={kcClsx('kcFormGroupClass', 'kcFormSettingClass')}>
            <div id="kc-form-options">
              {#if realm.rememberMe && !usernameHidden}
                <div class="checkbox">
                  <label>
                    <input
                      tabindex={3}
                      id="rememberMe"
                      name="rememberMe"
                      type="checkbox"
                      checked={!!login.rememberMe}
                    />&nbsp;
                    {@render msg('rememberMe')()}
                  </label>
                </div>
              {/if}
            </div>
          </div>

          <div
            id="kc-form-buttons"
            class={kcClsx('kcFormGroupClass')}
          >
            <input
              tabindex={4}
              disabled={$isLoginButtonDisabled}
              class={kcClsx('kcButtonClass', 'kcButtonPrimaryClass', 'kcButtonBlockClass', 'kcButtonLargeClass')}
              name="login"
              id="kc-login"
              type="submit"
              value={msgStr('doLogIn')}
            />
          </div>
        </form>
      {/if}
    </div>
  </div>
</Template>
