import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { fetchDashboardStats } from '../../store/slices/dashboardSlice';

const AdminDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { stats, isLoading } = useSelector((state: RootState) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      {isLoading ? (
        <p>Loading stats...</p>
      ) : stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3>Total Grievances</h3>
            <p>{stats.totalGrievances}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3>Pending Grievances</h3>
            <p>{stats.pendingGrievances}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3>Resolved Today</h3>
            <p>{stats.resolvedToday}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;