import React from 'react';
import { Users, Plus, ChevronRight, ChevronLeft, ClipboardCheck, Star, User, Trash2, Loader2 } from 'lucide-react';

const GroupManager = ({ 
    groupView, setGroupView, groups, isGroupsLoading, setSelectedGroupId, selectedGroupId,
    setNewGroupModal, newGroupForm, setNewGroupForm, handleCreateGroup, isSaving,
    testTypes, groupTestConfig, handleToggleGroupTest,
    availableSurveys, groupSurveyConfig, surveyConfig, handleToggleGroupSurvey,
    groupMembers, handleAddMember, handleDeleteMember, handleUpdateTestDefaultScore
}) => {
    const selectedGroup = groups.find(g => g.group_id === selectedGroupId);

    if (groupView === 'list') {
        return (
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

                {/* Modal Creación Grupo */}
                {/* Nota: En una refactorización real, este modal podría ser su propio sub-componente */}
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                <div className="flex items-center gap-4">
                    <button onClick={() => setGroupView('list')} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-all"><ChevronLeft /></button>
                    <div>
                        <h3 className="font-black text-xl text-slate-800 dark:text-slate-100">{selectedGroup?.name}</h3>
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {testTypes.map(tt => {
                                const isActive = groupTestConfig[tt.test_id] ?? tt.is_active;
                                return (
                                    <div key={tt.test_id} className={`p-4 rounded-xl border-2 transition-all ${isActive ? 'border-indigo-100 dark:border-indigo-900/30 bg-indigo-50/30 dark:bg-indigo-900/10' : 'border-slate-100 dark:border-slate-800 opacity-60'}`}>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className={`font-bold text-sm ${isActive ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-400'}`}>{tt.display_name}</span>
                                            <button 
                                                onClick={() => handleToggleGroupTest(tt.test_id, isActive)}
                                                className={`w-3 h-3 rounded-full transition-all ${isActive ? 'bg-indigo-600 animate-pulse shadow-lg shadow-indigo-300' : 'bg-slate-300'}`}
                                            ></button>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Puntaje Default:</label>
                                            <input 
                                                type="number" 
                                                min="0" 
                                                max="100"
                                                defaultValue={tt.default_score}
                                                onBlur={(e) => {
                                                    const val = parseInt(e.target.value);
                                                    if (!isNaN(val) && val !== tt.default_score) {
                                                        handleUpdateTestDefaultScore(tt.test_id, val);
                                                    }
                                                }}
                                                className="w-16 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500 transition-all"
                                            />
                                            <span className="text-[10px] font-bold text-slate-400">%</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    <section>
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Star className="w-4 h-4" /> Encuestas del Grupo
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {availableSurveys.map(survey => {
                                const isActive = groupSurveyConfig[survey.id] ?? surveyConfig[survey.id];
                                return (
                                    <button key={survey.id} onClick={() => handleToggleGroupSurvey(survey.id, isActive)}
                                        className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${isActive ? 'border-amber-100 dark:border-amber-900/30 bg-amber-50/30 dark:bg-amber-900/10 text-amber-700 dark:text-amber-300' : 'border-slate-100 dark:border-slate-800 text-slate-400 opacity-60'}`}
                                    >
                                        <span className="font-bold text-sm">{survey.title}</span>
                                        <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-amber-500 animate-pulse' : 'bg-slate-300'}`}></div>
                                    </button>
                                );
                            })}
                        </div>
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
                            <p className="text-sm font-medium leading-relaxed">{selectedGroup?.description || 'Sin descripción adicional para este grupo.'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GroupManager;
