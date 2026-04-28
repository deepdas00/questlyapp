import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Navbar */}
      <Navbar onMenuClick={() => setOpen(true)} />

      {/* Page Content */}
      <Outlet />
    </>
  );
};

export default Layout;