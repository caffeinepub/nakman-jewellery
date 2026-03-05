import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface BlogPost {
    id: string;
    title: string;
    content: string;
    createdAt: bigint;
    author: string;
    coverImage: ExternalBlob;
}
export interface CustomerProfile {
    customerType: CustomerType;
    name: string;
    email: string;
    phone: string;
}
export interface CartItem {
    productId: string;
    quantity: bigint;
}
export interface Order {
    id: string;
    status: OrderStatus;
    paymentScreenshot: ExternalBlob;
    userId: string;
    createdAt: bigint;
    totalAmount: bigint;
    shippingAddress: string;
    items: Array<CartItem>;
}
export interface Product {
    id: string;
    customerType: Variant_both_retailer_online;
    inStock: bigint;
    subcategory: string;
    name: string;
    createdAt: bigint;
    description: string;
    category: Category;
    price: bigint;
    images: Array<ExternalBlob>;
}
export enum Category {
    other = "other",
    chain = "chain",
    bangles = "bangles",
    anklet = "anklet",
    bracelet = "bracelet",
    jewellerySet = "jewellerySet",
    chainPendant = "chainPendant",
    earrings = "earrings"
}
export enum CustomerType {
    onlineSeller = "onlineSeller",
    retailer = "retailer"
}
export enum OrderStatus {
    shipped = "shipped",
    cancelled = "cancelled",
    pending = "pending",
    delivered = "delivered",
    processing = "processing",
    paymentVerified = "paymentVerified"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_both_retailer_online {
    both = "both",
    retailer = "retailer",
    online = "online"
}
export interface backendInterface {
    addToCart(productId: string, quantity: bigint): Promise<void>;
    adminUpdateUserInfo(user: Principal, updatedInfo: {
        name?: string;
        email?: string;
        phone?: string;
    }): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearCart(): Promise<void>;
    createBlogPost(id: string, title: string, content: string, author: string, coverImage: ExternalBlob): Promise<void>;
    createProduct(id: string, name: string, description: string, category: Category, subcategory: string, price: bigint, images: Array<ExternalBlob>, customerType: Variant_both_retailer_online, inStock: bigint): Promise<void>;
    deleteBlogPost(id: string): Promise<void>;
    deleteProduct(id: string): Promise<void>;
    deleteUserProfile(): Promise<void>;
    getAllBlogPosts(): Promise<Array<BlogPost>>;
    getAllOrders(): Promise<Array<Order>>;
    getAllProducts(): Promise<Array<Product>>;
    getBlogPostById(id: string): Promise<BlogPost | null>;
    getCallerUserProfile(): Promise<CustomerProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(): Promise<Array<CartItem>>;
    getMyOrders(): Promise<Array<Order>>;
    getProductById(id: string): Promise<Product | null>;
    getProductsByCategory(category: Category): Promise<Array<Product>>;
    getProductsByCustomerType(customerType: Variant_both_retailer_online): Promise<Array<Product>>;
    getUserProfile(user: Principal): Promise<CustomerProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    placeOrder(shippingAddress: string, paymentScreenshot: ExternalBlob): Promise<string>;
    removeFromCart(productId: string): Promise<void>;
    saveCallerUserProfile(profile: CustomerProfile): Promise<void>;
    updateCartItemQuantity(productId: string, quantity: bigint): Promise<void>;
    updateCustomerType(customerType: CustomerType): Promise<void>;
    updateOrderStatus(orderId: string, status: OrderStatus): Promise<void>;
    updateProduct(id: string, name: string, description: string, category: Category, subcategory: string, price: bigint, images: Array<ExternalBlob>, customerType: Variant_both_retailer_online, inStock: bigint): Promise<void>;
}
