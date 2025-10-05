export interface User {
    citizen_id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: 'admin' | 'citizen' | 'provider';
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
}

export interface Announcement {
    announcement_id: number;
    title: string;
    content: string;
    created_at: string;
}

import { Request } from 'express';

export interface JWTPayload {
    sub: string;
    role: string;
    email: string;
}

export interface AuthRequest extends Request {
    user?: JWTPayload;
}