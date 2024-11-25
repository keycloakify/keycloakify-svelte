<script lang="ts">
  import type { PageProps } from '@keycloakify/svelte/account/pages/PageProps';
  import { useState } from '@keycloakify/svelte/tools/useState';
  import { getKcClsx } from 'keycloakify/account/lib/kcClsx';
  import { clsx } from 'keycloakify/tools/clsx';
  import type { KcContext } from '../KcContext';
  import type { I18n } from '../i18n';

  const {
    kcContext,
    i18n,
    doUseDefaultCss,
    Template,
    ...props
  }: PageProps<Extract<KcContext, { pageId: 'password.ftl' }>, I18n> = $props();

  const classes = {
    ...props.classes,
    kcBodyClass: clsx(props.classes?.kcBodyClass, 'password'),
  };

  const { kcClsx } = getKcClsx({
    doUseDefaultCss,
    classes,
  });
  const { url, password, account, stateChecker } = kcContext;

  const { msgStr, msg } = $i18n;

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [newPasswordConfirmError, setNewPasswordConfirmError] = useState('');
  const [hasNewPasswordBlurred, setHasNewPasswordBlurred] = useState(false);
  const [hasNewPasswordConfirmBlurred, setHasNewPasswordConfirmBlurred] = useState(false);

  const checkNewPassword = (newPassword: string, $currentPassword: string) => {
    if (!password.passwordSet) {
      return;
    }

    if (newPassword === $currentPassword) {
      setNewPasswordError(msgStr('newPasswordSameAsOld'));
    } else {
      setNewPasswordError('');
    }
  };

  const checkNewPasswordConfirm = (newPasswordConfirm: string, $newPassword: string) => {
    if (newPasswordConfirm === '') {
      return;
    }

    if ($newPassword !== newPasswordConfirm) {
      setNewPasswordConfirmError(msgStr('passwordConfirmNotMatch'));
    } else {
      setNewPasswordConfirmError('');
    }
  };
</script>

<!-- check message reactivity -->
<Template
  kcContext={{
    ...kcContext,
    message: (() => {
      if ($newPasswordError !== '') {
        return {
          type: 'error',
          summary: $newPasswordError,
        };
      }

      if ($newPasswordConfirmError !== '') {
        return {
          type: 'error',
          summary: $newPasswordConfirmError,
        };
      }

      return kcContext.message;
    })(),
  }}
  {i18n}
  {doUseDefaultCss}
  {classes}
  active="password"
>
  <div class="row">
    <div class="col-md-10">
      <h2>{@render msg('changePasswordHtmlTitle')()}</h2>
    </div>
    <div class="col-md-2 subtitle">
      <span class="subtitle">{@render msg('allFieldsRequired')()}</span>
    </div>
  </div>

  <form
    action={url.passwordUrl}
    class="form-horizontal"
    method="post"
  >
    <input
      type="text"
      id="username"
      name="username"
      value={account.username ?? ''}
      autocomplete="username"
      readonly
      style:display={'none'}
    />

    {#if password.passwordSet}
      <div class="form-group">
        <div class="col-sm-2 col-md-2">
          <label
            for="password"
            class="control-label"
          >
            {@render msg('password')()}
          </label>
        </div>
        <div class="col-sm-10 col-md-10">
          <!-- svelte-ignore a11y_autofocus -->
          <input
            type="password"
            class="form-control"
            id="password"
            name="password"
            autofocus
            autocomplete="current-password"
            value={$currentPassword}
            onchange={(event) => setCurrentPassword(event.currentTarget.value)}
          />
        </div>
      </div>
    {/if}

    <input
      type="hidden"
      id="stateChecker"
      name="stateChecker"
      value={stateChecker}
    />

    <div class="form-group">
      <div class="col-sm-2 col-md-2">
        <label
          for="password-new"
          class="control-label"
        >
          {@render msg('passwordNew')()}
        </label>
      </div>
      <div class="col-sm-10 col-md-10">
        <input
          type="password"
          class="form-control"
          id="password-new"
          name="password-new"
          autocomplete="new-password"
          value={$newPassword}
          onchange={(event) => {
            const newPassword = event.currentTarget.value;

            setNewPassword(newPassword);
            if ($hasNewPasswordBlurred) {
              checkNewPassword(newPassword, $currentPassword);
            }
          }}
          onblur={() => {
            setHasNewPasswordBlurred(true);
            checkNewPassword($newPassword, $currentPassword);
          }}
        />
      </div>
    </div>

    <div class="form-group">
      <div class="col-sm-2 col-md-2">
        <label
          for="password-confirm"
          class="control-label two-lines"
        >
          {@render msg('passwordConfirm')()}
        </label>
      </div>

      <div class="col-sm-10 col-md-10">
        <input
          type="password"
          class="form-control"
          id="password-confirm"
          name="password-confirm"
          autocomplete="new-password"
          value={$newPasswordConfirm}
          onchange={(event) => {
            const newPasswordConfirm = event.currentTarget.value;

            setNewPasswordConfirm(newPasswordConfirm);
            if ($hasNewPasswordConfirmBlurred) {
              checkNewPasswordConfirm(newPasswordConfirm, $newPassword);
            }
          }}
          onblur={() => {
            setHasNewPasswordConfirmBlurred(true);
            checkNewPasswordConfirm($newPasswordConfirm, $newPassword);
          }}
        />
      </div>
    </div>

    <div class="form-group">
      <div
        id="kc-form-buttons"
        class="col-md-offset-2 col-md-10 submit"
      >
        <div>
          <button
            disabled={$newPasswordError !== '' || $newPasswordConfirmError !== ''}
            type="submit"
            class={kcClsx('kcButtonClass', 'kcButtonPrimaryClass', 'kcButtonLargeClass')}
            name="submitAction"
            value="Save"
          >
            {@render msg('doSave')()}
          </button>
        </div>
      </div>
    </div>
  </form>
</Template>
