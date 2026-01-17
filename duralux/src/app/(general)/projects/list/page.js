import React from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import TasksListContent from '@/components/tasks/TaskListContent'

const page = () => {
  return (
    <>
      <PageHeader title="Görevler" />
      <div className="main-content">
        <div className="row">
          <TasksListContent />
        </div>
      </div>
    </>
  )
}

export default page
