import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { getRoutePath, getUserData } from "../../global";

const SidebarNavItem = ({ item, index, level = 0 }) => {
  const collapseId = `collapse-${index}-${level}`;
  const hasChildren = item.sub_menus && item.sub_menus.length > 0;
  const location = useLocation();

  const [isCollapsed, setIsCollapsed] = useState(
    !location.pathname.includes(item.path)
  );

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    setIsCollapsed(!location.pathname.includes(item.path));
  }, [location, item]);

  return (
    <li className="nav-item" key={index}>
      {hasChildren ? (
        <>
          <Link
            onClick={(e) => {
              e.preventDefault();
              handleToggleCollapse();
            }}
            className={`nav-link ${isCollapsed ? "collapsed" : ""}`}
          >
            <i className={`fa ${item.icon}`}></i>
            <span>{item.title}</span>
            <i className="bi bi-chevron-down ms-auto"></i>
          </Link>
          <ul
            id={collapseId}
            className={`nav-content collapse ${isCollapsed ? "" : "show"}`}
            data-bs-parent="#sidebar-nav"
          >
            {item.sub_menus.map((subitem, subIndex) => (
              <SidebarNavItem
                item={subitem}
                index={`${index}-${subIndex}`}
                level={level + 1}
                key={`${index}-${subIndex}`}
              />
            ))}
          </ul>
        </>
      ) : (
        <NavLink
          className={`nav-link ${
            location.pathname.includes(item.path) ? "" : "collapsed"
          }`}
          to={getRoutePath(item.path)}
        >
          <i className={`fa ${item.icon}`}></i>
          <span>{item.title}</span>
        </NavLink>
      )}
    </li>
  );
};

const Sidebar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [navbarItems, setNavbarItems] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserData();
        setNavbarItems(userData?.menus || []);
      } catch (error) {
        navigate(getRoutePath("login"));
      }
    };

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    const handleLinkClick = () => {
      if (window.innerWidth <= 1000) {
        toggleSidebar();
      }
    };

    const links = document.querySelectorAll("a.nav-link");
    links.forEach((link) => {
      link.addEventListener("click", handleLinkClick);
    });

    return () => {
      links.forEach((link) => {
        link.removeEventListener("click", handleLinkClick);
      });
    };
  }, [toggleSidebar]);

  return (
    <aside id="sidebar" className="sidebar">
      <ul className="sidebar-nav" id="sidebar-nav">
        {navbarItems.map((item, index) => (
          <SidebarNavItem item={item} index={index} key={index} />
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
