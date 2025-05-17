'use client';
import {useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';
import AuthenticationService from "@/app/service/AuthenticationService";


export default function Home() {

    const router = useRouter();

    const handleRedirectToAdmin = () => {
        router.push('/admin');
    };

    const [employeeNumber, setEmployeeNumber] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload: any = await AuthenticationService.login(employeeNumber, password);
            const roles: any = payload['cognito:groups'] || [];
            const isAdmin = roles.includes('admin');

            if (isAdmin) return router.replace('/admin/dashboard');
            return router.replace('/registro')
        } catch (e) {
            console.log(e);
        }

        // Aquí iría la lógica de autenticación
        console.log('Employee Number:', employeeNumber, 'Password:', password);
    };

    return (
        <div className="flex flex-col min-h-screen bg-black text-white p-8 gap-8">
            {/* NAVBAR */}
            <div className="flex flex-row justify-between items-center">
                <p className="text-xl font-bold">FICHAJES P3</p>
                <div>
                    <button
                        onClick={handleRedirectToAdmin}
                        className="bg-white text-black px-4 py-2 rounded hover:bg-gray-300 transition"
                    >
                        Ir a Admin
                    </button>
                </div>
            </div>

            {/* LOGIN FORM */}
            <div className="flex flex-col items-center justify-center flex-grow">
                <form
                    onSubmit={handleLogin}
                    className="flex flex-col gap-4 bg-gray-900 p-8 rounded shadow-md w-full max-w-md"
                >
                    <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>

                    <input
                        type="text"
                        placeholder="Número de Empleado"
                        value={employeeNumber}
                        onChange={(e) => setEmployeeNumber(e.target.value)}
                        className="p-2 rounded bg-black border border-gray-700 text-white placeholder-gray-400"
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="p-2 rounded bg-black border border-gray-700 text-white placeholder-gray-400"
                        required
                    />

                    <button
                        type="submit"
                        className="bg-white text-black py-2 rounded hover:bg-gray-300 transition"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
