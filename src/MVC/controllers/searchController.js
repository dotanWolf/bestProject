const FileService = require('../services/FileService');
const Client = require('../client');
const FileRepository = require('../repositeries/FileRepositery');

const searchFiles = async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(400).json({ error: "user id required" });
        }

        const query = req.params.query;

        // 1. Parallelize the DB search and the TCP search
        const [entriesWithMatchingName, tcpResult] = await Promise.all([
            FileRepository.searchByName(query),
            Client.searchFiles(query)
        ]);

        if (!tcpResult.success) {
            return res.status(500).json({ error: "couldnt search files in the cpp server" });
        }

        // 2. Fetch TCP entries correctly (Promise.all + map)
        const tcpEntries = await Promise.all(
            tcpResult.listOfIds.map(id => FileRepository.findById(id))
        );

        // Filter out nulls and verify content
        const entriesWithMatchingContent = tcpEntries.filter(
            entry => entry && entry.content && entry.content.includes(query)
        );

        // 3. Merge results and remove duplicates using a Map
        const resultMap = new Map();
        [...entriesWithMatchingName, ...entriesWithMatchingContent].forEach(file => {
            if (file && file._id) {
                resultMap.set(file._id.toString(), file);
            }
        });

        const mergedResults = Array.from(resultMap.values());

        // 4. Async Permission Filter (The Async Filter Pattern)
        const accessResults = await Promise.all(
            mergedResults.map(file => FileService.hasReadAccess(file, userId))
        );

        const userCanSee = mergedResults.filter((_, index) => accessResults[index]);

        return res.status(200).json(userCanSee);

    } catch (error) {
        console.error("Search Error:", error);
        return res.status(500).json({ error: "Internal server error during search" });
    }
};

module.exports = { searchFiles };