
'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';

import PageHeader from '@/components/shared/pageHeader/PageHeader';
import EmployeeCard from '@/components/teams/employee/EmployeeCard';

const TeamsEmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  api
    .get('/teams/users')
    .then((res) => {
      console.log('EMPLOYEES API:', res.data.data);
      setEmployees(res.data.data);
    })
    .catch(console.error)
    .finally(() => setLoading(false));
}, []);


  if (loading) return <div>Yükleniyor…</div>;

  return (
    <>
      <PageHeader />
      <div className="employees-page">
        <div className="row g-4">
          {employees.map((emp) => (
            <div key={emp.id} className="col-xl-3 col-lg-4 col-md-6 col-12">
              <EmployeeCard employee={emp} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TeamsEmployeesPage;