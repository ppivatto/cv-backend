import { Router } from "express";
import fs from "fs";
import path from "path";

const router = Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const usersPath = path.join(process.cwd(), "src/data/users.json");
  const users = JSON.parse(fs.readFileSync(usersPath, "utf-8"));

  const user = users.find(
    u => u.email === email && u.password === password
  );

  if (!user) {
    return res
      .status(401)
      .json({ success: false, error: "Credenciales inválidas" });
  }

  // MVP token = userId (simple)
  return res.json({
    success: true,
    token: user.id,
    user: { id: user.id, email: user.email }
  });
});

export default router;
