import express from "express";
import cors from "cors";
import advertisementRoutes from "./routes/advertisement.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/advertisements", advertisementRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
