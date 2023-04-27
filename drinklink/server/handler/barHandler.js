const { StatusCodes } = require("http-status-codes");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Handler zum Erstellen einer neuen Bar
async function createBarHandler(req, res) {
  const { name, address, description } = req.body;
  const userId = req.session.userId;

  // Erstelle eine neue Bar und weise sie dem Benutzer als Besitzer zu
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

// Handler zur Aktualisierung einer Bar
async function updateBarHandler(req, res) {
  const { id } = req.params;
  const { name, address, description } = req.body;
  const userId = req.session.userId;

  // Suche die Bar in der Datenbank und überprüfe, ob der Benutzer der Besitzer ist
  const bar = await prisma.bar.findUnique({ where: { id: Number(id) } });

  if (!bar || bar.ownerId !== userId) {
    return res.status(StatusCodes.NOT_FOUND).json({ error: "Bar not found" });
  }

  // Aktualisiere die Bar und gebe die aktualisierte Bar zurück
  const updatedBar = await prisma.bar.update({
    where: { id: Number(id) },
    data: { name, address, description },
  });

  res.status(StatusCodes.OK).json(updatedBar);
}

// Handler zur Abfrage einer Bar
async function getBarHandler(req, res) {
  const userId = req.session.userId;

  // Suche den Benutzer in der Datenbank und gib die von ihm besessene Bar zurück
  const userWithBar = await prisma.users.findUnique({
    where: { id: userId },
    include: { ownedBar: true },
  });

  if (!userWithBar || !userWithBar.ownedBar) {
    return res.status(StatusCodes.NOT_FOUND).json({ error: "Bar not found" });
  }

  res.status(StatusCodes.OK).json(userWithBar.ownedBar);
}

// Handler zum Löschen einer Bar
async function deleteBarHandler(req, res) {
  const { id } = req.params;
  const userId = req.session.userId;

  // Suche die Bar in der Datenbank und überprüfe, ob der Benutzer der Besitzer ist
  const bar = await prisma.bar.findUnique({ where: { id: Number(id) } });

  if (!bar || bar.ownerId !== userId) {
    return res.status(StatusCodes.NOT_FOUND).json({ error: "Bar not found" });
  }

  // Lösche die Bar aus der Datenbank und setze isBarOwner auf false für den Benutzer
  await prisma.bar.delete({ where: { id: Number(id) } });
  await prisma.users.update({
    where: { id: userId },
    data: { isBarOwner: false },
  });

  res.status(StatusCodes.NO_CONTENT).json({ message: "Bar deleted" });
}

async function getAllBarsHandler(req, res) {
  const bars = await prisma.bar.findMany({
    include: {
      owner: true,
    },
  });

  res.status(StatusCodes.OK).json(bars);
}

async function getSingleBarHandler(req, res) {
  const { id } = req.params;

  // Suche die Bar in der Datenbank
  const bar = await prisma.bar.findUnique({
    where: { id: Number(id) },
    include: { owner: true },
  });

  if (!bar) {
    return res.status(StatusCodes.NOT_FOUND).json({ error: "Bar not found" });
  }

  res.status(StatusCodes.OK).json(bar);
}

module.exports = {
  createBarHandler,
  updateBarHandler,
  getBarHandler,
  deleteBarHandler,
  getAllBarsHandler,
  getSingleBarHandler,
};
