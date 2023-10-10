const express = require("express");
const cors = require("cors"); 
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const app = express();
const authRoutes = require('./server/Routes/AuthRoutes'); 


app.listen(4000, () => {
    console.log("Server started at 4000");
});

app.get('/', (req, res) => {
    res.send('API is working!!');
});

mongoose.connect("mongodb+srv://saurav:saurav@cluster0.kt82iw8.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("DB connection connection success");
}).catch(error => {
    console.log(error.message);
});

app.use(
    cors({
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"],
        credentials: true,
    })
);
app.use(cookieParser());
app.use(express.json());
app.use("/", authRoutes); 
