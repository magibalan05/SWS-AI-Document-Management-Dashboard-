const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");
const uploadRoutes = require("./routes/uploadRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

// connection happens below
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api", uploadRoutes);
app.use("/api", notificationRoutes);

connectDB().then(() => {
  app.listen(5000, () => {
    console.log("Server running on port 5000");
  });
});
