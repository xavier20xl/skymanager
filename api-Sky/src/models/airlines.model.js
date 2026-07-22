import { pool } from '../db/db.js'

export default class AirlineModel {

    static getAll = async () => {

        try {

            await using conn = await pool.getConnection();

            const [rows] = await conn.query(`SELECT
                BIN_TO_UUID(id) AS id,
                name,
                iata_code,
                country
            FROM airlines`)

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
                name,
                iata_code,
                country
            FROM airlines WHERE id = UUID_TO_BIN(:id)`, { id })

            return rows[0] || null
        } catch (e) {
            throw e
        }
    }

    static create = async (airline) => {

        await using conn = await pool.getConnection()

        try {

            await conn.execute(
                `INSERT INTO airlines (id, name, iata_code, country)
                VALUES (UUID_TO_BIN(?), ?, ?, ?)`,
                [airline.id, airline.name, airline.iata_code, airline.country]
            )

            return await AirlineModel.getById(airline.id)
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
                `UPDATE airlines SET ${fields} WHERE id = UUID_TO_BIN(?)`,
                values
            )

            return await AirlineModel.getById(id)
        } catch (e) {
            throw e
        }
    }

    static delete = async (id) => {

        await using conn = await pool.getConnection()

        try {

            const [result] = await conn.execute(
                'DELETE FROM airlines WHERE id = UUID_TO_BIN(?)',
                [id]
            )

            return result.affectedRows > 0
        } catch (e) {
            throw e
        }
    }
}
