import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from './supabaseClient';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import {
    ChevronRight,
    CheckCircle2,
    Trophy,
    Users,
    BarChart3,
    ClipboardCheck,
    User,
    AlertCircle,
    RefreshCw,
    Loader2,
    Power,
    Star,
    MessageSquare
} from 'lucide-react';

const QUESTIONS_TDD = [
    {
        id: 1,
        question: "¿Cuál es el propósito fundamental del paso 'Red' en el ciclo TDD?",
        options: [
            "Identificar errores de sintaxis en código antiguo.",
            "Definir el comportamiento esperado mediante una prueba que falle.",
            "Optimizar el rendimiento del servidor.",
            "Asegurar que el entorno de CI/CD funcione."
        ],
        correct: 1
    },
    {
        id: 2,
        question: "En TDD, ¿qué se debe hacer inmediatamente después de que una prueba pase (Green)?",
        options: [
            "Escribir la siguiente prueba fallida.",
            "Pasar a producción el código.",
            "Refactorizar el código para mejorar su estructura.",
            "Eliminar la prueba para ahorrar espacio."
        ],
        correct: 2
    },
    {
        id: 3,
        question: "¿Cuál es la característica principal de una Prueba Unitaria efectiva?",
        options: [
            "Debe probar la integración con la base de datos real.",
            "Debe ser rápida, aislada y probar una única unidad lógica.",
            "Debe ser escrita únicamente por el equipo de QA.",
            "Debe ejecutarse solo una vez al mes."
        ],
        correct: 1
    },
    {
        id: 4,
        question: "En el contexto de pruebas, ¿qué diferencia a un 'Mock' de un 'Stub'?",
        options: [
            "Los Stubs son para bases de datos únicamente.",
            "Los Mocks verifican interacciones; los Stubs solo proveen datos.",
            "No hay diferencia técnica.",
            "Los Mocks son más lentos que los Stubs."
        ],
        correct: 1
    },
    {
        id: 5,
        question: "Al usar IA en TDD, ¿cuál es el flujo recomendado?",
        options: [
            "Que la IA escriba todo el proyecto sin revisión.",
            "Escribir la prueba manualmente y pedir a la IA la implementación.",
            "Generar el código y luego pedirle a la IA que invente las pruebas.",
            "No usar IA bajo ninguna circunstancia."
        ],
        correct: 1
    }
];

const QUESTIONS_BDD = [
    {
        id: 1,
        question: "¿Qué significan las siglas BDD en el desarrollo de software?",
        options: [
            "Bug-Driven Development",
            "Behavior-Driven Development",
            "Backend-Driven Design",
            "Basic Data Deployment"
        ],
        correct: 1
    },
    {
        id: 2,
        question: "¿Cuál es el propósito principal del formato Given-When-Then?",
        options: [
            "Crear esquemas de bases de datos relacionales.",
            "Describir el comportamiento de un sistema de forma comprensible para negocio y desarrollo.",
            "Optimizar la velocidad de ejecución de las pruebas unitarias.",
            "Definir la arquitectura de microservicios resolviendo dependencias."
        ],
        correct: 1
    },
    {
        id: 3,
        question: "En Gherkin, ¿para qué sirve la palabra clave 'Given' (Dado)?",
        options: [
            "Para describir la acción que realiza el usuario.",
            "Para definir el resultado que se espera tras la acción.",
            "Para establecer el estado inicial o contexto antes de la acción.",
            "Para conectar múltiples validaciones en una aserción condicional."
        ],
        correct: 2
    },
    {
        id: 4,
        question: "¿Qué relación existe entre TDD y BDD?",
        options: [
            "BDD y TDD son excluyentes; usar uno prohíbe el uso del otro.",
            "BDD es una evolución del TDD enfocada en el comportamiento y comunicación del sistema.",
            "TDD es para front-end y BDD es estrictamente para back-end.",
            "Ninguna, fueron creadas para propósitos completamente separados."
        ],
        correct: 1
    },
    {
        id: 5,
        question: "¿Cuál de estas herramientas es comúnmente utilizada para implementar pruebas BDD?",
        options: [
            "Postman",
            "Sublime Text",
            "Docker",
            "Cucumber"
        ],
        correct: 3
    }
];

const AVAILABLE_SURVEYS = [
    { id: 'TDD_SESSION', title: 'Sesión TDD', description: 'Evaluación de la capacitación teórico-práctica de Test Driven Development.' },
    { id: 'BDD_SESSION', title: 'Sesión BDD', description: 'Evaluación de la capacitación teórico-práctica de Behavior Driven Development.' }
];

