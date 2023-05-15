const validateTeamBody = (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    res.status(400).json({ error: "Campo name no deben estar vacio." });
    return;
  }

  next();
};

export default validateTeamBody;
