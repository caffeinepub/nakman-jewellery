import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  CheckCircle,
  Package,
  Receipt,
  Upload,
} from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useAllProducts, useCart, usePlaceOrder } from "../hooks/useQueries";
import { calculateDiscount, formatINR } from "../utils/discount";

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu & Kashmir",
  "Ladakh",
];

export function Checkout() {
  const navigate = useNavigate();
  const { data: cartItems } = useCart();
  const { data: products } = useAllProducts();
  const placeOrder = usePlaceOrder();
  const { identity, login } = useInternetIdentity();
  const isLoggedIn = !!identity;

  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(
    null,
  );
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Package className="h-16 w-16 text-gold/30 mx-auto mb-4" />
        <h2 className="font-display text-2xl font-bold mb-2">Login Required</h2>
        <p className="text-muted-foreground mb-6">
          Please login to proceed with checkout
        </p>
        <Button
          onClick={login}
          className="gold-gradient text-background font-bold"
        >
          Login to Checkout
        </Button>
      </div>
    );
  }

  const cartWithProducts = (cartItems || []).map((item) => ({
    ...item,
    product: products?.find((p) => p.id === item.productId),
  }));

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

  const bulkSavings = cartWithProducts.reduce((sum, item) => {
    if (!item.product) return sum;
    const price = Number(item.product.price);
    const qty = Number(item.quantity);
    const original = price * qty;
    const bulkOnly = calculateDiscount(price, qty, false);
    return sum + (original - bulkOnly.discountedPrice);
  }, 0);

  const memberSavings = isLoggedIn
    ? totalOriginal - bulkSavings - totalAmount
    : 0;
  const totalSavings = totalOriginal - totalAmount;

  const MIN_ORDER_VALUE = 3000;
  const belowMinOrder = totalAmount < MIN_ORDER_VALUE;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large. Maximum size is 5MB.");
      return;
    }
    setScreenshot(file);
    const reader = new FileReader();
    reader.onload = (e) => setScreenshotPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (belowMinOrder) {
      toast.error(
        `Minimum order value is ₹3,000. Current total: ${formatINR(totalAmount)}`,
      );
      return;
    }
    if (!screenshot) {
      toast.error("Please upload payment screenshot");
      return;
    }
    if (
      !form.name ||
      !form.address ||
      !form.city ||
      !form.state ||
      !form.pincode ||
      !form.phone
    ) {
      toast.error("Please fill all shipping details");
      return;
    }

    const shippingAddress = `${form.name}\n${form.address}\n${form.city}, ${form.state} - ${form.pincode}\nPhone: ${form.phone}`;

    try {
      const bytes = await screenshot.arrayBuffer();
      const uint8Array = new Uint8Array(bytes);
      const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((p) =>
        setUploadProgress(Math.round(p)),
      );

      await placeOrder.mutateAsync({
        shippingAddress,
        paymentScreenshot: blob,
      });

      toast.success("Order placed successfully!");
      navigate({ to: "/account" });
    } catch (err) {
      toast.error("Failed to place order. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="font-display text-3xl font-bold">Checkout</h1>
      </motion.div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Shipping + Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card border border-gold/20 rounded-xl p-6"
            >
              <h2 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-gold/20 text-gold text-xs flex items-center justify-center font-bold">
                  1
                </span>
                Shipping Address
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Label
                    htmlFor="name"
                    className="text-sm text-muted-foreground"
                  >
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    className="mt-1 bg-background border-gold/30 focus:border-gold"
                    placeholder="Your full name"
                    required
                    autoComplete="name"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label
                    htmlFor="address"
                    className="text-sm text-muted-foreground"
                  >
                    Street Address *
                  </Label>
                  <Textarea
                    id="address"
                    value={form.address}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, address: e.target.value }))
                    }
                    className="mt-1 bg-background border-gold/30 focus:border-gold"
                    placeholder="House/Flat no., Street, Area..."
                    rows={2}
                    required
                    autoComplete="street-address"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="city"
                    className="text-sm text-muted-foreground"
                  >
                    City *
                  </Label>
                  <Input
                    id="city"
                    value={form.city}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, city: e.target.value }))
                    }
                    className="mt-1 bg-background border-gold/30 focus:border-gold"
                    placeholder="City"
                    required
                    autoComplete="address-level2"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="state"
                    className="text-sm text-muted-foreground"
                  >
                    State *
                  </Label>
                  <Select
                    value={form.state}
                    onValueChange={(v) => setForm((f) => ({ ...f, state: v }))}
                  >
                    <SelectTrigger className="mt-1 bg-background border-gold/30 focus:border-gold">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDIAN_STATES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label
                    htmlFor="pincode"
                    className="text-sm text-muted-foreground"
                  >
                    Pincode *
                  </Label>
                  <Input
                    id="pincode"
                    value={form.pincode}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, pincode: e.target.value }))
                    }
                    className="mt-1 bg-background border-gold/30 focus:border-gold"
                    placeholder="6-digit pincode"
                    maxLength={6}
                    pattern="[0-9]{6}"
                    required
                    autoComplete="postal-code"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="phone"
                    className="text-sm text-muted-foreground"
                  >
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, phone: e.target.value }))
                    }
                    className="mt-1 bg-background border-gold/30 focus:border-gold"
                    placeholder="+91 XXXXX XXXXX"
                    required
                    autoComplete="tel"
                    type="tel"
                  />
                </div>
              </div>
            </motion.div>

            {/* UPI Payment */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card border border-gold/20 rounded-xl p-6"
            >
              <h2 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-gold/20 text-gold text-xs flex items-center justify-center font-bold">
                  2
                </span>
                UPI Payment
              </h2>

              <p className="text-sm text-muted-foreground mb-4">
                Scan either QR code to pay. If one doesn't work, use the other.
                Then upload your payment screenshot below.
              </p>

              {/* Two UPI QR Codes */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  {
                    label: "UPI QR Code 1",
                    sub: "PhonePe / GPay / Paytm",
                    img: "/assets/generated/upi-qr-1.dim_300x300.png",
                  },
                  {
                    label: "UPI QR Code 2",
                    sub: "Backup QR — use if QR 1 fails",
                    img: "/assets/generated/upi-qr-2.dim_300x300.png",
                  },
                ].map((qr) => (
                  <div
                    key={qr.label}
                    className="border-2 border-dashed border-gold/50 rounded-xl p-4 flex flex-col items-center justify-center text-center bg-gold/5 hover:bg-gold/10 transition-colors"
                  >
                    <img
                      src={qr.img}
                      alt={qr.label}
                      className="h-36 w-36 rounded-lg mb-3 object-contain bg-white p-1"
                    />
                    <div className="font-heading font-semibold text-gold text-sm">
                      {qr.label}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {qr.sub}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gold/5 border border-gold/20 rounded-lg p-3 text-xs text-muted-foreground mb-4">
                <strong className="text-gold">
                  Total to Pay: {formatINR(totalAmount)}
                </strong>
                {totalSavings > 0 && (
                  <span className="text-green-400 ml-1">
                    (saved {formatINR(totalSavings)})
                  </span>
                )}
                <span className="ml-1">
                  — Please ensure you pay the exact amount.
                </span>
              </div>

              {/* Screenshot Upload */}
              <div>
                <Label className="text-sm text-muted-foreground">
                  Payment Screenshot * (max 5MB)
                </Label>
                {/* biome-ignore lint/a11y/useKeyWithClickEvents: file upload trigger */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`mt-2 border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${
                    screenshot
                      ? "border-green-500/50 bg-green-500/5"
                      : "border-gold/30 bg-background hover:border-gold/60 hover:bg-gold/5"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {screenshotPreview ? (
                    <div className="space-y-2 text-center">
                      <img
                        src={screenshotPreview}
                        alt="Payment screenshot"
                        className="max-h-32 mx-auto rounded-lg"
                      />
                      <div className="flex items-center gap-1 text-green-400 text-sm">
                        <CheckCircle className="h-4 w-4" />
                        Screenshot uploaded
                      </div>
                      <button
                        type="button"
                        className="text-xs text-muted-foreground hover:text-foreground"
                        onClick={(e) => {
                          e.stopPropagation();
                          setScreenshot(null);
                          setScreenshotPreview(null);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="h-8 w-8 text-gold/40 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload payment screenshot
                      </p>
                      <p className="text-xs text-muted-foreground/60 mt-1">
                        PNG, JPG up to 5MB
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Order Summary */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="sticky top-20 bg-card border border-gold/20 rounded-xl p-5 space-y-4"
            >
              <h2 className="font-heading font-semibold text-lg">
                Order Summary
              </h2>

              <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                {cartWithProducts.map((item) => {
                  if (!item.product) return null;
                  const price = Number(item.product.price);
                  const qty = Number(item.quantity);
                  const disc = calculateDiscount(price, qty, isLoggedIn);
                  return (
                    <div key={item.productId} className="flex gap-3">
                      <div className="h-12 w-12 rounded-lg overflow-hidden bg-muted shrink-0">
                        {item.product.images?.[0] ? (
                          <img
                            src={item.product.images[0].getDirectURL()}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : null}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {qty} pcs × {formatINR(price)}
                        </p>
                        <p className="text-xs text-gold font-bold">
                          {formatINR(disc.discountedPrice)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bill Summary Receipt */}
              <div className="border border-gold/20 rounded-lg bg-background/50 overflow-hidden">
                <div className="bg-gold/10 px-4 py-2 flex items-center gap-2">
                  <Receipt className="h-3.5 w-3.5 text-gold" />
                  <span className="text-xs font-bold tracking-widest text-gold uppercase">
                    Bill Summary
                  </span>
                </div>
                <div className="px-4 py-3 space-y-2 text-sm">
                  {/* Actual price */}
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      Items (Actual Price)
                    </span>
                    <span className="text-muted-foreground">
                      {formatINR(totalOriginal)}
                    </span>
                  </div>

                  {/* Bulk discount */}
                  {bulkSavings > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-xs">
                        Bulk Discount
                      </span>
                      <span className="text-green-400 font-medium text-xs">
                        -{formatINR(bulkSavings)}
                      </span>
                    </div>
                  )}

                  {/* Member discount */}
                  {isLoggedIn && memberSavings > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-xs">
                        Member Discount (5%)
                      </span>
                      <span className="text-green-400 font-medium text-xs">
                        -{formatINR(memberSavings)}
                      </span>
                    </div>
                  )}

                  {totalSavings > 0 && (
                    <>
                      <Separator className="bg-gold/20" />
                      <div className="flex justify-between items-center">
                        <span className="text-green-400 font-semibold text-xs">
                          You Save
                        </span>
                        <span className="text-green-400 font-semibold text-xs">
                          -{formatINR(totalSavings)}
                        </span>
                      </div>
                      <Separator className="bg-gold/20" />
                    </>
                  )}

                  {/* Subtotal after discount */}
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Subtotal</span>
                    <span className="text-gold font-bold">
                      {formatINR(totalAmount)}
                    </span>
                  </div>

                  {/* Shipping */}
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>Shipping</span>
                    <span>As per pincode chart</span>
                  </div>

                  <Separator className="bg-gold/20" />

                  {/* Grand total */}
                  <div className="flex justify-between items-center pt-0.5">
                    <span className="font-bold text-base uppercase tracking-wide">
                      Total Payable
                    </span>
                    <span className="text-gold font-bold text-base">
                      {formatINR(totalAmount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Min order value warning */}
              {belowMinOrder && (
                <div className="flex items-start gap-1.5 bg-gold/10 border border-gold/30 rounded-lg p-3 text-xs text-gold">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  <span>
                    Minimum order value is ₹3,000. Current total:{" "}
                    {formatINR(totalAmount)}
                  </span>
                </div>
              )}

              {placeOrder.isPending && uploadProgress > 0 && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Uploading screenshot...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gold rounded-full transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <Button
                type="submit"
                data-ocid="checkout.submit_button"
                disabled={
                  placeOrder.isPending ||
                  !screenshot ||
                  cartItems?.length === 0 ||
                  belowMinOrder
                }
                className="w-full gold-gradient text-background font-bold hover:opacity-90 shadow-gold"
              >
                {placeOrder.isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Placing Order...
                  </span>
                ) : (
                  "Place Order"
                )}
              </Button>

              {!screenshot && (
                <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                  <AlertCircle className="h-3 w-3 shrink-0 mt-0.5" />
                  <span>Upload payment screenshot to proceed</span>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </form>
    </div>
  );
}
