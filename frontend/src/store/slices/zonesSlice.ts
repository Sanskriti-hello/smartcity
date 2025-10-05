
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Zone } from '../../types';
import { zonesAPI } from '../../services/api';

interface ZonesState {
  zones: Zone[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ZonesState = {
  zones: [],
  isLoading: false,
  error: null,
};

export const fetchZones = createAsyncThunk(
  'zones/fetchZones',
  async (_, { rejectWithValue }) => {
    try {
      const response = await zonesAPI.getZones();
      return response.zones;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch zones');
    }
  }
);

const zonesSlice = createSlice({
  name: 'zones',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchZones.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchZones.fulfilled, (state, action) => {
        state.isLoading = false;
        state.zones = action.payload;
      })
      .addCase(fetchZones.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default zonesSlice.reducer;
