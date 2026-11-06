These are the ideas I build by. Each one comes from something I shipped, and links to where I wrote about it.

## Architecture and security

The essays behind these four are collected in [security by construction](/security-by-construction/).

1. **Enforce it in the system, not in a policy.** A rule that lives in a document gets forgotten under pressure. If something must never happen, build the system so it refuses. ([Stop Defending Your Moat with Policy](https://lodos.md/en/blog/make-your-moat-a-ratchet))
2. **"We cannot" beats "we promise".** Zero-knowledge is architecture, not a privacy policy: design the schema so the operator cannot see what it should not, instead of promising not to look. ([Zero-Knowledge as Architectural Blindness](https://lodos.md/en/blog/zero-knowledge-architectural-blindness))
3. **The safest hole is the one that isn't there.** Locking a dangerous capability better is weaker than not having it at all. ([We Built a Workflow Engine That Can't Have n8n's CVE](https://lodos.md/en/blog/workflow-engine-cant-have-n8n-cve))
4. **Security is a build step.** In lodos.md, 175 security rules run on every build; if one breaks, the release does not ship. ([lodos.md](/lodos/))

## Performance

5. **Measure, don't guess.** The first instinct about what is slow is usually wrong. Running NFS World in the browser, the GPU was not the bottleneck; the game's own thread was. ([NFS World in the Browser](/blog/nfs-world-in-the-browser-performance/))
6. **Set the bar in numbers, and name what you won't trade.** "Never below 60 fps, aim for 144", with graphics kept 1:1 with the original: a target you can measure and a constraint you don't give up to hit it. ([NFS World in the Browser](/blog/nfs-world-in-the-browser-performance/))

## AI and companies

7. **AI should run the work; the founder sets the direction.** A small company's growth shouldn't depend on its founder working more hours. ([lodos.md](/lodos/))
8. **Some decisions never go to the AI.** Granting permissions, raising its own autonomy and declaring a job "done" stay with people. ([lodos.md](/lodos/))
9. **Memory you can read beats memory you have to trust.** What an AI knows about a company should be pages a person can read and correct, not a hidden summary. ([lodos.md](/lodos/))
10. **Your data stays yours.** Local-first, end-to-end encrypted and without telemetry, so the vendor, us included, cannot see it. ([lodos.md](/lodos/))
