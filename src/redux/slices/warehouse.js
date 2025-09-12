import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import WarehouseService from '../../services/warehouse';

const initialState = {
  loading: false,
  warehouses: [],
  error: '',
};

export const fetchWarehouses = createAsyncThunk(
  'warehouse/fetchWarehouses',
  async (params, { rejectWithValue }) => {
    try {
      const response = await WarehouseService.get(params);
      console.log({ response });

      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

const warehouseSlice = createSlice({
  name: 'warehouse',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWarehouses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWarehouses.fulfilled, (state, action) => {
        state.loading = false;
        state.warehouses = action.payload.data;
      })
      .addCase(fetchWarehouses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      });
  },
});

export default warehouseSlice.reducer;
