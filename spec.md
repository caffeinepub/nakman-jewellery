# NakMan Jewellery

## Current State
Full-stack wholesale jewellery e-commerce app with Internet Identity login, product management, cart/checkout, blog, admin dashboard, and access control. The backend uses an authorization mixin where `_initializeAccessControlWithSecret` only assigns a role to users who have never logged in before. The `useActor.ts` hook calls this function every time a user authenticates.

## Requested Changes (Diff)

### Add
- Backend: new `_assignAdminByToken(token)` function that force-assigns `#admin` role to the caller if the provided token matches `CAFFEINE_ADMIN_TOKEN`, even if the caller already has an existing role (fixes the "Access Denied" loop for store owners who first logged in without admin token).

### Modify
- Backend: `access-control.mo` `initialize` function — when `userProvidedToken == adminToken`, always assign `#admin` regardless of whether the caller already has a role (so revisiting the app from the Caffeine dashboard auto-upgrades existing users).
- Frontend `useActor.ts`: after calling `_initializeAccessControlWithSecret`, also call `_assignAdminByToken(adminToken)` when `adminToken` is non-empty, so the token-based upgrade always runs.

### Remove
- Nothing removed.

## Implementation Plan
1. Regenerate backend Motoko to include `_assignAdminByToken` and fix `initialize` to always upgrade to admin when token matches.
2. Update `useActor.ts` (via frontend agent) to call `_assignAdminByToken` after `_initializeAccessControlWithSecret` when admin token is present.
3. Update `Admin.tsx` `AdminAccessHelp` component to reflect the simpler fix flow.
4. Deploy.
