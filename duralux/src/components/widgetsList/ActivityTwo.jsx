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

const ActivityTwo = ({ title = 'Activity' }) => {
  const activities = [
    {
      date: 'Bugün',
      text: 'Yeni teklif formu dolduruldu',
      badge: 'Yeni',
      badgeColor: 'success',
    },
    {
      date: 'Dün',
      text: 'Müşteri geri bildirimi alındı',
      badge: 'Feedback',
      badgeColor: 'primary',
    },
    {
      date: '2 gün önce',
      text: 'Görev tamamlandı',
      badge: 'Done',
      badgeColor: 'info',
    },
  ]

  const handleView = (item) => {
    // İleride detay modalı vb. için kullanılabilir
    console.debug('Activity clicked:', item)
  }

  return (
    <div className="col-xxl-4 col-lg-6">
      <div className="card stretch stretch-full">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">{title}</h5>
        </div>
        <div className="card-body">
          <ul className="list-unstyled mb-0">
            {activities.map((item, idx) => (
              <ActivityListItem
                key={idx}
                {...item}
                onView={() => handleView(item)}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ActivityTwo
