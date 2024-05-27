import catchAsyncError from "../middleware/catchAsyncError.js";
import Product from "../models/product.js";
import Errorhandler from "../utils/errorHandler.js";
import APIFilters from "../utils/APIFilters.js";
import Order from "../models/order.js";
import { delete_file, upload_file } from "../utils/cloudinary.js";
const GetAllProducts = catchAsyncError(async (req, res) => {
  const resPerPage = 4;
  const apiFilters = new APIFilters(Product, req.query)
    .searchResult()
    .filters();

  // console.log("req.user", req?.user);

  let products = await apiFilters.query;
  let FilteredProductCount = products.length;

  apiFilters.pagination(resPerPage);
  products = await apiFilters.query.clone();
  //Bu klon, orijinal sorguyu değiştirmeksizin kullanmanızı sağlar. Özellikle sayfalama işleminden sonra orijinal sorguyu korumak ve değişiklik yapmadan kopyasını kullanmak istediğinizde faydalı olabilir.
  res.status(200).json({
    resPerPage,
    FilteredProductCount,
    products,
  });
});

const getAdminProducts = catchAsyncError(async (req, res) => {
  const product = await Product.find();

  res.status(200).json({
    product,
  });
});

const CreateProduct = catchAsyncError(async (req, res) => {
  req.body.user = req.user._id;

  const product = await Product.create(req.body);

  res.status(200).json({
    product,
  });
});

const GetProductById = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req?.params?.id).populate(
    "reviews.user"
  );
  if (!product) {
    return next(new Errorhandler("Product not found !", 404));
  }
  return res.status(200).json({
    product,
  });
});

const UpdateProductId = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req?.params?.id);

  if (!product) {
    return next(new Errorhandler("Product not found !", 404));
  }

  product = await Product.findByIdAndUpdate(req?.params?.id, req.body, {
    new: true,
  });
  return res.status(200).json({
    product,
  });
});

const DeleteProductId = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req?.params?.id);

  if (!product) {
    return next(new Errorhandler("Product not found !", 404));
  }

  await product.deleteOne();
  return res.status(200).json({
    message: "delete success",
  });
});

//upload product image
const uploadProductImages = catchAsyncError(async (req, res) => {
  let product = await Product.findById(req?.params?.id);

  if (!product) {
    return next(new Errorhandler("Product not found", 404));
  }
  const uploader = async (image) => upload_file(image, "shopit/products");

  const urls = await Promise.all(req?.body?.images.map(uploader));

  product?.images?.push(...urls);

  await product?.save();

  res.status(200).json({
    product,
  });
});

const deleteProductImage = catchAsyncError(async (req, res) => {
  let product = await Product.findById(req?.params?.id);
  if (!product) {
    return next(new Errorhandler("Product not found", 404));
  }

  const isDeleted = await delete_file(req.body.imgId);

  if (isDeleted) {
    product.images = product.images.filter(
      (img) => img.public_id !== req.body.imgId
    );
  }
  await product.save();
  res.status(200).json({
    product,
  });
});

//delete product
const deleteProduct = catchAsyncError(async (req, res) => {
  let product = await Product.findById(req?.params?.id);
  if (!product) {
    return next(new Errorhandler("Product not found", 404));
  }

  for (let i = 0; i < product.images.length; i++) {
    await delete_file(product.images[i].public_id);
  }

  await product.deleteOne();
  res.status(200).json({
    message: "Product Deleted",
  });
});

const createProductReview = catchAsyncError(async (req, res, next) => {
  // Kullanıcı tarafından gönderilen inceleme verilerini al
  const { rating, comment, productId } = req.body;

  // Yorum nesnesini oluştur
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  // Ürünü veritabanından bul
  const product = await Product.findById(productId);

  // Ürün bulunamazsa hata döndür
  if (!product) {
    return next(new Errorhandler("Product not found !", 404));
  }

  // Kullanıcının daha önce inceleme yapmış olup olmadığını kontrol et
  const isReviewed = product?.reviews?.find(
    (r) => r.user.toString() === req?.user?._id.toString()
  );

  // Eğer kullanıcı daha önce inceleme yapmışsa, mevcut incelemeyi güncelle
  if (isReviewed) {
    product.reviews.forEach((review) => {
      if (review?.user?.toString() === req?.user?._id.toString()) {
        review.comment = comment;
        review.rating = rating;
      }
    });
  } else {
    // Eğer kullanıcı daha önce inceleme yapmamışsa, yeni incelemeyi ekle
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  // Ürünün puanını güncelle
  product.ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  // Değişiklikleri kaydet
  await product.save({ validateBeforeSave: false });

  // İşlem başarılı mesajı gönder
  return res.status(200).json({
    success: true,
  });
});

const getProductReview = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id).populate("reviews.user");

  if (!product) {
    return next(new Errorhandler("Product not found !", 404));
  }
  return res.status(200).json({
    reviews: product.reviews,
  });
});

const deleteReview = catchAsyncError(async (req, res, next) => {
  // Ürünü veritabanından bul
  let product = await Product.findById(req.query.productId);

  // Ürün bulunamazsa hata döndür
  if (!product) {
    return next(new Errorhandler("Product not found !", 404));
  }

  // Kullanıcının daha önce inceleme yapmış olup olmadığını kontrol et
  const reviews = product?.reviews?.filter(
    (reviwe) => reviwe._id.toString() !== req?.query?.id.toString()
  );

  const numOfReviews = reviews.length;

  // Ürünün puanını güncelle
  const ratings =
    numOfReviews === 0
      ? 0
      : product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        numOfReviews;

  product = await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      numOfReviews,
      ratings,
    },
    { new: true }
  );

  // İşlem başarılı mesajı gönder
  return res.status(200).json({
    success: true,
    product,
  });
});

//can user review
const CanUserReview = catchAsyncError(async (req, res) => {
  const orders = await Order.find({
    user: req.user._id,
    "orderItems.product": req.query.productId,
  });

  if (orders.length === 0) {
    return res.status(200).json({
      canReviewd: false,
    });
  }

  res.status(200).json({
    canReviewd: true,
  });
});

export default {
  GetAllProducts,
  GetProductById,
  CreateProduct,
  UpdateProductId,
  DeleteProductId,
  createProductReview,
  getProductReview,
  deleteReview,
  CanUserReview,
  getAdminProducts,
  uploadProductImages,
  deleteProductImage,
  deleteProduct,
};
