import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setLoading, setUser, setisAuthenticated } from "../features/userSlice";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/v2" }),
  tagTypes: ["User", "AdminUser"],
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => "/me",
      transformResponse: (result) => result.user,
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
          dispatch(setisAuthenticated(true));
          dispatch(setLoading(false));
        } catch (error) {
          dispatch(setLoading(false));
          console.log(error);
        }
      },
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation({
      query(body) {
        return {
          url: "/me/update",
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["User"],
    }),
    uploadAvatar: builder.mutation({
      query(body) {
        return {
          url: "/me/upload_avatar",
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["User"],
    }),
    updatePassword: builder.mutation({
      query(body) {
        return {
          url: "/password/update",
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["User"],
    }),
    forgotPassword: builder.mutation({
      query(body) {
        return {
          url: "/password/forgot",
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["User"],
    }),
    resetPassword: builder.mutation({
      query({ token, body }) {
        return {
          url: `/password/reset/${token}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["User"],
    }),
    getAdminUsers: builder.query({
      query: () => `/admin/users`,
      providesTags: ["AdminUser"],
    }),
    getUserDetails: builder.query({
      query: (id) => `/admin/users/${id}`,
      providesTags: ["AdminUser"],
    }),
    updateUserDetails: builder.mutation({
      query({ id, body }) {
        return {
          url: `/admin/users/${id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["AdminUser"],
    }),
    deleteUser: builder.mutation({
      query(id) {
        return {
          url: `/admin/users/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["AdminUser"],
    }),
  }),
});

export const {
  useGetUserQuery,
  useUpdateProfileMutation,
  useUploadAvatarMutation,
  useUpdatePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetAdminUsersQuery,
  useGetUserDetailsQuery,
  useUpdateUserDetailsMutation,
  useDeleteUserMutation,
} = userApi;

//tagTypes, bu API'nin kullanacağı etiket türlerini tanımlar. Bu türler, verilerin yeniden fetch edilmesi gerektiğinde cache'in otomatik olarak güncellenmesi için kullanılır. Bu, verilerin tutarlılığını sağlamak için önemlidir.,

//providesTags, belirli bir sorgu (query) sonucunda dönen verinin hangi etiketlere sahip olduğunu belirtir. Bu, o sorgu çalıştırıldığında hangi etiketlerin güncellenmesi gerektiğini RTK Query'ye bildirir.

//invalidatesTags, belirli bir mutasyon (mutation) gerçekleştikten sonra hangi etiketlerin geçersiz hale geleceğini belirtir. Bu, bir veri değiştirildiğinde veya güncellendiğinde o veriye bağlı tüm sorguların yeniden fetch edilmesini sağlar.
