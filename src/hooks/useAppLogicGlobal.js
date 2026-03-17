import { useState, useEffect, useMemo, useCallback } from 'react';
// Cache Burster v1.7 - 2026-03-17 15:58
import { supabase } from '../supabaseClient';
import { QUESTIONS_TDD, QUESTIONS_BDD } from '../data/questions';
import { AVAILABLE_SURVEYS } from '../data/surveys';

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e'];

export const useAppLogic = () => {
    const [user, setUser] = useState(null);
    const [view, setView] = useState('login');
    const [studentName, setStudentName] = useState('');
    const [email, setEmail] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [testType, setTestType] = useState('TDD');
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [finalScore, setFinalScore] = useState(0);
    const [allResults, setAllResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [analyticsFilter, setAnalyticsFilter] = useState('TODO');
    const [testConfig, setTestConfig] = useState({ TDD: true, BDD: true });
    const [testTypes, setTestTypes] = useState([
        { test_id: 'TDD', display_name: 'Test TDD', description: 'Test Driven Development', order_index: 1, is_active: true },
        { test_id: 'BDD', display_name: 'Test BDD', description: 'Behavior Driven Development', order_index: 2, is_active: true }
    ]);
    const [surveyConfig, setSurveyConfig] = useState({ TDD_SESSION: true, BDD_SESSION: true });
    const [availableSurveys, setAvailableSurveys] = useState(AVAILABLE_SURVEYS);
    const [surveyData, setSurveyData] = useState({ survey_id: '', rating_content: 0, rating_instructor: 0, rating_practical: 0, comments: '' });
    const [surveySubmitting, setSurveySubmitting] = useState(false);
    const [surveyResults, setSurveyResults] = useState([]);
    const [adminAnalysisTab, setAdminAnalysisTab] = useState('tests');
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('mastery_dark_mode');
        return saved ? JSON.parse(saved) : false;
    });
    const [questions, setQuestions] = useState([]);
    const [questionsLoading, setQuestionsLoading] = useState(false);
    const [questionsCache, setQuestionsCache] = useState({});

    // ESTADOS DE GRUPOS
    const [groups, setGroups] = useState([]);
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [groupTestConfig, setGroupTestConfig] = useState({});
    const [groupSurveyConfig, setGroupSurveyConfig] = useState({});
    const [groupMembers, setGroupMembers] = useState([]);
    const [groupAnalyticsFilter, setGroupAnalyticsFilter] = useState('ALL');
    const [newGroupModal, setNewGroupModal] = useState(false);
    const [newGroupForm, setNewGroupForm] = useState({ name: '', description: '' });
    const [userGroupId, setUserGroupId] = useState(null);
    const [groupView, setGroupView] = useState('list');
    const [isGroupsLoading, setIsGroupsLoading] = useState(false);
    const [loginGroupId, setLoginGroupId] = useState('');

    const fetchGroups = useCallback(async () => {
        setIsGroupsLoading(true);
        try {
            const { data: groupsData, error: gErr } = await supabase
                .from('groups')
                .select('*')
                .order('name');
            
            if (gErr) throw gErr;

            const groupsWithCounts = await Promise.all((groupsData || []).map(async (g) => {
                const { count } = await supabase
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
    }, []);

    const fetchGroupDetails = useCallback(async (groupId) => {
        if (!isAdmin || !groupId) return;
        try {
            const { data: configData } = await supabase
                .from('group_test_config')
                .select('test_id, is_active')
                .eq('group_id', groupId);
            
            const configMap = {};
            (configData || []).forEach(c => configMap[c.test_id] = c.is_active);
            setGroupTestConfig(configMap);

            const { data: srvConfigData } = await supabase
                .from('group_survey_config')
                .select('survey_id, is_active')
                .eq('group_id', groupId);
            
            const srvMap = {};
            (srvConfigData || []).forEach(c => srvMap[c.survey_id] = c.is_active);
            setGroupSurveyConfig(srvMap);

            const { data: membersData } = await supabase
                .from('group_members')
                .select('*')
                .eq('group_id', groupId)
                .order('email');
            
            setGroupMembers(membersData || []);
        } catch (err) {
            console.error("Error fetching group details:", err);
        }
    }, [isAdmin]);

    useEffect(() => {
        if (selectedGroupId) fetchGroupDetails(selectedGroupId);
    }, [selectedGroupId, isAdmin, fetchGroupDetails]);

    // AUTH
    useEffect(() => {
        const initAuth = async () => {
            if (!supabase) {
                setError("Faltan variables de entorno de Supabase (VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY).");
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

    // DARK MODE
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('mastery_dark_mode', JSON.stringify(darkMode));
    }, [darkMode]);

    // FETCH DATA
    const fetchConfig = useCallback(async () => {
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
                let finalConfig = data.map(item => ({ ...item }));

                if (!isAdmin && isLoggedIn && userGroupId) {
                    const { data: groupOverrides, error: goErr } = await supabase
                        .from('group_test_config')
                        .select('test_id, is_active')
                        .eq('group_id', userGroupId);
                    
                    if (!goErr && groupOverrides && groupOverrides.length > 0) {
                        const overrideMap = {};
                        groupOverrides.forEach(o => overrideMap[o.test_id] = o.is_active);
                        
                        finalConfig = finalConfig.map(t => ({
                            ...t,
                            is_active: overrideMap[t.test_id] !== undefined ? overrideMap[t.test_id] : t.is_active
                        }));
                    }
                }

                const newConfigMap = {};
                finalConfig.forEach(item => { newConfigMap[item.test_id] = item.is_active; });
                setTestConfig(newConfigMap);

                setTestTypes(finalConfig.map(item => ({
                    test_id: item.test_id,
                    display_name: item.display_name || `Test ${item.test_id}`,
                    description: item.description || '',
                    order_index: item.order_index ?? 99,
                    is_active: item.is_active
                })));
            } else {
                setTestTypes(DEFAULT_TEST_TYPES);
            }
        } catch (err) {
            console.error('[HU-15] Error al cargar test_config:', err);
            setTestTypes(DEFAULT_TEST_TYPES);
        }
    }, [isAdmin, isLoggedIn, userGroupId]);

    const fetchSurveyConfig = useCallback(async () => {
        try {
            const { data, error: srvError } = await supabase
                .from('survey_config')
                .select('survey_id, is_active')
                .order('survey_id');
            if (srvError) throw srvError;
            
            if (data && data.length > 0) {
                setAvailableSurveys(data.map(s => ({
                    id: s.survey_id,
                    title: s.survey_id,
                    description: '', // Columna inexiste en DB
                    is_active: s.is_active
                })));

                let finalSrvConfig = {};
                data.forEach(item => {
                    finalSrvConfig[item.survey_id] = item.is_active;
                });

                if (!isAdmin && isLoggedIn && userGroupId) {
                    const { data: groupSrvOverrides } = await supabase
                        .from('group_survey_config')
                        .select('survey_id, is_active')
                        .eq('group_id', userGroupId);
                    
                    if (groupSrvOverrides && groupSrvOverrides.length > 0) {
                        groupSrvOverrides.forEach(o => {
                            finalSrvConfig[o.survey_id] = o.is_active;
                        });
                    }
                }

                setSurveyConfig(finalSrvConfig);
            } else {
                setAvailableSurveys(AVAILABLE_SURVEYS);
            }
        } catch (err) {
            console.error("Survey config fetch error:", err);
            setAvailableSurveys(AVAILABLE_SURVEYS);
        }
    }, [isAdmin, isLoggedIn, userGroupId]);

    const fetchSurveyResults = useCallback(async () => {
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
    }, [isAdmin]);

    const fetchInitialData = useCallback(async () => {
        if (!isLoggedIn) return;
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
    }, [isLoggedIn, isAdmin, email]);

    useEffect(() => {
        if (!user || !supabase) return;

        // Bajamos datos fresquitos
        fetchConfig();
        fetchSurveyConfig();
        if (view === 'login') fetchGroups();
        if (isLoggedIn && view === 'dashboard') {
            fetchInitialData();
            if (isAdmin) {
                fetchSurveyResults();
                fetchGroups();
                // Analítica cache
                (async () => {
                    try {
                        const { data: qData, error: qErr } = await supabase
                            .from('questions')
                            .select('test_type, order_index, correct_option_index, question_text, options')
                            .eq('is_active', true)
                            .order('order_index', { ascending: true });
                        if (!qErr && qData) {
                            const cache = {};
                            qData.forEach(q => {
                                if (!cache[q.test_type]) cache[q.test_type] = [];
                                cache[q.test_type].push({
                                    correct: q.correct_option_index,
                                    question_text: q.question_text || '',
                                    options: Array.isArray(q.options) ? q.options : []
                                });
                            });
                            if (!cache['TDD'] || cache['TDD'].length === 0)
                                cache['TDD'] = QUESTIONS_TDD.map(q => ({ correct: q.correct, question_text: q.question, options: q.options }));
                            if (!cache['BDD'] || cache['BDD'].length === 0)
                                cache['BDD'] = QUESTIONS_BDD.map(q => ({ correct: q.correct, question_text: q.question, options: q.options }));
                            setQuestionsCache(cache);
                        }
                    } catch (err) {
                        console.warn('[HU-18] No se pudo cargar el cache de preguntas.', err);
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
                if (!isAdmin && isLoggedIn) fetchConfig();
            }).subscribe();

        const channelGroupSurveyConfig = supabase
            .channel('public:group_survey_config')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'group_survey_config' }, payload => {
                if (isAdmin && selectedGroupId) fetchGroupDetails(selectedGroupId);
                if (!isAdmin && isLoggedIn) fetchSurveyConfig();
            }).subscribe();

        return () => {
            supabase.removeChannel(channelResults);
            supabase.removeChannel(channelConfig);
            supabase.removeChannel(channelSurveyConfig);
            supabase.removeChannel(channelSurveyResponses);
            supabase.removeChannel(channelGroups);
            supabase.removeChannel(channelGroupMembers);
            supabase.removeChannel(channelGroupTestConfig);
            supabase.removeChannel(channelGroupSurveyConfig);
        };
    }, [user, isLoggedIn, email, isAdmin, view, userGroupId, selectedGroupId, fetchConfig, fetchSurveyConfig, fetchGroups, fetchInitialData, fetchSurveyResults, fetchGroupDetails]);

    const handleLogin = async () => {
        if (studentName.trim().length < 3) {
            setError("Por favor, ingresa tu nombre completo (mínimo 3 caracteres).");
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Por favor, ingresa un formato de correo electrónico válido.");
            return;
        }

        setIsSaving(true);
        setError(null);

        try {
            const { data, error: adminError } = await supabase
                .from('admin_users')
                .select('email')
                .eq('email', email)
                .maybeSingle();

            if (data) {
                setIsAdmin(true);
            } else {
                setIsAdmin(false);
                if (!loginGroupId) {
                    setError("Por favor, selecciona el grupo al que perteneces.");
                    setIsSaving(false);
                    return;
                }
                const { data: memberRow } = await supabase
                    .from('group_members')
                    .select('group_id')
                    .eq('email', email)
                    .maybeSingle();
                
                if (memberRow) {
                    setUserGroupId(memberRow.group_id);
                }

                if (loginGroupId) {
                    await supabase
                        .from('group_members')
                        .upsert([{ group_id: loginGroupId, email: email }], { onConflict: 'group_id,email' });
                    setUserGroupId(loginGroupId);
                }
            }
            setIsLoggedIn(true);
            setView('dashboard');
        } catch (err) {
            console.error("Login verification error:", err);
            setError("Ocurrió un error al iniciar sesión.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCreateGroup = async () => {
        if (!newGroupForm.name.trim()) return;
        setIsSaving(true);
        try {
            const { error } = await supabase.from('groups').insert([newGroupForm]);
            if (error) throw error;
            setNewGroupForm({ name: '', description: '' });
            setNewGroupModal(false);
            fetchGroups();
        } catch (err) {
            setError(`Error al crear grupo: ${err.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddMember = async (emailToAdd) => {
        if (!selectedGroupId || !emailToAdd) return;
        try {
            const { error } = await supabase.from('group_members').insert([{ group_id: selectedGroupId, email: emailToAdd }]);
            if (error) throw error;
            fetchGroupDetails(selectedGroupId);
            fetchGroups();
        } catch (err) {
            setError(`Error al agregar miembro: ${err.message}`);
        }
    };

    const handleDeleteMember = async (memberId) => {
        try {
            const { error } = await supabase.from('group_members').delete().eq('id', memberId);
            if (error) throw error;
            setGroupMembers(prev => prev.filter(m => m.id !== memberId));
            fetchGroups();
        } catch (err) {
            setError(`Error al eliminar miembro: ${err.message}`);
        }
    };

    const handleToggleGroupTest = async (testId, currentStatus) => {
        if (!selectedGroupId) return;
        const newStatus = !currentStatus;
        setGroupTestConfig(prev => ({ ...prev, [testId]: newStatus }));
        try {
            const { error } = await supabase
                .from('group_test_config')
                .upsert({ group_id: selectedGroupId, test_id: testId, is_active: newStatus }, { onConflict: 'group_id,test_id' });
            if (error) throw error;
        } catch (err) {
            setGroupTestConfig(prev => ({ ...prev, [testId]: currentStatus }));
            setError(`Error al actualizar config: ${err.message}`);
        }
    };

    const handleToggleGroupSurvey = async (surveyId, currentStatus) => {
        if (!selectedGroupId) return;
        const newStatus = !currentStatus;
        setGroupSurveyConfig(prev => ({ ...prev, [surveyId]: newStatus }));
        try {
            const { error } = await supabase
                .from('group_survey_config')
                .upsert({ group_id: selectedGroupId, survey_id: surveyId, is_active: newStatus }, { onConflict: 'group_id,survey_id' });
            if (error) throw error;
        } catch (err) {
            setGroupSurveyConfig(prev => ({ ...prev, [surveyId]: currentStatus }));
            setError(`Error al actualizar encuesta config: ${err.message}`);
        }
    };

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
                    setQuestions(data.map(q => ({
                        question: q.question_text,
                        options: Array.isArray(q.options) ? q.options : JSON.parse(q.options),
                        correct: q.correct_option_index
                    })));
                } else {
                    setQuestions(fallback.map(q => ({ question: q.question, options: q.options, correct: q.correct })));
                }
            } catch (err) {
                console.error('[HU-14] Error al cargar preguntas.', err);
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

        if (user && supabase) {
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
                setError("Error al guardar tus resultados.");
            } finally {
                setIsSaving(false);
            }
        }
    };

    const handleSurveySubmit = async () => {
        if (surveyData.rating_content === 0 || surveyData.rating_instructor === 0 || surveyData.rating_practical === 0) {
            setError("Por favor, califica todos los aspectos.");
            return;
        }
        setSurveySubmitting(true);
        try {
            // [HU-28] Asegurar que la configuración de la encuesta existe si es nueva
            if (surveyData.survey_id) {
                const { error: upError } = await supabase.from('survey_config').upsert([{
                    survey_id: surveyData.survey_id,
                    is_active: true
                }], { onConflict: 'survey_id' });
                if (upError) console.error("Error ensuring survey config:", upError);
            }

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
            setSurveyData({ survey_id: '', rating_content: 0, rating_instructor: 0, rating_practical: 0, comments: '' });
            setView('dashboard');
            setError(null);
            alert("¡Gracias por tu feedback!");
        } catch (err) {
            console.error("Survey error:", err);
            setError("No se pudo enviar la encuesta.");
        } finally {
            setSurveySubmitting(false);
        }
    };

    // MEMOIZED ANALYTICS
    const filteredAnalyticsData = useMemo(() => {
        let data = analyticsFilter === 'TODO' ? (allResults || []) : (allResults || []).filter(item => item.testType === analyticsFilter || (!item.testType && analyticsFilter === 'TDD'));
        if (groupAnalyticsFilter !== 'ALL') {
            const memberEmails = new Set((groupMembers || []).map(m => m.email));
            data = (data || []).filter(r => memberEmails.has(r.email));
        }
        return data;
    }, [allResults, analyticsFilter, groupAnalyticsFilter, groupMembers]);

    const stats = useMemo(() => {
        if (filteredAnalyticsData.length === 0) return { avg: 0, total: 0 };
        const sum = filteredAnalyticsData.reduce((acc, curr) => acc + (curr.score || 0), 0);
        return {
            avg: (sum / filteredAnalyticsData.length).toFixed(1),
            total: filteredAnalyticsData.length
        };
    }, [filteredAnalyticsData]);

    const passRateData = useMemo(() => {
        let ranges = { '0-39%': 0, '40-69%': 0, '70-89%': 0, '90-100%': 0 };
        filteredAnalyticsData.forEach(res => {
            const s = res.score;
            if (s < 40) ranges['0-39%']++;
            else if (s < 70) ranges['40-69%']++;
            else if (s < 90) ranges['70-89%']++;
            else ranges['90-100%']++;
        });
        return Object.keys(ranges).filter(key => ranges[key] > 0).map(key => ({ name: key, value: ranges[key] }));
    }, [filteredAnalyticsData]);

    const trendsData = useMemo(() => {
        const maxQuestions = analyticsFilter === 'TODO'
            ? Math.max(...Object.values(questionsCache).map(q => q.length), 5)
            : (questionsCache[analyticsFilter]?.length || 5);
        const questionsStats = Array.from({ length: maxQuestions }, (_, i) => ({ name: `P${i + 1}`, correct: 0, total: 0 }));
        filteredAnalyticsData.forEach(res => {
            if (res.answers) {
                let parsedAnswers = typeof res.answers === 'string' ? JSON.parse(res.answers) : res.answers;
                const refQuestions = questionsCache[res.testType] ?? (res.testType === 'BDD' ? QUESTIONS_BDD : QUESTIONS_TDD);
                parsedAnswers.forEach((ans, idx) => {
                    if (idx < questionsStats.length) {
                        questionsStats[idx].total++;
                        const refQ = refQuestions[idx];
                        if (refQ && (ans === (refQ.correct || refQ.correct_option_index))) questionsStats[idx].correct++;
                    }
                });
            }
        });
        return questionsStats.map(stat => ({ name: stat.name, aciertos: stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0, total_intentos: stat.total }));
    }, [filteredAnalyticsData, questionsCache, analyticsFilter]);

    const questionDetailData = useMemo(() => {
        if (analyticsFilter === 'TODO') return null;
        const refQuestions = questionsCache[analyticsFilter] ?? [];
        if (refQuestions.length === 0) return null;
        if (isAdmin) {
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
                    } catch { }
                });
                return { question_text: q.question_text, options: q.options || [], correct: q.correct, optionCounts, total, correctPct: total > 0 ? Math.round((optionCounts[q.correct] / total) * 100) : 0 };
            });
            return { mode: 'admin', stats };
        } else {
            const myResults = allResults.filter(r => r.testType === analyticsFilter).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
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
        return { TDD: processSurvey('TDD_SESSION'), BDD: processSurvey('BDD_SESSION'), recentComments: surveyResults.filter(s => s.comments).slice(0, 10) };
    }, [surveyResults, isAdmin]);

    return {
        user, view, setView, studentName, setStudentName, email, setEmail, isLoggedIn, setIsLoggedIn,
        testType, setTestType, currentQuestion, setCurrentQuestion, answers, setAnswers, finalScore, setFinalScore,
        allResults, setAllResults, loading, setLoading, isSaving, setIsSaving, error, setError, isAdmin, setIsAdmin,
        analyticsFilter, setAnalyticsFilter, testConfig, setTestConfig, testTypes, setTestTypes,
        surveyConfig, setSurveyConfig, availableSurveys, setAvailableSurveys, surveyData, setSurveyData,
        surveySubmitting, setSurveySubmitting, surveyResults, setSurveyResults, adminAnalysisTab, setAdminAnalysisTab,
        darkMode, setDarkMode, questions, setQuestions, questionsLoading, setQuestionsLoading, questionsCache, setQuestionsCache,
        groups, setGroups, selectedGroupId, setSelectedGroupId, groupTestConfig, setGroupTestConfig,
        groupSurveyConfig, setGroupSurveyConfig, groupMembers, setGroupMembers, groupAnalyticsFilter, setGroupAnalyticsFilter,
        newGroupModal, setNewGroupModal, newGroupForm, setNewGroupForm, userGroupId, setUserGroupId,
        groupView, setGroupView, isGroupsLoading, setIsGroupsLoading, loginGroupId, setLoginGroupId,
        handleLogin, handleCreateGroup, handleAddMember, handleDeleteMember, handleToggleGroupTest,
        handleToggleGroupSurvey, handleStartTest, handleAnswer, handleSurveySubmit,
        filteredAnalyticsData, stats, passRateData, trendsData, questionDetailData, surveyMetrics, COLORS
    };
};
