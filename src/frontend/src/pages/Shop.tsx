import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { Search, ShoppingBag, SlidersHorizontal, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { Category, Variant_both_retailer_online } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useAllProducts, useUserProfile } from "../hooks/useQueries";
import { formatPrice } from "../utils/discount";

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

const CUSTOMER_TYPE_OPTIONS = [
  { value: "all", label: "All Items" },
  { value: Variant_both_retailer_online.online, label: "Online Sellers" },
  { value: Variant_both_retailer_online.retailer, label: "Retailers" },
];

export function Shop() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">(
    "all",
  );
  const [selectedCustomerType, setSelectedCustomerType] =
    useState<string>("all");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const { data: products, isLoading } = useAllProducts();
  const { identity } = useInternetIdentity();
  const { data: profile } = useUserProfile();

  const isLoggedIn = !!identity;

  // Auto-filter by user's customer type on login
  const effectiveCustomerType = useMemo(() => {
    if (selectedCustomerType !== "all") return selectedCustomerType;
    if (isLoggedIn && profile) {
      return profile.customerType === "onlineSeller"
        ? Variant_both_retailer_online.online
        : Variant_both_retailer_online.retailer;
    }
    return "all";
  }, [selectedCustomerType, isLoggedIn, profile]);

  const filtered = useMemo(() => {
    if (!products) return [];
    return products.filter((p) => {
      const matchCategory =
        selectedCategory === "all" || p.category === selectedCategory;
      const matchType =
        selectedCustomerType === "all" ||
        p.customerType === Variant_both_retailer_online.both ||
        p.customerType === selectedCustomerType;
      const matchQuery =
        !query ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase());
      return matchCategory && matchType && matchQuery;
    });
  }, [products, selectedCategory, selectedCustomerType, query]);

  const Filters = () => (
    <div className="space-y-6">
      {/* Login prompt */}
      {!isLoggedIn && (
        <div className="bg-gold/10 border border-gold/30 rounded-xl p-4">
          <p className="text-xs text-gold font-medium mb-2">
            ✨ Login for 5% extra discount
          </p>
          <Link to="/account">
            <Button
              size="sm"
              className="gold-gradient text-background w-full font-semibold text-xs"
            >
              Login Now
            </Button>
          </Link>
        </div>
      )}

      {/* Customer Type */}
      <div>
        <h3 className="font-heading font-semibold text-sm uppercase tracking-wider text-foreground mb-3">
          Customer Type
        </h3>
        <div className="flex flex-col gap-1">
          {CUSTOMER_TYPE_OPTIONS.map((opt) => (
            <button
              type="button"
              key={opt.value}
              onClick={() => setSelectedCustomerType(opt.value)}
              className={`text-left px-3 py-2 rounded-lg text-sm transition-all ${
                (
                  selectedCustomerType === "all" &&
                    effectiveCustomerType === opt.value &&
                    opt.value !== "all"
                ) || selectedCustomerType === opt.value
                  ? "bg-gold/20 text-gold border border-gold/40"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              {opt.label}
              {isLoggedIn &&
                opt.value !== "all" &&
                profile?.customerType ===
                  (opt.value === Variant_both_retailer_online.online
                    ? "onlineSeller"
                    : "retailer") && (
                  <Badge className="ml-2 text-[10px] bg-gold/20 text-gold border-0">
                    Your type
                  </Badge>
                )}
            </button>
          ))}
        </div>
      </div>

      {/* Category */}
      <div>
        <h3 className="font-heading font-semibold text-sm uppercase tracking-wider text-foreground mb-3">
          Category
        </h3>
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`text-left px-3 py-2 rounded-lg text-sm transition-all ${
              selectedCategory === "all"
                ? "bg-gold/20 text-gold border border-gold/40"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            All Categories
          </button>
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <button
              type="button"
              key={key}
              onClick={() => setSelectedCategory(key as Category)}
              className={`text-left px-3 py-2 rounded-lg text-sm transition-all ${
                selectedCategory === key
                  ? "bg-gold/20 text-gold border border-gold/40"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="font-display text-3xl font-bold mb-2">
          Wholesale <span className="gold-text-gradient">Catalogue</span>
        </h1>
        <p className="text-muted-foreground text-sm">
          {filtered.length} products •{" "}
          {isLoggedIn ? "5% member discount applied" : "Login for extra 5% off"}
        </p>
      </motion.div>

      {/* Search + Mobile Filter Toggle */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            data-ocid="shop.search_input"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 bg-card border-gold/30 focus:border-gold"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button
          variant="outline"
          size="icon"
          className="md:hidden border-gold/30"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
        >
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Mobile Filters */}
      {showMobileFilters && (
        <div className="md:hidden bg-card border border-gold/20 rounded-xl p-4 mb-6">
          <Filters />
        </div>
      )}

      <div className="flex gap-6">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-56 shrink-0">
          <div className="sticky top-20 bg-card border border-gold/20 rounded-xl p-4">
            <Filters />
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1 min-w-0">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
                <div key={i} className="rounded-xl overflow-hidden">
                  <Skeleton className="aspect-square" />
                  <div className="p-3 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-gold/30 rounded-xl">
              <ShoppingBag className="h-12 w-12 text-gold/30 mx-auto mb-3" />
              <p className="text-muted-foreground font-medium">
                No products found
              </p>
              <p className="text-sm text-muted-foreground/60 mt-1">
                {products?.length === 0
                  ? "Products will appear here once added by admin"
                  : "Try a different search or filter"}
              </p>
              {(selectedCategory !== "all" ||
                query ||
                selectedCustomerType !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-3 text-gold"
                  onClick={() => {
                    setSelectedCategory("all");
                    setQuery("");
                    setSelectedCustomerType("all");
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 md:grid-cols-3 gap-4"
            >
              {filtered.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    to="/product/$id"
                    params={{ id: product.id }}
                    className="group block rounded-xl overflow-hidden border border-gold/20 hover:border-gold/50 transition-all hover:shadow-gold-sm bg-card"
                  >
                    <div className="aspect-square bg-muted relative overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0].getDirectURL()}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="h-10 w-10 text-gold/20" />
                        </div>
                      )}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        <Badge className="text-[10px] bg-background/80 text-muted-foreground border-0">
                          Min 6 pcs
                        </Badge>
                        <Badge className="text-[10px] bg-background/80 text-xs border-gold/30 text-gold/80 border">
                          {CATEGORY_LABELS[product.category]}
                        </Badge>
                      </div>
                      {product.customerType !==
                        Variant_both_retailer_online.both && (
                        <div className="absolute top-2 right-2">
                          <Badge
                            className={`text-[10px] border-0 ${
                              product.customerType ===
                              Variant_both_retailer_online.online
                                ? "bg-blue-500/80 text-white"
                                : "bg-gold/80 text-background"
                            }`}
                          >
                            {product.customerType ===
                            Variant_both_retailer_online.online
                              ? "Online"
                              : "Retail"}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-heading font-semibold text-sm truncate group-hover:text-gold transition-colors">
                        {product.name}
                      </h3>
                      {product.subcategory && (
                        <p className="text-xs text-muted-foreground truncate">
                          {product.subcategory}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-gold font-bold text-sm">
                          {formatPrice(product.price)}/pc
                        </span>
                        {isLoggedIn && (
                          <span className="text-[10px] text-green-400 font-medium">
                            -5% for you
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
