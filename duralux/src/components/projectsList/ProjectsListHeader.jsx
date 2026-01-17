import React from 'react'
import { FiBarChart, FiFilter, FiPaperclip, FiPlus } from 'react-icons/fi'
import Dropdown from '@/components/shared/Dropdown'
import { fileType } from '../teams/TeamsHeader'
import ProjectsStatistics from '../widgetsStatistics/ProjectsStatistics'
import Link from 'next/link'

const options = [
  { label: "Hepsi", color: "bg-primary" },
  // { label: "On Hold", color: "bg-indigo" },
  { label: "Beklemede", color: "bg-warning" },
  { label: "Tamamlandı", color: "bg-success" },
  // { label: "Declined", color: "bg-danger" },
  { label: "Devam Ediyor", color: "bg-teal" },
  { label: "Başlanmadı", color: "bg-success" },
   { label: "Görevlerim", color: "bg-warning" }
];
const ProjectsListHeader = () => {
  return (
    <>
      <div className="d-flex align-items-center gap-2 page-header-right-items-wrapper">
        {/* <a href="#" className="btn btn-icon btn-light-brand" data-bs-toggle="collapse" data-bs-target="#collapseOne">
          <FiBarChart size={16} />
        </a> */}
        <Dropdown
          dropdownItems={options}
          triggerPosition={"0, 10"}
          triggerIcon={<FiFilter size={16} strokeWidth={1.6} />}
          triggerClass='btn btn-icon btn-light-brand'
          isAvatar={false}
          dropdownAutoClose={"outside"}
          isItemIcon={false}
        />
        <Dropdown
          dropdownItems={fileType}
          triggerPosition={"0, 12"}
          triggerIcon={<FiPaperclip size={16} strokeWidth={1.6} />}
          triggerClass='btn btn-icon btn-light-brand'
          isAvatar={false}
          iconStrokeWidth={0}
        />
        <Link href="/projects/create" className="btn btn-primary">
          <FiPlus size={16} className='me-2' />
          <span>Görev Oluştur</span>
        </Link>
      </div>
      <div id="collapseOne" className="accordion-collapse collapse page-header-collapse">
        <div className="accordion-body pb-2">
          <div className="row">
            <ProjectsStatistics />
          </div>
        </div>
      </div>
    </>
  )
}

export default ProjectsListHeader