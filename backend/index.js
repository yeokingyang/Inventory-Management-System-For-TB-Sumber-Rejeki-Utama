import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
//import db from "./config/Database.js";
import UserRoute from "./routes/UserRoute.js";
import ItemRoute from "./routes/ItemRoute.js";
import AuthRoute from "./routes/AuthRoute.js";

dotenv.config();

const app = express();

//(async()=>{
 //   await db.sync();
//})

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));

app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUnitialized: true,
    cookie: {
        secure: 'auto'
    }
}))
app.use(express.json());
app.use(UserRoute);
app.use(ItemRoute);
app.use(AuthRoute);

app.listen(process.env.APP_PORT, ()=> {
console.log('Server is up and running...');
});