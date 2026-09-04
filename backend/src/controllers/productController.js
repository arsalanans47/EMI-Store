const product = require("../models/product")

const getAllProducts = async (req, res) => {
  try {
    const products = await product.find()
    res.status(200).json({
      success: true,
      data: products,
      count: products.length
    })
  }
  catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message
    })
  }
}

const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params
    const productData = await product.findOne({ slug: slug })

    if(!productData){
      res.status(404).json({
        success: false,
        message: "Product not found"
      })
    }

    res.status(200).json({
      success: true,
      data: productData

    })
  }
  catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message
    })
  }
}

module.exports = {
  getAllProducts,
  getProductBySlug
}