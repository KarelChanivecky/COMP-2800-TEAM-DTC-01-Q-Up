import { db } from '../util/admin';
import * as firebase from 'firebase';
import { firebaseConfig } from '../util/config';
import { Request, Response } from 'express';
import { validateSignUpData, validateLoginData } from '../util/validators';

firebase.initializeApp(firebaseConfig);

const signup = async (req: Request, res: Response) => {
   const newUser = {
      // use toString() to prevent user entering nested object to database
      email: req.body.email.toString(),
      password: req.body.password.toString(),
      confirmPassword: req.body.confirmPassword.toString(),
      userType: req.body.userType,
   };

   const { valid, errors } = validateSignUpData(newUser);

   if (!valid) {
      return res.status(400).json(errors);
   } else {
      let token: string;
      let userId: any;

      await firebase
         .auth()
         .createUserWithEmailAndPassword(newUser.email, newUser.password)
         .then((data) => {
            userId = data.user?.uid;
            return data.user?.getIdToken().then((generatedToken) => {
               token = generatedToken;
               const userCredentials = {
                  email: newUser.email,
                  createdAt: new Date().toISOString(),
                  userId,
                  userType: newUser.userType,
               };
               return db
                  .doc(`/users/${newUser.email}`)
                  .set(userCredentials)
                  .then(() => {
                     return res.status(201).json({ token });
                  });
            });
         })
         .catch((err) => {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
               return res
                  .status(400)
                  .json({ email: 'Email is already in use' });
            } else {
               return res.status(500).json({ error: err.code });
            }
         });
      return res.status(201);
   }
};

const login = async (req: Request, res: Response) => {
   const user = {
      email: req.body.email,
      password: req.body.password,
   };
   const { valid, errors } = validateLoginData(user);

   if (!valid) {
      return res.status(400).json(errors);
   } else {
      await firebase
         .auth()
         .signInWithEmailAndPassword(user.email, user.password)
         .then((data) => {
            return data.user?.getIdToken().then((generatedToken) => {
               return res.status(200).json({ generatedToken });
            });
         })
         .catch((err) => {
            if (err.code === 'auth/wrong-password') {
               return res
                  .status(403)
                  .json({ general: 'Wrong credentials, please try again' });
            } else {
               return res.status(500).json({ error: err.code });
            }
         });
      return res.status(200);
   }
};

export { signup, login };
