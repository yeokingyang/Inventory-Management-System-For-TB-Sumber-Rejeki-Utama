import express from "express";
import FileUpload from "express-fileupload";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/Database.js";
import SequelizeStore from "connect-session-sequelize";
import UserRoute from "./routes/UserRoute.js";
import ItemRoute from "./routes/ItemRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import OutgoingItemRoute from "./routes/OutgoingItemRoute.js";
import IncomingItemRoute from "./routes/IncomingItemRoute.js";

dotenv.config();

const app = express();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
    db: db
})
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
    store: store,
    cookie: {
        secure: 'auto'
    }
}))

app.use(FileUpload());
app.use(express.static("public"));
app.use(express.json());
app.use(UserRoute);
app.use(ItemRoute);
app.use(AuthRoute);
app.use(OutgoingItemRoute);
app.use(IncomingItemRoute);
//store.sync();

app.listen(process.env.APP_PORT, ()=> {
console.log('Server is up and running...');
});