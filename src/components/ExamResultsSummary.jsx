import React, { useState, useEffect } from 'react';
import { GraduationCap, Trophy, TrendingUp, AlertTriangle, CheckCircle, Clock, ChevronUp, ChevronDown } from 'lucide-react';

// HU-25d: Gauge circular SVG animado
const GaugeChart = ({ value, size = 200, darkMode }) => {
    const [animatedValue, setAnimatedValue] = useState(0);
    
    useEffect(() => {
        const timer = setTimeout(() => setAnimatedValue(value), 100);
        return () => clearTimeout(timer);
    }, [value]);

    const strokeWidth = 14;
    const radius = (size - strokeWidth) / 2;
    const circumference = Math.PI * radius; // semicircle
    const progress = (animatedValue / 100) * circumference;
    const cx = size / 2;
    const cy = size / 2 + 10;

    const getColor = (v) => {
        if (v >= 90) return { main: '#10b981', glow: 'rgba(16,185,129,0.3)' };
        if (v >= 70) return { main: '#22c55e', glow: 'rgba(34,197,94,0.2)' };
        if (v >= 40) return { main: '#f59e0b', glow: 'rgba(245,158,11,0.2)' };
        return { main: '#ef4444', glow: 'rgba(239,68,68,0.2)' };
    };

    const getLabel = (v) => {
        if (v >= 90) return 'Excelente';
        if (v >= 70) return 'Competente';
        if (v >= 40) return 'En desarrollo';
        return 'Requiere atención';
    };

    const color = getColor(animatedValue);

    return (
        <div className="flex flex-col items-center">
            <svg width={size} height={size / 2 + 30} viewBox={`0 0 ${size} ${size / 2 + 30}`}>
                <defs>
                    <filter id="gaugeShadow">
                        <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor={color.main} floodOpacity="0.3" />
                    </filter>
                    <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={color.main} stopOpacity="0.6" />
                        <stop offset="100%" stopColor={color.main} />
                    </linearGradient>
                </defs>
                {/* Track */}
                <path
                    d={`M ${strokeWidth / 2} ${cy} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${cy}`}
                    fill="none"
                    stroke={darkMode ? '#1e293b' : '#f1f5f9'}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                />
                {/* Progress */}
                <path
                    d={`M ${strokeWidth / 2} ${cy} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${cy}`}
                    fill="none"
                    stroke="url(#gaugeGradient)"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={`${circumference}`}
                    strokeDashoffset={circumference - progress}
                    style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
                    filter="url(#gaugeShadow)"
                />
                {/* Value */}
                <text x={cx} y={cy - 15} textAnchor="middle" className="font-black" fontSize="36" fill={color.main}>
                    {Math.round(animatedValue)}%
                </text>
                <text x={cx} y={cy + 8} textAnchor="middle" className="font-bold" fontSize="11" fill={darkMode ? '#94a3b8' : '#64748b'}>
                    Nivel del equipo
                </text>
            </svg>
            <div className="mt-1 flex items-center gap-2">
                <span
                    className="w-2.5 h-2.5 rounded-full animate-pulse"
                    style={{ backgroundColor: color.main }}
                />
                <span className="text-sm font-black uppercase tracking-wider" style={{ color: color.main }}>
                    {getLabel(animatedValue)}
                </span>
            </div>
        </div>
    );
};

// Helpers de color por score
const getScoreColor = (score) => {
    if (score >= 90) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 70) return 'text-green-600 dark:text-green-400';
    if (score >= 40) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
};

const getScoreBg = (score) => {
    if (score >= 90) return 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50';
    if (score >= 70) return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/50';
    if (score >= 40) return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/50';
    return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50';
};

