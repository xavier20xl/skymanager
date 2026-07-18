import { jsonResponse } from '../helpers/json_response.js'
import AirportModel from '../models/airports.model.js'
import { validateAirport, validatePartialAirport } from '../schemas/airports.schema.js'
import { randomUUID } from 'node:crypto'

export const getAllAirports = async (req, res) => {
    try {
        const airports = await AirportModel.getAll()
        res.json(jsonResponse({ message: 'Listado de aeropuertos', data: airports }))
    } catch (e) {
        res.status(500).json(jsonResponse({ status: 500, message: e.message, data: null }))
    }
}

export const getAirportById = async (req, res) => {
    const { id } = req.params
    try {
        const airport = await AirportModel.getById(id)
        if (!airport) {
            return res.status(404).json(jsonResponse({ status: 404, message: 'Aeropuerto no encontrado' }))
        }
        res.json(jsonResponse({ message: 'Información del aeropuerto', data: airport }))
    } catch (e) {
        res.status(500).json(jsonResponse({ status: 500, message: e.message, data: null }))
    }
}

export const createAirport = async (req, res) => {
    const payload = req.body
    payload.id = randomUUID()

    const { success, data, error } = validateAirport(payload)

    if (!success) {
        return res.status(400).json(jsonResponse({
            status: 400,
            message: 'No pasó las validaciones',
            data: JSON.parse(error.message)
        }))
    }

    try {
        const newAirport = await AirportModel.create(data)
        return res.status(201).json(jsonResponse({ status: 201, message: 'Aeropuerto creado', data: newAirport }))
    } catch (e) {
        return res.status(500).json(jsonResponse({ status: 500, message: e.message }))
    }
}

export const updateAirport = async (req, res) => {
    const { id } = req.params
    const { success, data, error } = validatePartialAirport(req.body)

    if (!success) {
        return res.status(400).json(jsonResponse({
            status: 400,
            message: 'No pasó las validaciones',
            data: JSON.parse(error.message)
        }))
    }

    try {
        const exists = await AirportModel.getById(id)
        if (!exists) {
            return res.status(404).json(jsonResponse({ status: 404, message: 'El aeropuerto no existe' }))
        }
        const updated = await AirportModel.update({ id, data })
        return res.status(200).json(jsonResponse({ status: 200, message: 'Aeropuerto modificado', data: updated }))
    } catch (e) {
        return res.status(500).json(jsonResponse({ status: 500, message: e.message }))
    }
}

export const deleteAirport = async (req, res) => {
    const { id } = req.params
    try {
        const deleted = await AirportModel.delete(id)
        if (!deleted) {
            return res.status(404).json(jsonResponse({ status: 404, message: 'El aeropuerto no existe' }))
        }
        return res.status(200).json(jsonResponse({ status: 200, message: 'Aeropuerto eliminado', data: deleted }))
    } catch (e) {
        return res.status(500).json(jsonResponse({ status: 500, message: e.message }))
    }
}
