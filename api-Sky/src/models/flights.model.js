import flights from '../mock/flights.json' with { type: 'json' }

export default class FlightModel {

    static getAll = async () => {
        return flights
    }

    static getById = async (id) => {
        return flights.find(f => f.id === id) || null
    }

    static create = async (flight) => {
        flights.push(flight)
        return flight
    }

    static update = async ({ id, data }) => {
        const flightIndex = flights.findIndex(f => f.id === id)

        if (flightIndex === -1) return null

        flights[flightIndex] = { ...flights[flightIndex], ...data }
        return flights[flightIndex]
    }

    static delete = async (id) => {
        const flightIndex = flights.findIndex(f => f.id === id)

        if (flightIndex === -1) return null

        const deleted = flights[flightIndex]
        flights.splice(flightIndex, 1)
        return deleted
    }
}
