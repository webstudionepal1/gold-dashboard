import { Icon } from "@iconify/react/dist/iconify.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth, useLogout } from "../../hooks/useAuth";
import { useOutsideClick } from "../../hooks/UseOutsideClick";
import { Text } from "./Text";
import { useSidebar } from "./sidebar/SidebarHooks";

/*eslint-disable @typescript-eslint/no-explicit-any*/
export const Navbar = () => {
  const { toggleSidebar, toggleCollapse, isSidebarOpen } = useSidebar();
  const userInfo = useAuth() as any;
  const logout = useLogout();
  const [showLogout, setShowLogout] = useState(false);
  const [toggleNotification, setToggleNotification] = useState(false);
  const navigate = useNavigate();
  const { data } = useAuth();
  const [_, setRefresh] = useState(false);

  //   const {
  //     data: notificationData,
  //     isLoading,
  //     error,
  //     refetch,
  //   } = useGetNotifications(data?.user?._id);

  //   const { mutateAsync: updateNotification } = useUpdatePushNotification();

  const modalRef = useOutsideClick(() => {
    setShowLogout(false);
    setToggleNotification(false);
  });

  //   useEffect(() => {
  //     const unsubscribe = onMessageListener()
  //       .then((payload: any) => {
  //         toast.info(payload?.data?.notification?.title || 'New Notification');
  //         refetch();
  //         // setRefresh(true);
  //       })
  //       .catch((err) => console.log('FCM Error:', err));

  //     return () => {
  //       unsubscribe; // Cleanup when component unmounts
  //     };
  //   }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    setShowLogout(false);
  };

  const handleViewAllClick = () => {
    navigate("/notification");
    setToggleNotification(false);
    // refetch();
  };

  //   const handleNotificationClick = (type: string, _id: string) => {
  //     const filter = notificationData?.data?.notification.filter(
  //       (item: any) => item._id === _id
  //     );

  //     const stringToObject = JSON.parse(filter?.[0]?.body);
  //     const orderId = stringToObject?.orderId;

  //     const data = { ...filter[0], isRead: true };
  //     updateNotification({ notificationData: data, id: _id });
  //     if (type === 'register') {
  //       navigate('/delivery-person-request/pending');
  //       setToggleNotification(false);
  //       refetch();
  //     } else if (type === 'order') {
  //       navigate('/new-orders');
  //       setToggleNotification(false);
  //     } else if (type === 'order completed') {
  //       navigate(`/order-list/order-tracking/${orderId}?from=completed`);
  //       setToggleNotification(false);
  //       refetch();
  //     } else if (type === 'order accepted') {
  //       navigate(`/order-list/order-tracking/${orderId}`);
  //       setToggleNotification(false);
  //     }
  //   };

  //   const mappedNotifications =
  //     notificationData?.data?.notification
  //       ?.slice(0, 5)
  //       .filter((item: any) => item.isRead === false)
  //       .map(
  //         (item: {
  //           _id: string;
  //           title: string;
  //           type: string;
  //           createdAt?: string;
  //         }) => {
  //           const staticIcons: Record<string, { icon: string; color: string }> = {
  //             register: { icon: 'mdi:account-plus', color: 'bg-blue-500' },
  //             message: { icon: 'bx:message', color: 'bg-purple-500' },
  //             profile: { icon: 'bx:user', color: 'bg-green-500' },
  //             event: { icon: 'mdi:calendar', color: 'bg-gray-500' },
  //           };

  //           const staticData = staticIcons[item.type] || {
  //             icon: 'mdi:bell',
  //             color: 'bg-gray-500',
  //           };

  //           return {
  //             _id: item._id,
  //             title: item.title,
  //             text: `${item.type}`,
  //             icon: staticData.icon,
  //             color: staticData.color,
  //             createdAt: item.createdAt || new Date().toISOString(),
  //             type: item?.type,
  //           };
  //         }
  //       ) || [];

  return (
    <div
      className="flex justify-end w-full gap-6 px-6 py-3 bg-white shadow-md md:justify-between place-items-center"
      ref={modalRef}
    >
      <div className="hidden md:block">
        <Icon
          icon="iconamoon:menu-burger-horizontal-light"
          onClick={toggleCollapse}
          fontSize={24}
        />
      </div>
      <div className="flex items-center gap-5">
        <section className="flex place-items-center">
          <div className="relative">
            <Icon
              icon="tdesign:notification"
              fontSize={24}
              onClick={() => setToggleNotification((prev) => !prev)}
              className="text-gray-700 cursor-pointer hover:text-gray-900"
            />

            {/* {mappedNotifications?.length > 0 && (
            <span className="absolute flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full -top-2 -right-1 bg-red">
              {mappedNotifications?.length}
            </span>
          )} */}

            {/* {toggleNotification && (
            <div className="absolute right-0 p-4 px-3 mt-3 bg-white border rounded-lg shadow-lg">
              {error ? (
                <div className="text-center">
                  <h2 className="mb-2 text-lg font-semibold">
                    Latest Notifications
                  </h2>
                  <p className="text-red-500">Error loading notifications</p>
                </div>
              ) : isLoading ? (
                <div className="text-center">
                  <h2 className="mb-2 text-lg font-semibold">Notifications</h2>
                  <p className="text-gray-500">Loading notifications...</p>
                </div>
              ) : mappedNotifications.length > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-semibold">
                      Latest Notifications
                    </h2>
                    <span className="px-2 py-1 text-sm text-purple-700 bg-purple-200 rounded-full">
                      {mappedNotifications.length} Unread
                    </span>
                  </div>
                  <div className="divide-y h-[280px] overflow-scroll divide-gray-200">
                    {mappedNotifications.map(
                      ({
                        _id,
                        icon,
                        title,
                        text,
                        color,
                        type,
                        createdAt,
                      }: {
                        _id: string;
                        icon: string;
                        title: string;
                        text: string;
                        color: string;
                        type: string;
                        createdAt: string;
                      }) => (
                        <div
                          key={_id}
                          className="flex items-center justify-between gap-8 py-2 cursor-pointer hover:bg-gray-100"
                          onClick={() => {
                            handleNotificationClick(type, _id);
                          }}
                        >
                          <div className="flex">
                            <div
                              className={`w-10 h-10 ${color} text-white flex items-center justify-center rounded-full`}
                            >
                              <Icon icon={icon} fontSize={20} />
                            </div>
                            <div className="flex-1 ml-3">
                              <h3 className="font-semibold capitalize">
                                {type === 'order' ? 'New' + text : text}
                              </h3>
                              <p className="text-sm text-gray-600 whitespace-nowrap">
                                {title}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm whitespace-nowrap">
                            {timeAgo(createdAt)}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                  <button
                    className="w-full py-2 mt-3 font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-700"
                    onClick={handleViewAllClick}
                  >
                    View All
                  </button>
                </>
              ) : (
                <div className="w-full text-center">
                  <h2 className="mb-2 text-lg font-semibold">Notifications</h2>
                  <p className="w-full text-gray-500">
                    No notifications available
                  </p>
                </div>
              )}
            </div>
          )} */}
          </div>
        </section>

        <section
          className="z-50 flex gap-3 cursor-pointer place-items-center"
          onClick={() => setShowLogout((prev) => !prev)}
        >
          <div className="flex gap-3 place-items-center">
            <img src="/avatar.png" alt="profile" className="w-8" />
            <section className="flex flex-col gap-1">
              <Text variant="silver-950" size="body-sm-default">
                {userInfo?.data?.user?.name}
              </Text>
              <Text variant="silver-600" size="body-xs-mid">
                {userInfo?.data?.user?.role}
              </Text>
            </section>
          </div>
          <section className="relative">
            <Icon icon="oui:arrow-down" fontSize={16} />
            {showLogout && (
              <div className="absolute -left-32 top-8 w-[15rem] h-fit bg-white shadow-sm border rounded-lg">
                <div className="flex flex-col items-center justify-center gap-2 p-4">
                  <div className="w-16 h-16 rounded-full">
                    <img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRF03Doh8IEJXnq25zMHYYA4W3L90m7hTZmzdI_zOvWju4R9V0CGzdyU9Nmy7nd8qllhwU&usqp=CAU"
                      alt=""
                      className="object-cover w-full h-full rounded-full"
                    />
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1">
                    <h1 className="font-semibold text-black">
                      {userInfo?.data?.user?.name}
                    </h1>
                    <p className="text-[#64748B] text-sm">
                      {userInfo?.data?.user?.email}
                    </p>
                    <h1 className="font-semibold text-sky-600">
                      {userInfo?.data?.user?.role}
                    </h1>
                    <button
                      className="bg-red w-32 py-2.5 px-2 rounded flex justify-center items-center text-white font-semibold gap-2 mt-2"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        </section>

        {/* <section>
          <Icon icon="mdi-light:settings" fontSize={28} />
        </section> */}
        <div className="block md:hidden">
          <Icon
            icon={
              isSidebarOpen
                ? "oui:cross"
                : "iconamoon:menu-burger-horizontal-light"
            }
            onClick={toggleSidebar}
            fontSize={24}
          />
        </div>
      </div>
    </div>
  );
};
