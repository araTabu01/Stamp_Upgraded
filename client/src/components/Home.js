// src/pages/HomePage.js
import React from "react";
import logoImage from "../Assets/logo.png";
import image1 from "../Assets/seal1.jpg";
import image2 from "../Assets/seal2.jpg";
import image3 from "../Assets/seal3.jpg";
import image4 from "../Assets/seal4.png";
import image5 from "../Assets/seal5.jpg";
import { text1, text2, text3, text4, text5 } from "../enums/text";
import "../styles/homeStyle.css";
import Menu from "../components/Menu"; // Import the Menu component

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
        <div className="header-title">
          <h1>印鑑の種類</h1>
        </div>
      </header>
      <Menu /> {/* Add the Menu component */}
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
