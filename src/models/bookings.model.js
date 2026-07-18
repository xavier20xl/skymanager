import bookings from '../mock/bookings.json' with { type: 'json' }
import passengers from '../mock/passengers.json' with { type: 'json' }
import flights from '../mock/flights.json' with { type: 'json' }

export default class BookingModel {

    static getAll = async () => {
        return bookings
    }

    static getById = async (id) => {
        return bookings.find(b => b.id === id) || null
    }

    static create = async (booking) => {
        // Simulacion de transaccion: todo o nada
        // 1. Verificar que el pasajero exista
        const passenger = passengers.find(p => p.id === booking.passenger_id)
        if (!passenger) {
            throw new Error('El pasajero no existe')
        }

        // 2. Verificar que el vuelo exista
        const flight = flights.find(f => f.id === booking.flight_id)
        if (!flight) {
            throw new Error('El vuelo no existe')
        }

        // 3. Verificar que el asiento no este ocupado en ese vuelo
        const seatTaken = bookings.find(b => b.flight_id === booking.flight_id && b.seat_number === booking.seat_number && b.status !== 'cancelled')
        if (seatTaken) {
            throw new Error('El asiento ya esta reservado en este vuelo')
        }

        // 4. Si todo pasa, se crea la reserva
        bookings.push(booking)
        return booking
    }

    static update = async ({ id, data }) => {
        const index = bookings.findIndex(b => b.id === id)
        if (index === -1) return null
        bookings[index] = { ...bookings[index], ...data }
        return bookings[index]
    }

    static delete = async (id) => {
        const index = bookings.findIndex(b => b.id === id)
        if (index === -1) return null
        const deleted = bookings[index]
        bookings.splice(index, 1)
        return deleted
    }
}
