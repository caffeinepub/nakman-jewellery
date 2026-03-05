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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  FileText,
  Info,
  Loader2,
  LogOut,
  Package,
  Pencil,
  Plus,
  Shield,
  ShieldCheck,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob, type Product } from "../backend";
import {
  Category,
  OrderStatus,
  Variant_both_retailer_online,
} from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAllBlogPosts,
  useAllOrders,
  useAllProducts,
  useCreateBlogPost,
  useCreateProduct,
  useDeleteBlogPost,
  useDeleteProduct,
  useIsAdmin,
  useUpdateOrderStatus,
  useUpdateProduct,
} from "../hooks/useQueries";
import {
  getYouTubeUrl,
  setYouTubeUrl,
  toYouTubeEmbedUrl,
} from "../hooks/useYouTubeLinks";
import { formatPrice } from "../utils/discount";
import { getSecretParameter } from "../utils/urlParams";

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

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.pending]: "Pending",
  [OrderStatus.processing]: "Processing",
  [OrderStatus.paymentVerified]: "Payment Verified",
  [OrderStatus.shipped]: "Shipped",
  [OrderStatus.delivered]: "Delivered",
  [OrderStatus.cancelled]: "Cancelled",
};

const CUSTOMER_TYPE_LABELS: Record<Variant_both_retailer_online, string> = {
  [Variant_both_retailer_online.both]: "All Customers",
  [Variant_both_retailer_online.online]: "Online Sellers Only",
  [Variant_both_retailer_online.retailer]: "Retailers Only",
};

