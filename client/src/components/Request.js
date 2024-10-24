import React, { useState, useEffect } from "react";
import backgroundImage from "../Assets/request.jpg";
import { useDispatch } from "react-redux";
import {
  branches,
  documentTypes,
  stamps,
  authorizerNames,
} from "../enums/details.js";
import logoImage from "../Assets/logo.png";
import "../styles/requestStyle.css"; // Import CSS file
import { submitStamp } from "../actions/crud.js";
import Menu from "../components/Menu"; // Import the Menu component

const RequestForm = () => {
  // Function to get the current date in the format yyyy-mm-dd
  const getCurrentDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    date: getCurrentDate(),
    name: localStorage.getItem("userName") || "", // Retrieve user name from local storage
    branch: "",
    documentType: "",
    documentName: "",
    kindOfStamp: "",
    numberOfStamp: 1, // Set initial value to 1
    reason: "",
    authorizer: "",
  });

  const [filteredAuthorizers, setFilteredAuthorizers] =
    useState(authorizerNames);

  const {
    date,
    name,
    branch,
    documentType,
    documentName,
    kindOfStamp,
    numberOfStamp,
    reason,
    authorizer,
  } = formData;

  const dispatch = useDispatch();

  useEffect(() => {
    // Update the list of authorizers based on the selected kind of stamp
    let newAuthorizers = [];

    switch (kindOfStamp) {
      case "実印":
      case "認印":
        newAuthorizers = ["田中秀範", "筧光能", "長谷川良", "中川幸作"];
        break;
      case "銀行印":
        newAuthorizers = [
          "田中秀範",
          "筧光能",
          "長谷川良",
          "中川幸作",
          "中野訓子",
        ];
        break;
      case "管理者":
        newAuthorizers = authorizerNames;
        break;
      case "角印":
        newAuthorizers = [
          ...authorizerNames, // include existing authorizers
          "江崎千沙",
          "清水智佳子",
        ];
        break;
      default:
        newAuthorizers = authorizerNames;
        break;
    }

    setFilteredAuthorizers(newAuthorizers);
    setFormData({ ...formData, authorizer: "" }); // Reset the selected authorizer when kindOfStamp changes
  }, [kindOfStamp, authorizerNames]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !date ||
      !name ||
      !branch ||
      !documentType ||
      !documentName ||
      !kindOfStamp ||
      !numberOfStamp ||
      !reason ||
      !authorizer
    ) {
      alert("すべて入力してください！");
      return;
    }

    dispatch(submitStamp(formData));

    setFormData({
      date: getCurrentDate(),
      name: localStorage.getItem("userName") || "", // Reset to the logged-in user's name
      branch: "",
      documentType: "",
      documentName: "",
      kindOfStamp: "",
      numberOfStamp: 1, // Reset to initial value 1
      reason: "",
      authorizer: "",
    });
    alert("データは正常に送信されました!");
  };

  return (
    <div>
      <header className="header">
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
          <h1>押印依頼をする</h1>
        </div>
      </header>
      <Menu /> {/* Add the Menu component */}
      <div className="form-container">
        <div
          className="background-image"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        ></div>
        <form className="request-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="date">日付:</label>
            <input
              type="date"
              id="date"
              value={date}
              aria-readonly="true"
              readOnly
            />
          </div>
          <div className="form-group">
            <label htmlFor="name">依頼者:</label>
            <input
              type="text"
              id="name"
              placeholder="依頼者の名前を入力してください"
              value={name}
              aria-readonly="true"
              readOnly // Make the name field read-only
            />
          </div>
          <div className="form-group">
            <label htmlFor="documentType">種類:</label>
            <select
              id="documentType"
              value={documentType}
              onChange={(e) =>
                setFormData({ ...formData, documentType: e.target.value })
              }
            >
              <option value="">種類を選択する</option>
              {documentTypes.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="documentName">書類名:</label>
            <input
              type="text"
              id="documentName"
              placeholder="書類名/顧客名を入力してください"
              value={documentName}
              onChange={(e) =>
                setFormData({ ...formData, documentName: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label htmlFor="kindOfStamp">印章種類:</label>
            <select
              id="kindOfStamp"
              value={kindOfStamp}
              onChange={(e) =>
                setFormData({ ...formData, kindOfStamp: e.target.value })
              }
            >
              <option value="">印章種類選択してください</option>
              {stamps.map((stamp, index) => (
                <option key={index} value={stamp}>
                  {stamp}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="numberOfStamp">押印数:</label>
            <input
              type="number"
              id="numberOfStamp"
              value={numberOfStamp}
              onChange={(e) =>
                setFormData({ ...formData, numberOfStamp: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label htmlFor="reason">理由:</label>
            <input
              type="text"
              id="reason"
              value={reason}
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label htmlFor="branch">押印拠点:</label>
            <select
              id="branch"
              value={branch}
              onChange={(e) =>
                setFormData({ ...formData, branch: e.target.value })
              }
            >
              <option value="">支店の選択</option>
              {branches.map((branch, index) => (
                <option key={index} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="authorizer">承認者:</label>
            <select
              id="authorizer"
              value={authorizer}
              onChange={(e) =>
                setFormData({ ...formData, authorizer: e.target.value })
              }
            >
              <option value="">承認者を選択</option>
              {filteredAuthorizers.map((name, index) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="submit-button">
            提出する
          </button>
        </form>
      </div>
    </div>
  );
};

export async function getServerSideProps() {
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  return {
    props: {
      apiKey,
    },
  };
}

export default RequestForm;
