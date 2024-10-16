import React, { useState } from "react";
import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../Assets/login_backgrd.jpg";
import { userLogin } from "../api/index";
import "../styles/loginStyle.css";

const Login = () => {
  const [easyproID, setEasyproID] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  // Assuming your login controller returns user information including 'name'
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Set submitting state to true while waiting for response
    try {
      const response = await userLogin({ easyproID, password });

      if (response.error) {
        // Handle error response from backend
        setErrorMessage(response.error);
      } else {
        // Assuming successful login returns the user object
        const user = response.user;

        // Store user data in localStorage or state
        localStorage.setItem("userId", JSON.stringify(user.id));
        localStorage.setItem("userName", user.name); // Store the user name

        // Redirect to home page or perform any other action
        navigate("/request");
      }
    } catch (error) {
      console.error("Login failed", error);
      // Handle login failure, e.g., display error message to the user
      setErrorMessage("Failed to login. Please try again.");
    } finally {
      setIsSubmitting(false); // Reset submitting state regardless of success or failure
    }
  };

  return (
    <div
      className="login-container"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#f0f0f0",
      }}
    >
      <div className="overlay"></div>
      <div className="login-form">
        <h2>ログイン</h2>
        <div className="input-container">
          <FaUser className="input-icon" />
          <input
            type="text"
            placeholder="EasyPro ID"
            value={easyproID}
            onChange={(e) => setEasyproID(e.target.value)}
            pattern="[A-Za-z0-9]+"
          />
        </div>
        <div className="input-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {showPassword ? (
            <FaEyeSlash
              className="password-icon"
              onClick={() => setShowPassword(!showPassword)}
            />
          ) : (
            <FaEye
              className="password-icon"
              onClick={() => setShowPassword(!showPassword)}
            />
          )}
        </div>
        <button
          onClick={handleLogin}
          disabled={!easyproID || !password || isSubmitting}
        >
          {isSubmitting ? "ログイン中..." : "ログイン"}
        </button>
        {errorMessage && <h3 style={{ color: "red" }}>{errorMessage}</h3>}
      </div>
    </div>
  );
};

export default Login;