export function Admin() {
  const { identity, login, isLoggingIn, clear } = useInternetIdentity();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsAdmin();
  const hasAdminToken = getSecretParameter("caffeineAdminToken") !== null;
  const queryClient = useQueryClient();
  const [isSettingUpAdmin, setIsSettingUpAdmin] = useState(false);

  // When admin token is present but admin check not yet confirmed,
  // show a brief "Setting up admin access..." screen while
  // _initializeAccessControlWithSecret completes, then force a re-check.
  useEffect(() => {
    if (!identity || isAdminLoading || isAdmin || !hasAdminToken) return;

    setIsSettingUpAdmin(true);
    const timer = setTimeout(async () => {
      await queryClient.invalidateQueries({ queryKey: ["actor"] });
      await queryClient.invalidateQueries({ queryKey: ["isAdmin"] });
      setIsSettingUpAdmin(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [identity, isAdminLoading, isAdmin, hasAdminToken, queryClient]);

  if (!identity) {
    return (
      <AdminLoginGate
        onLogin={login}
        isLoggingIn={isLoggingIn}
        hasAdminToken={hasAdminToken}
      />
    );
  }

  if (isAdminLoading || isSettingUpAdmin) {
    return (
      <div
        className="container mx-auto px-4 py-16 text-center space-y-4"
        data-ocid="admin.loading_state"
      >
        <Loader2 className="h-10 w-10 text-gold animate-spin mx-auto" />
        {isSettingUpAdmin && hasAdminToken && (
          <div className="space-y-1">
            <p className="text-foreground font-heading font-semibold text-lg">
              Setting up admin access...
            </p>
            <p className="text-sm text-muted-foreground">
              Admin token detected. Granting privileges, please wait.
            </p>
          </div>
        )}
      </div>
    );
  }

  if (!isAdmin) {
    return <AdminAccessHelp onLogout={clear} hasAdminToken={hasAdminToken} />;
  }

  return <AdminDashboard />;
}

function AdminLoginGate({
  onLogin,
  isLoggingIn,
  hasAdminToken,
}: {
  onLogin: () => void;
  isLoggingIn: boolean;
  hasAdminToken: boolean;
}) {
  return (
    <div className="container mx-auto px-4 py-12 max-w-lg">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="space-y-4"
      >
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="h-20 w-20 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mb-4">
            <Shield className="h-9 w-9 text-gold" />
          </div>
          <h2 className="font-display text-3xl font-bold">
            Admin <span className="gold-text-gradient">Dashboard</span>
          </h2>
          <p className="text-muted-foreground text-sm mt-2">
            NakMan Jewellery — Store Management
          </p>
        </div>

        {/* Token Status Banner */}
        <AnimatePresence mode="wait">
          {hasAdminToken ? (
            <motion.div
              key="token-found"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="bg-green-500/10 border border-green-500/40 rounded-2xl p-5"
              data-ocid="admin.success_state"
            >
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-heading font-bold text-green-300 text-base mb-1">
                    ✓ Admin Token Detected
                  </p>
                  <p className="text-sm text-green-200/80 leading-relaxed">
                    You are accessing from the{" "}
                    <strong className="text-green-200">
                      Caffeine dashboard
                    </strong>
                    . Click the button below to get full admin access.
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="token-missing"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="bg-amber-500/10 border border-amber-500/40 rounded-2xl p-5"
              data-ocid="admin.error_state"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-heading font-bold text-amber-300 text-base mb-1">
                    ⚠ Admin Token Not Found
                  </p>
                  <p className="text-sm text-amber-200/80 leading-relaxed mb-3">
                    You must open this site from your{" "}
                    <strong className="text-amber-200">
                      Caffeine dashboard
                    </strong>{" "}
                    before logging in. Opening the site directly will register
                    you as a customer, not as admin.
                  </p>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
                      Follow these steps first:
                    </p>
                    {[
                      "Go to your Caffeine dashboard (caffeine.ai)",
                      "Find your NakMan Jewellery project",
                      'Click "Open App" or the preview/launch button',
                      "That page will open with admin access — then click Login",
                    ].map((step, i) => (
                      <div key={step} className="flex items-start gap-2.5">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500/25 text-amber-300 flex items-center justify-center font-bold text-xs">
                          {i + 1}
                        </span>
                        <span className="text-xs text-amber-200/80">
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Login Button */}
        <div className="bg-card border border-gold/20 rounded-2xl p-6 text-center space-y-3">
          {hasAdminToken ? (
            <>
              <p className="text-sm text-muted-foreground">
                Click below to log in and access your admin dashboard.
              </p>
              <Button
                onClick={onLogin}
                disabled={isLoggingIn}
                size="lg"
                className="w-full gold-gradient text-background font-bold text-base gap-2"
                data-ocid="admin.primary_button"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-5 w-5" />
                    Login as Admin
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm text-amber-300/80 font-medium">
                Complete the steps above first, then login here.
              </p>
              <Button
                onClick={onLogin}
                disabled={isLoggingIn}
                size="lg"
                variant="outline"
                className="w-full border-amber-500/40 text-amber-300 hover:bg-amber-500/10 font-bold text-base gap-2"
                data-ocid="admin.secondary_button"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <LogOut className="h-5 w-5" />
                    Login (After Following Steps Above)
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground/60">
                Logging in without completing the steps above will register you
                as a customer.
              </p>
            </>
          )}
        </div>

        {/* Info box */}
        <div className="bg-muted/20 border border-border/40 rounded-2xl p-4 flex items-start gap-3">
          <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">
                How admin login works:
              </strong>{" "}
              When you open the site from the Caffeine dashboard, a secure admin
              token is added to the URL automatically. Logging in from that link
              permanently grants you admin access. Opening the site directly (by
              typing the URL) does not include this token.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function AdminAccessHelp({
  onLogout,
  hasAdminToken,
}: {
  onLogout: () => void;
  hasAdminToken: boolean;
}) {
  const queryClient = useQueryClient();
  const [isClaiming, setIsClaiming] = useState(false);

  // Auto-trigger claim when admin token is present in URL
  useEffect(() => {
    if (!hasAdminToken) return;
    const timer = setTimeout(() => {
      handleClaimAdmin();
    }, 2000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasAdminToken]);

  const handleClaimAdmin = async () => {
    setIsClaiming(true);
    await queryClient.invalidateQueries({ queryKey: ["actor"] });
    await queryClient.invalidateQueries({ queryKey: ["isAdmin"] });
    setIsClaiming(false);
  };

  const steps = hasAdminToken
    ? [
        {
          step: 1,
          title: "Open site from Caffeine dashboard",
          desc: 'Go to caffeine.ai, find your project, and click "Open App" — this adds the admin token to the URL automatically.',
          highlight: false,
        },
        {
          step: 2,
          title: 'Click "Claim Admin Access" below',
          desc: "The admin token is present in this URL. Click the button below to claim your admin privileges.",
          highlight: true,
        },
        {
          step: 3,
          title: "Wait a moment",
          desc: "Admin access will be granted automatically. The page will refresh once confirmed.",
          highlight: false,
        },
      ]
    : [
        {
          step: 1,
          title: "Logout first",
          desc: "Click the Logout button below to log out of this account.",
          highlight: true,
        },
        {
          step: 2,
          title: "Go to your Caffeine dashboard",
          desc: "Open caffeine.ai in your browser and log in to your Caffeine account.",
          highlight: false,
        },
        {
          step: 3,
          title: 'Click "Open App" on your project',
          desc: 'Find your NakMan Jewellery project and click the "Open App" or preview button.',
          highlight: false,
        },
        {
          step: 4,
          title: "Login on that page",
          desc: "The site will open with the admin token active. Click Login on that page.",
          highlight: false,
        },
        {
          step: 5,
          title: "You will have full admin access",
          desc: "Admin access is granted automatically when the token is present.",
          highlight: false,
        },
      ];

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-lg space-y-4"
        data-ocid="admin.panel"
      >
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-2">
          <div className="relative mb-4">
            <div
              className={`h-20 w-20 rounded-full flex items-center justify-center ${hasAdminToken ? "bg-amber-500/10 border border-amber-500/30" : "bg-red-500/10 border border-red-500/30"}`}
            >
              <Shield
                className={`h-9 w-9 ${hasAdminToken ? "text-amber-400/80" : "text-red-400/80"}`}
              />
            </div>
            <div
              className={`absolute -bottom-1 -right-1 h-7 w-7 rounded-full flex items-center justify-center ${hasAdminToken ? "bg-amber-500/20 border border-amber-500/40" : "bg-red-500/20 border border-red-500/40"}`}
            >
              <AlertCircle
                className={`h-4 w-4 ${hasAdminToken ? "text-amber-400" : "text-red-400"}`}
              />
            </div>
          </div>
          <h2 className="font-display text-2xl font-bold mb-2">
            Access{" "}
            <span className={hasAdminToken ? "text-amber-400" : "text-red-400"}>
              Denied
            </span>
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
            {hasAdminToken
              ? "Admin token detected. Claiming your admin access..."
              : "You are logged in, but this account does not have admin privileges."}
          </p>
        </div>

        {/* Token status banner */}
        <AnimatePresence mode="wait">
          {hasAdminToken ? (
            <motion.div
              key="token-found"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="bg-green-500/10 border border-green-500/40 rounded-2xl p-5"
              data-ocid="admin.success_state"
            >
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-heading font-bold text-green-300 text-base mb-1">
                    ✓ Admin Token Detected
                  </p>
                  <p className="text-sm text-green-200/80 leading-relaxed">
                    You opened this site from the{" "}
                    <strong className="text-green-200">
                      Caffeine dashboard
                    </strong>
                    . Click{" "}
                    <strong className="text-green-200">
                      "Claim Admin Access"
                    </strong>{" "}
                    below to get your admin privileges.
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="token-missing"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="bg-amber-500/10 border border-amber-500/40 rounded-2xl p-5"
              data-ocid="admin.error_state"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-heading font-bold text-amber-300 mb-2">
                    What happened?
                  </p>
                  <p className="text-sm text-amber-200/80 leading-relaxed">
                    You logged in{" "}
                    <strong className="text-amber-200">before</strong> the admin
                    token was loaded. Please logout and open the site from your
                    Caffeine dashboard before logging in again.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Fix steps */}
        <div className="bg-card border border-gold/20 rounded-2xl p-5">
          <p className="font-heading font-bold text-foreground mb-4 flex items-center gap-2">
            <ArrowRight className="h-4 w-4 text-gold" />
            How to fix this — follow these steps:
          </p>
          <div className="space-y-3">
            {steps.map(({ step, title, desc, highlight }) => (
              <div key={step} className="flex items-start gap-3">
                <span
                  className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm ${highlight ? "bg-gold/25 border border-gold/50 text-gold" : "bg-muted/50 border border-border/50 text-muted-foreground"}`}
                >
                  {step}
                </span>
                <div className="pt-0.5">
                  <p
                    className={`text-sm font-semibold ${highlight ? "text-gold" : "text-foreground"}`}
                  >
                    {title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Primary CTA — changes based on token presence */}
        <div className="bg-card border border-gold/20 rounded-2xl p-5 text-center space-y-3">
          {hasAdminToken ? (
            <>
              <p className="text-sm text-foreground font-medium">
                Admin token is active. Click below to claim your access.
              </p>
              <Button
                onClick={handleClaimAdmin}
                disabled={isClaiming}
                size="lg"
                className="w-full gold-gradient text-background font-bold text-base gap-2"
                data-ocid="admin.primary_button"
              >
                {isClaiming ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Claiming Admin Access...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-5 w-5" />
                    Claim Admin Access
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground">
                This will verify your admin token and grant full dashboard
                access.
              </p>
            </>
          ) : (
            <>
              <p className="text-sm text-foreground font-medium">
                Start by logging out, then follow the steps above.
              </p>
              <Button
                onClick={onLogout}
                size="lg"
                className="w-full gold-gradient text-background font-bold text-base gap-2"
                data-ocid="admin.primary_button"
              >
                <LogOut className="h-5 w-5" />
                Logout Now
              </Button>
              <p className="text-xs text-muted-foreground">
                After logging out, open the site from your Caffeine dashboard
                and login again.
              </p>
            </>
          )}
        </div>

        {/* Info box */}
        <div className="bg-muted/20 border border-border/40 rounded-2xl p-4 flex items-start gap-3">
          <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">
                How admin login works:
              </strong>{" "}
              When you open the site from the Caffeine dashboard, a secure admin
              token is added to the URL automatically. This token grants admin
              privileges to your account. Opening the site directly (by typing
              the URL) does not include this token.
            </p>
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-gold/70 hover:text-gold transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
              Go to caffeine.ai dashboard
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function AdminDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6 text-gold" />
          <h1 className="font-display text-3xl font-bold">
            Admin <span className="gold-text-gradient">Dashboard</span>
          </h1>
        </div>
        <p className="text-muted-foreground text-sm mt-1">
          Manage products, orders, users, and blog posts
        </p>
      </motion.div>

      <Tabs defaultValue="products">
        <TabsList className="mb-6 bg-card border border-gold/20 flex-wrap h-auto">
          <TabsTrigger
            value="products"
            className="data-[state=active]:text-gold gap-1"
          >
            <Package className="h-4 w-4" />
            Products
          </TabsTrigger>
          <TabsTrigger
            value="orders"
            className="data-[state=active]:text-gold gap-1"
          >
            <ShoppingCart className="h-4 w-4" />
            Orders
          </TabsTrigger>
          <TabsTrigger
            value="blog"
            className="data-[state=active]:text-gold gap-1"
          >
            <FileText className="h-4 w-4" />
            Blog
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <ProductsAdmin />
        </TabsContent>
        <TabsContent value="orders">
          <OrdersAdmin />
        </TabsContent>
        <TabsContent value="blog">
          <BlogAdmin />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProductsAdmin() {
  const { data: products, isLoading } = useAllProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: Category.earrings,
    subcategory: "",
    price: "",
    inStock: "",
    customerType: Variant_both_retailer_online.both,
    youtubeUrl: "",
  });

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      category: Category.earrings,
      subcategory: "",
      price: "",
      inStock: "",
      customerType: Variant_both_retailer_online.both,
      youtubeUrl: "",
    });
    setImageFiles([]);
    setEditingProduct(null);
    setShowForm(false);
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      category: product.category,
      subcategory: product.subcategory,
      price: product.price.toString(),
      inStock: product.inStock.toString(),
      customerType: product.customerType,
      youtubeUrl: getYouTubeUrl(product.id),
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let images: ExternalBlob[] = [];
    if (imageFiles.length > 0) {
      images = await Promise.all(
        imageFiles.map(async (file) => {
          const bytes = await file.arrayBuffer();
          return ExternalBlob.fromBytes(
            new Uint8Array(bytes),
          ).withUploadProgress((p) => setUploadProgress(Math.round(p)));
        }),
      );
    } else if (editingProduct) {
      images = editingProduct.images;
    }

    const data = {
      id: editingProduct?.id || `prod_${Date.now()}`,
      name: form.name,
      description: form.description,
      category: form.category,
      subcategory: form.subcategory,
      price: BigInt(Number.parseInt(form.price) || 0),
      images,
      customerType: form.customerType,
      inStock: BigInt(Number.parseInt(form.inStock) || 0),
    };

    try {
      if (editingProduct) {
        await updateProduct.mutateAsync(data);
        toast.success("Product updated!");
      } else {
        await createProduct.mutateAsync(data);
        toast.success("Product created!");
      }
      // Save YouTube URL to localStorage
      setYouTubeUrl(data.id, form.youtubeUrl);
      resetForm();
    } catch {
      toast.error("Failed to save product.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-semibold text-lg">
          Products ({products?.length || 0})
        </h2>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="gold-gradient text-background font-semibold gap-1"
          size="sm"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-card border border-gold/30 rounded-xl p-6 space-y-4"
        >
          <h3 className="font-heading font-semibold">
            {editingProduct ? "Edit Product" : "New Product"}
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                Product Name *
              </Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                className="mt-1 bg-background border-gold/30 focus:border-gold"
                placeholder="e.g. Gold Kundan Earrings"
                required
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                Subcategory
              </Label>
              <Input
                value={form.subcategory}
                onChange={(e) =>
                  setForm((f) => ({ ...f, subcategory: e.target.value }))
                }
                className="mt-1 bg-background border-gold/30 focus:border-gold"
                placeholder="e.g. Silver Earrings"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                Category *
              </Label>
              <Select
                value={form.category}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, category: v as Category }))
                }
              >
                <SelectTrigger className="mt-1 bg-background border-gold/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                Customer Type
              </Label>
              <Select
                value={form.customerType}
                onValueChange={(v) =>
                  setForm((f) => ({
                    ...f,
                    customerType: v as Variant_both_retailer_online,
                  }))
                }
              >
                <SelectTrigger className="mt-1 bg-background border-gold/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CUSTOMER_TYPE_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                Price per pc (₹) *
              </Label>
              <Input
                value={form.price}
                onChange={(e) =>
                  setForm((f) => ({ ...f, price: e.target.value }))
                }
                className="mt-1 bg-background border-gold/30 focus:border-gold"
                placeholder="e.g. 150"
                type="number"
                min="1"
                required
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                Stock (pcs)
              </Label>
              <Input
                value={form.inStock}
                onChange={(e) =>
                  setForm((f) => ({ ...f, inStock: e.target.value }))
                }
                className="mt-1 bg-background border-gold/30 focus:border-gold"
                placeholder="e.g. 500"
                type="number"
                min="0"
              />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                Description
              </Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                className="mt-1 bg-background border-gold/30 focus:border-gold"
                placeholder="Product description..."
                rows={3}
              />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                YouTube Video URL (optional)
              </Label>
              <Input
                value={form.youtubeUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, youtubeUrl: e.target.value }))
                }
                className="mt-1 bg-background border-gold/30 focus:border-gold"
                placeholder="https://www.youtube.com/watch?v=..."
                type="url"
              />
              {form.youtubeUrl && !toYouTubeEmbedUrl(form.youtubeUrl) && (
                <p className="text-xs text-red-400 mt-1">
                  Invalid YouTube URL. Please enter a valid YouTube link.
                </p>
              )}
              {form.youtubeUrl && toYouTubeEmbedUrl(form.youtubeUrl) && (
                <p className="text-xs text-green-400 mt-1">
                  ✓ Valid YouTube URL
                </p>
              )}
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                Product Images
              </Label>
              {/* biome-ignore lint/a11y/useKeyWithClickEvents: file upload trigger */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="mt-1 border-2 border-dashed border-gold/30 rounded-xl p-4 cursor-pointer hover:border-gold/60 transition-colors text-center"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) =>
                    setImageFiles(Array.from(e.target.files || []))
                  }
                  className="hidden"
                />
                {imageFiles.length > 0 ? (
                  <p className="text-sm text-green-400">
                    {imageFiles.length} image(s) selected
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Click to upload product images
                  </p>
                )}
              </div>
            </div>
          </div>

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">
                Uploading... {uploadProgress}%
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={createProduct.isPending || updateProduct.isPending}
              className="gold-gradient text-background font-semibold"
            >
              {createProduct.isPending || updateProduct.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  Saving...
                </>
              ) : editingProduct ? (
                "Update Product"
              ) : (
                "Create Product"
              )}
            </Button>
            <Button type="button" variant="ghost" onClick={resetForm}>
              Cancel
            </Button>
          </div>
        </motion.form>
      )}

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">
          Loading products...
        </div>
      ) : !products || products.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-gold/30 rounded-xl">
          <Package className="h-12 w-12 text-gold/30 mx-auto mb-3" />
          <p className="text-muted-foreground">No products yet</p>
          <p className="text-sm text-muted-foreground/60 mt-1">
            Add your first product using the button above
          </p>
        </div>
      ) : (
        <div className="border border-gold/20 rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-gold/20 bg-card hover:bg-card">
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} className="border-gold/20">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg overflow-hidden bg-muted shrink-0">
                        {product.images?.[0] && (
                          <img
                            src={product.images[0].getDirectURL()}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="text-sm font-medium truncate block max-w-[150px]">
                          {product.name}
                        </span>
                        {getYouTubeUrl(product.id) && (
                          <span className="text-[10px] text-red-400 flex items-center gap-0.5">
                            ▶ Video linked
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {CATEGORY_LABELS[product.category]}
                  </TableCell>
                  <TableCell className="text-gold font-bold text-sm">
                    {formatPrice(product.price)}/pc
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {Number(product.inStock)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="text-xs border-gold/30 text-muted-foreground"
                    >
                      {product.customerType ===
                      Variant_both_retailer_online.both
                        ? "Both"
                        : product.customerType ===
                            Variant_both_retailer_online.online
                          ? "Online"
                          : "Retail"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 hover:text-gold"
                        onClick={() => startEdit(product)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 hover:text-destructive"
                        onClick={() => {
                          deleteProduct.mutate(product.id, {
                            onSuccess: () => toast.success("Product deleted"),
                            onError: () => toast.error("Failed to delete"),
                          });
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function OrdersAdmin() {
  const { data: orders } = useAllOrders();
  const updateOrderStatus = useUpdateOrderStatus();

  return (
    <div className="space-y-4">
      <h2 className="font-heading font-semibold text-lg">
        All Orders ({orders?.length || 0})
      </h2>

      {!orders || orders.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-gold/30 rounded-xl">
          <ShoppingCart className="h-12 w-12 text-gold/30 mx-auto mb-3" />
          <p className="text-muted-foreground">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const date = new Date(Number(order.createdAt) / 1_000_000);
            return (
              <div
                key={order.id}
                className="bg-card border border-gold/20 rounded-xl p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-heading font-semibold text-sm">
                      #{order.id.slice(0, 16)}...
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {date.toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      User: {order.userId.slice(0, 12)}...
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-gold font-bold text-sm">
                      ₹{order.totalAmount.toString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {order.items.length} item(s)
                    </div>
                  </div>
                </div>

                <div className="mt-3 grid sm:grid-cols-2 gap-3">
                  <div className="text-xs text-muted-foreground">
                    <strong className="text-foreground">Ship to:</strong>
                    <br />
                    {order.shippingAddress.replace(/\n/g, ", ")}
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-xs text-muted-foreground shrink-0">
                      Status:
                    </Label>
                    <Select
                      value={order.status}
                      onValueChange={(v) => {
                        updateOrderStatus.mutate(
                          { orderId: order.id, status: v as OrderStatus },
                          {
                            onSuccess: () =>
                              toast.success("Order status updated"),
                            onError: () =>
                              toast.error("Failed to update status"),
                          },
                        );
                      }}
                    >
                      <SelectTrigger className="bg-background border-gold/30 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(ORDER_STATUS_LABELS).map(
                          ([key, label]) => (
                            <SelectItem
                              key={key}
                              value={key}
                              className="text-xs"
                            >
                              {label}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function BlogAdmin() {
  const { data: posts } = useAllBlogPosts();
  const createPost = useCreateBlogPost();
  const deletePost = useDeleteBlogPost();

  const [showForm, setShowForm] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: "",
    author: "",
    content: "",
  });

  const resetForm = () => {
    setForm({ title: "", author: "", content: "" });
    setCoverFile(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let coverImage: ExternalBlob;
    if (coverFile) {
      const bytes = await coverFile.arrayBuffer();
      coverImage = ExternalBlob.fromBytes(new Uint8Array(bytes));
    } else {
      coverImage = ExternalBlob.fromURL(
        "/assets/generated/nakman-hero-banner.dim_1400x600.jpg",
      );
    }

    try {
      await createPost.mutateAsync({
        id: `post_${Date.now()}`,
        title: form.title,
        content: form.content,
        author: form.author,
        coverImage,
      });
      toast.success("Blog post created!");
      resetForm();
    } catch {
      toast.error("Failed to create post.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-semibold text-lg">
          Blog Posts ({posts?.length || 0})
        </h2>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="gold-gradient text-background font-semibold gap-1"
          size="sm"
        >
          <Plus className="h-4 w-4" />
          New Post
        </Button>
      </div>

      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-card border border-gold/30 rounded-xl p-6 space-y-4"
        >
          <h3 className="font-heading font-semibold">New Blog Post</h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                Title *
              </Label>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                className="mt-1 bg-background border-gold/30 focus:border-gold"
                placeholder="Post title"
                required
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                Author *
              </Label>
              <Input
                value={form.author}
                onChange={(e) =>
                  setForm((f) => ({ ...f, author: e.target.value }))
                }
                className="mt-1 bg-background border-gold/30 focus:border-gold"
                placeholder="Author name"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                Content *
              </Label>
              <Textarea
                value={form.content}
                onChange={(e) =>
                  setForm((f) => ({ ...f, content: e.target.value }))
                }
                className="mt-1 bg-background border-gold/30 focus:border-gold"
                placeholder="Write your post..."
                rows={5}
                required
              />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                Cover Image (optional)
              </Label>
              {/* biome-ignore lint/a11y/useKeyWithClickEvents: file upload trigger */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="mt-1 border-2 border-dashed border-gold/30 rounded-xl p-4 cursor-pointer hover:border-gold/60 text-center"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <p className="text-sm text-muted-foreground">
                  {coverFile ? coverFile.name : "Click to upload cover image"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={createPost.isPending}
              className="gold-gradient text-background font-semibold"
            >
              {createPost.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  Publishing...
                </>
              ) : (
                "Publish Post"
              )}
            </Button>
            <Button type="button" variant="ghost" onClick={resetForm}>
              Cancel
            </Button>
          </div>
        </motion.form>
      )}

      {!posts || posts.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-gold/30 rounded-xl">
          <FileText className="h-12 w-12 text-gold/30 mx-auto mb-3" />
          <p className="text-muted-foreground">No blog posts yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => {
            const date = new Date(Number(post.createdAt) / 1_000_000);
            return (
              <div
                key={post.id}
                className="flex items-start justify-between gap-3 bg-card border border-gold/20 rounded-xl p-4"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-semibold text-sm truncate">
                    {post.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    by {post.author} •{" "}
                    {date.toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground/60 truncate mt-1">
                    {post.content.slice(0, 80)}...
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 hover:text-destructive shrink-0"
                  onClick={() => {
                    deletePost.mutate(post.id, {
                      onSuccess: () => toast.success("Post deleted"),
                      onError: () => toast.error("Failed to delete"),
                    });
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
