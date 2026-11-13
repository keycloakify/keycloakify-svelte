# Changelog

All notable changes to this project will be documented in this file.

**═══════════════════ v2.0.1 — released 2026-11-13 ═══════════════════**

## [2026-11-13] — Peer dependencies raised, lockfile refresh

**Type:** chore

### Changes

- **Peer dependencies raised to the latest versions**: `keycloakify` `^11.16.4` (was `^11.16.1`) and `svelte`
  `^5.57.3` (was `^5.0.0`). The `FormFieldError` type already follows keycloakify 11.16.4 (see the password policies
  entry below).
- Lockfile refreshed with `pnpm update`: the transitive dependencies imported from `yarn.lock` move to their latest
  in-range versions (acorn 8.19, postcss 8.5.32, svelte2tsx 0.7.63, …). TypeScript stays on 6.0: typescript-eslint,
  svelte-check and `@sveltejs/kit` / `@sveltejs/package` don't support TypeScript 7 yet.
- Verified: `pnpm install --frozen-lockfile`, `pnpm build` (publint: all good), `pnpm svelte:check` (0 errors),
  `eslint .`, `pnpm _format --list-different`.

### Files modified

- `package.json` — `peerDependencies`
- `pnpm-lock.yaml` — transitive dependencies refreshed

## [2026-11-13] — Hand-written changelog

**Type:** chore

### Changes

- **Changelog rewritten by hand**: one readable entry per stable release (v0.1.0 → v2.0.0), rebuilt from commits and
  diffs, instead of the single conventional-changelog block listing every commit.
- **No more regeneration at release time**: `release.sh` used to delete `CHANGELOG.md` and rebuild it with
  conventional-changelog, which would have overwritten the hand-written entries. Stable releases now only stamp a
  version delimiter above the new entries through `scripts/stamp-changelog.sh` (idempotent, same script as
  keycloakify-angular). The `changelog` script and the `conventional-changelog*` dev dependencies are removed.
- `changelog-update` skill documents entry format, ordering and delimiters.
- Verified: stamping a fake v2.0.1 puts the delimiter above the topmost entry, a second run is a no-op.

### Files modified

- `CHANGELOG.md` — rewritten
- `scripts/stamp-changelog.sh` (new) — version delimiter
- `scripts/release.sh` — stamps the changelog on stable releases instead of regenerating it
- `package.json`, `pnpm-lock.yaml` — `changelog` script and `conventional-changelog*` removed
- `.claude/skills/changelog-update/SKILL.md` (new), `.claude/CLAUDE.md`, `.claude/AGENTS.md` — changelog rules

## [2026-11-13] — keycloakify 11.16 password policies

**Type:** bugfix
**Ref:** https://github.com/keycloakify/keycloakify/pull/1071

### Changes

- keycloakify 11.16.4 adds `passwordHistory` and `forceExpiredPasswordChange` to `PasswordPolicies` (exposed by
  Keycloak 26+) and excludes them from `FormFieldError.Source.PasswordPolicy['name']`, since they can't be validated
  client side (they need the stored credentials). The Svelte `FormFieldError` type
  (`@keycloakify/svelte/login/lib/useUserProfileForm`) mirrors the change (port of keycloakify `bfaf6b60`): without
  it the type equality checks against keycloakify's `getUserProfileApi` failed (`svelte-check`: 2 errors).
- The other keycloakify 11.16.1 → 11.16.4 change (custom handler resolution in `keycloakify/bin`) lives in the core
  CLI: nothing to port.

### Files modified

- `src/login/lib/useUserProfileForm.ts` — `FormFieldError.Source.PasswordPolicy`

## [2026-11-13] — Migrate to pnpm, dependency update

**Type:** chore

### Changes

- **`tsafe` declared as a runtime dependency** (`^1.8.12`): the published code imports `tsafe/assert` (user profile
  form, i18n, `useInsertLinkTags`, `useInsertScriptTags`) but the package never declared it, so it only resolved
  through keycloakify's hoisted copy. Projects with a strict layout (pnpm, Yarn PnP) could fail to resolve it.
- **pnpm 12.18** replaces yarn: `packageManager` field, `pnpm-lock.yaml` imported from `yarn.lock`, `yarn.lock`
  removed. `pnpm-workspace.yaml`: the `tmp` resolution becomes an override; `allowBuilds` runs only esbuild's
  postinstall. `.npmrc` removed (its only setting, `engine-strict`, had no effect without an `engines` field).
- `chokidar` declared as a development dependency: `scripts/watch.ts` imports it, but under yarn it was only
  reachable as a hoisted transitive dependency. pnpm's strict layout made it unresolvable.
