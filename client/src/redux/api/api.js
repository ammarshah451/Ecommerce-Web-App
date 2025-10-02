import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../constants/config";

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: `${server}/api/v1/` }),
  tagTypes: ["getCategories", "getProducts", "getOrders"],

  endpoints: (builder) => ({
    // LOGIN/LOGOUT API'S
    loginAdmin: builder.mutation({
      query: (data) => ({
        url: `admin/login`,
        credentials: "include",
        body: data,
      }),
    }),

    // CREATE REQUESTS
    addCategory: builder.mutation({
      query: (data) => ({
        url: `admin/addCategory`,
        method: "POST",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["getCategories"],
    }),
    addProduct: builder.mutation({
      query: (data) => ({
        url: `products/addProduct`,
        method: "POST",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["getProducts"],
    }),
    placeOrder: builder.mutation({
      query: (data) => ({
        url: `user/placeOrder`,
        method: "POST",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["getOrders"],
    }),
    applyCoupon: builder.mutation({
      query: (data) => ({
        url: `user/applyCoupon`,
        method: "POST",
        credentials: "include",
        body: data,
      }),
    }),
    giveFeedback: builder.mutation({
      query: (data) => ({
        url: `user/giveFeedback`,
        method: "POST",
        credentials: "include",
        body: data,
      }),
    }),

    // HTTP: UPDATE METHOD REQUESTS
    updateOrderStatus: builder.mutation({
      query: (data) => ({
        url: `user/updateOrderStatus`,
        method: "POST",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["getOrders"],
    }),
    updateProduct: builder.mutation({
      query: (data) => ({
        url: `products/updateProduct`,
        method: "POST",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["getProducts"],
    }),

    // HTTP: POST METHOD REQUESTS
    getCategories: builder.query({
      query: ({ populate = false }) => {
        let url = `products/getCategories`;
        if (populate) url += `?populate=${populate}`;
        return {
          url,
          credentials: "include",
        };
      },
      providesTags: ["getCategories"],
    }),
    getUsers: builder.query({
      query: () => ({
        url: `admin/getUsers`,
        credentials: "include",
      }),
    }),
    getOrders: builder.query({
      query: () => ({
        url: `admin/getOrders`,
        credentials: "include",
      }),
      providesTags: ["getOrders"],
    }),
    getProducts: builder.query({
      query: ({ categories }) => {
        let newUrl = `products/getProducts`;
        if (categories) newUrl += `?categories=${categories}`;
        return {
          url: newUrl,
          credentials: "include",
        };
      },
      providesTags: ["getProducts"],
    }),
    getAProduct: builder.query({
      query: ({ id = "" }) => {
        return {
          url: `products/getAProduct/${id}`,
          credentials: "include",
        };
      },
    }),
    getPaginatedProducts: builder.query({
      query: ({
        page,
        priceLowerBound = 0,
        priceUpperBound = 100,
        category = "",
      }) => ({
        url: `products/getPaginatedProducts?category=${category}&page=${page}&priceLowerBound=${priceLowerBound}&priceUpperBound=${priceUpperBound}`,
        credentials: "include",
      }),
    }),
    getOrderDetails: builder.query({
      query: ({ orderId = "", userId = "" }) => ({
        url: `admin/getOrderDetails?&orderId=${orderId}&userId=${userId}`,
        credentials: "include",
      }),
    }),
    getBestSoldProducts: builder.query({
      query: () => ({
        url: `products/getBestSoldProducts`,
        credentials: "include",
      }),
    }),
    getDashboardStats: builder.query({
      query: () => ({
        url: `admin/getDashboardStats`,
        credentials: "include",
      }),
    }),
    getFeedbacks: builder.query({
      query: ({ userId, productId }) => ({
        url: `user/getFeedbacks?userId=${userId}&productId=${productId}`,
        credentials: "include",
      }),
    }),
    getBestReviewedProducts: builder.query({
      query: (data) => ({
        url: `products/getBestReviewedProducts`,
        credentials: "include",
      }),
    }),

    //Search API'S
    searchCategoriesApi: builder.mutation({
      query: (data) => ({
        url: `products/searchCategories`,
        method: "POST",
        credentials: "include",
        body: data,
      }),
    }),
    searchCustomersApi: builder.mutation({
      query: (data) => ({
        url: `admin/searchUsers`,
        method: "POST",
        credentials: "include",
        body: data,
      }),
    }),
    searchOrdersApi: builder.mutation({
      query: (data) => ({
        url: `admin/searchOrders`,
        method: "POST",
        credentials: "include",
        body: data,
      }),
    }),
    searchProductsApi: builder.mutation({
      query: (data) => ({
        url: `products/searchProducts`,
        method: "POST",
        credentials: "include",
        body: data,
      }),
    }),
  }),
});
export default api;
export const {
  useLoginAdminMutation,
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useGetUsersQuery,
  useSearchCategoriesApiMutation,
  useSearchCustomersApiMutation,
  useGetOrdersQuery,
  useSearchOrdersApiMutation,
  useGetProductsQuery,
  useGetAProductQuery,
  useSearchProductsApiMutation,
  useAddProductMutation,
  useGetPaginatedProductsQuery,
  usePlaceOrderMutation,
  useUpdateOrderStatusMutation,
  useGetOrderDetailsQuery,
  useGetBestSoldProductsQuery,
  useGetDashboardStatsQuery,
  useApplyCouponMutation,
  useUpdateProductMutation,
  useGetFeedbacksQuery,
  useGiveFeedbackMutation,
  useGetBestReviewedProductsQuery,
} = api;
