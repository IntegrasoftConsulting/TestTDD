import React from 'react';
// Force redeploy v1.2
import { useAppLogic } from './hooks/useAppLogic';
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import QuizView from './components/QuizView';
import ResultView from './components/ResultView';
import DashboardView from './components/DashboardView';
import GroupManager from './components/GroupManager';
import SurveyManager from './components/SurveyManager';

function App() {
    const {
        // Auth / Identity
        isLoggedIn, setIsLoggedIn, isAdmin, setIsAdmin,
        studentName, setStudentName, email, setEmail,
        
        // Navigation / View
        view, setView, groupView, setGroupView,
        adminAnalysisTab, setAdminAnalysisTab,
        
        // Data States
        groups, isGroupsLoading, selectedGroupId, setSelectedGroupId,
        questions, questionsLoading, currentQuestion, 
        answers, isSaving, finalScore,
        stats, filteredAnalyticsData, COLORS,
        testTypes, analyticsFilter, setAnalyticsFilter,
        passRateData, trendsData,
        
        // Configs
        groupTestConfig, groupSurveyConfig, surveyConfig,
        availableSurveys, surveyData, setSurveyData,
        surveySubmitting, surveyMetrics,
        
        // Form States
        newGroupModal, setNewGroupModal, newGroupForm, setNewGroupForm,
        darkMode, setDarkMode, error, setError,
        
        // Handlers
        handleLogin, handleCreateGroup, handleAnswer, 
        handleToggleGroupTest, handleToggleGroupSurvey,
        handleAddMember, handleDeleteMember, handleSurveySubmit,
        handleStartTest, testType, loginGroupId, setLoginGroupId,
        fetchGroupDetails, groupMembers, groupAnalyticsFilter, setGroupAnalyticsFilter,
        questionDetailData
    } = useAppLogic();

    return (
        <div className={`min-h-screen transition-colors duration-500 pb-20 font-sans selection:bg-indigo-100 dark:selection:bg-indigo-900/50 ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-[#f8fafc] text-slate-900'}`}>
            <Header 
                studentName={studentName}
                isLoggedIn={isLoggedIn}
                isAdmin={isAdmin}
                view={view}
                testType={testType}
                setView={setView}
                setDarkMode={setDarkMode}
                darkMode={darkMode}
                testTypes={testTypes}
                handleStartTest={handleStartTest}
            />

            <main className="container mx-auto px-4 max-w-6xl pt-12">
                {!isLoggedIn && view === 'login' && (
                    <LoginForm 
                        studentName={studentName}
                        setStudentName={setStudentName}
                        email={email}
                        setEmail={setEmail}
                        groups={groups}
                        loginGroupId={loginGroupId}
                        setLoginGroupId={setLoginGroupId}
                        handleLogin={handleLogin}
                        isAdmin={isAdmin}
                        error={error}
                        setError={setError}
                    />
                )}

                {view === 'dashboard' && isLoggedIn && (
                    <DashboardView 
                        isAdmin={isAdmin}
                        groups={groups}
                        groupAnalyticsFilter={groupAnalyticsFilter}
                        setGroupAnalyticsFilter={setGroupAnalyticsFilter}
                        setSelectedGroupId={setSelectedGroupId}
                        fetchGroupDetails={fetchGroupDetails}
                        stats={stats}
                        setView={setView}
                        testTypes={testTypes}
                        adminAnalysisTab={adminAnalysisTab}
                        setAdminAnalysisTab={setAdminAnalysisTab}
                        analyticsFilter={analyticsFilter}
                        setAnalyticsFilter={setAnalyticsFilter}
                        passRateData={passRateData}
                        COLORS={COLORS}
                        trendsData={trendsData}
                        darkMode={darkMode}
                        surveyMetrics={surveyMetrics}
                        questionDetailData={questionDetailData}
                        filteredAnalyticsData={filteredAnalyticsData || []}
                    />
                )}

                {view === 'groups' && isAdmin && (
                    <GroupManager 
                        groupView={groupView}
                        setGroupView={setGroupView}
                        groups={groups}
                        isGroupsLoading={isGroupsLoading}
                        selectedGroupId={selectedGroupId}
                        setSelectedGroupId={setSelectedGroupId}
                        setNewGroupModal={setNewGroupModal}
                        newGroupForm={newGroupForm}
                        setNewGroupForm={setNewGroupForm}
                        handleCreateGroup={handleCreateGroup}
                        isSaving={isSaving}
                        testTypes={testTypes}
                        groupTestConfig={groupTestConfig}
                        handleToggleGroupTest={handleToggleGroupTest}
                        availableSurveys={availableSurveys}
                        groupSurveyConfig={groupSurveyConfig}
                        surveyConfig={surveyConfig}
                        handleToggleGroupSurvey={handleToggleGroupSurvey}
                        groupMembers={groupMembers}
                        handleAddMember={handleAddMember}
                        handleDeleteMember={handleDeleteMember}
                    />
                )}

                {view === 'quiz' && (
                    <QuizView 
                        questionsLoading={questionsLoading}
                        testType={analyticsFilter} // O el tipo actual
                        currentQuestion={currentQuestion}
                        questions={questions}
                        answers={answers}
                        handleAnswer={handleAnswer}
                        isSaving={isSaving}
                    />
                )}

                {view === 'result' && (
                    <ResultView 
                        testType={analyticsFilter}
                        finalScore={finalScore}
                        stats={stats}
                        setView={setView}
                        setSurveyData={setSurveyData}
                    />
                )}

                {(view === 'survey_list' || view === 'survey') && (
                    <SurveyManager 
                        view={view}
                        setView={setView}
                        availableSurveys={availableSurveys}
                        surveyConfig={surveyConfig}
                        surveyData={surveyData}
                        setSurveyData={setSurveyData}
                        handleSurveySubmit={handleSurveySubmit}
                        surveySubmitting={surveySubmitting}
                    />
                )}
            </main>

            <footer className="max-w-4xl mx-auto mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-slate-400 dark:text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">
                <span>Test Mastery Platform</span>
                <span>App ID: Supabase-v1 • Architected with SOLID</span>
            </footer>
        </div>
    );
}

export default App;
