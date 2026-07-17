import passengers from '../mock/passengers.json' with { type: 'json' }

export default class PassengerModel {

    static getAll = async () => {
        return passengers
    }

    static getById = async (id) => {
        return passengers.find(p => p.id === id) || null
    }

    static create = async (passenger) => {
        passengers.push(passenger)
        return passenger
    }

    static update = async ({ id, data }) => {
        const index = passengers.findIndex(p => p.id === id)
        if (index === -1) return null
        passengers[index] = { ...passengers[index], ...data }
        return passengers[index]
    }

    static delete = async (id) => {
        const index = passengers.findIndex(p => p.id === id)
        if (index === -1) return null
        const deleted = passengers[index]
        passengers.splice(index, 1)
        return deleted
    }
}
