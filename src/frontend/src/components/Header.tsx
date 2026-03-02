import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "@tanstack/react-router";
import { Menu, ShoppingCart, User, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useCart } from "../hooks/useQueries";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Blog", href: "/blog" },
  { label: "Shipping", href: "/shipping" },
  { label: "About", href: "/about" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const { data: cartItems } = useCart();
  const location = useLocation();
  const isLoggedIn = !!identity;
  const cartCount = cartItems?.reduce(
    (sum, item) => sum + Number(item.quantity),
    0,
  );

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl"
      style={{
        background:
          "linear-gradient(to bottom, oklch(0.10 0.028 250 / 0.96) 0%, oklch(0.14 0.030 250 / 0.92) 100%)",
        borderBottom: "1px solid oklch(0.76 0.18 68 / 0.18)",
        boxShadow: "0 4px 24px oklch(0.05 0.020 250 / 0.60)",
      }}
    >
      <div className="container mx-auto flex h-[68px] items-center justify-between px-4 lg:px-6">
        {/* ── Logo ── */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div className="relative">
            <img
              src="/assets/uploads/Malabar-Tradmark-Logo-1.jpg"
              alt="NakMan Jewellery"
              className="h-10 w-10 rounded-full object-cover transition-all duration-300"
              style={{
                boxShadow:
                  "0 0 0 2px oklch(0.76 0.18 68 / 0.40), 0 0 14px oklch(0.76 0.18 68 / 0.20)",
              }}
            />
          </div>
          <div className="hidden sm:block">
            <div
              className="font-brand text-xl font-bold brand-text-gradient leading-none tracking-wide"
              style={{ fontVariationSettings: '"opsz" 144' }}
            >
              NakMan
            </div>
            <div
              className="text-[9px] tracking-[0.30em] uppercase font-heading font-semibold mt-0.5"
              style={{ color: "oklch(0.76 0.18 68 / 0.65)" }}
            >
              Jewellery
            </div>
          </div>
        </Link>

        {/* ── Vertical Separator ── */}
        <div
          className="hidden lg:block h-7 w-px mx-4 shrink-0"
          style={{ background: "oklch(0.76 0.18 68 / 0.20)" }}
        />

        {/* ── Desktop Nav ── */}
        <nav className="hidden md:flex items-center gap-0.5 flex-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`relative px-3.5 py-2 text-[13px] rounded-md transition-all duration-200 font-heading font-medium tracking-wide ${
                  isActive
                    ? "text-gold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-3.5 right-3.5 h-0.5 rounded-full"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, oklch(0.76 0.18 68), transparent)",
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── Right Actions ── */}
        <div className="flex items-center gap-1.5">
          {/* Wholesale badge — desktop only */}
          <div
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-heading font-semibold tracking-wider uppercase mr-2"
            style={{
              background: "oklch(0.76 0.18 68 / 0.10)",
              border: "1px solid oklch(0.76 0.18 68 / 0.25)",
              color: "oklch(0.82 0.16 68)",
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: "oklch(0.76 0.18 68)" }}
            />
            B2B Only
          </div>

          {/* Cart */}
          <Link to="/cart" className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full hover:text-gold transition-colors"
              style={{ color: "oklch(0.72 0.040 250)" }}
            >
              <ShoppingCart className="h-[18px] w-[18px]" />
              {cartCount && cartCount > 0 ? (
                <Badge
                  className="absolute -top-0.5 -right-0.5 h-[18px] w-[18px] p-0 flex items-center justify-center text-[9px] rounded-full border-0 font-bold"
                  style={{
                    background: "oklch(0.76 0.18 68)",
                    color: "oklch(0.12 0.028 250)",
                  }}
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </Badge>
              ) : null}
            </Button>
          </Link>

          {/* Auth */}
          {isLoggedIn ? (
            <div className="hidden md:flex items-center gap-1">
              <Link to="/account">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-[13px] font-heading font-medium h-9"
                  style={{ color: "oklch(0.76 0.18 68)" }}
                >
                  <User className="h-3.5 w-3.5" />
                  Account
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={clear}
                className="text-[13px] font-heading font-medium h-9 text-muted-foreground hover:text-foreground"
              >
                Logout
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              onClick={login}
              disabled={isLoggingIn}
              className="hidden md:flex h-9 px-4 text-[13px] font-heading font-semibold rounded-lg hover:opacity-90 transition-opacity"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.86 0.14 75) 0%, oklch(0.76 0.18 68) 50%, oklch(0.62 0.20 58) 100%)",
                color: "oklch(0.12 0.028 250)",
                boxShadow: "0 2px 12px oklch(0.76 0.18 68 / 0.30)",
              }}
            >
              {isLoggingIn ? "Logging in..." : "Login"}
            </Button>
          )}

          {/* Mobile toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9 rounded-full hover:text-gold"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -45, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 45, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 45, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -45, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="md:hidden overflow-hidden"
            style={{
              borderTop: "1px solid oklch(0.76 0.18 68 / 0.15)",
              background: "oklch(0.12 0.028 250 / 0.98)",
            }}
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-0.5">
              {navLinks.map((link, i) => {
                const isActive = location.pathname === link.href;
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      to={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg transition-colors font-heading font-medium ${
                        isActive
                          ? "text-gold bg-gold/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }`}
                    >
                      {isActive && (
                        <span
                          className="h-1 w-1 rounded-full shrink-0"
                          style={{ background: "oklch(0.76 0.18 68)" }}
                        />
                      )}
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}

              <div
                className="mt-2 pt-3 flex flex-col gap-1.5"
                style={{ borderTop: "1px solid oklch(0.76 0.18 68 / 0.15)" }}
              >
                {isLoggedIn ? (
                  <>
                    <Link
                      to="/account"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg font-heading font-medium text-gold hover:bg-gold/10 transition-colors"
                    >
                      <User className="h-4 w-4" />
                      My Account
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        clear();
                        setMobileOpen(false);
                      }}
                      className="px-3 py-2.5 text-sm rounded-lg font-heading font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors text-left"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Button
                    onClick={() => {
                      login();
                      setMobileOpen(false);
                    }}
                    className="font-heading font-semibold w-full rounded-lg"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.86 0.14 75) 0%, oklch(0.76 0.18 68) 50%, oklch(0.62 0.20 58) 100%)",
                      color: "oklch(0.12 0.028 250)",
                    }}
                  >
                    Login / Register
                  </Button>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
