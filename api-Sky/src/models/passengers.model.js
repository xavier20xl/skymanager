import pool from '../db/db.js'

export default class PassengerModel {

    static getAll = async () => {
        const conn = await pool.getConnection()
        try {
            const [rows] = await conn.query(`SELECT
                BIN_TO_UUID(id) AS id,
                first_name,
                last_name,
                passport,
                nationality,
                email
            FROM passengers`)
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
                first_name,
                last_name,
                passport,
                nationality,
                email
            FROM passengers WHERE id = UUID_TO_BIN(?)`, [id])
            return rows[0] || null
        } catch (e) {
            throw e
        } finally {
            conn.release()
        }
    }

    static create = async (passenger) => {
        const conn = await pool.getConnection()
        try {
            await conn.execute(
                `INSERT INTO passengers (id, first_name, last_name, passport, nationality, email)
                VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?)`,
                [passenger.id, passenger.first_name, passenger.last_name, passenger.passport, passenger.nationality, passenger.email]
            )
            return await PassengerModel.getById(passenger.id)
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
                `UPDATE passengers SET ${fields} WHERE id = UUID_TO_BIN(?)`,
                values
            )
            return await PassengerModel.getById(id)
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
                'DELETE FROM passengers WHERE id = UUID_TO_BIN(?)',
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
