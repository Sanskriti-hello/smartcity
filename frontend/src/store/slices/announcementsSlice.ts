import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { Announcement } from '../../types'
import { announcementsAPI } from '../../services/api'

interface AnnouncementsState {
  announcements: Announcement[]
  isLoading: boolean
  error: string | null
}

const initialState: AnnouncementsState = {
  announcements: [],
  isLoading: false,
  error: null,
}

// Async thunks
export const fetchAnnouncements = createAsyncThunk(
  'announcements/fetchAnnouncements',
  async (params: any = {}, { rejectWithValue }) => {
    try {
      const response = await announcementsAPI.getAnnouncements(params)
      return response.announcements
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch announcements')
    }
  }
)

export const createAnnouncement = createAsyncThunk(
  'announcements/createAnnouncement',
  async (announcementData: CreateAnnouncementRequest, { rejectWithValue }) => {
    try {
      const response = await announcementsAPI.createAnnouncement(announcementData)
      return response.announcement
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create announcement')
    }
  }
)

export const updateAnnouncement = createAsyncThunk(
  'announcements/updateAnnouncement',
  async ({ id, data }: { id: string; data: Partial<CreateAnnouncementRequest> }, { rejectWithValue }) => {
    try {
      const response = await announcementsAPI.updateAnnouncement(id, data)
      return response.announcement
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update announcement')
    }
  }
)

export const deleteAnnouncement = createAsyncThunk(
  'announcements/deleteAnnouncement',
  async (id: string, { rejectWithValue }) => {
    try {
      await announcementsAPI.deleteAnnouncement(id)
      return id
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete announcement')
    }
  }
)

const announcementsSlice = createSlice({
  name: 'announcements',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Announcements
      .addCase(fetchAnnouncements.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchAnnouncements.fulfilled, (state, action) => {
        state.isLoading = false
        state.announcements = action.payload
      })
      .addCase(fetchAnnouncements.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Create Announcement
      .addCase(createAnnouncement.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createAnnouncement.fulfilled, (state, action) => {
        state.isLoading = false
        state.announcements.unshift(action.payload)
      })
      .addCase(createAnnouncement.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Update Announcement
      .addCase(updateAnnouncement.fulfilled, (state, action) => {
        const index = state.announcements.findIndex(a => a.announcement_id === action.payload.announcement_id)
        if (index !== -1) {
          state.announcements[index] = action.payload
        }
      })
      // Delete Announcement
      .addCase(deleteAnnouncement.fulfilled, (state, action) => {
        state.announcements = state.announcements.filter(a => a.announcement_id !== action.payload)
      })
  },
})

export const { clearError } = announcementsSlice.actions
export default announcementsSlice.reducer
