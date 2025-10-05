
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { fetchGrievances } from '../../store/slices/grievancesSlice';
import { format } from 'date-fns';
import { Eye } from 'lucide-react';

const MyGrievances: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { grievances, isLoading } = useSelector((state: RootState) => state.grievances);

  useEffect(() => {
    dispatch(fetchGrievances());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Grievances</h1>
        <p className="text-gray-600">Track the status of all your submitted grievances.</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        {isLoading ? (
          <p className="p-6">Loading grievances...</p>
        ) : grievances && grievances.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {grievances.map((grievance) => (
              <div key={grievance.grievance_id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      {grievance.title}
                    </h3>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {grievance.status}
                      </span>
                      <p className="text-sm text-gray-500">
                        Submitted: {format(new Date(grievance.created_at), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  <Link to={`/grievance/${grievance.grievance_id}`} className="btn btn-outline btn-sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="p-6 text-center text-gray-500">You have not submitted any grievances yet.</p>
        )}
      </div>
    </div>
  );
};

export default MyGrievances;
