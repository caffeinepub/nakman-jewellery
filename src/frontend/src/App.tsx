import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { Layout } from "./components/Layout";
import { Account } from "./pages/Account";
import { Admin } from "./pages/Admin";
import { Blog, BlogDetail } from "./pages/Blog";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import { Home } from "./pages/Home";
import { ProductDetail } from "./pages/ProductDetail";
import { Shop } from "./pages/Shop";
import { About, Privacy, Returns, Shipping } from "./pages/StaticPages";

// ─── Root Route ───────────────────────────────────────────────────────────────

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster
        theme="dark"
        toastOptions={{
          style: {
            background: "oklch(0.19 0.038 250)",
            border: "1px solid oklch(0.76 0.18 68 / 0.30)",
            color: "oklch(0.96 0.008 250)",
          },
        }}
      />
    </>
  ),
});

// ─── Layout Route ─────────────────────────────────────────────────────────────

const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "layout",
  component: Layout,
});

// ─── Pages ────────────────────────────────────────────────────────────────────

const indexRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/",
  component: Home,
});

const shopRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/shop",
  component: Shop,
});

const productRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/product/$id",
  component: ProductDetail,
});

const cartRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/cart",
  component: Cart,
});

const checkoutRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/checkout",
  component: Checkout,
});

const accountRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/account",
  component: Account,
});

const adminRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/admin",
  component: Admin,
});

const blogRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/blog",
  component: Blog,
});

const blogDetailRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/blog/$id",
  component: BlogDetail,
});

const aboutRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/about",
  component: About,
});

const returnsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/returns",
  component: Returns,
});

const privacyRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/privacy",
  component: Privacy,
});

const shippingRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/shipping",
  component: Shipping,
});

// ─── Route Tree ───────────────────────────────────────────────────────────────

const routeTree = rootRoute.addChildren([
  layoutRoute.addChildren([
    indexRoute,
    shopRoute,
    productRoute,
    cartRoute,
    checkoutRoute,
    accountRoute,
    adminRoute,
    blogRoute,
    blogDetailRoute,
    aboutRoute,
    returnsRoute,
    privacyRoute,
    shippingRoute,
  ]),
]);

// ─── Router ───────────────────────────────────────────────────────────────────

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  return <RouterProvider router={router} />;
}
