import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Flame,
  Shield,
  ShoppingBag,
  Star,
  Tag,
  Truck,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo } from "react";
import { Category } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useAllProducts } from "../hooks/useQueries";
import { formatPrice } from "../utils/discount";

const CATEGORIES = [
  {
    id: Category.earrings,
    label: "Earrings",
    subcategories: "Silver, Gold",
    image: "/assets/generated/category-earrings.dim_400x400.jpg",
  },
  {
    id: Category.jewellerySet,
    label: "Jewellery Sets",
    subcategories: "Gold, AD, Long, Long Gold",
    image: "/assets/generated/category-jewellery-set.dim_400x400.jpg",
  },
  {
    id: Category.anklet,
    label: "Anklets",
    subcategories: "Silver Anklet",
    image: "/assets/generated/category-anklet.dim_400x400.jpg",
  },
  {
    id: Category.bangles,
    label: "Bangles",
    subcategories: "Kadli",
    image: "/assets/generated/category-bangles.dim_400x400.jpg",
  },
  {
    id: Category.chainPendant,
    label: "Chain Pendant",
    subcategories: "Chain Pendant",
    image: "/assets/generated/category-chain-pendant.dim_400x400.jpg",
  },
  {
    id: Category.bracelet,
    label: "Bracelets",
    subcategories: "Gents, Ladies AD, Baccha",
    image: "/assets/generated/category-bracelet.dim_400x400.jpg",
  },
  {
    id: Category.chain,
    label: "Chains",
    subcategories: "Ladies, Mens",
    image: "/assets/generated/category-chain.dim_400x400.jpg",
  },
  {
    id: Category.other,
    label: "Other",
    subcategories: "Rings, Damnni, Tikka, Kavda",
    image: "/assets/generated/category-other.dim_400x400.jpg",
  },
];

