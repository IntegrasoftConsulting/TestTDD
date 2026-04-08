import React from 'react';
import { BarChart3 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend } from 'recharts';
import ExamResultsSummary from './ExamResultsSummary';

const AnalyticsView = ({ 
    isAdmin, adminAnalysisTab, setAdminAnalysisTab, 
    analyticsFilter, setAnalyticsFilter, testTypes,
    passRateData = [], COLORS = [], trendsData = [], darkMode,
    surveyMetrics, questionDetailData, filteredAnalyticsData = [],
    surveyFilter, setSurveyFilter, availableSurveys = [],
    examSummaryData
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
                            <button 
                                onClick={() => setAdminAnalysisTab('examResults')}
                                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${adminAnalysisTab === 'examResults' ? 'bg-indigo-600 text-white shadow-md' : 'text-indigo-400 dark:text-indigo-500 hover:text-indigo-600'}`}
                            >
                                Resultados Generales
                            </button>
                        </div>
                    )}
                    {adminAnalysisTab !== 'examResults' && (
                    <div className="flex bg-slate-200/50 dark:bg-slate-800 p-1 rounded-2xl">
                        {adminAnalysisTab === 'tests' ? (
                            [{ test_id: 'TODO', display_name: 'Todos' }, ...(testTypes || [])].map(f => (
                                <button
                                    key={f.test_id}
                                    onClick={() => setAnalyticsFilter(f.test_id)}
                                    className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${analyticsFilter === f.test_id ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                                >
                                    {f.display_name}
                                </button>
                            ))
                        ) : (
                            [{ id: 'TODO', title: 'Todas' }, ...(availableSurveys || [])].map(s => (
                                <button
                                    key={s.id}
                                    onClick={() => setSurveyFilter(s.id)}
                                    className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${surveyFilter === s.id ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                                >
                                    {s.title}
                                </button>
                            ))
                        )}
                    </div>
                    )}
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
                ) : adminAnalysisTab === 'examResults' ? (
                    <ExamResultsSummary 
                        examSummaryData={examSummaryData}
                        testTypes={testTypes}
                        darkMode={darkMode}
                    />
                ) : (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {surveyMetrics && (surveyMetrics.surveys && Object.keys(surveyMetrics.surveys).length > 0) ? (
                                Object.entries(surveyMetrics.surveys).map(([id, data]) => {
                                    const isHighlighted = surveyFilter === 'TODO' || surveyFilter === id;
                                    return (
                                        <div 
                                            key={id} 
                                            className={`group transition-all duration-300 p-6 rounded-3xl border ${
                                                isHighlighted 
                                                    ? 'bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 shadow-lg border-indigo-100 dark:border-indigo-900/30 ring-1 ring-indigo-50 dark:ring-indigo-900/20' 
                                                    : 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800 opacity-60 grayscale'
                                            }`}
                                        >
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="space-y-1">
                                                    <h4 className="font-black text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                        {id.replace('_SESSION', '')}
                                                    </h4>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Métricas de Sesión</p>
                                                </div>
                                                <div className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-black border border-indigo-100 dark:border-indigo-800/50 shadow-sm">
                                                    {data.count} Respuestas
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-3 gap-4">
                                                {[
                                                    { label: 'Contenido', val: data.content, color: 'text-blue-600 dark:text-blue-400' },
                                                    { label: 'Instructor', val: data.instructor, color: 'text-purple-600 dark:text-purple-400' },
                                                    { label: 'Práctica', val: data.practical, color: 'text-emerald-600 dark:text-emerald-400' }
                                                ].map((m, i) => (
                                                    <div key={i} className="flex flex-col items-center p-3 bg-white/50 dark:bg-slate-950/30 rounded-2xl border border-slate-100/50 dark:border-slate-800/50 shadow-sm transition-transform group-hover:-translate-y-1">
                                                        <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1">{m.label}</p>
                                                        <p className={`text-lg font-black ${m.color}`}>{data.count > 0 ? m.val : '-'}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mt-6 flex items-center gap-2">
                                                <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000"
                                                        style={{ width: `${(data.avg / 5) * 100}%` }}
                                                    />
                                                </div>
                                                <span className="text-[10px] font-black text-indigo-500">{data.avg}/5.0</span>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="col-span-full py-12 text-center bg-slate-50 dark:bg-slate-800/30 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                                    <p className="text-slate-400 dark:text-slate-500 font-bold">No se encontraron datos de encuestas para estos filtros.</p>
                                </div>
                            )}
                        </div>

                        {surveyMetrics && surveyMetrics.recentComments && surveyMetrics.recentComments.length > 0 && (
                            <div className="mt-12">
                                <div className="flex items-center justify-between mb-6">
                                    <h4 className="font-black text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                        <span className="text-indigo-500 animate-pulse text-2xl">•</span> 
                                        Feedback Directo {surveyFilter !== 'TODO' ? `(${surveyFilter.replace('_SESSION', '')})` : ''}
                                    </h4>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                                        Mostrando {surveyMetrics.recentComments.length} comentarios
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {surveyMetrics.recentComments.map((comment, idx) => (
                                        <div key={idx} className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                            <div className="flex gap-1 mb-4 h-1">
                                                <div className="flex-1 h-full bg-blue-400/20 rounded-full overflow-hidden"><div className="h-full bg-blue-500" style={{ width: `${(comment.rating_content / 5) * 100}%` }} /></div>
                                                <div className="flex-1 h-full bg-purple-400/20 rounded-full overflow-hidden"><div className="h-full bg-purple-500" style={{ width: `${(comment.rating_instructor / 5) * 100}%` }} /></div>
                                                <div className="flex-1 h-full bg-emerald-400/20 rounded-full overflow-hidden"><div className="h-full bg-emerald-500" style={{ width: `${(comment.rating_practical / 5) * 100}%` }} /></div>
                                            </div>
                                            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6 font-medium italic">
                                                "{comment.comments}"
                                            </p>
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] font-black text-white shadow-md shadow-indigo-200 dark:shadow-none">
                                                        {(comment.student_name || 'A').charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{comment.student_name || 'Anónimo'}</p>
                                                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tighter">{comment.survey_id.replace('_SESSION', '')}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right flex gap-1.5">
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-[8px] text-slate-400 font-black uppercase">AVG</span>
                                                        <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-lg border border-indigo-100 dark:border-indigo-800/50">
                                                            {((comment.rating_content + comment.rating_instructor + comment.rating_practical) / 3).toFixed(1)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnalyticsView;
