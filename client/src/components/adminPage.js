import React, { useState, useEffect } from "react";
//import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import logoImage from "../Assets/logo.png";
import "../styles/adminStyle.css";
import { useSelector, useDispatch } from "react-redux";
import { fetchStamp } from "../actions/crud";
import { formatDate } from "../utils/formatDate";
import { update_stamp } from "../api";
import Menu from "../components/Menu"; // Import the Menu component

const Admin = () => {
  const [formDataList, setFormDataList] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchStamp());
  }, [dispatch]);

  const data = useSelector((state) => state.crud.stampData);

  useEffect(() => {
    const storedFormData = localStorage.getItem("formData");
    if (storedFormData) {
      const parsedFormData = JSON.parse(storedFormData);
      setFormDataList(parsedFormData);
    }
  }, []); // Load data from localStorage only on component mount

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
  }, [data]); // Removed formDataList from dependency array

  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formDataList));
  }, [formDataList]); // Store formDataList in localStorage whenever it changes

  const handleDateChange = async (index, event) => {
    const { value } = event.target;
    const updatedFormDataList = [...formDataList];
    const currentItem = updatedFormDataList[index];

    if (currentItem.approvalDate) {
      // If approvalDate is already set, do nothing
      return;
    }

    try {
      const updatedItem = {
        ...currentItem,
        approvalDate: value,
      };

      // await axios.patch(http://localhost:5010/api/stamps, {
      //   id: updatedItem.id,
      //   approvalDate: value,
      // });

      await update_stamp({ id: updatedItem.id, approvalDate: value });

      updatedFormDataList[index] = updatedItem;
      setFormDataList(updatedFormDataList);
    } catch (error) {
      console.error("Failed to update approval date", error);
    }
  };

  const handleDeleteRow = (index) => {
    setFormDataList((prevFormDataList) => {
      const updatedFormDataList = prevFormDataList.filter(
        (_, i) => i !== index
      );
      return updatedFormDataList;
    });
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
          <h1> 管理者</h1>
        </div>
      </header>
      <Menu /> {/* Add the Menu component */}
      <div className="admin-container">
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
                <th>取り除く</th>
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
                        disabled={formData.approvalDate || formData.isApproved} // Disable if already set or approved
                      />
                    </td>
                    <td>{formData.authorizer}</td>
                    <td>
                      <FaTrash
                        onClick={() => handleDeleteRow(index)}
                        style={{ cursor: "pointer" }}
                      />
                    </td>
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

const AdminWithPasscode = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");

  const handlePasscodeChange = (e) => {
    setPasscode(e.target.value);
  };

  const handlePasscodeSubmit = () => {
    const correctPasscode = "12345"; // Replace with your actual passcode
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
      <button onClick={handlePasscodeSubmit}>提出する</button>
    </div>
  );
};

export default AdminWithPasscode;
