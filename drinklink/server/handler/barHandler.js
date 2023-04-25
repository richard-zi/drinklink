const { StatusCodes } = require("http-status-codes");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function createBarHandler(req, res) {
  const { name, address, description } = req.body;
  const userId = req.session.userId;

  const newBar = await prisma.bar.create({
    data: {
      name,
      address,
      description,
      owner: { connect: { id: userId } },
    },
  });

  res.status(StatusCodes.CREATED).json(newBar);
}

async function updateBarHandler(req, res) {
  const { id } = req.params;
  const { name, address, description } = req.body;
  const userId = req.session.userId;

  const bar = await prisma.bar.findUnique({ where: { id: Number(id) } });

  if (!bar || bar.ownerId !== userId) {
    return res.status(StatusCodes.NOT_FOUND).json({ error: "Bar not found" });
  }

  const updatedBar = await prisma.bar.update({
    where: { id: Number(id) },
    data: { name, address, description },
  });

  res.status(StatusCodes.OK).json(updatedBar);
}

async function getBarHandler(req, res) {
  const userId = req.session.userId;

  const bar = await prisma.bar.findFirst({ where: { ownerId: userId } });

  if (!bar) {
    return res.status(StatusCodes.NOT_FOUND).json({ error: "Bar not found" });
  }

  res.status(StatusCodes.OK).json(bar);
}

async function deleteBarHandler(req, res) {
  const { id } = req.params;
  const userId = req.session.userId;

  const bar = await prisma.bar.findUnique({ where: { id: Number(id) } });

  if (!bar || bar.ownerId !== userId) {
    return res.status(StatusCodes.NOT_FOUND).json({ error: "Bar not found" });
  }

  await prisma.bar.delete({ where: { id: Number(id) } });

  res.status(StatusCodes.NO_CONTENT).json({ message: "Bar deleted" });
}

module.exports = {
  createBarHandler,
  updateBarHandler,
  getBarHandler,
  deleteBarHandler,
};
