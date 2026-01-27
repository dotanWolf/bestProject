const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema({
  fileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Entry", // Reference to your Entry/File model
    required: [true, "File ID is required"],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to your User model
    required: [true, "User ID is required"],
  },
  email: {
    type: String,
    required: [true, "User email is required"],
    trim: true,
  },
  role: {
    type: String,
    required: [true, "Role is required"],
    enum: {
      values: ["viewer", "editor", "owner", "none"],
      message: "{VALUE} is not a valid role",
    },
  },
  isStarred: { type: Boolean, default: false },
});

// Compound Index: One permission record per user, per file
// This prevents having two different roles for the same user on one file
permissionSchema.index({ fileId: 1, userId: 1 }, { unique: true });

// Logic Helpers (Replaces your class methods)
permissionSchema.methods.canRead = function () {
  return ["viewer", "editor", "owner"].includes(this.role);
};

permissionSchema.methods.canEdit = function () {
  return ["editor", "owner"].includes(this.role);
};

permissionSchema.methods.isOwner = function () {
  return this.role === "owner";
};

const Permission = mongoose.model("Permission", permissionSchema);

module.exports = Permission;
