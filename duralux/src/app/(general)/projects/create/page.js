import React from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import TaskCreateContent from '@/components/tasks/TaskCreateContent'

const page = () => {
  return (
    <>
      <PageHeader title="Görev Oluştur" />

      <div className="main-content">
        <div className="row">
          <TaskCreateContent />
        </div>
      </div>
    </>
  )
}

export default page
