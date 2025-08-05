import React from "react";
import { Tabs, TabsList, TabsTrigger } from "../../../components/shared/tab";

interface ITabProps {
  selectedTab: string;
  setSelectedTab: (value: string) => void;
  tabOptions: { label: string; value: string }[];
}
export const DynamicTab: React.FC<ITabProps> = ({
  selectedTab,
  setSelectedTab,
  tabOptions,
}) => {
  return (
    <Tabs
      value={selectedTab}
      onValueChange={(val: string) => setSelectedTab(val)}
      className="w-full">
      <TabsList>
        {tabOptions.map((item) => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            className="px-4 py-3 rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-[#DF8D28] data-[state=active]:border-b-2 data-[state=active]:border-[#DF8D28] text-gray-500">
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
