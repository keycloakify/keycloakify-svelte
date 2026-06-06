# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`@keycloakify/svelte` is the Svelte 5 component library for [Keycloakify](https://keycloakify.dev) — it provides Svelte ports of Keycloak's `login` and `account` theme pages so users can build custom Keycloak themes in Svelte. The core (`keycloakify`) is a React-first project; this repo mirrors its structure, page-by-page, in Svelte. When a behavior is unclear, the source of truth is the corresponding file in the `keycloakify` package (see `node_modules/keycloakify`).

The published package is **not** this repo's root — it is built into `dist/` and published from there (see `scripts/build.ts`). Consumers import from subpaths like `@keycloakify/svelte/login/pages/Login.svelte`, each declared explicitly in the `exports` map in `package.json`.

## Commands

```bash
yarn install            # uses yarn (see .npmrc / packageManager); Node = .nvmrc (lts/krypton)

yarn build              # full production build into dist/ (svelte-package + ncc bin + publint)
yarn watch              # incremental build into dist/, stamps a 0.0.0-rc.<timestamp> version
yarn svelte:check       # type-check (.svelte + .ts) via svelte-check
yarn svelte:check:watch
yarn lint               # prettier --write then eslint --fix  (this is what runs on pre-commit)
yarn format             # prettier --write only

# Local development against a real theme project:
yarn link-in-starter    # prompts to pick a checked-out keycloakify-starter-svelte; live-links the lib
```

There is **no unit test runner**. Verification is done via type-checking (`yarn svelte:check`), the Storybook-style `*.stories.svelte` files under `stories/`, and visual checks in a linked starter project. The husky `pre-commit` hook runs `yarn lint`.

## Architecture

### Two theme types, parallel structure

`src/login/` and `src/account/` are independent and structurally identical:

- `Template.svelte` + `Template.useInitialize.ts` — page shell; `useInitialize` loads PatternFly CSS and `<script>`/`<link>` tags into the document head.
- `DefaultPage.svelte` — dispatches to the correct page component based on `kcContext.pageId`.
- `KcContext/` — TypeScript types describing the data Keycloak injects (mirrors keycloakify's `KcContext`). `ExtendKcContext` is the extension point consumers use.
- `i18n/` — `i18nBuilder.ts` (the public builder), `i18n.ts`, `useI18n.ts`. Re-exported from `src/<type>/index.ts`.
- `pages/*.svelte` — one component per Keycloak page (e.g. `Login.svelte`, `LoginResetPassword.svelte`).
- `login/components/` — shared form pieces, notably `UserProfileFormFields.svelte` + `lib/useUserProfileForm.ts` (the dynamic user-profile form engine, ported from keycloakify).

`PageProps.ts` / `TemplateProps.ts` define the prop contracts every page/template conforms to.

### React-hook shims (`src/tools/`)

Because pages are mechanically ported from keycloakify's React source, React hook idioms are reimplemented on Svelte stores so the porting stays close to the original:

- `useState` / `useReducer` — return `[Readable<T>, dispatch]` backed by Svelte `writable`/`derived`.
- `useConst`, `useSetClassName`, `useInsertLinkTags`, `useInsertScriptTags`.

Each is its own package export under `@keycloakify/svelte/tools/*`. Prefer reusing these shims over hand-writing store logic in ported pages, to keep diffs against the React source legible.

### The CLI (`src/bin/`)

This package registers a Keycloakify **custom handler** binary named `_keycloakify-custom-handler` (`BIN_NAME`, see `package.json` `bin`). Keycloakify's main CLI delegates framework-specific subcommands to it. `src/bin/main.ts` is the dispatcher; commands:

- `add-story`, `eject-page` — scaffold a story / eject a page component into the user's project.
- `update-kc-gen`, `initialize-account-theme`.
- `initialize-admin-theme` → intentionally errors (no admin theme support in Svelte).

`src/bin/core.ts` re-exports the contract (types, constants, `readParams`) from `keycloakify/bin/shared/*` — that is the integration seam with the core project. The bin is bundled with `@vercel/ncc` during `postBuild` (`scripts/shared/postBuild.ts`) into a single executable.

### Build pipeline

`yarn build` (`scripts/build.ts`): `svelte-kit sync` → `svelte-package` (compiles `src/` → `dist/keycloakify-svelte/`) → copies `package.json`/`LICENSE`/`README`/`src`/`stories` into `dist/` → `publint` → removes the un-bundled bin → `postBuild()` (ncc-bundles the bin and rewrites `package.json` `bin`). The package is then published from `dist/`.

### Stories

`stories/` holds `*.stories.svelte` files plus `kc.gen.ts`/`kc.gen.svelte` (a checked-in mock of the Keycloakify-generated context) and per-type `KcContext.ts` mocks. Stories are how pages are exercised during development. When adding/changing a page, keep its story in sync (`fix: missing stories` is a recurring commit theme).

## Conventions

- **Svelte 5 runes mode is enforced** (`svelte.config.js` sets `runes: true`, `modernAst: true`). Write runes (`$state`, `$props`, `$derived`, `$effect`), not legacy reactive syntax.
- **Mirror keycloakify.** When porting or fixing a page, diff against the equivalent React file in the `keycloakify` package and stay structurally faithful — that is why the hook shims exist.
- **New page/tool exports must be added to the `exports` map in `package.json`** (each entry is explicit; there is no wildcard). The build does not auto-generate these.
- Path aliases: `@keycloakify/svelte` → `src` (and `@keycloakify/svelte/*` → `src/*`), configured in `svelte.config.js`.
- Releases: `scripts/release.sh` (via `yarn release`) — main-branch only, bumps version, regenerates `CHANGELOG.md` (conventional-commits/angular), commits, pushes. Commit messages follow Conventional Commits.
- A Svelte MCP server is configured (`.gemini/`) for Svelte 5 / SvelteKit docs and a `svelte-autofixer`; use it when authoring Svelte to validate idioms.

## Decision Protocol

When analysis reveals multiple valid implementation approaches, always stop and present the options clearly before writing any code. Wait for explicit confirmation of which approach to take. Never pick one unilaterally.

@AGENTS.md
