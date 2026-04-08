import React, { useState, useEffect } from 'react';
import { GraduationCap, CheckCircle, AlertTriangle, Clock, Award, Zap, ArrowRight } from 'lucide-react';

// Mini gauge reutilizable para el estudiante
const StudentGauge = ({ value, size = 180, darkMode }) => {
    const [animatedValue, setAnimatedValue] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => setAnimatedValue(value), 150);
        return () => clearTimeout(timer);
    }, [value]);

    const strokeWidth = 12;
    const radius = (size - strokeWidth) / 2;
    const circumference = Math.PI * radius;
    const progress = (animatedValue / 100) * circumference;
    const cx = size / 2;
    const cy = size / 2 + 8;

    const getColor = (v) => {
        if (v >= 90) return '#10b981';
        if (v >= 70) return '#22c55e';
        if (v >= 40) return '#f59e0b';
        return '#ef4444';
    };

    const getLabel = (v) => {
        if (v >= 90) return '¡Excelente!';
        if (v >= 70) return 'Aprobado';
        if (v >= 40) return 'En desarrollo';
        return 'Necesitas reforzar';
    };

    const color = getColor(animatedValue);

    return (
        <div className="flex flex-col items-center">
            <svg width={size} height={size / 2 + 25} viewBox={`0 0 ${size} ${size / 2 + 25}`}>
                <defs>
                    <filter id="studentGaugeShadow">
                        <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={color} floodOpacity="0.25" />
                    </filter>
                    <linearGradient id="studentGaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={color} stopOpacity="0.5" />
                        <stop offset="100%" stopColor={color} />
                    </linearGradient>
                </defs>
                <path
                    d={`M ${strokeWidth / 2} ${cy} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${cy}`}
                    fill="none"
                    stroke={darkMode ? '#1e293b' : '#f1f5f9'}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                />
                <path
                    d={`M ${strokeWidth / 2} ${cy} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${cy}`}
                    fill="none"
                    stroke="url(#studentGaugeGrad)"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={`${circumference}`}
                    strokeDashoffset={circumference - progress}
                    style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
                    filter="url(#studentGaugeShadow)"
                />
                <text x={cx} y={cy - 12} textAnchor="middle" className="font-black" fontSize="32" fill={color}>
                    {Math.round(animatedValue)}%
                </text>
                <text x={cx} y={cy + 6} textAnchor="middle" className="font-bold" fontSize="10" fill={darkMode ? '#94a3b8' : '#64748b'}>
                    Nota General
                </text>
            </svg>
            <span
                className="text-xs font-black uppercase tracking-wider mt-1"
                style={{ color }}
            >
                {getLabel(animatedValue)}
            </span>
        </div>
    );
};

const getScoreColor = (score) => {
    if (score >= 90) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 70) return 'text-green-600 dark:text-green-400';
    if (score >= 40) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
};

const getBarGradient = (score) => {
    if (score >= 70) return 'linear-gradient(90deg, #22c55e, #10b981)';
    if (score >= 40) return 'linear-gradient(90deg, #f59e0b, #eab308)';
    return 'linear-gradient(90deg, #ef4444, #f87171)';
};

