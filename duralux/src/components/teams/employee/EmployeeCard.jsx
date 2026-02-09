'use client';

import { useRouter } from 'next/navigation';
import { FiSettings } from 'react-icons/fi';
import { FiEye } from 'react-icons/fi';

const EmployeeCard = ({ employee }) => {
    const router = useRouter();

    const {
        id,
        fullName,
        role,
        image,
        status,
        teams = [],
    } = employee;

    return (
        <div className="employee-card position-relative">
            <button
                className="employee-profile-btn"
                title="Profili Görüntüle"
                onClick={() => router.push(`/teams/employees/${id}`)}
            >
                <FiEye size={20} />
            </button>


            <div className="employee-avatar-wrapper">
                <img
                    src={image || '/images/avatar/default.png'}
                    alt={fullName}
                    className="employee-image"
                />
                <span className={`employee-status ${status}`} />
            </div>

            <div className="employee-name">{fullName}</div>

            <div className="employee-role">{role}</div>

            {/* <div className="employee-teams mt-2">
                {employee.teams.map((team) => (
                    <span
                        key={team}
                        className="badge badge-soft-danger me-1"
                    >
                        {team}
                    </span>
                ))}
            </div> */}
  <div className="employee-teams mt-2">
  {employee.teams.map((team) => (
    <span
      key={team}
      className="employee-team-item"
    >
      {team}
    </span>
  ))}
</div>




        </div>
    );
};

export default EmployeeCard;


{/* <div className="employee-teams mt-2">
  {employee.teams.map((team) => (
    <span
      key={team}
      className="badge rounded-pill bg-light text-dark border"
    >
      {team}
    </span>
  ))}
</div> */}
