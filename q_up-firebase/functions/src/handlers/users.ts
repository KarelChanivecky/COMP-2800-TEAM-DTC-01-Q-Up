import {db, admin} from "../util/admin";
import * as firebase from "firebase";
import {firebaseConfig} from "../util/config";
import {Request, Response} from "express";
import {
    validateSignUpData,
    validateLoginData,
} from "../util/validators";

firebase.initializeApp(firebaseConfig);

const signup = async (req: Request, res: Response) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        userType: req.body.userType,
        businessName: req.body.businessName,
    };

    const {valid, errors} = validateSignUpData(newUser);

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
                    if (newUser.userType === "customer") {
                        const userCredentials = {
                            email: newUser.email,
                            currentQueue: null,
                            favoriteBusinesses: [],
                            userId,
                            userType: newUser.userType,
                        };
                        return db
                            .doc(`/users/${newUser.email}`)
                            .set(userCredentials)
                            .then(() => {
                                return res.status(201).json({token});
                            });
                    } else if (newUser.userType === "manager") {
                        const userCredentials = {
                            email: newUser.email,
                            businessName: newUser.businessName,
                            userId,
                            userType: newUser.userType,
                        };
                        let businessRef = db
                            .collection("businesses")
                            .doc(userCredentials.businessName);

                        businessRef.get().then((docSnapshot) => {
                            if (docSnapshot.exists) {
                                return res.status(500).json({
                                    businessName: "This business already has an account",
                                });
                            } else {
                                return db
                                    .doc(`/users/${newUser.email}`)
                                    .set(userCredentials)
                                    .then(() => {
                                        return res.status(201).json({token});
                                    });
                            }
                        });
                        return res.status(201);
                    } else if (newUser.userType === "booth") {
                        const userCredentials = {
                            email: newUser.email,
                            isOnline: false,
                            businessName: newUser.businessName,
                            queueName: newUser.businessName,
                            userId,
                            userType: "booth",
                        };
                        return db
                            .doc(`/users/${newUser.email}`)
                            .set(userCredentials)
                            .then(() => {
                                return res.status(201).json({token});
                            });
                    } else {
                        const userCredentials = {
                            email: newUser.email,
                            isOnline: false,
                            businessName: newUser.businessName,
                            queueName: newUser.businessName,
                            userId,
                            userType: "employee",
                        };
                        return db
                            .doc(`/users/${newUser.email}`)
                            .set(userCredentials)
                            .then(() => {
                                return res.status(201).json({token});
                            });
                    }
                });
            })
            .catch((err) => {
                console.error(err);
                if (err.code === "auth/email-already-in-use") {
                    return res.status(400).json({email: "Email is already in use"});
                } else {
                    return res
                        .status(500)
                        .json({general: "Something went wrong, please try again"});
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
    const {valid, errors} = validateLoginData(user);

    let resData = {};

    if (!valid) {
        return res.status(400).json(errors);
    } else {
        await firebase
            .auth()
            .signInWithEmailAndPassword(user.email, user.password)
            .then((data) => {
                return data.user?.getIdToken().then((generatedToken) => {
                    Object.assign(resData, {generatedToken});
                    admin
                        .auth()
                        .verifyIdToken(generatedToken)
                        .then((decodedToken) => {
                            return db
                                .collection("users")
                                .where("userId", "==", decodedToken.uid)
                                .limit(1)
                                .get()
                                .then((data) => {
                                    const usableData: any = data.docs[0].data();
                                    const userId = usableData.userId;
                                    const userEmail = usableData.email;
                                    const userType = usableData.userType;
                                    if (userType === 'employee') {
                                        db.collection('users').doc(userEmail).update({isOnline: true});
                                    }
                                    Object.assign(resData, {userId, userType, userEmail});
                                    return res.status(201).json(resData);
                                });
                        });
                });
            })
            .catch(() => {
                return res
                    .status(403)
                    .json({general: "Wrong credentials, please try again"});
            });
        return res.status(200);
    }
};

const logout = async (req: Request, res: Response) => {
    const requestData = {
        email: req.body.userEmail,
        userType: req.body.userType,
    };
    await firebase
        .auth()
        .signOut()
        .then(() => {
            if (requestData.userType === 'employee') {
                db.collection('users').doc(requestData.email).update({isOnline: false});
            }
        })
        .catch(() => {
            return res
                .status(401).json({general: "Logout unsuccessful!"});
        });
};

const changePassword = async (req: Request, res: Response) => {
    const requestData = {
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,

    };

    const userEmail = req.body.userEmail;

    if (requestData.confirmPassword !== requestData.password) {
        return res.status(400).json({confirmPassword: "Password must match"});
    }

    const userUID = await db
        .collection("users")
        .where("email", "==", userEmail)
        .limit(1)
        .get()
        .then((data) => {
            return data.docs[0].data().userId;
        })
        .catch((err) => {
            console.error(err);
            return res
                .status(500)
                .json({general: "Something went wrong, please try again"});
        });

    await admin
        .auth()
        .updateUser(userUID, {password: requestData.password})
        .then(() => {
            return res.status(200).json({general: "Password updated successfully"});
        })
        .catch(() => {
            return res
                .status(500)
                .json({general: "Something went wrong, please try again"});
        });
    return res.status(200);
};

export {signup, login, changePassword, logout};
