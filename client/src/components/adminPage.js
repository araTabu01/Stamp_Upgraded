import React, { useState, useEffect } from "react";
import { FaFileExcel } from "react-icons/fa";
import logoImage from "../Assets/logo.png";
import "../styles/adminStyle.css";
import { useSelector, useDispatch } from "react-redux";
import { fetchStamp } from "../actions/crud";
import { formatDate } from "../utils/formatDate";
import { update_stamp, update_substitute_name } from "../api/index.js";
import { exportToExcel } from "../utils/excelUtils";
import Menu from "../components/Menu";

const Admin = () => {
  const [formDataList, setFormDataList] = useState([]);
  const dispatch = useDispatch();

  // Fetching stamp data
  useEffect(() => {
    dispatch(fetchStamp());
  }, [dispatch]);

  const data = useSelector((state) => state.crud.stampData);

  // Updating local state when data changes
  useEffect(() => {
    if (data && data.length > 0) {
      const mergedData = data.map((item) => {
        const localItem = formDataList.find(
          (localItem) => localItem.id === item.id
        );
        return localItem ? { ...item, ...localItem } : { ...item };
      });

      // Only update state if there are changes
      if (JSON.stringify(mergedData) !== JSON.stringify(formDataList)) {
        setFormDataList(mergedData);
      }
    }
  }, [data]); // Removed formDataList to prevent infinite loop

  // Handle date change
  const handleDateChange = async (index, event) => {
    const { value } = event.target;
    const updatedFormDataList = [...formDataList];
    const currentItem = updatedFormDataList[index];

    // Ensure approval date is not already set
    if (currentItem.approvalDate) {
      return;
    }

    // Update approval date in state
    updatedFormDataList[index] = {
      ...currentItem,
      approvalDate: value,
    };
    setFormDataList(updatedFormDataList); // Update state

    try {
      // Update approval date in backend
      await update_stamp({ id: currentItem.id, approvalDate: value });
    } catch (error) {
      console.error("Failed to update approval date", error);
    }
  };

  // Handle substitute name change
  const handleSubstituteNameChange = (index, event) => {
    const { value } = event.target;
    const updatedFormDataList = [...formDataList];
    const currentItem = updatedFormDataList[index];

    // Update substitute name in state
    updatedFormDataList[index] = {
      ...currentItem,
      substituteName: value,
      isSubstituteNameSaved: false, // Mark as unsaved
    };
    setFormDataList(updatedFormDataList); // Update state
  };

  // Approve row
  const handleApproveRow = async (index) => {
    const currentItem = formDataList[index];

    // Check if both fields are filled
    if (!currentItem.substituteName || !currentItem.approvalDate) {
      return;
    }

    try {
      // Update substitute name in backend
      await update_substitute_name({
        id: currentItem.id,
        substituteName: currentItem.substituteName,
      });

      // Mark substitute name as saved and make fields non-editable
      const updatedFormDataList = [...formDataList];
      updatedFormDataList[index] = {
        ...currentItem,
        isSubstituteNameSaved: true,
        isEditable: false,
        isApproved: true, // Mark as approved
      };
      setFormDataList(updatedFormDataList); // Update state
      localStorage.setItem("formDataList", JSON.stringify(updatedFormDataList));
    } catch (error) {
      console.error("Failed to approve", error);
    }
  };

  // Export to Excel
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

  // Load saved data from local storage
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("formDataList"));
    if (savedData) {
      setFormDataList(savedData);
    }
  }, []);

  // Helper function to format approval date for input
  const formatApprovalDate = (date) => {
    if (!date) return "";
    return date.split("T")[0]; // Get only the date part
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
                  <tr key={formData.id}>
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
                        value={formatApprovalDate(formData.approvalDate) || ""}
                        onChange={(event) => handleDateChange(index, event)}
                        disabled={formData.approvalDate !== null}
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
                        placeholder="代替者名" // Placeholder for visibility
                        className={`substitute-input ${
                          formData.isSubstituteNameSaved ? "greyed-out" : ""
                        }`}
                        disabled={formData.isSubstituteNameSaved}
                      />
                    </td>
                    <td>
                      <button
                        className="approve-button"
                        onClick={() => handleApproveRow(index)}
                        disabled={formData.isEditable}
                        style={{
                          backgroundColor: formData.isApproved ? "grey" : "",
                        }} // Set grey color if approved
                      >
                        承認
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="12">データがありません</td>
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

  return (
    <div>
      {isAuthenticated ? (
        <Admin />
      ) : (
        <div className="passcode-container">
          <h2>管理者パスコードを入力してください:</h2>
          <input
            type="password"
            value={passcode}
            onChange={handlePasscodeChange}
            placeholder="パスコード"
          />
          <button onClick={handlePasscodeSubmit}>送信</button>
        </div>
      )}
    </div>
  );
};

export default AdminWithPasscode;
