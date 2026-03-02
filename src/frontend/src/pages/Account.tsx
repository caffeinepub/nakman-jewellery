import { Badge } from "@/components/ui/badge";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Edit2, LogOut, Package, User, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CustomerType, OrderStatus } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAllProducts,
  useMyOrders,
  useSaveProfile,
  useUserProfile,
} from "../hooks/useQueries";
import { calculateDiscount, formatINR } from "../utils/discount";

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.pending]: "Pending",
  [OrderStatus.processing]: "Processing",
  [OrderStatus.paymentVerified]: "Payment Verified",
  [OrderStatus.shipped]: "Shipped",
  [OrderStatus.delivered]: "Delivered",
  [OrderStatus.cancelled]: "Cancelled",
};

const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  [OrderStatus.pending]: "bg-gold/20 text-gold border-gold/30",
  [OrderStatus.processing]: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  [OrderStatus.paymentVerified]:
    "bg-green-500/20 text-green-400 border-green-500/30",
  [OrderStatus.shipped]: "bg-sky-500/20 text-sky-400 border-sky-500/30",
  [OrderStatus.delivered]:
    "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  [OrderStatus.cancelled]: "bg-red-500/20 text-red-400 border-red-500/30",
};

export function Account() {
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const isLoggedIn = !!identity;

  if (!isLoggedIn) {
    return <LoginRegisterView onLogin={login} isLoggingIn={isLoggingIn} />;
  }

  return <AccountView onLogout={clear} />;
}

