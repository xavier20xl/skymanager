import { pool } from '../db/db.js'

export default class AirportModel {

    static getAll = async () => {

        try {

            await using conn = await pool.getConnection();

            const [rows] = await conn.query(`SELECT
                BIN_TO_UUID(id) AS id,
                iata_code,
                name,
                city,
                country
            FROM airports`)

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
                iata_code,
                name,
                city,
                country
            FROM airports WHERE id = UUID_TO_BIN(:id)`, { id })

            return rows[0] || null
        } catch (e) {
            throw e
        }
    }

    static create = async (airport) => {

        await using conn = await pool.getConnection()

        try {

            await conn.execute(
                `INSERT INTO airports (id, iata_code, name, city, country)
                VALUES (UUID_TO_BIN(?), ?, ?, ?, ?)`,
                [airport.id, airport.iata_code, airport.name, airport.city, airport.country]
            )

            return await AirportModel.getById(airport.id)
        } catch (e) {
            throw e
        }
    }

    static update = async ({ id, data }) => {

        await using conn = await pool.getConnection()

        try {

            const fields = Object.keys(data).map(key => `${key} = ?`).join(', ')
            const values = [...Object.values(data)]
            values.push(id)

            await conn.execute(
                `UPDATE airports SET ${fields} WHERE id = UUID_TO_BIN(?)`,
                values
            )

            return await AirportModel.getById(id)
        } catch (e) {
            throw e
        }
    }

    static delete = async (id) => {

        await using conn = await pool.getConnection()

        try {

            const [result] = await conn.execute(
                'DELETE FROM airports WHERE id = UUID_TO_BIN(?)',
                [id]
            )

            return result.affectedRows > 0
        } catch (e) {
            throw e
        }
    }
}
