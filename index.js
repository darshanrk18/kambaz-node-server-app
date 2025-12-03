import "dotenv/config";
import express from "express";
import session from "express-session";
import cors from "cors";
import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import ModuleRoutes from "./Kambaz/Modules/routes.js";
import Database from "./Kambaz/Database/index.js";
import EnrollmentRoutes from "./Kambaz/Enrollments/routes.js";
import Lab5 from "./Lab5/index.js";

const app = express();

// CORS configuration - MUST come before session
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL || "http://localhost:3000",
  })
);

// Session configuration
const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
};

if (process.env.SERVER_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
  };
}

app.use(session(sessionOptions));
app.use(express.json());

// Routes
Lab5(app);
UserRoutes(app, Database);
CourseRoutes(app, Database);
ModuleRoutes(app, Database);
EnrollmentRoutes(app, Database);

app.listen(process.env.PORT || 4000, () => {
  console.log("Server running on port 4000");
});