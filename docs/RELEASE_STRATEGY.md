# Release Strategy

This document outlines the release cycles, branching model, hotfix procedures, and automated delivery pipelines for **Nexora IPTV Global**.

---

## 🗺️ Branching Architecture

We follow a structured branch-per-release system to keep our production codebase highly stable.

- **`main`**: Represents our production-ready stable branch. All official releases (`v1.x`, `v2.x`) are tagged directly on this branch.
- **`develop`**: The integration branch for current sprint features. Feature branches merge into `develop` first.
- **`feature/*`**: Short-lived branches dedicated to individual items. E.g., `feature/xtream-codes`.
- **`hotfix/*`**: Emergency patches addressing severe production crashes or security issues. Merges directly into `main` and `develop`.

---

## 🔄 Release Lifecycle

```
[Feature Branches] ──> [develop] ──> [Release Candidate (RC)] ──> [main] (Tagged Release)
```

### 1. Release Planning
- Stable minor releases (e.g., `v2.5.0`) occur on a **bi-weekly cycle**.
- Patch releases are shipped on an as-needed basis depending on critical streaming player bugs.

### 2. Pre-Release Preparation
- Once features are consolidated on `develop`, a release branch `release/vX.Y.Z` is created.
- Automated linting, build runs, and test suites must pass:
  ```bash
  npm run lint
  npm run test
  npm run build
  ```
- **Changelog**: Compile notes from git commits and append to `docs/CHANGELOG.md` under a new version heading.

### 3. Tagging and Finalizing
- Merge the release branch into `main` and tag with a SemVer descriptor:
  ```bash
  git checkout main
  git merge release/vX.Y.Z
  git tag -a vX.Y.Z -m "Release vX.Y.Z"
  git push origin main --tags
  ```

---

## 🚀 Deployment Pipelines

Our continuous integration runner automates production tasks on tag creation:

1. **Verify**: Run full Jest test coverage and ES-Lint parsing.
2. **Compile**: Optimize scripts, compile CSS via PostCSS, and output Next.js assets.
3. **Deploy**: Push build artifacts to secure servers or container systems.
