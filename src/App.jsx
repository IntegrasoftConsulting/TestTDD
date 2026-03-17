import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from './supabaseClient';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import {
    ChevronRight,
    ChevronLeft,
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
    MessageSquare,
    Sun,
    Moon,
    Plus,
    Trash2,
    Save,
    Edit2
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
        question: "¿Qué indica una 'Cobertura de Código' (Code Coverage) del 100%?",
        options: [
            "Que el código no tiene absolutamente ningún bug.",
            "Que todas las líneas de código han sido ejecutadas al menos una vez por las pruebas.",
            "Que el rendimiento del software es óptimo.",
            "Que ya no es necesario realizar pruebas de integración."
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
    const [testConfig, setTestConfig] = useState({ TDD: true, BDD: true }); // Estado de configuración de la HU-9 (mapa booleano para toggle admin)
    const [testTypes, setTestTypes] = useState([
        { test_id: 'TDD', display_name: 'Test TDD', description: 'Test Driven Development', order_index: 1, is_active: true },
        { test_id: 'BDD', display_name: 'Test BDD', description: 'Behavior Driven Development', order_index: 2, is_active: true }
    ]); // HU-15: Lista dinámica de tipos de test desde Supabase
    const [surveyConfig, setSurveyConfig] = useState({ TDD_SESSION: true, BDD_SESSION: true }); // Estado de configuración de la HU-11
    const [surveyData, setSurveyData] = useState({ survey_id: '', rating_content: 0, rating_instructor: 0, rating_practical: 0, comments: '' });
    const [surveySubmitting, setSurveySubmitting] = useState(false);
    const [surveyResults, setSurveyResults] = useState([]); // HU-12: Resultados para analíticas admin
    const [adminAnalysisTab, setAdminAnalysisTab] = useState('tests'); // HU-12: Tab de analíticas (tests/surveys)
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('mastery_dark_mode');
        return saved ? JSON.parse(saved) : false;
    }); // HU-13: Modo Oscuro
    const [questions, setQuestions] = useState([]); // HU-14: Preguntas cargadas desde Supabase
    const [questionsLoading, setQuestionsLoading] = useState(false); // HU-14: Spinner de carga de preguntas
    const [questionsCache, setQuestionsCache] = useState({}); // HU-18: Cache de preguntas por test_type para analítica

    // --- HU-20: ESTADOS DE GRUPOS ---
    const [groups, setGroups] = useState([]);                   // Lista de grupos (admin)
    const [selectedGroupId, setSelectedGroupId] = useState(null); // Grupo en detalle (admin)
    const [groupTestConfig, setGroupTestConfig] = useState({});   // { test_id: is_active } del grupo seleccionado
    const [groupMembers, setGroupMembers] = useState([]);          // Miembros del grupo seleccionado
    const [groupAnalyticsFilter, setGroupAnalyticsFilter] = useState('ALL'); // 'ALL' | group_id
    const [newGroupModal, setNewGroupModal] = useState(false);    // Mostrar modal de creación
    const [newGroupForm, setNewGroupForm] = useState({ name: '', description: '' });
    const [userGroupId, setUserGroupId] = useState(null);         // Grupo del estudiante logueado
    const [groupView, setGroupView] = useState('list');            // 'list' | 'detail'
    const [isGroupsLoading, setIsGroupsLoading] = useState(false);

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

    // --- DARK MODE SYNC ---
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('mastery_dark_mode', JSON.stringify(darkMode));
    }, [darkMode]);

    // --- FETCH DATA (Realtime y al cambiar de vista) ---
    useEffect(() => {
        if (!user || !supabase) return;

        const fetchConfig = async () => {
            // Fallback por defecto (HU-15: garantiza funcionamiento si Supabase falla)
            const DEFAULT_TEST_TYPES = [
                { test_id: 'TDD', display_name: 'Test TDD', description: 'Test Driven Development', order_index: 1, is_active: true },
                { test_id: 'BDD', display_name: 'Test BDD', description: 'Behavior Driven Development', order_index: 2, is_active: true }
            ];
            try {
                const { data, error: confError } = await supabase
                    .from('test_config')
                    .select('test_id, display_name, description, order_index, is_active')
                    .order('order_index', { ascending: true });
                if (confError) throw confError;
                if (data && data.length > 0) {
                    // Construir mapa booleano para compatibilidad con HU-9 (toggle admin)
                    const newConfig = {};
                    data.forEach(item => { newConfig[item.test_id] = item.is_active; });
                    setTestConfig(newConfig);
                    // HU-15: Guardar arreglo completo con metadatos de presentación
                    setTestTypes(data.map(item => ({
                        test_id: item.test_id,
                        display_name: item.display_name || `Test ${item.test_id}`,
                        description: item.description || '',
                        order_index: item.order_index ?? 99,
                        is_active: item.is_active
                    })));
                } else {
                    // Sin datos en BD: usar fallback y registrar advertencia
                    console.warn('[HU-15] Sin tipos de test en BD. Usando fallback local.');
                    setTestTypes(DEFAULT_TEST_TYPES);
                }
            } catch (err) {
                console.error('[HU-15] Error al cargar test_config. Usando fallback local.', err);
                setTestTypes(DEFAULT_TEST_TYPES);
            }
        };
        
        const fetchSurveyConfig = async () => {
            try {
                const { data, error: srvError } = await supabase.from('survey_config').select('*');
                if (srvError) throw srvError;
                if (data) {
                    const newSrvConfig = { TDD_SESSION: true, BDD_SESSION: true };
                    data.forEach(item => {
                        newSrvConfig[item.survey_id] = item.is_active;
                    });
                    setSurveyConfig(newSrvConfig);
                }
            } catch (err) {
                console.error("Survey config fetch error:", err);
            }
        };
        
        const fetchSurveyResults = async () => {
            if (!isAdmin) return;
            try {
                const { data, error: srvResError } = await supabase
                    .from('survey_responses')
                    .select('*')
                    .order('timestamp', { ascending: false });
                if (srvResError) throw srvResError;
                if (data) setSurveyResults(data);
            } catch (err) {
                console.error("Survey results fetch error:", err);
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
        fetchSurveyConfig();
        const fetchGroups = async () => {
            if (!isAdmin) return;
            setIsGroupsLoading(true);
            try {
                // Obtenemos grupos y count de miembros manualmente (o via view si existiera)
                const { data: groupsData, error: gErr } = await supabase
                    .from('groups')
                    .select('*')
                    .order('name');
                
                if (gErr) throw gErr;

                // Para cada grupo, contar miembros
                const groupsWithCounts = await Promise.all((groupsData || []).map(async (g) => {
                    const { count, error: cErr } = await supabase
                        .from('group_members')
                        .select('*', { count: 'exact', head: true })
                        .eq('group_id', g.group_id);
                    return { ...g, memberCount: count || 0 };
                }));

                setGroups(groupsWithCounts);
            } catch (err) {
                console.error("Error fetching groups:", err);
            } finally {
                setIsGroupsLoading(false);
            }
        };

        const fetchGroupDetails = async (groupId) => {
            if (!isAdmin) return;
            try {
                // 1. Config de tests del grupo
                const { data: configData } = await supabase
                    .from('group_test_config')
                    .select('test_id, is_active')
                    .eq('group_id', groupId);
                
                const configMap = {};
                (configData || []).forEach(c => configMap[c.test_id] = c.is_active);
                setGroupTestConfig(configMap);

                // 2. Miembros del grupo
                const { data: membersData } = await supabase
                    .from('group_members')
                    .select('*')
                    .eq('group_id', groupId)
                    .order('email');
                
                setGroupMembers(membersData || []);
            } catch (err) {
                console.error("Error fetching group details:", err);
            }
        };

        useEffect(() => {
            if (selectedGroupId) fetchGroupDetails(selectedGroupId);
        }, [selectedGroupId]);

        if (isLoggedIn && view === 'dashboard') {
            fetchInitialData();
            if (isAdmin) {
                fetchSurveyResults();
                fetchGroups();
                // HU-18: Cargar todas las preguntas para analítica al abrir el dashboard
                (async () => {
                    try {
                        const { data: qData, error: qErr } = await supabase
                            .from('questions')
                            .select('test_type, order_index, correct_option_index, question_text, options')
                            .eq('is_active', true)
                            .order('order_index', { ascending: true });
                        if (!qErr && qData) {
                            // Agrupar por test_type con datos completos para HU-18 y HU-19
                            const cache = {};
                            qData.forEach(q => {
                                if (!cache[q.test_type]) cache[q.test_type] = [];
                                cache[q.test_type].push({
                                    correct: q.correct_option_index,
                                    question_text: q.question_text || '',
                                    options: Array.isArray(q.options) ? q.options : []
                                });
                            });
                            // Fallback: si no hay datos en BD para TDD o BDD, usar constantes locales
                            if (!cache['TDD'] || cache['TDD'].length === 0)
                                cache['TDD'] = QUESTIONS_TDD.map(q => ({ correct: q.correct, question_text: q.question, options: q.options }));
                            if (!cache['BDD'] || cache['BDD'].length === 0)
                                cache['BDD'] = QUESTIONS_BDD.map(q => ({ correct: q.correct, question_text: q.question, options: q.options }));
                            setQuestionsCache(cache);
                        }
                    } catch (err) {
                        console.warn('[HU-18] No se pudo cargar el cache de preguntas para analítica.', err);
                    }
                })();
            }
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

        const channelSurveyConfig = supabase
            .channel('public:survey_config')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'survey_config' }, payload => {
                fetchSurveyConfig(); 
            }).subscribe();

        const channelSurveyResponses = supabase
            .channel('public:survey_responses')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'survey_responses' }, payload => {
                if (isAdmin) fetchSurveyResults();
            }).subscribe();

        // HU-20: Canales para Grupos
        const channelGroups = supabase
            .channel('public:groups')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'groups' }, payload => {
                if (isAdmin) fetchGroups();
            }).subscribe();

        const channelGroupMembers = supabase
            .channel('public:group_members')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'group_members' }, payload => {
                if (isAdmin) {
                    fetchGroups();
                    if (selectedGroupId) fetchGroupDetails(selectedGroupId);
                }
            }).subscribe();

        const channelGroupTestConfig = supabase
            .channel('public:group_test_config')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'group_test_config' }, payload => {
                if (isAdmin && selectedGroupId) fetchGroupDetails(selectedGroupId);
            }).subscribe();

        return () => {
            supabase.removeChannel(channelResults);
            supabase.removeChannel(channelConfig);
            supabase.removeChannel(channelSurveyConfig);
            supabase.removeChannel(channelSurveyResponses);
            supabase.removeChannel(channelGroups);
            supabase.removeChannel(channelGroupMembers);
            supabase.removeChannel(channelGroupTestConfig);
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
                // HU-20: Si no es admin, verificar si pertenece a un grupo
                const { data: memberRow, error: mErr } = await supabase
                    .from('group_members')
                    .select('group_id')
                    .eq('email', email)
                    .maybeSingle();
                
                if (memberRow) {
                    setUserGroupId(memberRow.group_id);
                    // Cargar configuración de tests específica del grupo
                    const { data: groupConfig, error: gcErr } = await supabase
                        .from('group_test_config')
                        .select('test_id, is_active')
                        .eq('group_id', memberRow.group_id);
                    
                    if (!gcErr && groupConfig && groupConfig.length > 0) {
                        // Crear un mapa de override para testTypes
                        const override = {};
                        groupConfig.forEach(c => override[c.test_id] = c.is_active);
                        
                        setTestTypes(prev => prev.map(t => ({
                            ...t,
                            is_active: override[t.test_id] !== undefined ? override[t.test_id] : t.is_active
                        })));

                        // También actualizar testConfig para la nav
                        setTestConfig(prev => {
                            const newConfig = { ...prev };
                            groupConfig.forEach(c => newConfig[c.test_id] = c.is_active);
                            return newConfig;
                        });
                    }
                }
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

    // --- HU-20: FUNCIONES DE GESTIÓN DE GRUPOS ---
    const handleCreateGroup = async () => {
        if (!newGroupForm.name.trim()) return;
        setIsSaving(true);
        try {
            const { data, error } = await supabase
                .from('groups')
                .insert([newGroupForm])
                .select();
            
            if (error) throw error;
            
            setNewGroupForm({ name: '', description: '' });
            setNewGroupModal(false);
            // Refrescar lista de grupos (se podría optimizar agregando al estado local)
            // fetchGroups() está en el useEffect del dashboard, pero aquí estamos en view 'groups'
            // Definiremos una función fetchGroups accesible
        } catch (err) {
            setError(`Error al crear grupo: ${err.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddMember = async (emailToAdd) => {
        if (!selectedGroupId || !emailToAdd) return;
        try {
            const { error } = await supabase
                .from('group_members')
                .insert([{ group_id: selectedGroupId, email: emailToAdd }]);
            
            if (error) throw error;
            // Refrescar detalles para ver el nuevo miembro
            // fetchGroupDetails ya se dispara por el selector
            setSelectedGroupId(prev => {
                const current = prev;
                setSelectedGroupId(null);
                setTimeout(() => setSelectedGroupId(current), 10);
                return prev;
            });
        } catch (err) {
            setError(`Error al agregar miembro: ${err.message}`);
        }
    };

    const handleDeleteMember = async (memberId) => {
        try {
            const { error } = await supabase.from('group_members').delete().eq('id', memberId);
            if (error) throw error;
            setGroupMembers(prev => prev.filter(m => m.id !== memberId));
        } catch (err) {
            setError(`Error al eliminar miembro: ${err.message}`);
        }
    };

    const handleToggleGroupTest = async (testId, currentStatus) => {
        if (!selectedGroupId) return;
        const newStatus = !currentStatus;
        
        // Optimista
        setGroupTestConfig(prev => ({ ...prev, [testId]: newStatus }));

        try {
            const { error } = await supabase
                .from('group_test_config')
                .upsert({ group_id: selectedGroupId, test_id: testId, is_active: newStatus }, { onConflict: 'group_id,test_id' });
            
            if (error) throw error;
        } catch (err) {
            setGroupTestConfig(prev => ({ ...prev, [testId]: currentStatus }));
            setError(`Error al actualizar config de grupo: ${err.message}`);
        }
    };

    // HU-14: Carga preguntas desde Supabase; si falla usa el fallback local
    const handleStartTest = async (type) => {
        setTestType(type);
        setCurrentQuestion(0);
        setAnswers([]);
        setError(null);
        setQuestionsLoading(true);
        setView('quiz');

        const fallback = type === 'TDD' ? QUESTIONS_TDD : QUESTIONS_BDD;

        if (supabase) {
            try {
                const { data, error: qErr } = await supabase
                    .from('questions')
                    .select('order_index, question_text, options, correct_option_index')
                    .eq('test_type', type)
                    .eq('is_active', true)
                    .order('order_index', { ascending: true });

                if (qErr) throw qErr;

                if (data && data.length > 0) {
                    // Normalizar al formato interno { question, options, correct }
                    setQuestions(data.map(q => ({
                        question: q.question_text,
                        options: Array.isArray(q.options) ? q.options : JSON.parse(q.options),
                        correct: q.correct_option_index
                    })));
                } else {
                    console.warn(`[HU-14] Sin preguntas en BD para ${type}. Usando fallback local.`);
                    setQuestions(fallback.map(q => ({ question: q.question, options: q.options, correct: q.correct })));
                }
            } catch (err) {
                console.error('[HU-14] Error al cargar preguntas desde Supabase. Usando fallback local.', err);
                setQuestions(fallback.map(q => ({ question: q.question, options: q.options, correct: q.correct })));
            }
        } else {
            setQuestions(fallback.map(q => ({ question: q.question, options: q.options, correct: q.correct })));
        }

        setQuestionsLoading(false);
    };

    const handleAnswer = (optionIndex) => {
        const newAnswers = [...answers, optionIndex];
        setAnswers(newAnswers);

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            processFinish(newAnswers);
        }
    };

    const processFinish = async (finalAnswers) => {
        setIsSaving(true);
        const correctCount = finalAnswers.reduce((acc, ans, idx) => {
            return ans === questions[idx].correct ? acc + 1 : acc;
        }, 0);

        const scorePercentage = (correctCount / questions.length) * 100;
        setFinalScore(scorePercentage);

        if (user) {
            if (!supabase) return;
            try {
                const { error } = await supabase.from('results').insert([{
                    studentName,
                    email,
                    score: scorePercentage,
                    correctAnswers: correctCount,
                    totalQuestions: questions.length,
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

    // --- ANALYTICS PROCESSING (HU-8 + HU-20) ---
    const filteredAnalyticsData = useMemo(() => {
        let data = analyticsFilter === 'TODO' ? allResults : allResults.filter(item => item.testType === analyticsFilter || (!item.testType && analyticsFilter === 'TDD'));
        
        // HU-20: Filtrado por grupo
        if (groupAnalyticsFilter !== 'ALL') {
            // El groupAnalyticsFilter es el group_id. Necesitamos los emails de ese grupo.
            // Para simplificar, usaremos los groupMembers si el filtro es el grupo seleccionado actualmente,
            // pero para una solución robusta, el filtro debería disparar un fetch de emails de ese grupo.
            // Por ahora, asumimos que groupMembers tiene los miembros del grupo filtrado si el admin está viéndolo,
            // o implementamos una lógica de filtrado directo por group_id si el resultado tuviera esa info.
            // Como 'results' no tiene group_id, usamos el conjunto de emails.
            const memberEmails = new Set(groupMembers.map(m => m.email));
            data = data.filter(r => memberEmails.has(r.email));
        }
        
        return data;
    }, [allResults, analyticsFilter, groupAnalyticsFilter, groupMembers]);

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
        // HU-18: Array dinámico — el tamaño se basa en el máximo de preguntas del cache
        const maxQuestions = analyticsFilter === 'TODO'
            ? Math.max(...Object.values(questionsCache).map(q => q.length), 5)
            : (questionsCache[analyticsFilter]?.length || 5);

        const questionsStats = Array.from({ length: maxQuestions }, (_, i) => ({
            name: `P${i + 1}`, correct: 0, total: 0
        }));

        filteredAnalyticsData.forEach(res => {
            if (res.answers) {
                let parsedAnswers = [];
                try {
                    parsedAnswers = typeof res.answers === 'string' ? JSON.parse(res.answers) : res.answers;
                } catch (e) {
                    return;
                }

                // HU-18: usar questionsCache por test_type; fallback a constantes locales
                const refQuestions = questionsCache[res.testType]
                    ?? (res.testType === 'BDD'
                        ? QUESTIONS_BDD.map(q => ({ correct: q.correct }))
                        : QUESTIONS_TDD.map(q => ({ correct: q.correct })));

                parsedAnswers.forEach((ans, idx) => {
                    if (idx < questionsStats.length) {
                        questionsStats[idx].total++;
                        if (refQuestions[idx] && ans === refQuestions[idx].correct) {
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
    }, [filteredAnalyticsData, questionsCache, analyticsFilter]);

    // HU-19: Datos de detalle por pregunta (estilo Google Forms)
    const questionDetailData = useMemo(() => {
        if (analyticsFilter === 'TODO') return null; // Solo visible con filtro específico

        const refQuestions = questionsCache[analyticsFilter] ?? [];
        if (refQuestions.length === 0) return null;

        if (isAdmin) {
            // Vista admin: distribución de opciones de TODOS los participantes
            const stats = refQuestions.map((q, idx) => {
                const optionCounts = (q.options || []).map(() => 0);
                let total = 0;
                filteredAnalyticsData.forEach(res => {
                    if (!res.answers) return;
                    try {
                        const parsed = typeof res.answers === 'string' ? JSON.parse(res.answers) : res.answers;
                        if (parsed[idx] !== undefined && parsed[idx] !== null) {
                            optionCounts[parsed[idx]] = (optionCounts[parsed[idx]] || 0) + 1;
                            total++;
                        }
                    } catch { /* ignorar */ }
                });
                return {
                    question_text: q.question_text,
                    options: q.options || [],
                    correct: q.correct,
                    optionCounts,
                    total,
                    correctPct: total > 0 ? Math.round((optionCounts[q.correct] / total) * 100) : 0
                };
            });
            return { mode: 'admin', stats };
        } else {
            // Vista estudiante: último intento para el testType seleccionado
            const myResults = allResults
                .filter(r => r.testType === analyticsFilter)
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            if (myResults.length === 0) return { mode: 'student', answers: null, questions: refQuestions };

            let lastAnswers = [];
            try {
                const raw = myResults[0].answers;
                lastAnswers = typeof raw === 'string' ? JSON.parse(raw) : (raw || []);
            } catch { lastAnswers = []; }

            return { mode: 'student', answers: lastAnswers, questions: refQuestions };
        }
    }, [analyticsFilter, questionsCache, filteredAnalyticsData, allResults, isAdmin]);

    const surveyMetrics = useMemo(() => {
        if (!isAdmin || surveyResults.length === 0) return null;

        const processSurvey = (id) => {
            const items = surveyResults.filter(s => s.survey_id === id);
            if (items.length === 0) return { avg: 0, content: 0, instructor: 0, practical: 0, count: 0 };
            
            const sumContent = items.reduce((acc, curr) => acc + curr.rating_content, 0);
            const sumInstructor = items.reduce((acc, curr) => acc + curr.rating_instructor, 0);
            const sumPractical = items.reduce((acc, curr) => acc + curr.rating_practical, 0);
            
            return {
                avg: ((sumContent + sumInstructor + sumPractical) / (items.length * 3)).toFixed(1),
                content: (sumContent / items.length).toFixed(1),
                instructor: (sumInstructor / items.length).toFixed(1),
                practical: (sumPractical / items.length).toFixed(1),
                count: items.length
            };
        };

        return {
            TDD: processSurvey('TDD_SESSION'),
            BDD: processSurvey('BDD_SESSION'),
            recentComments: surveyResults.filter(s => s.comments).slice(0, 10)
        };
    }, [surveyResults, isAdmin]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
            <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mb-4" />
            <p className="text-slate-500 font-medium">Iniciando sesión segura...</p>
        </div>
    );

    return (
        <div className={`min-h-screen transition-colors duration-500 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans p-4 md:p-8`}>
            <header className="max-w-4xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex justify-between items-center w-full md:w-auto">
                    <div onClick={() => isLoggedIn && setView('dashboard')} className={`cursor-pointer ${!isLoggedIn ? 'opacity-90' : 'hover:opacity-80'}`}>
                        <h1 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-2">
                            <ClipboardCheck className="w-8 h-8" />
                            Test Mastery Platform
                            {isAdmin && <span className="text-[10px] bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-1 rounded-full uppercase tracking-widest ml-2 align-middle">Admin</span>}
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Panel de Evaluación de Ingeniería</p>
                    </div>
                    
                    {/* Botón de Modo Oscuro (Móvil) */}
                    <button 
                        onClick={() => setDarkMode(!darkMode)}
                        className="p-3 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-amber-400 md:hidden"
                    >
                        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                </div>
                
                <div className="flex items-center gap-4">
                    {/* Botón de Modo Oscuro (Escritorio) */}
                    <button 
                        onClick={() => setDarkMode(!darkMode)}
                        className="hidden md:flex p-3 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-amber-400 hover:scale-110 transition-transform"
                        title={darkMode ? "Modo Claro" : "Modo Oscuro"}
                    >
                        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>

                    {isLoggedIn && (
                        <nav className="flex bg-white dark:bg-slate-900 p-1 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                            <button onClick={() => setView('dashboard')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${view === 'dashboard' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                            >
                                Dashboard
                            </button>
                            {/* HU-15: Botones generados dinámicamente desde testTypes */}
                            {testTypes.map(tt => {
                                const isDisabled = !isAdmin && !tt.is_active;
                                const isActive = (view === 'quiz' || view === 'result') && testType === tt.test_id;
                                return (
                                    <button
                                        key={tt.test_id}
                                        onClick={() => handleStartTest(tt.test_id)}
                                        disabled={isDisabled}
                                        title={tt.description}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                                            isActive
                                                ? 'bg-indigo-600 text-white shadow-md'
                                                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                        } disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-100 dark:disabled:bg-slate-800/50 disabled:text-slate-400`}
                                    >
                                        {isDisabled ? `${tt.display_name} (Cerrado)` : tt.display_name}
                                    </button>
                                );
                            })}
                            {isAdmin && (
                                <button onClick={() => { setView('groups'); setGroupView('list'); }}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${view === 'groups' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                >
                                    Grupos
                                </button>
                            )}
                        </nav>
                    )}
                </div>
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
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 max-w-md mx-auto text-center">
                        <div
                            className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-6">
                            <User className="w-8 h-8" />
                        </div>
                        <h2 className="text-xl font-bold mb-2">Ingresar a la Plataforma</h2>
                        <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">Completa tus datos para acceder a tus pruebas y a tu Dashboard.</p>
                        
                        <div className="space-y-4 mb-6 text-left">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 ml-1" htmlFor="studentName">Nombre completo</label>
                                <input id="studentName" type="text" placeholder="Ej: Juan Pérez"
                                    className="w-full p-4 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 focus:border-indigo-500 outline-none transition-all text-md dark:text-slate-100"
                                    value={studentName} onChange={(e) => { setStudentName(e.target.value); setError(null); }}
                                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 ml-1" htmlFor="email">Correo electrónico</label>
                                <input id="email" type="email" placeholder="Ej: jperez@empresa.com"
                                    className="w-full p-4 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 focus:border-indigo-500 outline-none transition-all text-md dark:text-slate-100"
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

                {view === 'groups' && isAdmin && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {groupView === 'list' ? (
                            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                                <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                                    <div>
                                        <h3 className="font-black text-xl text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                            <Users className="text-indigo-600 dark:text-indigo-400" /> Gestión de Grupos
                                        </h3>
                                        <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mt-1">Total: {groups.length} grupos</p>
                                    </div>
                                    <button 
                                        onClick={() => setNewGroupModal(true)}
                                        className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-none"
                                    >
                                        <Plus className="w-4 h-4" /> Nuevo Grupo
                                    </button>
                                </div>
                                <div className="p-8">
                                    {isGroupsLoading ? (
                                        <div className="flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-indigo-500" /></div>
                                    ) : groups.length === 0 ? (
                                        <div className="text-center py-12">
                                            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                                <Users className="w-8 h-8" />
                                            </div>
                                            <p className="text-slate-400 font-medium">No hay grupos creados todavía.</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {groups.map(g => (
                                                <div key={g.group_id} className="group p-6 rounded-2xl border-2 border-slate-100 dark:border-slate-800 hover:border-indigo-100 dark:hover:border-indigo-900/50 transition-all cursor-pointer bg-white dark:bg-slate-900"
                                                    onClick={() => { setSelectedGroupId(g.group_id); setGroupView('detail'); }}
                                                >
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h4 className="font-black text-slate-800 dark:text-slate-100">{g.name}</h4>
                                                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest">
                                                            {g.memberCount} miembros
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{g.description || 'Sin descripción'}</p>
                                                    <div className="mt-4 flex justify-end">
                                                        <ChevronRight className="w-5 h-5 text-indigo-500 group-hover:translate-x-1 transition-transform" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                                <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                                    <div className="flex items-center gap-4">
                                        <button onClick={() => setGroupView('list')} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-all"><ChevronLeft /></button>
                                        <div>
                                            <h3 className="font-black text-xl text-slate-800 dark:text-slate-100">{groups.find(g => g.group_id === selectedGroupId)?.name}</h3>
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Detalle del Grupo</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <div className="lg:col-span-2 space-y-8">
                                        <section>
                                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                <ClipboardCheck className="w-4 h-4" /> Evaluaciones del Grupo
                                            </h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {testTypes.map(tt => {
                                                    const isActive = groupTestConfig[tt.test_id] ?? tt.is_active;
                                                    return (
                                                        <button key={tt.test_id} onClick={() => handleToggleGroupTest(tt.test_id, isActive)}
                                                            className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${isActive ? 'border-indigo-100 dark:border-indigo-900/30 bg-indigo-50/30 dark:bg-indigo-900/10 text-indigo-700 dark:text-indigo-300' : 'border-slate-100 dark:border-slate-800 text-slate-400 opacity-60'}`}
                                                        >
                                                            <span className="font-bold text-sm">{tt.display_name}</span>
                                                            <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-indigo-600 animate-pulse' : 'bg-slate-300'}`}></div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            <p className="text-[10px] text-slate-400 mt-2 italic">* Los cambios aquí sobreescriben la configuración global para este grupo.</p>
                                        </section>

                                        <section>
                                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                <User className="w-4 h-4" /> Miembros
                                            </h4>
                                            <div className="flex gap-2 mb-4">
                                                <input type="email" id="newMemberEmail" placeholder="Email del participante" className="flex-1 p-3 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 outline-none text-sm dark:text-slate-100 focus:border-indigo-500" />
                                                <button onClick={() => { const el = document.getElementById('newMemberEmail'); handleAddMember(el.value); el.value = ''; }} className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-all"><Plus /></button>
                                            </div>
                                            <div className="bg-slate-50 dark:bg-slate-800/30 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
                                                {groupMembers.length === 0 ? <p className="p-8 text-center text-slate-400 text-sm">Sin miembros registrados.</p> : (
                                                    <table className="w-full text-left text-sm">
                                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                                            {groupMembers.map(m => (
                                                                <tr key={m.id} className="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10">
                                                                    <td className="px-6 py-4 font-medium text-slate-600 dark:text-slate-300">{m.email}</td>
                                                                    <td className="px-6 py-4 text-right">
                                                                        <button onClick={() => handleDeleteMember(m.id)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                )}
                                            </div>
                                        </section>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="bg-indigo-900 text-indigo-100 p-6 rounded-2xl relative overflow-hidden">
                                            <Users className="absolute -bottom-4 -right-4 w-24 h-24 text-white/5" />
                                            <div className="relative z-10">
                                                <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">Información</p>
                                                <p className="text-sm font-medium leading-relaxed">{groups.find(g => g.group_id === selectedGroupId)?.description || 'Sin descripción adicional para este grupo.'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Modal Creación Grupo */}
                        {newGroupModal && (
                            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                                <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-slate-800">
                                    <h3 className="text-xl font-black mb-6 flex items-center gap-2">Nuevo Grupo</h3>
                                    <div className="space-y-4 mb-8">
                                        <input type="text" placeholder="Nombre completo del grupo" className="w-full p-4 rounded-xl border-2 border-slate-100 dark:border-slate-800 outline-none text-md focus:border-indigo-500 dark:bg-slate-950 dark:text-slate-100" value={newGroupForm.name} onChange={e => setNewGroupForm({...newGroupForm, name: e.target.value})} />
                                        <textarea placeholder="Descripción (opcional)" rows="3" className="w-full p-4 rounded-xl border-2 border-slate-100 dark:border-slate-800 outline-none text-md focus:border-indigo-500 dark:bg-slate-950 dark:text-slate-100" value={newGroupForm.description} onChange={e => setNewGroupForm({...newGroupForm, description: e.target.value})} />
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={() => setNewGroupModal(false)} className="flex-1 py-4 font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all">Cancelar</button>
                                        <button onClick={handleCreateGroup} disabled={isSaving} className="flex-1 bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                                            {isSaving ? <Loader2 className="animate-spin w-5 h-5" /> : 'Crear Grupo'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {view === 'quiz' && (
                    <div className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800">
                        {/* HU-14: Spinner mientras se cargan las preguntas desde Supabase */}
                        {questionsLoading ? (
                            <div className="flex flex-col items-center justify-center py-16 gap-4">
                                <Loader2 className="animate-spin h-10 w-10 text-indigo-600" />
                                <p className="text-slate-500 dark:text-slate-400 font-medium">Cargando preguntas...</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-between items-center mb-8">
                                    <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                                        Pregunta {currentQuestion + 1} / {questions.length}
                                    </span>
                                    <span className="text-xs font-black text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full uppercase tracking-widest">
                                        Test: {testType}
                                    </span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-10 mt-[-1rem]">
                                    <div className="h-full bg-indigo-600 transition-all duration-500" style={{
                                        width: `${((currentQuestion + 1) / questions.length) * 100}%`
                                    }}></div>
                                </div>

                                <h2 className="text-2xl font-bold mb-10 leading-tight text-slate-800 dark:text-slate-100">
                                    {questions[currentQuestion]?.question}
                                </h2>

                                <div className="space-y-4">
                                    {questions[currentQuestion]?.options.map((option, idx) => (
                                        <button key={idx} disabled={isSaving} onClick={() => handleAnswer(idx)}
                                            className="w-full text-left p-5 rounded-2xl border-2 border-slate-50 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500
              hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all group flex items-start gap-4 disabled:opacity-50"
                                        >
                                            <span
                                                className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center font-black group-hover:bg-indigo-600 group-hover:text-white shrink-0 transition-colors">
                                                {String.fromCharCode(65 + idx)}
                                            </span>
                                            <span
                                                className="text-lg font-medium text-slate-700 dark:text-slate-300 group-hover:text-indigo-900 dark:group-hover:text-indigo-100 pt-1 leading-snug">{option}</span>
                                        </button>
                                    ))}
                                </div>
                                {isSaving && (
                                    <div className="mt-8 flex items-center justify-center gap-3 text-indigo-600 font-bold">
                                        <Loader2 className="animate-spin w-5 h-5" />
                                        Guardando respuestas...
                                    </div>
                                )}
                            </>
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
                            {AVAILABLE_SURVEYS.filter(s => surveyConfig[s.id]).map((survey) => (
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

                        {isAdmin && (
                            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden mb-8">
                                {/* HU-17: Panel de control dinámico — encabezado */}
                                <div className="p-8 flex flex-col md:flex-row items-center gap-6 border-b border-slate-100 dark:border-slate-800">
                                    <div className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl">
                                        <Power className="w-8 h-8" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-black text-xl text-slate-800 dark:text-slate-100">Control de Evaluaciones</h3>
                                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Habilita o deshabilita los tests para todos los estudiantes.</p>
                                    </div>
                                </div>
                                {/* HU-17: Lista dinámica de evaluaciones desde testTypes */}
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {testTypes.map(tt => {
                                        const isActive = tt.is_active;
                                        return (
                                            <div key={`ctrl-${tt.test_id}`} className="flex items-center justify-between px-8 py-5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                                <div>
                                                    <p className="font-bold text-slate-800 dark:text-slate-100">{tt.display_name}</p>
                                                    {tt.description && (
                                                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{tt.description}</p>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={async () => {
                                                        const newValue = !isActive;
                                                        // Actualización optimista: testConfig (nav) + testTypes (panel)
                                                        setTestConfig(prev => ({ ...prev, [tt.test_id]: newValue }));
                                                        setTestTypes(prev => prev.map(t =>
                                                            t.test_id === tt.test_id ? { ...t, is_active: newValue } : t
                                                        ));
                                                        try {
                                                            const { error: updateError } = await supabase
                                                                .from('test_config')
                                                                .update({ is_active: newValue })
                                                                .eq('test_id', tt.test_id);
                                                            if (updateError) {
                                                                // Revertir ambos estados si falla
                                                                setTestConfig(prev => ({ ...prev, [tt.test_id]: isActive }));
                                                                setTestTypes(prev => prev.map(t =>
                                                                    t.test_id === tt.test_id ? { ...t, is_active: isActive } : t
                                                                ));
                                                                setError(`No se pudo actualizar: ${updateError.message}`);
                                                            }
                                                        } catch (err) {
                                                            setTestConfig(prev => ({ ...prev, [tt.test_id]: isActive }));
                                                            setTestTypes(prev => prev.map(t =>
                                                                t.test_id === tt.test_id ? { ...t, is_active: isActive } : t
                                                            ));
                                                            setError("Error de conexión al actualizar configuración.");
                                                        }
                                                    }}
                                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold transition-all border-2 text-sm
                                                        ${isActive
                                                            ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800/50 text-green-700 dark:text-green-400 hover:bg-green-100'
                                                            : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:bg-slate-100'}`}
                                                >
                                                    <div className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                                                    {isActive ? 'Activo' : 'Inactivo'}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {isAdmin && (
                            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden mb-8 p-8 flex flex-col md:flex-row items-center gap-6">
                                <div className="p-4 bg-amber-50 dark:bg-amber-900/10 text-amber-600 dark:text-amber-400 rounded-2xl">
                                    <MessageSquare className="w-8 h-8" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-black text-xl text-slate-800 dark:text-slate-100">Control de Encuestas</h3>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Habilita o deshabilita la visibilidad de las encuestas para los usuarios.</p>
                                </div>
                                <div className="flex gap-4">
                                    {AVAILABLE_SURVEYS.map(survey => {
                                        const isActive = surveyConfig[survey.id];
                                        return (
                                            <button 
                                                key={`toggle-srv-${survey.id}`}
                                                onClick={async () => {
                                                    const newValue = !isActive;
                                                    setSurveyConfig(prev => ({...prev, [survey.id]: newValue}));
                                                    try {
                                                        const { error: updateError } = await supabase
                                                            .from('survey_config')
                                                            .update({ is_active: newValue })
                                                            .eq('survey_id', survey.id);
                                                        
                                                        if (updateError) {
                                                            setSurveyConfig(prev => ({...prev, [survey.id]: isActive}));
                                                            setError(`No se pudo actualizar configuración de encuesta: ${updateError.message}`);
                                                        }
                                                    } catch (err) {
                                                        setSurveyConfig(prev => ({...prev, [survey.id]: isActive}));
                                                        setError("Error de conexión al actualizar encuesta.");
                                                    }
                                                }}
                                                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all border-2 
                                                    ${isActive ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800/50 text-green-700 dark:text-green-400 hover:bg-green-100' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:bg-slate-100'}`}
                                            >
                                                <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                                                {survey.title} {isActive ? 'ON' : 'OFF'}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

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
                                            </div>
                                        )}
                                        <div className="flex bg-slate-200/50 dark:bg-slate-800 p-1 rounded-2xl">
                                            {/* HU-20: Filtro de grupo para analítica */}
                                            {groups.length > 0 && (
                                                <div className="mr-4 flex items-center">
                                                    <select 
                                                        value={groupAnalyticsFilter}
                                                        onChange={(e) => {
                                                            const gid = e.target.value;
                                                            setGroupAnalyticsFilter(gid);
                                                            if (gid !== 'ALL') setSelectedGroupId(gid);
                                                        }}
                                                        className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 outline-none focus:border-indigo-500 transition-all"
                                                    >
                                                        <option value="ALL">Sin filtro de grupo</option>
                                                        {groups.map(g => (
                                                            <option key={g.group_id} value={g.group_id}>{g.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                            {/* HU-18: Filtros de analítica dinámicos desde testTypes */}
                                            {[{ test_id: 'TODO', display_name: 'Todos' }, ...testTypes].map(f => (
                                                <button
                                                    key={f.test_id}
                                                    onClick={() => setAnalyticsFilter(f.test_id)}
                                                    className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${analyticsFilter === f.test_id ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                                                >
                                                    {f.display_name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8">
                                    {adminAnalysisTab === 'tests' ? (
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? "#334155" : "#f1f5f9"} />
                                                        <XAxis dataKey="name" stroke={darkMode ? "#64748b" : "#94a3b8"} fontSize={12} tickLine={false} axisLine={false} />
                                                        <YAxis stroke={darkMode ? "#64748b" : "#94a3b8"} fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                                                        <RechartsTooltip cursor={{ fill: darkMode ? '#1e293b' : '#f8fafc' }} contentStyle={{ backgroundColor: darkMode ? '#0f172a' : '#ffffff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', color: darkMode ? '#f1f5f9' : '#1e293b' }} />
                                                        <Bar dataKey="aciertos" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} name="% Aciertos" />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {surveyMetrics && [
                                                    { id: 'TDD', data: surveyMetrics.TDD, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                                                    { id: 'BDD', data: surveyMetrics.BDD, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20' }
                                                ].map(course => (
                                                    <div key={course.id} className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                                                        <div className="flex justify-between items-center mb-4">
                                                            <h4 className="font-black text-slate-800 dark:text-slate-100">Sesión {course.id}</h4>
                                                            <div className={`px-3 py-1 rounded-full text-xs font-bold ${course.bg} ${course.color}`}>
                                                                {course.data.count} Encuestas
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-3 gap-2">
                                                            <div className="text-center">
                                                                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase">Contenido</p>
                                                                <p className="text-xl font-black text-indigo-600 dark:text-indigo-400">{course.data.count > 0 ? course.data.content : '-'}</p>
                                                            </div>
                                                            <div className="text-center">
                                                                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase">Instructor</p>
                                                                <p className="text-xl font-black text-indigo-600 dark:text-indigo-400">{course.data.count > 0 ? course.data.instructor : '-'}</p>
                                                            </div>
                                                            <div className="text-center">
                                                                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase">Práctica</p>
                                                                <p className="text-xl font-black text-indigo-600 dark:text-indigo-400">{course.data.count > 0 ? course.data.practical : '-'}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="bg-slate-900 dark:bg-black rounded-2xl p-6 text-white overflow-hidden relative border border-slate-800 dark:border-slate-900">
                                                <div className="relative z-10">
                                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Últimos Comentarios</h4>
                                                    <div className="space-y-4 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                                        {surveyMetrics?.recentComments.length > 0 ? surveyMetrics.recentComments.map((c, i) => (
                                                            <div key={i} className="border-l-2 border-indigo-500 pl-4 py-1">
                                                                <p className="text-sm font-medium italic text-slate-300">"{c.comments}"</p>
                                                                <p className="text-[10px] font-black text-slate-500 uppercase mt-1">{c.student_name} • {c.survey_id.split('_')[0]}</p>
                                                            </div>
                                                        )) : (
                                                            <p className="text-slate-500 text-sm font-medium italic">No hay comentarios aún...</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <Star className="absolute -bottom-4 -right-4 w-32 h-32 text-white/5 rotate-12" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

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
                                                            <span
                                                                className="text-xs text-slate-400 dark:text-slate-500 mb-1 font-bold">({res.correctAnswers}/{res.totalQuestions})</span>
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
                )}
            </main>

            <footer
                className="max-w-4xl mx-auto mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-slate-400 dark:text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">
                <span>Test Mastery Platform</span>
                <span>App ID: Supabase-v1</span>
            </footer>
        </div>
    );
}
