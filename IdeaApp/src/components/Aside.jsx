import React from "react";
import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarHeader,
  SidebarContent,
} from "react-pro-sidebar";
import {
  FaTachometerAlt,
  FaUserFriends
} from "react-icons/fa";
import {
  FiSettings
} from "react-icons/fi";
import {HiViewGrid} from "react-icons/hi";
import { BsFillChatFill } from "react-icons/bs";
import "react-pro-sidebar/dist/css/styles.css";

const Aside = ({ image, collapsed, rtl, toggled, handleToggleSidebar }) => {
  return (
    <ProSidebar
      rtl={rtl}
      collapsed={collapsed}
      toggled={toggled}
      breakPoint="md"
      onToggle={handleToggleSidebar}
    >
      <SidebarHeader>
        <div
          style={{
            padding: "24px",
            textTransform: "uppercase",
            fontWeight: "bold",
            fontSize: 14,
            letterSpacing: "1px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          IdeaCrowd
        </div>
      </SidebarHeader>

      <SidebarContent>
        <Menu iconShape="circle">
          <MenuItem
            icon={<FaTachometerAlt />}
          >
            New Project
          </MenuItem>
          <MenuItem icon={<HiViewGrid />}>Explore</MenuItem>
        </Menu>
        <Menu iconShape="circle">
          <MenuItem icon={<FaUserFriends />}>Friends</MenuItem>
          <MenuItem icon={<BsFillChatFill />}>Chats</MenuItem>
          <MenuItem icon={<FiSettings />}>Settings</MenuItem>
        </Menu>
      </SidebarContent>
    </ProSidebar>
  );
};

export default Aside;
