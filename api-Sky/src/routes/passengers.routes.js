import { Router } from 'express'
import { getAllPassengers, getPassengerById, createPassenger, updatePassenger, deletePassenger } from '../controllers/passengers.controller.js'
import { isAuth } from '../middlewares/isAuth.js'

const passengersRouter = Router()

passengersRouter.get('/', getAllPassengers)
passengersRouter.get('/:id', getPassengerById)
passengersRouter.post('/', isAuth, createPassenger)
passengersRouter.put('/:id', isAuth, updatePassenger)
passengersRouter.delete('/:id', isAuth, deletePassenger)

export default passengersRouter
