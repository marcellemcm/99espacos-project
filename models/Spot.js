const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SpotSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      required: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    format: {
      type: String,
      required: true,
      enum: [
        "Auditório",
        "Formato U",
        "Livre",
        "Sala de Aula",
        "Sala de Reunião",
        "Mesa Redonda",
        "CoWorking"
      ]
    },
    capacity: {
      type: Number,
      required: true,
      min: 4
    },
    equipments: {
      type: String,
      default: "Não Disponível"
    },
    conveniences: {
      type: String,
      default: "Não Disponível"
    },
    address: {
      type: String,
      required: true
    },
    location: { type: { type: String }, coordinates: [Number] },
    businessHours: {
      type: String,
      required: true
    },
    picture: {
      type: String
    }
  },
  {
    timestamps: true
  }
);
const Spot = mongoose.model("Spot", SpotSchema);
module.exports = Spot;
