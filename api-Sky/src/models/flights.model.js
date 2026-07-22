import { pool } from '../db/db.js'

export default class FlightModel {

    static getAll = async () => {

        try {

            await using conn = await pool.getConnection();

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
        }
    }

    static getById = async (id) => {

        try {

            await using conn = await pool.getConnection();

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
            FROM flights WHERE id = UUID_TO_BIN(:id)`, { id })

            return rows[0] || null
        } catch (e) {
            throw e
        }
    }

    static create = async (flight) => {

        await using conn = await pool.getConnection()

        try {

            await conn.execute(
                `INSERT INTO flights (id, origin, destination, airline_id, departure_time, arrival_time, status, gate, capacity)
                VALUES (UUID_TO_BIN(?), ?, ?, UUID_TO_BIN(?), ?, ?, ?, ?, ?)`,
                [flight.id, flight.origin, flight.destination, flight.airline_id, new Date(flight.departure_time), new Date(flight.arrival_time), flight.status, flight.gate, flight.capacity]
            )

            return await FlightModel.getById(flight.id)
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
                if (key === 'airline_id') {
                    setClauses.push(`${key} = UUID_TO_BIN(?)`)
                    values.push(value)
                } else if (key === 'departure_time' || key === 'arrival_time') {
                    setClauses.push(`${key} = ?`)
                    values.push(new Date(value))
                } else {
                    setClauses.push(`${key} = ?`)
                    values.push(value)
                }
            }

            values.push(id)

            await conn.execute(
                `UPDATE flights SET ${setClauses.join(', ')} WHERE id = UUID_TO_BIN(?)`,
                values
            )

            return await FlightModel.getById(id)
        } catch (e) {
            throw e
        }
    }

    static delete = async (id) => {

        await using conn = await pool.getConnection()

        try {

            const [result] = await conn.execute(
                'DELETE FROM flights WHERE id = UUID_TO_BIN(?)',
                [id]
            )

            return result.affectedRows > 0
        } catch (e) {
            throw e
        }
    }
}
