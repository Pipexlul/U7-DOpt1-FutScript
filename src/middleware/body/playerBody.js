const validatePlayerBody = (req, res, next) => {
  const { name, position } = req.body;

  let validProps = true;
  if (!name) {
    validProps = false;
  }

  const positionNum = parseInt(position);
  if (isNaN(positionNum) || positionNum < 1) {
    validProps = false;
  }

  if (!validProps) {
    res
      .status(400)
      .json({ error: "Campos name y position no deben estar vacios." });
    return;
  }

  req.body.position = positionNum;
  next();
};

export default validatePlayerBody;
