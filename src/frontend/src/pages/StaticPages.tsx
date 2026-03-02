import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "@tanstack/react-router";
import { MapPin, MessageCircle, Phone } from "lucide-react";
import { motion } from "motion/react";
import { SiWhatsapp } from "react-icons/si";

// ─── About Us ────────────────────────────────────────────────────────────────

export function About() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4 mb-8">
          <img
            src="/assets/uploads/Malabar-Tradmark-Logo-1.jpg"
            alt="NakMan Jewellery"
            className="h-20 w-20 rounded-full ring-4 ring-gold/40"
          />
          <div>
            <h1 className="font-display text-3xl font-bold">
              About <span className="gold-text-gradient">NakMan Jewellery</span>
            </h1>
            <p className="text-muted-foreground">By Malabar Enterprise</p>
          </div>
        </div>

        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <div className="bg-card border border-gold/20 rounded-xl p-6">
            <h2 className="font-heading font-semibold text-foreground text-lg mb-3">
              Our Story
            </h2>
            <p>
              NakMan Jewellery, a brand by Malabar Enterprise, is a trusted
              wholesale supplier of premium imitation jewellery, headquartered
              in Thakkarnagar, Ahmedabad, Gujarat. As a manufacturer and direct
              seller, we eliminate all middlemen and agents — ensuring you
              receive the best quality at the most competitive wholesale prices.
              For over 7 years, we have proudly served retailers and online
              sellers across India with fashion-forward, high-quality pieces
              that keep up with the latest trends.
            </p>
          </div>

          <div className="bg-card border border-gold/20 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-gold/20 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-gold" />
              <span className="font-heading font-semibold text-foreground">
                Our Location — Thakkarnagar, Ahmedabad, Gujarat – 382350
              </span>
            </div>
            <iframe
              title="NakMan Jewellery Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3672.4!2d72.5714!3d23.0225!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e84b0a5cfffff%3A0x1!2sThakkarnagar%2C+Ahmedabad%2C+Gujarat+382350!5e0!3m2!1sen!2sin!4v1700000000000"
              width="100%"
              height="320"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            />
          </div>

          <div className="bg-card border border-gold/20 rounded-xl p-6">
            <h2 className="font-heading font-semibold text-foreground text-lg mb-3">
              Our Products
            </h2>
            <p>
              We specialize in a complete range of imitation jewellery including
              gold and silver earrings, bridal jewellery sets, anklets, bangles,
              kadli, chain pendants, bracelets, chains, rings, tikka, damnni,
              and kavda silver ornaments.
            </p>
            <p className="mt-3">
              Every piece is crafted with attention to detail, using quality
              imitation materials that offer the look and feel of fine jewellery
              at a fraction of the cost. Our designs are updated regularly to
              keep pace with the latest fashion trends from Bollywood, bridal
              seasons, and festive collections.
            </p>
          </div>

          <div className="bg-card border border-gold/20 rounded-xl p-6">
            <h2 className="font-heading font-semibold text-foreground text-lg mb-3">
              Who We Serve
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <h3 className="font-heading font-semibold text-gold text-sm mb-2">
                  Online Sellers
                </h3>
                <p className="text-sm">
                  We supply Amazon, Flipkart, Meesho, and Myntra sellers with
                  photographable, lightweight pieces designed for eCommerce
                  listing success. Our packaging ensures zero transit damage.
                </p>
              </div>
              <div>
                <h3 className="font-heading font-semibold text-gold text-sm mb-2">
                  Retailers
                </h3>
                <p className="text-sm">
                  Brick-and-mortar shops, exhibition stalls, boutiques, and
                  kiosks trust NakMan for display-ready pieces with premium
                  finishing that customers love to touch and try.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-gold/20 rounded-xl p-6">
            <h2 className="font-heading font-semibold text-foreground text-lg mb-4">
              Get in Touch
            </h2>
            <div className="space-y-3">
              <a
                href="https://wa.me/919327999188"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm hover:text-green-400 transition-colors"
              >
                <SiWhatsapp className="h-5 w-5 text-green-500" />
                +91 93279 99188 (WhatsApp)
              </a>
              <a
                href="https://wa.me/919099008288"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm hover:text-green-400 transition-colors"
              >
                <SiWhatsapp className="h-5 w-5 text-green-500" />
                +91 90990 08288 (WhatsApp)
              </a>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-5 w-5 text-gold" />
                Thakkarnagar, Ahmedabad, Gujarat - 382350
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Returns Policy ──────────────────────────────────────────────────────────

