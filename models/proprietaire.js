const mongoose = require("mongoose");

const ProprietaireSchema = new mongoose.Schema(
  {
    statut: { type: String, enum: ["professionnel", "particulier"] },
    nomAgence: { type: String },
    numeroSiret: { type: String },
    photoProfil: { type: String, default: "no-photo.jpg" },
    genre: { type: String, enum: ["homme", "femme"] },
    nom: { type: String },
    prenom: { type: String },

    numAdresse: {
      type: Number,
      required: [true, "Please add a address number"],
    },
    adresse: {
      type: String,
      required: [true, "Please add a addess"],
    },
    numTelephone: {
      type: String,
      required: [true, "Please add a telephone number"],
    },
    mail: {
      type: String,
      required: [true, "Please add a email address"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { toJSON: { virtuals: true } }
);

//Cascade delete
ProprietaireSchema.pre("remove", async function (next) {
  console.log(`Annonces being removed from proprietaire ${this._id}`);
  await this.model("Annonce").deleteMany({ proprietaire: this._id });
  next();
});

//Reverse populate with virtual
ProprietaireSchema.virtual("annnonces", {
  ref: "Annonce",
  localField: "_id",
  foreignField: "proprietaire",
  justOne: false,
});

module.exports = mongoose.model("Proprietaire", ProprietaireSchema);
