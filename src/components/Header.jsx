import React from 'react';
import { ClipboardCheck, Sun, Moon } from 'lucide-react';

const Header = ({ darkMode, setDarkMode, isLoggedIn, isAdmin, view, setView, testTypes, testType, handleStartTest }) => {
    return (
        <header className="max-w-4xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex justify-between items-center w-full md:w-auto">
                <div onClick={() => isLoggedIn && setView('dashboard')} className={`cursor-pointer ${!isLoggedIn ? 'opacity-90' : 'hover:opacity-80'}`}>
                    <h1 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-2">
                        <ClipboardCheck className="w-8 h-8" />
                        Test Mastery Platform
                        {isAdmin && <span className="text-[10px] bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-1 rounded-full uppercase tracking-widest ml-2 align-middle">Admin</span>}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Panel de Evaluación de Ingeniería</p>
                </div>
                
                {/* Botón de Modo Oscuro (Móvil) */}
                <button 
                    onClick={() => setDarkMode(!darkMode)}
                    className="p-3 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-amber-400 md:hidden"
                >
                    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
            </div>
            
            <div className="flex items-center gap-4">
                {/* Botón de Modo Oscuro (Escritorio) */}
                <button 
                    onClick={() => setDarkMode(!darkMode)}
                    className="hidden md:flex p-3 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-amber-400 hover:scale-110 transition-transform"
                    title={darkMode ? "Modo Claro" : "Modo Oscuro"}
                >
                    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                {isLoggedIn && (
                    <nav className="flex bg-white dark:bg-slate-900 p-1 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                        <button onClick={() => setView('dashboard')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${view === 'dashboard' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                        >
                            Dashboard
                        </button>
                        {/* HU-15: Botones generados dinámicamente desde testTypes */}
                        {testTypes.map(tt => {
                            const isDisabled = !isAdmin && !tt.is_active;
                            const isActive = (view === 'quiz' || view === 'result') && testType === tt.test_id;
                            return (
                                <button
                                    key={tt.test_id}
                                    onClick={() => handleStartTest(tt.test_id)}
                                    disabled={isDisabled}
                                    title={tt.description}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                                        isActive
                                            ? 'bg-indigo-600 text-white shadow-md'
                                            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    } disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-100 dark:disabled:bg-slate-800/50 disabled:text-slate-400`}
                                >
                                    {isDisabled ? `${tt.display_name} (Cerrado)` : tt.display_name}
                                </button>
                            );
                        })}
                        {isAdmin && (
                            <button onClick={() => { setView('groups'); setGroupView('list'); }}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${view === 'groups' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                            >
                                Grupos
                            </button>
                        )}
                    </nav>
                )}
            </div>
        </header>
    );
};

export default Header;
