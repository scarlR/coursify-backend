export const isAdmin = async (req, res, next) => {
 
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({
                message: "you are not admin",
            });
        }
        
        next();
    } catch (error) {
        return res.status(500).json({
            message: "problem in isAdmin",
        });
    }
};
