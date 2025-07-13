const mongoose = require("mongoose");
const fileSchema = new mongoose.Schema(
  {
    originalName: String,
    filename: String,
    mimetype: String,
    size: Number,
    uploadedDate: {
      type: Date,
      default: Date.now,
    },
    fileType: String,
  },
  {
    collection: "file-metadatas",
  }
);
module.exports = mongoose.model("File", fileSchema);