- Scripts run through pnpm (`build`, `watch`, esbuild bundling of the CLI, `format`, `lint`, `release`, husky
  `pre-commit`).
- **Linking into a starter** (`pnpm link-in-starter`) now writes `link:` overrides into the starter's
  `pnpm-workspace.yaml` instead of using `yarn link` with an isolated `.yarn_home`. Overrides also apply to transitive
  dependencies, so svelte, `@sveltejs/vite-plugin-svelte`, keycloakify and typescript stay single copies, and the
  starter's `package.json` is left untouched. The starter is installed with pnpm; the overrides and the lockfile
  changes must not be committed (the script prints how to undo them).
- CI installs with `pnpm/action-setup` + `pnpm install --frozen-lockfile`; publishing still uses `npm publish`
  (OIDC trusted publishing). The version check job installs nothing, so its `setup-node` sets
  `package-manager-cache: false`: otherwise setup-node v5 enables the pnpm cache from the `packageManager` field and
  fails looking for a pnpm that isn't there.
- **Format check now real**: `npm run _format --list-different` never forwarded the flag to prettier, so the CI check
  always passed. pnpm forwards it (no file was out of format).
- Development dependencies: keycloakify 11.16.4, svelte 5.57.3, `@sveltejs/kit` 3.2, Vite 8.3.8, svelte-check 4.7.8,
  eslint 10.14, prettier 3.10, chokidar 6, all-contributors-cli 7, `@types/node` 26 (TypeScript stays on 6.0).
  Development Node version moved to `lts/lithium` (26).
- Verified: `pnpm install --frozen-lockfile`, `pnpm build` (publint: all good), `pnpm svelte:check` (0 errors),
  `eslint .`, `pnpm _format --list-different`, `link-in-app.ts` against a pnpm copy of the Svelte starter (svelte,
  `@sveltejs/vite-plugin-svelte`, keycloakify and `@keycloakify/svelte` all resolve to the linked copies).

### Files modified

- `package.json`, `pnpm-workspace.yaml` (new), `pnpm-lock.yaml` (new), `yarn.lock` (removed), `.npmrc` (removed)
- `.nvmrc` — `lts/lithium`
- `.github/workflows/ci.yaml` — pnpm setup and install
- `.github/dependabot.yml` — `@types/node` comment follows the Node version
- `scripts/build.ts`, `scripts/watch.ts`, `scripts/shared/postBuild.ts`, `scripts/release.sh` — pnpm commands
- `scripts/link-in-starter.ts`, `scripts/link-in-app.ts` — linking through pnpm overrides
- `.husky/pre-commit` — pnpm commands
- `.gitignore`, `.prettierignore` — yarn entries removed
- `README.md`, `.claude/CLAUDE.md`, `.gemini/GEMINI.md` — pnpm commands

**═══════════════════ v2.0.0 — released 2026-10-04 ═══════════════════**

## [2026-10-04] — SvelteKit 3 migration

**Type:** chore

### Changes

- **No public API change despite the major bump**: the `exports` map is identical to 1.2.0 (no entry added, removed
  or renamed) and the peer ranges stay `svelte ^5.0.0` / `keycloakify ^11.16.1`. The compiled files in the published
  package still use relative imports, so consumer projects need no change. The major version marks the move of the
  library's own toolchain to SvelteKit 3 (`@sveltejs/kit` and `@sveltejs/package` `^3.0.0`, dev only).
- **`eject-page` rewrites internal imports**: the library sources now import each other through the Node subpath
  import `#keycloakify-svelte/*` (declared in `package.json` `imports`) instead of the deprecated SvelteKit
  `@keycloakify/svelte/*` alias. When a page is ejected, those specifiers are mapped back to the public
  `@keycloakify/svelte/*` paths (dropping the `.js` / `/index.js` suffix), so the copied file compiles in the user
  project as before.
- `eject-page` on an account page: the "update your page router" hint printed after ejecting now shows
  `@keycloakify/svelte/account/DefaultPage.svelte` instead of always the login `DefaultPage`.
- Svelte deprecation fixes in the code copied into user projects: the `initialize-account-theme` boilerplate
  `KcPage.svelte` calls `useI18n` once with `untrack(() => kcContext)` instead of inside `$derived`, and `page` is a
  plain typed async function; the story files copied by `add-story` use `<script module>` instead of the deprecated
  `<script context="module">`.
