const { StatusCodes } = require("http-status-codes");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Handler zum Erstellen einer neuen Buchung
async function createBookingHandler(req, res) {
  const { date, time, people, barId } = req.body;
  const userId = req.session.userId;

  // Kombinieren Sie das Datum und die Uhrzeit in einer einzigen DateTime-Variable
  const dateTime = new Date(`${date}T${time}`);

  try {
    const newBooking = await prisma.booking.create({
      data: {
        dateTime, // Verwenden Sie die kombinierte dateTime-Variable
        people: parseInt(people, 10),
        user: {
          connect: {
            id: userId,
          },
        },
        bar: {
          connect: {
            id: parseInt(barId, 10),
          },
        },
      },
    });

    res.status(201).json(newBooking);
  } catch (error) {
    console.error(error);
    let errorMessage = "Server error, please try again.";
    if (error instanceof Prisma.PrismaClientValidationError) {
      errorMessage = "Invalid booking data. Please check the input fields.";
    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
      errorMessage = "Booking conflict. Please choose a different time.";
    }
    res.status(500).json({ error: errorMessage });
  }
}

module.exports = {
  createBookingHandler,
};
