const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  variants: [
    {
      color: {
        type: String,
        required: true,
        trim: true
      },
      storage: {
        type: String,
        required: true,
        trim: true
      },
      image: {
        type: String,
        required: true,
        trim: true
      },
      mrp: {
        type: Number,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      emiplans: [
        {
          monthlyPayment: {
            type: Number,
            required: true
          },
          tenure: {
            type: Number,
            required: true
          },
          interestRate: {
            type: Number,
            required: true
          },
          cashback: {
            type: Number,
            default: 0
          }
        }
      ]
    }
  ],
}, {
  timestamps: true
})

const Product = mongoose.model("Product", productSchema);

module.exports = Product;