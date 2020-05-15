import React from "react";
import "./App.css";
import axios from "axios";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import LandingPage from "./pages/landing";
import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";
import aboutUsPage from "./pages/aboutUs";
import themes from "./mui-theming/themes";
import termsPage from "./pages/termsAndConditions";
import privacyPage from "./pages/privaryPolicy";
import { ThemeProvider } from "@material-ui/core";
import ConsumerRegistrationPage from "./pages/consumerRegistration";
import BusinessRegistrationPage from "./pages/businessRegistration";
import BusinessDashboardPage from "./pages/businessDashboard";
import ConsumerDashboard from "./pages/consumerDashboard";
import ConsumerProfilePage from "./pages/consumerProfile";
import ConsumerEditProfilePage from "./pages/consumerEditProfile";
import BusinessProfilePage from "./pages/businessProfile";
import BusinessEditProfilePage from "./pages/businessEditProfile";
import queueSearchPage from "./pages/queueSearch";
import EmployeeManagementPage from "./pages/employeeManagement";

axios.defaults.baseURL =
  "https://us-central1-q-up-c2b70.cloudfunctions.net/api";

function App() {
  const theme = themes();
  return (
    <Router>
      <div className="App">
        <ThemeProvider theme={theme}>
          <Switch>
            <Route path="/" component={LandingPage} exact />
            <Route path="/login" component={LoginPage} exact />
            <Route path="/signup" component={SignupPage} exact />
            <Route path="/aboutUs" component={aboutUsPage} exact />
            <Route path="/consumerRegistration" component={ConsumerRegistrationPage} exact />
            <Route path="/businessRegistration" component={BusinessRegistrationPage} exact />
            <Route path="/termsAndConditions" component={termsPage} exact />
            <Route path="/PrivacyPolicy" component={privacyPage} exact />
            <Route path="/businessDashboard" component={BusinessDashboardPage} exact />
            <Route path="/consumerDashboard" component={ConsumerDashboard} exact />
            <Route path="/consumerProfile" component={ConsumerProfilePage} exact/>
            <Route path="/editConsumerProfile" component={ConsumerEditProfilePage} exact/>
            <Route path="/businessProfile" component={BusinessProfilePage} exact/>
            <Route path="/editBusinessProfile" component={BusinessEditProfilePage} exact />
            <Route path="/searchQueues" component={queueSearchPage} exact />
            <Route path="/employeeManagement" component={EmployeeManagementPage} exact />
          </Switch>
        </ThemeProvider>
      </div>
    </Router>
  );
}

export default App;
