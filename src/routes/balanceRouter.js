import { Router } from "express";
import { postEntryBalance } from "../controllers/balanceController.js";

const router = Router();

router.post("/balance", postEntryBalance);

export default router;
