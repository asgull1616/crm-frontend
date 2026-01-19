import PageHeader from "@/components/shared/pageHeader/PageHeader";
import TasksListContent from "@/components/tasks/TaskListContent";

const Page = () => {
  return (
    <>
      <PageHeader title="Görevler" />
      <div className="main-content">
        <div className="row">
          <TasksListContent />
        </div>
      </div>
    </>
  );
};

export default Page;
