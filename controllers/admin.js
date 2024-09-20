import { Course } from "../models/course.js";
import { Lecture } from "../models/lecture.js";
import { rm } from "fs";
import { promisify } from "util";
import fs from "fs";
import path from "path"; 
import { fileURLToPath } from 'url';
import { User } from "../models/user.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


export const createCourse = async (req, res) => {
    try {
        const { title, description, price, duration, category, createdBy } = req.body;
        const image = req.file;
       

        if (!title || !description || !price || !duration || !category || !createdBy) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!image) {
            return res.status(400).json({ message: "Image file is required" });
        }

    const uploadResult = await uploadOnCloudinary(image.path);

        if (!uploadResult) {
            return res.status(500).json({ message: "Failed to upload image" });
        }


        const newCourse = await Course.create({
            title,
            description,
            price,
            duration,
            category,
            createdBy,
            image: uploadResult.secure_url,
        });

        res.status(201).json({
            message: "Course created successfully",
            course: newCourse,
        });
    } catch (error) {
        console.error("Error in creating course:", error);
        return res.status(500).json({
            message: "Problem in creating course",
            error: error.message,
        });
    }
};

export const addLecture = async (req, res) => {
    try {
       

        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(400).json({
                message: " course not found",
            });
        }
        const { title, description } = req.body;
        const video = req.file;
        const uploadResult = await uploadOnCloudinary(video.path);

        const newLecture = await Lecture.create({
            title,
            description,
            video: uploadResult.secure_url,
            course: course._id,
        });
        res.status(201).json({
            message: "lecture added successfully",
            lecture: newLecture,
        });
    } catch (error) {
        return res.status(400).json({
            message: "lecture added failed",
            error: error.message,
        });
    }
};

export const deleteLecture = async (req, res) => {
    try {
        const lecture = await Lecture.findById(req.params.id);
        if (!lecture) {
            return res.status(400).json({
                message: " lecture not found",
            });
        }
        rm(lecture.video, () => {
            console.log("Video deleted");
        });
        await lecture.deleteOne();
        res.status(201).json({
            message: "lecture deleted successfully",
        });
    } catch (error) {
        return res.status(400).json({
            message: "lecture deletion failed",
            error: error.message,
        });
    }
};


const unlinkAsync = promisify(fs.unlink);

export const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(400).json({
                message: "course not found",
            });
        }
        const lectures = await Lecture.find({ course: course._id });

        await Promise.all(
            lectures.map(async (lecture) => {
                await unlinkAsync(lecture.video);
                console.log("video deleted");
            })
        );

        rm(course.image, () => {
            console.log("image deleted");
        });

        await Lecture.find({ course: req.params.id }).deleteMany();

        await course.deleteOne();

        await User.updateMany({}, { $pull: { subscription: req.params.id } });

        res.json({
            message: "Course Deleted",
        });
    } catch (error) {
        return res.status(400).json({
            message: "course deletion failed",
            error: error.message,
        });
    }
};


export const getAllStats = async (req, res) => {
    try {
        const totalCourses = (await Course.find()).length;
        const totalLectures = (await Lecture.find()).length;
        const totalUsers = (await User.find()).length;

        const stats = {
            totalCourses,
            totalLectures,
            totalUsers
        } 

        return res.status(200).json({
            stats,
            success:true
        })


    } catch (error) {
        return res.status(500).json({
            message:"problem in getting stats",
            success:false
        })
    }
}