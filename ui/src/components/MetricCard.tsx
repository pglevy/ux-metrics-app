/**
 * MetricCard Component
 *
 * Large format metric display for dashboard visualizations.
 * Features gradient accent borders, large numerals, and optional trend indicators.
 */

interface MetricCardProps {
  label: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  variant?: 'success' | 'primary' | 'warning' | 'info' | 'purple' | 'neutral'
  size?: 'small' | 'large'
}

export default function MetricCard({
  label,
  value,
  subtitle,
  icon,
  variant = 'primary',
  size = 'small'
}: MetricCardProps) {
  const variantClasses = {
    success: 'metric-card-success',
    primary: 'metric-card-primary',
    warning: 'metric-card-warning',
    info: 'metric-card-info',
    purple: 'metric-card-purple',
    neutral: 'metric-card-neutral'
  }

  const iconVariantClasses = {
    success: 'icon-gradient-green',
    primary: 'icon-gradient-blue',
    warning: 'icon-gradient-orange',
    info: 'icon-gradient-blue',
    purple: 'icon-gradient-purple',
    neutral: 'bg-gray-100 text-gray-600'
  }

  return (
    <div className={`metric-card-wrapper ${variantClasses[variant]}`}>
      {size === 'large' && icon && (
        <div className="flex items-center justify-between mb-5">
          <div className={`metric-icon-lg ${iconVariantClasses[variant]}`}>
            {icon}
          </div>
        </div>
      )}

      <div className="metric-label mb-3">{label}</div>
      <div className={`metric-value ${size === 'large' ? 'text-5xl' : 'text-4xl'} mb-2`}>
        {value}
      </div>
      {subtitle && (
        <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
          {subtitle}
        </div>
      )}

      <style>{`
        .metric-card-wrapper {
          position: relative;
          padding: 28px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          transition: all var(--transition-base);
          overflow: hidden;
          animation: scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) backwards;
        }

        .metric-card-wrapper::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
        }

        .metric-card-success::before {
          background: linear-gradient(90deg, #1CC101, #56ADC0);
        }

        .metric-card-primary::before {
          background: linear-gradient(90deg, #2322F0, #3F8EEE);
        }

        .metric-card-warning::before {
          background: linear-gradient(90deg, #FAA92F, #D97706);
        }

        .metric-card-info::before {
          background: linear-gradient(90deg, #3F8EEE, #2322F0);
        }

        .metric-card-purple::before {
          background: linear-gradient(90deg, #B561FF, #2322F0);
        }

        .metric-card-neutral::before {
          background: linear-gradient(90deg, #A3A3A3, #525252);
        }

        .metric-card-wrapper:hover {
          border-color: var(--border-color-hover);
          box-shadow: var(--shadow-xl);
          transform: translateY(-4px);
        }

        .metric-icon-lg {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform var(--transition-base);
        }

        .metric-card-wrapper:hover .metric-icon-lg {
          transform: scale(1.1) rotate(5deg);
        }
      `}</style>
    </div>
  )
}
