import * as functions from "firebase-functions";
import {
    getQueue,
    getQueueInfoForBusiness,
    getQueueSlotInfo,
    customerEnterQueue,
    VIPEnterQueue,
    abandonQueueSlot,
    changeQueueStatus,
    getFavouriteQueuesForCustomer, changeStatusOfFavouriteBusiness,
} from "./handlers/queues";
import {boothEnterQueue, createNewBooth} from "./handlers/booths";
import * as express from "express";
import * as cors from "cors";
import {signUp, login, changePassword, logout} from "./handlers/users";
import {
    updateCustomerInfo,
    deleteCustomer,
    getCustomer, registerCustomer,
} from "./handlers/customers";
import {
    updateBusiness,
    uploadBusinessImage,
    getBusiness, registerBusiness, deleteBusiness,
} from "./handlers/businesses";
import {FBAuth} from "./util/fbAuth";
import algoliasearch from "algoliasearch";
import {
    checkInQueue,
    registerEmployee,
    deleteEmployee,
    getListOfAllEmployees, getOnlineEmployees,
    updateEmployee
} from "./handlers/employees";

const app = express();
app.use(cors());

// algolia config
const APP_ID = functions.config().algolia.app;
const ADMIN_KEY = functions.config().algolia.key;
const client = algoliasearch(APP_ID, ADMIN_KEY);
const index = client.initIndex("businesses");


// all routes start with https://us-central1-q-up-c2b70.cloudfunctions.net/api


// ========================
// Authentication Routes
// ========================
app.post("/signup", signUp);
app.post("/login", login);
app.get('/logout', FBAuth, logout);
app.put("/changePassword", FBAuth, changePassword);


// ========================
// Business Routes
// ========================
app.post('/registerBusiness', FBAuth, registerBusiness);
app.post("/uploadBusinessImage", FBAuth, uploadBusinessImage);
app.get("/getBusiness", FBAuth, getBusiness);
app.put("/updateBusiness", FBAuth, updateBusiness);
app.delete('/deleteBusiness', FBAuth, deleteBusiness);


// ========================
// Customer Routes
// ========================
app.get("/getCustomer", FBAuth, getCustomer);
app.post('/registerCustomer', FBAuth, registerCustomer);
app.put("/updateCustomer", FBAuth, updateCustomerInfo);
app.delete("/deleteCustomer", FBAuth, deleteCustomer);


// ========================
// Employee Routes
// ========================
app.post('/registerEmployee', FBAuth, registerEmployee);
app.put('/updateEmployee', FBAuth, updateEmployee);
app.delete('/deleteEmployee', FBAuth, deleteEmployee);
app.post('/checkInQueue', FBAuth, checkInQueue);
app.get('/getListOfAllEmployees', FBAuth, getListOfAllEmployees);
app.get('/getOnlineEmployees', FBAuth, getOnlineEmployees);


// ========================
// Queue Routes
// ========================
app.get("/getQueue", FBAuth, getQueue);
app.get("/businessQueueInfo", FBAuth, getQueueInfoForBusiness);
app.get("/getCustomerQueueInfo", FBAuth, getQueueSlotInfo);
app.post("/customerEnterQueue", FBAuth, customerEnterQueue);
app.post("/VIPEnterQueue", FBAuth, VIPEnterQueue);
app.put("/abandonQueueSlot", FBAuth, abandonQueueSlot);
app.put("/changeQueueStatus", FBAuth, changeQueueStatus);
app.get("/getFavouriteQueues", FBAuth, getFavouriteQueuesForCustomer);
app.put('/changeFavoriteQueueStatus',FBAuth, changeStatusOfFavouriteBusiness);

// ========================
// Booth Routes
// ========================
app.post("/boothEnterQueue", FBAuth, boothEnterQueue);
app.post("/createNewBooth", FBAuth, createNewBooth);


// ========================
// Algolia exports
// ========================
exports.addToIndex = functions.firestore
    .document("businesses/{businessId}")
    .onCreate((snapshot) => {
        const data = snapshot.data();
        const objectID = snapshot.id;

        return index.saveObject({...data, objectID});
    });
exports.updateIndex = functions.firestore
    .document("businesses/{businessId}")
    .onUpdate((change) => {
        const newData = change.after.data();
        const objectID = change.after.id;

        return index.saveObject({...newData, objectID});
    });
exports.deleteFromIndex = functions.firestore
    .document("businesses/{businessId}")
    .onDelete((snapshot) => {
        index.deleteObject(snapshot.id);
    });


exports.api = functions.https.onRequest(app);
