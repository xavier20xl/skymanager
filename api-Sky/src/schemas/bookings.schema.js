import * as z from 'zod'

const bookingSchema = z.object({
    id: z.uuidv4('El formato del ID es inválido'),
    passenger_id: z.uuidv4('El formato del ID del pasajero es inválido'),
    flight_id: z.uuidv4('El formato del ID del vuelo es inválido'),
    seat_number: z.string().min(1).max(5, 'El número de asiento es obligatorio'),
    booking_date: z.string().datetime('Formato de fecha inválido'),
    status: z.enum(['confirmed', 'cancelled', 'pending'])
}).strict()

export const validateBooking = (booking) => {
    return bookingSchema.safeParse(booking)
}

export const validatePartialBooking = (booking) => {
    return bookingSchema.partial().safeParse(booking)
}