const ExamResultsSummary = ({ examSummaryData, testTypes, darkMode }) => {
    const [sortField, setSortField] = useState('generalPct');
    const [sortDir, setSortDir] = useState('desc');

    if (!examSummaryData) {
        return (
            <div className="py-16 text-center bg-slate-50 dark:bg-slate-800/30 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                <GraduationCap className="w-12 h-12 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                <p className="text-slate-400 dark:text-slate-500 font-bold">No hay resultados de exámenes registrados aún.</p>
            </div>
        );
    }

    const { students, kpis, avgByType, activeTestIds } = examSummaryData;

    const getTestDisplayName = (testId) => {
        const found = (testTypes || []).find(t => t.test_id === testId);
        return found ? found.display_name : testId;
    };

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDir(prev => prev === 'desc' ? 'asc' : 'desc');
        } else {
            setSortField(field);
            setSortDir('desc');
        }
    };

    const sortedStudents = [...students].sort((a, b) => {
        let valA, valB;
        if (sortField === 'generalPct') {
            valA = a.generalPct;
            valB = b.generalPct;
        } else if (sortField === 'name') {
            valA = (a.name || '').toLowerCase();
            valB = (b.name || '').toLowerCase();
            return sortDir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        } else {
            const scoreObjA = a.scoresByType[sortField];
            const scoreObjB = b.scoresByType[sortField];
            valA = scoreObjA && typeof scoreObjA === 'object' ? scoreObjA.value : (scoreObjA ?? -1);
            valB = scoreObjB && typeof scoreObjB === 'object' ? scoreObjB.value : (scoreObjB ?? -1);
        }
        return sortDir === 'asc' ? valA - valB : valB - valA;
    });

    const SortIcon = ({ field }) => {
        if (sortField !== field) return <ChevronDown className="w-3 h-3 opacity-30 inline ml-1" />;
        return sortDir === 'desc'
            ? <ChevronDown className="w-3 h-3 text-indigo-500 inline ml-1" />
            : <ChevronUp className="w-3 h-3 text-indigo-500 inline ml-1" />;
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* HU-25b: KPI Cards + HU-25d: Gauge */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Gauge — col span 1 on large */}
                <div className="lg:row-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 flex flex-col items-center justify-center">
                    <GaugeChart value={kpis.overallAvg} size={220} darkMode={darkMode} />
                    <div className="mt-4 grid grid-cols-2 gap-4 w-full">
                        <div className="text-center p-3 bg-green-50/50 dark:bg-green-900/10 rounded-2xl border border-green-100 dark:border-green-900/30">
                            <p className="text-[9px] font-black text-green-500 uppercase tracking-widest">Aprobados</p>
                            <p className="text-xl font-black text-green-600 dark:text-green-400">{kpis.approvedCount}</p>
                        </div>
                        <div className="text-center p-3 bg-amber-50/50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-900/30">
                            <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest">En Revisión</p>
                            <p className="text-xl font-black text-amber-600 dark:text-amber-400">{kpis.totalStudents - kpis.approvedCount}</p>
                        </div>
                    </div>
                </div>

                {/* KPI 1: Total Alumnos */}
                <div className="bg-white dark:bg-slate-900 p-7 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center gap-5 group hover:shadow-md transition-all">
                    <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl group-hover:scale-110 transition-transform">
                        <GraduationCap className="w-7 h-7" />
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">Alumnos Evaluados</p>
                        <p className="text-3xl font-black text-slate-800 dark:text-slate-100">{kpis.totalStudents}</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-0.5">{kpis.approvalRate}% tasa de aprobación</p>
                    </div>
                </div>

                {/* KPI 2: Promedio General */}
                <div className="bg-white dark:bg-slate-900 p-7 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center gap-5 group hover:shadow-md transition-all">
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl group-hover:scale-110 transition-transform">
                        <TrendingUp className="w-7 h-7" />
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">Promedio General</p>
                        <p className={`text-3xl font-black ${getScoreColor(kpis.overallAvg)}`}>{kpis.overallAvg}%</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-0.5">Ponderado equitativamente</p>
                    </div>
                </div>

                {/* KPI 3: Mejor Test */}
                {kpis.bestType && (
                    <div className="bg-white dark:bg-slate-900 p-7 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center gap-5 group hover:shadow-md transition-all">
                        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl group-hover:scale-110 transition-transform">
                            <Trophy className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">Mejor Evaluación</p>
                            <p className="text-lg font-black text-slate-800 dark:text-slate-100">{getTestDisplayName(kpis.bestType.id)}</p>
                            <p className={`text-sm font-black ${getScoreColor(kpis.bestType.avg)}`}>{kpis.bestType.avg}% promedio</p>
                        </div>
                    </div>
                )}

                {/* KPI 4: Peor Test */}
                {kpis.worstType && kpis.worstType.id !== kpis.bestType?.id && (
                    <div className="bg-white dark:bg-slate-900 p-7 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center gap-5 group hover:shadow-md transition-all">
                        <div className="p-4 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl group-hover:scale-110 transition-transform">
                            <AlertTriangle className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">Mayor Oportunidad</p>
                            <p className="text-lg font-black text-slate-800 dark:text-slate-100">{getTestDisplayName(kpis.worstType.id)}</p>
                            <p className={`text-sm font-black ${getScoreColor(kpis.worstType.avg)}`}>{kpis.worstType.avg}% promedio</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Promedio por tipo de test - mini barras */}
            {Object.keys(avgByType).length > 0 && (
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-8">
                    <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">Promedio por Evaluación</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {activeTestIds.map(typeId => {
                            const avg = avgByType[typeId];
                            if (avg === undefined) return null;
                            return (
                                <div key={typeId} className="flex flex-col gap-2">
                                    <div className="flex justify-between items-end">
                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{getTestDisplayName(typeId)}</span>
                                        <span className={`text-sm font-black ${getScoreColor(avg)}`}>{avg}%</span>
                                    </div>
                                    <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-1000"
                                            style={{
                                                width: `${avg}%`,
                                                background: avg >= 70
                                                    ? 'linear-gradient(90deg, #22c55e, #10b981)'
                                                    : avg >= 40
                                                        ? 'linear-gradient(90deg, #f59e0b, #eab308)'
                                                        : 'linear-gradient(90deg, #ef4444, #f87171)'
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* HU-25c: Tabla Resumen por Alumno */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                    <h3 className="font-black text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <GraduationCap className="text-indigo-600 dark:text-indigo-400 w-5 h-5" />
                        Resumen por Alumno
                    </h3>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
                        {sortedStudents.length} alumnos
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-black tracking-widest bg-slate-50/50 dark:bg-slate-800/20">
                                <th
                                    className="px-6 py-5 cursor-pointer hover:text-indigo-500 transition-colors select-none"
                                    onClick={() => handleSort('name')}
                                >
                                    Alumno <SortIcon field="name" />
                                </th>
                                {activeTestIds.map(typeId => (
                                    <th
                                        key={typeId}
                                        className="px-4 py-5 text-center cursor-pointer hover:text-indigo-500 transition-colors select-none"
                                        onClick={() => handleSort(typeId)}
                                    >
                                        {getTestDisplayName(typeId).replace('Test ', '')} <SortIcon field={typeId} />
                                    </th>
                                ))}
                                <th
                                    className="px-4 py-5 text-center cursor-pointer hover:text-indigo-500 transition-colors select-none"
                                    onClick={() => handleSort('generalPct')}
                                >
                                    % General <SortIcon field="generalPct" />
                                </th>
                                <th className="px-4 py-5 text-center">Estatus</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {sortedStudents.map((student, idx) => (
                                <tr key={student.email || idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-[11px] font-black text-white shadow-md shadow-indigo-200/50 dark:shadow-none shrink-0">
                                                {(student.name || 'A').charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-slate-800 dark:text-slate-200">{student.name}</p>
                                                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">{student.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    {activeTestIds.map(typeId => {
                                        const scoreRaw = student.scoresByType[typeId];
                                        const isDefault = scoreRaw && typeof scoreRaw === 'object' && scoreRaw.isDefault;
                                        const score = isDefault ? scoreRaw.value : scoreRaw;
                                        
                                        return (
                                            <td key={typeId} className="px-4 py-5 text-center">
                                                {score !== undefined ? (
                                                    <div className="flex flex-col items-center gap-1">
                                                        <span className={`inline-block px-3 py-1.5 rounded-xl text-xs font-black border ${getScoreBg(score)} ${getScoreColor(score)}`}>
                                                            {Math.round(score)}%
                                                        </span>
                                                        {isDefault && (
                                                            <span className="text-[8px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-tighter">Default</span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-300 dark:text-slate-600 text-xs font-bold flex items-center justify-center gap-1">
                                                        <Clock className="w-3 h-3" /> Pendiente
                                                    </span>
                                                )}
                                            </td>
                                        );
                                    })}
                                    <td className="px-4 py-5 text-center">
                                        <div className="flex flex-col items-center gap-1">
                                            <span className={`text-xl font-black ${getScoreColor(student.generalPct)}`}>
                                                {student.generalPct}%
                                            </span>
                                            {student.pendingTypes.length > 0 && (
                                                <span className="text-[9px] text-amber-500 font-bold">
                                                    {student.pendingTypes.length} pendiente{student.pendingTypes.length > 1 ? 's' : ''}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-5 text-center">
                                        {student.status === 'approved' ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800/50">
                                                <CheckCircle className="w-3.5 h-3.5" /> Aprobado
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50">
                                                <AlertTriangle className="w-3.5 h-3.5" /> En revisión
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ExamResultsSummary;
