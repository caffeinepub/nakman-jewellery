import Map "mo:core/Map";
import List "mo:core/List";
import Storage "blob-storage/Storage";
import Principal "mo:core/Principal";

module {
  type CustomerType = {
    #onlineSeller;
    #retailer;
  };

  type Category = {
    #earrings;
    #jewellerySet;
    #anklet;
    #bangles;
    #chainPendant;
    #bracelet;
    #other;
    #chain;
  };

  type Product = {
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

  type OrderStatus = {
    #pending;
    #paymentVerified;
    #processing;
    #shipped;
    #delivered;
    #cancelled;
  };

  type CustomerProfile = {
    name : Text;
    email : Text;
    phone : Text;
    customerType : CustomerType;
  };

  type CartItem = {
    productId : Text;
    quantity : Nat;
  };

  type Order = {
    id : Text;
    userId : Text;
    items : [CartItem];
    shippingAddress : Text;
    totalAmount : Nat;
    paymentScreenshot : Storage.ExternalBlob;
    status : OrderStatus;
    createdAt : Int;
  };

  type BlogPost = {
    id : Text;
    title : Text;
    content : Text;
    author : Text;
    coverImage : Storage.ExternalBlob;
    createdAt : Int;
  };

  type OldActor = {
    products : Map.Map<Text, Product>;
    orders : Map.Map<Text, Order>;
    carts : Map.Map<Principal, List.List<CartItem>>;
    blogPosts : Map.Map<Text, BlogPost>;
    userProfiles : Map.Map<Principal, CustomerProfile>;
  };

  type NewActor = {
    products : Map.Map<Text, Product>;
    orders : Map.Map<Text, Order>;
    carts : Map.Map<Principal, List.List<CartItem>>;
    blogPosts : Map.Map<Text, BlogPost>;
    userProfiles : Map.Map<Principal, CustomerProfile>;
  };

  public func run(old : OldActor) : NewActor {
    old;
  };
};
