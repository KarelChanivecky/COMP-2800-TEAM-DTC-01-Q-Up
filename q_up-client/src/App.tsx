import React from "react";
import "./App.scss";
import axios from "axios";
import firebase from "firebase";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import LandingPage from "./pages/landing";
import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";
import aboutUsPage from "./pages/aboutUs";
import themes from "./mui-theming/themes";
import termsPage from "./pages/termsAndConditions";
import privacyPage from "./pages/privacyPolicy";
import { ThemeProvider } from "@material-ui/core";
import ConsumerRegistrationPage from "./pages/consumerRegistration";
import BusinessRegistrationPage from "./pages/businessRegistration";
import BusinessDashboardPage from "./pages/businessDashboard";
import ConsumerDashboard from "./pages/consumerDashboard";
import ConsumerProfilePage from "./pages/consumerProfile";
import ConsumerEditProfilePage from "./pages/consumerEditProfile";
import BusinessProfilePage from "./pages/businessProfile";
import BusinessEditProfilePage from "./pages/businessEditProfile";
import EmployeeManagementPage from "./pages/employeeManagement";
import QueueSearchPage from "./pages/queueSearch";
import TellerPage from "./pages/teller";
import Booth from './pages/booth';
import ContactUsPage from "./pages/contactUs";
import DisplayScreen from './pages/displayScreen'

axios.defaults.baseURL =
  "https://us-central1-q-up-c2b70.cloudfunctions.net/api";

  firebase.initializeApp({
    apiKey: "AIzaSyCd2O4kN23xnVMtzVKm_fzt4iBQ7VH7T_8",
    authDomain: "q-up-c2b70.firebaseapp.com",
  });

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
            <Route path="/consumerProfile" component={ConsumerProfilePage} exact />
            <Route path="/editConsumerProfile" component={ConsumerEditProfilePage} exact />
            <Route path="/businessProfile" component={BusinessProfilePage} exact />
            <Route path="/editBusinessProfile" component={BusinessEditProfilePage} exact />
            <Route path="/searchQueues" component={QueueSearchPage} exact />
            <Route path="/employeeManagement" component={EmployeeManagementPage} exact />
            <Route path="/teller" component={TellerPage} exact />
            <Route path="/boothDashBoard" component={Booth} exact />
            <Route path="/contactUs" component={ContactUsPage} exact/>
            <Route path="/display" component={DisplayScreen} exact/>
          </Switch>
        </ThemeProvider>
      </div>
    </Router>
  );
}

export default App;
