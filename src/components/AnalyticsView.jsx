import React from 'react';
import { BarChart3 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend } from 'recharts';

const AnalyticsView = ({ 
    isAdmin, adminAnalysisTab, setAdminAnalysisTab, 
    analyticsFilter, setAnalyticsFilter, testTypes,
    passRateData = [], COLORS = [], trendsData = [], darkMode,
    surveyMetrics, questionDetailData, filteredAnalyticsData = []
}) => {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden mb-8">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between md:items-center bg-slate-50/50 dark:bg-slate-800/30 gap-4">
                <h3 className="font-black text-xl text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <BarChart3 className="text-indigo-600 dark:text-indigo-400" /> Analíticas de la Plataforma
                </h3>
                <div className="flex gap-4 items-center flex-wrap">
                    {isAdmin && (
                        <div className="flex bg-indigo-50 dark:bg-indigo-900/20 p-1 rounded-2xl border border-indigo-100 dark:border-indigo-800/50 mr-4">
                            <button 
                                onClick={() => setAdminAnalysisTab('tests')}
                                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${adminAnalysisTab === 'tests' ? 'bg-indigo-600 text-white shadow-md' : 'text-indigo-400 dark:text-indigo-500 hover:text-indigo-600'}`}
                            >
                                Evaluaciones
                            </button>
                            <button 
                                onClick={() => setAdminAnalysisTab('surveys')}
                                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${adminAnalysisTab === 'surveys' ? 'bg-indigo-600 text-white shadow-md' : 'text-indigo-400 dark:text-indigo-500 hover:text-indigo-600'}`}
                            >
                                Encuestas
                            </button>
                        </div>
                    )}
                    <div className="flex bg-slate-200/50 dark:bg-slate-800 p-1 rounded-2xl">
                        {[{ test_id: 'TODO', display_name: 'Todos' }, ...(testTypes || [])].map(f => (
                            <button
                                key={f.test_id}
                                onClick={() => setAnalyticsFilter(f.test_id)}
                                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${analyticsFilter === f.test_id ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                            >
                                {f.display_name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="p-8">
                {adminAnalysisTab === 'tests' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="h-64 flex flex-col items-center">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Distribución de Puntajes</h4>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={passRateData}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {(passRateData || []).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={(COLORS || [])[index % (COLORS?.length || 1)]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}/>
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="h-64 flex flex-col items-center">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Aciertos por Pregunta (%)</h4>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={trendsData || []} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? "#334155" : "#f1f5f9"} />
                                    <XAxis dataKey="name" stroke={darkMode ? "#64748b" : "#94a3b8"} fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke={darkMode ? "#64748b" : "#94a3b8"} fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                                    <RechartsTooltip cursor={{ fill: darkMode ? '#1e293b' : '#f8fafc' }} contentStyle={{ backgroundColor: darkMode ? '#0f172a' : '#ffffff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', color: darkMode ? '#f1f5f9' : '#1e293b' }} />
                                    <Bar dataKey="aciertos" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} name="% Aciertos" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {surveyMetrics && [
                                { id: 'TDD', data: surveyMetrics.TDD, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                                { id: 'BDD', data: surveyMetrics.BDD, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20' }
                            ].map(course => (
                                <div key={course.id} className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="font-black text-slate-800 dark:text-slate-100">Sesión {course.id}</h4>
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${course.bg} ${course.color}`}>
                                            {course.data.count} Encuestas
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="text-center">
                                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase">Contenido</p>
                                            <p className="text-xl font-black text-indigo-600 dark:text-indigo-400">{course.data.count > 0 ? course.data.content : '-'}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase">Instructor</p>
                                            <p className="text-xl font-black text-indigo-600 dark:text-indigo-400">{course.data.count > 0 ? course.data.instructor : '-'}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase">Práctica</p>
                                            <p className="text-xl font-black text-indigo-600 dark:text-indigo-400">{course.data.count > 0 ? course.data.practical : '-'}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnalyticsView;
