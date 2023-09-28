const mongoose = require("mongoose");

const suratSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Please fill name"],
    },
    email: {
      type: String,
      required: true,
    },
    nik: {
      type: String,
      required: true,
      default: 0,
    },
    alamat: {
      type: String,
      required: false,
    },
    jenisSurat: {
      type: String,
      required: true,
      default: "",
    },
    keperluan: {
      type: String,
      required: true,
      default: "",
    },
    statusSurat: {
      type: String,
      required: true,
      default: "",
    },
    approvalRt: {
      type: String,
      required: false,
      default: "",
    },
    approvalRw: {
      type: String,
      required: false,
      default: "",
    },
    approvalDesa: {
      type: String,
      required: false,
      default: "",
    },
  },
  { timestamps: true }
);

const Surat = mongoose.model("Surat", suratSchema);

module.exports = Surat;
