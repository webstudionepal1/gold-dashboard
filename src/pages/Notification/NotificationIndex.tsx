import React from "react";
import NotificationTable from "../../components/shared/Notification_Component/Notification_Table";
import Header from "../../components/shared/table_heading/Header";

const NotificationIndex = () => {
  return (
    <>
      <div className="mx-4 my-3">
        {/* <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Notification</h1>
          <button className="bg-[#fb4f4c] transition-transform duration-200 ease-in-out hover:scale-105 text-white px-3 py-2 rounded-lg">
            {" "}
            Delete
          </button>
        </div> */}

        <Header text="Notification">
          <button className="px-3 py-2  flex items-center  text-white bg-[#fb4f4c] transition-transform duration-200 ease-in-out hover:scale-105 rounded-lg">
            Delete
          </button>
        </Header>
        <div>
          <NotificationTable />
        </div>
      </div>
    </>
  );
};

export default NotificationIndex;
