import { Router } from "express";
import { postBalance, getBalance } from "../controllers/balanceController.js";

const router = Router();

router.post("/balance", postBalance);
router.get("/balance", getBalance);

export default router;
