import { stripe } from "../lib/stripe.js";
import Coupon from "../models/coupon.model.js";
import dotenv from "dotenv";
import Order from "../models/order.model.js";
dotenv.config();

export const createCheckoutSession = async (req, res, next) => {
    try {
        const { products, couponCode } = req.body;
        if (!Array.isArray(products) || products.length === 0) {
            res.status(400).json({ message: "Invalid products empty list provided" });
        }
        let totalAmount = 0;
        const lineItems = products.map((product) => {
            const amount = Math.round(product.price * 100); // converting to cents
            totalAmount += amount * product.quantity;
            return {
                price_data: {
                    currency: "usd",
                    unit_amount: amount,
                    product_data: {
                        name: product.name,
                        images: [product.image],
                    },
                },
                //  quantity: product.quantity
            };
        });
        // apply coupon code if provided
        let coupon = null;
        if (couponCode) {
            coupon = Coupon.findOne({
                code: couponCode,
                userId: req.user.id,
                isActive: true,
            });
            if (!coupon) {
                res.status(404).json({ message: "Invalid coupon code" });
            }
            totalAmount = Math.round(
                (totalAmount - totalAmount * coupon.discountPercentage) / 100
            );

            //   creat session
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                line_items: lineItems,
                mode: "payment",
                success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
                customer_email: req.user.email,
                discounts: coupon
                    ? [
                        {
                            coupon: await createStripeCoupon(coupon.discountPercentage),
                        },
                    ]
                    : [],
                metadata: {
                    couponCode: couponCode || "",
                    userId: req.user.id,
                    products: JSON.stringify(products?.map((p) => ({
                        id: p._id,
                        quantity: p.quantity,
                        price: p.price
                    }))),
                },
            });
        }
        if (totalAmount >= 20000) {
            await createNewCoupon(req.user.id);
        }
        res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 });
    } catch (error) { }
};

async function createStripeCoupon(discountPercentage) {
    const coupon = await stripe.coupons.create({
        percent_off: discountPercentage,
        duration: "once",
    });
    return coupon.id;
}
async function createNewCoupon(userId) {
    const coupon = new Coupon({
        code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
        discountPercentage: 10,
        userId,
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    });
    await coupon.save();
    return coupon;
}

export const checkoutSession = async (req, res, next) => {
    try {
        const { sessionId } = req.body;
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (session.payment_status === "paid") {
            // check if coupon code was applied
            if (session.metadata.couponCode) {
                await Coupon.findOneAndUpdate({ code: session.metadata.couponCode }, { isActive: false })
            }
            // create new order
            const products = JSON.parse(session.metadata.products);
            const newOrder = new Order({
                user: session.metadata.userId,
                products: products.map((p) => ({
                    product: p.id,
                    quantity: p.quantity,
                    price: p.price,
                })),
                totalAmount: session.amount_total / 100, // converting to dollars
                stripeSessionId: sessionId,
            });
            await newOrder.save();
            res.status(200).json({ success: true, orderId: newOrder._id, message: "Order placed successfully" });

        }
    } catch (error) {
        res.status(400).json({ message: "Error processing payment" });
    }
}