- Internals: `svelte.config.js` removed, its options (preprocess, `runes: true`, `modernAst: true`,
  `appTemplate`) moved to the `sveltekit()` plugin in `vite.config.ts`; `tsconfig.json` extends `$app/tsconfig`;
  `@sveltejs/adapter-auto` dropped; story type-check fixes; dev dependencies updated.

**═══════════════════ v1.2.0 — released 2026-10-04 ═══════════════════**

## [2026-10-04] — Align with keycloakify 11.16.1

**Type:** feat

### Changes

- **Peer dependency `keycloakify` raised to `^11.16.1`** (was `^11.15.1`); `svelte` stays `^5.0.0`.
- **Passkey script options**: the conditional UI scripts of `Login.svelte`, `LoginPassword.svelte` and
  `LoginUsername.svelte` now pass `kcContext.mediation` and `kcContext.authenticatorAttachment` to Keycloak's
  `webauthnAuthenticate.js` / `passkeysConditionalAuth.js`; `WebauthnRegister.svelte` passes `residentKey` (and
  `requireResidentKey` becomes optional) to `registerByWebAuthn`.
- **New exports** `@keycloakify/svelte/login/pages/Login.useScript`, `.../LoginPassword.useScript` and
  `.../LoginUsername.useScript`. The three pages now import their script helper through these public paths instead
  of a relative `./*.useScript` import, so an ejected copy of the page resolves the helper from the library.
- `PasswordWrapper.svelte` accepts an optional `tabindex` for the show/hide password button; `Login.svelte` sets it
  to `4`, right after the password input (`tabindex={3}`), as upstream does.
- `Error.svelte`: the "back to application" link is hidden when `client.baseUrl` is an empty string, not only when
  it is undefined.

**═══════════════════ v1.1.0 — released 2026-09-01 ═══════════════════**

## [2026-09-01] — select-organization and link-idp-action pages, passkey conditional UI, upstream fixes

**Type:** feat

### Changes

- **New `select-organization.ftl` page** (`@keycloakify/svelte/login/pages/SelectOrganization.svelte`), wired into
  the login `DefaultPage`. It lists `kcContext.user.organizations` as buttons (grid layout above 3 entries, reusing
  the `kcFormSocialAccount*` classes) and submits the chosen alias as `kc.org`.
- **New `link-idp-action.ftl` page** (`@keycloakify/svelte/login/pages/LinkIdpAction.svelte`), wired into the
  login `DefaultPage`: shows `linkIdpActionTitle` / `linkIdpActionMessage` for the IdP with Continue and Cancel
  (`cancel-aia`) buttons.
- **Passkey conditional UI on `LoginUsername.svelte` and `LoginPassword.svelte`**, as already done for
  `Login.svelte` in 1.0.1: when `kcContext.enableWebAuthnConditionalUI` is set they render the hidden `webauth` /
  `authn_select` forms and a "passkey-doAuthenticate" button and inject Keycloak's passkey scripts; the username
  input gets `autocomplete="username webauthn"` (it was `off` on `LoginUsername`).
- **`LoginPasskeysConditionalAuthenticate.svelte` fixes**: several labels were printed as the raw snippet instead of
  the translated text; the script now shows the login form or the passkey button depending on passkey availability,
  and uses its own script id instead of reusing `LoginRecoveryAuthnCodeConfig`'s.
- **WebAuthn and recovery-code scripts** (`WebauthnAuthenticate`, `WebauthnRegister`,
  `LoginPasskeysConditionalAuthenticate`, `LoginRecoveryAuthnCodeConfig`): inserted only once, after translations
  have loaded; values are serialized with `JSON.stringify` instead of being pasted between quotes; click listeners
  are registered with `{ once: true }`. `WebauthnRegister.svelte` adds the hidden `authenticatorAttachment` input.
- **i18n**: messages rendered as HTML by `msg` / `advancedMsg` are now passed through `kcSanitize`, and the injected
  style that displays block messages inline now targets `data-kc-msg`, the attribute actually rendered (it targeted
  `data-kc-i18n` before, so it never applied).
- **Template**: the header title and the `loginTitle` document title fall back to `realm.name` when the realm has
  no display name; `loginTitleHtml`, `restartLoginTooltip`, `requiredFields` and `doTryAnotherWay` are rendered with
  `msg` (HTML) instead of `msgStr`. The unused `showAnotherWayIfPresent` prop is removed from `TemplateProps`.
- **User profile form**: `InputTag` and `TextareaTag` update the form state on `input` instead of `change`, so
  validation reacts while typing; `InputTag` reads `html5DataAnnotations` from the attribute instead of its group.
  Group headers are now computed once in `UserProfileFormFields`, and `GroupLabel.svelte` takes an `isGroupStart`
  boolean instead of the `groupNameRef` object (relevant only if you use `GroupLabel` directly).
