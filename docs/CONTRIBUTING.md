# Contributing to Nexora IPTV Global

Thank you for your interest in contributing to Nexora IPTV Global! We welcome and appreciate contributions of all kinds, whether you are fixing bugs, adding new features, improving documentation, or offering design suggestions.

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

---

## 🛠️ Getting Started

1. **Fork the Repository**: Create a fork of the Nexora repository on your GitHub account.
2. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/nexora-iptv-global.git
   cd nexora-iptv-global
   ```
3. **Install Dependencies**:
   ```bash
   npm install
   ```
4. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/your-awesome-feature
   ```

---

## 📐 Development Guidelines

- **TypeScript**: Nexora is built with strict TypeScript. Ensure all variables, arguments, and return types are fully typed. Do not use `any` unless absolutely necessary and documented.
- **Styling**: Always use **Tailwind CSS v4** utility classes. Do not write raw CSS or use custom stylesheets.
- **Icons**: Import all icons from `lucide-react`. Never embed inline custom SVGs.
- **Animations**: Use the modern `motion/react` package for component transitions.
- **Testing**: Write unit and integration tests using Jest. Ensure all tests pass prior to submitting a Pull Request:
  ```bash
  npm run test
  ```
- **Linting**: Run the linter to verify code compliance:
  ```bash
  npm run lint
  ```

---

## 📥 Submission Process

### 1. Creating a Pull Request (PR)
- Direct your pull request to the `main` branch.
- Ensure your branch is fully rebased with the upstream `main` branch before submitting.
- Fill out the provided [Pull Request Template](../.github/PULL_REQUEST_TEMPLATE.md) completely.
- Keep PRs targeted: a single PR should address exactly one bug fix or feature.

### 2. Code Review & Approval
- At least one core maintainer must review and approve your code.
- Address any requested changes or review feedback promptly.
- Once approved, your code will be merged into the master stream!

---

## 🐞 Reporting Issues
- Use our [Bug Report Template](../.github/ISSUE_TEMPLATE/bug_report.md) to report bugs.
- Clearly describe the steps to reproduce the issue, expected behavior, and actual outcome.
- Attach any relevant logs or screenshot evidence to assist in diagnosis.

We are excited to see your contributions! Happy Coding! 🚀
