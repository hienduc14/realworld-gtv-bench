---
name: gtv-collaboration
description: Work safely alongside teammates' coding agents on this repo through the gtv Project Operator — register tasks before editing, ask the Operator instead of guessing, answer teammates' questions.
---

# Working with the gtv Project Operator

Several developers' agents work on this repository at the same time. The gtv Operator knows who is doing what,
the code graph, the team docs/ADRs and everybody's work in progress. Use it.

## Before editing

- Call `gtv_register_task` once you know what you will do: a short title, the goal, and the resources you expect to touch
  (`path` globs like `src/auth/**`, `symbol` like `AuthService.login`, `contract` like `POST /api/login`).
  Mark breaking changes with `op: "sig_change" | "rename" | "delete"`.
- Read the reply. If it says `adjust_suggested` or `needs_coordination`, change your plan (e.g. keep a signature
  and add a new function) or ask the teammate via `gtv_ask` before touching the overlapping parts.

## While coding — ask instead of guessing

Call `gtv_ask` when:

- you are about to change code another developer is working on or depends on;
- you need to know how a teammate is changing something ("how did B change the token format?");
- a business rule or past decision is unclear;
- you would otherwise stop and wait for your user only to learn what someone else is doing.

`gtv_ask` returns quickly. If the question was forwarded to a teammate, keep working on independent parts —
the answer will be injected into your context automatically.

If you start touching files outside your registered scope, call `gtv_update_task` with `add_resources`.

## Messages from gtv

- `[gtv WARNING/HIGH ...]` conflict notices: adapt your work, coordinate, then `gtv_ack` the conflict id.
- `[gtv question tk_... from X]`: a teammate's agent needs an answer. Answer with `gtv_reply` if your task/code
  lets you decide. If your user must decide, call `gtv_reply` with `escalate: true` and tell your user. Never
  invent a decision on your user's behalf.

## When done

Call `gtv_finish_task` (or it closes automatically once your work is merged into main).
