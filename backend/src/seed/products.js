const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Product = require("../models/product");

dotenv.config();

const products = [
  {
    name: "iPhone 17 Pro",
    slug: "iphone-17-pro",
    brand: "Apple",

    variants: [
      {
        color: "Silver",
        storage: "256GB",
        image:
          "https://media-ik.croma.com/Croma%20Assets/Communication/Mobiles/Images/317432_0_8iVhHIsBIF.png?updatedAt=1757529382415",
        mrp: 134900,
        price: 129900,

        emiplans: [
          {
            monthlyPayment: 43300,
            tenure: 3,
            interestRate: 0,
            cashback: 2000,
          },
          {
            monthlyPayment: 21650,
            tenure: 6,
            interestRate: 0,
            cashback: 2500,
          },
          {
            monthlyPayment: 11450.5,
            tenure: 12,
            interestRate: 10.5,
            cashback: 3000,
          },
        ],
      },

      {
        color: "Deep Blue",
        storage: "512GB",
        image:
          "https://media-ik.croma.com/Croma%20Assets/Communication/Mobiles/Images/317435_0_bVGnyy8wB.png?updatedAt=1757529491671&tr=w-600",
        mrp: 154900,
        price: 149900,

        emiplans: [
          {
            monthlyPayment: 49966.67,
            tenure: 3,
            interestRate: 0,
            cashback: 2500,
          },
          {
            monthlyPayment: 24983.33,
            tenure: 6,
            interestRate: 0,
            cashback: 3000,
          },
          {
            monthlyPayment: 13213.48,
            tenure: 12,
            interestRate: 10.5,
            cashback: 3500,
          },
        ],
      },
    ],
  },

  {
    name: "Samsung Galaxy S24 Ultra",
    slug: "samsung-galaxy-s24-ultra",
    brand: "Samsung",

    variants: [
      {
        color: "Titanium Black",
        storage: "256GB",
        image:
          "https://img-new.cgtrader.com/items/5050762/312757c7cd/samsung-galaxy-s24-ultra-titanium-black-3d-model-312757c7cd.webp",
        mrp: 129999,
        price: 119999,

        emiplans: [
          {
            monthlyPayment: 39999.67,
            tenure: 3,
            interestRate: 0,
            cashback: 1500,
          },
          {
            monthlyPayment: 19999.83,
            tenure: 6,
            interestRate: 0,
            cashback: 2000,
          },
          {
            monthlyPayment: 10577.74,
            tenure: 12,
            interestRate: 10.5,
            cashback: 2500,
          },
        ],
      },

      {
        color: "Titanium Violet",
        storage: "512GB",
        image:
          "https://media-ik.croma.com/Croma%20Assets/Communication/Mobiles/Images/303817_cc5lmd.png?tr=w-640",
        mrp: 139999,
        price: 129999,

        emiplans: [
          {
            monthlyPayment: 43333,
            tenure: 3,
            interestRate: 0,
            cashback: 2000,
          },
          {
            monthlyPayment: 21666.5,
            tenure: 6,
            interestRate: 0,
            cashback: 2500,
          },
          {
            monthlyPayment: 11459.23,
            tenure: 12,
            interestRate: 10.5,
            cashback: 3000,
          },
        ],
      },
    ],
  },

  {
    name: "OnePlus 13",
    slug: "oneplus-13",
    brand: "OnePlus",

    variants: [
      {
        color: "Midnight Black",
        storage: "256GB",
        image:
          "https://image01-in.oneplus.net/media/202412/17/0c0b713df5d1f8f99b52956a17182bfc.png",
        mrp: 69999,
        price: 64999,

        emiplans: [
          {
            monthlyPayment: 21666.33,
            tenure: 3,
            interestRate: 0,
            cashback: 1000,
          },
          {
            monthlyPayment: 10833.17,
            tenure: 6,
            interestRate: 0,
            cashback: 1500,
          },
          {
            monthlyPayment: 5729.57,
            tenure: 12,
            interestRate: 10.5,
            cashback: 2000,
          },
        ],
      },

      {
        color: "Arctic Dawn",
        storage: "512GB",
        image:
          "https://media-ik.croma.com/Croma%20Assets/Communication/Mobiles/Images/312536_0_ymiz2z.png?tr=w-600",
        mrp: 79999,
        price: 74999,

        emiplans: [
          {
            monthlyPayment: 24999.67,
            tenure: 3,
            interestRate: 0,
            cashback: 1200,
          },
          {
            monthlyPayment: 12499.83,
            tenure: 6,
            interestRate: 0,
            cashback: 1800,
          },
          {
            monthlyPayment: 6611.06,
            tenure: 12,
            interestRate: 10.5,
            cashback: 2200,
          },
        ],
      },
    ],
  },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    console.log("MongoDB connected");

    await Product.deleteMany();

    console.log("Existing products removed");

    await Product.insertMany(products);

    console.log("Products seeded successfully");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding products:", error.message);

    process.exit(1);
  }
};

seedProducts();