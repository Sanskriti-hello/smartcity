import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Grievance } from '../../types';
import { grievancesAPI } from '../../services/api';

interface GrievancesState {
   grievances: Grievance[];
   currentGrievance: Grievance | null;
   isLoading: boolean;
   error: string | null;
}

const initialState: GrievancesState = {
   grievances: [],
   currentGrievance: null,
   isLoading: false,
   error: null,
};

export const fetchGrievances = createAsyncThunk(
   'grievances/fetchGrievances',
   async (_, { rejectWithValue }) => {
      try {
         return await grievancesAPI.getGrievances();
      } catch (error: any) {
         return rejectWithValue(error.response?.data?.error || 'Failed to fetch grievances');
      }
   }
);

export const fetchGrievanceById = createAsyncThunk(
   'grievances/fetchGrievanceById',
   async (id: string, { rejectWithValue }) => {
      try {
         return await grievancesAPI.getGrievanceById(id);
      } catch (error: any) {
         return rejectWithValue(error.response?.data?.error || 'Failed to fetch grievance');
      }
   }
);

export const createGrievance = createAsyncThunk(
  'grievances/createGrievance',
  // Accepting FormData directly as per api.ts
  async (grievanceData: FormData, { rejectWithValue }) => {
    try {
      return await grievancesAPI.createGrievance(grievanceData);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create grievance');
    }
  }
);

export const updateGrievance = createAsyncThunk(
   'grievances/updateGrievance',
   async ({ id, data }: { id: string; data: Partial<Grievance> }, { rejectWithValue }) => {
      try {
         return await grievancesAPI.updateGrievance(id, data);
      } catch (error: any) {
         return rejectWithValue(error.response?.data?.error || 'Failed to update grievance');
      }
   }
);

const grievancesSlice = createSlice({
   name: 'grievances',
   initialState,
   reducers: {
      setCurrentGrievance: (state, action: PayloadAction<Grievance | null>) => {
         state.currentGrievance = action.payload;
      },
      clearError: (state) => {
         state.error = null;
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(fetchGrievances.pending, (state) => {
            state.isLoading = true;
            state.error = null;
         })
         .addCase(fetchGrievances.fulfilled, (state, action) => {
            state.isLoading = false;
            state.grievances = action.payload;
         })
         .addCase(fetchGrievances.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
         })
         .addCase(fetchGrievanceById.pending, (state) => {
            state.isLoading = true;
            state.error = null;
         })
         .addCase(fetchGrievanceById.fulfilled, (state, action) => {
            state.isLoading = false;
            state.currentGrievance = action.payload;
         })
         .addCase(fetchGrievanceById.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
         })
         .addCase(createGrievance.pending, (state) => {
            state.isLoading = true;
            state.error = null;
         })
         .addCase(createGrievance.fulfilled, (state, action) => {
            state.isLoading = false;
            state.grievances.unshift(action.payload);
         })
         .addCase(createGrievance.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
         })
      .addCase(updateGrievance.pending, (state) => {
        state.isLoading = true;
      })
         .addCase(updateGrievance.fulfilled, (state, action) => {
        state.isLoading = false;
            const index = state.grievances.findIndex((g) => g.grievance_id === action.payload.grievance_id);
            if (index !== -1) {
               state.grievances[index] = action.payload;
            }
            if (state.currentGrievance?.grievance_id === action.payload.grievance_id) {
               state.currentGrievance = action.payload;
            }
         })
      .addCase(updateGrievance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
   },
});

export const { setCurrentGrievance, clearError } = grievancesSlice.actions;
export default grievancesSlice.reducer;

