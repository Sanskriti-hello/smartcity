import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { fetchGrievanceById } from '../../store/slices/grievancesSlice';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';

const GrievanceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentGrievance, isLoading } = useSelector((state: RootState) => state.grievances);

  useEffect(() => {
    if (id) {
      dispatch(fetchGrievanceById(id));
    }
  }, [dispatch, id]);

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
    </div>
  );
};

export default GrievanceDetails;