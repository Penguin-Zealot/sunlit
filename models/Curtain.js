import mongoose from "mongoose";

//const { Boolean, String, Date } = mongoose.Schema.Types;

const CurtainScema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["Open", "Closed", "Pending", "Unknown"],
    default: "Unknown",
  },
  openTime: { type: Date, default: Date.now },
  closeTime: { type: Date, default: Date.now },
  openEnable: { type: Boolean, default: true },
  closeEnable: { type: Boolean, default: true },
});

export default mongoose.models.Curtain ||
  mongoose.model("Product", CurtainScema);
