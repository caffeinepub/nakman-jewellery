import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  ExternalLink,
  Minus,
  Package,
  Play,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Store,
  Tag,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { Category, Variant_both_retailer_online } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useAddToCart, useProductById } from "../hooks/useQueries";
import {
  getYouTubeUrl,
  toYouTubeEmbedUrl,
  toYouTubeWatchUrl,
} from "../hooks/useYouTubeLinks";
import {
  DISCOUNT_TIERS,
  calculateDiscount,
  formatINR,
  formatPrice,
} from "../utils/discount";

const CATEGORY_LABELS: Record<Category, string> = {
  [Category.earrings]: "Earrings",
  [Category.jewellerySet]: "Jewellery Sets",
  [Category.anklet]: "Anklets",
  [Category.bangles]: "Bangles",
  [Category.chainPendant]: "Chain Pendant",
  [Category.bracelet]: "Bracelets",
  [Category.chain]: "Chains",
  [Category.other]: "Other",
};

export function ProductDetail() {
  const { id } = useParams({ from: "/layout/product/$id" });
  const { data: product, isLoading } = useProductById(id);
  const { identity, login } = useInternetIdentity();
  const addToCart = useAddToCart();
  const isLoggedIn = !!identity;

  const [quantity, setQuantity] = useState(6);
  const [selectedImage, setSelectedImage] = useState(0);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="h-16 w-16 text-gold/30 mx-auto mb-4" />
        <h2 className="font-display text-2xl font-bold mb-2">
          Product Not Found
        </h2>
        <p className="text-muted-foreground mb-6">
          This product may have been removed or the link is incorrect.
        </p>
        <Link to="/shop">
          <Button className="gold-gradient text-background">
            Back to Shop
          </Button>
        </Link>
      </div>
    );
  }

  const price = Number(product.price);
  const discount = calculateDiscount(price, quantity, isLoggedIn);

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      toast.error("Please login to add items to cart", {
        action: {
          label: "Login",
          onClick: login,
        },
      });
      return;
    }
    try {
      await addToCart.mutateAsync({
        productId: product.id,
        quantity: BigInt(quantity),
      });
      toast.success(`Added ${quantity} pcs to cart`);
    } catch {
      toast.error("Failed to add to cart. Please try again.");
    }
  };

  const customerTypeLabel =
    product.customerType === Variant_both_retailer_online.online
      ? "Online Sellers Only"
      : product.customerType === Variant_both_retailer_online.retailer
        ? "Retailers Only"
        : "All Customers";

  const customerTypeBadgeClass =
    product.customerType === Variant_both_retailer_online.online
      ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
      : product.customerType === Variant_both_retailer_online.retailer
        ? "bg-accent text-accent-foreground border-gold/20"
        : "bg-gold/20 text-gold border-gold/30";

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link to="/shop" className="hover:text-gold flex items-center gap-1">
          <ArrowLeft className="h-3 w-3" />
          Shop
        </Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Images */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="aspect-square rounded-xl overflow-hidden border border-gold/20 bg-card mb-3">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[selectedImage]?.getDirectURL()}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ShoppingBag className="h-24 w-24 text-gold/20" />
              </div>
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  // biome-ignore lint/suspicious/noArrayIndexKey: image gallery
                  key={i}
                  type="button"
                  onClick={() => setSelectedImage(i)}
                  className={`shrink-0 h-16 w-16 rounded-lg overflow-hidden border-2 transition-all ${
                    i === selectedImage
                      ? "border-gold"
                      : "border-gold/20 hover:border-gold/50"
                  }`}
                >
                  <img
                    src={img.getDirectURL()}
                    alt={`View ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-5"
        >
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className={customerTypeBadgeClass}>
              {product.customerType === Variant_both_retailer_online.online ? (
                <Store className="h-3 w-3 mr-1" />
              ) : (
                <Tag className="h-3 w-3 mr-1" />
              )}
              {customerTypeLabel}
            </Badge>
            <Badge variant="outline" className="border-gold/30 text-gold/80">
              {CATEGORY_LABELS[product.category]}
            </Badge>
            {Number(product.inStock) > 0 ? (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                In Stock ({Number(product.inStock)} pcs)
              </Badge>
            ) : (
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                Out of Stock
              </Badge>
            )}
          </div>

          <div>
            <h1 className="font-display text-3xl font-bold">{product.name}</h1>
            {product.subcategory && (
              <p className="text-muted-foreground mt-1">
                {product.subcategory}
              </p>
            )}
          </div>

          <div>
            <div className="text-3xl font-bold text-gold">
              {formatPrice(product.price)}
              <span className="text-base text-muted-foreground font-normal">
                {" "}
                / piece
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Minimum order: 6 pcs
              </span>
            </div>
          </div>

          {product.description && (
            <p className="text-muted-foreground text-sm leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Quantity Selector */}
          <div className="space-y-2">
            <label
              htmlFor="product-quantity"
              className="text-sm font-heading font-semibold uppercase tracking-wider text-foreground"
            >
              Quantity
            </label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="border-gold/30 hover:border-gold/60 hover:text-gold"
                onClick={() => setQuantity((q) => Math.max(6, q - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <input
                id="product-quantity"
                type="number"
                min={6}
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(6, Number.parseInt(e.target.value) || 6))
                }
                className="w-20 text-center bg-card border border-gold/30 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-gold"
              />
              <Button
                variant="outline"
                size="icon"
                className="border-gold/30 hover:border-gold/60 hover:text-gold"
                onClick={() => setQuantity((q) => q + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">pcs</span>
            </div>
          </div>

          {/* Price Summary */}
          <div className="bg-card border border-gold/20 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {formatPrice(product.price)} × {quantity} pcs
              </span>
              <span>{formatINR(discount.originalPrice)}</span>
            </div>
            {discount.discountPercent > 0 && (
              <div className="flex justify-between text-sm text-green-400">
                <span>
                  Discount ({discount.discountPercent}%
                  {discount.label ? ` – ${discount.label}` : ""})
                </span>
                <span>-{formatINR(discount.savings)}</span>
              </div>
            )}
            <div className="border-t border-gold/20 pt-2 flex justify-between font-bold">
              <span>Total</span>
              <span className="text-gold text-lg">
                {formatINR(discount.discountedPrice)}
              </span>
            </div>
            {!isLoggedIn && (
              <p className="text-xs text-muted-foreground">
                Login for additional 5% off
              </p>
            )}
          </div>

          {/* Add to Cart */}
          <Button
            size="lg"
            data-ocid="product.add_to_cart_button"
            onClick={handleAddToCart}
            disabled={addToCart.isPending || Number(product.inStock) === 0}
            className="w-full gold-gradient text-background font-bold hover:opacity-90 shadow-gold gap-2"
          >
            {addToCart.isPending ? (
              "Adding..."
            ) : (
              <>
                <ShoppingCart className="h-5 w-5" />
                {isLoggedIn
                  ? `Add ${quantity} pcs to Cart`
                  : "Login to Add to Cart"}
              </>
            )}
          </Button>
        </motion.div>
      </div>

      {/* Discount Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-10"
      >
        <h2 className="font-heading font-semibold text-lg mb-4">
          Bulk Discount Preview
        </h2>
        <div className="border border-gold/20 rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-gold/20 bg-card hover:bg-card">
                <TableHead>Quantity</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Price/pc</TableHead>
                <TableHead>Total (at this qty)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { qty: 6, label: "Min order (6 pcs)" },
                { qty: 50, label: "50 pcs" },
                { qty: 100, label: "100 pcs" },
                { qty: 200, label: "200 pcs" },
              ].map((row) => {
                const d = calculateDiscount(price, row.qty, isLoggedIn);
                return (
                  <TableRow key={row.qty} className="border-gold/20">
                    <TableCell>{row.label}</TableCell>
                    <TableCell>
                      <span
                        className={
                          d.discountPercent > 0 ? "text-green-400" : ""
                        }
                      >
                        {d.discountPercent > 0
                          ? `${d.discountPercent}% off`
                          : "Base price"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {formatINR(d.discountedPrice / row.qty)}
                    </TableCell>
                    <TableCell className="font-bold text-gold">
                      {formatINR(d.discountedPrice)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        {!isLoggedIn && (
          <p className="text-xs text-muted-foreground mt-2">
            * Login to see member pricing with additional 5% off
          </p>
        )}
      </motion.div>

      {/* YouTube Video */}
      <YouTubeSection productId={product.id} />
    </div>
  );
}

function YouTubeSection({ productId }: { productId: string }) {
  const storedUrl = getYouTubeUrl(productId);
  if (!storedUrl) return null;

  const embedUrl = toYouTubeEmbedUrl(storedUrl);
  const watchUrl = toYouTubeWatchUrl(storedUrl);
  if (!embedUrl) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mt-10"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading font-semibold text-lg flex items-center gap-2">
          <Play className="h-5 w-5 text-red-500 fill-red-500" />
          Watch Product Video
        </h2>
        <a href={watchUrl} target="_blank" rel="noopener noreferrer">
          <Button
            variant="outline"
            size="sm"
            className="border-red-500/40 text-red-400 hover:bg-red-500/10 gap-1.5"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Open on YouTube
          </Button>
        </a>
      </div>
      <div
        className="relative w-full rounded-xl overflow-hidden border border-gold/20 bg-black"
        style={{ paddingBottom: "56.25%" }}
      >
        <iframe
          src={embedUrl}
          title="Product video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    </motion.div>
  );
}
