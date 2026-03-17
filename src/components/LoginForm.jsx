import React from 'react';
import { User } from 'lucide-react';

const LoginForm = ({ isAdmin, groups, loginGroupId, setLoginGroupId, studentName, setStudentName, email, setEmail, handleLogin, setError }) => {
    return (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 max-w-md mx-auto text-center">
            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold mb-2">Ingresar a la Plataforma</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">Completa tus datos para acceder a tus pruebas y a tu Dashboard.</p>
            
            <div className="space-y-4 mb-6 text-left">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 ml-1" htmlFor="studentName">Nombre completo</label>
                    <input id="studentName" type="text" placeholder="Ej: Juan Pérez"
                        className="w-full p-4 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 focus:border-indigo-500 outline-none transition-all text-md dark:text-slate-100"
                        value={studentName} onChange={(e) => { setStudentName(e.target.value); setError(null); }}
                        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 ml-1" htmlFor="email">Correo electrónico</label>
                    <input id="email" type="email" placeholder="Ej: jperez@empresa.com"
                        className="w-full p-4 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 focus:border-indigo-500 outline-none transition-all text-md dark:text-slate-100"
                        value={email} onChange={(e) => { setEmail(e.target.value); setError(null); }}
                        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    />
                </div>

                {!isAdmin && groups.length > 0 && (
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 ml-1" htmlFor="loginGroup">Selecciona tu grupo</label>
                        <select 
                            id="loginGroup"
                            className="w-full p-4 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 focus:border-indigo-500 outline-none transition-all text-md dark:text-slate-100"
                            value={loginGroupId}
                            onChange={(e) => setLoginGroupId(e.target.value)}
                        >
                            <option value="">-- Elige tu grupo --</option>
                            {groups.map(g => (
                                <option key={g.group_id} value={g.group_id}>{g.name}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            <button onClick={handleLogin}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95 mb-4">
                Entrar ahora
            </button>
        </div>
    );
};

export default LoginForm;
