import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { fetchProviderStats } from '../../store/slices/dashboardSlice';

const ProviderDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { providerStats, isLoading } = useSelector((state: RootState) => state.dashboard);

  useEffect(() => {
    dispatch(fetchProviderStats());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Service Provider Dashboard</h1>
      {isLoading ? (
        <p>Loading stats...</p>
      ) : providerStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3>Total Assigned</h3>
            <p>{providerStats.totalAssigned}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3>New Assigned</h3>
            <p>{providerStats.newAssigned}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3>In Progress</h3>
            <p>{providerStats.inProgress}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3>Resolved</h3>
            <p>{providerStats.resolved}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderDashboard;