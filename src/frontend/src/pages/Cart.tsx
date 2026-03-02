import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Tag,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAllProducts,
  useCart,
  useRemoveFromCart,
  useUpdateCartQuantity,
} from "../hooks/useQueries";
import { calculateDiscount, formatINR } from "../utils/discount";

const MIN_ORDER_VALUE = 3000;

export function Cart() {
  const { data: cartItems, isLoading: cartLoading } = useCart();
  const { data: products } = useAllProducts();
  const updateQty = useUpdateCartQuantity();
  const removeItem = useRemoveFromCart();
  const { identity, login } = useInternetIdentity();
  const isLoggedIn = !!identity;

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="h-16 w-16 text-gold/30 mx-auto mb-4" />
        <h2 className="font-display text-2xl font-bold mb-2">
          Your Cart is Waiting
        </h2>
        <p className="text-muted-foreground mb-6">
          Login to view and manage your cart
        </p>
        <Button
          onClick={login}
          className="gold-gradient text-background font-bold"
        >
          Login to Continue
        </Button>
      </div>
    );
  }

  if (cartLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  const cartWithProducts = (cartItems || []).map((item) => {
    const product = products?.find((p) => p.id === item.productId);
    return { ...item, product };
  });

  const totalAmount = cartWithProducts.reduce((sum, item) => {
    if (!item.product) return sum;
    const price = Number(item.product.price);
    const qty = Number(item.quantity);
    const disc = calculateDiscount(price, qty, isLoggedIn);
    return sum + disc.discountedPrice;
  }, 0);

  const totalOriginal = cartWithProducts.reduce((sum, item) => {
    if (!item.product) return sum;
    return sum + Number(item.product.price) * Number(item.quantity);
  }, 0);

  // Separate bulk savings from member (login) savings
  const bulkSavings = cartWithProducts.reduce((sum, item) => {
    if (!item.product) return sum;
    const price = Number(item.product.price);
    const qty = Number(item.quantity);
    const original = price * qty;
    // bulk-only discount (no login bonus)
    const bulkOnly = calculateDiscount(price, qty, false);
    return sum + (original - bulkOnly.discountedPrice);
  }, 0);

  const memberSavings = isLoggedIn
    ? totalOriginal - bulkSavings - totalAmount
    : 0;

  const totalSavings = totalOriginal - totalAmount;
  const belowMinOrder = totalAmount < MIN_ORDER_VALUE;
  const amountNeeded = Math.max(0, MIN_ORDER_VALUE - totalAmount);
  const minOrderProgress = Math.min(100, (totalAmount / MIN_ORDER_VALUE) * 100);

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="h-16 w-16 text-gold/30 mx-auto mb-4" />
        <h2 className="font-display text-2xl font-bold mb-2">
          Your Cart is Empty
        </h2>
        <p className="text-muted-foreground mb-6">
          Browse our wholesale catalogue and add products
        </p>
        <Link to="/shop">
          <Button className="gold-gradient text-background font-bold">
            Browse Shop
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="font-display text-3xl font-bold">
          Shopping <span className="gold-text-gradient">Cart</span>
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {cartItems.length} item{cartItems.length !== 1 ? "s" : ""}
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3">
          <AnimatePresence>
            {cartWithProducts.map((item) => {
              if (!item.product) return null;
              const price = Number(item.product.price);
              const qty = Number(item.quantity);
              const disc = calculateDiscount(price, qty, isLoggedIn);

              return (
                <motion.div
                  key={item.productId}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  className="flex gap-4 p-4 bg-card border border-gold/20 rounded-xl hover:border-gold/40 transition-colors"
                >
                  {/* Image */}
                  <div className="h-20 w-20 shrink-0 rounded-lg overflow-hidden bg-muted">
                    {item.product.images && item.product.images.length > 0 ? (
                      <img
                        src={item.product.images[0].getDirectURL()}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="h-8 w-8 text-gold/20" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to="/product/$id"
                      params={{ id: item.productId }}
                      className="font-heading font-semibold text-sm truncate block hover:text-gold transition-colors"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {formatINR(price)}/pc
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 border-gold/30"
                        disabled={updateQty.isPending}
                        onClick={() => {
                          const newQty = Math.max(6, qty - 1);
                          updateQty.mutate({
                            productId: item.productId,
                            quantity: BigInt(newQty),
                          });
                        }}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium w-8 text-center">
                        {qty}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 border-gold/30"
                        disabled={updateQty.isPending}
                        onClick={() => {
                          updateQty.mutate({
                            productId: item.productId,
                            quantity: BigInt(qty + 1),
                          });
                        }}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <span className="text-xs text-muted-foreground">pcs</span>
                    </div>
                  </div>

                  {/* Price + Remove */}
                  <div className="flex flex-col items-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => {
                        removeItem.mutate(item.productId, {
                          onSuccess: () => toast.success("Removed from cart"),
                        });
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <div className="text-right space-y-0.5">
                      {disc.discountPercent > 0 ? (
                        <>
                          <div className="text-xs text-muted-foreground line-through">
                            {formatINR(disc.originalPrice)}
                          </div>
                          <div className="font-bold text-gold text-sm">
                            {formatINR(disc.discountedPrice)}
                          </div>
                          <div className="flex items-center gap-1 justify-end">
                            <Tag className="h-3 w-3 text-green-400" />
                            <span className="text-xs text-green-400 font-medium">
                              -{disc.discountPercent}% off
                            </span>
                          </div>
                          {disc.label && (
                            <div className="text-[10px] text-muted-foreground/70 italic">
                              {disc.label}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="font-bold text-gold text-sm">
                          {formatINR(disc.discountedPrice)}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="sticky top-20 bg-card border border-gold/20 rounded-xl p-5 space-y-4"
          >
            <h2 className="font-heading font-semibold text-lg">
              Order Summary
            </h2>

            {/* Detailed Bill Breakdown */}
            <div className="bg-background/50 border border-gold/20 rounded-lg p-4 space-y-2.5 text-sm">
              {/* Actual price row */}
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Actual Price</span>
                <span className="text-muted-foreground">
                  {formatINR(totalOriginal)}
                </span>
              </div>

              {/* Bulk discount row — only show if savings > 0 */}
              {bulkSavings > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-xs">
                    Bulk Discount
                  </span>
                  <span className="text-green-400 font-medium">
                    -{formatINR(bulkSavings)}
                  </span>
                </div>
              )}

              {/* Member discount row — only if logged in and has savings */}
              {isLoggedIn && memberSavings > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-xs">
                    Member Discount (5%)
                  </span>
                  <span className="text-green-400 font-medium">
                    -{formatINR(memberSavings)}
                  </span>
                </div>
              )}

              {totalSavings > 0 && (
                <>
                  <Separator className="bg-gold/20" />
                  <div className="flex justify-between items-center font-semibold">
                    <span className="text-green-400">You Save Total</span>
                    <span className="text-green-400">
                      -{formatINR(totalSavings)}
                    </span>
                  </div>
                  <Separator className="bg-gold/20" />
                </>
              )}

              {/* Final total */}
              <div className="flex justify-between items-center">
                <span className="font-bold text-base">Order Total</span>
                <span className="text-gold font-bold text-base">
                  {formatINR(totalAmount)}
                </span>
              </div>

              {/* Shipping */}
              <div className="flex justify-between items-center text-xs text-muted-foreground italic">
                <span>Shipping</span>
                <span>As per pincode chart</span>
              </div>
            </div>

            {/* Member badge */}
            {isLoggedIn && (
              <div className="bg-gold/10 border border-gold/20 rounded-lg p-3 text-xs text-gold flex items-center gap-2">
                <Tag className="h-3.5 w-3.5 shrink-0" />
                <span>5% member discount applied to your total</span>
              </div>
            )}

            {/* Minimum Order Value Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span
                  className={
                    belowMinOrder
                      ? "text-gold font-medium"
                      : "text-green-400 font-medium"
                  }
                >
                  {belowMinOrder
                    ? "Min. order: ₹3,000 required"
                    : "✓ Minimum order value met"}
                </span>
                <span className="text-muted-foreground">
                  {formatINR(totalAmount)} / ₹3,000
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${belowMinOrder ? "bg-gold" : "bg-green-500"}`}
                  style={{ width: `${minOrderProgress}%` }}
                />
              </div>
              {belowMinOrder && (
                <div className="flex items-start gap-1.5 text-xs text-gold">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  <span>
                    Add {formatINR(amountNeeded)} more to reach minimum order
                    value
                  </span>
                </div>
              )}
            </div>

            {belowMinOrder ? (
              <Button
                disabled
                data-ocid="cart.checkout_button"
                className="w-full opacity-50 cursor-not-allowed gold-gradient text-background font-bold gap-2"
              >
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Link to="/checkout" data-ocid="cart.checkout_button">
                <Button className="w-full gold-gradient text-background font-bold hover:opacity-90 shadow-gold gap-2">
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            )}

            <Link to="/shop">
              <Button
                variant="ghost"
                className="w-full text-muted-foreground hover:text-foreground"
              >
                Continue Shopping
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
