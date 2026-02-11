import mongoose from "mongoose";

/* USERS */
const userIds = {
  u1: new mongoose.Types.ObjectId(),
  u2: new mongoose.Types.ObjectId(),
  u3: new mongoose.Types.ObjectId(),
  u4: new mongoose.Types.ObjectId(),
  u5: new mongoose.Types.ObjectId(),
  u6: new mongoose.Types.ObjectId(),
  u7: new mongoose.Types.ObjectId(),
  u8: new mongoose.Types.ObjectId(),
  u9: new mongoose.Types.ObjectId(),
  u10: new mongoose.Types.ObjectId(),
};

export const users = [
  { _id: userIds.u1, username: "luis", displayName: "Luis Lopez" },
  { _id: userIds.u2, username: "maya", displayName: "Maya Chen" },
  { _id: userIds.u3, username: "alex", displayName: "Alex Rivera" },
  { _id: userIds.u4, username: "jordan", displayName: "Jordan Smith" },
  { _id: userIds.u5, username: "sam", displayName: "Sam Carter" },
  { _id: userIds.u6, username: "nina", displayName: "Nina Patel" },
  { _id: userIds.u7, username: "omar", displayName: "Omar Ali" },
  { _id: userIds.u8, username: "zoe", displayName: "Zoe Kim" },
  { _id: userIds.u9, username: "leo", displayName: "Leo Martinez" },
  { _id: userIds.u10, username: "ava", displayName: "Ava Thompson" }
];


/* Listings */
const listingIds = {
  l1: new mongoose.Types.ObjectId(),
  l2: new mongoose.Types.ObjectId(),
  l3: new mongoose.Types.ObjectId(),
  l4: new mongoose.Types.ObjectId(),
  l5: new mongoose.Types.ObjectId(),
  l6: new mongoose.Types.ObjectId(),
  l7: new mongoose.Types.ObjectId(),
  l8: new mongoose.Types.ObjectId(),
  l9: new mongoose.Types.ObjectId(),
  l10: new mongoose.Types.ObjectId(),
  l11: new mongoose.Types.ObjectId(),
  l12: new mongoose.Types.ObjectId(),
};

export const listings = [
  {
    _id: listingIds.l1,
    sellerId: userIds.u1,
    title: "Gaming Monitor 144Hz",
    description: "27 inch 144Hz gaming monitor.",
    category: "ELECTRONICS",
    condition: "GOOD",
    price: 250,
    status: "SOLD"
  },
  {
    _id: listingIds.l2,
    sellerId: userIds.u2,
    title: "Standing Desk",
    description: "Adjustable height desk.",
    category: "FURNITURE",
    condition: "LIKE_NEW",
    price: 300,
    status: "ACTIVE"
  },
  {
    _id: listingIds.l3,
    sellerId: userIds.u3,
    title: "MacBook Pro 2020",
    description: "16GB RAM, 512GB SSD.",
    category: "ELECTRONICS",
    condition: "GOOD",
    price: 900,
    status: "ACTIVE"
  },
  {
    _id: listingIds.l4,
    sellerId: userIds.u4,
    title: "Nike Sneakers",
    description: "Size 10, barely worn.",
    category: "CLOTHING",
    condition: "LIKE_NEW",
    price: 80,
    status: "ACTIVE"
  },
  {
    _id: listingIds.l5,
    sellerId: userIds.u5,
    title: "Bookshelf",
    description: "Wooden 5-tier bookshelf.",
    category: "FURNITURE",
    condition: "GOOD",
    price: 120,
    status: "ACTIVE"
  },
  {
    _id: listingIds.l6,
    sellerId: userIds.u6,
    title: "JavaScript Design Patterns Book",
    description: "Great for devs.",
    category: "BOOKS",
    condition: "GOOD",
    price: 25,
    status: "ACTIVE"
  },
  {
    _id: listingIds.l7,
    sellerId: userIds.u7,
    title: "Bluetooth Headphones",
    description: "Noise cancelling.",
    category: "ELECTRONICS",
    condition: "NEW",
    price: 150,
    status: "ACTIVE"
  },
  {
    _id: listingIds.l8,
    sellerId: userIds.u8,
    title: "Leather Jacket",
    description: "Medium size.",
    category: "CLOTHING",
    condition: "GOOD",
    price: 200,
    status: "ACTIVE"
  },
  {
    _id: listingIds.l9,
    sellerId: userIds.u9,
    title: "Office Chair",
    description: "Ergonomic chair.",
    category: "FURNITURE",
    condition: "FAIR",
    price: 90,
    status: "ACTIVE"
  },
  {
    _id: listingIds.l10,
    sellerId: userIds.u10,
    title: "Kindle Paperwhite",
    description: "Latest generation.",
    category: "ELECTRONICS",
    condition: "LIKE_NEW",
    price: 110,
    status: "ACTIVE"
  },
  {
    _id: listingIds.l11,
    sellerId: userIds.u1,
    title: "Winter Coat",
    description: "Warm and stylish.",
    category: "CLOTHING",
    condition: "GOOD",
    price: 75,
    status: "ACTIVE"
  },
  {
    _id: listingIds.l12,
    sellerId: userIds.u2,
    title: "Coffee Table",
    description: "Modern design.",
    category: "FURNITURE",
    condition: "GOOD",
    price: 140,
    status: "ACTIVE"
  }
];



