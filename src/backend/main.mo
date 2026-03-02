import Text "mo:core/Text";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Order "mo:core/Order";
import List "mo:core/List";
import Nat32 "mo:core/Nat32";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  public type CustomerType = {
    #onlineSeller;
    #retailer;
  };

  public type Category = {
    #earrings;
    #jewellerySet;
    #anklet;
    #bangles;
    #chainPendant;
    #bracelet;
    #other;
    #chain;
  };

  public type Product = {
    id : Text;
    name : Text;
    description : Text;
    category : Category;
    subcategory : Text;
    price : Nat;
    images : [Storage.ExternalBlob];
    customerType : {
      #online;
      #retailer;
      #both;
    };
    inStock : Nat;
    createdAt : Int;
  };

  public type OrderStatus = {
    #pending;
    #paymentVerified;
    #processing;
    #shipped;
    #delivered;
    #cancelled;
  };

  public type CustomerProfile = {
    name : Text;
    email : Text;
    phone : Text;
    customerType : CustomerType;
  };

  type CartItem = {
    productId : Text;
    quantity : Nat;
  };

  public type Order = {
    id : Text;
    userId : Text;
    items : [CartItem];
    shippingAddress : Text;
    totalAmount : Nat;
    paymentScreenshot : Storage.ExternalBlob;
    status : OrderStatus;
    createdAt : Int;
  };

  public type BlogPost = {
    id : Text;
    title : Text;
    content : Text;
    author : Text;
    coverImage : Storage.ExternalBlob;
    createdAt : Int;
  };

  module Product {
    public func compare(p1 : Product, p2 : Product) : Order.Order {
      Text.compare(p1.id, p2.id);
    };
  };

  module BlogPost {
    public func compareByCreatedAt(a : BlogPost, b : BlogPost) : Order.Order {
      Int.compare(b.createdAt, a.createdAt);
    };
  };

  let userProfiles = Map.empty<Principal, CustomerProfile>();
  let products = Map.empty<Text, Product>();
  let carts = Map.empty<Principal, List.List<CartItem>>();
  let orders = Map.empty<Text, Order>();
  let blogPosts = Map.empty<Text, BlogPost>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?CustomerProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?CustomerProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : CustomerProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func updateCustomerType(customerType : CustomerType) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update customer type");
    };
    switch (userProfiles.get(caller)) {
      case (null) {
        Runtime.trap("Profile not found");
      };
      case (?profile) {
        let updatedProfile : CustomerProfile = {
          name = profile.name;
          email = profile.email;
          phone = profile.phone;
          customerType = customerType;
        };
        userProfiles.add(caller, updatedProfile);
      };
    };
  };

  // Product Management
  public shared ({ caller }) func createProduct(
    id : Text,
    name : Text,
    description : Text,
    category : Category,
    subcategory : Text,
    price : Nat,
    images : [Storage.ExternalBlob],
    customerType : {
      #online;
      #retailer;
      #both;
    },
    inStock : Nat,
  ) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create products");
    };
    let product : Product = {
      id;
      name;
      description;
      category;
      subcategory;
      price;
      images;
      customerType;
      inStock;
      createdAt = Time.now();
    };
    products.add(id, product);
  };

  public shared ({ caller }) func updateProduct(
    id : Text,
    name : Text,
    description : Text,
    category : Category,
    subcategory : Text,
    price : Nat,
    images : [Storage.ExternalBlob],
    customerType : {
      #online;
      #retailer;
      #both;
    },
    inStock : Nat,
  ) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    switch (products.get(id)) {
      case (null) {
        Runtime.trap("Product not found");
      };
      case (?existingProduct) {
        let updatedProduct : Product = {
          id;
          name;
          description;
          category;
          subcategory;
          price;
          images;
          customerType;
          inStock;
          createdAt = existingProduct.createdAt;
        };
        products.add(id, updatedProduct);
      };
    };
  };

  public shared ({ caller }) func deleteProduct(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    products.remove(id);
  };

  public query ({ caller }) func getAllProducts() : async [Product] {
    products.values().toArray().sort();
  };

  public query ({ caller }) func getProductById(id : Text) : async ?Product {
    products.get(id);
  };

  public query ({ caller }) func getProductsByCategory(category : Category) : async [Product] {
    products.values().toArray().filter(
      func(item : Product) : Bool {
        switch (category, item.category) {
          case (#earrings, #earrings) { true };
          case (#jewellerySet, #jewellerySet) { true };
          case (#anklet, #anklet) { true };
          case (#bangles, #bangles) { true };
          case (#chainPendant, #chainPendant) { true };
          case (#bracelet, #bracelet) { true };
          case (#other, #other) { true };
          case (#chain, #chain) { true };
          case (_) { false };
        };
      }
    );
  };

  public query ({ caller }) func getProductsByCustomerType(customerType : {
    #online;
    #retailer;
    #both;
  }) : async [Product] {
    products.values().toArray().filter(
      func(item : Product) : Bool {
        switch (customerType, item.customerType) {
          case (#online, #online) { true };
          case (#online, #both) { true };
          case (#retailer, #retailer) { true };
          case (#retailer, #both) { true };
          case (#both, _) { true };
          case (_) { false };
        };
      }
    );
  };

  // Cart Management
  public shared ({ caller }) func addToCart(productId : Text, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add to cart");
    };
    if (quantity < 6) {
      Runtime.trap("Minimum quantity is 6");
    };

    let existingCart = switch (carts.get(caller)) {
      case (null) { List.empty<CartItem>() };
      case (?cart) { cart };
    };

    let newItem : CartItem = { productId; quantity };
    existingCart.add(newItem);
    carts.add(caller, existingCart);
  };

  public shared ({ caller }) func removeFromCart(productId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove from cart");
    };
    switch (carts.get(caller)) {
      case (null) {
        Runtime.trap("Cart is empty");
      };
      case (?cart) {
        let updatedCart = cart.filter(func(item) { item.productId != productId });
        carts.add(caller, updatedCart);
      };
    };
  };

  public shared ({ caller }) func updateCartItemQuantity(productId : Text, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update cart");
    };
    if (quantity < 6) {
      Runtime.trap("Minimum quantity is 6");
    };
    switch (carts.get(caller)) {
      case (null) {
        Runtime.trap("Cart is empty");
      };
      case (?cart) {
        let updatedCart = cart.map<CartItem, CartItem>(
          func(item) {
            if (item.productId == productId) {
              { productId = item.productId; quantity };
            } else { item };
          }
        );
        carts.add(caller, updatedCart);
      };
    };
  };

  public shared ({ caller }) func clearCart() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can clear cart");
    };
    carts.remove(caller);
  };

  public query ({ caller }) func getCart() : async [CartItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view cart");
    };
    switch (carts.get(caller)) {
      case (null) { [] };
      case (?cart) { cart.toArray() };
    };
  };

  // Order Management
  public shared ({ caller }) func placeOrder(
    shippingAddress : Text,
    paymentScreenshot : Storage.ExternalBlob,
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };
    let userId = caller.toText();
    let cartItems = switch (carts.get(caller)) {
      case (null) { [] };
      case (?cart) { cart.toArray() };
    };

    if (cartItems.size() == 0) {
      Runtime.trap("Cart is empty");
    };

    let orderId = userId.concat(Int.toText(Time.now()));
    let order : Order = {
      id = orderId;
      userId;
      items = cartItems;
      shippingAddress;
      totalAmount = 0;
      paymentScreenshot;
      status = #pending;
      createdAt = Time.now();
    };
    orders.add(orderId, order);
    carts.remove(caller);

    orderId;
  };

  public query ({ caller }) func getMyOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their orders");
    };
    let userId = caller.toText();
    orders.values().toArray().filter(func(order : Order) : Bool { order.userId == userId });
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray();
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Text, status : OrderStatus) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };
    switch (orders.get(orderId)) {
      case (null) {
        Runtime.trap("Order not found");
      };
      case (?order) {
        let updatedOrder : Order = {
          id = order.id;
          userId = order.userId;
          items = order.items;
          shippingAddress = order.shippingAddress;
          totalAmount = order.totalAmount;
          paymentScreenshot = order.paymentScreenshot;
          status = status;
          createdAt = order.createdAt;
        };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  // Blog Management
  public shared ({ caller }) func createBlogPost(
    id : Text,
    title : Text,
    content : Text,
    author : Text,
    coverImage : Storage.ExternalBlob,
  ) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create blog posts");
    };
    let post : BlogPost = {
      id;
      title;
      content;
      author;
      coverImage;
      createdAt = Time.now();
    };
    blogPosts.add(id, post);
  };

  public query ({ caller }) func getAllBlogPosts() : async [BlogPost] {
    blogPosts.values().toArray().sort(BlogPost.compareByCreatedAt);
  };

  public query ({ caller }) func getBlogPostById(id : Text) : async ?BlogPost {
    blogPosts.get(id);
  };

  public shared ({ caller }) func deleteBlogPost(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete blog posts");
    };
    blogPosts.remove(id);
  };
};
