import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { logout } from '../store/slices/authSlice';
import { Home, FileText, Plus, LogOut, Menu, X, BarChart3, ClipboardList } from 'lucide-react';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const getNavigationItems = () => {
    if (user?.role === 'admin') {
      return [
        { name: 'Dashboard', href: '/admin/dashboard', icon: BarChart3 },
        { name: 'Grievances', href: '/admin/grievances', icon: ClipboardList },
      ];
    } else if (user?.role === 'provider') {
      return [
        { name: 'Dashboard', href: '/provider/dashboard', icon: BarChart3 },
        { name: 'Assigned Grievances', href: '/provider/grievances', icon: ClipboardList },
      ];
    } else {
      return [
        { name: 'Dashboard', href: '/citizen/dashboard', icon: Home },
        { name: 'Submit Grievance', href: '/submit-grievance', icon: Plus },
        { name: 'My Grievances', href: '/my-grievances', icon: FileText },
        { name: 'My Profile', href: '/my-profile', icon: Home }, // Using Home icon as placeholder
      ];
    }
  };

  const navigationItems = getNavigationItems();

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar for mobile */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex w-full max-w-xs flex-col bg-white">
            {/* Sidebar content */}
        </div>
      </div>

      {/* Sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <h1 className="text-xl font-bold text-gray-900">Smart City</h1>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigationItems.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${isActive(item.href) ? 'bg-gray-50 text-indigo-600' : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'}`}>
                        <item.icon className="h-6 w-6 shrink-0" />
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="mt-auto">
                <a
                  href="#"
                  onClick={handleLogout}
                  className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:text-indigo-600 hover:bg-gray-50">
                  <LogOut className="h-6 w-6 shrink-0" />
                  Sign out
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="lg:pl-72">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>
        </div>

        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;