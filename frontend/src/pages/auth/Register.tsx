
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { register as registerUser } from '../../store/slices/authSlice';
import { User } from '../../types';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Mail, Lock, User as UserIcon } from 'lucide-react';

type RegisterFormData = Omit<User, 'citizen_id' | 'role'> & {
  confirmPassword?: string;
};

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>();

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const { confirmPassword, ...userData } = data;
      await dispatch(registerUser(userData)).unwrap();
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name">First Name</label>
                <input
                  id="first_name"
                  {...register('first_name', { required: 'First name is required' })}
                />
                {errors.first_name && <p>{errors.first_name.message}</p>}
              </div>
              <div>
                <label htmlFor="last_name">Last Name</label>
                <input
                  id="last_name"
                  {...register('last_name', { required: 'Last name is required' })}
                />
                {errors.last_name && <p>{errors.last_name.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
              />
              {errors.email && <p>{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' },
                })}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
              {errors.password && <p>{errors.password.message}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) => value === password || 'Passwords do not match',
                })}
              />
              {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <div>
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>

          <div className="text-center">
            <p>
              Already have an account?{' '}
              <Link to="/login">Sign in</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
