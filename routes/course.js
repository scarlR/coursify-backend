import express from "express";
import {
    fetchLectures,
    getAllCourses,
    singleCourse,
    fetchSingleLecture,
    getMyCourses,
    checkout,
    paymentVerify,
    
} from "../controllers/course.js";

import { isAuth } from '../middlewares/isAuth.js';

const router = express.Router();

router.get("/getAllCourses", getAllCourses);
router.get("/myCourse", isAuth, getMyCourses);
router.get("/:id", singleCourse);
router.get("/lectures/:id", isAuth, fetchLectures);
router.get("/single-lecture/:id", isAuth, fetchSingleLecture);
router.post("/checkout/:id", isAuth, checkout);
router.post("/verifyPayment", isAuth, paymentVerify);


export default router;
