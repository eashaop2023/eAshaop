import React, { createContext, useContext, useState, useEffect } from 'react';

const SidebarContext = createContext();

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export const SidebarProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 992);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);
      if (!mobile) {
        setIsOpen(true); // Default open on desktop
      } else {
        setIsOpen(false); // Default closed on mobile
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  const closeSidebarOnMobile = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <SidebarContext.Provider value={{ isOpen, isMobile, toggleSidebar, closeSidebarOnMobile }}>
      {children}
    </SidebarContext.Provider>
  );
};
