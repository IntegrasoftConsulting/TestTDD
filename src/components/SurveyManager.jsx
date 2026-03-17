import React from 'react';
import { Star, ChevronRight, Loader2 } from 'lucide-react';

const SurveyManager = ({ 
    view, setView, availableSurveys, surveyConfig, 
    surveyData, setSurveyData, handleSurveySubmit, surveySubmitting
}) => {
    if (view === 'survey_list') {
        return (
            <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 max-w-2xl mx-auto">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Star className="w-8 h-8 fill-current" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">Encuestas Disponibles</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Selecciona la sesión que deseas calificar</p>
                </div>
         
                <div className="grid gap-4">
                    {availableSurveys.filter(s => surveyConfig[s.id]).map((survey) => (
                        <button
                            key={survey.id}
                            onClick={() => {
                                setSurveyData(prev => ({ ...prev, survey_id: survey.id }));
                                setView('survey');
                            }}
                            className="p-6 rounded-2xl border-2 border-slate-50 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all text-left flex items-center justify-between group"
                        >
                            <div>
                                <h3 className="font-black text-slate-800 dark:text-slate-100 text-lg">{survey.title}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">{survey.description}</p>
                            </div>
                            <ChevronRight className="text-slate-300 group-hover:text-amber-500 transition-colors" />
                        </button>
                    ))}
                </div>

                <button onClick={() => setView('dashboard')}
                    className="w-full mt-8 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                    Volver al Dashboard
                </button>
            </div>
        );
    }

    const currentSurvey = availableSurveys.find(s => s.id === surveyData.survey_id);

    return (
        <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 max-w-2xl mx-auto">
            <div className="text-center mb-10">
                <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 fill-current" />
                </div>
                <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">Encuesta de Satisfacción</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Sesión: {currentSurvey?.title || surveyData.survey_id}</p>
            </div>

            <div className="space-y-8">
                {[
                    { id: 'rating_content', label: 'Claridad y utilidad del contenido' },
                    { id: 'rating_instructor', label: 'Dominio y explicación del instructor' },
                    { id: 'rating_practical', label: 'Calidad de los ejercicios prácticos' }
                ].map((field) => (
                    <div key={field.id} className="space-y-3">
                        <label className="block text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">{field.label}</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setSurveyData(prev => ({ ...prev, [field.id]: star }))}
                                    className={`p-2 transition-all ${surveyData[field.id] >= star ? 'text-amber-400 scale-110' : 'text-slate-200 dark:text-slate-700 hover:text-amber-200'}`}
                                >
                                    <Star className={`w-8 h-8 ${surveyData[field.id] >= star ? 'fill-current' : ''}`} />
                                </button>
                            ))}
                        </div>
                    </div>
                ))}

                <div className="space-y-3">
                    <label className="block text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest" htmlFor="comments">Comentarios adicionales</label>
                    <textarea
                        id="comments"
                        rows="3"
                        placeholder="¿Qué te pareció la sesión?"
                        className="w-full p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 focus:border-indigo-500 outline-none transition-all dark:text-slate-100"
                        value={surveyData.comments}
                        onChange={(e) => setSurveyData(prev => ({ ...prev, comments: e.target.value }))}
                    ></textarea>
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        onClick={() => setView('dashboard')}
                        className="flex-1 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSurveySubmit}
                        disabled={surveySubmitting}
                        className="flex-[2] bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                        {surveySubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : 'Enviar Comentarios'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SurveyManager;
