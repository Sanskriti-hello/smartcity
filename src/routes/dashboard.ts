import express from 'express';
import supabase from '../config/database';
import { authenticateToken } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = express.Router();

// Helper to count statuses
const countStatuses = (items: { status: string }[]): { [key: string]: number } => {
    return items.reduce((acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
    }, {} as { [key: string]: number });
};

// GET /api/dashboard/citizen-stats
router.get('/citizen-stats', authenticateToken, async (req: AuthRequest, res) => {
    try {
        if (!req.user?.sub) {
            return res.status(401).json({ error: 'Invalid token: User ID is missing.' });
        }

        const citizenId = parseInt(req.user.sub, 10);
        if (isNaN(citizenId)) {
            return res.status(400).json({ error: 'Invalid User ID format.' });
        }

        const { data, error } = await supabase
            .from('grievance')
            .select('grievance_id, title, status, created_at')
            .eq('citizen_id', citizenId);

        if (error) throw error;

        const statusCounts = countStatuses(data || []);

        res.json({
            totalSubmitted: data?.length || 0,
            pending: statusCounts['Submitted'] || 0,
            inProgress: statusCounts['In Progress'] || 0,
            resolved: statusCounts['Resolved'] || 0,
            closed: statusCounts['Closed'] || 0,
            recentGrievances: data?.slice(0, 5) || [],
        });

    } catch (error: any) {
        console.error('Get citizen stats error:', error);
        res.status(500).json({ error: 'Failed to retrieve citizen dashboard data.', details: error.message });
    }
});

// Other dashboard routes can be added here later

export default router;