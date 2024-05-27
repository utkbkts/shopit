import catchAsyncError from "../middleware/catchAsyncError.js";
import Order from "../models/order.js";
import Product from "../models/product.js";
import ErrorHandler from "../utils/errorHandler.js";

const newOrder = catchAsyncError(async (req, res, next) => {
  const {
    orderItems,
    shippingInfo,
    itemsPrice,
    taxAmount,
    shippingAmount,
    totalAmount,
    paymentMethod,
    paymentInfo,
  } = req.body;

  const order = await Order.create({
    orderItems,
    shippingInfo,
    itemsPrice,
    taxAmount,
    shippingAmount,
    totalAmount,
    paymentMethod,
    paymentInfo,
    user: req.user._id,
  });

  res.status(200).json({
    order,
  });
});

const getOrderDetails = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate("user");

  if (!order) {
    return next(new ErrorHandler("No Order found with this ID", 404));
  }
  res.status(200).json({
    order,
  });
});

const getMyOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  if (!orders) {
    return next(new ErrorHandler("No Order found with this ID", 404));
  }
  res.status(200).json({
    orders,
  });
});

const AllOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find();
  res.status(200).json({
    orders,
  });
});

const UpdateOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("No Order found with this ID", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("You have already delivered this order", 400));
  }

  let productNotFound = false;

  for (const item of order.orderItems) {
    const product = await Product.findById(item.product.toString());

    if (!product) {
      productNotFound = true;
      break;
    }

    product.stock = product.stock - item.quantity;
    await product.save({ validateBeforeSave: false });
  }

  if (productNotFound) {
    return next(new ErrorHandler("No Product found with this ID", 400));
  }

  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save();

  res.status(200).json({
    success: true,
  });
});
const DeleteOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("No Order found with this ID", 404));
  }
  await order.deleteOne();
  res.status(200).json({
    success: true,
  });
});

async function getSalesData(startDate, endDate) {
  const salesData = await Order.aggregate([
    {
      //stage 1 - filter search
      $match: {
        //$match aşaması, belirli kriterlere uyan belgeleri filtrelemek için kullanılır. Bu aşama, SQL'deki WHERE ifadesine benzer.
        createdAt: {
          $gte: new Date(startDate),
          //Belirtilen tarihe eşit veya daha büyük olan belgeleri seçer.
          $lte: new Date(endDate),
          //Belirtilen tarihe eşit veya daha küçük olan belgeleri seçer.
        },
      },
    },
    {
      //stage 2 - group data
      $group: {
        _id: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        },
        totalSales: { $sum: "$totalAmount" },
        //fiyatı hesaplar
        numOrders: { $sum: 1 },
        //sipariş sayısını hespalar
      },
    },
  ]);
  const salesMap = new Map();
  //salesMap, yeni bir Map nesnesi olarak tanımlanır. Bu, her bir tarihi ve o tarihle ilişkili satış bilgilerini depolamak için kullanılır.
  let totalSales = 0;
  let totalNumOrders = 0;

  salesData.forEach((entry) => {
    const date = entry?._id.date;
    const sales = entry?.totalSales;
    const numOrders = entry?.numOrders;

    salesMap.set(date, { sales, numOrders });
    //salesMap haritasına, date anahtarı ile { sales, numOrders } nesnesi eklenir.
    totalSales += sales;
    totalNumOrders += numOrders;
    //totalSales değişkenine sales değeri eklenir. Bu, toplam satışları günceller.
    //totalNumOrders değişkenine numOrders değeri eklenir. Bu, toplam sipariş sayısını günceller.
  });

  //başlangıç ​​ve bitiş tarihi arasında bir tarih dizisi oluşturun
  const datesBetween = getDatesBetween(startDate, endDate);

  //create final sales data array

  const finalSalesData = datesBetween.map((date) => ({
    date,
    sales: (salesMap.get(date) || { sales: 0 }).sales,
    //Sonuç olarak, eğer tarih için bir veri varsa, bu veriden sales değeri alınır; yoksa 0 değeri kullanılır.
    numOrders: salesMap.get(date) || { numOrders: 0 },
  }));

  return { salesData: finalSalesData, totalSales, totalNumOrders };
}

function getDatesBetween(startDate, endDate) {
  const dates = [];

  let currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    const formattedDate = currentDate.toISOString().split("T")[0];
    dates.push(formattedDate);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
}

//get sales data
const getSales = catchAsyncError(async (req, res, next) => {
  const startDate = new Date(req.query.startDate);
  const endDate = new Date(req.query.endDate);

  startDate.setUTCHours(0, 0, 0, 0);
  endDate.setUTCHours(23, 59, 59, 999);
  //Bu şekilde, belirtilen tarih aralığındaki tüm satışları kapsayan bir aralık elde edilir.

  const { salesData, totalSales, totalNumOrders } = await getSalesData(
    startDate,
    endDate
  );

  res.status(200).json({
    sales: salesData,
    totalSales,
    totalNumOrders,
  });
});

export default {
  newOrder,
  getOrderDetails,
  getMyOrders,
  UpdateOrder,
  AllOrders,
  DeleteOrder,
  getSales,
};
