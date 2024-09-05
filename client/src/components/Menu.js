import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboardList,
  faHistory,
  faUserCog,
  faSignOutAlt,
  faFileAlt, // Import the new icon
  faHome, // Import the home icon
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "../styles/menuStyle.css"; // Make sure you have the appropriate styles

const Menu = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (!event.target.closest(".menu") && menuOpen) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [menuOpen]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    window.location.href = "/";
  };

  return (
    <div>
      <div className="menu-icon" onClick={toggleMenu}>
        {/* Use the FontAwesome home icon */}
        <FontAwesomeIcon icon={faHome} className="home-icon" />
      </div>
      <nav className={`menu ${menuOpen ? "open" : ""}`}>
        <ul>
          <li>
            <Link
              to="/home"
              style={{
                textDecoration: "none",
                color: "inherit",
                fontWeight: "bold",
              }}
            >
              <FontAwesomeIcon
                icon={faClipboardList}
                style={{ color: "black", marginRight: "5px" }}
              />
              印鑑の種類
            </Link>
          </li>
          <li>
            <Link
              to="/request"
              style={{
                textDecoration: "none",
                color: "inherit",
                fontWeight: "bold",
              }}
            >
              <FontAwesomeIcon
                icon={faFileAlt} // Use the new icon
                style={{ color: "black", marginRight: "5px" }}
              />
              押印依頼をする
            </Link>
          </li>
          <li>
            <Link
              to="/history"
              style={{
                textDecoration: "none",
                color: "inherit",
                fontWeight: "bold",
              }}
            >
              <FontAwesomeIcon
                icon={faHistory}
                style={{ color: "black", marginRight: "5px" }}
              />
              履歴
            </Link>
          </li>
          <li>
            <Link
              to="/admin"
              style={{
                textDecoration: "none",
                color: "inherit",
                fontWeight: "bold",
              }}
            >
              <FontAwesomeIcon
                icon={faUserCog}
                style={{ color: "black", marginRight: "5px" }}
              />
              管理者
            </Link>
          </li>
          <li
            onClick={handleLogout}
            style={{ cursor: "pointer", fontWeight: "bold" }}
          >
            <FontAwesomeIcon
              icon={faSignOutAlt}
              style={{ color: "black", marginRight: "5px" }}
            />
            ログアウト
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Menu;
