const express = require('express')
const env = require('dotenv')
const app = express()
const mongoose = require('mongoose')
const path = require("path");
const cors = require("cors");

const userRoutes = require('./routes/auth')
const adminRoutes = require("./routes/admin/auth");
const categoryRoutes = require("./routes/categories");
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const initialDataRoutes = require("./routes/admin/initialData");
const pageRoutes = require("./routes/admin/page");
const addressRoutes = require("./routes/address");
const orderRoutes = require("./routes/order");
const adminOrderRoute = require("./routes/admin/order.routes");
const formRoutes = require('./routes/formRoutes');
const userRoutes = require("./routes/admin/user");

// const corsOptions = {
//   origin: "https://ecommerce-frontend-seven-sable.vercel.app/",
// };
app.use(express.json());
app.use(cors());
app.use("/public", express.static(path.join(__dirname, "uploads")));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

env.config();
mongoose.set('strictQuery', false);


// const connection_url = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.cmgf85p.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`;
// mongoose.connect(connection_url).then(() => {
//   console.log("database connected");
// })

const connection_url =mongoose.connect('mongodb://127.0.0.1:27017/Tailor-app').then(()=> {
  console.log("Database connected..");
}).catch((e)=>{
  console.log(e);
})
// Define routes
const superadminRoute = require('./routes/admin/superadmin.js');

// Use routes

app.use("/api/user", userRoutes);
app.use('/superadmin', superadminRoute);
app.use("/api", userRoutes);
app.use("/api", adminRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes);
app.use("/api", initialDataRoutes);
app.use("/api", pageRoutes);
app.use("/api",addressRoutes)
app.use("/api", orderRoutes);
app.use("/api", adminOrderRoute);
app.use('/businessform', formRoutes);

app.listen(process.env.PORT,()=>{
    console.log(`Server listening on port ${process.env.PORT}`)
})
