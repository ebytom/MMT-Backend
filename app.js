// packages
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

require("dotenv").config();

// middleware handlers
const { error } = require("./utils/error");
const isAuthenticated = require("./middleware/isAuthenticated");
const isAdmin = require("./middleware/isAdmin");

// routers
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const adminRouter = require("./routes/admin");
const trucksRoutes = require("./routes/trucks");
const fuelExpensesRoutes = require("./routes/fuelExpenses");
const defExpensesRoutes = require("./routes/defExpenses");
const otherExpensesRoutes = require("./routes/otherExpenses");
const totalExpensesRoutes = require("./routes/totalExpenses");
const calculateLoanRoutes = require("./routes/calculateLoan");
const metadata = require("./routes/metadata");

// express app
const app = express();

// middlewares
app.use(
  cors({
    origin: "*", // Allow requests from any origin
    methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"], // Allow specified methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow specified headers
    credentials: true, // Allow credentials (cookies, authorization headers)
  })
);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// routes
app.use("/api/v1/app/auth", authRouter);
app.use("/api/v1/app/users", isAuthenticated, usersRouter);
app.use("/api/v1/admin", isAdmin, adminRouter);
app.use("/", indexRouter);
app.use("/api/v1/app/truck", isAuthenticated, trucksRoutes);
app.use("/api/v1/app/fuelExpenses", isAuthenticated, fuelExpensesRoutes);
app.use("/api/v1/app/defExpenses", isAuthenticated, defExpensesRoutes);
app.use("/api/v1/app/otherExpenses", isAuthenticated, otherExpensesRoutes);
app.use("/api/v1/app/totalExpenses", isAuthenticated, totalExpensesRoutes);
app.use("/api/v1/app/calculateLoan", isAuthenticated, calculateLoanRoutes);
app.use("/api/v1/app/metadata", isAuthenticated, metadata);

// error handler
app.use(error);

// Database connection and server startup for Vercel
const { connectDB } = require("./database/connection");

// Connect to database
if (require.main === module) {
  // This code only runs when app.js is the main module (entry point)
  const port = process.env.PORT || 8000;

  connectDB().then(() => {
    try {
      app.listen(port, () => {
        console.log(`Server connected on port ${port}`);
      });
    } catch (error) {
      console.log('Cannot connect to the server');
    }
  }).catch(error => {
    console.log("Invalid database connection...!");
  });
}

module.exports = app;
