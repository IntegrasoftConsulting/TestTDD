import React from 'react';
import { Users, Trophy, Star, BarChart3, ClipboardCheck, Filter } from 'lucide-react';
import AnalyticsView from './AnalyticsView';

const DashboardView = ({ 
    isAdmin, groups, groupAnalyticsFilter, setGroupAnalyticsFilter, setSelectedGroupId, fetchGroupDetails,
    stats, setView, testTypes, adminAnalysisTab, setAdminAnalysisTab,
    analyticsFilter, setAnalyticsFilter, passRateData, COLORS, trendsData, darkMode,
    surveyMetrics, questionDetailData, filteredAnalyticsData
}) => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {isAdmin && groups.length > 0 && (
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
                            <Filter className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">Filtro de Visualización</p>
                            <h4 className="font-bold text-slate-800 dark:text-slate-100">Filtrar por Grupo</h4>
                        </div>
                    </div>
                    <select 
                        value={groupAnalyticsFilter}
                        onChange={(e) => {
                            const gid = e.target.value;
                            setGroupAnalyticsFilter(gid);
                            if (gid !== 'ALL') {
                                setSelectedGroupId(gid);
                                fetchGroupDetails(gid);
                            }
                        }}
                        className="w-full md:w-64 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl px-5 py-3 text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500 transition-all cursor-pointer"
                    >
                        <option value="ALL">Todos los grupos</option>
                        {groups.map(g => (
                            <option key={g.group_id} value={g.group_id}>{g.name}</option>
                        ))}
                    </select>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center gap-6">
                    <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl">
                        <Users className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">Tests Completados</p>
                        <p className="text-3xl font-black text-slate-800 dark:text-slate-100">{stats.total}</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center gap-6">
                    <div className="p-4 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-2xl">
                        <Trophy className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">Promedio</p>
                        <p className="text-3xl font-black text-slate-800 dark:text-slate-100">{stats.avg}%</p>
                    </div>
                </div>
                <div onClick={() => setView('survey_list')} className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 p-8 rounded-3xl shadow-sm border border-amber-100 dark:border-amber-900/30 flex items-center gap-6 cursor-pointer hover:shadow-md transition-all group">
                    <div className="p-4 bg-white dark:bg-slate-900 text-amber-500 dark:text-amber-400 rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                        <Star className="w-8 h-8 fill-current" />
                    </div>
                    <div>
                        <p className="text-xs text-amber-600 dark:text-amber-500 font-black uppercase tracking-widest">Feedback</p>
                        <p className="text-sm font-bold text-amber-800 dark:text-amber-200">Danos tu opinión</p>
                    </div>
                </div>
            </div>

            <AnalyticsView 
                isAdmin={isAdmin}
                adminAnalysisTab={adminAnalysisTab}
                setAdminAnalysisTab={setAdminAnalysisTab}
                analyticsFilter={analyticsFilter}
                setAnalyticsFilter={setAnalyticsFilter}
                testTypes={testTypes}
                passRateData={passRateData}
                COLORS={COLORS}
                trendsData={trendsData}
                darkMode={darkMode}
                surveyMetrics={surveyMetrics}
                questionDetailData={questionDetailData}
                filteredAnalyticsData={filteredAnalyticsData}
            />

            {/* HU-19: Tarjetas de detalle por pregunta — visible solo al filtrar un test específico */}
            {questionDetailData && (
                <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h3 className="font-black text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2 px-1">
                        <span className="text-indigo-500">◈</span>
                        Detalle por Pregunta
                        {!isAdmin && <span className="text-xs font-medium text-slate-400 dark:text-slate-500 ml-2">(Tu último intento)</span>}
                    </h3>

                    {questionDetailData.mode === 'admin'
                        ? questionDetailData.stats.map((q, qi) => (
                            <div key={qi} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                                <div className="flex items-start justify-between gap-4 mb-5">
                                    <p className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-snug">
                                        <span className="text-indigo-400 font-black mr-2">P{qi + 1}.</span>{q.question_text}
                                    </p>
                                    <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold ${
                                        q.correctPct >= 70
                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                            : q.correctPct >= 40
                                                ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                                                : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                                    }`}>
                                        {q.correctPct}% aciertos
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    {q.options.map((opt, oi) => {
                                        const pct = q.total > 0 ? Math.round((q.optionCounts[oi] / q.total) * 100) : 0;
                                        const isCorrect = oi === q.correct;
                                        return (
                                            <div key={oi}>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`text-xs font-bold w-5 shrink-0 ${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-slate-400'}`}>
                                                        {isCorrect ? '✓' : String.fromCharCode(65 + oi)}
                                                    </span>
                                                    <span className={`text-xs flex-1 ${isCorrect ? 'font-bold text-green-700 dark:text-green-300' : 'text-slate-600 dark:text-slate-300'}`}>{opt}</span>
                                                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">{pct}% ({q.optionCounts[oi]})</span>
                                                </div>
                                                <div className="ml-7 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-700 ${isCorrect ? 'bg-green-500' : 'bg-indigo-400'}`}
                                                        style={{ width: `${pct}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                {q.total === 0 && (
                                    <p className="text-xs text-slate-400 dark:text-slate-500 italic mt-2">Sin intentos registrados aún.</p>
                                )}
                            </div>
                        ))
                        : questionDetailData.answers === null
                            ? (
                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-8 text-center border border-slate-100 dark:border-slate-800">
                                    <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">Aún no has realizado este test. ¡Anímate a intentarlo!</p>
                                </div>
                            )
                            : questionDetailData.questions.map((q, qi) => {
                                const chosen = questionDetailData.answers[qi] ?? null;
                                const isCorrect = chosen === q.correct;
                                return (
                                    <div key={qi} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                                        <div className="flex items-start gap-3 mb-4">
                                            <span className={`shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-sm font-black ${
                                                isCorrect
                                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                                    : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                                            }`}>
                                                {isCorrect ? '✓' : '✗'}
                                            </span>
                                            <p className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-snug">
                                                <span className="text-indigo-400 font-black mr-1">P{qi + 1}.</span>{q.question_text}
                                            </p>
                                        </div>
                                        <div className="space-y-2 ml-10">
                                            {q.options.map((opt, oi) => {
                                                const wasChosen = oi === chosen;
                                                const isCorrectOpt = oi === q.correct;
                                                return (
                                                    <div key={oi} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all ${
                                                        isCorrectOpt
                                                            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 text-green-700 dark:text-green-300 font-bold'
                                                            : wasChosen
                                                                ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 font-semibold'
                                                                : 'bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                                                    }`}>
                                                        <span className="font-black w-4">{String.fromCharCode(65 + oi)}</span>
                                                        <span className="flex-1">{opt}</span>
                                                        {wasChosen && !isCorrectOpt && <span className="text-red-400 font-black">Tu resp.</span>}
                                                        {isCorrectOpt && <span className="text-green-500 font-black">Correcta</span>}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })
                    }
                </div>
            )}

            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                    <h3 className="font-black text-xl text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <BarChart3 className="text-indigo-600 dark:text-indigo-400" /> Historial de Resultados
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-slate-400 dark:text-slate-500 text-xs uppercase font-black tracking-widest bg-slate-50/50 dark:bg-slate-800/20">
                                <th className="px-8 py-6">Ingeniero</th>
                                <th className="px-8 py-6">Examen</th>
                                <th className="px-8 py-6">Puntaje</th>
                                <th className="px-8 py-6">Fecha</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredAnalyticsData.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center opacity-30">
                                            <ClipboardCheck className="w-16 h-16 mb-4" />
                                            <p className="text-lg font-bold uppercase tracking-tighter">No hay resultados para este filtro...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredAnalyticsData.map((res) => (
                                    <tr key={res.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="font-bold text-slate-800 dark:text-slate-200">{res.studentName}</div>
                                            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono uppercase">{res.id.substring(0, 8)}</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border
                                        ${res.testType === 'BDD' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800/50' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/50'}`}>
                                                {res.testType || 'TDD'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-end gap-1">
                                                <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{Math.round(res.score)}%</span>
                                                <span className="text-xs text-slate-400 dark:text-slate-500 mb-1 font-bold">({res.correctAnswers}/{res.totalQuestions})</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-sm font-medium text-slate-500 dark:text-slate-400">
                                            {res.timestamp ? new Date(res.timestamp).toLocaleString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '---'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DashboardView;
