import { jsonResponse } from '../helpers/json_response.js'
import AirlineModel from '../models/airlines.model.js'
import { validateAirline, validatePartialAirline } from '../schemas/airlines.schema.js'
import { randomUUID } from 'node:crypto'

export const getAllAirlines = async (req, res) => {
    try {
        const airlines = await AirlineModel.getAll()
        res.json(jsonResponse({ message: 'Listado de aerolíneas', data: airlines }))
    } catch (e) {
        res.status(500).json(jsonResponse({ status: 500, message: e.message, data: null }))
    }
}

export const getAirlineById = async (req, res) => {
    const { id } = req.params
    try {
        const airline = await AirlineModel.getById(id)
        if (!airline) {
            return res.status(404).json(jsonResponse({ status: 404, message: 'Aerolínea no encontrada' }))
        }
        res.json(jsonResponse({ message: 'Información de la aerolínea', data: airline }))
    } catch (e) {
        res.status(500).json(jsonResponse({ status: 500, message: e.message, data: null }))
    }
}

export const createAirline = async (req, res) => {
    const payload = req.body
    payload.id = randomUUID()

    const { success, data, error } = validateAirline(payload)

    if (!success) {
        return res.status(400).json(jsonResponse({
            status: 400,
            message: 'No pasó las validaciones',
            data: JSON.parse(error.message)
        }))
    }

    try {
        const newAirline = await AirlineModel.create(data)
        return res.status(201).json(jsonResponse({ status: 201, message: 'Aerolínea creada', data: newAirline }))
    } catch (e) {
        return res.status(500).json(jsonResponse({ status: 500, message: e.message }))
    }
}

export const updateAirline = async (req, res) => {
    const { id } = req.params
    const { success, data, error } = validatePartialAirline(req.body)

    if (!success) {
        return res.status(400).json(jsonResponse({
            status: 400,
            message: 'No pasó las validaciones',
            data: JSON.parse(error.message)
        }))
    }

    try {
        const exists = await AirlineModel.getById(id)
        if (!exists) {
            return res.status(404).json(jsonResponse({ status: 404, message: 'La aerolínea no existe' }))
        }
        const updated = await AirlineModel.update({ id, data })
        return res.status(200).json(jsonResponse({ status: 200, message: 'Aerolínea modificada', data: updated }))
    } catch (e) {
        return res.status(500).json(jsonResponse({ status: 500, message: e.message }))
    }
}

export const deleteAirline = async (req, res) => {
    const { id } = req.params
    try {
        const deleted = await AirlineModel.delete(id)
        if (!deleted) {
            return res.status(404).json(jsonResponse({ status: 404, message: 'La aerolínea no existe' }))
        }
        return res.status(200).json(jsonResponse({ status: 200, message: 'Aerolínea eliminada', data: deleted }))
    } catch (e) {
        return res.status(500).json(jsonResponse({ status: 500, message: e.message }))
    }
}
