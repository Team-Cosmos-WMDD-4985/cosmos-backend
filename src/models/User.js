import mongoose from "mongoose";

const { Schema } = mongoose;

const usersSchema = new Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", usersSchema);

export default User;
