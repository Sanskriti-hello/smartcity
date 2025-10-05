import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { fetchCitizenStats } from '../../store/slices/dashboardSlice';
import { fetchAnnouncements } from '../../store/slices/announcementsSlice';
import { Bell, FileText, Plus } from 'lucide-react';

const CitizenDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { citizenStats, isLoading } = useSelector((state: RootState) => state.dashboard);
  const { announcements } = useSelector((state: RootState) => state.announcements);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchCitizenStats());
    dispatch(fetchAnnouncements());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.first_name}!</h1>
        <p className="text-gray-600 mt-1">Here's a summary of your activity.</p>
      </div>

      {isLoading ? (
        <p>Loading stats...</p>
      ) : citizenStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium">Grievances Submitted</h3>
            <p className="text-3xl font-bold">{citizenStats.totalSubmitted}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium">In Progress</h3>
            <p className="text-3xl font-bold">{citizenStats.inProgress}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium">Resolved</h3>
            <p className="text-3xl font-bold">{citizenStats.resolved}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-4">
                <Link to="/submit-grievance" className="flex items-center p-4 rounded-lg hover:bg-gray-100">
                    <Plus className="mr-4" />
                    <span>Submit a new Grievance</span>
                </Link>
                <Link to="/my-grievances" className="flex items-center p-4 rounded-lg hover:bg-gray-100">
                    <FileText className="mr-4" />
                    <span>View My Grievances</span>
                </Link>
            </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Announcements</h2>
            {announcements && announcements.length > 0 ? (
              announcements.map(ann => (
                <div key={ann.announcement_id} className="border-b last:border-b-0 py-2">
                  <h3 className="font-semibold">{ann.title}</h3>
                  <p className="text-sm text-gray-600">{ann.content}</p>
                </div>
              ))
            ) : (
              <div className="flex items-center text-gray-500">
                  <Bell className="mr-4" />
                  <span>No new announcements.</span>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;