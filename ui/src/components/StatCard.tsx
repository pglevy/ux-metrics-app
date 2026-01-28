/**
 * StatCard Component
 *
 * Displays a key metric with icon, value, and trend indicator.
 * Features gradient accent borders and hover animations.
 */

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string | number
  subtitle?: string
  trend?: {
    value: string
    positive?: boolean
  }
  variant: 'blue' | 'green' | 'purple' | 'orange'
}

export default function StatCard({ icon, label, value, subtitle, trend, variant }: StatCardProps) {
  return (
    <div className={`stat-card stat-card-${variant}`}>
      <div className="flex items-start gap-4">
        <div className={`stat-icon icon-gradient-${variant}`}>
          {icon}
        </div>
        <div className="flex-1">
          <div className="metric-label mb-2">{label}</div>
          <div className="metric-value text-4xl mb-1">{value}</div>
          {subtitle && (
            <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              {subtitle}
            </div>
          )}
          {trend && (
            <div
              className="text-sm font-semibold mt-2"
              style={{ color: trend.positive ? '#117C00' : 'var(--text-tertiary)' }}
            >
              {trend.value}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform var(--transition-base);
        }

        .stat-card:hover .stat-icon {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  )
}
