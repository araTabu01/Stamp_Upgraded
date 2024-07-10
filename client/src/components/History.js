import React, { useState, useEffect } from "react";
import { FaHome, FaFileExcel } from "react-icons/fa";
import Logo from "../Assets/logo.png";
import { Link } from "react-router-dom";
import "../styles/historyStyle.css";
import { useDispatch, useSelector } from "react-redux";
import { deleteStamp, fetchStamp } from "../actions/crud";
import { formatDate } from "../utils/formatDate";
import { exportToExcel } from "../utils/excelUtils";

const History = () => {
  const dispatch = useDispatch();

  const [toggleDelete, setToggleDelete] = useState(false);

  useEffect(() => {
    dispatch(fetchStamp());
  }, [dispatch]);

  const data = useSelector((state) => state.crud.stampData);
  console.log("The received data is ", data);

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
      })
    );
    exportToExcel(exportData);
  };

  return (
    <div className="history-page-container">
      <div className="history-container">
        <a
          href="https://www.tel-mic.co.jp/"
          target="_blank"
          rel="noopener noreferrer"
          className="logo-container top-left"
        >
          <img src={Logo} alt="Your Logo" className="logo" />
        </a>
        <Link to="/home" className="home-button top-right">
          <FaHome size={30} />
        </Link>

        <div className="button-container">
          <button
            onClick={() => setToggleDelete((prev) => !prev)}
            className="delete-button"
          >
            {toggleDelete ? "Return" : "Delete"}
          </button>
          <button className="export-button" onClick={handleExportExcel}>
            <FaFileExcel size={30} />
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
                  <td colSpan="11">データなし</td>
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
