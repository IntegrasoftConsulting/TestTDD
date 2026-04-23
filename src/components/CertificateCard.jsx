import React, { useRef, useState } from 'react';
import { Award, CheckCircle, Clock, XCircle, Download, Loader2, Shield, ExternalLink } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// ─── SVG Logo inline "TMP" ────────────────────────────────────────────────────
const TmpLogo = ({ size = 56 }) => (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="56" height="56" rx="10" fill="#0f172a"/>
        {/* Hexagon outline */}
        <polygon points="28,6 48,17 48,39 28,50 8,39 8,17"
            fill="none" stroke="#6366f1" strokeWidth="1.5" />
        {/* Inner diamond */}
        <polygon points="28,14 38,28 28,42 18,28"
            fill="none" stroke="#818cf8" strokeWidth="1"/>
        {/* Center dot */}
        <circle cx="28" cy="28" r="3" fill="#6366f1"/>
        {/* TMP text */}
        <text x="28" y="58" textAnchor="middle" fontSize="8"
            fontFamily="monospace" fill="#94a3b8" fontWeight="bold"
            letterSpacing="2">TMP</text>
    </svg>
);

// ─── Certificate DOM (hidden, rendered to PDF) ────────────────────────────────
const CertificateDOM = React.forwardRef(({ cert, testDetails, studentName }, ref) => {
    const date = cert?.issued_at
        ? new Date(cert.issued_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })
        : new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });

    const shortId = cert?.certificate_id
        ? cert.certificate_id.substring(0, 18).toUpperCase()
        : '—';

    const scoreRows = (testDetails || []).filter(t => !t.isPending).map(t => ({
        name: t.displayName,
        score: Math.round(t.bestScore)
    }));

    return (
        <div
            ref={ref}
            style={{
                width: '794px',
                minHeight: '560px',
                background: '#fafafa',
                fontFamily: "'Georgia', 'Times New Roman', serif",
                display: 'flex',
                flexDirection: 'column',
                padding: '0',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid #e2e8f0',
            }}
        >
            {/* Top accent bar */}
            <div style={{ height: '8px', backgroundColor: '#6366f1' }} />

            {/* Border frame */}
            <div style={{
                position: 'absolute', top: '16px', left: '16px', right: '16px', bottom: '16px',
                border: '1.5px solid #cbd5e1', pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute', top: '20px', left: '20px', right: '20px', bottom: '20px',
                border: '0.5px solid #e2e8f0', pointerEvents: 'none'
            }} />

            {/* Content */}
            <div style={{ padding: '40px 64px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '8px' }}>
                    {/* SVG Logo rendered as data: use a native canvas-friendly approach */}
                    <div style={{
                        width: 56, height: 56, borderRadius: 10, background: '#0f172a',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0
                    }}>
                        <svg width="40" height="40" viewBox="0 0 56 56" fill="none">
                            <polygon points="28,6 48,17 48,39 28,50 8,39 8,17"
                                fill="none" stroke="#6366f1" strokeWidth="1.5" />
                            <polygon points="28,14 38,28 28,42 18,28"
                                fill="none" stroke="#818cf8" strokeWidth="1"/>
                            <circle cx="28" cy="28" r="3" fill="#6366f1"/>
                        </svg>
                    </div>
                    <div>
                        <p style={{ fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase', color: '#6366f1', margin: 0, fontFamily: 'monospace' }}>
                            TEST MASTERY PLATFORM
                        </p>
                        <h1 style={{ fontSize: '22px', margin: '2px 0 0', color: '#0f172a', letterSpacing: '1px' }}>
                            Modern Software Craftsmanship
                        </h1>
                    </div>
                </div>

                <div style={{ width: '120px', height: '1px', backgroundColor: '#6366f1', opacity: 0.5, margin: '16px auto' }} />

                <p style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: '#64748b', margin: '0 0 24px', fontFamily: 'monospace' }}>
                    Certificado de Aprobación
                </p>

                <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 8px', fontFamily: 'Georgia, serif' }}>
                    Este certificado acredita que
                </p>
                <h2 style={{ fontSize: '32px', color: '#0f172a', margin: '0 0 4px', fontWeight: 'normal', letterSpacing: '0.5px' }}>
                    {studentName}
                </h2>
                <div style={{ width: '200px', height: '1.5px', background: '#6366f1', margin: '8px auto 16px', opacity: 0.4 }} />

                <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 4px', textAlign: 'center', maxWidth: '520px', lineHeight: '1.7' }}>
                    ha demostrado competencia en las disciplinas de ingeniería de software modernas evaluadas
                    en el programa <strong style={{ color: '#1e293b' }}>Modern Software Craftsmanship</strong>.
                </p>

                {/* Score Grid */}
                <div style={{
                    display: 'flex', gap: '8px', marginTop: '24px', marginBottom: '20px', flexWrap: 'wrap', justifyContent: 'center'
                }}>
                    {scoreRows.map(s => (
                        <div key={s.name} style={{
                            padding: '8px 16px', background: '#f1f5f9', borderRadius: '6px',
                            border: '1px solid #e2e8f0', textAlign: 'center', minWidth: '80px'
                        }}>
                            <p style={{ margin: 0, fontSize: '9px', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#64748b', fontFamily: 'monospace' }}>
                                {s.name.replace('Test ', '')}
                            </p>
                            <p style={{ margin: '2px 0 0', fontSize: '18px', fontWeight: 'bold', color: s.score >= 70 ? '#16a34a' : '#dc2626', fontFamily: 'Georgia, serif' }}>
                                {s.score}%
                            </p>
                        </div>
                    ))}
                    {/* General */}
                    <div style={{
                        padding: '8px 20px', background: '#0f172a', borderRadius: '6px', textAlign: 'center', minWidth: '90px'
                    }}>
                        <p style={{ margin: 0, fontSize: '9px', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#94a3b8', fontFamily: 'monospace' }}>
                            GENERAL
                        </p>
                        <p style={{ margin: '2px 0 0', fontSize: '20px', fontWeight: 'bold', color: '#818cf8', fontFamily: 'Georgia, serif' }}>
                            {Math.round(cert?.weighted_score || 0)}%
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div style={{ marginTop: 'auto', paddingTop: '16px', width: '100%', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <p style={{ margin: 0, fontSize: '9px', color: '#94a3b8', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'monospace' }}>Fecha de emisión</p>
                        <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#475569', fontFamily: 'Georgia, serif' }}>{date}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: 0, fontSize: '9px', color: '#94a3b8', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'monospace' }}>Código de verificación</p>
                        <p style={{ margin: '2px 0 0', fontSize: '10px', color: '#6366f1', fontFamily: 'monospace', letterSpacing: '1px' }}>{shortId}</p>
                    </div>
                </div>
            </div>

            {/* Bottom accent bar */}
            <div style={{ height: '4px', backgroundColor: '#6366f1' }} />
        </div>
    );
});
CertificateDOM.displayName = 'CertificateDOM';

// ─── Main CertificateCard ─────────────────────────────────────────────────────
const CertificateCard = ({
    certEligibility,
    certificate,
    certLoading,
    onGenerate,
    studentName,
    darkMode,
    testDetails
}) => {
    const certRef = useRef(null);
    const [downloading, setDownloading] = useState(false);

    const downloadPDF = async (certData) => {
        setDownloading(true);
        try {
            const el = certRef.current;
            if (!el) return;

            // Temporarily show the hidden element
            el.style.position = 'fixed';
            el.style.left = '-9999px';
            el.style.top = '0';
            el.style.display = 'block';

            await new Promise(r => setTimeout(r, 200));

            const canvas = await html2canvas(el, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#fafafa',
                logging: false,
            });

            el.style.display = 'none';
            el.style.position = '';
            el.style.left = '';
            el.style.top = '';

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [794, 560] });
            pdf.addImage(imgData, 'PNG', 0, 0, 794, 560);

            const safeName = (studentName || 'student').replace(/\s+/g, '_').toLowerCase();
            pdf.save(`certificado_msc_${safeName}.pdf`);
        } catch (err) {
            console.error('[HU-32] Error al generar PDF:', err);
        } finally {
            setDownloading(false);
        }
    };

    const handleClick = async () => {
        if (certificate) {
            await downloadPDF(certificate);
        } else {
            const cert = await onGenerate();
            if (cert) await downloadPDF(cert);
        }
    };

    // ── Hidden Certificate DOM for rendering
    const certForRender = certificate || {
        certificate_id: null,
        weighted_score: certEligibility?.score || 0,
        issued_at: new Date().toISOString()
    };

    // ── Estado: sin datos aún
    if (!certEligibility) return null;

    const { eligible, passes, allCompleted, missingTests, score } = certEligibility;

    return (
        <>
            {/* Hidden render target */}
            <div style={{ display: 'none' }}>
                <CertificateDOM
                    ref={certRef}
                    cert={certForRender}
                    testDetails={testDetails}
                    studentName={studentName}
                />
            </div>

            <div className={`mt-6 rounded-2xl border overflow-hidden transition-all duration-300 ${
                eligible
                    ? 'bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-950/30 dark:via-slate-900 dark:to-purple-950/30 border-indigo-200 dark:border-indigo-800/50 shadow-lg shadow-indigo-100/50 dark:shadow-none'
                    : 'bg-slate-50/50 dark:bg-slate-800/20 border-slate-200 dark:border-slate-700'
            }`}>
                {/* Header stripe */}
                {eligible && (
                    <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />
                )}

                <div className="p-6">
                    <div className="flex items-start gap-4">
                        {/* Icon / Badge */}
                        <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                            eligible
                                ? 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-200/50 dark:shadow-none'
                                : 'bg-slate-100 dark:bg-slate-800'
                        }`}>
                            {eligible
                                ? <Award className="w-6 h-6 text-white" />
                                : allCompleted
                                    ? <XCircle className="w-6 h-6 text-red-400" />
                                    : <Clock className="w-6 h-6 text-slate-400" />
                            }
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-black text-sm text-slate-800 dark:text-slate-100">
                                    Certificado — Modern Software Craftsmanship
                                </h4>
                                {certificate && (
                                    <span className="text-[9px] font-black uppercase tracking-widest bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full border border-green-200 dark:border-green-800/50">
                                        Emitido
                                    </span>
                                )}
                            </div>

                            {eligible ? (
                                <>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                        {certificate
                                            ? `Emitido el ${new Date(certificate.issued_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })} · Código: ${certificate.certificate_id.substring(0, 12).toUpperCase()}…`
                                            : '¡Felicidades! Has cumplido todos los requisitos del programa.'
                                        }
                                    </p>
                                    <div className="flex gap-2 mt-4 flex-wrap">
                                        <button
                                            onClick={handleClick}
                                            disabled={certLoading || downloading}
                                            id="btn-download-certificate"
                                            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-60 text-white font-bold text-xs py-2.5 px-5 rounded-xl transition-all active:scale-95 shadow-lg shadow-indigo-200 dark:shadow-none"
                                        >
                                            {(certLoading || downloading)
                                                ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generando…</>
                                                : <><Download className="w-3.5 h-3.5" /> {certificate ? 'Descargar PDF' : 'Obtener Certificado'}</>
                                            }
                                        </button>
                                        {certificate && (
                                            <a
                                                href={`?cert=${certificate.certificate_id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/50 px-4 py-2.5 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all"
                                            >
                                                <ExternalLink className="w-3.5 h-3.5" /> Verificar
                                            </a>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <>
                                    {!allCompleted && (
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                            Completa todos los tests activos para obtener tu certificado.
                                        </p>
                                    )}
                                    {allCompleted && !passes && (
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                            Necesitas ≥ 70% de nota general. Tu nota actual es <strong>{score}%</strong>.
                                        </p>
                                    )}
                                    {/* Progress bar */}
                                    <div className="mt-3">
                                        <div className="flex justify-between text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">
                                            <span>Progreso hacia el certificado</span>
                                            <span>{Math.min(score, 100).toFixed(0)}% / 70%</span>
                                        </div>
                                        <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-1000"
                                                style={{
                                                    width: `${Math.min((score / 70) * 100, 100)}%`,
                                                    background: score >= 70
                                                        ? 'linear-gradient(90deg, #22c55e, #10b981)'
                                                        : 'linear-gradient(90deg, #f59e0b, #eab308)'
                                                }}
                                            />
                                        </div>
                                    </div>
                                    {missingTests.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mt-3">
                                            <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest self-center">Pendientes:</span>
                                            {missingTests.map(t => (
                                                <span key={t} className="text-[9px] font-bold bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50 px-2 py-0.5 rounded-full">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Score badge */}
                        <div className={`shrink-0 flex flex-col items-center ${eligible ? '' : 'opacity-40'}`}>
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg border-2 ${
                                eligible
                                    ? 'bg-white dark:bg-slate-900 border-indigo-200 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400'
                                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
                            }`}>
                                {score}%
                            </div>
                            {eligible && (
                                <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CertificateCard;
