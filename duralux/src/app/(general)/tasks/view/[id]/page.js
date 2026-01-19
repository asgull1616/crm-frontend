import PageHeader from "@/components/shared/pageHeader/PageHeader";
import TaskViewHeader from "@/components/tasksView/TaskViewHeader";
import TaskViewTabItems from "@/components/tasksView/TaskViewTabItems";
import TabTaskOverview from "@/components/tasksView/TabTaskOverview";

const Page = ({ params }) => {
  return (
    <>
      <PageHeader>
        <TaskViewHeader taskId={params.id} />
      </PageHeader>

      <TaskViewTabItems />

      <div className="main-content">
        <div className="tab-content">
          <TabTaskOverview taskId={params.id} />
        </div>
      </div>
    </>
  );
};

export default Page;
