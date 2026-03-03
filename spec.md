# NakMan Jewellery

## Current State
Full wholesale jewellery eCommerce store for Malabar Enterprise / NakMan Jewellery brand. Features: product catalogue with categories, cart with bulk discounts, UPI checkout, customer type filtering (online seller vs retailer), admin dashboard, blog, static pages (About, Returns, Privacy, Shipping), WhatsApp button, YouTube video per product, minimum order value ₹3,000.

Login uses Internet Identity (ICP). The admin registration requires passing the correct `CAFFEINE_ADMIN_TOKEN` secret -- the owner cannot easily become admin because they don't know this secret token.

## Requested Changes (Diff)

### Add
- Nothing new

### Modify
- **Admin assignment logic**: Change the `initialize` function in `access-control.mo` so the FIRST person who calls `_initializeAccessControlWithSecret` automatically becomes admin, regardless of the token they provide. Subsequent callers become regular users. This removes the token requirement for the first registration only.

### Remove
- The token check for the very first registration (admin assignment)

## Implementation Plan
1. Regenerate backend with updated access-control logic: first caller to `_initializeAccessControlWithSecret` becomes admin automatically (no token check for first user). All subsequent callers become regular users as before.
2. Keep all existing data types, APIs, and business logic identical -- only change the admin initialization logic.
3. No frontend changes needed -- the login flow already calls `_initializeAccessControlWithSecret` on registration.
