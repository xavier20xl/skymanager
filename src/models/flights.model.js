import flights from '../../src/mock/flights.json' with { type: 'json' }

export default class FlightModel {

    static getAll = async () => {
        return flights
    }

    static getById = async (id) => {
        return flights.find(f => f.id === id) || null
    }
}
