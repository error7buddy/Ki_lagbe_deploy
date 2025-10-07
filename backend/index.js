import express from "express";
import cors from "cors";
import mysql from "mysql2";
import multer from "multer";
import path from "path";


import fs from "fs";

// Create uploads folder if it doesn't exist
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("✅ Created uploads folder");
}
const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ✅ Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // change if different
  password: "", // change if you set password
  database: "my_app_db",
});

// ✅ File upload setup (multer)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ✅ POST advertisement (with images)
app.post("/api/advertisements", upload.array("images", 5), (req, res) => {
  const { title, address, bhk, description } = req.body;
  const images = req.files ? req.files.map((file) => file.path) : [];

  const sql =
    "INSERT INTO advertisements (title, address, bhk, description, images) VALUES (?, ?, ?, ?, ?)";
  db.query(
    sql,
    [title, address, bhk, description, JSON.stringify(images)],
    (err, result) => {
      if (err) {
        console.error("Error inserting advertisement:", err);
        return res.status(500).json({ error: "Failed to insert ad" });
      }
      res.json({ success: true, id: result.insertId });
    }
  );
});

// ✅ GET advertisements
app.get("/api/advertisements", (req, res) => {
  db.query("SELECT * FROM advertisements ORDER BY id DESC", (err, results) => {
    if (err) {
      console.error("Error fetching ads:", err);
      return res.status(500).json({ error: "Failed to fetch ads" });
    }
    res.json(results);
  });
});

app.listen(5000, () => console.log("✅ Server running on port 5000"));
// ✅ DELETE advertisement by ID
app.delete("/api/advertisements/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM advertisements WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Error deleting ad:", err);
      return res.status(500).json({ success: false, error: "Failed to delete" });
    }
    res.json({ success: true });
  });
});