export function Returns() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-3xl font-bold mb-2">
          Returns <span className="gold-text-gradient">Policy</span>
        </h1>
        <p className="text-muted-foreground text-sm mb-8">
          Last updated: March 2026
        </p>

        <div className="space-y-6 text-muted-foreground">
          {[
            {
              title: "Return Eligibility",
              content:
                "As a wholesale supplier offering factory-direct pricing, we are unable to accommodate product returns. We are committed to providing you with the best quality items at the lowest wholesale rates, so that you can sell with confidence — whether online or in-store. You are welcome to verify our reputation and customer reviews on IndiaMart. Should you have any concerns before placing an order, please do not hesitate to contact us directly. All sales are final under our wholesale terms, and no returned products will be accepted.",
            },
            {
              title: "Conditions for Return",
              content:
                "As our products are sold at wholesale rates, we regret that we are unable to accept any returns. We strongly encourage buyers to review product details, images, and descriptions carefully before placing an order. For any clarifications, our team is always happy to assist prior to purchase.",
            },
            {
              title: "Return Process",
              content:
                "Should you have any concerns or queries after receiving your order, please reach out to our support team directly on WhatsApp at +91 93279 99188. We are here to assist you and will do our best to address your concerns promptly.",
            },
            {
              title: "Refunds",
              content:
                "We do not offer refunds on delivered orders. However, in the exceptional circumstance that a product is out of stock after your order has been placed and we are unable to fulfil the delivery, we will process a full refund to your original payment method on the same day.",
            },
            {
              title: "Out of Stock",
              content:
                "In the event that an ordered product is unavailable, we will notify you immediately and arrange a full refund without delay. Alternatively, if you would like to select a replacement product of your choice, we are happy to accommodate that as well.",
            },
            {
              title: "Exchanges",
              content:
                "In the rare event of an error on our part — such as an incorrect item being dispatched — we will gladly arrange an exchange for our valued customers at no additional cost. Please contact us on WhatsApp at the earliest, and our team will guide you through the process.",
            },
            {
              title: "Wholesale Order Policy",
              content:
                "For wholesale orders above ₹5,000, we strongly recommend inspecting all goods within 48 hours of delivery and promptly reporting any discrepancies to our team. In the case of large orders with confirmed manufacturing defects, partial returns or exchanges may be considered at our discretion. Please note that Cash on Delivery (COD) is not available for any orders.",
            },
          ].map((section) => (
            <div
              key={section.title}
              className="bg-card border border-gold/20 rounded-xl p-6"
            >
              <h2 className="font-heading font-semibold text-foreground text-base mb-3">
                {section.title}
              </h2>
              <p className="text-sm leading-relaxed">{section.content}</p>
            </div>
          ))}

          <div className="bg-gold/5 border border-gold/30 rounded-xl p-6">
            <h2 className="font-heading font-semibold text-gold text-base mb-3">
              Contact for Returns
            </h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="https://wa.me/919327999188"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm hover:text-green-400"
              >
                <SiWhatsapp className="h-4 w-4 text-green-500" />
                +91 93279 99188
              </a>
              <a
                href="https://wa.me/919099008288"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm hover:text-green-400"
              >
                <SiWhatsapp className="h-4 w-4 text-green-500" />
                +91 90990 08288
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Privacy Policy ──────────────────────────────────────────────────────────

export function Privacy() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-3xl font-bold mb-2">
          Privacy <span className="gold-text-gradient">Policy</span>
        </h1>
        <p className="text-muted-foreground text-sm mb-8">
          Last updated: January 2026
        </p>

        <div className="space-y-6 text-muted-foreground">
          {[
            {
              title: "Information We Collect",
              content:
                "When you register or place an order on NakMan Jewellery, we collect: your name, email address, phone number, shipping address, and customer type (Online Seller or Retailer). We also collect your Internet Identity principal for authentication purposes. Payment details are processed through UPI and we do not store your UPI credentials.",
            },
            {
              title: "How We Use Your Information",
              content:
                "Your information is used to: process and fulfil your wholesale orders, send order confirmations and shipping updates via WhatsApp, provide customer support, apply appropriate discounts based on your customer type, and improve our product catalogue and service.",
            },
            {
              title: "Data Sharing",
              content:
                "We do not sell, trade, or rent your personal information to third parties. We may share your shipping address with logistics partners solely for order delivery purposes. We do not share your data with marketing agencies.",
            },
            {
              title: "Data Security",
              content:
                "Our platform is built on the Internet Computer Protocol (ICP), which provides cryptographic security for all data stored on-chain. Your account is protected by Internet Identity, a secure, password-free authentication system. We take reasonable measures to protect your personal information.",
            },
            {
              title: "Your Rights",
              content:
                "You have the right to access, update, or delete your personal information. You can update your profile details at any time from your Account page. To request complete account deletion, contact us on WhatsApp.",
            },
            {
              title: "Cookies",
              content:
                "We use minimal cookies necessary for session management and authentication. We do not use tracking cookies or third-party advertising cookies.",
            },
            {
              title: "Changes to This Policy",
              content:
                "We may update this Privacy Policy from time to time. We will notify you of significant changes via the website or WhatsApp. Continued use of the platform after changes constitutes acceptance of the updated policy.",
            },
          ].map((section) => (
            <div
              key={section.title}
              className="bg-card border border-gold/20 rounded-xl p-6"
            >
              <h2 className="font-heading font-semibold text-foreground text-base mb-3">
                {section.title}
              </h2>
              <p className="text-sm leading-relaxed">{section.content}</p>
            </div>
          ))}

          <div className="bg-gold/5 border border-gold/30 rounded-xl p-6">
            <h2 className="font-heading font-semibold text-gold text-base mb-3">
              Contact Us
            </h2>
            <p className="text-sm mb-3">
              For privacy concerns or questions, reach us on WhatsApp:
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="https://wa.me/919327999188"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm hover:text-green-400"
              >
                <SiWhatsapp className="h-4 w-4 text-green-500" />
                +91 93279 99188
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Shipping Chart ───────────────────────────────────────────────────────────

