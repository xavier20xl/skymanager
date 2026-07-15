import { jsonResponse } from '../helpers/json_response.js'
import FlightModel from '../models/flights.model.js'

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
