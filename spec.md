# NakMan Jewellery

## Current State
Full-stack wholesale jewellery ecommerce app (Malabar Enterprise / NakMan Jewellery brand) on ICP with:
- Internet Identity login
- Role-based access control (admin / user / guest) via MixinAuthorization
- Products, cart, orders, blog management
- Admin dashboard (products, orders, blog)
- Wholesale discounts: 5% login, bulk tiers at 50/100/200 pcs
- Min order ₹3,000, min 6 pcs per item
- UPI checkout with dual QR codes + payment screenshot upload
- WhatsApp floating button
- Customer type (Online Seller / Retailer) filtering
- YouTube video links per product (stored in localStorage)
- About Us, Returns Policy, Shipping Chart, Blog, Privacy Policy pages
- Purple/gold B2B theme

**Current admin access bug:** The `access-control.mo` `initialize()` function only assigns admin to the first caller with the correct token AND who has no existing role. If the user was previously registered as `#user`, their role is never upgraded even when they provide the correct admin token. This makes it impossible for the owner to claim admin if they ever logged in without the admin token.

## Requested Changes (Diff)

### Add
- New backend function `forceClaimAdmin(userSecret: Text): async ()` that checks the CAFFEINE_ADMIN_TOKEN env var and, if the provided secret matches, unconditionally upgrades the caller to admin role (regardless of existing role). This is the permanent fix.
- Admin page: "Claim Admin Access" button that calls `forceClaimAdmin` with the token from URL/session, shown when the user is logged in but not admin.

### Modify
- `access-control.mo` initialize(): if the caller provides the correct admin token (non-empty and matches), always grant admin — even if they already have a `#user` role. This fixes the root issue.
- `useActor.ts` admin token persistence: store the admin token in `localStorage` (key: `nakman_admin_token`) whenever found in URL, so it survives the Internet Identity redirect. Read from localStorage as fallback when URL param is absent.
- Admin page Access Denied screen: replace static error with an actionable "Claim Admin" button that calls the backend to upgrade the caller's role using the stored token.

### Remove
- Nothing

## Implementation Plan
1. Regenerate backend with fixed `access-control.mo` and new `forceClaimAdmin` function
2. Update `useActor.ts` to persist admin token in localStorage and read it back (cannot edit directly - handled via backend regen which regenerates bindings)
3. Update Admin.tsx: when `isAdmin === false` and user is logged in, show "Claim Admin Access" button that reads stored token and calls forceClaimAdmin, then refetches admin status
4. Keep all existing functionality unchanged
