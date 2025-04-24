interface RouteChild {
  id: number;
  title: string;
  path: string;
}

interface Route {
  id: number;
  title: string;
  path: string;
  icon: string;
  children?: RouteChild[];
}

interface SidebarSection {
  title: string;
  routes: Route[];
}

export const SidebarConfig: { sections: SidebarSection[] } = {
  sections: [
    {
      title: "main",
      routes: [
        {
          id: 1,
          path: "/",
          title: "Dashboard",
          icon: "proicons:home",
        },
        {
          id: 2,
          path: "/dashboard",
          title: "Bookings Management",
          icon: "proicons:home",
        },
        {
          id: 3,
          path: "/dashboard",
          title: "Guest Management",
          icon: "proicons:home",
        },
        {
          id: 4,
          path: "/dashboard",
          title: "Availability Calendar",
          icon: "proicons:home",
        },
        {
          id: 5,
          path: "/dashboard",
          title: "Wake Up Module",
          icon: "proicons:home",
        },
        {
          id: 6,
          path: "/dashboard",
          title: "Laundary Management",
          icon: "proicons:home",
        },
        {
          id: 7,
          path: "#",
          title: "Expenses Management",
          icon: "tabler:gift",
          children: [
            { id: 701, path: "/", title: "Expenses" },
            { id: 702, path: "/hello", title: "Loyalty Points" },
            { id: 703, path: "/", title: "Expense Category" },
          ],
        },
        {
          id: 8,
          path: "#",
          title: "House Keeping",
          icon: "tabler:gift",
          children: [
            { id: 801, path: "/", title: "Service Ticketing" },
            { id: 802, path: "/hello", title: "Room Inspection" },
            { id: 803, path: "/", title: "Lost & Found" },
            { id: 804, path: "/", title: "Maintenance" },
            { id: 805, path: "/", title: "Store" },
          ],
        },
        {
          id: 9,
          path: "#",
          title: "Cab Facility",
          icon: "tabler:gift",
          children: [
            { id: 901, path: "/", title: "Cab List" },
            { id: 902, path: "/hello", title: "Cab Booking" },
          ],
        },
        {
          id: 10,
          path: "#",
          title: "Inventory Management",
          icon: "tabler:gift",
          children: [
            { id: 1001, path: "/", title: "Purchase" },
            { id: 1002, path: "/hello", title: "Vendor" },
            { id: 1003, path: "/hello", title: "Stock" },
          ],
        },
        {
          id: 11,
          path: "#",
          title: "Channel Manager",
          icon: "tabler:gift",
          children: [
            { id: 1101, path: "/", title: "Channel" },
            { id: 1102, path: "/hello", title: "Channel Category" },
          ],
        },
        {
          id: 12,
          path: "#",
          title: "Reports",
          icon: "tabler:gift",
          children: [
            { id: 1201, path: "/", title: "Guest" },
            { id: 1202, path: "/hello", title: "Financial" },
            { id: 1203, path: "/hello", title: "Expenses" },
            { id: 1204, path: "/hello", title: "Maintenance" },
            { id: 1205, path: "/hello", title: "Cashbook" },
            { id: 1206, path: "/hello", title: "Night Audit" },
          ],
        },
      ],
    },
    {
      title: "HRMS",
      routes: [
        {
          id: 13,
          path: "#",
          title: "HR Management",
          icon: "tabler:gift",
          children: [
            { id: 1301, path: "/", title: "Guest" },
            { id: 1302, path: "/hello", title: "All Employees" },
            { id: 1303, path: "/hello", title: "Leave tracking" },
            { id: 1304, path: "/hello", title: "Manage Roles" },
            { id: 1305, path: "/hello", title: "Designations" },
            { id: 1306, path: "/hello", title: "Departments" },
            { id: 1307, path: "/hello", title: "User Logs" },
          ],
        },
        {
          id: 14,
          path: "#",
          title: "Employee Duty Assign",
          icon: "tabler:gift",
          children: [
            { id: 1401, path: "/", title: "Guest" },
            { id: 1402, path: "/hello", title: "Assigned List" },
            { id: 1403, path: "/hello", title: "Shift List" },
            { id: 1404, path: "/hello", title: "Roster List" },
          ],
        },
      ],
    },
    {
      title: "Settings",
      routes: [
        {
          id: 15,
          path: "#",
          title: "Hotel Configurations",
          icon: "tabler:gift",
          children: [
            { id: 1501, path: "/", title: "Bed List" },
            { id: 1502, path: "/", title: "Floor Plan List" },
            { id: 1503, path: "/", title: "Room List" },
            { id: 1504, path: "/", title: "Room Facilities" },
          ],
        },
      ],
    },
  ],
};
