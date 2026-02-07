import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    // Ensure your backend API generates this, or make it not required if you want Mongo ID
    orderId: { type: String }, 
    
    customer: {
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
      
      // --- FIX: Replace 'address' with these 3 fields ---
      houseNo: String,
      area: String,
      landmark: String,
      // -------------------------------------------------
      
      city: String,
      state: String,
      pincode: String,
    },
    
    items: [
      {
        productId: String, // Good to have the ID reference
        title: String,
        quantity: Number,
        price: Number,
        links: [String],
        image: String
      }
    ],
    
    amount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['upi', 'cod'], required: true },
    isPaid: { type: Boolean, default: false },
    
    // --- UPDATED FOR RAZORPAY ---
    paymentId: { type: String },       // Stores razopay_payment_id
    razorpayOrderId: { type: String }, // Stores razorpay_order_id
    // ----------------------------
    
    status: { type: String, default: 'Pending' }, 
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);