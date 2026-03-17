import React from 'react';
import { Loader2, Timer, CheckCircle, ArrowRight } from 'lucide-react';

const QuizView = ({ questionsLoading, testType, currentQuestion, questions, answers, handleAnswer, isSaving }) => {
    if (questionsLoading) return (
        <div className="flex flex-col items-center justify-center p-20 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800">
            <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mb-4" />
            <p className="text-slate-500 font-medium">Cargando preguntas de {testType}...</p>
        </div>
    );

    if (questions.length === 0) return null;

    const currentQ = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800">
                <div className="h-full bg-indigo-600 transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
            </div>
            
            <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                    <span className="px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full text-xs font-bold uppercase tracking-widest">
                        {testType} - Pregunta {currentQuestion + 1}/{questions.length}
                    </span>
                    <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                        <Timer className="w-4 h-4" />
                        <span>Progreso: {Math.round(progress)}%</span>
                    </div>
                </div>

                <h2 className="text-2xl font-bold mb-8 text-slate-800 dark:text-slate-100 leading-tight">
                    {currentQ.question}
                </h2>

                <div className="grid gap-4">
                    {currentQ.options.map((option, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleAnswer(idx)}
                            disabled={isSaving}
                            className="group flex items-center justify-between p-5 rounded-2xl border-2 border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-indigo-500 hover:bg-white dark:hover:bg-slate-800 transition-all text-left disabled:opacity-50"
                        >
                            <span className="text-lg font-medium text-slate-700 dark:text-slate-300 group-hover:text-indigo-700 dark:group-hover:text-indigo-400">
                                {option}
                            </span>
                            <div className="w-6 h-6 rounded-full border-2 border-slate-200 dark:border-slate-700 group-hover:border-indigo-500 flex items-center justify-center transition-colors">
                                <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="px-8 py-4 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-400 italic">Tus respuestas se guardan automáticamente al finalizar el test.</p>
                {isSaving && <Loader2 className="animate-spin h-5 w-5 text-indigo-600" />}
            </div>
        </div>
    );
};

export default QuizView;