- Page fixes ported from keycloakify: `LoginOtp` disables the submit button while submitting; `Info` translates
  `messageHeader`; `LogoutOtherSessions` checkbox is no longer pre-checked; `SelectAuthenticator` hides the info
  area instead of the message; `UpdateEmail` applies `kcButtonBlockClass` when the action is *not* app-initiated;
  `WebauthnError` sends the real `execution` value on retry instead of the literal string `${execution}`.
- New type exports: `Attribute` from `@keycloakify/svelte/login/KcContext` and `@keycloakify/svelte/login`, and
  `MessageKey_defaultSet` from `@keycloakify/svelte/login`.
- Dependencies: keycloakify 11.16.0 (dev); peer ranges unchanged.

**═══════════════════ v1.0.1 — released 2026-08-10 ═══════════════════**

## [2026-08-10] — Passkey conditional UI on login page

**Type:** bugfix
**Ref:** https://github.com/keycloakify/keycloakify-svelte/issues/18

### Changes

- **`Login.svelte` now supports WebAuthn conditional UI (passkeys)** like keycloakify's `Login.tsx`: when
  `kcContext.enableWebAuthnConditionalUI` is set, the page renders the hidden `webauth` / `authn_select` forms and
  a "passkey-doAuthenticate" button, injects Keycloak's `webauthnAuthenticate.js` / `passkeysConditionalAuth.js`
  once translations are loaded, and the username input gets `autocomplete="username webauthn"` (PR
  [#19](https://github.com/keycloakify/keycloakify-svelte/pull/19)). The script is not inserted at all when the flag
  is off.
- New `WithPasskeyConditionalUI` story for `login.ftl`.
- Dependencies: keycloakify 11.15.14, Svelte 5.56.8, SvelteKit 2.70 (dev); peer ranges unchanged.

**═══════════════════ v1.0.0 — released 2026-06-06 ═══════════════════**

## [2026-06-06] — First stable release

**Type:** chore

### Changes

- First stable release; same code as 0.2.12. Peer dependencies: `svelte ^5.0.0`, `keycloakify ^11.15.1`. No
  library code changes.

**═══════════════════ v0.2.12 — released 2026-06-06 ═══════════════════**

## [2026-06-06] — CLI bundled with esbuild

**Type:** chore

### Changes

- **The CLI custom handler (`_keycloakify-custom-handler`: eject-page, add-story, update-kc-gen,
  initialize-account-theme) is now bundled with esbuild** into a single minified ESM `keycloakify-svelte/bin/index.js`
  instead of `@vercel/ncc`; the bin TypeScript sources are no longer copied next to it. Prettier stays external, so
  the consumer project's version is still used, and a `createRequire` banner keeps `require()` of Node built-ins
  (e.g. by `cli-select`) working in the ESM bundle.
- Peer dependency ranges unchanged. Internals: TypeScript 6.0, prettier-plugin-svelte 4, Svelte 5.56, SvelteKit 2.63
  (a root `app.html` is added only to satisfy SvelteKit's config loading; it is not published), Claude Code project
  setup.

**═══════════════════ v0.2.11 — released 2026-05-11 ═══════════════════**

## [2026-05-11] — Missing story templates

**Type:** bugfix

### Changes

- Adds the `stories/login/pages/LinkIdpAction.stories.svelte` and `SelectOrganization.stories.svelte` story
  templates. `add-story` lists every login page id known to keycloakify (including `link-idp-action.ftl` and
  `select-organization.ftl`) and copies the matching file from `stories/`, so picking one of these pages previously
  failed because the file did not exist. Note that the library does not ship Svelte page components for these two
  pages yet (the login `DefaultPage.svelte` has no case for them). No library code changes.

**═══════════════════ v0.2.10 — released 2026-05-11 ═══════════════════**

## [2026-05-11] — Vite 8, keycloakify 11.15 peer

**Type:** chore

### Changes

- **Peer dependency `keycloakify` raised to `^11.15.1`** (from `^11.9.4`); `svelte` stays `^5.0.0`.
- Every `.svelte` entry in the `exports` map of `package.json` (pages, components, `DefaultPage.svelte`,
  `Template.svelte`, login and account) now also declares a `default` condition next to `types` and `svelte`, so
  resolvers that do not apply the `svelte` condition can still resolve the components.
- Internals: the repo moves to Vite 8 and `@sveltejs/vite-plugin-svelte` 7; runes mode and the modern AST are enabled
  in `svelte.config.js`; `prepare` also runs `svelte-kit sync`; tsconfig targets ES2022; Svelte MCP server configured
  for Gemini.

**═══════════════════ v0.2.9 — released 2026-03-13 ═══════════════════**

## [2026-03-13] — Register story type import

**Type:** bugfix

### Changes

- The `Register.stories.svelte` story template (copied into projects by `add-story`) now imports `Attribute` from
  `keycloakify/login` with `import type`, so it compiles in projects using `verbatimModuleSyntax`. No library code
  changes.

**═══════════════════ v0.2.8 — released 2026-02-28 ═══════════════════**

## [2026-02-28] — Svelte 5 reactivity fixes, remember-me checkbox

**Type:** bugfix

### Changes

- **Remember-me checkbox spacing**: `Login.svelte` and `LoginUsername.svelte` no longer add the `&nbsp;` (introduced
  in 0.2.2) between the `rememberMe` checkbox and its label.
- **Svelte 5 `state_referenced_locally` warnings fixed across login and account pages, templates and components**:
  values destructured from props, `kcContext`, `$i18n` and `getKcClsx(...)` are now `$derived`, so they follow later
  prop changes instead of being read once at initialization. One-shot initializations (`useSetClassName`,
  `useInitialize`, the `useScript` helpers of the WebAuthn / passkeys / recovery-code pages, `useUserProfileForm`,
  the document title) read their inputs through `untrack(...)`. `GroupLabel.svelte` now computes its group header in
  an `$effect`, and `InputTag.svelte`'s value is `$derived` instead of `$state`.
- `initialize-account-theme`: the generated `KcPage.svelte` / `KcPageStory.svelte` boilerplate uses `$derived` in the
  same way, and the build context passed to `update-kc-gen` now sets `hasEarlyColorSchemeScript: false` for the
  account theme, as required by recent keycloakify versions.
- Peer dependency ranges unchanged. Internals: keycloakify 11.15.1 (dev), Svelte 5.53, ESLint 10; npm publishing
  switched to OIDC trusted publishing (no more `NPM_TOKEN`).

**═══════════════════ v0.2.7 — released 2025-12-02 ═══════════════════**

## [2025-12-02] — CLI prettier resolution

**Type:** bugfix
**Ref:** https://github.com/keycloakify/keycloakify-svelte/issues/10

### Changes

- **CLI prettier resolution**: the bin is built as ESM and ncc turned the conditional `import('prettier')` into an
  unconditional import. The CLI now always loads prettier from the consumer project's `node_modules` (via a path the
  bundler cannot see) and resolves the prettier config from the project root instead of the `node_modules` folder.
- Files for which prettier infers no parser are now left untouched instead of being formatted with an undefined
  parser; when the CLI runs from its `.ts` sources (local development), `node_modules/.bin` is located from the
  nearest `package.json`, and a clear error is thrown when no `node_modules` can be found.

**═══════════════════ v0.2.6 — released 2025-11-16 ═══════════════════**

## [2025-11-16] — Dependency update

**Type:** chore

### Changes

- Dependency update only: Svelte 5.43, keycloakify 11.11.3 (dev), Node LTS "krypton" (24) in `.nvmrc`. No library
  code changes.

**═══════════════════ v0.2.5 — released 2025-09-16 ═══════════════════**

## [2025-09-16] — Dependency update

**Type:** chore

### Changes

- Dependency update: Svelte 5.38, keycloakify 11.9.6 (dev), zod 4.1. `initialize-account-theme`: the zod schema that
  validates the `keycloakify` field of `package.json` now uses the two-argument `z.record(z.string(), z.unknown())`
  form required by zod 4. No other library code changes.

**═══════════════════ v0.2.4 — released 2025-09-11 ═══════════════════**

## [2025-09-11] — keycloakify 11.9.4 peer, build fix

**Type:** chore

### Changes

- **Peer dependency `keycloakify` raised to `^11.9.4`.**
- Internals: `tsx` pinned to 4.20.4 to fix build problems with tsx 4.20.5; husky pre-commit hook running `lint`;
  ESLint config moved to the non-`flat/` `eslint-plugin-svelte` presets; TypeScript 5.9. No library code changes.

**═══════════════════ v0.2.3 — released 2025-08-19 ═══════════════════**

## [2025-08-19] — keycloakify 11.9.3 peer

**Type:** chore

### Changes

- Peer dependency `keycloakify` raised to `^11.9.3`; README badges and all-contributors setup. No library code
  changes.

**═══════════════════ v0.2.2 — released 2025-08-14 ═══════════════════**

## [2025-08-14] — Frontchannel logout and reCAPTCHA (keycloakify #903 follow-up)

**Type:** bugfix
**Ref:** https://github.com/keycloakify/keycloakify/issues/903

### Changes

- **`FrontchannelLogout.svelte`**: the redirect to `logout.logoutRedirectUri` now waits until every client's hidden
  front-channel logout `<iframe>` has fired `load`, instead of redirecting immediately on mount
  (mirrors upstream keycloakify).
- **`Register.svelte`**: the reCAPTCHA button's `data-callback` is now the string `"onSubmitRecaptcha"`, backed by a
  `window.onSubmitRecaptcha` function registered while the page is mounted that calls `requestSubmit()` on the form;
  passing a function as an HTML attribute could not be used by the reCAPTCHA script.
- Svelte lint cleanups across login and account pages and components: keyed `{#each}` blocks, literal `style:`
  values, and `{' '}` separators replaced by `&nbsp;`.
- Internals: `publint --pack npm`, conventional-changelog generator update, Svelte 5.38, SvelteKit 2.29.

**═══════════════════ v0.2.1 — released 2025-08-10 ═══════════════════**

## [2025-08-10] — keycloakify 11.9.2 peer

**Type:** chore

### Changes

- Peer dependency `keycloakify` raised to `^11.9.2` (upstream fixes for `withExtraLanguages` parsing and a validation
  bug). No library code changes.

**═══════════════════ v0.2.0 — released 2025-08-07 ═══════════════════**

## [2025-08-07] — Session polling and requestSubmit (keycloakify #903)

**Type:** bugfix (breaking)
**Ref:** https://github.com/keycloakify/keycloakify/issues/903

### Changes

- **Peer dependency `keycloakify` raised to `^11.9.0`**, whose bundled Keycloak login resources ship the new
  `authChecker.js` API.
- **Login `Template.useInitialize`**: the injected module script now calls `startSessionPolling(ssoLoginInOtherTabsUrl)`
  and, when `kcContext.authenticationSession` is present, `checkAuthSession(authSessionIdHash)`, instead of the
  removed `checkCookiesAndSetTimer`. `KcContextLike` gains the optional `authenticationSession` field.
- Programmatic form submissions now use `requestSubmit()` instead of `submit()`, so `submit` handlers and validation
  run: the "try another way" link in the login `Template.svelte`, the reCAPTCHA callback in `Register.svelte`, the
  auto-submit in `SamlPostForm.svelte` and the retry button in `WebauthnError.svelte`. Ported from the upstream
  keycloakify React implementation.

**═══════════════════ v0.1.12 — released 2025-07-13 ═══════════════════**

## [2025-07-13] — Ejected user profile components use the project's I18n

**Type:** bugfix

### Changes

- **`InputFieldByTypeProps` is now generic** (`InputFieldByTypeProps<I18n>`, exported from
  `@keycloakify/svelte/login/components/InputFieldByTypeProps`): it no longer imports `I18n` from the library's
  `login/i18n`. Instead, `InputFieldByType.svelte`, `InputTag.svelte`, `InputTagSelects.svelte`, `SelectTag.svelte` and
  `TextareaTag.svelte` import `I18n` from `../i18n` and pass it as the type argument. Once ejected into
  `<themeSrc>/login/components/`, these components therefore type `i18n` against the project's own `login/i18n`.
  Code that references `InputFieldByTypeProps` directly must now supply the type argument.
- `eject-page` (`UserProfileFormFields.svelte`): reverts the 0.1.11 change. `InputFieldByTypeProps.ts` and
  `UserProfileFormFieldsProps.ts` are no longer copied into the project, so the ejected components import these types
  from `@keycloakify/svelte` again.

**═══════════════════ v0.1.11 — released 2025-07-13 ═══════════════════**

## [2025-07-13] — eject-page also copies the props types

**Type:** bugfix

### Changes

- `eject-page` (`UserProfileFormFields.svelte`): `InputFieldByTypeProps.ts` and `UserProfileFormFieldsProps.ts` are
  now copied into `<themeSrc>/login/components/` too. The ejected components' imports of these types are rewritten to
  the local copies. This was reverted in 0.1.12.

**═══════════════════ v0.1.10 — released 2025-07-13 ═══════════════════**

## [2025-07-13] — eject-page: UserProfileFormFields ejects the whole component set

**Type:** bugfix

### Changes

- **`eject-page` fix for `UserProfileFormFields.svelte`**: the command read the source from `src/login/` instead of
  `src/login/components/`, so ejection failed. It now copies `UserProfileFormFields.svelte` and all the components it
  depends on (`InputFieldByType`, `LogoutOtherSessions`, `PasswordWrapper`, `AddRemoveButtonsMultiValuedAttribute`,
  `SelectTag`, `FieldErrors`, `InputTag`, `TermsAcceptance`, `GroupLabel`, `InputTagSelects`, `TextareaTag`) into
  `<themeSrc>/login/components/`. Their `@keycloakify/svelte/login/components/*` imports are rewritten to `./*`, so
  the ejected copies use each other.
- `KcPage.svelte` is now updated correctly after this ejection: the import
  `@keycloakify/svelte/login/components/UserProfileFormFields` is replaced with `./components/UserProfileFormFields`.
  The old code looked for `@keycloakify/svelte/login/UserProfileFormFields`, a path that does not exist.
- Dev dependencies: Svelte 5.35, keycloakify 11.8.50, Vite 7, zod 4 (peer ranges unchanged).

**═══════════════════ v0.1.9 — released 2025-07-03 ═══════════════════**

## [2025-07-03] — Terms text rendering, eject-page snippet

**Type:** bugfix
**Ref:** https://github.com/keycloakify/keycloakify-svelte/pull/4

### Changes

- **`Terms.svelte` (`terms.ftl`)**: `termsText` is now rendered with `{@render msg('termsText')()}`. The page used to
  interpolate the snippet object itself, so the terms text did not show up.
- `eject-page`: the `KcPage.svelte` routing snippet printed after ejecting a page had a stray double quote
  (`import('./pages/X.svelte"')`). It is fixed.

**═══════════════════ v0.1.8 — released 2025-05-16 ═══════════════════**

## [2025-05-16] — Hidden user profile attributes

**Type:** bugfix

### Changes

- **User profile attributes annotated with `inputType: hidden`** are now rendered by `InputFieldByType.svelte` as
  `<input type="hidden" name={attribute.name} value=…>`. `UserProfileFormFields.svelte` hides their form group
  (`display: none`) in the same way as a non-confirmed `password-confirm`.
- The ad-hoc hidden `locale` input added in 0.1.7 is removed from `UserProfileFormFields.svelte`, replaced by the
  generic hidden-input support above.
- CLI internals: when the library is linked for local development (version `0.0.0-*`), prettier is also loaded from an
  ESM context through a dynamic `import()`.
- Dev dependencies: Svelte 5.30, keycloakify 11.8.27 (peer ranges unchanged).

**═══════════════════ v0.1.7 — released 2025-03-14 ═══════════════════**

## [2025-03-14] — Locale preserved on user profile forms

**Type:** bugfix
**Ref:** https://github.com/keycloak/keycloak/issues/38029

### Changes

- `UserProfileFormFields.svelte` adds a hidden `locale` input that holds the current language tag
  (`$i18n.currentLanguage.languageTag`). It is added when `kcContext.locale` is defined and the user profile does not
  already contain a `locale` attribute, so the selected language is submitted with the form (workaround for Keycloak
  issue 38029).
- Dev dependencies: keycloakify 11.8.21, Svelte 5.23 (peer ranges unchanged).

**═══════════════════ v0.1.6 — released 2025-03-10 ═══════════════════**

## [2025-03-10] — Dependency update

**Type:** chore

### Changes

- Dependency update only: Svelte 5.22, keycloakify 11.8.17 (dev), TypeScript 5.8, eslint-plugin-svelte 3 (peer ranges
  unchanged). No library code changes.

**═══════════════════ v0.1.5 — released 2025-02-18 ═══════════════════**

## [2025-02-18] — CLI root detection

**Type:** bugfix

### Changes

- CLI (`_keycloakify-custom-handler`): the package root is now found by looking for the `LICENSE` file. The old check
  looked for a `package.json` in a directory whose path did not contain `/bin`. This lookup is used to locate the
  sources copied by `eject-page`, `add-story` and `initialize-account-theme`, and it is more reliable when keycloakify
  delegates the command to this package.

**═══════════════════ v0.1.4 — released 2025-01-24 ═══════════════════**

## [2025-01-24] — Bin sources shipped, dependency update

**Type:** bugfix

### Changes

- **The published package now includes `src/bin` and `src/tools`**: the `!src/bin` / `!src/tools` exclusions were
  removed from the `files` field. `initialize-account-theme` copies its boilerplate from
  `src/bin/initialize-account-theme/boilerplate`, so it needs those files in the package.
- Dev dependencies: Svelte 5.19, keycloakify 11.8.9, Vite 6, SvelteKit 2.16 (peer ranges unchanged).
- Internals: `yarn release` / `yarn changelog` scripts (conventional-changelog) and a `CHANGELOG.md` were added, and
  the login `KcPage.svelte` story was reformatted.

**═══════════════════ v0.1.3 — released 2025-01-03 ═══════════════════**

## [2025-01-03] — Simpler account i18n boilerplate

**Type:** chore

### Changes

- `initialize-account-theme` boilerplate `i18n.ts`: builds with `i18nBuilder.withThemeName<ThemeName>().build()` and
  links to https://docs.keycloakify.dev/features/i18n. The empty `withExtraLanguages({})` /
  `withCustomTranslations({})` calls are gone.

**═══════════════════ v0.1.2 — released 2025-01-03 ═══════════════════**

## [2025-01-03] — eject-page: "page not listed" option

**Type:** feat

### Changes

- `eject-page`: the page selector (login and account) ends with a new "The page you're looking for isn't listed here"
  entry. Choosing it prints a link to the docs on styling a page that is not part of base Keycloak (for example one
  added by a third-party extension) and exits without changes.

**═══════════════════ v0.1.1 — released 2025-01-02 ═══════════════════**

## [2025-01-02] — Inline wrapper for i18n HTML messages

**Type:** bugfix

### Changes

- Login `useI18n`: messages rendered as HTML snippets (`data-kc-msg`) are now wrapped in a `<span>`. They fall back to a
  `<div>` only when the message contains block-level markup (`<div`, `<section`, `<article`, `<ul`, `<ol`). The injected
  `display: inline-block` rule now applies only to `div[data-kc-msg]`, so plain messages lay out inline like in the
  React version and no longer produce invalid nesting (e.g. a `<div>` inside a `<span>` or `<label>`).

**═══════════════════ v0.1.0 — released 2024-12-30 ═══════════════════**

## [2024-12-30] — Initial release

**Type:** feat

### Changes

- **First stable release of `@keycloakify/svelte`**: Svelte 5 (runes) components for building Keycloak themes with
  Keycloakify, ported page by page from Keycloakify's React implementation. Peer dependencies: `svelte ^5.0.0`,
  `keycloakify ^11.7.0`.
- **Login theme** (`@keycloakify/svelte/login`, which exports `i18nBuilder` and the `ExtendKcContext` type):
  `Template.svelte`, `DefaultPage.svelte` (dispatches on `kcContext.pageId`), `KcContext`, `i18n`, the
  `lib/useUserProfileForm` engine and 36 page components under `@keycloakify/svelte/login/pages/*`. The pages include
  `Login`, `Register`, `LoginUsername`, `LoginPassword`, `LoginResetPassword`, `LoginUpdatePassword`,
  `LoginUpdateProfile`, `IdpReviewUserProfile`, `UpdateEmail`, OTP/TOTP, WebAuthn and passkey pages, `Terms`, `Info`,
  `Error` and `SamlPostForm`.
- **User profile form components** under `@keycloakify/svelte/login/components/*`: `UserProfileFormFields.svelte`
  plus `InputFieldByType`, `InputTag`, `InputTagSelects`, `SelectTag`, `TextareaTag`, `PasswordWrapper`,
  `FieldErrors`, `GroupLabel`, `TermsAcceptance`, `LogoutOtherSessions`, `AddRemoveButtonsMultiValuedAttribute`, and
  their `*Props` types.
- **Account theme** (`@keycloakify/svelte/account`): `Template.svelte`, `DefaultPage.svelte`, `KcContext`, `i18n` and
  the pages `Account`, `Applications`, `FederatedIdentity`, `Log`, `Password`, `Sessions`, `Totp`.
- **React-hook shims** on Svelte stores under `@keycloakify/svelte/tools/*` (`useState`, `useReducer`, `useConst`,
  `useSetClassName`, `useInsertLinkTags`, `useInsertScriptTags`) keep the ported pages close to the React source.
- **Keycloakify CLI custom handler** (`_keycloakify-custom-handler`, bundled with ncc): `eject-page` (copies a page,
  `Template.svelte` or `UserProfileFormFields.svelte` into the project and updates `KcPage.svelte`), `add-story`
  (copies a page's `*.stories.svelte`), `update-kc-gen` (generates `kc.gen.ts` / `kc.gen.svelte`) and
  `initialize-account-theme`. `initialize-admin-theme` exits with "Cannot create an admin theme when using Svelte."
- Storybook stories (`*.stories.svelte`) for every login and account page are shipped under `stories/`.
