import airlines from '../mock/airlines.json' with { type: 'json' }

export default class AirlineModel {

    static getAll = async () => {
        return airlines
    }

    static getById = async (id) => {
        return airlines.find(a => a.id === id) || null
    }

    static create = async (airline) => {
        airlines.push(airline)
        return airline
    }

    static update = async ({ id, data }) => {
        const index = airlines.findIndex(a => a.id === id)
        if (index === -1) return null
        airlines[index] = { ...airlines[index], ...data }
        return airlines[index]
    }

    static delete = async (id) => {
        const index = airlines.findIndex(a => a.id === id)
        if (index === -1) return null
        const deleted = airlines[index]
        airlines.splice(index, 1)
        return deleted
    }
}
