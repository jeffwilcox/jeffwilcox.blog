---
layout: post
comments: true
title: "Protect your GitHub App private keys with Azure Key Vault and remote JWT signing"
categories: [open-source, azure, github]
tags: [github, azure, keyvault, security, octokit, typescript, nodejs, opensource]
---

GitHub App devs, this is for you... if you're in the Microsoft world, a GitHub App
is basically an Entra ID service principal. ("Entra ID, AAD, etc.")

The private key is the most sensitive credential in the entire system, since paired
with an associated installation ID, that's what generates a short-lived installation
token for all the things.

Where I work, we operate GitHub Apps at scale across our official
organizations; we've learned that the best practice is straightforward:
**minimize the time between generating a new app private key and getting it into
a cloud key management service like Azure Key Vault** — and then never let the
raw key material touch your application at runtime.

Unfortunately, many teams still regularly just use the private keys from apps as
'secrets' or something to be used in the process itself.

Let's do better!

## The problem with local keys

GitHub's documentation today on
[managing private keys for GitHub Apps](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/managing-private-keys-for-github-apps#storing-private-keys)
explicitly recommends storing private keys in a Key Vault (or equivalent) and using signing at
runtime rather than loading the key directly. But in practice, most people
gloss over this advice: many tutorials and SDK samples show
the simplest path: download the PEM file, store it as an environment variable
or secret, and use it directly in your app to sign JWTs. This works, but it
means your private key is sitting in memory on your service nodes, on your dev's
laptop, or in a CI/CD secret store — all places where it could be exfiltrated.

GitHub Apps today don't support secretless token
exchange (OIDC), but I'm hopeful for the future.

## Remote JWT signing with Azure Key Vault

We use Key Vault-powered JWT signing for many of our GitHub Apps at Microsoft.
Instead of loading your private key into your app, you store it
as a **Key Vault key** (not a Key Vault secret). When your app needs to authenticate
as the GitHub App installation to do real work, it
calls a Key Vault REST API to sign a JWT on its behalf. The private key never leaves Key
Vault's HSM-backed boundary. Your application only needs permission to _sign_
with the key, not to _read_ it.

The flow looks like this:

1. Generate the private key in GitHub's UI
2. Immediately upload it to Azure Key Vault as a key
3. Delete the local PEM file
4. Your app constructs the JWT header and payload, then calls Key Vault's sign
   API
5. Key Vault returns the signature, your app assembles the complete JWT
6. Use the JWT to request a short-lived installation token from GitHub

Your service authenticates to Key Vault via Managed Identity or
`DefaultAzureCredential` — no additional secrets required for that leg of the
authentication.

## Contributing remote signing support to Octokit

While working on these patterns, I noticed that the popular
[Octokit](https://github.com/octokit) TypeScript/JavaScript library suite
didn't have a clean way to plug in remote signing. The `@octokit/auth-app`
package expected you to pass in the private key directly.

We patched this a few years ago internally but I finally got it out!

I contributed a pull request to `octokit/auth-app.js` —
[#712](https://github.com/octokit/auth-app.js/pull/712) — that adds support
for a custom JWT signing function. Instead of handing the library your PEM, you
can now provide an async function that returns a signed JWT. This makes it easy
to integrate Azure Key Vault signing (or any other remote signer) without
forking the library or working around its internals.

With this change, using Octokit with Key Vault-based signing looks something
like:

```typescript
import { createAppAuth } from "@octokit/auth-app";
import { Octokit } from "@octokit/rest";
import { CryptographyClient, KeyClient } from "@azure/keyvault-keys";
import { DefaultAzureCredential } from "@azure/identity";

const credential = new DefaultAzureCredential();
const vaultUrl = "https://remote-jwt.vault.azure.net";
const keyName = "github-app-key";

const keyClient = new KeyClient(vaultUrl, credential);
const key = await keyClient.getKey(keyName);
const cryptoClient = new CryptographyClient(key.id!, credential);

async function signWithKeyVault({ header, payload }) {
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString("base64url");
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const { result } = await cryptoClient.sign("RS256", Buffer.from(signingInput));
  const encodedSignature = Buffer.from(result).toString("base64url");
  return `${signingInput}.${encodedSignature}`;
}

const octokit = new Octokit({
  authStrategy: createAppAuth,
  auth: {
    appId: APP_ID,
    sign: signWithKeyVault,
  },
});
```

Familiar yet just works.

## In summary

- **Store GitHub App private keys as Key Vault _keys_, not secrets.** This
  enables server-side signing without your app ever accessing the raw key
  material.
- **Minimize the window.** The moment you generate a new private key in
  GitHub's UI, get it into Key Vault and delete the local copy. Every minute
  that key sits on a laptop or in a download folder is unnecessary risk.
- **Rotate regularly.** GitHub lets you have multiple active private keys, so
  you can rotate without downtime. Do it on whatever cadence your security team
  requires.
- **Scope your installation tokens.** When you exchange a JWT for an
  installation token, request only the repositories and permissions you
  actually need, reducing blast radius.
- **Use the Octokit custom signing support** if you're in the
  TypeScript/JavaScript ecosystem. It's designed exactly for this use case.

Remote JWT signing isn't just a nice-to-have — it's how you keep your GitHub
App credentials meaningfully protected. If you're running GitHub Apps in
production, especially at scale, this pattern is worth adopting.

And... no comment on how many apps I've come across that do not do any of
this.
