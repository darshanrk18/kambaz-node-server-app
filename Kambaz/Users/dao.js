import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export default function UsersDao(db) {
  const createUser = async (user) => {
    const newUser = { ...user, _id: uuidv4() };
    return await model.create(newUser);
  };

  const findAllUsers = () => model.find();

  const findUserById = (userId) => model.findById(userId);

  const findUserByUsername = (username) =>
    model.findOne({ username: username });

  const findUserByCredentials = async (username, password) => {
    try {
      const user = await model.findOne({ username, password });
      return user;
    } catch (error) {
      console.error("findUserByCredentials error:", error);
      throw error;
    }
  };

  const findUsersByRole = (role) => model.find({ role: role });

  const findUsersByPartialName = (partialName) => {
    const regex = new RegExp(partialName, "i"); // 'i' makes it case-insensitive
    return model.find({
      $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }],
    });
  };

  const updateUser = (userId, user) =>
    model.updateOne({ _id: userId }, { $set: user });

  const deleteUser = (userId) => model.findByIdAndDelete(userId);

  return {
    createUser,
    findAllUsers,
    findUserById,
    findUserByUsername,
    findUserByCredentials,
    findUsersByRole,
    findUsersByPartialName,
    updateUser,
    deleteUser,
  };
}
