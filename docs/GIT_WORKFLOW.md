# 🌿 Git Workflow & Branching Strategy

This document outlines the branching models, commit message specifications, Pull Request (PR) guidelines, and automated release mechanics for **Nexora IPTV Global**. All contributors and maintainers must strictly follow these protocols.

---

## 🗺️ 1. Branching Strategy

We use a structured branch layout optimized for continuous integration and high deployment stability.

```
                  ┌───────────────┐
                  │  main (Prod)  │◀──────────────────────────────┐
                  └───────┬───────┘                               │ (Release Merge)
                          │                                       │
                          ▼ (Fork / Clone)                        │
                  ┌───────────────┐                               │
                  │    develop    │◀──────────────┬────────┐      │
                  └───────┬───────┘               │        │      │
                          │                       │        │      │
           (New Feature)  ▼          (Bug Fix)    ▼        │      │
                     ┌─────────┐             ┌─────────┐   │      │
                     │ feature │             │ bugfix  │   │      │
                     └────┬────┘             └────┬────┘   │      │
                          │                       │        │      │
                          └───────────┬───────────┘        │      │
                                      ▼ (Pull Request)     │      │
                                 [Code Review] ────────────┘      │
                                                                  │
                                      ┌────────────────────────┐  │
                                      │ release/vX.Y.Z (Stage) ├──┘
                                      └────────────────────────┘
```

### Core Branches
- **`main`**: The production branch. It contains only highly stable, compiled, and tested code. Every commit on `main` represents an official deployment candidate. Direct commits are **blocked**; changes are only introduced via vetted release merges.
- **`develop`**: The primary integration branch. Features under current development cycles are merged here first. It serves as the baseline for pre-production test suites.

### Supporting Branches
- **`feature/<issue-id>-<short-description>`**: Used to develop new components, pages, or features. E.g., `feature/241-xtream-api`.
- **`bugfix/<issue-id>-<short-description>`**: Used for scheduled bug resolution or structural fixes. E.g., `bugfix/118-hls-buffer-drift`.
- **`hotfix/<issue-id>-<short-description>`**: Emergency patches to address critical vulnerabilities or active site crashes in production. Hotfixes branch directly from `main` and merge back into both `main` and `develop` concurrently.
- **`release/v<Major>.<Minor>.<Patch>`**: Ephemeral staging branches used to run compiler checks, finalize changelogs, and prepare tagging routines.

---

## 💬 2. Commit Message Convention

Nexora follows the **Conventional Commits** standard (v1.0.0). This enables automated changelog generation and maintains clear repository histories.

### Commit Format
```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types
- **`feat`**: A new feature (e.g., `feat(player): add audio track selector widget`)
- **`fix`**: A bug fix (e.g., `fix(parser): resolve crash on empty M3U groups`)
- **`docs`**: Documentation changes only (e.g., `docs(readme): add docker run instructions`)
- **`style`**: Changes that do not affect the meaning of the code (white-space, formatting, semi-colons)
- **`refactor`**: A code change that neither fixes a bug nor adds a feature (e.g., `refactor(context): optimize localstorage sync throttle`)
- **`perf`**: A code change that improves performance (e.g., `perf(parser): speed up regex matches by 40%`)
- **`test`**: Adding missing tests or correcting existing tests (e.g., `test(parser): add test cases for multi-line tvg-logo`)
- **`chore`**: Updates to build tasks, package configurations, or dependencies (e.g., `chore(deps): update hls.js to v1.5.0`)

### Example Commits
```bash
feat(player): implement play-pause toggle via Space keybind

Resolves buffering layout latency issues by binding native window listeners.
Closes #84
```

```bash
fix(ui): prevent sidebar overflow on small screen heights

Signed-off-by: Developer Name <dev@nexora-iptv.example.com>
```

---

## 🔀 3. Pull Request Workflow

All code contributions must go through the formal Pull Request (PR) pipeline before landing in `develop` or `main`.

1. **Keep it Small**: A single PR should address exactly one issue, feature, or bug fix.
2. **Rebase Frequently**: Always rebase your branch against the latest upstream `develop` to resolve merge conflicts early.
3. **Draft PRs**: If your feature is still in progress, open it as a "Draft Pull Request" to share progress and get architectural feedback early.
4. **Complete the Template**: Fill out the [PR Template](../.github/PULL_REQUEST_TEMPLATE.md) completely, attaching any relevant visual screenshots.

---

## 🚀 4. Release Workflow

When release milestones are reached (detailed in `docs/ROADMAP.md`):

1. **Cut Staging Branch**: Spin up `release/vX.Y.Z` from `develop`.
2. **Version Bump**: Update version tags in `package.json` and adjust the configuration files.
3. **Update Changelog**: Append release summaries into `docs/CHANGELOG.md` under the appropriate version heading.
4. **Freeze & Verify**: Run full linting, unit tests, and production builds:
   ```bash
   npm run lint
   npm run test
   npm run build
   ```
5. **Merge & Tag**: Create a pull request to merge `release/vX.Y.Z` into `main`. Once merged, tag the commit:
   ```bash
   git tag -a vX.Y.Z -m "Release vX.Y.Z"
   git push origin vX.Y.Z
   ```
6. **Backport**: Merge the release branch back into `develop` to ensure version bumps are fully synced.
