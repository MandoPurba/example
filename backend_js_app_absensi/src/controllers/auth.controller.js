import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from "../../models/user.model.js";
import dotenv from 'dotenv';
import Department from "../../models/department.model.js";
import UserProfile from "../../models/user_profile.model.js";
export const loginController = async (req, res) => {
  try {
    const {
      username,
      password
    } = req.body;

    // Validate request
    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required",
      });
    }

    // Find user
    const user = await User.findOne({
      where: {
        username
      },
      include: [ {
        model: UserProfile,
        as: "user_profile",
        attributes: ["id"],
        include: [{
          model: Department,
          as: "department",
          attributes: ["id", "name"],
        }]
      } ],
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    // Check JWT secret
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    // Generate token
    const token = jwt.sign({
        id: user.id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET, {
        expiresIn: "1d",
      }
    );
    console.log("user:", user.toJSON());
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        department_id: user.user_profile?.department?.id || null,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};