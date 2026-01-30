// auth.middleware.js

// export const verifyUser = (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader) {
//       return res.status(401).json({
//         success: false,
//         error: "No autorizado: falta header Authorization",
//       });
//     }

//     const [type, token] = authHeader.split(" ");

//     if (type !== "Bearer" || !token) {
//       return res.status(401).json({
//         success: false,
//         error: "Formato de Authorization inválido",
//       });
//     }

//     // 🧠 MVP: el token ES el user_id
//     req.user = {
//       id: token,
//     };

//     next();
//   } catch (err) {
//     console.error("AUTH_MIDDLEWARE_ERROR", err);
//     return res.status(500).json({
//       success: false,
//       error: "Error interno de autenticación",
//     });
//   }
// };

export const verifyUser = (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth) {
    return res.status(401).json({
      success: false,
      error: "No autorizado: falta header Authorization",
    });
  }

  const token = auth.replace("Bearer ", "").trim();

  // MVP: el token ES el user_id
  req.user = {
    id: token,
  };

  next();
}