import express from "express";
import cors from "cors";
import mysql from "mysql2";
import multer from "multer";
import path from "path";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ✅ Create uploads directory if not exists
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// ✅ Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "my_app_db",
});

db.connect((err) => {
  if (err) console.error("❌ Database connection failed:", err);
  else console.log("✅ Connected to MySQL database");
});

// ✅ Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ✅ Helper function to get user info
const getUser = (user_id) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM users WHERE user_id = ?", [user_id], (err, results) => {
      if (err) reject(err);
      else resolve(results[0]);
    });
  });
};

// ✅ POST Advertisement (1 only for free users)
app.post("/api/advertisements", upload.array("images", 5), async (req, res) => {
  const { title, address, bhk, description, user_id } = req.body;
  const images = req.files ? req.files.map((file) => file.path) : [];

  if (!user_id) return res.status(400).json({ success: false, error: "Missing user_id" });

  try {
    const user = await getUser(user_id);

    // 🔹 Create user record if not found
    if (!user) {
      await db
        .promise()
        .query("INSERT INTO users (user_id, is_premium) VALUES (?, ?)", [user_id, 0]);
    }

    // 🔹 Check ad count for this user
    const [ads] = await db.promise().query("SELECT COUNT(*) AS count FROM advertisements WHERE user_id = ?", [user_id]);
    const adCount = ads[0].count;

    // 🔹 Fetch user again after creation
    const [userCheck] = await db.promise().query("SELECT is_premium FROM users WHERE user_id = ?", [user_id]);
    const isPremium = userCheck[0]?.is_premium;

    if (!isPremium && adCount >= 1) {
      return res.status(403).json({
        success: false,
        error: "You can only post one advertisement. Upgrade to premium for more!",
      });
    }

    // ✅ Insert ad
    const sql = "INSERT INTO advertisements (title, address, bhk, description, images, user_id) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sql, [title, address, bhk, description, JSON.stringify(images), user_id], (err, result) => {
      if (err) {
        console.error("Error inserting ad:", err);
        return res.status(500).json({ success: false, error: "Failed to insert ad" });
      }
      res.json({ success: true, id: result.insertId });
    });
  } catch (err) {
    console.error("Error posting ad:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// ✅ GET All Ads
app.get("/api/advertisements", (req, res) => {
  db.query("SELECT * FROM advertisements ORDER BY id DESC", (err, results) => {
    if (err) {
      console.error("Error fetching ads:", err);
      return res.status(500).json({ success: false, error: "Failed to fetch ads" });
    }
    res.json(results);
  });
});

// ✅ DELETE Ad by ID
app.delete("/api/advertisements/:id", (req, res) => {
  const { id } = req.params;

  db.query("SELECT images FROM advertisements WHERE id = ?", [id], (err, results) => {
    if (err || results.length === 0) {
      console.error("Error finding ad:", err);
      return res.status(404).json({ success: false, error: "Ad not found" });
    }

    const images = JSON.parse(results[0].images || "[]");
    images.forEach((imgPath) => {
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    });

    db.query("DELETE FROM advertisements WHERE id = ?", [id], (err2) => {
      if (err2) {
        console.error("Error deleting ad:", err2);
        return res.status(500).json({ success: false, error: "Failed to delete ad" });
      }
      res.json({ success: true });
    });
  });
});

// ✅ Upgrade user to premium
app.post("/api/upgrade", (req, res) => {
  const { user_id } = req.body;
  if (!user_id) return res.status(400).json({ success: false, error: "Missing user_id" });

  db.query("UPDATE users SET is_premium = 1 WHERE user_id = ?", [user_id], (err, result) => {
    if (err) {
      console.error("Error upgrading user:", err);
      return res.status(500).json({ success: false, error: "Failed to upgrade user" });
    }
    res.json({ success: true, message: "User upgraded to premium" });
  });
});

app.listen(5000, () => console.log("🚀 Server running on port 5000"));
