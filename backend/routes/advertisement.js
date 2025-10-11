import express from "express";
import mysql from "mysql2";
import multer from "multer";

const router = express.Router();

// Confi for multiple images
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// db connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "my_app_db", 
});

db.connect((err) => {
  if (err) throw err;
  console.log("MySQL connected");
});

// POST: advertisement
router.post("/", upload.array("images", 5), (req, res) => {
  const { title, description, address, bhk } = req.body;
  const images = req.files.map((file) => file.filename);

  const sql = "INSERT INTO advertisements (title, description, address, images, bhk) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [title, description, address, JSON.stringify(images), bhk], (err, result) => {
    if (err) return res.status(500).json({ message: "Failed to save advertisement", error: err });
    res.json({ message: "Advertisement saved", id: result.insertId });
  });
});

export default router;
