const mongoose = require("mongoose");

const connectionrequestschema = new mongoose.Schema(
  {
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["Interested", "NotInterested", "Accepted", "Rejected"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  {
    timestamps: true,
  }
);

connectionrequestschema.index({ fromUserId: 1, toUserId: 1 });

const Connectionrequestsmodule = new mongoose.model(
  "Connectionrequestsmodule",
  connectionrequestschema
);

module.exports = Connectionrequestsmodule;
