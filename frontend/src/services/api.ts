import axios, { AxiosResponse } from 'axios';
import { User, Grievance, Announcement, Service, Zone, AdminStats, ProviderStats, CitizenStats, GrievanceHotspot } from '../types';

const api = axios.create({
   baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
   headers: {
      'Content-Type': 'application/json',
   },
});

api.interceptors.request.use(
   (config) => {
      const token = localStorage.getItem('token');
      if (token) {
         config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
   },
   (error) => {
      return Promise.reject(error);
   }
);

api.interceptors.response.use(
   (response) => response,
   (error) => {
      if (error.response?.status === 401) {
         localStorage.removeItem('token');
         if (typeof window !== 'undefined') {
            window.location.href = '/login';
         }
      }
      return Promise.reject(error);
   }
);

export const authAPI = {
   login: (credentials: Partial<User>): Promise<{ token: string; user: User }> =>
      api.post('/auth/login', credentials).then((res: AxiosResponse) => res.data),
   
   register: (userData: Partial<User>): Promise<{ user: User }> =>
      api.post('/auth/register', userData).then((res: AxiosResponse) => res.data),
   
   getProfile: (): Promise<{ user: User }> =>
      api.get('/auth/profile').then((res: AxiosResponse) => res.data),
   
   verifyToken: (): Promise<{ user: User }> =>
      api.get('/auth/verify').then((res: AxiosResponse) => res.data),
};

export const grievancesAPI = {
   getGrievances: (params?: any): Promise<{grievances: Grievance[], pagination: any}> =>
      api.get('/grievances', { params }).then((res: AxiosResponse) => res.data),
   
   getGrievanceById: (id: string): Promise<Grievance> =>
      api.get(`/grievances/${id}`).then((res: AxiosResponse) => res.data),
   
   createGrievance: (data: FormData): Promise<Grievance> =>
      api.post('/grievances', data, {
            headers: {
                  'Content-Type': 'multipart/form-data',
            },
      }).then((res: AxiosResponse) => res.data),
   
   updateGrievance: (id: string, data: Partial<Grievance>): Promise<Grievance> =>
      api.put(`/grievances/${id}`, data).then((res: AxiosResponse) => res.data),
};

export const dashboardAPI = {
   getDashboardStats: (): Promise<AdminStats> =>
      api.get('/dashboard/stats').then((res: AxiosResponse) => res.data),

   getProviderStats: (): Promise<ProviderStats> =>
      api.get('/dashboard/provider-stats').then((res: AxiosResponse) => res.data),

   getCitizenStats: (): Promise<CitizenStats> =>
      api.get('/dashboard/citizen-stats').then((res: AxiosResponse) => res.data),

   getGrievanceHotspots: (status?: string): Promise<{ hotspots: GrievanceHotspot[] }> =>
      api.get('/dashboard/grievance-hotspots', { params: { status } }).then((res: AxiosResponse) => res.data),
};

export const announcementsAPI = {
  getAnnouncements: (): Promise<Announcement[]> =>
    api.get('/announcements').then((res: AxiosResponse) => res.data),
  
  createAnnouncement: (data: Partial<Announcement>): Promise<Announcement> =>
    api.post('/announcements', data).then((res: AxiosResponse) => res.data),

  updateAnnouncement: (id: string, data: Partial<Announcement>): Promise<Announcement> =>
    api.put(`/announcements/${id}`, data).then((res: AxiosResponse) => res.data),

  deleteAnnouncement: (id: string): Promise<void> =>
    api.delete(`/announcements/${id}`).then((res: AxiosResponse) => res.data),
};

export const servicesAPI = {
  getServices: (): Promise<{services: Service[]}> =>
    api.get('/services').then((res: AxiosResponse) => res.data),
};

export const zonesAPI = {
  getZones: (): Promise<{zones: Zone[]}> =>
    api.get('/zones').then((res: AxiosResponse) => res.data),
};

export const profileAPI = {
  getMe: (): Promise<User> =>
    api.get('/citizens/me/profile').then((res: AxiosResponse) => res.data),
};

export default api;