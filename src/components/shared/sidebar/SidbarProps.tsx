import { Link, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import { Text } from "./SidebarText";

interface SidebarProps {
  toggleExpand?: (id: number) => void;
  SidebarRoutes: {
    title: string;
    routes: {
      path: string;
      id: number;
      icon: string;
      title: string;
      children?: { path: string; id: number; title: string }[];
    }[];
  };
  miniSidebar: boolean;
  expandedItems: number[];
  currentParentId: number;
  setMiniSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SidebarProps = ({
  SidebarRoutes,
  toggleExpand,
  miniSidebar,
  currentParentId,
  expandedItems,
  setMiniSidebar,
}: SidebarProps) => {
  const location = useLocation();

  return (
    <section
      className={`flex flex-col pt-6 ${
        !miniSidebar ? "items-center" : ""
      } gap-2`}
      id="main-menu"
    >
      <div
        className={`flex items-center gap-3 ${!miniSidebar ? "px-3" : "px-6"}`}
      >
        <div className="bg-white h-[0.5px] w-[40%] flex-1" />
        <Text className="text-black text-sm font-medium">
          {SidebarRoutes.title}
        </Text>
        <div className="bg-white h-[0.5px] w-[40%] flex-1" />
      </div>

      <div
        className="flex flex-col gap-2"
        id="menu"
        onClick={() => setMiniSidebar(true)}
      >
        {SidebarRoutes.routes.map((route) => (
          <div key={route.id}>
            <Link
              to={route.path}
              className={`flex items-center ${
                miniSidebar ? "px-6" : "px-3"
              } py-3 gap-5 justify-between hover:bg-gray-700 hover:rounded-lg`}
              onClick={() => route.children?.length && toggleExpand?.(route.id)}
            >
              <div className="flex items-center gap-3">
                <Icon icon={route.icon} color="black" />

                {miniSidebar && (
                  <Text
                    className={
                      currentParentId === route.id
                        ? "text-black"
                        : "text-gray-300"
                    }
                  >
                    {route.title}
                  </Text>
                )}
              </div>

              {miniSidebar && route.children?.length && (
                <Icon icon="oui:arrow-down" color="black" fontSize={16} />
              )}
            </Link>

            {miniSidebar &&
              route.children &&
              expandedItems.includes(route.id) && (
                <div className="ml-8 mt-1 flex flex-col relative">
                  {route.children.map((child) => (
                    <Link
                      to={child.path}
                      key={child.id}
                      className="flex items-center py-1 pl-4 relative rounded-lg"
                    >
                      {/* Dot with horizontal line */}
                      <div className="absolute left-[0.1rem] top-1/2 -translate-y-1/2">
                        <div
                          className={`h-[0.5px] w-2 ${
                            location.pathname === child.path
                              ? "bg-white"
                              : "bg-gray-50"
                          }`}
                        />
                      </div>

                      <Text
                        className={`py-2 px-3 rounded ${
                          location.pathname === child.path
                            ? "text-black"
                            : "text-gray-300"
                        }`}
                      >
                        {child.title}
                      </Text>
                    </Link>
                  ))}
                </div>
              )}
          </div>
        ))}
      </div>
    </section>
  );
};
