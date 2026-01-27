const mongoose = require("mongoose");

const entrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    type: {
      type: String,
      required: [true, "Type is required"],
      enum: {
        values: ["file", "folder"],
        message: "{VALUE} is not a valid type (must be file or folder)",
      },
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Links to your User model
      required: [true, "Owner ID is required"],
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Entry", // Self-referencing: points to another Entry (the folder)
      default: null, // null indicates it is at the root level
    },
    content: {
      type: String, // Storing base64 content or text
      default: null,
      // Custom validation: content is only required if type is 'file'
      validate: {
        validator: function (v) {
          return this.type === "folder" || (this.type === "file" && v !== null);
        },
        message: "Content is required for files",
      },
    },
    isTrashed: {
      type: Boolean,
      default: false,
    },
    isStarred: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Replaces your manual createdAt/updatedAt logic
  },
);

// Indexes for performance
// Helps when fetching all files in a specific folder or owned by a user
entrySchema.index({ ownerId: 1, parentId: 1 });

// Helper methods (replaces your class methods)
entrySchema.methods.isFile = function () {
  return this.type === "file";
};

entrySchema.methods.isFolder = function () {
  return this.type === "folder";
};

const Entry = mongoose.model("Entry", entrySchema);

module.exports = Entry;
