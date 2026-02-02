import { Router } from "express";
import { User } from "../models/User.js";

export const usersRouter = Router();

usersRouter.get("/", async (_req, res) => {
  const users = await User.find().sort({ createdAt: -1 }).lean();
  res.json(users);
});

usersRouter.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).lean();
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.json(user);
});

usersRouter.post("/", async (req, res) => {
  try {
    const user = await User.create(req.body);
    return res.status(201).json(user);
  } catch (error: unknown) {
    return res.status(400).json({ message: "Unable to create user", error });
  }
});

usersRouter.put("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(user);
  } catch (error: unknown) {
    return res.status(400).json({ message: "Unable to update user", error });
  }
});

usersRouter.delete("/:id", async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id).lean();
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.status(204).send();
});
