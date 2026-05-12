# AGENTS.md — fSpy Project Guide

## Project Overview

fSpy is a cross-platform Electron 42 desktop application for camera matching from still images. It uses React 18, Konva 9 / react-konva 18 for canvas rendering, Redux 5 for state management, and Webpack 5 for bundling. TypeScript 5.8 with strict mode. Licensed under GPL-3.0.

## Architecture

### Process model

- **Main process** (`src/main/index.ts`): Electron lifecycle, window management, IPC handlers, all file system access.
- **Preload script** (`src/main/preload.ts`): Uses `contextBridge.exposeInMainWorld('electronAPI', ...)` to expose a typed API surface to the renderer. Kept minimal.
- **Renderer** (`src/gui/`): React/Redux UI. Has **no** direct access to Node.js APIs or Electron internals — all system access goes through `window.electronAPI`.

### Security model

- `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`.
- No `remote` module. No `eval()` or `new Function()` in renderer code.
- IPC pattern: `ipcMain.handle` / `ipcRenderer.invoke` for request-response; `ipcMain.on` / `ipcRenderer.send` for fire-and-forget.
- Do not expose raw `ipcRenderer` to the renderer. Add new IPC channels to `src/main/preload.ts` and `src/gui/types/electron-api.ts`.

### Build targets

Webpack produces three bundles (see `webpack.config.js`):
1. `main` — target `electron-main`
2. `gui` — target `web` (renderer, no Node.js externals)
3. `preload` — target `electron-preload`

## Code Style

- TypeScript strict mode. Do not add `@ts-ignore` or `any` to work around type issues — fix the types properly.
- Prefer `const` over `let`. Never use `var`.
- Use ES module import syntax (`import`/`export`), not `require()`, in TypeScript source files.
- Indent with 2 spaces. LF line endings.
- Do not add comments or JSDoc to unchanged code.
- Do not refactor or "improve" code beyond what is necessary for the task at hand.

## Component Patterns

- Existing class components do not need to be converted to function components unless required by a dependency change.
- Do not introduce new class components. Any new code should use function components with hooks.
- Redux: existing `connect()` + `legacy_createStore` pattern is in use. Action type strings are stable — do not rename them.

## Project File Format

- The `.fspy` binary format is documented in `project_file_format.md` and must remain backward-compatible.
- Existing `.fspy` files in `test_data/` must load correctly after any code changes.
- File I/O in the renderer uses `DataView`/`Uint8Array`/`TextEncoder`/`TextDecoder` (no `Buffer`).

## Testing

- Tests live in `tests/` and run via Jest 29 + ts-jest. Config in `jest.config.js`.
- Run: `npm test`.
- Test with the `.fspy` files in `test_data/` to verify project file compatibility.

## Dependencies

- **License**: GPL-3.0. Do not introduce dependencies with incompatible licenses (SSPL, proprietary, AGPL). Prefer MIT/Apache-2.0/BSD/ISC.
- Pin major versions in `package.json` (e.g., `^5.8.0`, not `*` or `latest`).
- Run `npm audit` after dependency changes and fix critical/high vulnerabilities before merging.
- Prefer well-maintained packages with recent releases.

## File Structure

- Do not restructure the `src/` directory layout unless a dependency requires it.
- Preload script source: `src/main/preload.ts`.
- Electron API type definitions: `src/gui/types/electron-api.ts`.
