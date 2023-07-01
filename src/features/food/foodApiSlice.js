import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { apiSlice } from '../../app/api/apiSlice';

const foodAdapter = createEntityAdapter({
  sortComparer: (a, b) =>
    a.completed === b.completed ? 0 : a.completed ? 1 : -1,
});

const initialState = foodAdapter.getInitialState();

export const foodApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFood: builder.query({
      query: () => '/food',
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },

      transformResponse: (responseData) => {
        const loadedFood = responseData.map((food) => {
          food.id = food._id;
          return food;
        });
        return foodAdapter.setAll(initialState, loadedFood);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'Food', id: 'LIST' },
            ...result.ids.map((id) => ({ type: 'Food', id })),
          ];
        } else return [{ type: 'Food', id: 'LIST' }];
      },
    }),
    addNewFood: builder.mutation({
      query: (initialNote) => ({
        url: '/food',
        method: 'POST',
        body: {
          ...initialNote,
        },
      }),
      invalidatesTags: [{ type: 'Food', id: 'LIST' }],
    }),
    updateFood: builder.mutation({
      query: (initialNote) => ({
        url: '/food',
        method: 'PATCH',
        body: {
          ...initialNote,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Food', id: arg.id }],
    }),
    deleteFood: builder.mutation({
      query: ({ id }) => ({
        url: `/food`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Food', id: arg.id }],
    }),
  }),
});

export const {
  useGetFoodQuery,
  useAddNewFoodMutation,
  useUpdateFoodMutation,
  useDeleteFoodMutation,
} = foodApiSlice;

// returns the query result object
export const selectFoodResult = foodApiSlice.endpoints.getFood.select();

// creates memoized selector
const selectFoodData = createSelector(
  selectFoodResult,
  (foodResult) => foodResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllFood,
  selectById: selectFoodById,
  selectIds: selectFoodIds,
  // Pass in a selector that returns the notes slice of state
} = foodAdapter.getSelectors((state) => selectFoodData(state) ?? initialState);
