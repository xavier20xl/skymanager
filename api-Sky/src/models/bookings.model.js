import pool from '../db/db.js'

export default class BookingModel {

    static getAll = async () => {
        const conn = await pool.getConnection()
        try {
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
        } finally {
            conn.release()
        }
    }

    static getById = async (id) => {
        const conn = await pool.getConnection()
        try {
            const [rows] = await conn.execute(`SELECT
                BIN_TO_UUID(id) AS id,
                BIN_TO_UUID(passenger_id) AS passenger_id,
                BIN_TO_UUID(flight_id) AS flight_id,
                seat_number,
                booking_date,
                status
            FROM bookings WHERE id = UUID_TO_BIN(?)`, [id])
            return rows[0] || null
        } catch (e) {
            throw e
        } finally {
            conn.release()
        }
    }

    static create = async (booking) => {
        const conn = await pool.getConnection()
        try {
            // 1. Verificar que el pasajero exista
            const [passengerRows] = await conn.execute(
                'SELECT 1 FROM passengers WHERE id = UUID_TO_BIN(?)',
                [booking.passenger_id]
            )
            if (passengerRows.length === 0) {
                throw new Error('El pasajero no existe')
            }

            // 2. Verificar que el vuelo exista
            const [flightRows] = await conn.execute(
                'SELECT 1 FROM flights WHERE id = UUID_TO_BIN(?)',
                [booking.flight_id]
            )
            if (flightRows.length === 0) {
                throw new Error('El vuelo no existe')
            }

            // 3. Verificar que el asiento no este ocupado en ese vuelo
            const [seatRows] = await conn.execute(
                `SELECT 1 FROM bookings
                 WHERE flight_id = UUID_TO_BIN(?)
                   AND seat_number = ?
                   AND status <> 'cancelled'`,
                [booking.flight_id, booking.seat_number]
            )
            if (seatRows.length > 0) {
                throw new Error('El asiento ya esta reservado en este vuelo')
            }

            // 4. Si todo pasa, se crea la reserva
            await conn.execute(
                `INSERT INTO bookings (id, passenger_id, flight_id, seat_number, booking_date, status)
                 VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?), UUID_TO_BIN(?), ?, ?, ?)`,
                [booking.id, booking.passenger_id, booking.flight_id, booking.seat_number, new Date(booking.booking_date), booking.status]
            )
            return await BookingModel.getById(booking.id)
        } catch (e) {
            throw e
        } finally {
            conn.release()
        }
    }

    static update = async ({ id, data }) => {
        const conn = await pool.getConnection()
        try {
            const fields = Object.keys(data).map(key =>
                (key === 'passenger_id' || key === 'flight_id') ? `${key} = UUID_TO_BIN(?)` : `${key} = ?`
            ).join(', ')
            const values = [...Object.entries(data).map(([key, value]) =>
                (key === 'booking_date') ? new Date(value) : value
            ), id]

            await conn.execute(
                `UPDATE bookings SET ${fields} WHERE id = UUID_TO_BIN(?)`,
                values
            )
            return await BookingModel.getById(id)
        } catch (e) {
            throw e
        } finally {
            conn.release()
        }
    }

    static delete = async (id) => {
        const conn = await pool.getConnection()
        try {
            const [result] = await conn.execute(
                'DELETE FROM bookings WHERE id = UUID_TO_BIN(?)',
                [id]
            )
            return result.affectedRows > 0
        } catch (e) {
            throw e
        } finally {
            conn.release()
        }
    }
}
