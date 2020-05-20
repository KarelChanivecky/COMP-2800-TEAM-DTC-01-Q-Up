import React from "react";
import firebase from "firebase";
import axios from "axios";
import { Button, Grid } from "@material-ui/core";

firebase.initializeApp({
  apiKey: "AIzaSyCd2O4kN23xnVMtzVKm_fzt4iBQ7VH7T_8",
  authDomain: "q-up-c2b70.firebaseapp.com",
});

export default function FirebaseLogin() {
  const oAuthSignup = async (provider: firebase.auth.AuthProvider) => {
    let token: string = "";
    let userData: any;
    let isNewUser: any;
    const result = await firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        result.user?.getIdToken().then((generatedToken) => {
          token = generatedToken;
          return token;
        });
        userData = result.user;
        isNewUser = result.additionalUserInfo?.isNewUser;
      })
      .catch((err) => {
        console.error(err);
        if (err.code === "auth/account-exists-with-different-credential") {
          window.alert(
            "This account already exists! Please login with the right method."
          );
        } else {
          window.alert(
            "You closed the popup before finalizing your sign up, please try again."
          );
        }
        return null;
      });

    if (result === null) {
      return;
    }

    sessionStorage.setItem(
      "user",
      JSON.stringify({
        token,
        type: "customer",
      })
    );
    if (isNewUser) {
      let requestData = {
        email: userData.email,
        userId: userData.uid,
      };
      axios
        .post("/oAuthSignup", requestData)
        .then(() => {
          window.location.href = "/consumerRegistration";
        })
        .catch((err) => {
          if (err.response.status === 409) {
            window.alert(
              "This account already exists! Please login with the right method."
            );
          } else {
            console.error(err);
            window.alert(
              "Something went wrong with sign up, please try again."
            );
          }
        });
    } else {
      window.location.href = "/consumerDashBoard";
    }
  };

  const signInWithGoogle = () => {
    let provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/userinfo.email");
    oAuthSignup(provider);
  };

  const signInWithFacebook = () => {
    let provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope("email");
    oAuthSignup(provider);
  };

  const signInWithGithub = () => {
    let provider = new firebase.auth.GithubAuthProvider();
    oAuthSignup(provider);
  };

  return (
    <>
      <Grid container direction="column">
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={signInWithGoogle}
        >
          Login with Google
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={signInWithFacebook}
        >
          Login with Facebook
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={signInWithGithub}
        >
          Login with Github
        </Button>
      </Grid>
    </>
  );
}
