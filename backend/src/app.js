const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");

const connectDB = require("./config/db");
const swaggerSpec = require("./config/swagger");

const authRoutes = require("./routes/v1/auth");
const taskRoutes = require("./routes/v1/tasks");
const adminRoutes = require("./routes/v1/admin");

connectDB();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300
  })
);

app.get("/", (_req, res) => {
  res.json({ message: "Task Manager API running" });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/admin", adminRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

module.exports = app;
