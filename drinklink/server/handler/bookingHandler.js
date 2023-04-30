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

// Handler zum Abrufen der Buchungen eines Benutzers
async function getUserBookingsHandler(req, res) {
  const userId = req.session.userId;

  try {
    const userBookings = await prisma.booking.findMany({
      where: {
        userId: userId,
      },
      include: {
        bar: true,
      },
    });

    res.status(200).json(userBookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error, please try again." });
  }
}

// Handler zum Löschen einer Buchung
async function deleteBookingHandler(req, res) {
  const bookingId = parseInt(req.params.id, 10);
  const userId = req.session.userId;

  try {
    const deletedBooking = await prisma.booking.delete({
      where: {
        id: bookingId,
      },
      include: {
        user: true,
      },
    });

    if (deletedBooking.user.id !== userId) {
      res.status(403).json({ error: "You are not authorized to delete this booking." });
      return;
    }

    res.status(200).json(deletedBooking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error, please try again." });
  }
}



module.exports = {
  createBookingHandler,
  getUserBookingsHandler,
  deleteBookingHandler,
};
