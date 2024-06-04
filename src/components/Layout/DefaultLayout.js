import { useState } from "react";
import Header from "../common/Header";
import Sidebar from "../common/Sidebar";

const DefaultLayout = ({ children }) => {
  const [show, setShow] = useState(true);
  function toggleSidebar() {
    setShow(!show);
  }
  return (
    <div className={`${show ? "" : "toggle-sidebar"} `}>
      <Sidebar toggleSidebar={toggleSidebar} />
      <Header toggleSidebar={toggleSidebar} />
      {children}
    </div>
  );
};
export default DefaultLayout;
