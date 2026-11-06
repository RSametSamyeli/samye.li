Most software is secured by promises: a policy that says secrets are never logged, a review that checks nobody added `eval`. Promises hold until a late-night refactor. Security by construction means building the system so the unsafe thing cannot happen at all, and making the build prove it on every commit.

This is the idea behind [lodos.md](/lodos/), and a series of essays on how it works in practice. They are published on the lodos.md blog.

## The series

1. **[We Built a Workflow Engine That Can't Have n8n's CVE](https://lodos.md/en/blog/workflow-engine-cant-have-n8n-cve)** (1/5). n8n's CVE-2025-68613 was a CVSS 9.9 remote code execution through expression evaluation. The lodos workflow engine has no expression evaluator anywhere, so that class of bug cannot exist; a grep in the build keeps it that way.
2. **[Zero-Knowledge as Architectural Blindness](https://lodos.md/en/blog/zero-knowledge-architectural-blindness)** (2/5). The AI cannot see your Stripe live key: no database column, IPC method or tool returns a plaintext secret. "Cannot" is a property of the schema, not a promise.
3. **[Stop Defending Your Moat with Policy](https://lodos.md/en/blog/make-your-moat-a-ratchet)** (3/5). Two checks run on every commit: one fails the build if a refused capability comes back, the other fails the wiki if a lesson is lost. Both are sealed in a tamper-evident HMAC chain.
4. **Coming next** (4/5): the propose-only learning loop, where the agent suggests changes to its own skills and nothing becomes canonical until a person approves the diff.

## Around it

- **[Why we built a zero-knowledge company OS](https://lodos.md/en/blog/the-zero-knowledge-company-os)**: why lodos keeps a company's data on its own machine and cannot read a byte of it.
- **[How your AI uses your Stripe key without ever seeing it](https://lodos.md/en/blog/ai-that-cant-read-your-secrets)**: the runtime secret-injection pattern behind the vault.
- **[Local-first software](https://lodos.md/en/blog/local-first-software-own-your-data)**: why your company's data belongs on your machine.
- **[A wiki that maintains itself](https://lodos.md/en/blog/self-maintaining-wiki-karpathy-pattern)**: the Karpathy LLM-wiki pattern, with lint and an audit chain.

## The principles

The rules this series keeps coming back to are on [beliefs](/beliefs/): enforce it in the system, not in a policy; "we cannot" beats "we promise"; the safest hole is the one that isn't there; and security is a build step.
