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

// ✅ Create uploads folder if missing
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// ✅ MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "my_app_db",
});

db.connect((err) => {
  if (err) console.error("❌ Database connection failed:", err);
  else console.log("✅ Connected to MySQL");
});

// ✅ Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

/* ----------------------------------------
 ✅ POST an Advertisement
---------------------------------------- */
app.post("/api/advertisements", upload.array("images", 5), async (req, res) => {
  const { title, address, bhk, description, user_id } = req.body;
  const images = req.files ? req.files.map((f) => f.path) : [];

  if (!user_id) return res.status(400).json({ success: false, error: "Missing user_id" });

  try {
    // Get or create user
    const [rows] = await db
      .promise()
      .query("SELECT ads_left, is_unlimited FROM users WHERE user_id = ?", [user_id]);
    let user = rows[0];

    if (!user) {
      await db
        .promise()
        .query("INSERT INTO users (user_id, ads_left, is_unlimited) VALUES (?, ?, ?)", [
          user_id,
          1,
          0,
        ]);
      user = { ads_left: 1, is_unlimited: 0 };
    }

    // Check limit
    if (!user.is_unlimited && user.ads_left <= 0) {
      return res.status(403).json({ success: false, error: "No ads left. Please buy ad credits." });
    }

    // Insert ad
    await db
      .promise()
      .query(
        "INSERT INTO advertisements (title, address, bhk, description, images, user_id) VALUES (?, ?, ?, ?, ?, ?)",
        [title, address, bhk, description, JSON.stringify(images), user_id]
      );

    // Deduct credit
    if (!user.is_unlimited) {
      await db.promise().query("UPDATE users SET ads_left = ads_left - 1 WHERE user_id = ?", [
        user_id,
      ]);
    }

    res.json({ success: true, message: "Ad posted successfully!" });
  } catch (err) {
    console.error("Error posting ad:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

/* ----------------------------------------
 ✅ GET All Advertisements
---------------------------------------- */
app.get("/api/advertisements", (req, res) => {
  db.query("SELECT * FROM advertisements ORDER BY id DESC", (err, results) => {
    if (err)
      return res.status(500).json({ success: false, error: "Failed to fetch advertisements" });
    res.json(results);
  });
});

/* ----------------------------------------
 ✅ DELETE Advertisement
---------------------------------------- */
app.delete("/api/advertisements/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // First get the images for deletion
    const [rows] = await db.promise().query("SELECT images FROM advertisements WHERE id = ?", [id]);
    const ad = rows[0];
    if (!ad) return res.status(404).json({ success: false, error: "Ad not found" });

    // Delete images from disk
    const imagePaths = JSON.parse(ad.images || "[]");
    imagePaths.forEach((imgPath) => {
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    });

    // Delete the ad from DB
    await db.promise().query("DELETE FROM advertisements WHERE id = ?", [id]);

    res.json({ success: true, message: "Ad deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting ad:", err);
    res.status(500).json({ success: false, error: "Failed to delete advertisement" });
  }
});

/* ----------------------------------------
 ✅ BUY Ad Credits
---------------------------------------- */
app.post("/api/buy-ads", async (req, res) => {
  const { user_id, packType, method } = req.body;
  if (!user_id || !packType || !method)
    return res.status(400).json({ success: false, error: "Missing data" });

  let adsToAdd = 0;
  let isUnlimited = 0;

  switch (packType) {
    case "5_ads":
      adsToAdd = 5;
      break;
    case "10_ads":
      adsToAdd = 10;
      break;
    case "yearly":
      isUnlimited = 1;
      break;
    default:
      return res.status(400).json({ success: false, error: "Invalid pack" });
  }

  try {
    // Ensure user exists
    await db
      .promise()
      .query("INSERT IGNORE INTO users (user_id, ads_left, is_unlimited) VALUES (?, 0, 0)", [
        user_id,
      ]);

    if (isUnlimited) {
      await db.promise().query("UPDATE users SET is_unlimited = 1 WHERE user_id = ?", [user_id]);
    } else {
      await db.promise().query(
        "UPDATE users SET ads_left = ads_left + ? WHERE user_id = ?",
        [adsToAdd, user_id]
      );
    }

    res.json({ success: true, message: "Purchase successful!" });
  } catch (err) {
    console.error("Payment error:", err);
    res.status(500).json({ success: false, error: "Purchase failed" });
  }
});

/* ----------------------------------------
 ✅ START SERVER
---------------------------------------- */
app.listen(5000, () => console.log("🚀 Server running on port 5000"));
