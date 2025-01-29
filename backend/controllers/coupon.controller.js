import Coupon from "../models/coupon.model.js"

export const getCoupon = async (req, res, next) => {
    try {
        const coupon = await Coupon.findOne({ userId: req.user._id, isActive: true })
        res.json(coupon || null)
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
}