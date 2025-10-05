import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { fetchMyProfile } from '../../store/slices/profileSlice';

const MyProfile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { profile, isLoading } = useSelector((state: RootState) => state.profile);

  useEffect(() => {
    dispatch(fetchMyProfile());
  }, [dispatch]);

  if (isLoading || !profile) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Profile</h1>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold">Personal Information</h2>
        <p><strong>Name:</strong> {profile.first_name} {profile.last_name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        {/* Add other citizen details here */}
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold">My Residences</h2>
        {profile.residences?.map((res: any, index: number) => (
          <div key={index}>
            <p><strong>Address:</strong> {res.house.area}</p>
            <p><strong>Zone:</strong> {res.house.zone.zone_name}</p>
          </div>
        )) || <p>No residences listed.</p>}
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold">My Vehicles</h2>
        {profile.vehicles?.map((vehicle: any, index: number) => (
          <div key={index}>
            <p><strong>Vehicle No:</strong> {vehicle.vehicle_no}</p>
            <p><strong>Type:</strong> {vehicle.type}</p>
            <p><strong>Model:</strong> {vehicle.model}</p>
          </div>
        )) || <p>No vehicles listed.</p>}
      </div>
    </div>
  );
};

export default MyProfile;