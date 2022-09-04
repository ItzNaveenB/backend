const express = require('express')
const env = require('dotenv')
const app = express()
const mongoose = require('mongoose')
const userRoutes = require('./routes/auth')
const adminRoutes = require('./routes/admin/auth')
app.use(express.json());
app.use(express.urlencoded({extended:true}))

env.config()

const connection_url = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.cmgf85p.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`;
mongoose.connect(connection_url)
.then(() => {
    console.log("database connected");
});

app.use('/api',userRoutes)
app.use('/api',adminRoutes)





app.listen(process.env.PORT,()=>{
    console.log(`Server listening on port ${process.env.PORT}`)
})