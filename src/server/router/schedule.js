import express from 'express';
import db from '../utlis/db';

const router = express.Router();

router.get("/data", (req, res) => {
    res.json(db.get("substitutionSchedule"));
});

export default router;