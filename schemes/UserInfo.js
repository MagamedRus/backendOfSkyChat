import mongoose from "mongoose";

const UserInfo = new mongoose.Schema({
  name: { type: String, required: true },
  secondName: { type: String, required: true },
  birthday: { type: String, required: true },
  gender: { type: String, required: true },
  dateReg: { type: String, required: true },
  password: { type: String, required: true },
  picture: { type: String },
});

export default UserInfo;
