import Navigation from '@/components/Admin/Navigation';
import { Outlet } from 'react-router-dom';

function AdminLayout() {
  return (
    <>
      <Navigation />
      <div className='min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-200'>
        <Outlet />
      </div>
    </>
  );
}

export default AdminLayout;