function LoginRegisterView({
  onLogin,
  isLoggingIn,
}: {
  onLogin: () => void;
  isLoggingIn: boolean;
}) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-gold/20 rounded-2xl p-8 text-center"
      >
        <img
          src="/assets/uploads/Malabar-Tradmark-Logo-1.jpg"
          alt="NakMan Jewellery"
          className="h-16 w-16 rounded-full ring-2 ring-gold/50 mx-auto mb-4"
        />
        <h1 className="font-display text-2xl font-bold mb-2">
          Welcome to <span className="gold-text-gradient">NakMan</span>
        </h1>
        <p className="text-muted-foreground text-sm mb-6">
          Login to access your wholesale account, track orders, and get 5% extra
          discount on all products.
        </p>

        <Button
          size="lg"
          data-ocid="account.login_button"
          onClick={onLogin}
          disabled={isLoggingIn}
          className="w-full gold-gradient text-background font-bold hover:opacity-90 shadow-gold"
        >
          {isLoggingIn ? "Logging in..." : "Login / Register"}
        </Button>

        <div className="mt-6 space-y-3 text-left">
          <div className="bg-gold/5 border border-gold/20 rounded-xl p-4 text-sm">
            <h3 className="font-heading font-semibold text-gold mb-2">
              Benefits of logging in:
            </h3>
            <ul className="space-y-1 text-muted-foreground text-xs">
              <li>✓ Extra 5% discount on all products</li>
              <li>✓ Track your wholesale orders</li>
              <li>✓ Save shipping addresses</li>
              <li>✓ Personalized product recommendations</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function AccountView({ onLogout }: { onLogout: () => void }) {
  const { data: profile, isLoading } = useUserProfile();
  const saveProfile = useSaveProfile();
  const { data: orders } = useMyOrders();
  const { data: products } = useAllProducts();
  const { identity } = useInternetIdentity();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    customerType: CustomerType.retailer as CustomerType,
  });

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        customerType: profile.customerType,
      });
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      await saveProfile.mutateAsync({
        name: form.name,
        email: form.email,
        phone: form.phone,
        customerType: form.customerType,
      });
      setEditing(false);
      toast.success("Profile saved successfully!");
    } catch {
      toast.error("Failed to save profile.");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-4 max-w-2xl">
        <Skeleton className="h-12 w-48" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    );
  }

  const principal = identity?.getPrincipal().toString();
  const shortPrincipal = principal
    ? `${principal.slice(0, 8)}...${principal.slice(-6)}`
    : "";

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center justify-between"
      >
        <h1 className="font-display text-3xl font-bold">
          My <span className="gold-text-gradient">Account</span>
        </h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={onLogout}
          className="text-muted-foreground hover:text-foreground gap-1"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </motion.div>

      <Tabs defaultValue="profile">
        <TabsList className="mb-6 bg-card border border-gold/20">
          <TabsTrigger
            value="profile"
            className="data-[state=active]:text-gold"
          >
            <User className="h-4 w-4 mr-1" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="orders" className="data-[state=active]:text-gold">
            <Package className="h-4 w-4 mr-1" />
            Orders ({orders?.length || 0})
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-gold/20 rounded-xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-semibold">Profile Details</h2>
              {!editing ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditing(true)}
                  className="text-gold hover:text-gold/80 gap-1"
                >
                  <Edit2 className="h-3 w-3" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditing(false)}
                    className="text-muted-foreground"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={saveProfile.isPending}
                    className="gold-gradient text-background gap-1"
                  >
                    <Check className="h-3 w-3" />
                    Save
                  </Button>
                </div>
              )}
            </div>

            {/* Principal ID */}
            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                Account ID
              </Label>
              <p className="text-sm font-mono text-muted-foreground mt-0.5">
                {shortPrincipal}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                  Full Name
                </Label>
                {editing ? (
                  <Input
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    className="mt-1 bg-background border-gold/30 focus:border-gold"
                    placeholder="Your full name"
                  />
                ) : (
                  <p className="text-sm text-foreground mt-0.5">
                    {profile?.name || "—"}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                  Email
                </Label>
                {editing ? (
                  <Input
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    className="mt-1 bg-background border-gold/30 focus:border-gold"
                    placeholder="email@example.com"
                    type="email"
                    autoComplete="email"
                  />
                ) : (
                  <p className="text-sm text-foreground mt-0.5">
                    {profile?.email || "—"}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                  Phone
                </Label>
                {editing ? (
                  <Input
                    value={form.phone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, phone: e.target.value }))
                    }
                    className="mt-1 bg-background border-gold/30 focus:border-gold"
                    placeholder="+91 XXXXX XXXXX"
                    type="tel"
                    autoComplete="tel"
                  />
                ) : (
                  <p className="text-sm text-foreground mt-0.5">
                    {profile?.phone || "—"}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                  Customer Type
                </Label>
                {editing ? (
                  <Select
                    value={form.customerType}
                    onValueChange={(v) =>
                      setForm((f) => ({
                        ...f,
                        customerType: v as CustomerType,
                      }))
                    }
                  >
                    <SelectTrigger className="mt-1 bg-background border-gold/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={CustomerType.onlineSeller}>
                        Online Seller (Amazon/Flipkart/Meesho/Myntra)
                      </SelectItem>
                      <SelectItem value={CustomerType.retailer}>
                        Retailer (Physical Store)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="mt-0.5">
                    <Badge
                      variant="outline"
                      className={
                        profile?.customerType === CustomerType.onlineSeller
                          ? "border-blue-500/40 text-blue-400"
                          : "border-gold/40 text-gold"
                      }
                    >
                      {profile?.customerType === CustomerType.onlineSeller
                        ? "Online Seller"
                        : profile?.customerType === CustomerType.retailer
                          ? "Retailer"
                          : "Not set"}
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Register prompt if no profile */}
            {!profile && !editing && (
              <div className="bg-gold/5 border border-gold/20 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-3">
                  Complete your profile to save your details and preferences.
                </p>
                <Button
                  size="sm"
                  onClick={() => setEditing(true)}
                  className="gold-gradient text-background"
                >
                  Complete Profile
                </Button>
              </div>
            )}
          </motion.div>

          <div className="mt-4 bg-gold/5 border border-gold/20 rounded-xl p-4">
            <div className="flex items-center gap-2 text-gold text-sm font-medium">
              ✓ 5% member discount is active on your account
            </div>
          </div>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {!orders || orders.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-gold/30 rounded-xl">
                <Package className="h-12 w-12 text-gold/30 mx-auto mb-3" />
                <p className="text-muted-foreground font-medium">
                  No orders yet
                </p>
                <p className="text-sm text-muted-foreground/60 mt-1">
                  Your wholesale orders will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const date = new Date(Number(order.createdAt) / 1_000_000);
                  const discountedTotal = Number(order.totalAmount);

                  // Compute original total using current product prices
                  const originalTotal = order.items.reduce((sum, item) => {
                    const product = products?.find(
                      (p) => p.id === item.productId,
                    );
                    if (!product) return sum;
                    return sum + Number(product.price) * Number(item.quantity);
                  }, 0);

                  // Only show savings breakdown if we have product data and there are actual savings
                  const hasSavings =
                    originalTotal > 0 && originalTotal > discountedTotal;
                  const savedAmount = hasSavings
                    ? originalTotal - discountedTotal
                    : 0;

                  return (
                    <div
                      key={order.id}
                      className="bg-card border border-gold/20 rounded-xl p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-heading font-semibold text-sm">
                            Order #{order.id.slice(0, 12)}...
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {date.toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={ORDER_STATUS_COLORS[order.status]}
                        >
                          {ORDER_STATUS_LABELS[order.status]}
                        </Badge>
                      </div>

                      {/* Price breakdown */}
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">
                          {order.items.length} item
                          {order.items.length !== 1 ? "s" : ""}
                        </p>
                        {hasSavings ? (
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground line-through">
                                Actual: {formatINR(originalTotal)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gold font-bold">
                                After Discount: {formatINR(discountedTotal)}
                              </span>
                            </div>
                            <div className="text-xs text-green-400 font-medium">
                              You Saved: {formatINR(savedAmount)}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gold font-bold">
                            {formatINR(discountedTotal)}
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-muted-foreground border-t border-gold/10 pt-2">
                        <strong>Ship to:</strong>{" "}
                        {order.shippingAddress.replace(/\n/g, ", ")}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
