---
layout: post
comments: true
title: "What PATs are authorized to access your GitHub organization?"
categories: [open-source, github]
tags: [github, security, pat, tokens, enterprise, compliance]
---

If you run a GitHub organization — especially at any scale — you've probably
wondered: _who has tokens authorized against my org, and what can they do?_

The answer depends heavily on **which kind of PAT** you're asking about.
GitHub has two very different token types, and the visibility story for each is
completely different. Let me walk through both.

## The two token types

GitHub has two generations of personal access tokens:

- **Classic PATs** (`ghp_...`) — the original, all-or-nothing model. You pick
  scopes like `repo`, `admin:org`, `read:packages`, etc. There's no
  per-repository targeting; a `repo`-scoped classic PAT can read every private
  repo the user can access.
- **Fine-grained PATs** (`github_pat_...`) — introduced later, these require
  you to specify a target owner (user or org), choose specific repositories,
  and select granular permissions like "read-only Contents" or
  "read-write Pull requests". They also have a mandatory expiration date.

These two types have completely asymmetric visibility for org owners.

## Fine-grained PATs: you have real visibility

For fine-grained PATs, GitHub gives organization owners meaningful controls.
Navigate to your org's **Settings → Personal access tokens** and you'll find
two sections:

**Active tokens** lists every fine-grained PAT that currently has access to
your organization. You can filter by owner (which org member created it), by
repository, and by permission. Clicking any token shows you the full
permission set it holds. You can also revoke tokens individually or in bulk
from this same page.

**Pending requests** shows fine-grained PATs waiting for your approval — but
only if you've turned on the approval requirement (more on that below).

You can also drive this programmatically via the REST API. The
[list fine-grained PATs with access to organization resources](https://docs.github.com/en/rest/orgs/personal-access-tokens)
endpoint returns full token metadata. Note that this endpoint requires a
**GitHub App** installation token to call; you can't use a PAT to enumerate
other PATs.

## Classic PATs: the blind spot

Here's the uncomfortable truth: **organization owners have zero built-in
visibility into which classic PATs are accessing their org**.

Unless you've restricted or blocked classic PATs entirely, any valid classic
PAT belonging to an org member with the `repo` scope can silently read and
write to your private repositories — and you won't see it listed anywhere in
the org settings UI. There's no "Active classic tokens" page, because GitHub
doesn't surface that information to org owners.

Your options for dealing with this:

1. **Block classic PATs entirely.** Under Settings → Personal access tokens →
   Settings, you can restrict classic PATs from accessing your org. Users will
   get a 403 when they try to use one. This is the cleanest option if your
   org has moved to fine-grained PATs and GitHub Apps.

2. **Use SAML SSO with required credential authorization.** If your org uses
   SAML single sign-on, members must explicitly authorize their classic PATs
   against your org's SSO session. This doesn't give you a list of authorized
   tokens, but it means members are at least consciously opting their token in.
   You can revoke an SSO credential authorization from the member's profile if
   needed.

3. **Lean on the audit log.** The audit log captures `personal_access_token`
   category events, including when classic PATs are used to access org
   resources. This is reactive visibility rather than a proactive inventory,
   but it's something.

## Org-level PAT policy settings

Under **Settings → Personal access tokens → Settings**, you have a few
independent knobs for each token type:

**Allow or restrict access** — you can block one type without affecting the
other. Blocking classic PATs doesn't impact fine-grained PATs, and vice
versa.

**Maximum lifetime** — for fine-grained PATs, you can enforce a ceiling (e.g.,
no token valid for more than 90 days). Classic PATs can also have a lifetime
cap set, though historically they defaulted to no expiration.

**Require administrator approval** — for fine-grained PATs only, you can
require that every new token targeting your org be approved by an org owner
before it can access non-public resources. When enabled, the token owner gets
an email when their request is approved or denied, and you get a daily digest
of pending requests. Organization owners' own tokens are exempt from this
requirement.

All three settings are independent and apply at the org level. The defaults
are permissive — both token types are allowed, no lifetime cap is set, and
fine-grained PATs require approval by default (but you can disable that).

## Enterprise-level overrides

If your org lives inside a GitHub Enterprise Cloud account, the enterprise
owner layer adds additional controls that can override org settings:

- The enterprise can **block classic PATs or fine-grained PATs** across all
  orgs, regardless of what individual org owners have configured.
- The enterprise can **set maximum lifetime policies** that org owners can
  only tighten, not loosen.
- The enterprise can **enforce or disable the fine-grained PAT approval
  requirement** org-wide, overriding each org's individual setting.

Navigate to your enterprise's **Policies → Personal access tokens** to manage
these. There are separate tabs for fine-grained tokens and tokens (classic).

One important nuance for **Enterprise Managed Users (EMU)**: the enterprise
owns the user accounts, so lifetime policies apply to user namespace tokens as
well. If you're using EMU and want to set aggressive token lifetime policies,
check the "Exempt administrators" box to avoid breaking SCIM provisioning or
automation that hasn't yet migrated to GitHub Apps.

## Audit log queries worth knowing

The audit log (Settings → Logs → Audit log, or the API) is your best tool for
understanding PAT usage historically. A few useful queries:

- `action:personal_access_token` — all PAT-related events across both types
- `action:org.approve_fine_grained_personal_access_token` — when an org owner
  approved a pending fine-grained token request
- `action:org.deny_fine_grained_personal_access_token` — denials
- `action:org.revoke_fine_grained_personal_access_token` — explicit revocations

The audit log retains 180 days of events. If you need longer retention or
real-time streaming, the audit log streaming feature (available on Enterprise
Cloud) can push events to an external SIEM or blob storage.

## Practical recommendations

If I were advising an org owner starting from scratch today:

1. **Enable the fine-grained PAT approval requirement.** It adds friction for
   your users but gives you a real inventory of what's authorized. The daily
   digest email is low-noise for most orgs.

2. **Set a maximum lifetime** for both token types. 90 days for classic PATs,
   365 days or less for fine-grained, depending on your risk tolerance. Tokens
   that never expire are a persistent risk if they're ever leaked.

3. **Block classic PATs if you can.** The lack of visibility into which classic
   PATs are active is a meaningful gap. If your org's automation has migrated
   to GitHub Apps and fine-grained PATs, pulling the lever to block classic
   PATs eliminates the blind spot entirely.

4. **Use the REST API to build your own inventory** of active fine-grained
   tokens. A nightly job calling the list endpoint and logging to your SIEM
   gives you an auditable record that persists beyond the UI.

5. **Enable SAML SSO credential authorization** if you're not ready to block
   classic PATs outright. It's not inventory, but it ensures tokens are
   consciously authorized rather than silently inherited.

The fine-grained PAT model is unambiguously better for org owners. The
approval flow, the granular permissions, the expiration requirement — all of
it makes the "what's authorized in my org" question answerable. The migration
path from classic PATs takes effort, but the operational clarity on the other
side is worth it.