export function Shipping() {
  const sampleData = [
    {
      state: "Gujarat",
      city: "Surat, Ahmedabad, Vadodara",
      pincode: "395xxx, 380xxx",
      cost: "₹50",
    },
    {
      state: "Maharashtra",
      city: "Mumbai, Pune, Nagpur",
      pincode: "400xxx, 411xxx",
      cost: "₹60",
    },
    {
      state: "Delhi NCR",
      city: "Delhi, Noida, Gurgaon",
      pincode: "110xxx, 201xxx",
      cost: "₹65",
    },
    {
      state: "Rajasthan",
      city: "Jaipur, Jodhpur, Udaipur",
      pincode: "302xxx, 342xxx",
      cost: "₹65",
    },
    {
      state: "Uttar Pradesh",
      city: "Lucknow, Kanpur, Agra",
      pincode: "226xxx, 208xxx",
      cost: "₹70",
    },
    {
      state: "West Bengal",
      city: "Kolkata, Howrah",
      pincode: "700xxx, 711xxx",
      cost: "₹75",
    },
    {
      state: "Tamil Nadu",
      city: "Chennai, Coimbatore, Madurai",
      pincode: "600xxx, 641xxx",
      cost: "₹80",
    },
    {
      state: "Karnataka",
      city: "Bengaluru, Mysuru",
      pincode: "560xxx, 570xxx",
      cost: "₹80",
    },
    {
      state: "Telangana",
      city: "Hyderabad, Secunderabad",
      pincode: "500xxx",
      cost: "₹75",
    },
    {
      state: "Punjab",
      city: "Ludhiana, Amritsar, Chandigarh",
      pincode: "141xxx, 143xxx",
      cost: "₹70",
    },
    {
      state: "Other States",
      city: "All other cities",
      pincode: "All pincodes",
      cost: "₹90–₹120",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-3xl font-bold mb-2">
          Shipping <span className="gold-text-gradient">Chart</span>
        </h1>
        <p className="text-muted-foreground text-sm mb-2">
          Pan-India shipping rates for wholesale orders
        </p>

        <div className="bg-gold/10 border border-gold/30 rounded-xl p-4 mb-6 text-sm text-gold">
          <strong>📋 Note:</strong> These are indicative rates. Final shipping
          cost depends on order weight and pincode. Exact rates will be
          confirmed at checkout or contact us on WhatsApp for your pincode.
        </div>

        <div className="border border-gold/20 rounded-xl overflow-hidden mb-8">
          <Table>
            <TableHeader>
              <TableRow className="border-gold/20 bg-card hover:bg-card">
                <TableHead>State</TableHead>
                <TableHead>Cities</TableHead>
                <TableHead>Pincode Range</TableHead>
                <TableHead>Shipping Cost (INR)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleData.map((row, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static table
                <TableRow key={i} className="border-gold/20">
                  <TableCell className="font-medium">{row.state}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {row.city}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground font-mono text-xs">
                    {row.pincode}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="border-gold/40 text-gold font-bold"
                    >
                      {row.cost}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-card border border-gold/20 rounded-xl p-5">
            <h2 className="font-heading font-semibold text-base mb-3">
              Shipping Notes
            </h2>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Shipping charges apply on all wholesale orders</li>
              <li>• No free shipping</li>
              <li>• Orders dispatched within 1-3 business days</li>
              <li>• Delivery time: 3-10 working days from Ahmedabad</li>
              <li>• All orders shipped with tracking</li>
              <li>• Fragile items packed in bubble wrap</li>
            </ul>
          </div>
          <div className="bg-gold/5 border border-gold/30 rounded-xl p-5">
            <h2 className="font-heading font-semibold text-base mb-3 text-gold">
              Check Your Pincode Rate
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              For exact shipping cost to your pincode, contact us on WhatsApp:
            </p>
            <div className="space-y-2">
              <a
                href="https://wa.me/919327999188"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm hover:text-green-400 transition-colors"
              >
                <SiWhatsapp className="h-4 w-4 text-green-500" />
                +91 93279 99188
              </a>
              <a
                href="https://wa.me/919099008288"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm hover:text-green-400 transition-colors"
              >
                <SiWhatsapp className="h-4 w-4 text-green-500" />
                +91 90990 08288
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
