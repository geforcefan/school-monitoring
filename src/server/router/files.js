import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

router.get("/:directoryName", (req, res) => {
    const directoryName = req.params.directoryName;

    const filesDirNode = fs.statSync("files").ino;
    const dirNamesParentNode = fs.statSync(path.join("files", directoryName, "..")).ino;

    if(filesDirNode === dirNamesParentNode) {
        try {
            const files = fs.readdirSync(path.join("files", directoryName)).map(file => path.join(directoryName, file));
            res.json(files);
        } catch(e) {
            res.status(404);
            res.json({ error: "Not found"});
        }
    } else {
        res.status(401);
        res.json({ error: "Permission denied"});
    }
});

export default router;