import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { fetchGrievances, updateGrievance } from '../../store/slices/grievancesSlice';
import { format } from 'date-fns';
import { Eye, Edit } from 'lucide-react';
import toast from 'react-hot-toast';

const AssignedGrievances: React.FC = () => {
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Assigned Grievances</h1>
        <p className="text-gray-600">Manage and update the status of grievances assigned to you.</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        {isLoading ? (
          <p>Loading...</p>
        ) : grievances.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {grievances.map((grievance) => (
              <div key={grievance.grievance_id} className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3>{grievance.title}</h3>
                    <p>{grievance.status}</p>
                    <p>Submitted: {format(new Date(grievance.created_at), 'MMM dd, yyyy')}</p>
                  </div>
                  <div className="ml-4 flex-shrink-0 space-x-2">
                    <Link to={`/provider/grievance/${grievance.grievance_id}`}><Eye /></Link>
                    <button onClick={() => openUpdateModal(grievance)}><Edit /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No assigned grievances found.</p>
        )}
      </div>

      {showUpdateModal && selectedGrievance && (
        <div>
          <h2>Update Grievance Status</h2>
          <select value={updateData.status} onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
          <button onClick={handleUpdateGrievance}>Update</button>
          <button onClick={() => setShowUpdateModal(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default AssignedGrievances;