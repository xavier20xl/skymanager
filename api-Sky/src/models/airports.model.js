import airports from '../mock/airports.json' with { type: 'json' }

export default class AirportModel {

    static getAll = async () => {
        return airports
    }

    static getById = async (id) => {
        return airports.find(a => a.id === id) || null
    }

    static create = async (airport) => {
        airports.push(airport)
        return airport
    }

    static update = async ({ id, data }) => {
        const index = airports.findIndex(a => a.id === id)
        if (index === -1) return null
        airports[index] = { ...airports[index], ...data }
        return airports[index]
    }

    static delete = async (id) => {
        const index = airports.findIndex(a => a.id === id)
        if (index === -1) return null
        const deleted = airports[index]
        airports.splice(index, 1)
        return deleted
    }
}
