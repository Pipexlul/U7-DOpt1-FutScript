const validateTeamId = (req, res, next) => {
  const { teamID } = req.params;

  const teamIDNum = parseInt(teamID);
  if (isNaN(teamIDNum) || teamIDNum < 1) {
    res
      .status(400)
      .json({ error: "Team ID debe ser un número entero mayor a 0" });
    return;
  }

  req.params.teamID = teamIDNum;
  next();
};

export default validateTeamId;
