import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { fetchGrievanceById, updateGrievance } from '../../store/slices/grievancesSlice';
import { format } from 'date-fns';
import { ArrowLeft, Edit } from 'lucide-react';
import toast from 'react-hot-toast';

const ProviderGrievanceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentGrievance, isLoading } = useSelector((state: RootState) => state.grievances);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateData, setUpdateData] = useState({ status: '', priority: '' });

  useEffect(() => {
    if (id) {
      dispatch(fetchGrievanceById(id));
    }
  }, [dispatch, id]);

  const handleUpdateGrievance = async () => {
    if (!id) return;

    try {
      await dispatch(updateGrievance({ id, data: updateData })).unwrap();
      toast.success('Grievance updated successfully!');
      setShowUpdateModal(false);
      dispatch(fetchGrievanceById(id));
    } catch (error: any) {
      toast.error(error || 'Failed to update grievance');
    }
  };

  if (isLoading || !currentGrievance) {
    return <p>Loading...</p>;
  }

  return (
    <div className="space-y-6">
      <button onClick={() => navigate(-1)}><ArrowLeft /> Back</button>
      <h1>{currentGrievance.title}</h1>
      <p>{currentGrievance.description}</p>
      <p>Status: {currentGrievance.status}</p>
      <p>Submitted: {format(new Date(currentGrievance.created_at), 'MMM dd, yyyy')}</p>
      <button onClick={() => setShowUpdateModal(true)}><Edit /> Update Status</button>

      {showUpdateModal && (
        <div>
          <h2>Update Grievance</h2>
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

export default ProviderGrievanceDetails;