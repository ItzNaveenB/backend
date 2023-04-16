const express = require('express')
const env = require('dotenv')
const app = express()
const mongoose = require('mongoose')
const userRoutes = require('./routes/auth')
const categoryRoutes = require("./routes/categories");
const cartRoutes = require("./routes/cart");
const adminRoutes = require("./routes/admin/auth");
const productRoutes = require("./routes/products");
const addressRoutes = require("./routes/address");
const orderRoutes = require("./routes/order");
const initialDataRoutes = require("./routes/admin/initialData");
const pageRoutes = require("./routes/admin/page");
const path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(cors());
app.use("/public", express.static(path.join(__dirname, "uploads")));
app.use(express.urlencoded({ extended: true }));

env.config();

// console.log(env.config())

const connection_url = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.cmgf85p.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`;
mongoose.connect(connection_url).then(() => {
  console.log("database connected");
})

app.use("/api", userRoutes);
app.use("/api", adminRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes);
app.use("/api", initialDataRoutes);
app.use("/api", pageRoutes);
app.use("/api",addressRoutes)
app.use("/api", orderRoutes);

// console.log(process.env)


app.listen(process.env.PORT,()=>{
    console.log(`Server listening on port ${process.env.PORT}`)
})