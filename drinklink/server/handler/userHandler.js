const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Handler zum Aktualisieren von Benutzerdaten
async function updateUserHandler(req, res) {
    const userId = req.session.userId;
    const { username, newPassword, oldPassword } = req.body;
  
    const user = await prisma.users.findUnique({ where: { id: userId } });
  
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
    }
  
    if (oldPassword) {
      const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isOldPasswordValid) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ error: "Old password is incorrect" });
      }
  
      const saltRounds = 10;
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
      await prisma.users.update({
        where: { id: userId },
        data: { password: hashedNewPassword },
      });
    }
  
    if (username) {
      await prisma.users.update({
        where: { id: userId },
        data: { username: username },
      });
    }
  
    res
      .status(StatusCodes.OK)
      .json({ message: "User data updated successfully" });
  }

// Handler zum Abrufen des aktuellen Benutzers
async function getCurrentUserHandler(req, res) {
    const userId = req.session.userId;
  
    if (!userId) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "User not logged in" });
    }
  
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: { id: true, username: true },
    });
  
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
    }
  
    res.status(StatusCodes.OK).json(user);
  }

module.exports = {
  updateUserHandler,
  getCurrentUserHandler,
};