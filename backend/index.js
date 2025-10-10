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

// ✅ Ensure uploads folder exists
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
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

/* =====================================================
 ✅ POST an Advertisement
===================================================== */
app.post("/api/advertisements", upload.array("images", 5), async (req, res) => {
  const { title, houseNo, area, district, bhk, description, user_id, phone } =
    req.body;
  const images = req.files ? req.files.map((f) => f.path) : [];

  if (!user_id)
    return res.status(400).json({ success: false, error: "Missing user_id" });

  try {
    const [rows] = await db
      .promise()
      .query("SELECT ads_left, is_unlimited FROM users WHERE user_id = ?", [
        user_id,
      ]);
    let user = rows[0];

    if (!user) {
      await db
        .promise()
        .query(
          "INSERT INTO users (user_id, ads_left, is_unlimited) VALUES (?, ?, ?)",
          [user_id, 1, 0]
        );
      user = { ads_left: 1, is_unlimited: 0 };
    }

    if (!user.is_unlimited && user.ads_left <= 0) {
      return res
        .status(403)
        .json({ success: false, error: "No ads left. Please buy credits." });
    }

    await db
      .promise()
      .query(
        `INSERT INTO advertisements 
        (title, houseNo, area, district, bhk, description, phone, images, user_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          title,
          houseNo,
          area,
          district,
          bhk,
          description,
          phone,
          JSON.stringify(images),
          user_id,
        ]
      );

    if (!user.is_unlimited) {
      await db
        .promise()
        .query("UPDATE users SET ads_left = ads_left - 1 WHERE user_id = ?", [
          user_id,
        ]);
    }

    res.json({ success: true, message: "Ad posted successfully!" });
  } catch (err) {
    console.error("Error posting ad:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

/* =====================================================
 ✅ GET / DELETE Ads
===================================================== */
app.get("/api/advertisements", (req, res) => {
  db.query("SELECT * FROM advertisements ORDER BY id DESC", (err, results) => {
    if (err)
      return res
        .status(500)
        .json({ success: false, error: "Failed to fetch advertisements" });
    res.json(results);
  });
});

app.delete("/api/advertisements/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db
      .promise()
      .query("SELECT images FROM advertisements WHERE id = ?", [id]);
    const ad = rows[0];
    if (!ad) return res.status(404).json({ success: false, error: "Not found" });

    const imagePaths = JSON.parse(ad.images || "[]");
    imagePaths.forEach((imgPath) => {
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    });

    await db.promise().query("DELETE FROM advertisements WHERE id = ?", [id]);
    res.json({ success: true, message: "Ad deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting ad:", err);
    res.status(500).json({ success: false, error: "Delete failed" });
  }
});

/* =====================================================
 ✅ BUY Ad Credits
===================================================== */
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
    await db
      .promise()
      .query("INSERT IGNORE INTO users (user_id, ads_left, is_unlimited) VALUES (?, 0, 0)", [
        user_id,
      ]);

    if (isUnlimited) {
      await db
        .promise()
        .query("UPDATE users SET is_unlimited = 1 WHERE user_id = ?", [user_id]);
    } else {
      await db
        .promise()
        .query("UPDATE users SET ads_left = ads_left + ? WHERE user_id = ?", [
          adsToAdd,
          user_id,
        ]);
    }

    res.json({ success: true, message: "Purchase successful!" });
  } catch (err) {
    console.error("Payment error:", err);
    res.status(500).json({ success: false, error: "Purchase failed" });
  }
});

/* =====================================================
 ✅ SHIFTING ORDERS
===================================================== */

// ➕ Add a new shifting order
app.post("/api/shifting-orders", (req, res) => {
  const {
    name,
    phone,
    from_location,
    from_floor,
    to_location,
    to_floor,
    shift_type,
    date,
    message,
  } = req.body;

  if (!name || !phone || !from_location || !to_location || !shift_type) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  const sql = `INSERT INTO shifting_orders 
    (name, phone, from_location, from_floor, to_location, to_floor, shift_type, date, message, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')`;

  db.query(
    sql,
    [name, phone, from_location, from_floor, to_location, to_floor, shift_type, date, message],
    (err, result) => {
      if (err) {
        console.error("❌ Error inserting order:", err);
        return res.status(500).json({ success: false, message: "Server error" });
      }
      res.json({ success: true, message: "✅ Shifting order submitted!" });
    }
  );
});

// 📥 Get all orders
app.get("/api/shifting-orders", (req, res) => {
  db.query("SELECT * FROM shifting_orders ORDER BY id DESC", (err, results) => {
    if (err) {
      console.error("❌ Error fetching orders:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
    res.json(results);
  });
});

// ❌ Delete order
app.delete("/api/shifting-orders/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM shifting_orders WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("❌ Error deleting order:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
    res.json({ success: true });
  });
});

// ✅ Mark as completed
app.put("/api/shifting-orders/:id/complete", (req, res) => {
  const { id } = req.params;
  const sql = "UPDATE shifting_orders SET status = 'Completed' WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("❌ Error updating order status:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
    res.json({ success: true, message: "Order marked as completed" });
  });
});

/* =====================================================
 ✅ START SERVER
===================================================== */
app.listen(5000, () => console.log("✅ Server running on port 5000"));
