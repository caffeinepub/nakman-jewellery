import { Link } from "@tanstack/react-router";
import { Heart, MapPin } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

export function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);

  return (
    <footer className="border-t border-gold/20 bg-card mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/assets/uploads/Malabar-Tradmark-Logo-1.jpg"
                alt="NakMan Jewellery"
                className="h-12 w-12 rounded-full object-cover ring-2 ring-gold/40"
              />
              <div>
                <div className="font-brand text-lg font-bold brand-text-gradient leading-none">
                  NakMan
                </div>
                <div
                  className="text-[9px] tracking-[0.25em] uppercase font-heading font-semibold mt-0.5"
                  style={{ color: "oklch(0.76 0.18 68 / 0.55)" }}
                >
                  Jewellery
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Premium imitation jewellery wholesale. Trusted by retailers and
              online sellers across India.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              By Malabar Enterprise
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">
              Quick Links
            </h3>
            <nav className="flex flex-col gap-2">
              {[
                { label: "Shop All", href: "/shop" },
                { label: "Blog & News", href: "/blog" },
                { label: "About Us", href: "/about" },
                { label: "Shipping Chart", href: "/shipping" },
              ].map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm text-muted-foreground hover:text-gold transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Policies */}
          <div>
            <h3 className="font-heading font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">
              Policies
            </h3>
            <nav className="flex flex-col gap-2">
              {[
                { label: "Returns Policy", href: "/returns" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "My Account", href: "/account" },
              ].map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm text-muted-foreground hover:text-gold transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">
              Contact Us
            </h3>
            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <a
                href="https://wa.me/919327999188"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-green-400 transition-colors"
              >
                <SiWhatsapp className="h-4 w-4 text-green-500" />
                +91 93279 99188
              </a>
              <a
                href="https://wa.me/919099008288"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-green-400 transition-colors"
              >
                <SiWhatsapp className="h-4 w-4 text-green-500" />
                +91 90990 08288
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gold" />
                Thakkarnagar, Ahmedabad - 382350
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gold/20 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-muted-foreground">
          <p>
            © {year} Malabar Enterprise. NakMan Jewellery. All rights reserved.
          </p>
          <p>
            Built with{" "}
            <Heart className="inline h-3 w-3 text-red-400 fill-red-400" /> using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
