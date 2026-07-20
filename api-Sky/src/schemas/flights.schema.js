import * as z from 'zod'

const flightSchema = z.object({
    id: z.uuidv4('El formato del ID es inválido'),
    origin: z.string().min(3).max(3, 'El código de origen debe tener 3 caracteres'),
    destination: z.string().min(3).max(3, 'El código de destino debe tener 3 caracteres'),
    airline_id: z.uuidv4('El formato del ID de la aerolínea es inválido'),
    departure_time: z.string().datetime('Formato de fecha de salida inválido'),
    arrival_time: z.string().datetime('Formato de fecha de llegada inválido'),
    status: z.enum(['scheduled', 'boarding', 'departed', 'arrived', 'cancelled']),
    gate: z.string().min(1).max(10, 'El número de gate es demasiado largo'),
    capacity: z.number().int().min(1).max(500, 'La capacidad no puede exceder 500')
}).strict()

export const validateFlight = (flight) => {
    return flightSchema.safeParse(flight)
}

export const validatePartialFlight = (flight) => {
    return flightSchema.partial().safeParse(flight)
}
