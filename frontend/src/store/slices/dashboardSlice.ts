
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { DashboardStats, ProviderStats, CitizenStats, GrievanceHotspot } from '../../types';
import { dashboardAPI } from '../../services/api';

interface DashboardState {
  stats: DashboardStats | null;
  providerStats: ProviderStats | null;
  citizenStats: CitizenStats | null;
  hotspots: GrievanceHotspot[];
  isLoading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  stats: null,
  providerStats: null,
  citizenStats: null,
  hotspots: [],
  isLoading: false,
  error: null,
};

export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      return await dashboardAPI.getDashboardStats();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch dashboard stats');
    }
  }
);

export const fetchProviderStats = createAsyncThunk(
  'dashboard/fetchProviderStats',
  async (_, { rejectWithValue }) => {
    try {
      return await dashboardAPI.getProviderStats();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch provider stats');
    }
  }
);

export const fetchCitizenStats = createAsyncThunk(
  'dashboard/fetchCitizenStats',
  async (_, { rejectWithValue }) => {
    try {
      return await dashboardAPI.getCitizenStats();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch citizen stats');
    }
  }
);

export const fetchGrievanceHotspots = createAsyncThunk(
  'dashboard/fetchGrievanceHotspots',
  async (_, { rejectWithValue }) => {
    try {
      return await dashboardAPI.getGrievanceHotspots();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch grievance hotspots');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProviderStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProviderStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.providerStats = action.payload;
      })
      .addCase(fetchProviderStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCitizenStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCitizenStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.citizenStats = action.payload;
      })
      .addCase(fetchCitizenStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchGrievanceHotspots.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchGrievanceHotspots.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hotspots = action.payload.hotspots;
      })
      .addCase(fetchGrievanceHotspots.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default dashboardSlice.reducer;
