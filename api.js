// api.js

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://185.129.51.171/api/',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('Authorization', `Token ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ['PostList','PostListMap', 'CategoriesList','Favourites'],
  endpoints: (builder) => ({
    getPostList: builder.query({
      query: ({ page, limit }) => {
        console.log(`Querying with page: ${page}, limit: ${limit}`);
        return `posts/?page=${page}&page_size=${limit}`;
      },
      providesTags: ['PostList'],
    }),
    getPostListCity: builder.query({
      query: ({ page, limit, city }) => {
        return `posts_city/?page=${page}&page_size=${limit}&city=${encodeURIComponent(city)}`;
      },
      providesTags: ['PostList'],
    }),    
    getPostListMap: builder.query({
      query: () => 'posts_map/',
      providesTags: ['PostListMap'],
    }),
    getPostById: builder.query({
      query: (id) => `posts/${id}/`,
    }),
    getCategoriesList: builder.query({
      query: () => `categories/`,
      providesTags: ['CategoriesList'],
    }),
    searchPosts: builder.query({
      query: (searchQuery) => `search_posts/?q=${searchQuery}`,
      providesTags: ['PostList'],
    }),
    getActivePosts: builder.query({
      query: () => 'active_posts/',
      providesTags: ['PostList'],
    }),
    getAdminPosts: builder.query({
      query: () => 'admin_posts/',
      providesTags: ['PostList'],
    }),
    getNotActivePosts: builder.query({
      query: () => 'not_active_posts/',
      providesTags: ['PostList'],
    }),
    getDeletedPosts: builder.query({
      query: () => 'deleted_posts/',
      providesTags: ['PostList'],
    }),
    getNotPaidPosts: builder.query({
      query: () => 'paid_posts/',
      providesTags: ['PostList'],
    }),
    getPostsByCategory: builder.query({
      query: ({category_id,page,limit}) => `posts/category/${category_id}?page=${page}&page_size=${limit}`,
      providesTags: (result, error, categoryId) => [
        { type: 'PostList', id: categoryId },
      ],
    }),

    listFavourites: builder.query({
      query: () => 'favourites/',
      providesTags: ['Favourites'],
    }),
    
    // POST Queries

    deactivatePost: builder.mutation({
      query: (postId) => ({
        url: `posts/${postId}/deactivate/`,
        method: 'PATCH',
      }),
    }),

    activatePost: builder.mutation({
      query: (postId) => ({
        url: `posts/${postId}/activate/`,
        method: 'PATCH',
      }),
    }),
    
    approvePost: builder.mutation({
      query: (postId) => ({
        url: `posts/${postId}/approve/`,
        method: 'PATCH',
      }),
    }),
    
    deletePost: builder.mutation({
      query: (postId) => ({
        url: `posts/${postId}/delete/`,
        method: 'PATCH',
      }),
    }),

    payPost: builder.mutation({
      query: (postId) => ({
        url: `posts/${postId}/pay/`,
        method: 'PATCH',
      }),
    }),
    updateUserProfile: builder.mutation({
      query: (userData) => ({
        url: 'update-profile/',
        method: 'PATCH',  
        body: userData,  
      }),
    }),
    addToFavourites: builder.mutation({
      query: (postId) => ({
        url: `favourites/add/${postId}/`,
        method: 'POST',
      }),
      invalidatesTags: ['Favourites'],
    }),

    removeFromFavourites: builder.mutation({
      query: (postId) => ({
        url: `favourites/remove/${postId}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Favourites'],
    }),
  }),
});

export const {
  useGetPostListQuery,
  useGetPostListCityQuery,
  useGetPostListMapQuery,
  useGetPostByIdQuery,
  useGetCategoriesListQuery,
  useSearchPostsQuery,
  useGetActivePostsQuery,
  useGetAdminPostsQuery,
  useGetNotActivePostsQuery,
  useGetDeletedPostsQuery,
  useGetNotPaidPostsQuery,
  useGetPostsByCategoryQuery,
  useListFavouritesQuery,

  // POST

  useAddToFavouritesMutation,
  useRemoveFromFavouritesMutation,

  useDeactivatePostMutation,
  useActivatePostMutation,
  useApprovePostMutation,
  useDeletePostMutation,
  usePayPostMutation,
  useUpdateUserProfileMutation,
} = api;
