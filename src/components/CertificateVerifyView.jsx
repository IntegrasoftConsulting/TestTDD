import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Award, CheckCircle, XCircle, Calendar, ShieldCheck, Home } from 'lucide-react';

// Reusing same logo SVG component
const TmpLogo = ({ size = 56 }) => (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="56" height="56" rx="10" fill="#0f172a"/>
        <polygon points="28,6 48,17 48,39 28,50 8,39 8,17"
            fill="none" stroke="#6366f1" strokeWidth="1.5" />
        <polygon points="28,14 38,28 28,42 18,28"
            fill="none" stroke="#818cf8" strokeWidth="1"/>
        <circle cx="28" cy="28" r="3" fill="#6366f1"/>
        <text x="28" y="58" textAnchor="middle" fontSize="8"
            fontFamily="monospace" fill="#94a3b8" fontWeight="bold"
            letterSpacing="2">TMP</text>
    </svg>
);

const CertificateVerifyView = ({ certId, darkMode }) => {
    const [certData, setCertData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchCert = async () => {
            if (!certId) {
                setError(true);
                setLoading(false);
                return;
            }

            try {
                // Lectura pública debido a RLS
                const { data, error: err } = await supabase
                    .from('certificates')
                    .select('*')
                    .eq('certificate_id', certId)
                    .maybeSingle();

                if (err || !data) {
                    setError(true);
                } else {
                    setCertData(data);
                }
            } catch (err) {
                console.error('Error al verificar certificado:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchCert();
    }, [certId]);

    const goHome = () => {
        window.location.href = window.location.origin + window.location.pathname;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Verificando...</p>
                </div>
            </div>
        );
    }

    if (error || !certData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
                <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-red-200 dark:border-red-900/50 p-10 text-center animate-in fade-in zoom-in-95 duration-500">
                    <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <XCircle className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-2">
                        Certificado no encontrado
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">
                        El código de verificación proporcionado no existe en nuestros registros o ha sido revocado.
                    </p>
                    <button
                        onClick={goHome}
                        className="inline-flex items-center gap-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg text-sm"
                    >
                        <Home className="w-4 h-4" /> Ir a la plataforma
                    </button>
                </div>
            </div>
        );
    }

    const { student_name, weighted_score, issued_at, score_detail } = certData;
    const date = new Date(issued_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });

    return (
        <div className={`min-h-screen ${darkMode ? 'dark' : ''} bg-slate-50 dark:bg-slate-950 p-6 flex flex-col items-center justify-center font-sans`}>
            
            <div className="max-w-xl w-full bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-8 duration-700">
                {/* Visual Stamp */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
                        <ShieldCheck className="w-64 h-64" />
                    </div>
                    
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-green-500 mb-4 shadow-lg shadow-green-900/20">
                            <CheckCircle className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-black mb-1 letter-spacing-tight">Certificado Válido</h2>
                        <p className="text-green-100 font-medium opacity-90">Verificado exitosamente en Test Mastery Platform</p>
                    </div>
                </div>

                {/* Data context */}
                <div className="p-8 md:p-10">
                    <div className="flex items-center justify-center gap-4 mb-10">
                        <TmpLogo size={48} />
                        <div>
                            <p className="text-[10px] font-black tracking-widest uppercase text-indigo-600 dark:text-indigo-400">Programa</p>
                            <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 leading-tight">
                                Modern Software<br/>Craftsmanship
                            </h3>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Otorgado a</p>
                            <p className="text-2xl font-black text-slate-800 dark:text-slate-100">{student_name}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                                    <Award className="w-3.5 h-3.5" /> Nota General
                                </p>
                                <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{Math.round(weighted_score)}%</p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5" /> Fecha de Emisión
                                </p>
                                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-2">{date}</p>
                            </div>
                        </div>

                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 mt-4 text-center">ID de Verificación</p>
                            <div className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 font-mono text-center py-3 rounded-xl border border-indigo-100 dark:border-indigo-800/50 text-sm tracking-wider font-bold">
                                {certId}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 p-6 bg-slate-50 dark:bg-slate-800/20 flex justify-center">
                    <button
                        onClick={goHome}
                        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 font-bold text-sm transition-colors"
                    >
                        <Home className="w-4 h-4" /> Volver a la plataforma
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CertificateVerifyView;
