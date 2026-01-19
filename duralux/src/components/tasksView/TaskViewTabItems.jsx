import React from "react";

const TaskViewTabItems = () => {
  return (
    <div className="bg-white py-3 border-bottom rounded-0 p-md-0 mb-0">
      <div className="d-flex align-items-center justify-content-between">
        <div className="nav-tabs-wrapper page-content-left-sidebar-wrapper">
          <ul
            className="nav nav-tabs nav-tabs-custom-style"
            id="myTab"
            role="tablist"
          >
            <li className="nav-item" role="presentation">
              <button
                className="nav-link active"
                data-bs-toggle="tab"
                data-bs-target="#overviewTab"
                type="button"
              >
                Overview
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TaskViewTabItems;
