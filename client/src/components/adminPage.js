import React, { useState, useEffect } from "react";
import { FaFileExcel } from "react-icons/fa";
import logoImage from "../Assets/logo.png";
import "../styles/adminStyle.css";
import { useSelector, useDispatch } from "react-redux";
import { fetchStamp } from "../actions/crud"; // Removed deleteStamp action
import { formatDate } from "../utils/formatDate";
import { update_stamp, update_substitute_name } from "../api"; // Assuming these are your API functions
import { exportToExcel } from "../utils/excelUtils";
import Menu from "../components/Menu";

const Admin = () => {
  const [formDataList, setFormDataList] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchStamp());
  }, [dispatch]);

  const data = useSelector((state) => state.crud.stampData);

  useEffect(() => {
    if (data && data.length > 0) {
      const mergedData = data.map((item) => {
        const localItem = formDataList.find(
          (localItem) => localItem.id === item.id
        );
        return localItem ? { ...item, ...localItem } : { ...item };
      });
      setFormDataList(mergedData);
    }
  }, [data]);

  const handleDateChange = async (index, event) => {
    const { value } = event.target;
    const updatedFormDataList = [...formDataList];
    const currentItem = updatedFormDataList[index];

    if (currentItem.approvalDate) {
      return;
    }

    try {
      const updatedItem = { ...currentItem, approvalDate: value };
      await update_stamp({ id: updatedItem.id, approvalDate: value });
      updatedFormDataList[index] = updatedItem;
      setFormDataList(updatedFormDataList);
    } catch (error) {
      console.error("Failed to update approval date", error);
    }
  };

  const handleSubstituteNameChange = (index, event) => {
    const { value } = event.target;
    const updatedFormDataList = [...formDataList];
    const currentItem = updatedFormDataList[index];
    if (!currentItem.isSubstituteNameSaved) {
      updatedFormDataList[index] = { ...currentItem, substituteName: value };
      setFormDataList(updatedFormDataList);
    }
  };

  const handleApproveRow = async (index) => {
    const currentItem = formDataList[index];
    if (!currentItem.substituteName || !currentItem.approvalDate) {
      return;
    }

    try {
      await update_substitute_name({
        id: currentItem.id,
        substituteName: currentItem.substituteName,
      });
      const updatedFormDataList = [...formDataList];
      updatedFormDataList[index] = {
        ...currentItem,
        isSubstituteNameSaved: true,
        isEditable: false,
      };
      setFormDataList(updatedFormDataList);
      localStorage.setItem("formDataList", JSON.stringify(updatedFormDataList));
    } catch (error) {
      console.error("Failed to approve", error);
    }
  };

  const handleExportExcel = () => {
    const exportData = formDataList.map(
      ({
        date,
        branch,
        name,
        documentType,
        documentName,
        kindOfStamp,
        numberOfStamp,
        reason,
        approvalDate,
        authorizer,
        substituteName,
      }) => ({
        date: formatDate(date),
        branch,
        requester: name,
        documentType,
        documentName,
        sealName: kindOfStamp,
        numberOfStamps: numberOfStamp,
        reason,
        approvalDate: approvalDate ? formatDate(approvalDate) : "",
        approver: authorizer,
        substituteName,
      })
    );
    exportToExcel(exportData);
  };

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("formDataList"));
    if (savedData) {
      setFormDataList(savedData);
    }
  }, []);

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
          <h1>管理者</h1>
        </div>
      </header>
      <Menu />
      <div className="admin-container">
        <div className="button-container">
          <button className="export-button" onClick={handleExportExcel}>
            <FaFileExcel size={38} />
          </button>
        </div>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>日付</th>
                <th>支店</th>
                <th>依頼者</th>
                <th>種類</th>
                <th>書類名</th>
                <th>印章種類</th>
                <th>押印数</th>
                <th>理由</th>
                <th>承認日</th>
                <th>承認者</th>
                <th>代替者名</th>
                <th>承認</th>
              </tr>
            </thead>
            <tbody>
              {formDataList && formDataList.length > 0 ? (
                formDataList.map((formData, index) => (
                  <tr key={index}>
                    <td>{formatDate(formData.date)}</td>
                    <td>{formData.branch}</td>
                    <td>{formData.name}</td>
                    <td>{formData.documentType}</td>
                    <td>{formData.documentName}</td>
                    <td>{formData.kindOfStamp}</td>
                    <td>{formData.numberOfStamp}</td>
                    <td>{formData.reason}</td>
                    <td>
                      <input
                        type="date"
                        value={formData.approvalDate || ""}
                        onChange={(event) => handleDateChange(index, event)}
                        disabled={
                          formData.isEditable === false || formData.approvalDate
                        }
                      />
                    </td>
                    <td>{formData.authorizer}</td>
                    <td>
                      <input
                        type="text"
                        value={formData.substituteName || ""}
                        onChange={(event) =>
                          handleSubstituteNameChange(index, event)
                        }
                        placeholder="Enter name"
                        className={
                          formData.isSubstituteNameSaved ? "greyed-out" : ""
                        }
                        disabled={
                          formData.isSubstituteNameSaved ||
                          (formData.isEditable === false &&
                            !formData.isSubstituteNameSaved)
                        }
                      />
                    </td>
                    <td>
                      <button
                        className={`approve-button ${
                          formData.isSubstituteNameSaved &&
                          formData.approvalDate
                            ? "greyed-out"
                            : ""
                        }`}
                        disabled={
                          !formData.substituteName || !formData.approvalDate
                        }
                        onClick={() => handleApproveRow(index)}
                      >
                        承認
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="12">データなし</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const AdminWithPasscode = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");

  const handlePasscodeChange = (e) => {
    setPasscode(e.target.value);
  };

  const handlePasscodeSubmit = () => {
    const correctPasscode = "12345";
    if (passcode === correctPasscode) {
      setIsAuthenticated(true);
    } else {
      alert("それは間違っています。もう一度お試しください。");
      setPasscode("");
    }
  };

  if (isAuthenticated) {
    return <Admin />;
  }

  return (
    <div className="passcode-container">
      <h2>パスコードを入力してください</h2>
      <input type="password" value={passcode} onChange={handlePasscodeChange} />
      <button onClick={handlePasscodeSubmit}>次</button>
    </div>
  );
};

export default AdminWithPasscode;
