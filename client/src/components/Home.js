import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboardList,
  faHistory,
  faUserCog,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import logoImage from "../Assets/logo.png";
import image1 from "../Assets/seal1.jpg";
import image2 from "../Assets/seal2.jpg";
import image3 from "../Assets/seal3.jpg";
import image4 from "../Assets/seal4.png";
import image5 from "../Assets/seal5.jpg";
import { text1, text2, text3, text4, text5 } from "../enums/text";
import "../styles/homeStyle.css";

function ContentInfo({ image, text }) {
  return (
    <div className="image-wrapper">
      <img src={image} alt="Seal" />
      <div className="content-info">
        <p style={{ fontSize: "14px", lineHeight: "1.6" }}>{text}</p>
      </div>
    </div>
  );
}

function HomePage() {
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
      <header>
        <div className="logo">
          <a
            href="https://www.tel-mic.co.jp/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={logoImage} alt="Your Logo" />
          </a>
        </div>
        <div className="menu-icon" onClick={toggleMenu}>
          <div className={`menu-toggle ${menuOpen ? "open" : ""}`}>
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
          </div>
        </div>
      </header>

      <nav className={`menu ${menuOpen ? "open" : ""}`}>
        <ul>
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
                icon={faClipboardList}
                style={{ color: "black", marginRight: "5px" }}
              />{" "}
              リクエストをする
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
              />{" "}
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
              />{" "}
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
            />{" "}
            ログアウト
          </li>
        </ul>
      </nav>
      {/* Content */}
      <div className="content">
        {/* Images in Zigzag Manner */}
        <div className="image-container">
          <ContentInfo image={image1} text={text1} />
          <ContentInfo image={image2} text={text2} />
          <ContentInfo image={image3} text={text3} />
          <ContentInfo image={image4} text={text4} />
          <ContentInfo image={image5} text={text5} />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
