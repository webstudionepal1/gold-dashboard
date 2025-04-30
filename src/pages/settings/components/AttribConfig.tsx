import React from "react";
import { Table } from "../../../components/shared";
import { Tabs } from "../../../components/shared/tab";
import MasterTable from "../../../components/shared/MasterTable";
import { SearchFilterSort } from "../../../components/global/SearchFilterSort";

const AttribConfig = () => {
  const obj = {
    "clasp-type": <></>,
  };
  const columns = [
    {
      key: "name",
      title: "Name",
    },
    {
      key: "just",
      title: "just",
    },
  ];
  const data = [
    {
      name: "just",
    },
    {
      just: "sdkfjsdlf",
    },
  ];
  return (
    <div className="p-4">
      <MasterTable
        columns={columns}
        showAction
        viewAction={(row) => {
          console.log("row", row);
        }}
        editAction={(row) => {
          console.log("row", row);
        }}
        onDelete={(row) => {
          console.log("row", row);
        }}
        rows={data}
        filterSection={
          <SearchFilterSort onFilter={() => {}} onSort={() => {}} />
        }
      />
    </div>
  );
};

export default AttribConfig;
