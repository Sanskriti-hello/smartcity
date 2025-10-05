export interface User {
    citizen_id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: 'admin' | 'citizen' | 'provider';
    password?: string;
}

export interface Grievance {
    grievance_id: number;
    citizen_id: number;
    service_id?: number;
    assigned_provider_id?: number;
    title: string;
    description: string;
    location_text?: string;
    location_coords?: any;
    status: 'Submitted' | 'In Progress' | 'Resolved' | 'Closed';
    created_at: string;
    updated_at: string;
    photos?: { photo_id: number; image_url: string }[];
    service_name?: string;
    zone_name?: string;
    citizen_first_name?: string;
    citizen_last_name?: string;
    citizen_email?: string;
    assigned_company?: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    comments?: any[];
    resolved_at?: string;
}

export interface Announcement {
    announcement_id: number;
    title: string;
    content: string;
    created_at: string;
    target_audience?: string;
    is_active?: boolean;
    created_by_first_name?: string;
    created_by_last_name?: string;
    expires_at?: string;
}

export interface Service {
    service_id: string;
    service_name: string;
}

export interface Zone {
    zone_id: string;
    zone_name: string;
}

export interface DashboardStats {
    totalGrievances: number;
    pendingGrievances: number;
    resolvedToday: number;
    averageResolutionTime: number;
    grievancesByService: { service_name: string; count: number }[];
    grievancesByStatus: { status: string; count: number }[];
    recentGrievances: Grievance[];
}

export interface ProviderStats {
    totalAssigned: number;
    newAssigned: number;
    inProgress: number;
    resolved: number;
    resolvedToday: number;
    assignedGrievances: Grievance[];
}

export interface CitizenStats {
    totalSubmitted: number;
    pending: number;
    inProgress: number;
    resolved: number;
    closed: number;
    recentGrievances: Grievance[];
}

export interface GrievanceHotspot {
    grievance_id: number;
    title: string;
    status: string;
    location_text: string;
    location_coords: any;
    created_at: string;
    service_name: string;
    zone_name: string;
    priority?: string;
    location_address?: string;
}