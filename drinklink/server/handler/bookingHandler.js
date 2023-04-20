const { StatusCodes } = require("http-status-codes");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Handler zum Erstellen einer neuen Buchung
async function createBookingHandler(req, res) {
    const { date, people } = req.body;
    const userId = req.session.userId; // Extrahieren Sie die Benutzer-ID aus dem authentifizierten Benutzer
  
    try {
      const newBooking = await prisma.booking.create({
        data: {
          date: new Date(date),
          time: new Date(date),
          people: parseInt(people, 10),
          userId: userId, // Verwenden Sie die Benutzer-ID in der Buchungserstellung
        },
      });
  
      res.status(201).json(newBooking);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error, please try again." });
    }
  }

module.exports = {
  createBookingHandler,
};
