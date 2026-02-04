'use client';
import PageHeader from '@/components/shared/pageHeader/PageHeader';

import EmployeeCard from '@/components/teams/employee/EmployeeCard';

const TeamsEmployeesPage = () => {
    const employees = [
        {
            id: 1,
            fullName: 'Ayşegül Altıntaş',
            role: 'UI/UX Designer',
            status: 'active',
            image: null,
            teams: [
                { id: 1, name: 'CRM' },
                { id: 2, name: 'UI/UX' },
            ],
        },
        {
            id: 2,
            fullName: 'Sude Filikci',
            role: 'Frontend Developer',
            status: 'izinli',
            image: null,
            teams: [{ id: 1, name: 'CRM' }],
        },
        {
            id: 3,
            fullName: 'Ahmet Burak Kır',
            role: 'Backend Developer',
            status: 'active',
            image: null,
            teams: [{ id: 1, name: 'Otomasyon' }],
        },
        {
            id: 4,
            fullName: 'Eren Gündoğdu',
            role: 'Project Manager',
            status: 'pasif',
            image: null,
            teams: [{ id: 1, name: 'CRM' }],
        },
          {
            id: 4,
            fullName: 'Eren Gündoğdu',
            role: 'Project Manager',
            status: 'pasif',
            image: null,
            teams: [{ id: 1, name: 'CRM' }],
        },
          {
            id: 4,
            fullName: 'Eren Gündoğdu',
            role: 'Project Manager',
            status: 'pasif',
            image: null,
            teams: [{ id: 1, name: 'CRM' }],
        },
    ];


   return (
    <><PageHeader>
    </PageHeader>
    

      <div className="employees-page">
        <div className="row g-4">
          {employees.map(emp => (
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