export default function App() {
    const [user, setUser] = useState(null);
    const [view, setView] = useState('login');
    const [studentName, setStudentName] = useState('');
    const [email, setEmail] = useState(''); // Estado para el nuevo campo de correo
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [testType, setTestType] = useState('TDD');
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [finalScore, setFinalScore] = useState(0);
    const [allResults, setAllResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false); // Nuevo estado para controlar si el usuario logueado es Administrador
    const [analyticsFilter, setAnalyticsFilter] = useState('TODO'); // Filtro para gráficas (HU-8)
    const [testConfig, setTestConfig] = useState({ TDD: true, BDD: true }); // Estado de configuración de la HU-9
    const [surveyData, setSurveyData] = useState({ survey_id: '', rating_content: 0, rating_instructor: 0, rating_practical: 0, comments: '' });
    const [surveySubmitting, setSurveySubmitting] = useState(false);

    const QUESTIONS = testType === 'TDD' ? QUESTIONS_TDD : QUESTIONS_BDD;

    // --- AUTH ---
    useEffect(() => {
        const initAuth = async () => {
            if (!supabase) {
                setError("Faltan variables de entorno de Supabase (VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY) en el entorno de build.");
                setLoading(false);
                return;
            }
            try {
                const { data, error } = await supabase.auth.signInAnonymously();
                if (error) throw error;
                setUser(data.user);
            } catch (err) {
                console.error("Auth error:", err);
                setError(`Error de autenticación: ${err.message || 'Error desconocido'}`);
            } finally {
                setLoading(false);
            }
        };
        initAuth();

        if (supabase) {
            const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
                setUser(session?.user ?? null);
                setLoading(false);
            });

            return () => subscription.unsubscribe();
        }
    }, []);

    // --- FETCH DATA (Realtime y al cambiar de vista) ---
    useEffect(() => {
        if (!user || !supabase) return;

        const fetchConfig = async () => {
            try {
                const { data, error: confError } = await supabase.from('test_config').select('*');
                if (confError) throw confError;
                if (data) {
                    const newConfig = { TDD: true, BDD: true };
                    data.forEach(item => {
                        newConfig[item.test_id] = item.is_active;
                    });
                    setTestConfig(newConfig);
                }
            } catch (err) {
                console.error("Config fetch error:", err);
            }
        };

        const fetchInitialData = async () => {
            if (!isLoggedIn) return;
            // Si el usuario es administrador, traemos todos los resultados.
            // Si no, filtramos por su propio correo
            let query = supabase.from('results').select('*');
            
            if (!isAdmin) {
                query = query.eq('email', email);
            }

            const { data, error } = await query.order('timestamp', { ascending: false });

            if (error) {
                console.error("Error fetching data:", error);
            } else if (data) {
                setAllResults(data);
            }
        };

        // Bajamos datos fresquitos
        fetchConfig();
        if (isLoggedIn && view === 'dashboard') {
            fetchInitialData();
        }

        const channelResults = supabase
            .channel('public:results')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'results' }, payload => {
                if (isLoggedIn && view === 'dashboard') fetchInitialData();
            }).subscribe();
            
        const channelConfig = supabase
            .channel('public:test_config')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'test_config' }, payload => {
                fetchConfig(); 
            }).subscribe();

        return () => {
            supabase.removeChannel(channelResults);
            supabase.removeChannel(channelConfig);
        };
    }, [user, isLoggedIn, email, isAdmin, view]);

    const handleLogin = async () => {
        if (studentName.trim().length < 3) {
            setError("Por favor, ingresa tu nombre completo (mínimo 3 caracteres).");
            return;
        }

        if (!email.trim()) {
            setError("El correo electrónico es un campo obligatorio");
            return;
        }

        // Expresión regular para validar formato de correo electrónico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Por favor, ingresa un formato de correo electrónico válido (ej. nombre@dominio.com)");
            return;
        }

        setIsSaving(true);
        setError(null);

        try {
            // Verificar si el correo pertenece a un administrador consultando la tabla de Supabase
            const { data, error: adminError } = await supabase
                .from('admin_users')
                .select('email')
                .eq('email', email)
                .single();

            // Si hay un error distinto a que "no se encontró ninguna fila" (ej. tabla no existe, sin conexión)
            if (adminError && adminError.code !== 'PGRST116') {
                console.warn("No se pudo verificar rol de admin:", adminError.message);
            }

            // Si data existe, es administrador
            if (data) {
                setIsAdmin(true);
            } else {
                setIsAdmin(false);
            }

            setIsLoggedIn(true);
            setView('dashboard');
        } catch (err) {
            console.error("Login verification error:", err);
            setError("Ocurrió un error al iniciar sesión. Por favor intenta de nuevo.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleStartTest = (type) => {
        setTestType(type);
        setCurrentQuestion(0);
        setAnswers([]);
        setError(null);
        setView('quiz');
    };

    const handleAnswer = (optionIndex) => {
        const newAnswers = [...answers, optionIndex];
        setAnswers(newAnswers);

        if (currentQuestion < QUESTIONS.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            processFinish(newAnswers);
        }
    };

    const processFinish = async (finalAnswers) => {
        setIsSaving(true);
        const correctCount = finalAnswers.reduce((acc, ans, idx) => {
            return ans === QUESTIONS[idx].correct ? acc + 1 : acc;
        }, 0);

        const scorePercentage = (correctCount / QUESTIONS.length) * 100;
        setFinalScore(scorePercentage);

        if (user) {
            if (!supabase) return;
            try {
                const { error } = await supabase.from('results').insert([{
                    studentName,
                    email, // Guardamos también el correo en la base de datos (asegúrate de que la columna exista o usar metadata si es necesario)
                    score: scorePercentage,
                    correctAnswers: correctCount,
                    totalQuestions: QUESTIONS.length,
                    testType: testType,
                    uid: user.id,
                    answers: finalAnswers
                }]);

                if (error) throw error;
                setView('result');
            } catch (err) {
                console.error("Save error:", err);
                setError("Error al guardar tus resultados. Intenta de nuevo.");
            } finally {
                setIsSaving(false);
            }
        }
    };
    const handleSurveySubmit = async () => {
        if (surveyData.rating_content === 0 || surveyData.rating_instructor === 0 || surveyData.rating_practical === 0) {
            setError("Por favor, califica todos los aspectos antes de enviar.");
            return;
        }

        setSurveySubmitting(true);
        try {
            const { error: surveyError } = await supabase.from('survey_responses').insert([{
                user_email: email,
                student_name: studentName,
                survey_id: surveyData.survey_id,
                rating_content: surveyData.rating_content,
                rating_instructor: surveyData.rating_instructor,
                rating_practical: surveyData.rating_practical,
                comments: surveyData.comments
            }]);

            if (surveyError) throw surveyError;
            
            // Limpiar y volver al dashboard
            setSurveyData({ survey_id: '', rating_content: 0, rating_instructor: 0, rating_practical: 0, comments: '' });
            setView('dashboard');
            setError(null);
            alert("¡Gracias por tu feedback! Nos ayuda mucho a mejorar.");
        } catch (err) {
            console.error("Survey error:", err);
            setError("No se pudo enviar la encuesta. Intenta de nuevo.");
        } finally {
            setSurveySubmitting(false);
        }
    };

    const stats = useMemo(() => {
        if (allResults.length === 0) return { avg: 0, total: 0 };
        const sum = allResults.reduce((acc, curr) => acc + (curr.score || 0), 0);
        return {
            avg: (sum / allResults.length).toFixed(1),
            total: allResults.length
        };
    }, [allResults]);

    // --- ANALYTICS PROCESSING (HU-8) ---
    const filteredAnalyticsData = useMemo(() => {
        if (analyticsFilter === 'TODO') return allResults;
        return allResults.filter(item => item.testType === analyticsFilter || (!item.testType && analyticsFilter === 'TDD'));
    }, [allResults, analyticsFilter]);

    const passRateData = useMemo(() => {
        let ranges = {
            '0-39%': 0,
            '40-69%': 0,
            '70-89%': 0,
            '90-100%': 0
        };

        filteredAnalyticsData.forEach(res => {
            const s = res.score;
            if (s < 40) ranges['0-39%']++;
            else if (s < 70) ranges['40-69%']++;
            else if (s < 90) ranges['70-89%']++;
            else ranges['90-100%']++;
        });

        // Solo retornar los rangos que tienen al menos 1 resultado para no dibujar porciones vacías
        return Object.keys(ranges)
            .filter(key => ranges[key] > 0)
            .map(key => ({ name: key, value: ranges[key] }));
    }, [filteredAnalyticsData]);

    const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#6366f1']; // Rojo, Naranja, Verde, Índigo (para los 4 rangos)

    const trendsData = useMemo(() => {
        const questionsStats = [
            { name: 'P1', correct: 0, total: 0 },
            { name: 'P2', correct: 0, total: 0 },
            { name: 'P3', correct: 0, total: 0 },
            { name: 'P4', correct: 0, total: 0 },
            { name: 'P5', correct: 0, total: 0 },
        ];

        filteredAnalyticsData.forEach(res => {
            if (res.answers) {
                let parsedAnswers = [];
                try {
                    parsedAnswers = typeof res.answers === 'string' ? JSON.parse(res.answers) : res.answers;
                } catch (e) {
                    return;
                }
                
                const refQuestions = res.testType === 'BDD' ? QUESTIONS_BDD : QUESTIONS_TDD;
                
                parsedAnswers.forEach((ans, idx) => {
                    if (idx < 5) {
                        questionsStats[idx].total++;
                        if (ans === refQuestions[idx].correct) {
                            questionsStats[idx].correct++;
                        }
                    }
                });
            }
        });

        // Convertir a porcentajes para el gráfico
        return questionsStats.map(stat => ({
            name: stat.name,
            aciertos: stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0,
            total_intentos: stat.total
        }));
    }, [filteredAnalyticsData]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
            <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mb-4" />
            <p className="text-slate-500 font-medium">Iniciando sesión segura...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8">
            <header className="max-w-4xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div onClick={() => isLoggedIn && setView('dashboard')} className={`cursor-pointer ${!isLoggedIn ? 'opacity-90' : 'hover:opacity-80'}`}>
                    <h1 className="text-2xl font-bold text-indigo-700 flex items-center gap-2">
                        <ClipboardCheck className="w-8 h-8" />
                        Test Mastery Platform
                        {isAdmin && <span className="text-[10px] bg-red-100 text-red-700 px-2 py-1 rounded-full uppercase tracking-widest ml-2 align-middle">Admin</span>}
                    </h1>
                    <p className="text-slate-500 text-sm">Panel de Evaluación de Ingeniería</p>
                </div>
                {isLoggedIn && (
                    <nav className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
                        <button onClick={() => setView('dashboard')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${view === 'dashboard' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            Dashboard
                        </button>
                        <button onClick={() => handleStartTest('TDD')}
                            disabled={!isAdmin && !testConfig['TDD']}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${(view === 'quiz' || view === 'result') && testType === 'TDD' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'} disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400`}
                        >
                            {(!isAdmin && !testConfig['TDD']) ? 'TDD (Cerrado)' : 'Test TDD'}
                        </button>
                        <button onClick={() => handleStartTest('BDD')}
                            disabled={!isAdmin && !testConfig['BDD']}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${(view === 'quiz' || view === 'result') && testType === 'BDD' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'} disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400`}
                        >
                            {(!isAdmin && !testConfig['BDD']) ? 'BDD (Cerrado)' : 'Test BDD'}
                        </button>
                    </nav>
                )}
            </header>

            <main className="max-w-4xl mx-auto">
                {error && (
                    <div
                        className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                {view === 'login' && (
                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 max-w-md mx-auto text-center">
                        <div
                            className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <User className="w-8 h-8" />
                        </div>
                        <h2 className="text-xl font-bold mb-2">Ingresar a la Plataforma</h2>
                        <p className="text-slate-500 mb-6 text-sm">Completa tus datos para acceder a tus pruebas y a tu Dashboard.</p>
                        
                        <div className="space-y-4 mb-6 text-left">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1 ml-1" htmlFor="studentName">Nombre completo</label>
                                <input id="studentName" type="text" placeholder="Ej: Juan Pérez"
                                    className="w-full p-4 rounded-xl border-2 border-slate-100 focus:border-indigo-500 outline-none transition-all text-md"
                                    value={studentName} onChange={(e) => { setStudentName(e.target.value); setError(null); }}
                                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1 ml-1" htmlFor="email">Correo electrónico</label>
                                <input id="email" type="email" placeholder="Ej: jperez@empresa.com"
                                    className="w-full p-4 rounded-xl border-2 border-slate-100 focus:border-indigo-500 outline-none transition-all text-md"
                                    value={email} onChange={(e) => { setEmail(e.target.value); setError(null); }}
                                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                                />
                            </div>
                        </div>

                        <button onClick={handleLogin} disabled={isSaving}
                            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200">
                            {isSaving ?
                                <Loader2 className="animate-spin w-5 h-5" /> : 'Iniciar Sesión'}
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {view === 'quiz' && (
                    <div className="bg-white p-6 md:p-10 rounded-2xl shadow-xl border border-slate-100">
                        <div className="flex justify-between items-center mb-8">
                            <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">
                                Pregunta {currentQuestion + 1} / {QUESTIONS.length}
                            </span>
                            <span className="text-xs font-black text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-widest">
                                Test: {testType}
                            </span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-10 mt-[-1rem]">
                            <div className="h-full bg-indigo-600 transition-all duration-500" style={{
                                width: `${((currentQuestion +
                                    1) / QUESTIONS.length) * 100}%`
                            }}></div>
                        </div>

                        <h2 className="text-2xl font-bold mb-10 leading-tight text-slate-800">
                            {QUESTIONS[currentQuestion].question}
                        </h2>

                        <div className="space-y-4">
                            {QUESTIONS[currentQuestion].options.map((option, idx) => (
                                <button key={idx} disabled={isSaving} onClick={() => handleAnswer(idx)}
                                    className="w-full text-left p-5 rounded-2xl border-2 border-slate-50 hover:border-indigo-400
              hover:bg-indigo-50 transition-all group flex items-start gap-4 disabled:opacity-50"
                                >
                                    <span
                                        className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center font-black group-hover:bg-indigo-600 group-hover:text-white shrink-0 transition-colors">
                                        {String.fromCharCode(65 + idx)}
                                    </span>
                                    <span
                                        className="text-lg font-medium text-slate-700 group-hover:text-indigo-900 pt-1 leading-snug">{option}</span>
                                </button>
                            ))}
                        </div>
                        {isSaving && (
                            <div className="mt-8 flex items-center justify-center gap-3 text-indigo-600 font-bold">
                                <Loader2 className="animate-spin w-5 h-5" />
                                Guardando respuestas...
                            </div>
                        )}
                    </div>
                )}

                {view === 'result' && (
                    <div
                        className="bg-white p-12 rounded-3xl shadow-2xl border border-slate-100 text-center animate-in zoom-in-95 duration-300">
                        <div
                            className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <Trophy className="w-12 h-12" />
                        </div>
                        <h2 className="text-3xl font-black mb-2 text-slate-900">¡Test de {testType} Finalizado!</h2>
                        <p className="text-slate-500 mb-10 text-lg font-medium">Buen trabajo, <span
                            className="text-indigo-600">{studentName}</span>. Hemos registrado tu progreso.</p>

                        <div className="inline-block bg-slate-50 p-8 rounded-3xl border-2 border-slate-100 mb-10 min-w-[200px]">
                            <span className="block text-xs text-slate-400 uppercase font-black mb-2 tracking-tighter">Puntaje
                                Obtenido</span>
                            <span className={`text-6xl font-black ${finalScore >= 70 ? 'text-green-600' : 'text-orange-500'}`}>
                                {Math.round(finalScore)}%
                            </span>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 justify-center">
                            <button onClick={() => setView('dashboard')}
                                className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all
              flex items-center justify-center gap-2 shadow-xl shadow-indigo-100"
                            >
                                Ver Dashboard Global
                                <BarChart3 className="w-5 h-5" />
                            </button>
                            <button onClick={() => {
                                setSurveyData(prev => ({ ...prev, survey_id: `${testType}_SESSION` }));
                                setView('survey');
                            }}
                                className="bg-amber-50 text-amber-700 px-10 py-4 rounded-2xl font-bold hover:bg-amber-100 transition-all
              flex items-center justify-center gap-2 border-2 border-amber-200"
                            >
                                <MessageSquare className="w-5 h-5" />
                                Danos tu Opinión
                            </button>
                            <button onClick={() => {
                                setIsLoggedIn(false);
                                setStudentName('');
                                setEmail(''); // Limpiamos el correo al cerrar sesión
                                setIsAdmin(false); // Reseteamos el estado de admin
                                setAllResults([]);
                                setView('login');
                            }}
                                className="text-slate-500 px-10 py-4 rounded-2xl font-bold hover:bg-slate-100 transition-all"
                            >
                                Cerrar sesión
                            </button>
                        </div>
                    </div>
                )}

                {view === 'survey_list' && (
                    <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-slate-100 max-w-2xl mx-auto">
                        <div className="text-center mb-10">
                            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Star className="w-8 h-8 fill-current" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-800">Encuestas Disponibles</h2>
                            <p className="text-slate-500 font-medium">Selecciona la sesión que deseas calificar</p>
                        </div>

                        <div className="grid gap-4">
                            {AVAILABLE_SURVEYS.map((survey) => (
                                <button
                                    key={survey.id}
                                    onClick={() => {
                                        setSurveyData(prev => ({ ...prev, survey_id: survey.id }));
                                        setView('survey');
                                    }}
                                    className="p-6 rounded-2xl border-2 border-slate-50 hover:border-amber-400 hover:bg-amber-50 transition-all text-left flex items-center justify-between group"
                                >
                                    <div>
                                        <h3 className="font-black text-slate-800 text-lg">{survey.title}</h3>
                                        <p className="text-sm text-slate-500 font-medium mt-1">{survey.description}</p>
                                    </div>
                                    <ChevronRight className="text-slate-300 group-hover:text-amber-500 transition-colors" />
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setView('dashboard')}
                            className="w-full mt-8 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all"
                        >
                            Volver al Dashboard
                        </button>
                    </div>
                )}

                {view === 'survey' && (
                    <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-slate-100 max-w-2xl mx-auto">
                        <div className="text-center mb-10">
                            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Star className="w-8 h-8 fill-current" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-800">Encuesta de Satisfacción</h2>
                            <p className="text-slate-500 font-medium">Sesión: {AVAILABLE_SURVEYS.find(s => s.id === surveyData.survey_id)?.title || surveyData.survey_id}</p>
                        </div>

                        <div className="space-y-8">
                            {[
                                { id: 'rating_content', label: 'Claridad y utilidad del contenido' },
                                { id: 'rating_instructor', label: 'Dominio y explicación del instructor' },
                                { id: 'rating_practical', label: 'Calidad de los ejercicios prácticos' }
                            ].map((field) => (
                                <div key={field.id} className="space-y-3">
                                    <label className="block text-sm font-black text-slate-700 uppercase tracking-widest">{field.label}</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                onClick={() => setSurveyData(prev => ({ ...prev, [field.id]: star }))}
                                                className={`p-2 transition-all ${surveyData[field.id] >= star ? 'text-amber-400 scale-110' : 'text-slate-200 hover:text-amber-200'}`}
                                            >
                                                <Star className={`w-8 h-8 ${surveyData[field.id] >= star ? 'fill-current' : ''}`} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            <div className="space-y-3">
                                <label className="block text-sm font-black text-slate-700 uppercase tracking-widest" htmlFor="comments">Comentarios adicionales</label>
                                <textarea
                                    id="comments"
                                    rows="3"
                                    placeholder="¿Qué te pareció la sesión? ¿Qué podríamos mejorar?"
                                    className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none transition-all"
                                    value={surveyData.comments}
                                    onChange={(e) => setSurveyData(prev => ({ ...prev, comments: e.target.value }))}
                                ></textarea>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={() => setView('dashboard')}
                                    className="flex-1 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSurveySubmit}
                                    disabled={surveySubmitting}
                                    className="flex-[2] bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2"
                                >
                                    {surveySubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : 'Enviar Comentarios'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {view === 'dashboard' && (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-6">
                                <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
                                    <Users className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-black uppercase tracking-widest">Tests Completados</p>
                                    <p className="text-3xl font-black text-slate-800">{stats.total}</p>
                                </div>
                            </div>
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-6">
                                <div className="p-4 bg-green-50 text-green-600 rounded-2xl">
                                    <Trophy className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-black uppercase tracking-widest">Promedio</p>
                                    <p className="text-3xl font-black text-slate-800">{stats.avg}%</p>
                                </div>
                            </div>
                            <div onClick={() => setView('survey_list')} className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-3xl shadow-sm border border-amber-100 flex items-center gap-6 cursor-pointer hover:shadow-md transition-all group">
                                <div className="p-4 bg-white text-amber-500 rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                                    <Star className="w-8 h-8 fill-current" />
                                </div>
                                <div>
                                    <p className="text-xs text-amber-600 font-black uppercase tracking-widest">Feedback</p>
                                    <p className="text-sm font-bold text-amber-800">Danos tu opinión</p>
                                </div>
                            </div>
                        </div>

                        {isAdmin && (
                            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-8 p-8 flex flex-col md:flex-row items-center gap-6">
                                <div className="p-4 bg-slate-50 text-slate-600 rounded-2xl">
                                    <Power className="w-8 h-8" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-black text-xl text-slate-800">Control de Evaluaciones</h3>
                                    <p className="text-sm font-medium text-slate-500 mt-1">Habilita o deshabilita los tests para todos los estudiantes.</p>
                                </div>
                                <div className="flex gap-4">
                                    {['TDD', 'BDD'].map(testId => {
                                        const isActive = testConfig[testId];
                                        return (
                                            <button 
                                                key={`toggle-${testId}`}
                                                onClick={async () => {
                                                    const newValue = !isActive;
                                                    // Actualización optimista local
                                                    setTestConfig(prev => ({...prev, [testId]: newValue}));
                                                    try {
                                                        const { error: updateError } = await supabase
                                                            .from('test_config')
                                                            .update({ is_active: newValue })
                                                            .eq('test_id', testId);
                                                        
                                                        if (updateError) {
                                                            // Revertir si falla
                                                            setTestConfig(prev => ({...prev, [testId]: isActive}));
                                                            setError(`No se pudo actualizar la configuración en DB: ${updateError.message}`);
                                                        }
                                                    } catch (err) {
                                                        setTestConfig(prev => ({...prev, [testId]: isActive}));
                                                        setError("Error de conexión al actualizar configuración.");
                                                    }
                                                }}
                                                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all border-2 
                                                    ${isActive ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100' : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'}`}
                                            >
                                                <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                                                {testId} {isActive ? 'ON' : 'OFF'}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden mb-8">
                                <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between md:items-center bg-slate-50/50 gap-4">
                                    <h3 className="font-black text-xl text-slate-800 flex items-center gap-2">
                                        <BarChart3 className="text-indigo-600" /> Tendencias y Desempeño
                                    </h3>
                                    <div className="flex bg-slate-200/50 p-1 rounded-2xl">
                                        {['TODO', 'TDD', 'BDD'].map(f => (
                                            <button 
                                                key={f}
                                                onClick={() => setAnalyticsFilter(f)}
                                                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${analyticsFilter === f ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-slate-500 hover:text-slate-700'}`}
                                            >
                                                {f === 'TODO' ? 'Todos' : f}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="h-64 flex flex-col items-center">
                                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Distribución de Puntajes</h4>
                                        <ResponsiveContainer width={250} height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={passRateData}
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {passRateData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
                                            <BarChart data={trendsData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                                                <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                                <Bar dataKey="aciertos" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} name="% Aciertos" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>

                        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
                            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <h3 className="font-black text-xl text-slate-800 flex items-center gap-2">
                                    <BarChart3 className="text-indigo-600" /> Historial de Resultados
                                </h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-slate-400 text-xs uppercase font-black tracking-widest">
                                            <th className="px-8 py-6">Ingeniero</th>
                                            <th className="px-8 py-6">Examen</th>
                                            <th className="px-8 py-6">Puntaje</th>
                                            <th className="px-8 py-6">Fecha</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {allResults.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="px-8 py-20 text-center">
                                                    <div className="flex flex-col items-center opacity-30">
                                                        <ClipboardCheck className="w-16 h-16 mb-4" />
                                                        <p className="text-lg font-bold uppercase tracking-tighter">Esperando el primer envío...</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            allResults.map((res) => (
                                                <tr key={res.id} className="hover:bg-slate-50/80 transition-colors">
                                                    <td className="px-8 py-6">
                                                        <div className="font-bold text-slate-800">{res.studentName}</div>
                                                        <div className="text-[10px] text-slate-400 font-mono uppercase">{res.id.substring(0, 8)}</div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <span className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border
                                                    ${res.testType === 'BDD' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                                                            {res.testType || 'TDD'}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-end gap-1">
                                                            <span className="text-2xl font-black text-slate-800">{Math.round(res.score)}%</span>
                                                            <span
                                                                className="text-xs text-slate-400 mb-1 font-bold">({res.correctAnswers}/{res.totalQuestions})</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 text-sm font-medium text-slate-500">
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
                )}
            </main>

            <footer
                className="max-w-4xl mx-auto mt-16 pt-8 border-t border-slate-200 flex justify-between items-center text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                <span>Test Mastery Platform</span>
                <span>App ID: Supabase-v1</span>
            </footer>
        </div>
    );
}
