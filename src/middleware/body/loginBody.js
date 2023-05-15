const validateLoginBody = (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res
      .status(400)
      .json({ error: "Campos username y password no deben estar vacios." });
    return;
  }

  next();
};

export default validateLoginBody;
