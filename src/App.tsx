import { Outlet } from 'react-router-dom';
import { Navbar, SideBar,  } from './components/shared';
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { initializeAuth } from './hooks/useAuth';

export default function App() {
  const queryClient = useQueryClient();
  const [miniSidebar, setMiniSidebar] = useState(true);

  useEffect(() => {
    const authData = initializeAuth();
    queryClient.setQueryData(['auth'], authData);
  }, [queryClient]);

  return (
    <div className="flex bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed left-0  bg-white ${!miniSidebar ? 'w-20' : 'w-72 z-[30]'} h-screen overflow-y-auto`}
      >
        <SideBar miniSidebar={miniSidebar} setMiniSidebar={setMiniSidebar} />
      </aside>
      {/* <div
        className="absolute top-16 left-[270px] text-xl z-[99999] bg-white p-1 border-border border rounded-md"
        onClick={() => setMiniSidebar((prev) => !prev)}
      >
        <Icon icon={'mdi-light:unfold-more-vertical'} />
      </div> */}

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col ${!miniSidebar ? 'pl-20' : 'pl-72'}`}
      >
        {/* Navbar */}
        <header
          className={`fixed top-0 right-0 ${miniSidebar ? ' left-[286px]' : 'left-[80px]'}  bg-white z-20`}
        >
          <Navbar />
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto mt-16 pt-4 bg-bg min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