const FEATURES = [
  {
    icon: <Tag className="h-6 w-6" />,
    title: "Wholesale Pricing",
    desc: "Factory-direct prices with bulk discounts up to 15%",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Quality Assured",
    desc: "Every piece crafted with premium imitation materials",
  },
  {
    icon: <Truck className="h-6 w-6" />,
    title: "Pan-India Shipping",
    desc: "Fast, reliable delivery to your doorstep",
  },
  {
    icon: <Star className="h-6 w-6" />,
    title: "Trusted by 500+",
    desc: "Retailers and online sellers across India",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function Home() {
  const { data: products } = useAllProducts();
  const { identity } = useInternetIdentity();
  const isLoggedIn = !!identity;

  const featuredProducts = products?.slice(0, 4) ?? [];

  // Best Deals: cheapest 1-2 products per category (max 2 per category, up to 16 total)
  const bestDeals = useMemo(() => {
    if (!products || products.length === 0) return [];
    const byCategory: Record<string, typeof products> = {};
    for (const p of products) {
      const key = p.category as string;
      if (!byCategory[key]) byCategory[key] = [];
      byCategory[key].push(p);
    }
    const deals: typeof products = [];
    for (const cat of Object.keys(byCategory)) {
      const sorted = [...byCategory[cat]].sort(
        (a, b) => Number(a.price) - Number(b.price),
      );
      deals.push(...sorted.slice(0, 2));
    }
    // Sort all deals by price ascending
    deals.sort((a, b) => Number(a.price) - Number(b.price));
    return deals.slice(0, 16);
  }, [products]);

  return (
    <div className="overflow-x-hidden">
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background image with layered overlays */}
        <div className="absolute inset-0">
          <img
            src="/assets/generated/nakman-hero-banner.dim_1400x600.jpg"
            alt="NakMan Jewellery"
            className="w-full h-full object-cover"
          />
          {/* Atmospheric layering */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(105deg, oklch(0.09 0.025 250 / 0.97) 0%, oklch(0.12 0.030 250 / 0.88) 45%, oklch(0.10 0.025 250 / 0.55) 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, oklch(0.09 0.025 250) 0%, transparent 50%)",
            }}
          />
          {/* Subtle gold radial glow */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 20% 60%, oklch(0.76 0.18 68 / 0.06) 0%, transparent 70%)",
            }}
          />
        </div>

        {/* Decorative vertical line */}
        <div
          className="absolute left-[52%] top-0 bottom-0 w-px hidden xl:block"
          style={{
            background:
              "linear-gradient(to bottom, transparent, oklch(0.76 0.18 68 / 0.12) 30%, oklch(0.76 0.18 68 / 0.08) 70%, transparent)",
          }}
        />

        <div className="relative container mx-auto px-4 lg:px-8 pt-24 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-[640px]"
          >
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="flex items-center gap-3 mb-6"
            >
              <div
                className="h-px w-8 shrink-0"
                style={{ background: "oklch(0.76 0.18 68 / 0.60)" }}
              />
              <img
                src="/assets/uploads/Malabar-Tradmark-Logo-1.jpg"
                alt="NakMan Jewellery"
                className="h-7 w-7 rounded-full object-cover"
                style={{
                  boxShadow: "0 0 0 1.5px oklch(0.76 0.18 68 / 0.50)",
                }}
              />
              <span
                className="text-[11px] font-heading font-semibold uppercase tracking-[0.25em]"
                style={{ color: "oklch(0.76 0.18 68 / 0.80)" }}
              >
                Malabar Enterprise
              </span>
              <div
                className="h-px flex-1"
                style={{ background: "oklch(0.76 0.18 68 / 0.20)" }}
              />
            </motion.div>

            {/* Brand name */}
            <h1 className="mb-5 leading-none">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.7 }}
                className="block font-brand text-[72px] md:text-[96px] font-bold brand-text-gradient"
                style={{ fontVariationSettings: '"opsz" 144', lineHeight: 0.9 }}
              >
                NakMan
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38, duration: 0.7 }}
                className="block font-heading text-2xl md:text-3xl font-light tracking-[0.35em] uppercase mt-3"
                style={{ color: "oklch(0.72 0.060 250)" }}
              >
                Jewellery
              </motion.span>
            </h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <div
                className="h-px w-24 mb-5"
                style={{
                  background:
                    "linear-gradient(90deg, oklch(0.76 0.18 68 / 0.60), transparent)",
                }}
              />
              <p
                className="text-lg md:text-xl font-heading font-light mb-2"
                style={{ color: "oklch(0.78 0.030 250)" }}
              >
                Premium Wholesale Imitation Jewellery
              </p>
              <p
                className="text-sm mb-8 max-w-md leading-relaxed"
                style={{ color: "oklch(0.58 0.030 250)" }}
              >
                Supplying retailers & online sellers with the finest imitation
                jewellery from Ahmedabad. Min. 6 pcs. Bulk discounts up to 15%.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.5 }}
              className="flex flex-wrap gap-3 mb-8"
            >
              <Link to="/shop" data-ocid="hero.shop_button">
                <Button
                  size="lg"
                  className="font-heading font-semibold gap-2 rounded-xl px-7 hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.86 0.14 75) 0%, oklch(0.76 0.18 68) 50%, oklch(0.62 0.20 58) 100%)",
                    color: "oklch(0.10 0.025 250)",
                    boxShadow:
                      "0 4px 20px oklch(0.76 0.18 68 / 0.35), inset 0 1px 0 oklch(1 0 0 / 0.15)",
                  }}
                >
                  <ShoppingBag className="h-4 w-4" />
                  Shop Wholesale
                </Button>
              </Link>
              <Link to="/account" data-ocid="hero.account_button">
                <Button
                  size="lg"
                  variant="outline"
                  className="font-heading font-medium gap-2 rounded-xl px-6 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    borderColor: "oklch(0.76 0.18 68 / 0.35)",
                    color: "oklch(0.82 0.14 68)",
                    background: "oklch(0.76 0.18 68 / 0.06)",
                  }}
                >
                  {isLoggedIn ? "My Account" : "Login for 5% Off"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>

            {/* Discount tier chips — refined */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-wrap gap-2"
            >
              {[
                { label: "6+ pcs", sub: "MOQ" },
                { label: "50+ pcs", sub: "10% off" },
                { label: "100+ pcs", sub: "12% off" },
                { label: "200+ pcs", sub: "15% off" },
                { label: "Login", sub: "+5% off" },
              ].map((tier) => (
                <div
                  key={tier.label}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-heading font-medium"
                  style={{
                    background: "oklch(0.76 0.18 68 / 0.08)",
                    border: "1px solid oklch(0.76 0.18 68 / 0.22)",
                    color: "oklch(0.82 0.14 68)",
                  }}
                >
                  <span className="font-semibold">{tier.label}</span>
                  <span
                    className="h-3 w-px"
                    style={{ background: "oklch(0.76 0.18 68 / 0.30)" }}
                  />
                  <span style={{ color: "oklch(0.72 0.10 68)" }}>
                    {tier.sub}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Login Banner ── */}
      {!isLoggedIn && (
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-gold/10 border-y border-gold/30 py-4"
        >
          <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-gold font-medium">
              ✨ Login to get an additional <strong>5% discount</strong> on all
              products!
            </p>
            <Link to="/account">
              <Button
                size="sm"
                className="gold-gradient text-background font-semibold"
              >
                Login Now
              </Button>
            </Link>
          </div>
        </motion.section>
      )}

      {/* ── Categories ── */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
            Shop by <span className="gold-text-gradient">Category</span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Explore our complete range of wholesale imitation jewellery
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
        >
          {CATEGORIES.map((cat) => (
            <motion.div key={cat.id} variants={itemVariants}>
              <Link
                to="/shop"
                className="group block rounded-xl overflow-hidden border border-gold/20 hover:border-gold/50 transition-all hover:shadow-gold-sm"
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <div className="font-heading font-semibold text-sm text-foreground">
                      {cat.label}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {cat.subcategories}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Featured Products ── */}
      <section className="bg-card border-y border-gold/20 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-10"
          >
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">
                Featured <span className="gold-text-gradient">Products</span>
              </h2>
              <p className="text-muted-foreground">
                Best-selling wholesale pieces
              </p>
            </div>
            <Link to="/shop">
              <Button
                variant="ghost"
                className="text-gold hover:text-gold/80 gap-1"
              >
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          {featuredProducts.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {featuredProducts.map((product) => (
                <motion.div key={product.id} variants={itemVariants}>
                  <ProductCard product={product} isLoggedIn={isLoggedIn} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12 border border-dashed border-gold/30 rounded-xl">
              <ShoppingBag className="h-12 w-12 text-gold/30 mx-auto mb-3" />
              <p className="text-muted-foreground">
                Products coming soon. Check back shortly!
              </p>
              <p className="text-sm text-muted-foreground/60 mt-1">
                Admin can add products from the{" "}
                <Link to="/admin" className="text-gold hover:underline">
                  Admin Dashboard
                </Link>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── Best Deals ── */}
      {bestDeals.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-10"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Flame className="h-5 w-5 text-gold" />
                <span className="text-xs font-heading uppercase tracking-widest text-gold">
                  Best Value
                </span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">
                Lowest Prices{" "}
                <span className="gold-text-gradient">by Category</span>
              </h2>
              <p className="text-muted-foreground text-sm">
                The most affordable picks from every category — great for new
                buyers
              </p>
            </div>
            <Link to="/shop">
              <Button
                variant="ghost"
                className="text-gold hover:text-gold/80 gap-1"
              >
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4"
          >
            {bestDeals.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard
                  product={product}
                  isLoggedIn={isLoggedIn}
                  showDealBadge
                />
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* ── Manufacturer Direct Banner ── */}
      <section className="container mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl border border-gold/40 bg-card mandala-bg px-8 py-10 md:px-14 md:py-12 text-center"
        >
          {/* Decorative gold line top */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-32 bg-gradient-to-r from-transparent via-gold to-transparent" />

          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-transparent to-gold/50" />
            <span className="text-xs font-heading font-semibold uppercase tracking-[0.2em] text-gold">
              Direct from Manufacturer
            </span>
            <div className="h-px flex-1 max-w-[60px] bg-gradient-to-l from-transparent to-gold/50" />
          </div>

          <h2 className="font-brand text-3xl md:text-5xl font-bold leading-tight mb-4 tracking-tight">
            <span className="brand-text-gradient">
              We Give You the Best Price
            </span>
            <br />
            <span className="text-foreground font-display font-semibold text-2xl md:text-3xl">
              Because We Manufacture &amp; Sell Directly to You
            </span>
          </h2>

          <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            No middlemen. No agents. No extra markups. Our jewellery goes
            straight from our workshop in Ahmedabad to your hands — so every
            rupee you pay is for the product, not for someone's commission.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-7">
            {[
              { icon: "🏭", label: "In-House Manufacturing" },
              { icon: "🚫", label: "Zero Middlemen" },
              { icon: "💰", label: "Factory-Direct Pricing" },
              { icon: "✅", label: "Quality Guaranteed" },
            ].map((point) => (
              <div
                key={point.label}
                className="flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-1.5 text-sm font-heading font-medium text-foreground"
              >
                <span>{point.icon}</span>
                <span>{point.label}</span>
              </div>
            ))}
          </div>

          {/* Decorative gold line bottom */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-32 bg-gradient-to-r from-transparent via-gold to-transparent" />
        </motion.div>
      </section>

      {/* ── Wholesale Features ── */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {FEATURES.map((feat) => (
            <motion.div
              key={feat.title}
              variants={itemVariants}
              className="text-center p-6 rounded-xl border border-gold/20 bg-card hover:border-gold/40 hover:shadow-gold-sm transition-all"
            >
              <div className="h-12 w-12 rounded-full bg-gold/10 flex items-center justify-center text-gold mx-auto mb-4">
                {feat.icon}
              </div>
              <h3 className="font-heading font-semibold text-sm mb-1">
                {feat.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {feat.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Discount Info ── */}
      <section className="container mx-auto px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card border border-gold/30 rounded-2xl p-8 md:p-12 text-center mandala-bg relative overflow-hidden"
        >
          <div className="relative z-10">
            <Badge className="bg-gold/20 text-gold border-gold/40 mb-4">
              Wholesale Pricing Structure
            </Badge>
            <h2 className="font-display text-3xl font-bold mb-6">
              The More You Buy,{" "}
              <span className="gold-text-gradient">The More You Save</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-6">
              {[
                { qty: "6+ pcs", disc: "Base Price", note: "MOQ" },
                { qty: "50+ pcs", disc: "10% OFF", note: "Per order" },
                { qty: "100+ pcs", disc: "12% OFF", note: "Same item" },
                { qty: "200+ pcs", disc: "15% OFF", note: "Same design" },
              ].map((tier) => (
                <div
                  key={tier.qty}
                  className="bg-background/60 rounded-xl p-4 border border-gold/20"
                >
                  <div className="font-display text-lg font-bold text-gold">
                    {tier.disc}
                  </div>
                  <div className="font-heading text-sm font-semibold text-foreground">
                    {tier.qty}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {tier.note}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-muted-foreground text-sm">
              Login to get an additional{" "}
              <strong className="text-gold">5% off</strong> on all products
            </p>
          </div>
        </motion.div>
      </section>

      {/* ── Customer Types ── */}
      <section className="bg-card border-y border-gold/20 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-display text-3xl font-bold mb-3">
              We Serve <span className="gold-text-gradient">Both</span> Channels
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {[
              {
                type: "Online Sellers",
                platforms: ["Amazon", "Flipkart", "Meesho", "Myntra"],
                desc: "Lightweight, photographable pieces optimized for eCommerce listings",
                emoji: "🛒",
              },
              {
                type: "Retailers",
                platforms: ["Shops", "Exhibitions", "Boutiques", "Kiosks"],
                desc: "Display-ready pieces with premium finishing for physical retail",
                emoji: "🏪",
              },
            ].map((cust) => (
              <motion.div
                key={cust.type}
                initial={{
                  opacity: 0,
                  x: cust.type === "Online Sellers" ? -20 : 20,
                }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="border border-gold/30 rounded-2xl p-6 bg-background"
              >
                <div className="text-4xl mb-3">{cust.emoji}</div>
                <h3 className="font-heading font-bold text-xl mb-2 text-gold">
                  {cust.type}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {cust.desc}
                </p>
                <div className="flex flex-wrap gap-2">
                  {cust.platforms.map((p) => (
                    <Badge
                      key={p}
                      variant="outline"
                      className="text-xs border-gold/30 text-muted-foreground"
                    >
                      {p}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="container mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Ready to Place Your{" "}
            <span className="gold-text-gradient">Wholesale Order?</span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            Found us on IndiaMart? Browse our full catalogue and place your
            order directly online.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/shop">
              <Button
                size="lg"
                className="gold-gradient text-background font-bold hover:opacity-90 shadow-gold"
              >
                Browse Catalogue
              </Button>
            </Link>
            <a
              href="https://wa.me/919327999188"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                variant="outline"
                className="border-green-500/50 text-green-400 hover:bg-green-500/10"
              >
                WhatsApp Us
              </Button>
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

function ProductCard({
  product,
  isLoggedIn,
  showDealBadge = false,
}: {
  product: {
    id: string;
    name: string;
    price: bigint;
    category: Category;
    customerType: string;
    images: { getDirectURL: () => string }[];
  };
  isLoggedIn: boolean;
  showDealBadge?: boolean;
}) {
  const hasImage = product.images && product.images.length > 0;

  return (
    <Link
      to="/product/$id"
      params={{ id: product.id }}
      className="group block rounded-xl overflow-hidden border border-gold/20 hover:border-gold/50 transition-all hover:shadow-gold-sm bg-card"
    >
      <div className="aspect-square bg-muted relative overflow-hidden">
        {hasImage ? (
          <img
            src={product.images[0].getDirectURL()}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gold/20">
            <ShoppingBag className="h-12 w-12" />
          </div>
        )}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <Badge className="text-[10px] bg-background/80 text-muted-foreground border-0">
            Min 6 pcs
          </Badge>
          {showDealBadge && (
            <Badge className="text-[10px] bg-gold text-background border-0 gap-1">
              <Flame className="h-2.5 w-2.5" /> Best Price
            </Badge>
          )}
        </div>
        {isLoggedIn && (
          <div className="absolute top-2 right-2">
            <Badge className="text-[10px] bg-gold/90 text-background border-0">
              -5% for you
            </Badge>
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-heading font-semibold text-sm truncate group-hover:text-gold transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center justify-between mt-1">
          <span className="text-gold font-bold text-sm">
            {formatPrice(product.price)}/pc
          </span>
          {isLoggedIn && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
