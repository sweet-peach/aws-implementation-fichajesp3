import React, { FC } from 'react';
import { useRouter } from 'next/navigation';
import AuthenticationService from "@/app/service/AuthenticationService";

interface AdminNavProps {

}

const AdminNav: FC<AdminNavProps> = ({ }) => {
    const router = useRouter();
    const handleLogout = async () => {
        await AuthenticationService.logout();
        router.replace('/admin');
    };

    const handleInformes = () => {
      router.push('/admin/dashboard/informes');
    };

    const handleUsuarios = () => {
      router.push('/admin/dashboard/usuarios');
    };
    const handleDashboard = () => {
      router.push('/admin/dashboard');
    };
  return (
    <nav
    className="flex flex-row justify-between p-5 px-12 items-center border-b border-gray-600"
    style={{ backgroundColor: 'rgb(255, 255, 255, 0.04)' }}
  >
        <p className="text-2xl text-gray-300" onClick={handleDashboard}>Dashboard ADMIN</p>
        <div className="flex flex-row">
      <button
        className="p-1 border border-gray-100 m-1 rounded px-4 hover:bg-gray-100 hover:text-black hover:opacity-90"
        onClick={handleInformes}
      >
        Sacar informes
      </button>
      <button
        className="p-1 border border-gray-100 m-1 rounded px-4 hover:bg-gray-100 hover:text-black hover:opacity-90"
        onClick={handleUsuarios}
      >
        Gestionar usuarios
      </button>
      <button
        className="p-1 border border-gray-100 m-1 rounded px-4 hover:bg-gray-100 hover:text-black hover:opacity-90"
        onClick={handleLogout}
      >
        Cerrar sesión
      </button>
    </div>
  </nav>  );
};

export default AdminNav;