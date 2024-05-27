import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
const SidebarMenu = ({ menuItems }) => {
  const location = useLocation();
  const [activeMenuActive, setactiveMenuActive] = useState(location.pathname);

  const handleMenuItemClick = (menuItemUrl) => {
    setactiveMenuActive(menuItemUrl);
  };

  return (
    <div className="list-group mt-5 pl-4">
      {menuItems.map((item, index) => (
        <Link
          key={index}
          to={item.url}
          className={`fw-bold list-group-item list-group-item-action ${
            activeMenuActive.includes(item.url) ? "active" : ""
          }`}
          onClick={() => handleMenuItemClick(item.url)}
          aria-current={activeMenuActive.includes(item.url) ? "true" : "false"}
        >
          <i className={`${item.icon} fa-fw pe-2`}></i>
          {item.name}
        </Link>
      ))}
    </div>
  );
};

export default SidebarMenu;
