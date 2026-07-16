import { jsonResponse } from '../helpers/json_response.js'
import FlightModel from '../models/flights.model.js'
import { validateFlight, validatePartialFlight } from '../schemas/flights.schema.js'
import { randomUUID } from 'node:crypto'

export const getAllFlights = async (req, res) => {

    try {
        const flights = await FlightModel.getAll()

        res.json(jsonResponse({ message: 'Listado de vuelos', data: flights }))
    } catch (e) {
        res.status(500).json(jsonResponse({ status: 500, message: e.message, data: null }))
    }
}

export const getFlightById = async (req, res) => {

    const { id } = req.params

    try {
        const flight = await FlightModel.getById(id)

        if (!flight) {
            return res.status(404).json(jsonResponse({
                status: 404,
                message: 'Vuelo no encontrado'
            }))
        }

        res.json(jsonResponse({ message: 'Información del vuelo', data: flight }))
    } catch (e) {
        res.status(500).json(jsonResponse({ status: 500, message: e.message, data: null }))
    }
}

export const createFlight = async (req, res) => {

    const payload = req.body

    payload.id = randomUUID()

    const { success, data, error } = validateFlight(payload)

    if (!success) {
        return res.status(400).json(jsonResponse({
            status: 400,
            message: 'No pasó las validaciones',
            data: JSON.parse(error.message)
        }))
    }

    try {
        const newFlight = await FlightModel.create(data)

        return res.status(201).json(jsonResponse({
            status: 201,
            message: 'Vuelo creado',
            data: newFlight
        }))
    } catch (e) {
        return res.status(500).json(jsonResponse({
            status: 500,
            message: e.message
        }))
    }
}

export const updateFlight = async (req, res) => {

    const { id } = req.params
    const payload = req.body

    const { success, data, error } = validatePartialFlight(payload)

    if (!success) {
        return res.status(400).json(jsonResponse({
            status: 400,
            message: 'No pasó las validaciones',
            data: JSON.parse(error.message)
        }))
    }

    try {
        const exists = await FlightModel.getById(id)

        if (!exists) {
            return res.status(404).json(jsonResponse({
                status: 404,
                message: 'El vuelo no existe'
            }))
        }

        const updatedFlight = await FlightModel.update({ id, data })

        return res.status(200).json(jsonResponse({
            status: 200,
            message: 'Vuelo modificado',
            data: updatedFlight
        }))
    } catch (e) {
        return res.status(500).json(jsonResponse({
            status: 500,
            message: e.message
        }))
    }
}

export const deleteFlight = async (req, res) => {

    const { id } = req.params

    try {
        const deleted = await FlightModel.delete(id)

        if (!deleted) {
            return res.status(404).json(jsonResponse({
                status: 404,
                message: 'El vuelo no existe'
            }))
        }

        return res.status(200).json(jsonResponse({
            status: 200,
            message: 'Vuelo eliminado',
            data: deleted
        }))
    } catch (e) {
        return res.status(500).json(jsonResponse({
            status: 500,
            message: e.message
        }))
    }
}
