import express from "express";
import cors from "cors";
import routes from "./routes/routes.js"
import scanRoutes from "./routes/scanRoute.js"
import teacherRoutes from "./routes/teacherRoute.js"

const app = express();

// Middlewares
app.use(cors({
  origin: "*"
}));
app.use(express.json());


app.use("/api", routes);
app.use("/api/scan", scanRoutes);
app.use("/api/teacher", teacherRoutes);

app.listen(4000,"192.168.0.195", () => {
  console.log("Backend running on http://localhost:4000");
});