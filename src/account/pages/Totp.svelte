<script lang="ts">
  import type { PageProps } from '@keycloakify/svelte/account/pages/PageProps';
  import type { KcContext } from '../KcContext';
  import type { I18n } from '../i18n';
  import { getKcClsx } from 'keycloakify/account/lib/kcClsx';
  import { kcSanitize } from 'keycloakify/lib/kcSanitize';
  import { clsx } from 'keycloakify/tools/clsx';

  const {
    kcContext,
    i18n,
    doUseDefaultCss,
    Template,
    classes,
  }: PageProps<Extract<KcContext, { pageId: 'totp.ftl' }>, I18n> = $props();

  const { kcClsx } = getKcClsx({
    doUseDefaultCss,
    classes,
  });

  const { totp, mode, url, messagesPerField, stateChecker } = kcContext;

  const { msg, msgStr, advancedMsg } = $i18n;
</script>

<Template
  {kcContext}
  {i18n}
  {doUseDefaultCss}
  {classes}
  active="totp"
>
  <div class="row">
    <div class="col-md-10">
      <h2>{@render msg('authenticatorTitle')()}</h2>
    </div>
    {#if totp.otpCredentials.length === 0}
      <div class="subtitle col-md-2">
        <span class="required">*</span>
        {@render msg('requiredFields')()}
      </div>
    {/if}
  </div>
  {#if totp.enabled}
    <table class="table table-bordered table-striped">
      <thead>
        {#if totp.otpCredentials.length > 1}
          <tr>
            <th colspan={4}>{@render msg('configureAuthenticators')()}</th>
          </tr>
        {:else}
          <tr>
            <th colspan={3}>{@render msg('configureAuthenticators')()}</th>
          </tr>
        {/if}
      </thead>
      <tbody>
        {#each totp.otpCredentials as credential, index (credential.id)}
          <tr>
            <td class="provider">{@render msg('mobile')()}</td>
            {#if totp.otpCredentials.length > 1}<td class="provider">{credential.id}</td>{/if}
            <td class="provider">{credential.userLabel || ''}</td>
            <td class="action">
              <form
                action={url.totpUrl}
                method="post"
                class="form-inline"
              >
                <input
                  type="hidden"
                  id="stateChecker"
                  name="stateChecker"
                  value={stateChecker}
                />
                <input
                  type="hidden"
                  id="submitAction"
                  name="submitAction"
                  value="Delete"
                />
                <input
                  type="hidden"
                  id="credentialId"
                  name="credentialId"
                  value={credential.id}
                />
                <button
                  id={`remove-mobile-${index}`}
                  class="btn btn-default"
                  aria-label="delete"
                >
                  <i class="pficon pficon-delete"></i>
                </button>
              </form>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
  {#if !totp.enabled}
    <div>
      <hr />
      <ol id="kc-totp-settings">
        <li>
          <p>{@render msg('totpStep1')()}</p>

          <ul id="kc-totp-supported-apps">
            {#each totp.supportedApplications as app (app)}
              <li>{@render advancedMsg(app)()}</li>
            {/each}
          </ul>
        </li>

        {#if mode && mode == 'manual'}
          <li>
            <p>{@render msg('totpManualStep2')()}</p>
            <p>
              <span id="kc-totp-secret-key">{totp.totpSecretEncoded}</span>
            </p>
            <p>
              <a
                href={totp.qrUrl}
                id="mode-barcode"
              >
                {@render msg('totpScanBarcode')()}
              </a>
            </p>
          </li>
          <li>
            <p>{@render msg('totpManualStep3')()}</p>
            <ul>
              <li id="kc-totp-type">
                {@render msg('totpType')()}: {@render msg(`totp.${totp.policy.type}`)()}
              </li>
              <li id="kc-totp-algorithm">
                {@render msg('totpAlgorithm')()}: {totp.policy.getAlgorithmKey()}
              </li>
              <li id="kc-totp-digits">
                {@render msg('totpDigits')()}: {totp.policy.digits}
              </li>
              {#if totp.policy.type === 'totp'}
                <li id="kc-totp-period">
                  {@render msg('totpInterval')()}: {totp.policy.period}
                </li>
              {:else}
                <li id="kc-totp-counter">
                  {@render msg('totpCounter')()}: {totp.policy.initialCounter}
                </li>
              {/if}
            </ul>
          </li>
        {:else}
          <li>
            <p>{@render msg('totpStep2')()}</p>
            <p>
              <img
                id="kc-totp-secret-qr-code"
                src={`data:image/png;base64, ${totp.totpSecretQrCode}`}
                alt="Figure: Barcode"
              />
            </p>
            <p>
              <a
                href={totp.manualUrl}
                id="mode-manual"
              >
                {@render msg('totpUnableToScan')()}
              </a>
            </p>
          </li>
        {/if}
        <li>
          <p>{@render msg('totpStep3')()}</p>
          <p>{@render msg('totpStep3DeviceName')()}</p>
        </li>
      </ol>
      <hr />
      <form
        action={url.totpUrl}
        class={kcClsx('kcFormClass')}
        id="kc-totp-settings-form"
        method="post"
      >
        <input
          type="hidden"
          id="stateChecker"
          name="stateChecker"
          value={stateChecker}
        />
        <div class={kcClsx('kcFormGroupClass')}>
          <div class="col-sm-2 col-md-2">
            <label
              for="totp"
              class="control-label"
            >
              {@render msg('authenticatorCode')()}
            </label>
            <span class="required">*</span>
          </div>
          <div class="col-sm-10 col-md-10">
            <input
              type="text"
              id="totp"
              name="totp"
              autocomplete="off"
              class={kcClsx('kcInputClass')}
              aria-invalid={messagesPerField.existsError('totp')}
            />

            {#if messagesPerField.existsError('totp')}
              <span
                id="input-error-otp-code"
                class={kcClsx('kcInputErrorMessageClass')}
                aria-live="polite">{@html kcSanitize(messagesPerField.get('totp'))}</span
              >
            {/if}
          </div>
          <input
            type="hidden"
            id="totpSecret"
            name="totpSecret"
            value={totp.totpSecret}
          />
          {#if mode}<input
              type="hidden"
              id="mode"
              value={mode}
            />{/if}
        </div>

        <div class={kcClsx('kcFormGroupClass')}>
          <div class="col-sm-2 col-md-2">
            <label
              for="userLabel"
              class={kcClsx('kcLabelClass')}
            >
              {@render msg('totpDeviceName')()}
            </label>
            {#if totp.otpCredentials.length >= 1}<span class="required">*</span>{/if}
          </div>
          <div class="col-sm-10 col-md-10">
            <input
              type="text"
              id="userLabel"
              name="userLabel"
              autocomplete="off"
              class={kcClsx('kcInputClass')}
              aria-invalid={messagesPerField.existsError('userLabel')}
            />
            {#if messagesPerField.existsError('userLabel')}
              <span
                id="input-error-otp-label"
                class={kcClsx('kcInputErrorMessageClass')}
                aria-live="polite">{@html kcSanitize(messagesPerField.get('userLabel'))}</span
              >
            {/if}
          </div>
        </div>

        <div
          id="kc-form-buttons"
          class={clsx(kcClsx('kcFormGroupClass'), 'text-right')}
        >
          <div class={kcClsx('kcInputWrapperClass')}>
            <input
              type="submit"
              class={kcClsx('kcButtonClass', 'kcButtonPrimaryClass', 'kcButtonLargeClass')}
              id="saveTOTPBtn"
              value={msgStr('doSave')}
            />
            <button
              type="submit"
              class={kcClsx('kcButtonClass', 'kcButtonDefaultClass', 'kcButtonLargeClass', 'kcButtonLargeClass')}
              id="cancelTOTPBtn"
              name="submitAction"
              value="Cancel"
            >
              {@render msg('doCancel')()}
            </button>
          </div>
        </div>
      </form>
    </div>
  {/if}
</Template>
