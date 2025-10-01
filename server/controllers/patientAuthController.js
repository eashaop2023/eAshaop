const jwt = require("jsonwebtoken");
const Patient = require("../models/patientModel");

const generateToken = (id) => {
  return jwt.sign({ id, role: "patient" }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

exports.registerPatient = async (req, res) => {
  try {
    const { name, email, password, age, gender, phone } = req.body;

    const exists = await Patient.findOne({ email });
    if (exists) return res.status(400).json({ message: "Patient already exists" });

    const patient = await Patient.create({ name, email, password, age, gender, phone });

    res.status(201).json({
      _id: patient._id,
      name: patient.name,
      email: patient.email,
      token: generateToken(patient._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.loginPatient = async (req, res) => {
  const { email, password } = req.body;
  const patient = await Patient.findOne({ email });

  if (patient && (await patient.matchPassword(password))) {
    const token = jwt.sign(
      { id: patient._id, role: "patient" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      _id: patient._id,
      name: patient.name,
      email: patient.email,
      token,   
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};
