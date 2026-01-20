import React from 'react';
import { FiPlus } from 'react-icons/fi';
import Link from 'next/link';

const TeamsHeader = () => {
  return (
    <div className="d-flex align-items-center gap-2 page-header-right-items-wrapper">
     <Link
  href="/teams/create"
  className="btn text-white"
  style={{
    backgroundColor: "#E92B63",
    borderColor: "#E92B63",
  }}
>
  <FiPlus size={16} className="me-2" />
  <span>Ekip Oluştur</span>
</Link>

    </div>
  );
};

export default TeamsHeader;