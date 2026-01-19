import PageHeader from "@/components/shared/pageHeader/PageHeader";
import TaskEditContent from "@/components/tasks/TaskEditContent";

const Page = ({ params }) => {
  return (
    <>
      <PageHeader title="Görev Düzenle" />
      <div className="main-content">
        <div className="row">
          <TaskEditContent taskId={params.id} />
        </div>
      </div>
    </>
  );
};

export default Page;
