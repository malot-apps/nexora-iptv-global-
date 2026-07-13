# Security Policy

We take the security of Nexora IPTV Global seriously. This document outlines our policy on reporting, managing, and resolving security vulnerabilities.

---

## Supported Versions

Only the latest major and minor stable versions of Nexora receive security updates.

| Version | Supported          |
| ------- | ------------------ |
| v2.4.x  | ✅ Yes             |
| v2.3.x  | ❌ No              |
| < v2.2  | ❌ No              |

---

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.** Instead, report them privately to ensure the safety of our users.

1. **Email Reports**: Send a detailed description of the vulnerability to [security@nexora-iptv.example.com](mailto:security@nexora-iptv.example.com).
2. **Details to Include**:
   - Step-by-step instructions to reproduce the vulnerability (including PoC if available).
   - The impact of the vulnerability (e.g., Cross-Site Scripting, prototype pollution).
   - Any proposed remediation or patches.

---

## Disclosure Process

We follow a coordinated disclosure model:

1. **Acknowledgment**: We will acknowledge receipt of your report within **48 hours**.
2. **Triaging**: Our core team will evaluate the report, verify the issue, and assign a severity score.
3. **Remediation**: If verified, we will work on a fix. This process typically takes between 7 to 14 business days.
4. **Release**: We will release a security advisory along with a patched version (e.g., `v2.4.1`) and credit you for the discovery.
