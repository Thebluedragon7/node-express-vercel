// Import packages
const express = require("express");
const home = require("./routes/home");
const bcrypt = require("bcrypt");

const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors"); // Import CORS middleware
const app = express();
const User = require("./models/userModel");
const Surat = require("./models/suratModel");

app.use(express.json()); // Middleware
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors()); // Use CORS middleware

// MongoDB Connection String with your database name
const mongoURI =
  "mongodb+srv://dtpl2022fc:dtpl2022fc@cluster0.hmopt9a.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(9000, () => {
      console.log("Node API is running on port 9000");
    });
    console.log("Connected to MongoDB");
  })
  .catch((e) => {
    console.log(e);
  });

// Routes

app.get("/allUser", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/register", async (req, res) => {
  const { fullName, email, password, confirmPassword } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Password tidak cocok" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "Registrasi berhasil" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/updateUser/:userId/:newRole", async (req, res) => {
  const userId = req.params.userId;
  const newRole = req.params.newRole;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }

    user.role = newRole;

    await user.save();

    res.status(200).json({ message: "Peran pengguna berhasil diperbarui" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/requestSurat", async (req, res) => {
  const { fullName, email, nik, alamat, jenisSurat, keperluan, statusSurat } =
    req.body;

  try {
    const existingSurat = await Surat.findOne({
      email,
      jenisSurat,
      statusSurat: { $nin: ["Done", "Decline"] },
    });

    if (existingSurat) {
      return res.status(400).json({
        message: "Anda sedang mengajukan permintaan surat yang sama!",
      });
    }

    const newSurat = new Surat({
      fullName,
      email,
      nik,
      alamat,
      jenisSurat,
      keperluan,
      statusSurat,
    });

    await newSurat.save();

    res.status(201).json({ message: "Permintaan surat berhasil dibuat" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/listSurat/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const suratData = await Surat.find({ email });

    res.status(200).json(suratData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/suratByStatus/:statusSurat", async (req, res) => {
  const { statusSurat } = req.params;

  try {
    const suratList = await Surat.find({ statusSurat });

    if (!suratList || suratList.length === 0) {
      return res
        .status(404)
        .json({ message: "Surat dengan status tersebut tidak ditemukan." });
    }

    res.status(200).json(suratList);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/approveSurat/:role", async (req, res) => {
  const { suratId, approvalName } = req.body;
  const { role } = req.params;

  try {
    const surat = await Surat.findById(suratId);

    if (!surat) {
      return res.status(404).json({ message: "Surat tidak ditemukan" });
    }

    if (role === "kepalaRT") {
      surat.approvalRt = approvalName;
      surat.statusSurat = "kepalaRW";
    }
    if (role === "kepalaRW") {
      surat.approvalRw = approvalName;
      surat.statusSurat = "kepalaDesa";
    }
    if (role === "kepalaDesa") {
      surat.approvalDesa = approvalName;
      surat.statusSurat = "Done";
    }

    await surat.save();

    res.status(200).json({
      message:
        "Surat disetujui dan approval diisi sesuai dengan peran yang melakukan persetujuan",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/declineSurat", async (req, res) => {
  const { id, role, approvalName } = req.body;

  try {
    const surat = await Surat.findById(id);

    if (!surat) {
      return res.status(404).json({ message: "Surat tidak ditemukan" });
    }

    if (role === "kepalaRT") {
      surat.approvalRt = approvalName;
      surat.statusSurat = "Decline";
    }
    if (role === "kepalaRW") {
      surat.approvalRw = approvalName;
      surat.statusSurat = "Decline";
    }
    if (role === "kepalaDesa") {
      surat.approvalDesa = approvalName;
      surat.statusSurat = "Decline";
    }

    await surat.save();

    res.status(200).json({
      message:
        "Surat ditolak dan approval diisi sesuai dengan peran yang melakukan penolakan",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
