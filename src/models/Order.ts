import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    customer: {
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      pincode: String,
    },
    items: [
      {
        title: String,
        quantity: Number,
        price: Number,
        links: [String], // The custom links they added
        image: String
      }
    ],
    amount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['upi', 'cod'], required: true },
    isPaid: { type: Boolean, default: false },
    utr: { type: String }, // For UPI reference number
    status: { type: String, default: 'Pending' }, // Pending, Shipped, Delivered
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);