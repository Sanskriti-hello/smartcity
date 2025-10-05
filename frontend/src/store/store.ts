import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import grievancesReducer from './slices/grievancesSlice'
import announcementsReducer from './slices/announcementsSlice';
import dashboardReducer from './slices/dashboardSlice';
import servicesReducer from './slices/servicesSlice';
import zonesReducer from './slices/zonesSlice';
import profileReducer from './slices/profileSlice';
import dashboardReducer from './slices/dashboardSlice'
import servicesReducer from './slices/servicesSlice'
import zonesReducer from './slices/zonesSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    grievances: grievancesReducer,
    announcements: announcementsReducer,
    dashboard: dashboardReducer,
    services: servicesReducer,
    zones: zonesReducer,
    profile: profileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
