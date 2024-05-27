import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/v2" }),
  tagTypes: ["Product", "AdminProduct", "Review"],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params) => ({
        url: "/products",
        params: {
          page: params?.page,
          search: params?.search,
          category: params?.category,
          "price[gte]": params.min,
          "price[lte]": params.max,
          "ratings[gte]": params?.ratings,
        },
      }),
    }),
    getProductDetails: builder.query({
      query: (id) => `/product/${id}`,
      providesTags: ["Product"],
    }),
    submitReview: builder.mutation({
      query(body) {
        return {
          url: "/reviews",
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["Product"],
    }),
    canUserReview: builder.query({
      query: (productId) => `/can_review?productId=${productId}`,
      providesTags: ["Product"],
    }),
    getAdminProducts: builder.query({
      query: () => "/admin/products",
      providesTags: ["AdminProduct"],
    }),
    createProduct: builder.mutation({
      query(body) {
        return {
          url: "/admin/products",
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["AdminProduct"],
    }),
    updateProduct: builder.mutation({
      query({ id, body }) {
        return {
          url: `/admin/product/${id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["AdminProduct"],
    }),
    uploadImagesProduct: builder.mutation({
      query({ id, body }) {
        return {
          url: `/admin/products/${id}/upload_images`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["AdminProduct", "Product"],
    }),
    deleteProductImage: builder.mutation({
      query({ id, body }) {
        return {
          url: `/admin/products/${id}/delete_images`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["AdminProduct", "Product"],
    }),
    deleteProduct: builder.mutation({
      query(id) {
        return {
          url: `/admin/products/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["AdminProduct", "Product"],
    }),
    getProductReviews: builder.query({
      query: (productId) => `/reviews?id=${productId}`,
      providesTags: ["Review"],
    }),
    deleteReviews: builder.mutation({
      query({ productId, id }) {
        return {
          url: `/admin/reviews?productId=${productId}&id=${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Review"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useSubmitReviewMutation,
  useCanUserReviewQuery,
  useGetAdminProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadImagesProductMutation,
  useDeleteProductImageMutation,
  useDeleteProductMutation,
  useLazyGetProductReviewsQuery,
  useDeleteReviewsMutation,
} = productApi;
// productApi içinden useGetProductsQuery hook'u, getProducts endpointine bir istek yapmak için kullanılır ve otomatik olarak Redux store'u günceller ve isteğin durumunu (loading, error, success) takip eder.
