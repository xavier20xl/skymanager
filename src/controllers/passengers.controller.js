import { jsonResponse } from '../helpers/json_response.js'
import PassengerModel from '../models/passengers.model.js'
import { validatePassenger, validatePartialPassenger } from '../schemas/passengers.schema.js'
import { randomUUID } from 'node:crypto'

export const getAllPassengers = async (req, res) => {
    try {
        const passengers = await PassengerModel.getAll()
        res.json(jsonResponse({ message: 'Listado de pasajeros', data: passengers }))
    } catch (e) {
        res.status(500).json(jsonResponse({ status: 500, message: e.message, data: null }))
    }
}

export const getPassengerById = async (req, res) => {
    const { id } = req.params
    try {
        const passenger = await PassengerModel.getById(id)
        if (!passenger) {
            return res.status(404).json(jsonResponse({ status: 404, message: 'Pasajero no encontrado' }))
        }
        res.json(jsonResponse({ message: 'Información del pasajero', data: passenger }))
    } catch (e) {
        res.status(500).json(jsonResponse({ status: 500, message: e.message, data: null }))
    }
}

export const createPassenger = async (req, res) => {
    const payload = req.body
    payload.id = randomUUID()

    const { success, data, error } = validatePassenger(payload)

    if (!success) {
        return res.status(400).json(jsonResponse({
            status: 400,
            message: 'No pasó las validaciones',
            data: JSON.parse(error.message)
        }))
    }

    try {
        const newPassenger = await PassengerModel.create(data)
        return res.status(201).json(jsonResponse({ status: 201, message: 'Pasajero creado', data: newPassenger }))
    } catch (e) {
        return res.status(500).json(jsonResponse({ status: 500, message: e.message }))
    }
}

export const updatePassenger = async (req, res) => {
    const { id } = req.params
    const { success, data, error } = validatePartialPassenger(req.body)

    if (!success) {
        return res.status(400).json(jsonResponse({
            status: 400,
            message: 'No pasó las validaciones',
            data: JSON.parse(error.message)
        }))
    }

    try {
        const exists = await PassengerModel.getById(id)
        if (!exists) {
            return res.status(404).json(jsonResponse({ status: 404, message: 'El pasajero no existe' }))
        }
        const updated = await PassengerModel.update({ id, data })
        return res.status(200).json(jsonResponse({ status: 200, message: 'Pasajero modificado', data: updated }))
    } catch (e) {
        return res.status(500).json(jsonResponse({ status: 500, message: e.message }))
    }
}

export const deletePassenger = async (req, res) => {
    const { id } = req.params
    try {
        const deleted = await PassengerModel.delete(id)
        if (!deleted) {
            return res.status(404).json(jsonResponse({ status: 404, message: 'El pasajero no existe' }))
        }
        return res.status(200).json(jsonResponse({ status: 200, message: 'Pasajero eliminado', data: deleted }))
    } catch (e) {
        return res.status(500).json(jsonResponse({ status: 500, message: e.message }))
    }
}
