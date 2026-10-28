import React from 'react';

const PETAL = 'M0 0L0 -46A46 46 0 0 1 46 0Q20 -26 0 0Z';

export function Pinwheel({ color = '#fff', className = '' }: { color?: string; className?: string }) {
  return (
    <svg viewBox="-50 -50 100 100" aria-hidden="true" className={className}>
      <g fill={color}>
        {[0, 90, 180, 270].map((r) => (
          <path key={r} d={PETAL} transform={`rotate(${r})`} />
        ))}
      </g>
    </svg>
  );
}

export function KpiTile({
  label,
  value,
  color,
  onClick,
  style,
}: {
  label: string;
  value: string | number;
  color: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}) {
  return (
    <button className="kpi rise" style={{ background: color, ...style }} onClick={onClick} type="button">
      <Pinwheel className="kpi__shape" />
      <span className="kpi__label">{label}</span>
      <strong className="kpi__value">{value}</strong>
    </button>
  );
}

export function PathWave({ percent }: { percent: number | null }) {
  if (percent === null) {
    return (
      <div className="wave-card rise" style={{ '--i': 5 } as React.CSSProperties}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: 700, color: '#0F172A' }}>موجة المسار</h3>
        <p style={{ margin: 0, fontSize: '15px', color: '#475569' }}>لا توجد بيانات كافية بعد</p>
      </div>
    );
  }
  const p = Math.max(0, Math.min(100, percent));
  const y = 120 - p; // كلما زادت النسبة ارتفعت الموجة
  const layers: [string, number][] = [
    ['#F9AB00', 0],
    ['#4285F4', 8],
    ['#34A853', 16],
  ];
  return (
    <div className="wave-card rise" style={{ '--i': 5 } as React.CSSProperties}>
      <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: 700, color: '#0F172A' }}>موجة المسار</h3>
      <p style={{ margin: 0, fontSize: '15px', color: '#475569' }}>{p}% من مهام هذه الفترة اكتملت</p>
      <svg viewBox="0 0 400 130" preserveAspectRatio="none" className="wave" aria-hidden="true">
        {layers.map(([c, o], i) => (
          <path
            key={c}
            fill={c}
            className={`wave__p wave__p--${i}`}
            d={`M0 ${y + o}C80 ${y + o - 30} 130 ${y + o + 30} 200 ${y + o}S320 ${y + o - 30} 400 ${y + o}V130H0Z`}
          />
        ))}
      </svg>
      <span className="wave__num">{p}%</span>
    </div>
  );
}

export function QuickCreate({
  onNew,
}: {
  onNew: (t: 'workshop' | 'task' | 'poll' | 'announcement') => void;
}) {
  const items: [string, string, 'workshop' | 'task' | 'poll' | 'announcement'][] = [
    ['+ ورشة', '#4285F4', 'workshop'],
    ['+ مهمة', '#F9AB00', 'task'],
    ['+ استبيان', '#34A853', 'poll'],
    ['+ إعلان', '#EA4335', 'announcement'],
  ];
  return (
    <div className="quick rise" style={{ '--i': 4 } as React.CSSProperties}>
      <b style={{ fontSize: '18px', color: '#0F172A' }}>أنشئي:</b>
      {items.map(([t, c, k]) => (
        <button
          key={k}
          className="pill"
          style={{ background: c }}
          onClick={() => onNew(k)}
          type="button"
        >
          {t}
        </button>
      ))}
    </div>
  );
}
