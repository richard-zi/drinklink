import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import BookingList from "./BookingList";

const server = setupServer(
  rest.get('/api/user', (req, res, ctx) => {
    return res(ctx.json({ id: '1' }));
  }),
  rest.get('/api/bookings', (req, res, ctx) => {
    return res(ctx.json([{ id: '1', bar: { name: "Bar 1" }, dateTime: new Date(), people: 2 }]));
  }),
  rest.delete('/api/bookings/:id', (req, res, ctx) => {
    return res(ctx.status(200));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("should render list of bookings", async () => {
  render(<BookingList />);
  
  expect(screen.getByText('Loading...')).toBeInTheDocument();
  
  await waitFor(() => screen.getByText('Your Bookings'));

  expect(screen.getByText('Bar 1')).toBeInTheDocument();
  expect(screen.getByText(/Date: /)).toBeInTheDocument();
  expect(screen.getByText(/People: /)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Cancel/ })).toBeInTheDocument();
});

test("should handle booking cancellation", async () => {
  render(<BookingList />);
  
  await waitFor(() => screen.getByText('Your Bookings'));

  fireEvent.click(screen.getByRole('button', { name: /Cancel/ }));

  await waitFor(() => expect(screen.queryByText('Bar 1')).not.toBeInTheDocument());
});
