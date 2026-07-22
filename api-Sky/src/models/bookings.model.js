import { pool } from '../db/db.js'

export default class BookingModel {

    static getAll = async () => {

        try {

            await using conn = await pool.getConnection();

            const [rows] = await conn.query(`SELECT
                BIN_TO_UUID(id) AS id,
                BIN_TO_UUID(passenger_id) AS passenger_id,
                BIN_TO_UUID(flight_id) AS flight_id,
                seat_number,
                booking_date,
                status
            FROM bookings`)

            return rows
        } catch (e) {
            throw e
        }
    }

    static getById = async (id) => {

        try {

            await using conn = await pool.getConnection();

            const [rows] = await conn.execute(`SELECT
                BIN_TO_UUID(id) AS id,
                BIN_TO_UUID(passenger_id) AS passenger_id,
                BIN_TO_UUID(flight_id) AS flight_id,
                seat_number,
                booking_date,
                status
            FROM bookings WHERE id = UUID_TO_BIN(:id)`, { id })

            return rows[0] || null
        } catch (e) {
            throw e
        }
    }

    static create = async (booking) => {

        await using conn = await pool.getConnection()

        try {

            const [passengerRows] = await conn.execute(
                'SELECT 1 FROM passengers WHERE id = UUID_TO_BIN(:id)',
                { id: booking.passenger_id }
            )
            if (passengerRows.length === 0) {
                throw new Error('El pasajero no existe')
            }

            const [flightRows] = await conn.execute(
                'SELECT 1 FROM flights WHERE id = UUID_TO_BIN(:id)',
                { id: booking.flight_id }
            )
            if (flightRows.length === 0) {
                throw new Error('El vuelo no existe')
            }

            const [seatRows] = await conn.execute(
                `SELECT 1 FROM bookings
                 WHERE flight_id = UUID_TO_BIN(:flight_id)
                   AND seat_number = :seat_number
                   AND status <> 'cancelled'`,
                { flight_id: booking.flight_id, seat_number: booking.seat_number }
            )
            if (seatRows.length > 0) {
                throw new Error('El asiento ya esta reservado en este vuelo')
            }

            await conn.execute(
                `INSERT INTO bookings (id, passenger_id, flight_id, seat_number, booking_date, status)
                 VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?), UUID_TO_BIN(?), ?, ?, ?)`,
                [booking.id, booking.passenger_id, booking.flight_id, booking.seat_number, new Date(booking.booking_date), booking.status]
            )

            return await BookingModel.getById(booking.id)
        } catch (e) {
            throw e
        }
    }

    static update = async ({ id, data }) => {

        await using conn = await pool.getConnection()

        try {

            const setClauses = []
            const values = []

            for (const [key, value] of Object.entries(data)) {
                if (key === 'passenger_id' || key === 'flight_id') {
                    setClauses.push(`${key} = UUID_TO_BIN(?)`)
                    values.push(value)
                } else if (key === 'booking_date') {
                    setClauses.push(`${key} = ?`)
                    values.push(new Date(value))
                } else {
                    setClauses.push(`${key} = ?`)
                    values.push(value)
                }
            }

            values.push(id)

            await conn.execute(
                `UPDATE bookings SET ${setClauses.join(', ')} WHERE id = UUID_TO_BIN(?)`,
                values
            )

            return await BookingModel.getById(id)
        } catch (e) {
            throw e
        }
    }

    static delete = async (id) => {

        await using conn = await pool.getConnection()

        try {

            const [result] = await conn.execute(
                'DELETE FROM bookings WHERE id = UUID_TO_BIN(?)',
                [id]
            )

            return result.affectedRows > 0
        } catch (e) {
            throw e
        }
    }
}
