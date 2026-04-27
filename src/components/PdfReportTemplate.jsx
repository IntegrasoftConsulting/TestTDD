import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

// Componente oculto que se renderiza para ser capturado por html2canvas
export const PdfReportTemplate = React.forwardRef(({ examSummaryData, testTypes, surveyMetrics }, ref) => {
    if (!examSummaryData || !examSummaryData.kpis) return null;

    const { kpis, avgByType } = examSummaryData;

    // Preparar datos para el gráfico de radar
    const radarData = (testTypes || [])
        .filter(t => t.is_active && avgByType[t.test_id] !== undefined)
        .map(t => ({
            subject: t.test_id,
            A: avgByType[t.test_id],
            fullMark: 100
        }));

    return (
        <div 
            ref={ref} 
            className="bg-white text-slate-800 absolute -left-[9999px] top-0 p-12"
            style={{ width: '800px', fontFamily: 'sans-serif' }}
        >
            {/* Cabecera */}
            <div className="flex justify-between items-center border-b-2 border-indigo-500 pb-6 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-indigo-700 uppercase tracking-widest">Reporte Final de Capacitación</h1>
                    <p className="text-sm font-bold text-slate-500 mt-2">Modern Software Craftsmanship</p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-bold text-slate-400">{new Date().toLocaleDateString()}</p>
                    <p className="text-xs text-slate-400 mt-1">Integrasoft Consulting</p>
                </div>
            </div>

            {/* HU-36 Criterio 2: Métricas de Certificación Generales */}
            <div className="mb-10">
                <h2 className="text-lg font-black text-slate-700 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full"></span> Métricas Globales
                </h2>
                <div className="grid grid-cols-3 gap-6">
                    <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                        <p className="text-xs font-black text-indigo-500 uppercase tracking-widest">Promedio General</p>
                        <p className="text-4xl font-black text-indigo-700 mt-2">{kpis.overallAvg}%</p>
                        <p className="text-[10px] text-indigo-400 mt-1">Conocimiento del Equipo</p>
                    </div>
                    <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                        <p className="text-xs font-black text-emerald-500 uppercase tracking-widest">Certificados</p>
                        <p className="text-4xl font-black text-emerald-700 mt-2">{kpis.approvedCount}</p>
                        <p className="text-[10px] text-emerald-400 mt-1">Aprobados (&ge; 70%)</p>
                    </div>
                    <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
                        <p className="text-xs font-black text-amber-500 uppercase tracking-widest">En Revisión</p>
                        <p className="text-4xl font-black text-amber-700 mt-2">{kpis.totalStudents - kpis.approvedCount}</p>
                        <p className="text-[10px] text-amber-400 mt-1">No certificados (&lt; 70%)</p>
                    </div>
                </div>
            </div>

            {/* HU-36 Criterio 3: Gráfico Radar */}
            {radarData.length > 0 && (
                <div className="mb-10 page-break-inside-avoid">
                    <h2 className="text-lg font-black text-slate-700 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span> Conocimiento por Disciplina (Radar)
                    </h2>
                    <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 flex justify-center items-center" style={{ height: '350px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                <PolarGrid stroke="#cbd5e1" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 12, fontWeight: 'bold' }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                <Radar name="Promedio" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* HU-36 Criterio 4: Contexto Teórico por Test */}
            <div className="mb-10">
                <h2 className="text-lg font-black text-slate-700 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span> Detalle por Evaluación
                </h2>
                <div className="space-y-6">
                    {(testTypes || []).filter(t => t.is_active).map(test => {
                        const avg = avgByType[test.test_id] || 0;
                        return (
                            <div key={test.test_id} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 page-break-inside-avoid">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-black text-slate-800">{test.display_name}</h3>
                                    <div className={`px-4 py-1.5 rounded-xl font-black text-sm border ${
                                        avg >= 70 ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 
                                        avg >= 40 ? 'bg-amber-100 text-amber-700 border-amber-200' : 
                                        'bg-red-100 text-red-700 border-red-200'
                                    }`}>
                                        Promedio: {avg}%
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Contexto Teórico</p>
                                        <p className="text-sm text-slate-600 leading-relaxed">{test.theoretical_context || 'Información no disponible.'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Conocimiento Evaluado</p>
                                        <p className="text-sm text-slate-600 leading-relaxed">{test.evaluated_knowledge || 'Información no disponible.'}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* HU-36 Criterio 5: Encuestas de Satisfacción */}
            {surveyMetrics && surveyMetrics.surveys && Object.keys(surveyMetrics.surveys).length > 0 && (
                <div className="page-break-inside-avoid">
                    <h2 className="text-lg font-black text-slate-700 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-pink-500 rounded-full"></span> Encuestas de Satisfacción
                    </h2>
                    <div className="grid grid-cols-2 gap-6">
                        {Object.entries(surveyMetrics.surveys).map(([id, data]) => (
                            <div key={id} className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-black text-slate-700">{id.replace('_SESSION', '')}</h4>
                                    <span className="text-[10px] font-bold bg-slate-200 px-2 py-1 rounded-lg text-slate-600">{data.count} Respuestas</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="text-center bg-white p-2 rounded-xl border border-slate-100">
                                        <p className="text-[9px] font-black text-slate-400 uppercase">Contenido</p>
                                        <p className="text-sm font-black text-blue-600">{data.content}/5</p>
                                    </div>
                                    <div className="text-center bg-white p-2 rounded-xl border border-slate-100">
                                        <p className="text-[9px] font-black text-slate-400 uppercase">Instructor</p>
                                        <p className="text-sm font-black text-purple-600">{data.instructor}/5</p>
                                    </div>
                                    <div className="text-center bg-white p-2 rounded-xl border border-slate-100">
                                        <p className="text-[9px] font-black text-slate-400 uppercase">Práctica</p>
                                        <p className="text-sm font-black text-emerald-600">{data.practical}/5</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Footer */}
            <div className="mt-12 pt-6 border-t border-slate-200 text-center">
                <p className="text-xs text-slate-400 font-bold">Generado automáticamente por Test Mastery Platform</p>
            </div>
        </div>
    );
});

export default PdfReportTemplate;
