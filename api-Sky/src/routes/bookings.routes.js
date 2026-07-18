import { Router } from 'express'
import { getAllBookings, getBookingById, createBooking, updateBooking, deleteBooking } from '../controllers/bookings.controller.js'
import { isAuth } from '../middlewares/isAuth.js'

const bookingsRouter = Router()

bookingsRouter.get('/', getAllBookings)
bookingsRouter.get('/:id', getBookingById)
bookingsRouter.post('/', isAuth, createBooking)
bookingsRouter.put('/:id', isAuth, updateBooking)
bookingsRouter.delete('/:id', isAuth, deleteBooking)

export default bookingsRouter
