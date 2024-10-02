import React, { useState, useEffect } from "react";
import { FaFileExcel } from "react-icons/fa";
import logoImage from "../Assets/logo.png";
import "../styles/historyStyle.css";
import { useDispatch, useSelector } from "react-redux";
import { deleteStamp, fetchStamp } from "../actions/crud";
import { formatDate } from "../utils/formatDate";
import { exportToExcel } from "../utils/excelUtils";
import Menu from "./Menu"; // Import the Menu component

const History = () => {
  const dispatch = useDispatch();
  const [toggleDelete, setToggleDelete] = useState(false);

  useEffect(() => {
    dispatch(fetchStamp());
  }, [dispatch]);

  const data = useSelector((state) => state.crud.stampData);

  const handleDelete = (id) => {
    dispatch(deleteStamp({ id: id }));
  };

  const handleExportExcel = () => {
    const exportData = data.map(
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
        substituteName, // Include substituteName here
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
        substituteName, // Include substituteName in export
      })
    );
    exportToExcel(exportData);
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
          <h1>履歴</h1>
        </div>
      </header>
      <Menu />
      <div className="history-container">
        <div className="button-container">
          <button
            onClick={() => setToggleDelete((prev) => !prev)}
            className="delete-button"
          >
            {toggleDelete ? "戻る" : "消去する"}
          </button>
          <button className="export-button" onClick={handleExportExcel}>
            <FaFileExcel size={38} />
          </button>
        </div>

        <div className="history-table-container">
          <table className="history-table">
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
                <th>代替者名</th> {/* New column for Substitute Name */}
                <th>状況</th>
                {toggleDelete && <th>消去する</th>}
              </tr>
            </thead>
            <tbody>
              {Array.isArray(data) && data.length > 0 ? (
                data.map((formData, index) => (
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
                      {formData.approvalDate
                        ? formatDate(formData.approvalDate)
                        : ""}
                    </td>
                    <td>{formData.authorizer}</td>
                    <td>{formData.substituteName || "なし"}</td>{" "}
                    {/* Display Substitute Name */}
                    <td>{formData.approvalDate ? "✅" : "❎"}</td>
                    {toggleDelete && (
                      <th>
                        <button onClick={() => handleDelete(formData.id)}>
                          X
                        </button>
                      </th>
                    )}
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

export default History;
