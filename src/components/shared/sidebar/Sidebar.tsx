import { Icon } from "@iconify/react/dist/iconify.js";
import clsx from "clsx";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSidebar } from "./SidebarHooks";
import { Text } from "./SidebarText";
import { COLORS } from "./sidebarConstants";
import CompanyLogo from "../CompanyLogo";

interface SidebarInsetProps {
  children: React.ReactNode;
  className?: string;
}

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

const SidebarHeader: React.FC = () => {
  const { isCollapsed } = useSidebar();

  return (
    <section
      className={clsx(
        "flex items-center p-4",
        isCollapsed ? "justify-center" : "justify-between"
      )}>
      <img
        src="/barun2.png"
        alt="company-logo"
        className={clsx(
          isCollapsed ? "h-[50px] w-[44px]" : "h-full w-full",
          "transition-all duration-300"
        )}
      />
    </section>
  );
};

const SubRouteItem: React.FC<{
  child: RouteChild;
  isActive: boolean;
  isCollapsed: boolean;
}> = ({ child, isActive, isCollapsed }) => {
  const { closeSidebar } = useSidebar();

  if (isCollapsed) return null;

  return (
    <Link
      to={child.path}
      key={child.id}
      className="relative flex items-center pl-4 mt-[2px] rounded-lg"
      onClick={() => closeSidebar()}>
      <div className="absolute left-[0.4rem] top-1/2 -translate-y-1/2">
        <div
          className={`h-[1px] w-2 rounded-full transition-colors duration-200 ${
            isActive ? "bg-yellow" : "bg-gray-300"
          }`}
        />
      </div>
      <Text
        variant={isActive ? "yellow" : "fadish-black"}
        size="body-sm-default"
        className={`hover:bg-gray-50 py-2 px-3 rounded transition-colors duration-200 ${
          isActive ? "bg-[#FCF4EA]" : ""
        }`}>
        {child.title}
      </Text>
    </Link>
  );
};

const RouteItem: React.FC<{
  route: Route;
  isActive: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  currentPath: string;
  isCollapsed: boolean;
}> = ({ route, isActive, isExpanded, onToggle, currentPath, isCollapsed }) => {
  const { closeSidebar } = useSidebar();
  const pathname = useLocation().pathname;
  const hasChildren = route.children && route.children.length > 0;

  return (
    <div className="mx-2">
      <Link
        to={route.path}
        className={clsx(
          `flex items-center ${
            isCollapsed ? "justify-center" : "justify-between"
          } rounded-lg transition-colors duration-200`,
          isCollapsed ? "px-2 py-3" : "px-6 py-2 gap-5",
          isActive && "bg-[#FCF4EA] text-white rounded-lg",
          !pathname.startsWith(route.path) &&
            `hover:bg-[${COLORS.navHoverColor}]`
        )}
        onClick={(e) => {
          if (hasChildren && !isCollapsed) {
            e.preventDefault();
            onToggle();
          } else {
            closeSidebar();
          }
        }}
        title={isCollapsed ? route.title : ""}>
        <div className={clsx("flex items-center", isCollapsed ? "" : "gap-3")}>
          <Icon
            icon={route.icon}
            color={isActive ? "orange" : "#5C5E64"}
            className={clsx(
              "transition-colors duration-200",
              isCollapsed ? "size-4" : "size-5"
            )}
          />
          {!isCollapsed && (
            <Text
              variant={isActive ? "orange" : "fadish-black"}
              size="body-sm-default">
              {route.title}
            </Text>
          )}
        </div>
        {hasChildren && !isCollapsed && (
          <Icon
            icon="oui:arrow-right"
            className={clsx(
              "size-3 transition-transform text-black duration-200",
              isExpanded && "rotate-90"
            )}
          />
        )}
      </Link>

      {hasChildren && !isCollapsed && (
        <div
          className={`ml-8 flex flex-col relative overflow-hidden transition-all duration-200 ease-in-out ${
            isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}>
          <div className="absolute left-[0.3125rem] top-0 bottom-0 w-px bg-yellow" />
          {route.children &&
            route.children.map((child) => (
              <SubRouteItem
                key={child.id}
                child={child}
                isActive={currentPath === child.path}
                isCollapsed={isCollapsed}
              />
            ))}
        </div>
      )}
    </div>
  );
};
const MobileToggleButton: React.FC = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      onClick={toggleSidebar}
      className="fixed z-40 p-2 text-white rounded-full shadow-lg top-4 left-4 md:hidden bg-primary-blue"
      aria-label="Toggle Sidebar">
      <Icon icon={"mdi-light:unfold-more-vertical"} className="size-6" />
    </button>
  );
};

const Overlay: React.FC = () => {
  const { isSidebarOpen, closeSidebar } = useSidebar();

  return (
    <div
      className={clsx(
        "fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300",
        isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      onClick={closeSidebar}
    />
  );
};

const SectionDivider: React.FC<{ title: string; isCollapsed: boolean }> = ({
  title,
  isCollapsed,
}) => {
  if (isCollapsed)
    return (
      <p className="w-full text-xs text-center text-gray-400 uppercase">
        {title}
      </p>
    );
  // return <div className="w-3/4 mx-auto my-2 border-t border-gray-200" >
  //   {title}
  // </div>;

  return (
    <div className="flex items-center gap-2 px-6">
      <Text variant="fadish-black" size="body-xs-default" uppercase>
        {title}
      </Text>
      <div className="flex w-full items-center h-[1px] bg-[#898989]" />
    </div>
  );
};

const Sidebar: React.FC<{ config: { sections: SidebarSection[] } }> = ({
  config,
}) => {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const { isSidebarOpen, isCollapsed } = useSidebar();
  const location = useLocation();

  const findActiveParentId = (): number => {
    for (const section of config.sections) {
      for (const route of section.routes) {
        if (
          route.path === location.pathname ||
          route.children?.some((child) => child.path === location.pathname)
        ) {
          return route.id;
        }
      }
    }
    return -1;
  };

  const toggleExpand = (id: number) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const currentParentId = findActiveParentId();

  return (
    <>
      {/* <MobileToggleButton /> */}

      <Overlay />

      {/* Sidebar */}
      <aside
        className={clsx(
          "flex flex-col h-screen  border-r border-gray-200 transition-all duration-300 bg-white ease-in-out z-50",
          "fixed md:static md:translate-x-0",
          isCollapsed ? "md:w-16 min-w-16" : "md:w-72 md:min-w-72",
          "w-72 max-w-72",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          `bg-[${COLORS.sidebarBackground}]`
        )}>
        <SidebarHeader />

        <div className="flex-grow space-y-6 overflow-y-auto">
          {config.sections.map((section, index) => (
            <section
              key={section.title}
              className={index > 1 ? "pb-[178px]" : ""}>
              <div className="flex flex-col gap-2">
                <SectionDivider
                  title={section.title}
                  isCollapsed={isCollapsed}
                />
                <div className="flex flex-col gap-1">
                  {section.routes.map((route) => (
                    <RouteItem
                      key={route.id}
                      route={route}
                      isActive={currentParentId === route.id}
                      isExpanded={expandedItems.includes(route.id)}
                      onToggle={() => toggleExpand(route.id)}
                      currentPath={location.pathname}
                      isCollapsed={isCollapsed}
                    />
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
export const SidebarInset: React.FC<SidebarInsetProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={clsx(
        "flex-1 transition-all duration-300 ease-in-out",
        className
      )}>
      {children}
    </div>
  );
};