/* Offers */
const offerIds = {
  o1: new mongoose.Types.ObjectId(),
  o2: new mongoose.Types.ObjectId(),
  o3: new mongoose.Types.ObjectId(),
  o4: new mongoose.Types.ObjectId(),
  o5: new mongoose.Types.ObjectId(),
  o6: new mongoose.Types.ObjectId(),
  o7: new mongoose.Types.ObjectId(),
  o8: new mongoose.Types.ObjectId(),
  o9: new mongoose.Types.ObjectId(),
  o10: new mongoose.Types.ObjectId(),
};

export const offers = [
  {
    _id: offerIds.o1,
    listingId: listingIds.l1,
    buyerId: userIds.u3,
    offerPrice: 230,
    message: "Can pick up today.",
    status: "ACCEPTED"
  },
  {
    _id: offerIds.o2,
    listingId: listingIds.l2,
    buyerId: userIds.u4,
    offerPrice: 280,
    message: "Would you take 280?",
    status: "PENDING"
  },
  {
    _id: offerIds.o3,
    listingId: listingIds.l3,
    buyerId: userIds.u5,
    offerPrice: 850,
    message: "Cash ready.",
    status: "PENDING"
  },
  {
    _id: offerIds.o4,
    listingId: listingIds.l4,
    buyerId: userIds.u6,
    offerPrice: 70,
    message: "70 today?",
    status: "DECLINED"
  },
  {
    _id: offerIds.o5,
    listingId: listingIds.l5,
    buyerId: userIds.u7,
    offerPrice: 110,
    message: "Interested!",
    status: "PENDING"
  },
  {
    _id: offerIds.o6,
    listingId: listingIds.l7,
    buyerId: userIds.u8,
    offerPrice: 140,
    message: "Firm?",
    status: "PENDING"
  },
  {
    _id: offerIds.o7,
    listingId: listingIds.l8,
    buyerId: userIds.u9,
    offerPrice: 180,
    message: "Can you do 180?",
    status: "PENDING"
  },
  {
    _id: offerIds.o8,
    listingId: listingIds.l9,
    buyerId: userIds.u10,
    offerPrice: 85,
    message: "Available?",
    status: "PENDING"
  },
  {
    _id: offerIds.o9,
    listingId: listingIds.l10,
    buyerId: userIds.u1,
    offerPrice: 100,
    message: "Will buy now.",
    status: "PENDING"
  },
  {
    _id: offerIds.o10,
    listingId: listingIds.l11,
    buyerId: userIds.u2,
    offerPrice: 70,
    message: "Last price?",
    status: "PENDING"
  }
];


export const transactions = [
  {
    listingId: listingIds.l1,
    offerId: offerIds.o1,
    sellerId: userIds.u1,
    buyerId: userIds.u3,
    salePrice: 230,
    status: "COMPLETED"
  }
];
