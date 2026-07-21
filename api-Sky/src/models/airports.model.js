import { pool } from '../db/db.js'

export default class AirportModel {

    static getAll = async () => {
        const conn = await pool.getConnection()
        try {
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
        } finally {
            conn.release()
        }
    }

    static getById = async (id) => {
        const conn = await pool.getConnection()
        try {
            const [rows] = await conn.execute(`SELECT
                BIN_TO_UUID(id) AS id,
                iata_code,
                name,
                city,
                country
            FROM airports WHERE id = UUID_TO_BIN(?)`, [id])
            return rows[0] || null
        } catch (e) {
            throw e
        } finally {
            conn.release()
        }
    }

    static create = async (airport) => {
        const conn = await pool.getConnection()
        try {
            await conn.execute(
                `INSERT INTO airports (id, iata_code, name, city, country)
                VALUES (UUID_TO_BIN(?), ?, ?, ?, ?)`,
                [airport.id, airport.iata_code, airport.name, airport.city, airport.country]
            )
            return await AirportModel.getById(airport.id)
        } catch (e) {
            throw e
        } finally {
            conn.release()
        }
    }

    static update = async ({ id, data }) => {
        const conn = await pool.getConnection()
        try {
            const fields = Object.keys(data).map(key => `${key} = ?`).join(', ')
            const values = [...Object.values(data), id]

            await conn.execute(
                `UPDATE airports SET ${fields} WHERE id = UUID_TO_BIN(?)`,
                values
            )
            return await AirportModel.getById(id)
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
                'DELETE FROM airports WHERE id = UUID_TO_BIN(?)',
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
