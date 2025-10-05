
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '../../types'; // Assuming a detailed User/Profile type exists
import { profileAPI } from '../../services/api';

interface ProfileState {
  profile: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
  isLoading: false,
  error: null,
};

export const fetchMyProfile = createAsyncThunk(
  'profile/fetchMyProfile',
  async (_, { rejectWithValue }) => {
    try {
      return await profileAPI.getMe();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch profile');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMyProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchMyProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default profileSlice.reducer;
