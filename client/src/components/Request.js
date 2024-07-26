import React, { useState } from "react";
import backgroundImage from "../Assets/request.jpg";
import { useDispatch } from "react-redux";
import {
  branches,
  documentTypes,
  stamps,
  authorizerNames,
} from "../enums/details.js";
import logoImage from "../Assets/logo.png";
import {
  mainbranch_name,
  tokoname_names,
  chiryu_names,
  shimane_names,
  nagoya_names,
  tokyo_names,
} from "../enums/details.js";
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
    name: "",
    branch: "",
    documentType: "",
    documentName: "",
    kindOfStamp: "",
    numberOfStamp: 1, // Set initial value to 1
    reason: "",
    authorizer: "",
  });

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

  // Define getFilteredNames function to filter names based on the selected branch
  const getFilteredNames = () => {
    switch (branch) {
      case "刈谷":
        return mainbranch_name;
      case "常滑":
        return tokoname_names;
      case "知立":
        return chiryu_names;
      case "島根":
        return shimane_names;
      case "東京":
        return tokyo_names;
      case "名古屋":
        return nagoya_names;
      default:
        return [];
    }
  };

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
      name: "",
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
            <label>日付:</label>
            <input type="date" value={date} readOnly />
          </div>
          <div className="form-group">
            <label>支店:</label>
            <select
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
            <label>依頼者:</label>
            <select
              value={name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            >
              <option value="">名前を選択してください</option>
              {getFilteredNames().map((name, index) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>種類:</label>
            <select
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
            <label>書類名:</label>
            <input
              type="text"
              placeholder="書類名/顧客名を入力してください"
              value={documentName}
              onChange={(e) =>
                setFormData({ ...formData, documentName: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>印章種類:</label>
            <select
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
            <label>押印数:</label>
            <input
              type="number"
              value={numberOfStamp}
              onChange={(e) =>
                setFormData({ ...formData, numberOfStamp: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>理由:</label>
            <input
              type="text"
              value={reason}
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>承認者:</label>
            <select
              value={authorizer}
              onChange={(e) =>
                setFormData({ ...formData, authorizer: e.target.value })
              }
            >
              <option value="">承認者を選択</option>
              {authorizerNames.map((name, index) => (
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

export async function fetchData() {
  // Your implementation to fetch data
}

export default RequestForm;
