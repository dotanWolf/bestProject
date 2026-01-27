const Entry = require("../models/Entry");

class FileRepository {
  // Create a new file or folder
  async create(fileData) {
    try {
      const entry = new Entry(fileData);
      return await entry.save();
    } catch (error) {
      const e = new Error(`${error.message}`);
      e.statusCode = 400;
      throw e;
    }
  }

  // Find by MongoDB _id
  async findById(id) {
    return await Entry.findById(id).lean();
  }

  async findAll() {
    return await Entry.find({}).lean();
  }

  async findByOwnerId(ownerId) {
    return await Entry.find({ ownerId }).lean();
  }

  async findByParentId(parentId) {
    return await Entry.find({ parentId }).lean();
  }

  // Uses the index we created (ownerId + updatedAt) for speed
  async getRecentEntries(ownerId) {
    return await Entry.find({ ownerId, isTrashed: false })
      .lean()
      .sort({ updatedAt: -1 })
      .limit(10);
  }

  // Optimized lookup for folder navigation
  async findByOwnerAndParent(ownerId, parentId) {
    console.log(
      "root level files",
      await Entry.find({ ownerId, parentId }).lean(),
    );
    return await Entry.find({ ownerId, parentId }).lean();
  }

  // Search using MongoDB Regex (case-insensitive)
  async search(ownerId, query) {
    return await Entry.find({
      ownerId,
      $or: [
        { name: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
      ],
    });
  }

  // Update entry
  async update(id, updates) {
    try {
      // { new: true } returns the updated document
      // runValidators: false prevents "required field" errors during partial updates
      const updatedEntry = await Entry.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: false,
      });

      if (!updatedEntry) {
        const e = new Error("Entry not found");
        e.statusCode = 404;
        throw e;
      }

      return updatedEntry;
    } catch (error) {
      // Re-throwing with your custom pattern
      const e = new Error(`${error.message}`);
      e.statusCode = 400;
      throw e;
    }
  }

  // Basic Delete
  async delete(id) {
    return await Entry.findByIdAndDelete(id);
  }

  /**
   * Recursive Delete
   * Deletes a folder and all its contents
   */
  async deleteByParentId(parentId) {
    const children = await Entry.find({ parentId });

    for (const child of children) {
      if (child.type === "folder") {
        await this.deleteByParentId(child._id);
      }
      await Entry.findByIdAndDelete(child._id);
    }
  }

  async searchByName(query) {
    try {
      return await Entry.find({
        name: { $regex: query, $options: "i" },
        isTrashed: false, // Usually, you don't want trashed files in search results
      }).lean();
    } catch (error) {
      const e = new Error(`${error.message}`);
      e.statusCode = 500;
      throw e;
    }
  }
}

module.exports = new FileRepository();
