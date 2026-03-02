// ─── Discount Logic ──────────────────────────────────────────────────────────

export interface DiscountResult {
  originalPrice: number;
  discountPercent: number;
  discountedPrice: number;
  savings: number;
  label: string;
}

/**
 * Calculate discount for a given quantity and login status.
 *
 * Rules:
 * - qty >= 200 single design: 15% off
 * - qty >= 100 single item: 12% off
 * - qty >= 50: 10% off
 * - logged in: additional 5% (stacked)
 * - minimum order: 6 pcs
 */
export function calculateDiscount(
  pricePerPc: number,
  quantity: number,
  isLoggedIn: boolean,
): DiscountResult {
  let bulkDiscount = 0;
  let label = "";

  if (quantity >= 200) {
    bulkDiscount = 15;
    label = "200+ pcs (same design)";
  } else if (quantity >= 100) {
    bulkDiscount = 12;
    label = "100+ pcs (same item)";
  } else if (quantity >= 50) {
    bulkDiscount = 10;
    label = "50+ pcs";
  }

  const loginDiscount = isLoggedIn ? 5 : 0;
  const totalDiscount = bulkDiscount + loginDiscount;

  const originalPrice = pricePerPc * quantity;
  const discountedPrice = originalPrice * (1 - totalDiscount / 100);
  const savings = originalPrice - discountedPrice;

  return {
    originalPrice,
    discountPercent: totalDiscount,
    discountedPrice,
    savings,
    label: label || (loginDiscount > 0 ? "Member discount" : ""),
  };
}

export function getDiscountPercent(
  quantity: number,
  isLoggedIn: boolean,
): number {
  let bulkDiscount = 0;
  if (quantity >= 200) bulkDiscount = 15;
  else if (quantity >= 100) bulkDiscount = 12;
  else if (quantity >= 50) bulkDiscount = 10;
  return bulkDiscount + (isLoggedIn ? 5 : 0);
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPrice(priceBigInt: bigint): string {
  return formatINR(Number(priceBigInt));
}

export const DISCOUNT_TIERS = [
  { minQty: 200, discount: 15, label: "200+ pcs (same design)" },
  { minQty: 100, discount: 12, label: "100+ pcs (same item)" },
  { minQty: 50, discount: 10, label: "50+ pcs" },
  { minQty: 6, discount: 0, label: "6-49 pcs (MOQ)" },
];
