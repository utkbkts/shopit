export const getPriceQueryParams = (searchParams, key, value) => {
  const hasValueParam = searchParams.has(key);

  if (value && hasValueParam) {
    searchParams.set(key, value);
  } else if (value) {
    searchParams.append(key, value);
  } else if (hasValueParam) {
    searchParams.delete(key, value);
  }

  return searchParams;
};

export const calculateOrderCost = (cartItems) => {
  const itemPrice = cartItems?.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shippingPrice = itemPrice > 200 ? 0 : 25;
  const taxPrice = Number((0.15 * itemPrice).toFixed(2));
  const totalPrice = (itemPrice + shippingPrice + taxPrice).toFixed(2);

  return {
    shippingPrice,
    taxPrice,
    totalPrice,
    itemPrice: Number(itemPrice).toFixed(2),
  };
};
