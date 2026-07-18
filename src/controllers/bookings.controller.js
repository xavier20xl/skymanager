import { jsonResponse } from '../helpers/json_response.js'
import BookingModel from '../models/bookings.model.js'
import { validateBooking, validatePartialBooking } from '../schemas/bookings.schema.js'
import { randomUUID } from 'node:crypto'

export const getAllBookings = async (req, res) => {
    try {
        const bookings = await BookingModel.getAll()
        res.json(jsonResponse({ message: 'Listado de reservas', data: bookings }))
    } catch (e) {
        res.status(500).json(jsonResponse({ status: 500, message: e.message, data: null }))
    }
}

export const getBookingById = async (req, res) => {
    const { id } = req.params
    try {
        const booking = await BookingModel.getById(id)
        if (!booking) {
            return res.status(404).json(jsonResponse({ status: 404, message: 'Reserva no encontrada' }))
        }
        res.json(jsonResponse({ message: 'Información de la reserva', data: booking }))
    } catch (e) {
        res.status(500).json(jsonResponse({ status: 500, message: e.message, data: null }))
    }
}

export const createBooking = async (req, res) => {
    const payload = req.body
    payload.id = randomUUID()

    const { success, data, error } = validateBooking(payload)

    if (!success) {
        return res.status(400).json(jsonResponse({
            status: 400,
            message: 'No pasó las validaciones',
            data: JSON.parse(error.message)
        }))
    }

    try {
        const newBooking = await BookingModel.create(data)
        return res.status(201).json(jsonResponse({ status: 201, message: 'Reserva creada', data: newBooking }))
    } catch (e) {
        return res.status(400).json(jsonResponse({ status: 400, message: e.message }))
    }
}

export const updateBooking = async (req, res) => {
    const { id } = req.params
    const { success, data, error } = validatePartialBooking(req.body)

    if (!success) {
        return res.status(400).json(jsonResponse({
            status: 400,
            message: 'No pasó las validaciones',
            data: JSON.parse(error.message)
        }))
    }

    try {
        const exists = await BookingModel.getById(id)
        if (!exists) {
            return res.status(404).json(jsonResponse({ status: 404, message: 'La reserva no existe' }))
        }
        const updated = await BookingModel.update({ id, data })
        return res.status(200).json(jsonResponse({ status: 200, message: 'Reserva modificada', data: updated }))
    } catch (e) {
        return res.status(500).json(jsonResponse({ status: 500, message: e.message }))
    }
}

export const deleteBooking = async (req, res) => {
    const { id } = req.params
    try {
        const deleted = await BookingModel.delete(id)
        if (!deleted) {
            return res.status(404).json(jsonResponse({ status: 404, message: 'La reserva no existe' }))
        }
        return res.status(200).json(jsonResponse({ status: 200, message: 'Reserva eliminada', data: deleted }))
    } catch (e) {
        return res.status(500).json(jsonResponse({ status: 500, message: e.message }))
    }
}