const StudentGradeSummary = ({ studentSummaryData, darkMode, setView, handleStartTest, testTypes }) => {
    // CA-4: Sin resultados — estado vacío motivacional
    if (!studentSummaryData) {
        return (
            <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-950/30 dark:via-slate-900 dark:to-purple-950/30 rounded-3xl border border-indigo-100 dark:border-indigo-900/30 shadow-sm p-10 text-center animate-in fade-in duration-500">
                <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-500 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-5">
                    <Zap className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-2">
                    ¡Comienza tu primera evaluación!
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto text-sm">
                    Aún no tienes resultados registrados. Presenta tu primer examen para ver aquí tu resumen de notas y porcentaje general.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                    {(testTypes || []).filter(t => t.is_active).map(t => (
                        <button
                            key={t.test_id}
                            onClick={() => handleStartTest(t.test_id)}
                            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-2xl transition-all hover:gap-3 active:scale-95 shadow-lg shadow-indigo-200 dark:shadow-none text-sm"
                        >
                            {t.display_name} <ArrowRight className="w-4 h-4" />
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    const { generalPct, status, totalAttempts, completedTypes, totalTypes, testDetails } = studentSummaryData;

    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-slate-50/80 via-indigo-50/30 to-purple-50/30 dark:from-slate-800/30 dark:via-indigo-900/10 dark:to-purple-900/10">
                <h3 className="font-black text-xl text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <Award className="text-indigo-600 dark:text-indigo-400 w-6 h-6" />
                    Mi Resumen de Notas
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-bold mt-1">
                    Tu desempeño consolidado en todas las evaluaciones
                </p>
            </div>

            <div className="p-8">
                {/* Gauge + Estatus + Progreso */}
                <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                    {/* Gauge */}
                    <div className="shrink-0">
                        <StudentGauge value={generalPct} size={180} darkMode={darkMode} />
                    </div>

                    {/* Stats cards */}
                    <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
                        {/* Estatus */}
                        <div className={`p-5 rounded-2xl border flex flex-col items-center gap-2 ${
                            status === 'approved'
                                ? 'bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-800/50'
                                : 'bg-amber-50/50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/50'
                        }`}>
                            {status === 'approved'
                                ? <CheckCircle className="w-7 h-7 text-green-500" />
                                : <AlertTriangle className="w-7 h-7 text-amber-500" />
                            }
                            <span className={`text-xs font-black uppercase tracking-widest ${
                                status === 'approved' ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'
                            }`}>
                                {status === 'approved' ? 'Aprobado' : 'En revisión'}
                            </span>
                        </div>

                        {/* Exámenes completados */}
                        <div className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col items-center gap-2">
                            <GraduationCap className="w-7 h-7 text-indigo-500 dark:text-indigo-400" />
                            <div className="text-center">
                                <p className="text-lg font-black text-slate-800 dark:text-slate-100">
                                    {completedTypes}<span className="text-slate-400 text-sm font-bold">/{totalTypes}</span>
                                </p>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Exámenes</p>
                            </div>
                        </div>

                        {/* Intentos totales */}
                        <div className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col items-center gap-2">
                            <Zap className="w-7 h-7 text-purple-500 dark:text-purple-400" />
                            <div className="text-center">
                                <p className="text-lg font-black text-slate-800 dark:text-slate-100">{totalAttempts}</p>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Intentos</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CA-2: Desglose por tipo de evaluación */}
                <div className="space-y-3">
                    <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
                        Desglose por Evaluación
                    </h4>
                    {testDetails.map((test) => (
                        <div
                            key={test.testId}
                            className={`group p-5 rounded-2xl border transition-all duration-300 ${
                                test.isPending
                                    ? 'bg-slate-50/50 dark:bg-slate-800/20 border-dashed border-slate-200 dark:border-slate-700'
                                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-md hover:-translate-y-0.5'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black shrink-0 ${
                                        test.isPending
                                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                                            : 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-200/50 dark:shadow-none'
                                    }`}>
                                        {test.isPending
                                            ? <Clock className="w-5 h-5" />
                                            : test.displayName.replace('Test ', '').charAt(0)
                                        }
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-slate-800 dark:text-slate-200">{test.displayName}</p>
                                        {test.isPending ? (
                                            <p className="text-[10px] text-slate-400 font-bold">No presentado aún</p>
                                        ) : (
                                            <p className="text-[10px] text-slate-400 font-bold">
                                                {test.attempts} intento{test.attempts > 1 ? 's' : ''} • Mejor nota
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {test.isPending ? (
                                    <div className="flex flex-col items-end gap-1">
                                        <span className={`text-2xl font-black ${getScoreColor(test.bestScore)} opacity-40`}>
                                            {Math.round(test.bestScore)}%
                                        </span>
                                        <button
                                            onClick={() => handleStartTest(test.testId)}
                                            className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-xl border border-indigo-100 dark:border-indigo-800/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all flex items-center gap-1"
                                        >
                                            Nota Base <ArrowRight className="w-3 h-3" />
                                        </button>
                                    </div>
                                ) : (
                                    <span className={`text-2xl font-black ${getScoreColor(test.bestScore)}`}>
                                        {Math.round(test.bestScore)}%
                                    </span>
                                )}
                            </div>

                            {!test.isPending && (
                                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-1000"
                                        style={{
                                            width: `${test.bestScore}%`,
                                            background: getBarGradient(test.bestScore)
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudentGradeSummary;
