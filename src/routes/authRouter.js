import { postUsers, postSections } from "../controllers/authController.js";
import { Router } from "express";

const router = Router();

router.post("/users", postUsers);
router.post("/sections", postSections);

export default router;
