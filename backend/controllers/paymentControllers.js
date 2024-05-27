import catchAsyncError from "../middleware/catchAsyncError.js";
import Stripe from "stripe";
import dotenv from "dotenv";
import Order from "../models/order.js";
dotenv.config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

//create stripe checkout session => /api/v2/payment/checkout_session
const stripeCheckOutSession = catchAsyncError(async (req, res, next) => {
  const body = req?.body;
  // Sipariş öğelerini Stripe checkout.session.create işlemi için hazırla
  const line_items = body?.orderItems?.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item?.name,
          images: [item?.image],
          metadata: { productId: item?.product },
        },
        unit_amount: item?.price * 100,
      },
      tax_rates: ["txr_1PJv1tIWYTMpBJnhqRr7Pot6"],
      //vergi 15%
      quantity: item?.quantity,
    };
  });
  // Kargo bilgilerini al
  const shippingInfo = body?.shippingInfo;
  // Kargo ücretini belirle (200$ üzeri ücretsiz)

  const shipping_rate =
    body?.itemsPrice >= 200
      ? "shr_1PJuvdIWYTMpBJnhPPGipy9w"
      : "shr_1PJuvPIWYTMpBJnhTXr7n24A";
  //shipping 0 ve 25 dolar

  // Stripe checkout.session.create ile ödeme sayfasını oluştur

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${process.env.FRONTEND_URL}/me/orders`,
    cancel_url: `${process.env.FRONTEND_URL}`,
    customer_email: req?.user?.email,
    client_reference_id: req?.user?._id?.toString(),
    mode: "payment",
    metadata: { ...shippingInfo, itemPrice: body?.itemsPrice },
    shipping_options: [
      {
        shipping_rate,
      },
    ],
    line_items,
  });
  res.status(200).json({
    url: session.url,
  });
});

export const getOrderItem = (line_items) => {
  return new Promise((resolve, reject) => {
    let cartItems = [];

    line_items?.data?.forEach(async (item) => {
      const product = await stripe.products.retrieve(item.price.product);
      //Bu satır, Stripe API üzerinden bir ürünün detaylarını almak için kullanılır. stripe.products.retrieve yöntemi, belirtilen ürün ID'sine sahip bir ürünün detaylarını getirir.
      const productId = product.metadata.productId;

      cartItems.push({
        product: productId,
        name: product.name,
        price: item.price.unit_amount_decimal / 100,
        //Sonuç olarak, bu satır, Stripe'tan alınan ürünün birim fiyatını küsüratlı bir formattan daha anlaşılır bir dolar cinsinden fiyata dönüştürmek için kullanılır.
        quantity: item.quantity,
        image: product.images[0],
      });
      if (cartItems.length === line_items?.data?.length) {
        resolve(cartItems);
      }
    });
  });
};

const stripeWebHook = catchAsyncError(async (req, res, next) => {
  try {
    const signature = req.headers["stripe-signature"];
    const event = stripe.webhooks.constructEvent(
      req.rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const line_items = await stripe.checkout.sessions.listLineItems(
        session.id
      );

      const orderItems = await getOrderItem(line_items);

      const user = session.client_reference_id;

      const totalAmount = session.amount_total / 100;
      const taxAmount = session.total_details.amount_tax / 100;
      const shippingAmount = session.total_details.amount_shipping / 100;
      const itemsPrice = session.metadata.itemPrice;

      const shippingInfo = {
        address: session.metadata.address,
        city: session.metadata.city,
        phoneNo: session.metadata.phoneNo,
        postalCode: session.metadata.postalCode,
        country: session.metadata.country,
      };

      const paymentInfo = {
        id: session.payment_intent,
        status: session.payment_status,
      };

      const orderData = {
        shippingInfo,
        orderItems,
        itemsPrice,
        taxAmount,
        totalAmount,
        shippingAmount,
        paymentInfo,
        paymentMethod: "Card",
        user,
      };
      await Order.create(orderData);

      res.status(200).json({ success: true });
    }
  } catch (error) {
    console.log(error);
  }
});

export default {
  stripeCheckOutSession,
  stripeWebHook,
};
