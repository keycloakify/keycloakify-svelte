<script lang="ts">
  import type { PageProps } from '@keycloakify/svelte/account/pages/PageProps';
  import { getKcClsx } from 'keycloakify/account/lib/kcClsx';
  import { clsx } from 'keycloakify/tools/clsx';
  import type { I18n } from '../i18n';
  import type { KcContext } from '../KcContext';

  const {
    kcContext,
    i18n,
    doUseDefaultCss,
    Template,
    ...props
  }: PageProps<Extract<KcContext, { pageId: 'account.ftl' }>, I18n> = $props();

  const classes = {
    ...props.classes,
    kcBodyClass: clsx(props.classes?.kcBodyClass, 'user'),
  };

  const { kcClsx } = getKcClsx({
    doUseDefaultCss,
    classes,
  });

  const { url, realm, messagesPerField, stateChecker, account, referrer } = kcContext;

  const { msg } = $i18n;
</script>

<Template
  {kcContext}
  {i18n}
  {doUseDefaultCss}
  {classes}
  active="account"
>
  <div class="row">
    <div class="col-md-10">
      <h2>{@render msg('editAccountHtmlTitle')()}</h2>
    </div>
    <div class="col-md-2 subtitle">
      <span class="subtitle">
        <span class="required">*</span>
        {@render msg('requiredFields')()}
      </span>
    </div>
  </div>

  <form
    action={url.accountUrl}
    class="form-horizontal"
    method="post"
  >
    <input
      type="hidden"
      id="stateChecker"
      name="stateChecker"
      value={stateChecker}
    />

    {#if !realm.registrationEmailAsUsername}
      <div class={clsx('form-group', messagesPerField.printIfExists('username', 'has-error'))}>
        <div class="col-sm-2 col-md-2">
          <label
            for="username"
            class="control-label"
          >
            {@render msg('username')()}
          </label>
          {#if realm.editUsernameAllowed}<span class="required">*</span>{/if}
        </div>

        <div class="col-sm-10 col-md-10">
          <input
            type="text"
            class="form-control"
            id="username"
            name="username"
            disabled={!realm.editUsernameAllowed}
            value={account.username ?? ''}
          />
        </div>
      </div>
    {/if}

    <div class={clsx('form-group', messagesPerField.printIfExists('email', 'has-error'))}>
      <div class="col-sm-2 col-md-2">
        <label
          for="email"
          class="control-label"
        >
          {@render msg('email')()}
        </label>&nbsp;
        <span class="required">*</span>
      </div>

      <div class="col-sm-10 col-md-10">
        <!-- svelte-ignore a11y_autofocus -->
        <input
          type="text"
          class="form-control"
          id="email"
          name="email"
          autofocus
          value={account.email ?? ''}
        />
      </div>
    </div>

    <div class={clsx('form-group', messagesPerField.printIfExists('firstName', 'has-error'))}>
      <div class="col-sm-2 col-md-2">
        <label
          for="firstName"
          class="control-label"
        >
          {@render msg('firstName')()}
        </label>&nbsp;
        <span class="required">*</span>
      </div>

      <div class="col-sm-10 col-md-10">
        <input
          type="text"
          class="form-control"
          id="firstName"
          name="firstName"
          value={account.firstName ?? ''}
        />
      </div>
    </div>

    <div class={clsx('form-group', messagesPerField.printIfExists('lastName', 'has-error'))}>
      <div class="col-sm-2 col-md-2">
        <label
          for="lastName"
          class="control-label"
        >
          {@render msg('lastName')()}
        </label>&nbsp;
        <span class="required">*</span>
      </div>

      <div class="col-sm-10 col-md-10">
        <input
          type="text"
          class="form-control"
          id="lastName"
          name="lastName"
          value={account.lastName ?? ''}
        />
      </div>
    </div>

    <div class="form-group">
      <div
        id="kc-form-buttons"
        class="col-md-offset-2 col-md-10 submit"
      >
        <div>
          {#if referrer !== undefined}<a href={referrer?.url}>{@render msg('backToApplication')()}</a>{/if}
          <button
            type="submit"
            class={kcClsx('kcButtonClass', 'kcButtonPrimaryClass', 'kcButtonLargeClass')}
            name="submitAction"
            value="Save"
          >
            {@render msg('doSave')()}
          </button>
          <button
            type="submit"
            class={kcClsx('kcButtonClass', 'kcButtonDefaultClass', 'kcButtonLargeClass')}
            name="submitAction"
            value="Cancel"
          >
            {@render msg('doCancel')()}
          </button>
        </div>
      </div>
    </div>
  </form>
</Template>
