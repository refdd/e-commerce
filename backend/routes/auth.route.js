import express from "express";
import { login, logout, signup } from "../controllers/auth.controller.js";
const routes = express.Router();

routes.get("/signup", signup);
routes.get("/login", login);
routes.get("/logout", logout);
export default routes;
