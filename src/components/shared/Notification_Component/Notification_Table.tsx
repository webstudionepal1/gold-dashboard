import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../tab";
import Pagination from "../_table/_Pagination";
import NotificationCard from "./NotificationCard";
import {
  AcceptedOrders,
  AllNotifications,
  AssignedOrders,
  CompletedOrders,
  NewNotifications,
  RegistrationNotifications,
} from "./randomData";

const NotificationTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalItems = 100;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setItemsPerPage(itemsPerPage);
    setCurrentPage(1);
  };
  return (
    <>
      <div className="bg-[#ffffff]  border-[#dbdce0] border-2 rounded-xl ">
        <div className="mt-4 mx-6">
          <div>
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger
                  value="all"
                  className="px-4 py-3 rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-[#DF8D28] data-[state=active]:border-b-2 data-[state=active]:border-[#DF8D28] text-gray-500"
                >
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="newOrder"
                  className="px-4 py-3 rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-[#DF8D28] data-[state=active]:border-b-2 data-[state=active]:border-[#DF8D28] text-gray-500"
                >
                  New Order
                </TabsTrigger>
                <TabsTrigger
                  value="acceptedOrder"
                  className="px-4 py-3 rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-[#DF8D28] data-[state=active]:border-b-2 data-[state=active]:border-[#DF8D28] text-gray-500"
                >
                  Accepted Order
                </TabsTrigger>
                <TabsTrigger
                  value="assignedOrder"
                  className="px-4 py-3 rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-[#DF8D28] data-[state=active]:border-b-2 data-[state=active]:border-[#DF8D28] text-gray-500"
                >
                  Assigned Order
                </TabsTrigger>
                <TabsTrigger
                  value="completedOrder"
                  className="px-4 py-3 rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-[#DF8D28] data-[state=active]:border-b-2 data-[state=active]:border-[#DF8D28] text-gray-500"
                >
                  Completed Order
                </TabsTrigger>
                <TabsTrigger
                  value="registration"
                  className="px-4 py-3 rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-[#DF8D28] data-[state=active]:border-b-2 data-[state=active]:border-[#DF8D28] text-gray-500"
                >
                  Registration
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                {AllNotifications.map((item) => (
                  <NotificationCard
                    key={item.id}
                    title={item.title}
                    description={item.description}
                    time={item.time}
                    showCheckbox={item.showCheckbox}
                    showStatusDot={item.showStatusDot}
                    statusColor={item.statusColor}
                    onButtonClick={() => alert(`Viewing ${item.title}`)}
                  />
                ))}
              </TabsContent>

              <TabsContent value="newOrder">
                {NewNotifications.map((item) => (
                  <NotificationCard
                    key={item.id}
                    title={item.title}
                    description={item.description}
                    time={item.time}
                    showCheckbox={item.showCheckbox}
                    showStatusDot={item.showStatusDot}
                    statusColor={item.statusColor}
                    onButtonClick={() => alert(`Viewing ${item.title}`)}
                  />
                ))}
              </TabsContent>

              <TabsContent value="acceptedOrder">
                {AcceptedOrders.map((item) => (
                  <NotificationCard
                    key={item.id}
                    title={item.title}
                    description={item.description}
                    time={item.time}
                    showCheckbox={item.showCheckbox}
                    showStatusDot={item.showStatusDot}
                    statusColor={item.statusColor}
                    onButtonClick={() => alert(`Viewing ${item.title}`)}
                  />
                ))}
              </TabsContent>

              <TabsContent value="assignedOrder">
                {AssignedOrders.map((item) => (
                  <NotificationCard
                    key={item.id}
                    title={item.title}
                    description={item.description}
                    time={item.time}
                    showCheckbox={item.showCheckbox}
                    showStatusDot={item.showStatusDot}
                    statusColor={item.statusColor}
                    onButtonClick={() => alert(`Viewing ${item.title}`)}
                  />
                ))}
              </TabsContent>

              <TabsContent value="completedOrder">
                {CompletedOrders.map((item) => (
                  <NotificationCard
                    key={item.id}
                    title={item.title}
                    description={item.description}
                    time={item.time}
                    showCheckbox={item.showCheckbox}
                    showStatusDot={item.showStatusDot}
                    statusColor={item.statusColor}
                    onButtonClick={() => alert(`Viewing ${item.title}`)}
                  />
                ))}
              </TabsContent>

              <TabsContent value="registration">
                {RegistrationNotifications.map((item) => (
                  <NotificationCard
                    key={item.id}
                    title={item.title}
                    description={item.description}
                    time={item.time}
                    showCheckbox={item.showCheckbox}
                    showStatusDot={item.showStatusDot}
                    statusColor={item.statusColor}
                    onButtonClick={() => alert(`Viewing ${item.title}`)}
                  />
                ))}
              </TabsContent>
            </Tabs>
          </div>
          <div className="border-b border-[#dedde2] w-full my-2"></div>

          <div>
            <Pagination
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationTable;
