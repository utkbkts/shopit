import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      maxLength: [50, "Your Name contact exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      minLength: [6, "Your password must be longer than  6 characters"],
      select: false,
    },
    avatar: {
      public_id: String,
      url: String,
    },
    role: {
      type: String,
      default: "user",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);
//userSchema.pre("save", ...) kullanıcı şemasında save işleminden önce bir middleware tanımlar.
userSchema.pre("save", async function (next) {
  //Fonksiyon içinde, eğer şifre (password) alanı değiştirilmemişse (isModified("password") ile kontrol edilir), işlemi devam ettirir (next() ile).
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

//jwt token
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });
};

//compare user password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//generate password reset token
userSchema.methods.getResetPasswordToken = function () {
  //generate token
  const resetToken = crypto.randomBytes(20).toString("hex");
  //20 byte uzunluğunda rastgele bir dize oluşturur ve bunu onaltılık (hexadecimal) formata dönüştürür. Bu, sıfırlama tokeninin benzersiz olmasını sağlar.
  //hash and set to resetpassword token field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  // oluşturulan sıfırlama tokenini SHA-256 algoritması kullanarak bir hash'e dönüştürür. Bu, tokenin daha güvenli bir şekilde saklanmasını sağlar.
  //set token expire time
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
  return resetToken;
};

export default mongoose.model("User", userSchema);
