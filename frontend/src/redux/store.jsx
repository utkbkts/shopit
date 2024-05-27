import { configureStore } from "@reduxjs/toolkit";
import { productApi } from "./api/ProductApi";
import { authApi } from "./api/AuthApi";
import { userApi } from "./api/userApi";
import userReducer from "./features/userSlice.js";
import CartReducer from "./features/CartSlice.js";
import { orderApi } from "./api/OrderApi.js";
export const store = configureStore({
  reducer: {
    auth: userReducer,
    cart: CartReducer,
    [productApi.reducerPath]: productApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      productApi.middleware,
      authApi.middleware,
      userApi.middleware,
      orderApi.middleware,
    ]),
});
//middleware özelliği, Redux store'a eklenen middleware'leri tanımlar. getDefaultMiddleware fonksiyonu, Redux Toolkit tarafından sağlanan varsayılan middleware'leri döndürür. Burada, productApi.middleware middleware'i, API isteklerini yöneten Redux Toolkit middleware'i eklenir.
