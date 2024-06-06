// // apiSlice.ts
// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import axios from 'axios';
// import { AppThunk } from './store';

// interface ApiState<T> {
//   data: T | null; // Здесь можно указать тип данных, получаемых от API
//   loading: boolean;
//   error: string | null;
// }

// const initialState: ApiSt = {
//   data: null,
//   loading: false,
//   error: null,
// };

// const apiSlice = createSlice({
//   name: 'api',
//   initialState,
//   reducers: {
//     fetchDataStart(state) {
//       state.loading = true;
//       state.error = null;
//     },
//     fetchDataSuccess(state, action: PayloadAction<unknown>) {
//       state.loading = false;
//       state.data = action.payload;
//     },
//     fetchDataFailure(state, action: PayloadAction<string>) {
//       state.loading = false;
//       state.error = action.payload;
//     },
//   },
// });

// export const { fetchDataStart, fetchDataSuccess, fetchDataFailure } = apiSlice.actions;

// export const fetchData = (url: string): AppThunk => async (dispatch) => {
//   try {
//     dispatch(fetchDataStart());
//     const response = await axios.get(url);
//     dispatch(fetchDataSuccess(response.data));
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       dispatch(fetchDataFailure(error.message));
//     } else {
//       console.error('Unexpected error:', error);
//     }
//   }
// };

// export default apiSlice.reducer;
