import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { createGrievance } from '../../store/slices/grievancesSlice';
import { fetchServices } from '../../store/slices/servicesSlice';
import { fetchZones } from '../../store/slices/zonesSlice';
import { Grievance } from '../../types';
import toast from 'react-hot-toast';

const SubmitGrievance: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state: RootState) => state.grievances);
  const { services } = useSelector((state: RootState) => state.services);
  const { zones } = useSelector((state: RootState) => state.zones);

  const { register, handleSubmit } = useForm<Grievance>();

  useEffect(() => {
    dispatch(fetchServices());
    dispatch(fetchZones());
  }, [dispatch]);

  const onSubmit = async (data: Grievance) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
        formData.append(key, (data as any)[key]);
    });

    try {
      await dispatch(createGrievance(formData)).unwrap();
      toast.success('Grievance submitted successfully!');
      navigate('/my-grievances');
    } catch (error: any) {
      toast.error(error || 'Failed to submit grievance');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <input {...register('title', { required: true })} placeholder="Title" />
      <textarea {...register('description', { required: true })} placeholder="Description" />
      <select {...register('service_id')}>
        <option value="">Select Service</option>
        {services?.map(service => <option key={service.service_id} value={service.service_id}>{service.service_name}</option>)}
      </select>
      <select {...register('zone_id')}>
        <option value="">Select Zone</option>
        {zones?.map(zone => <option key={zone.zone_id} value={zone.zone_id}>{zone.zone_name}</option>)}
      </select>
      <button type="submit" disabled={isLoading}>Submit</button>
    </form>
  );
};

export default SubmitGrievance;