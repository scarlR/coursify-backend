import express from "express"
import { isAuth } from "../middlewares/isAuth.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { addLecture, createCourse, deleteCourse, deleteLecture, getAllStats } from "../controllers/admin.js";
import {  uploadFiles } from "../middlewares/multer.js";

const router = express.Router();

router.post("/newCourse", isAuth, isAdmin, uploadFiles, createCourse);
router.post("/addLecture/:id", isAuth, isAdmin, uploadFiles, addLecture);
router.delete("/delete-lecture/:id", isAuth, deleteLecture);
router.delete("/delete-course/:id", isAuth, deleteCourse);
router.get("/stats", isAuth, isAdmin,getAllStats);
export default router;