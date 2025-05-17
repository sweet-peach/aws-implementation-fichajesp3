'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AuthenticationService from "@/app/service/AuthenticationService";

export default function Admin() {
  const router = useRouter();

  const handleRedirectToHome = () => {
    router.push('/');
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const payload : any = await AuthenticationService.login(email, password);
        const roles : any = payload['cognito:groups'] || [];
        const isAdmin = roles.includes('admin');

        if(isAdmin) return router.replace('/admin/dashboard');
        return router.replace('/registro')
    } catch(e){
        // TODO implement
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white p-8 gap-8">
      {/* NAVBAR */}
      <div className="flex flex-row justify-between items-center">
        <p className="text-xl font-bold">FICHAJES P3 (ADMIN)</p>
        <div>
          <button
            onClick={handleRedirectToHome}
            className="bg-white text-black px-4 py-2 rounded hover:bg-gray-300 transition"
          >
            Ir a HOME
          </button>
        </div>
      </div>

      {/* LOGIN FORM */}
      <div className="flex flex-col items-center justify-center flex-grow">
        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-4 bg-gray-900 p-8 rounded shadow-md w-full max-w-md"
        >
          <h2 className="text-2xl font-semibold mb-4 text-center">Login como ADMIN</h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
