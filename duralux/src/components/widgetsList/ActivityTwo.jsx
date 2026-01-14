'use client'
import { FiEye, FiMoreVertical } from 'react-icons/fi'

export const ActivityListItem = ({
  date,
  text,
  badge,
  badgeColor = 'secondary',
  onView,
  isSystem = false,
}) => {
  return (
    <li
      className={`d-flex justify-content-between align-items-start py-2 ${
        isSystem ? 'opacity-75' : ''
      }`}
    >
      <div>
        <small className="text-muted d-block">{date}</small>

        <div className="fw-semibold">
          {text}
          {badge && (
            <span className={`badge bg-soft-${badgeColor} text-${badgeColor} ms-2`}>
              {badge}
            </span>
          )}
        </div>
      </div>

      <div className="ms-3 d-flex gap-2">
        <button
          className="avatar-text avatar-sm"
          title="Aktiviteyi Gör"
          onClick={onView}
        >
          <FiEye size={14} />
        </button>

        <button className="avatar-text avatar-sm" title="Diğer">
          <FiMoreVertical size={14} />
        </button>
      </div>
    </li>
  )
};
