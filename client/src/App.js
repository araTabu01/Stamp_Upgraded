import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import HomePage from "./components/Home";
import RequestForm from "./components/Request";
import History from "./components/History";
import Admin from "./components/adminPage";
import { Provider } from "react-redux";
import store from "./redux/store";
import ReactDOM from "react-dom";

const App = () => {
  // eslint-disable-next-line no-unused-vars
  const handleLogin = (username) => {
    // Handle login logic
  };
  // eslint-disable-next-line no-unused-vars
  const handleRegister = ({ username, password }) => {
    // Handle registration logic
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/request" element={<RequestForm />} />
        <Route path="/history" element={<History />} />

        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
};

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

export default App;
