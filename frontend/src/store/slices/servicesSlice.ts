
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Service } from '../../types';
import { servicesAPI } from '../../services/api';

interface ServicesState {
  services: Service[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ServicesState = {
  services: [],
  isLoading: false,
  error: null,
};

export const fetchServices = createAsyncThunk(
  'services/fetchServices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await servicesAPI.getServices();
      return response.services;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch services');
    }
  }
);

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.services = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default servicesSlice.reducer;
