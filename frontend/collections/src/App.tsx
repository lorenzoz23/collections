import React from "react";
import "antd/dist/antd.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import LoginComponent from "./components/login.component";
import CreateUserComponent from "./components/create-user.component";
import DashboardComponent from "./components/dashboard.component";

const App: React.FC = () => {
  return (
    <Router>
      <Route path="/" exact component={LoginComponent} />
      <Route path="/create" component={CreateUserComponent} />
      <Route path="/dashboard/:id" component={DashboardComponent} />
    </Router>
  );
};

export default App;
