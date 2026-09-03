---
'@verdaccio/ui-components': patch
---

Harden the web forms: rapid repeated submits (clicks landing in the same React batch, before `disabled` re-renders) fired duplicate login/signup/change-password requests — submission is now reentrancy-guarded; and an invalid email on the create-user form silently kept the submit button disabled with no visible reason — it now shows a translated validation message. Backed by a new adversarial test battery (server 500/429/network failures, garbage 2xx bodies, hostile validation input, double submits, and garbage semver ranges in the versions filter).
