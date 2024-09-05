import { instance } from "../index.js";
import { Course } from "../models/course.js";
import { Lecture } from "../models/lecture.js";
import { User } from "../models/user.js";

export const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({});
        res.status(200).json({
            courses,
        });
    } catch (error) {
        return res.status(400).json({
            message: "problem in getting all courses",
        });
    }
};

export const singleCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
       
        res.status(200).json({
            course,
        });
    } catch (error) {
        return res.status(400).json({
            message: "problem in getting single courses",
        });
    }
};
export const fetchLectures = async (req, res) => {
    try {
        const lectures = await Lecture.find({ course: req.params.id });

        const user = await User.findById(req.user._id);

        if (user.role === "admin") {
            return res.status(200).json({
                lectures,
            });
        }
       
       
        if (!user.subscription.includes(req.params.id)) {
            return res.status(403).json({
                message:"please subscribe to access all lectures",
            });
        }
        return res.status(201).json({
           lectures
        });
        
    } catch (error) {
        return res.status(200).json({
            message: "problem in getting fetch lectures",
        });
    }
};


export const fetchSingleLecture = async (req, res) => {
    try {
        const lecture = await Lecture.findById(req.params.id);

        const user = await User.findById(req.user._id);
        if (user.role === "admin") {
            return res.status(200).json({
                lecture,
            });
        }

        if (!user.subscription.includes(lecture.course)) {
            return res.status(403).json({
                message: "please subscribe to access all lectures",
            });
        }
        return res.status(201).json({
            lecture,
        });
    } catch (error) {
        return res.status(400).json({
            message: "problem in getting fetch  single lecture",
        });
    }
};    

export const getMyCourses = async (req, res) => {
    try {
        const courses = await Course.find({ _id: req.user.subscription });
        return res.status(200).json({courses})
    } catch (error) {
        return res.status(500).json({
             message:"problem in getting getMyCourses"
         })
    }
}

export const checkout = async (req, res) => {
    console.log("jii")
    try {
          
        const user = await User.findById(req.user._id);
        const course = await Course.findById(req.params.id);
       
        
        if (user.subscription.includes(course._id)) {
            return res.status(500).json({
             message:"You already have bought this Course"
         })
        }

      console.log(user,course)

        
        
  const session = await instance.checkout.sessions.create({ 
    payment_method_types: ["card"], 
    line_items: [ 
      { 
        price_data: { 
          currency: "INR", 
          product_data: { 
              name: course.title, 
              description: course.description, 
              images: [course.image],
          }, 
          unit_amount: course.price * 100, 
        }, 
        quantity: 1, 
      }, 
    ], 
    mode: "payment", 
    success_url:  `${process.env.FRONTEND_URL}/success/{CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    metadata: {
                userId: req.user._id.toString(),
                courseId: course._id.toString(),
            }
          });
        console.log(session)

       
        res.json({ id: session.id }); 
        
    } catch (error) {
        return res.status(500).json({
            message: "problem in checkout",
            error
            
         })
    }
}

export const paymentVerify = async (req, res) => {
    try {
        const { session_id } = req.body;
       
console.log("sesioniiD",session_id)
       
        const session = await instance.checkout.sessions.retrieve(session_id);
        console.log(session)

        
        if (session.payment_status === 'paid') {
            
            const userId = session.metadata.userId;
            const courseId = session.metadata.courseId;

            
            const user = await User.findById(userId);
            if (user) {
               
                if (!user.subscription.includes(courseId)) {
                    user.subscription.push(courseId);
                    await user.save();
                   
                }
            }
           

            res.status(200).json({
                message: 'Payment verified and subscription updated successfully',
            });
        } else {
            res.status(400).json({
                message: 'Payment failed or was not completed',
            });
        }
    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({
            message: "Problem verifying payment",
        });
    }
}