import { pool } from '../db/db.js'

export default class FlightModel {

    static getAll = async () => {
        const conn = await pool.getConnection()
        try {
            const [rows] = await conn.query(`SELECT
                BIN_TO_UUID(id) AS id,
                origin,
                destination,
                BIN_TO_UUID(airline_id) AS airline_id,
                departure_time,
                arrival_time,
                status,
                gate,
                capacity
            FROM flights`)
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
                origin,
                destination,
                BIN_TO_UUID(airline_id) AS airline_id,
                departure_time,
                arrival_time,
                status,
                gate,
                capacity
            FROM flights WHERE id = UUID_TO_BIN(?)`, [id])
            return rows[0] || null
        } catch (e) {
            throw e
        } finally {
            conn.release()
        }
    }

    static create = async (flight) => {
        const conn = await pool.getConnection()
        try {
            await conn.execute(
                `INSERT INTO flights (id, origin, destination, airline_id, departure_time, arrival_time, status, gate, capacity)
                VALUES (UUID_TO_BIN(?), ?, ?, UUID_TO_BIN(?), ?, ?, ?, ?, ?)`,
                [flight.id, flight.origin, flight.destination, flight.airline_id, new Date(flight.departure_time), new Date(flight.arrival_time), flight.status, flight.gate, flight.capacity]
            )
            return await FlightModel.getById(flight.id)
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
                key === 'airline_id' ? `${key} = UUID_TO_BIN(?)` : `${key} = ?`
            ).join(', ')
            const values = [...Object.entries(data).map(([key, value]) =>
                (key === 'departure_time' || key === 'arrival_time') ? new Date(value) : value
            ), id]

            await conn.execute(
                `UPDATE flights SET ${fields} WHERE id = UUID_TO_BIN(?)`,
                values
            )
            return await FlightModel.getById(id)
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
                'DELETE FROM flights WHERE id = UUID_TO_BIN(?)',
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
