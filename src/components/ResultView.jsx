import React from 'react';
import { CheckCircle, ArrowRight, Star } from 'lucide-react';

const ResultView = ({ testType, finalScore, stats, setView, setSurveyData }) => {
    return (
        <div className="bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold mb-2">¡Test de {testType} completado!</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8">Tus resultados han sido registrados exitosamente en la plataforma.</p>
            
            <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Tu Puntaje</p>
                    <p className="text-4xl font-black text-indigo-600 dark:text-indigo-400">{Math.round(finalScore)}%</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Promedio Global</p>
                    <p className="text-4xl font-black text-slate-700 dark:text-slate-200">{stats.avg}%</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                    onClick={() => {
                        const surveyId = `${testType || 'TDD'}_SESSION`.toUpperCase();
                        setSurveyData(prev => ({ ...prev, survey_id: surveyId }));
                        setView('survey');
                    }}
                    className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 px-10 rounded-2xl transition-all hover:gap-3 active:scale-95 shadow-lg group"
                >
                    Dar Feedback <Star className="w-5 h-5 group-hover:fill-current" />
                </button>

                <button onClick={() => setView('dashboard')}
                    className="inline-flex items-center justify-center gap-2 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white font-bold py-4 px-10 rounded-2xl transition-all hover:gap-3 active:scale-95 shadow-lg"
                >
                    Volver al Dashboard <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default ResultView;
