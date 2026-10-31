import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile, LeadershipEvaluation, EvaluationRecommendation } from '../../types';
import {
  Shield,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  History,
  Lock,
  Unlock,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LeaderEvaluationsViewProps {
  currentUser: UserProfile;
}

const EVALUATION_STORAGE_KEY = 'web_track_leadership_evaluations_v2';

export const LeaderEvaluationsView: React.FC<LeaderEvaluationsViewProps> = ({ currentUser }) => {
  const [selectedLeader, setSelectedLeader] = useState<'ghaidaa' | 'retal'>('ghaidaa');
  const [selectedPeriod, setSelectedPeriod] = useState<'q1' | 'q2' | 'history'>('q1');

  // Initial Mock Evaluations
  const defaultEvaluations: Record<string, LeadershipEvaluation> = {
    'ghaidaa-q1': {
      id: 'eval-ghaidaa-q1',
      leaderId: 'ghaidaa',
      leaderName: 'غيداء الشريف',
      period: 'q1',
      status: 'draft',
      scores: {
        commitment: 4,
        quality: 5,
        initiative: null,
        engagement: null,
        collaboration: null,
      },
      strengths: '',
      improvements: '',
      evidence: '',
      recommendations: [
        {
          id: 'rec-1',
          text: 'تخصيص وقت محدد أسبوعياً لمراجعة المشاريع قبل ورشة Git',
          priority: 'medium',
          followupDate: '2026-11-15',
          status: 'in_progress',
        },
      ],
      auditLog: [
        {
          id: 'audit-1',
          action: 'إنشاء مسودة التقييم',
          performedBy: 'عامر الحارثي (مشرف المسار)',
          timestamp: '2026-10-28 14:30',
        },
      ],
    },
    'retal-q1': {
      id: 'eval-retal-q1',
      leaderId: 'retal',
      leaderName: 'ريتال القثامي',
      period: 'q1',
      status: 'draft',
      scores: {
        commitment: null,
        quality: null,
        initiative: null,
        engagement: null,
        collaboration: null,
      },
      strengths: '',
      improvements: '',
      evidence: '',
      recommendations: [],
      auditLog: [
        {
          id: 'audit-2',
          action: 'إنشاء مسودة التقييم',
          performedBy: 'عامر الحارثي (مشرف المسار)',
          timestamp: '2026-10-28 14:35',
        },
      ],
    },
    'ghaidaa-q2': {
      id: 'eval-ghaidaa-q2',
      leaderId: 'ghaidaa',
      leaderName: 'غيداء الشريف',
      period: 'q2',
      status: 'draft',
      scores: {
        commitment: null,
        quality: null,
        initiative: null,
        engagement: null,
        collaboration: null,
      },
      strengths: '',
      improvements: '',
      evidence: '',
      recommendations: [],
      auditLog: [],
    },
    'retal-q2': {
      id: 'eval-retal-q2',
      leaderId: 'retal',
      leaderName: 'ريتال القثامي',
      period: 'q2',
      status: 'draft',
      scores: {
        commitment: null,
        quality: null,
        initiative: null,
        engagement: null,
        collaboration: null,
      },
      strengths: '',
      improvements: '',
      evidence: '',
      recommendations: [],
      auditLog: [],
    },
  };

  // State
  const [evaluations, setEvaluations] = useState<Record<string, LeadershipEvaluation>>(() => {
    const raw = localStorage.getItem(EVALUATION_STORAGE_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return defaultEvaluations;
      }
    }
    return defaultEvaluations;
  });

  const [notificationMsg, setNotificationMsg] = useState('');
  const [isAddRecModalOpen, setIsAddRecModalOpen] = useState(false);
  const [recText, setRecText] = useState('');
  const [recPriority, setRecPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [recDate, setRecDate] = useState('2026-11-20');

  // Unlock reason modal for approved evaluations
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
  const [unlockReason, setUnlockReason] = useState('');

  // Persist
  const saveEvaluations = (updated: Record<string, LeadershipEvaluation>) => {
    setEvaluations(updated);
    localStorage.setItem(EVALUATION_STORAGE_KEY, JSON.stringify(updated));
  };

  const evalKey = `${selectedLeader}-${selectedPeriod === 'history' ? 'q1' : selectedPeriod}`;
  const currentEval = evaluations[evalKey] || {
    id: `eval-${evalKey}`,
    leaderId: selectedLeader,
    leaderName: selectedLeader === 'ghaidaa' ? 'غيداء الشريف' : 'ريتال القثامي',
    period: selectedPeriod === 'q2' ? 'q2' : 'q1',
    status: 'draft',
    scores: { commitment: null, quality: null, initiative: null, engagement: null, collaboration: null },
    strengths: '',
    improvements: '',
    evidence: '',
    recommendations: [],
    auditLog: [],
  };

  const isApproved = currentEval.status === 'approved';

  // Criteria definition with weights
  const criteria = [
    {
      key: 'commitment',
      title: 'الالتزام والمسؤولية',
      weight: 25,
      desc: 'مواعيد الورش والاجتماعات ومتابعة المهام',
    },
    {
      key: 'quality',
      title: 'جودة العمل',
      weight: 25,
      desc: 'دقة المحتوى ومعايير المراجعة',
    },
    {
      key: 'initiative',
      title: 'المبادرة والتطوير',
      weight: 20,
      desc: 'أفكار جديدة وتحسين تجربة العضو',
    },
    {
      key: 'engagement',
      title: 'التفاعل مع الأعضاء',
      weight: 15,
      desc: 'سرعة الرد والدعم والتحفيز',
    },
    {
      key: 'collaboration',
      title: 'التعاون والتواصل',
      weight: 15,
      desc: 'التنسيق بين القائدتين ومع قادة المجالات',
    },
  ];

  // Calculate Weighted Average from filled criteria only
  const calculateWeightedAverage = () => {
    let weightedSum = 0;
    let totalWeight = 0;
    let filledCount = 0;

    criteria.forEach((crit) => {
      const score = currentEval.scores[crit.key];
      if (score !== null && score !== undefined) {
        weightedSum += score * crit.weight;
        totalWeight += crit.weight;
        filledCount += 1;
      }
    });

    if (totalWeight === 0 || filledCount === 0) {
      return { average: null, filledCount, percentage: 0 };
    }

    const average = (weightedSum / totalWeight).toFixed(1);
    const percentage = Math.min(100, Math.round((Number(average) / 5) * 100));
    return { average, filledCount, percentage };
  };

  const { average, filledCount, percentage } = calculateWeightedAverage();

  // Score selection handler
  const handleScoreChange = (critKey: string, scoreVal: number) => {
    if (isApproved) return;
    const updatedScores = { ...currentEval.scores, [critKey]: scoreVal };
    const updatedEval: LeadershipEvaluation = { ...currentEval, scores: updatedScores };
    saveEvaluations({ ...evaluations, [evalKey]: updatedEval });
  };

  // Text fields handler
  const handleTextChange = (field: 'strengths' | 'improvements' | 'evidence', value: string) => {
    if (isApproved) return;
    const updatedEval: LeadershipEvaluation = { ...currentEval, [field]: value };
    saveEvaluations({ ...evaluations, [evalKey]: updatedEval });
  };

  // Add Recommendation
  const handleAddRecommendation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recText.trim() || isApproved) return;

    const newRec: EvaluationRecommendation = {
      id: `rec-${Date.now()}`,
      text: recText.trim(),
      priority: recPriority,
      followupDate: recDate,
      status: 'in_progress',
    };

    const updatedRecs = [...currentEval.recommendations, newRec];
    const updatedEval: LeadershipEvaluation = { ...currentEval, recommendations: updatedRecs };
    saveEvaluations({ ...evaluations, [evalKey]: updatedEval });

    setRecText('');
    setIsAddRecModalOpen(false);
  };

  // Toggle recommendation status
  const handleToggleRecStatus = (recId: string) => {
    if (isApproved) return;
    const updatedRecs = currentEval.recommendations.map((r) =>
      r.id === recId
        ? { ...r, status: (r.status === 'in_progress' ? 'completed' : 'in_progress') as any }
        : r
    );
    saveEvaluations({ ...evaluations, [evalKey]: { ...currentEval, recommendations: updatedRecs } });
  };

  // Save Draft
  const handleSaveDraft = () => {
    const updatedAudit = [
      {
        id: `audit-${Date.now()}`,
        action: 'تحديث المسودة وحفظ التغييرات',
        performedBy: `${currentUser.fullName} (${currentUser.roleTitle || 'مشرف'})`,
        timestamp: new Date().toLocaleString('ar-SA'),
      },
      ...currentEval.auditLog,
    ];

    saveEvaluations({
      ...evaluations,
      [evalKey]: { ...currentEval, auditLog: updatedAudit },
    });

    setNotificationMsg('تم حفظ التقييم كمسودة بنجاح ✓');
    setTimeout(() => setNotificationMsg(''), 3000);
  };

  // Approve Evaluation
  const handleApprove = () => {
    if (filledCount < 5) {
      if (!confirm('لم يتم تقييم جميع المعايير الخمسة بعد. هل تريد اعتماد التقييم بالمعدل الحالي؟')) {
        return;
      }
    }

    const updatedAudit = [
      {
        id: `audit-${Date.now()}`,
        action: 'اعتماد التقييم القيادي وإغلاقه للقراءة فقط',
        performedBy: `${currentUser.fullName} (${currentUser.roleTitle || 'مشرف'})`,
        timestamp: new Date().toLocaleString('ar-SA'),
      },
      ...currentEval.auditLog,
    ];

    saveEvaluations({
      ...evaluations,
      [evalKey]: {
        ...currentEval,
        status: 'approved',
        approvedBy: currentUser.fullName,
        approvedAt: new Date().toLocaleString('ar-SA'),
        auditLog: updatedAudit,
      },
    });

    if (currentUser.settings?.celebrations) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#4285F4', '#34A853', '#F9AB00'],
      });
    }

    setNotificationMsg('تم اعتماد التقييم بنجاح وتوثيقه في سجل التدقيق التاريخي 🔒');
    setTimeout(() => setNotificationMsg(''), 3500);
  };

  // Unlock approved evaluation with audit log
  const handleUnlockWithReason = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unlockReason.trim()) return;

    const updatedAudit = [
      {
        id: `audit-${Date.now()}`,
        action: `إعادة فتح التقييم للتعديل — السبب: ${unlockReason.trim()}`,
        performedBy: `${currentUser.fullName} (${currentUser.roleTitle || 'مشرف'})`,
        timestamp: new Date().toLocaleString('ar-SA'),
      },
      ...currentEval.auditLog,
    ];

    saveEvaluations({
      ...evaluations,
      [evalKey]: {
        ...currentEval,
        status: 'draft',
        auditLog: updatedAudit,
      },
    });

    setIsUnlockModalOpen(false);
    setUnlockReason('');
    setNotificationMsg('تمت إعادة فتح التقييم وتوثيق سبب التعديل في السجل ✓');
    setTimeout(() => setNotificationMsg(''), 3500);
  };

  // Helper for arabic numerals
  const toArNumber = (numStr: string | null) => {
    if (!numStr) return '--';
    const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return numStr.replace(/[0-9]/g, (w) => arabicDigits[+w]).replace('.', '٫');
  };

  return (
    <div
      className="pg"
      style={{
        boxSizing: 'border-box',
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '24px 48px 56px',
        fontFamily: "'IBM Plex Sans Arabic', Arimo, sans-serif",
        color: '#0F172A',
        background: '#fff',
        position: 'relative',
        direction: 'rtl',
      }}
    >
      {/* Title & Badge Row */}
      <div
        className="u"
        style={{
          marginTop: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '48px', lineHeight: 1.1, fontWeight: 800, margin: 0, color: '#0F172A' }}>
            تقييم الأداء القيادي
          </h1>
          <p style={{ fontSize: '18px', marginTop: '4px', color: '#5f6673', margin: 0 }}>
            لتحسين المسار، وليس للمقارنة بين القادة.
          </p>
        </div>

        <span
          className="t"
          style={{
            background: '#E6F4EA',
            color: '#137333',
            display: 'flex',
            gap: '6px',
            alignItems: 'center',
            padding: '8px 18px',
            borderRadius: '99px',
            fontSize: '15px',
            fontWeight: 700,
          }}
        >
          <Shield size={18} />
          <span>خاص بالمشرفين والقائد المعني</span>
        </span>
      </div>

      {/* Tabs Filter Row */}
      <div
        className="u"
        style={{
          marginTop: '20px',
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        {/* Leaders Tabs */}
        <div
          className="tabs"
          style={{
            display: 'inline-flex',
            gap: '4px',
            background: '#F1F3F4',
            borderRadius: '99px',
            padding: '5px',
          }}
        >
          <a
            onClick={() => setSelectedLeader('ghaidaa')}
            className={selectedLeader === 'ghaidaa' ? 'on' : ''}
            style={{
              padding: '10px 22px',
              borderRadius: '99px',
              fontWeight: 600,
              fontSize: '17px',
              color: selectedLeader === 'ghaidaa' ? '#fff' : '#3C4043',
              background: selectedLeader === 'ghaidaa' ? '#0F172A' : 'transparent',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            {selectedLeader === 'ghaidaa' && (
              <span
                style={{
                  display: 'inline-block',
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  background: '#F9AB00',
                  marginInlineEnd: '8px',
                }}
              />
            )}
            غيداء الشريف
          </a>

          <a
            onClick={() => setSelectedLeader('retal')}
            className={selectedLeader === 'retal' ? 'on' : ''}
            style={{
              padding: '10px 22px',
              borderRadius: '99px',
              fontWeight: 600,
              fontSize: '17px',
              color: selectedLeader === 'retal' ? '#fff' : '#3C4043',
              background: selectedLeader === 'retal' ? '#0F172A' : 'transparent',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            {selectedLeader === 'retal' && (
              <span
                style={{
                  display: 'inline-block',
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  background: '#F9AB00',
                  marginInlineEnd: '8px',
                }}
              />
            )}
            ريتال القثامي
          </a>
        </div>

        {/* Periods Tabs */}
        <div
          className="tabs"
          style={{
            display: 'inline-flex',
            gap: '4px',
            background: '#F1F3F4',
            borderRadius: '99px',
            padding: '5px',
          }}
        >
          <a
            onClick={() => setSelectedPeriod('q1')}
            className={selectedPeriod === 'q1' ? 'on' : ''}
            style={{
              padding: '10px 22px',
              borderRadius: '99px',
              fontWeight: 600,
              fontSize: '17px',
              color: selectedPeriod === 'q1' ? '#fff' : '#3C4043',
              background: selectedPeriod === 'q1' ? '#0F172A' : 'transparent',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            {selectedPeriod === 'q1' && (
              <span
                style={{
                  display: 'inline-block',
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  background: '#F9AB00',
                  marginInlineEnd: '8px',
                }}
              />
            )}
            الربع الأول
          </a>

          <a
            onClick={() => setSelectedPeriod('q2')}
            className={selectedPeriod === 'q2' ? 'on' : ''}
            style={{
              padding: '10px 22px',
              borderRadius: '99px',
              fontWeight: 600,
              fontSize: '17px',
              color: selectedPeriod === 'q2' ? '#fff' : '#3C4043',
              background: selectedPeriod === 'q2' ? '#0F172A' : 'transparent',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            {selectedPeriod === 'q2' && (
              <span
                style={{
                  display: 'inline-block',
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  background: '#F9AB00',
                  marginInlineEnd: '8px',
                }}
              />
            )}
            الربع الثاني
          </a>

          <a
            onClick={() => setSelectedPeriod('history')}
            className={selectedPeriod === 'history' ? 'on' : ''}
            style={{
              padding: '10px 22px',
              borderRadius: '99px',
              fontWeight: 600,
              fontSize: '17px',
              color: selectedPeriod === 'history' ? '#fff' : '#3C4043',
              background: selectedPeriod === 'history' ? '#0F172A' : 'transparent',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            {selectedPeriod === 'history' && (
              <span
                style={{
                  display: 'inline-block',
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  background: '#F9AB00',
                  marginInlineEnd: '8px',
                }}
              />
            )}
            سجل التقييمات
          </a>
        </div>

        {/* Status Badge */}
        {selectedPeriod !== 'history' && (
          <span
            className="t"
            style={{
              background: isApproved ? '#E6F4EA' : '#FFF4D6',
              color: isApproved ? '#137333' : '#b06000',
              padding: '6px 16px',
              borderRadius: '99px',
              fontSize: '15px',
              fontWeight: 700,
            }}
          >
            {isApproved ? `معتمد من ${currentEval.approvedBy} 🔒` : 'مسودة · لم تُعتمد'}
          </span>
        )}
      </div>

      {notificationMsg && (
        <div
          style={{
            marginTop: '16px',
            padding: '12px 20px',
            backgroundColor: '#E6F4EA',
            border: '2px solid #34A853',
            borderRadius: '16px',
            color: '#137333',
            fontWeight: 700,
            fontSize: '15px',
            textAlign: 'center',
          }}
        >
          {notificationMsg}
        </div>
      )}

      {selectedPeriod === 'history' ? (
        /* History & Audit Log Screen */
        <div
          className="k u"
          style={{
            marginTop: '20px',
            padding: '28px',
            border: '2px solid #0F172A',
            borderRadius: '28px',
            background: '#fff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <History size={22} style={{ color: '#4285F4' }} />
            <b style={{ fontSize: '22px', color: '#0F172A' }}>سجل التقييمات والتدقيق التاريخي</b>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {currentEval.auditLog.length === 0 ? (
              <p style={{ color: '#5f6673', fontSize: '16px' }}>لا توجد سجلات تدقيق سابقة لهذه الفترة.</p>
            ) : (
              currentEval.auditLog.map((log) => (
                <div
                  key={log.id}
                  style={{
                    padding: '16px 20px',
                    borderRadius: '18px',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '10px',
                  }}
                >
                  <div>
                    <b style={{ fontSize: '16px', color: '#0F172A', display: 'block' }}>{log.action}</b>
                    <span style={{ fontSize: '14px', color: '#5f6673' }}>بواسطة: {log.performedBy}</span>
                  </div>
                  <span style={{ fontSize: '13px', color: '#94A3B8', fontFamily: 'Arimo' }}>{log.timestamp}</span>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        /* Active Evaluation Form */
        <>
          {/* Main Scoring Grid */}
          <div
            className="row u"
            style={{
              animationDelay: '.6s',
              marginTop: '20px',
              display: 'flex',
              gap: '24px',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
            }}
          >
            {/* Left Column: Criteria (flex: 3) */}
            <div
              className="k"
              style={{
                flex: '3',
                minWidth: '320px',
                padding: '8px 28px',
                border: '2px solid #0F172A',
                borderRadius: '28px',
                background: '#fff',
              }}
            >
              {criteria.map((crit, idx) => {
                const score = currentEval.scores[crit.key];
                return (
                  <div
                    key={crit.key}
                    style={{
                      display: 'flex',
                      gap: '18px',
                      alignItems: 'center',
                      padding: '18px 0',
                      borderTop: idx === 0 ? 'none' : '1px solid #E8EAED',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: '220px' }}>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <b style={{ fontSize: '20px', color: '#0F172A' }}>{crit.title}</b>
                        <span
                          className="t"
                          style={{
                            background: '#fff',
                            border: '1.5px solid #c9ced3',
                            borderRadius: '99px',
                            padding: '3px 12px',
                            fontSize: '13px',
                            fontWeight: 700,
                            color: '#0F172A',
                          }}
                        >
                          الوزن {crit.weight}٪
                        </span>
                      </div>
                      <p style={{ fontSize: '15px', color: '#3c4452', marginTop: '4px', margin: '4px 0 0' }}>
                        {crit.desc}
                      </p>
                    </div>

                    {/* Score Buttons 1 to 5 (No prefilled default) */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {[1, 2, 3, 4, 5].map((val) => {
                        const isSelected = score === val;
                        return (
                          <button
                            key={val}
                            type="button"
                            disabled={isApproved}
                            onClick={() => handleScoreChange(crit.key, val)}
                            style={{
                              width: '46px',
                              height: '46px',
                              borderRadius: '14px',
                              border: isSelected ? '2px solid #4285F4' : '2px solid #c9ced3',
                              backgroundColor: isSelected ? '#4285F4' : '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontFamily: 'Arimo',
                              fontWeight: isSelected ? 800 : 600,
                              fontSize: isSelected ? '20px' : '18px',
                              color: isSelected ? '#0F172A' : '#5f6673',
                              cursor: isApproved ? 'default' : 'pointer',
                              transition: 'all 0.2s ease',
                              outline: 'none',
                            }}
                          >
                            {val}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              <p style={{ padding: '14px 0 8px', fontSize: '15px', color: '#5f6673', margin: 0 }}>
                الأوزان قابلة للتعديل، وكل درجة بدون اختيار مسبق.
              </p>
            </div>

            {/* Right Column: Score & Recommendations (flex: 2) */}
            <div
              style={{
                flex: '2',
                minWidth: '280px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              {/* Average Card */}
              <div
                className="k"
                style={{
                  border: '3px solid #4285F4',
                  borderRadius: '28px',
                  padding: '24px',
                  background: '#fff',
                }}
              >
                <b style={{ fontSize: '20px', color: '#0F172A' }}>المعدل حتى الآن</b>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '8px 0' }}>
                  <b style={{ fontFamily: 'Arimo', fontSize: '64px', lineHeight: 1, color: '#0F172A' }}>
                    {toArNumber(average)}
                  </b>
                  <span style={{ fontSize: '18px', color: '#5f6673' }}>
                    من ٥ · {filledCount === 0 ? 'لم تُقيّم معايير بعد' : `${filledCount} معايير من ٥`}
                  </span>
                </div>

                {/* Progress Bar */}
                <div
                  style={{
                    height: '12px',
                    backgroundColor: '#E8EAED',
                    borderRadius: '6px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${percentage}%`,
                      backgroundColor: '#4285F4',
                      borderRadius: '6px',
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>

                <p style={{ marginTop: '12px', fontSize: '15px', color: '#3c4452', margin: '12px 0 0' }}>
                  يُعتمد المعدل النهائي بعد تقييم المعايير الخمسة. مقارنة بالربع السابق: ستظهر لما يتوفر تقييم سابق.
                </p>
              </div>

              {/* Recommendations Card */}
              <div
                className="k"
                style={{
                  border: '2px solid #0F172A',
                  borderRadius: '28px',
                  padding: '24px',
                  background: '#fff',
                }}
              >
                <b style={{ fontSize: '20px', color: '#0F172A' }}>التوصيات</b>

                <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {currentEval.recommendations.length === 0 ? (
                    <p style={{ fontSize: '15px', color: '#5f6673', margin: 0 }}>لا توجد توصيات مسجلة بعد.</p>
                  ) : (
                    currentEval.recommendations.map((rec) => {
                      const isDone = rec.status === 'completed';
                      return (
                        <div
                          key={rec.id}
                          onClick={() => handleToggleRecStatus(rec.id)}
                          style={{
                            padding: '12px 14px',
                            borderRadius: '16px',
                            background: isDone ? '#E6F4EA' : '#F7F7F4',
                            border: '1px solid #E2E8F0',
                            cursor: isApproved ? 'default' : 'pointer',
                          }}
                        >
                          <b style={{ fontSize: '16px', color: '#0F172A', display: 'block' }}>{rec.text}</b>
                          <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                            <span
                              className="t"
                              style={{
                                background: rec.priority === 'high' ? '#FCE8E6' : '#FFF1CC',
                                color: rec.priority === 'high' ? '#C5221F' : '#b06000',
                                borderRadius: '99px',
                                padding: '3px 10px',
                                fontSize: '13px',
                                fontWeight: 700,
                              }}
                            >
                              {rec.priority === 'high' ? 'أولوية عالية' : 'أولوية متوسطة'}
                            </span>

                            <span
                              className="t"
                              style={{
                                background: isDone ? '#CEEAD6' : '#E8F0FE',
                                color: isDone ? '#137333' : '#1a73e8',
                                borderRadius: '99px',
                                padding: '3px 10px',
                                fontSize: '13px',
                                fontWeight: 700,
                              }}
                            >
                              {isDone ? 'مكتملة ✓' : 'قيد التنفيذ'}
                            </span>

                            {rec.followupDate && (
                              <span style={{ fontSize: '12px', color: '#64748B', alignSelf: 'center', fontFamily: 'Arimo' }}>
                                حتى {rec.followupDate}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}

                  {!isApproved && (
                    <button
                      type="button"
                      onClick={() => setIsAddRecModalOpen(true)}
                      className="b cursor-pointer hover:bg-gray-200 transition-colors"
                      style={{
                        background: '#F1F3F4',
                        border: 'none',
                        borderRadius: '99px',
                        padding: '12px 20px',
                        fontWeight: 700,
                        fontSize: '16px',
                        color: '#0F172A',
                        display: 'flex',
                        gap: '6px',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '4px',
                      }}
                    >
                      <Plus size={18} />
                      <span>إضافة توصية</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Qualitative Textareas Row */}
          <div
            className="row u"
            style={{
              animationDelay: '.8s',
              marginTop: '18px',
              display: 'flex',
              gap: '18px',
              flexWrap: 'wrap',
            }}
          >
            {/* 1. نقاط القوة */}
            <div
              className="k"
              style={{
                flex: '1',
                minWidth: '260px',
                padding: '20px',
                border: '2px solid #0F172A',
                borderRadius: '28px',
                background: '#fff',
              }}
            >
              <b style={{ fontSize: '18px', color: '#0F172A' }}>نقاط القوة</b>
              <textarea
                aria-label="نقاط القوة"
                disabled={isApproved}
                value={currentEval.strengths}
                onChange={(e) => handleTextChange('strengths', e.target.value)}
                placeholder="اكتبي مثالًا محددًا"
                style={{
                  display: 'block',
                  width: '100%',
                  boxSizing: 'border-box',
                  height: '110px',
                  marginTop: '10px',
                  border: '2px solid #c9ced3',
                  borderRadius: '14px',
                  padding: '12px',
                  fontSize: '16px',
                  fontFamily: 'inherit',
                  outline: 'none',
                  resize: 'none',
                  backgroundColor: isApproved ? '#F8FAFC' : '#fff',
                }}
              />
            </div>

            {/* 2. فرص التحسين */}
            <div
              className="k"
              style={{
                flex: '1',
                minWidth: '260px',
                padding: '20px',
                border: '2px solid #0F172A',
                borderRadius: '28px',
                background: '#fff',
              }}
            >
              <b style={{ fontSize: '18px', color: '#0F172A' }}>فرص التحسين</b>
              <textarea
                aria-label="فرص التحسين"
                disabled={isApproved}
                value={currentEval.improvements}
                onChange={(e) => handleTextChange('improvements', e.target.value)}
                placeholder="ما الذي يمكن أن يتطور؟"
                style={{
                  display: 'block',
                  width: '100%',
                  boxSizing: 'border-box',
                  height: '110px',
                  marginTop: '10px',
                  border: '2px solid #c9ced3',
                  borderRadius: '14px',
                  padding: '12px',
                  fontSize: '16px',
                  fontFamily: 'inherit',
                  outline: 'none',
                  resize: 'none',
                  backgroundColor: isApproved ? '#F8FAFC' : '#fff',
                }}
              />
            </div>

            {/* 3. ملاحظات وأدلة */}
            <div
              className="k"
              style={{
                flex: '1',
                minWidth: '260px',
                padding: '20px',
                border: '2px solid #0F172A',
                borderRadius: '28px',
                background: '#fff',
              }}
            >
              <b style={{ fontSize: '18px', color: '#0F172A' }}>ملاحظات وأدلة</b>
              <textarea
                aria-label="ملاحظات وأدلة"
                disabled={isApproved}
                value={currentEval.evidence}
                onChange={(e) => handleTextChange('evidence', e.target.value)}
                placeholder="روابط أو وقائع تدعم التقييم"
                style={{
                  display: 'block',
                  width: '100%',
                  boxSizing: 'border-box',
                  height: '110px',
                  marginTop: '10px',
                  border: '2px solid #c9ced3',
                  borderRadius: '14px',
                  padding: '12px',
                  fontSize: '16px',
                  fontFamily: 'inherit',
                  outline: 'none',
                  resize: 'none',
                  backgroundColor: isApproved ? '#F8FAFC' : '#fff',
                }}
              />
            </div>
          </div>

          {/* Action Buttons Row */}
          <div
            className="u"
            style={{
              animationDelay: '1s',
              marginTop: '18px',
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            {!isApproved ? (
              <>
                <button
                  type="button"
                  onClick={handleApprove}
                  className="b bl cursor-pointer hover:opacity-95 transition-transform active:scale-95"
                  style={{
                    backgroundColor: '#4285F4',
                    border: '2px solid #0F172A',
                    borderRadius: '99px',
                    padding: '12px 32px',
                    fontWeight: 700,
                    fontSize: '18px',
                    minHeight: '48px',
                    color: '#0F172A',
                    boxShadow: '0 4px 0 0 #0F172A',
                  }}
                >
                  اعتماد التقييم
                </button>

                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="b cursor-pointer hover:bg-gray-200 transition-colors"
                  style={{
                    background: '#F1F3F4',
                    border: '2px solid #0F172A',
                    borderRadius: '99px',
                    padding: '12px 30px',
                    fontWeight: 700,
                    fontSize: '18px',
                    minHeight: '48px',
                    color: '#0F172A',
                  }}
                >
                  حفظ كمسودة
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsUnlockModalOpen(true)}
                className="b cursor-pointer hover:bg-gray-100 transition-colors"
                style={{
                  background: '#FFF4D6',
                  border: '2px solid #0F172A',
                  borderRadius: '99px',
                  padding: '12px 26px',
                  fontWeight: 700,
                  fontSize: '16px',
                  minHeight: '48px',
                  color: '#0F172A',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 0 0 #0F172A',
                }}
              >
                <Unlock size={18} />
                <span>إعادة فتح التقييم مع توثيق السبب في سجل التدقيق</span>
              </button>
            )}

            <span style={{ fontSize: '15px', color: '#5f6673' }}>
              بعد الاعتماد لا يُعدَّل إلا مع تسجيل التغيير.
            </span>
          </div>
        </>
      )}

      {/* Add Recommendation Modal */}
      <AnimatePresence>
        {isAddRecModalOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(4px)',
            }}
            onClick={() => setIsAddRecModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: '#fff',
                borderRadius: '28px',
                padding: '30px',
                maxWidth: '500px',
                width: '100%',
                border: '2px solid #0F172A',
                boxShadow: '0 12px 0 0 #0F172A',
                textAlign: 'right',
                direction: 'rtl',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <b style={{ fontSize: '22px', color: '#0F172A' }}>إضافة توصية للمتابعة</b>
                <button
                  type="button"
                  onClick={() => setIsAddRecModalOpen(false)}
                  style={{
                    background: '#F1F3F4',
                    border: 'none',
                    borderRadius: '50%',
                    width: '34px',
                    height: '34px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddRecommendation} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>
                    نص التوصية
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={recText}
                    onChange={(e) => setRecText(e.target.value)}
                    placeholder="اكتبي التوصية المحددة وخطة التحسين..."
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '12px',
                      borderRadius: '14px',
                      border: '2px solid #0F172A',
                      outline: 'none',
                      fontSize: '15px',
                      fontFamily: 'inherit',
                      resize: 'none',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>
                      الأولوية
                    </label>
                    <select
                      value={recPriority}
                      onChange={(e) => setRecPriority(e.target.value as any)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '12px',
                        border: '2px solid #0F172A',
                        outline: 'none',
                        fontFamily: 'inherit',
                        fontSize: '14px',
                      }}
                    >
                      <option value="medium">أولوية متوسطة</option>
                      <option value="high">أولوية عالية</option>
                      <option value="low">أولوية منخفضة</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>
                      تاريخ المتابعة
                    </label>
                    <input
                      type="date"
                      value={recDate}
                      onChange={(e) => setRecDate(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '12px',
                        border: '2px solid #0F172A',
                        outline: 'none',
                        fontFamily: 'inherit',
                        fontSize: '14px',
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setIsAddRecModalOpen(false)}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '99px',
                      border: 'none',
                      background: '#F1F3F4',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '10px 26px',
                      borderRadius: '99px',
                      border: '2px solid #0F172A',
                      background: '#4285F4',
                      color: '#0F172A',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: '0 3px 0 0 #0F172A',
                    }}
                  >
                    حفظ التوصية
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Unlock with Audit Reason Modal */}
      <AnimatePresence>
        {isUnlockModalOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(4px)',
            }}
            onClick={() => setIsUnlockModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: '#fff',
                borderRadius: '28px',
                padding: '30px',
                maxWidth: '480px',
                width: '100%',
                border: '2px solid #0F172A',
                boxShadow: '0 12px 0 0 #0F172A',
                textAlign: 'right',
                direction: 'rtl',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <b style={{ fontSize: '20px', color: '#0F172A' }}>إعادة فتح التقييم وتوثيق التغيير</b>
                <button
                  type="button"
                  onClick={() => setIsUnlockModalOpen(false)}
                  style={{
                    background: '#F1F3F4',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              <p style={{ fontSize: '14px', color: '#5f6673', margin: '0 0 14px' }}>
                وفق سياسات الحوكمة، يتم تسجيل أي تعديل لاحق على التقييم المعتمد في سجل التدقيق التاريخي باسم المشرف وتاريخ التعديل.
              </p>

              <form onSubmit={handleUnlockWithReason} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>
                    سبب التعديل أو التحديث <span style={{ color: '#EA4335' }}>*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={unlockReason}
                    onChange={(e) => setUnlockReason(e.target.value)}
                    placeholder="مثال: إضافة توصية جديدة بعد مراجعة تقرير ورشة العمل..."
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '12px',
                      borderRadius: '14px',
                      border: '2px solid #0F172A',
                      outline: 'none',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                      resize: 'none',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setIsUnlockModalOpen(false)}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '99px',
                      border: 'none',
                      background: '#F1F3F4',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={!unlockReason.trim()}
                    style={{
                      padding: '10px 26px',
                      borderRadius: '99px',
                      border: '2px solid #0F172A',
                      background: '#F9AB00',
                      color: '#0F172A',
                      fontWeight: 800,
                      cursor: !unlockReason.trim() ? 'not-allowed' : 'pointer',
                      opacity: !unlockReason.trim() ? 0.6 : 1,
                      boxShadow: '0 3px 0 0 #0F172A',
                    }}
                  >
                    تأكيد الفتح والتسجيل
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
