import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { fetchGrievances, updateGrievance } from '../../store/slices/grievancesSlice';
import { format } from 'date-fns';
import { Edit } from 'lucide-react';
import toast from 'react-hot-toast';

const GrievanceManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { grievances, isLoading } = useSelector((state: RootState) => state.grievances);
  const [selectedGrievance, setSelectedGrievance] = useState<any>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateData, setUpdateData] = useState({ status: '', priority: '' });

  useEffect(() => {
    dispatch(fetchGrievances());
  }, [dispatch]);

  const handleUpdateGrievance = async () => {
    if (!selectedGrievance) return;

    try {
      await dispatch(updateGrievance({ 
        id: selectedGrievance.grievance_id, 
        data: updateData 
      })).unwrap();
      toast.success('Grievance updated successfully!');
      setShowUpdateModal(false);
      setSelectedGrievance(null);
      dispatch(fetchGrievances());
    } catch (error: any) {
      toast.error(error || 'Failed to update grievance');
    }
  };

  const openUpdateModal = (grievance: any) => {
    setSelectedGrievance(grievance);
    setUpdateData({
      status: grievance.status,
      priority: grievance.priority
    });
    setShowUpdateModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Grievance Management</h1>
        <p className="text-gray-600">Manage and track all city grievances.</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th>Grievance</th>
                <th>Citizen</th>
                <th>Service</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {grievances.map((grievance) => (
                <tr key={grievance.grievance_id}>
                  <td>{grievance.title}</td>
                  <td>{grievance.citizen_first_name} {grievance.citizen_last_name}</td>
                  <td>{grievance.service_name || 'N/A'}</td>
                  <td>{grievance.status}</td>
                  <td>{grievance.priority}</td>
                  <td>{format(new Date(grievance.created_at), 'MMM dd, yyyy')}</td>
                  <td>
                    <button onClick={() => openUpdateModal(grievance)}><Edit /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showUpdateModal && selectedGrievance && (
        <div>
          <h2>Update Grievance</h2>
          <select value={updateData.status} onChange={(e) => setUpdateData({ ...updateData, status: e.target.value }) }>
            <option value="Submitted">Submitted</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
          <select value={updateData.priority} onChange={(e) => setUpdateData({ ...updateData, priority: e.target.value }) }>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
          <button onClick={handleUpdateGrievance}>Update</button>
          <button onClick={() => setShowUpdateModal(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default GrievanceManagement;