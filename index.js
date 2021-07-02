const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");

const app = express();

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then((result) => {
    console.log("Database connected !!");
  })
  .catch((error) => {
    console.log("Error in Database connection !!");
    console.log(error);
  });

app.use(express.json());
app.use("/api/user", userRoute);
app.use("/api/post", postRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Node server running at port ${PORT}`);
});
