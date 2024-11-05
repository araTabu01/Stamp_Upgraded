import React, { useState, useEffect, useCallback } from "react";
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
  const [selectedName, setSelectedName] = useState("");
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
        return localItem
          ? { ...item, ...localItem }
          : { ...item, isApproved: false };
      });
      setFormDataList(mergedData);
    }
  }, [data]);

  const handleDateChange = useCallback(
    async (index, event) => {
      const { value } = event.target;
      const updatedFormDataList = [...formDataList];
      const currentItem = updatedFormDataList[index];

      if (currentItem.isApproved && !currentItem.isEditing) {
        return;
      }

      updatedFormDataList[index] = { ...currentItem, approvalDate: value };
      setFormDataList(updatedFormDataList);

      try {
        await update_stamp({ id: currentItem.id, approvalDate: value });
        localStorage.setItem(
          "formDataList",
          JSON.stringify(updatedFormDataList)
        );
      } catch (error) {
        console.error("Failed to update approval date", error);
      }
    },
    [formDataList]
  );

  const handleSubstituteNameChange = useCallback(
    (index, event) => {
      const { value } = event.target;
      const updatedFormDataList = [...formDataList];
      const currentItem = updatedFormDataList[index];

      if (!currentItem.isApproved) {
        updatedFormDataList[index] = {
          ...currentItem,
          substituteName: value,
          isSubstituteNameSaved: false,
        };
        setFormDataList(updatedFormDataList);
        localStorage.setItem(
          "formDataList",
          JSON.stringify(updatedFormDataList)
        );
      }
    },
    [formDataList]
  );

  const handleApproveRow = useCallback(
    async (index) => {
      const currentItem = formDataList[index];

      try {
        if (currentItem.substituteName) {
          await update_substitute_name({
            id: currentItem.id,
            substituteName: currentItem.substituteName,
          });
        }

        const updatedFormDataList = [...formDataList];
        updatedFormDataList[index] = {
          ...currentItem,
          isApproved: true,
          approvalStatus: "承認済",
          isEditing: false,
        };
        setFormDataList(updatedFormDataList);

        localStorage.setItem(
          "formDataList",
          JSON.stringify(updatedFormDataList)
        );
      } catch (error) {
        console.error("Failed to approve", error);
      }
    },
    [formDataList]
  );

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("formDataList"));
    if (savedData) {
      setFormDataList(savedData);
    }
  }, []);

  const filteredData = selectedName
    ? formDataList.filter((formData) => formData.authorizer === selectedName)
    : formDataList;

  const sortedFilteredData = filteredData
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .sort((a, b) => {
      const aApproved = a.isApproved ? 1 : 0;
      const bApproved = b.isApproved ? 1 : 0;
      return aApproved - bApproved;
    });

  const handleExportExcel = () => {
    const exportData = filteredData.map(
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

  const requiredNames = [
    "田中秀範",
    "筧光能",
    "長谷川良",
    "中川幸作",
    "柴田侑",
    "丹羽一朗",
    "今井裕人",
    "籾山陽平",
    "澤邊香穂",
    "山根正人",
    "中野訓子",
    "冨田幸弘",
  ];

  const uniqueNames = [...new Set(requiredNames), "江崎千紗"];

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
        <div>
          <div className="dropdown-container">
            <select
              onChange={(event) => setSelectedName(event.target.value)}
              value={selectedName}
            >
              <option value="">名前を選択</option>
              {uniqueNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
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
              {sortedFilteredData.length > 0 ? (
                sortedFilteredData.map((formData, index) => (
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
                        value={formData.approvalDate || ""}
                        onChange={(event) => handleDateChange(index, event)}
                        disabled={formData.isApproved && !formData.isEditing}
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
                        disabled={formData.isApproved}
                      />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {formData.isApproved ? (
                        <span style={{ color: "grey" }}>承認済</span>
                      ) : (
                        <button
                          className="approve-button"
                          onClick={() => handleApproveRow(index)}
                        >
                          承認
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="12" style={{ textAlign: "center" }}>
                    データがありません
                  </td>
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
          <h2>管理者パスコードを入力してください</h2>
          <input
            type="password"
            value={passcode}
            onChange={handlePasscodeChange}
          />
          <button onClick={handlePasscodeSubmit}>送信</button>
        </div>
      )}
    </div>
  );
};

export default AdminWithPasscode;
