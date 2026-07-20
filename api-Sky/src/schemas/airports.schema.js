import * as z from 'zod'

const airportSchema = z.object({
    id: z.uuidv4('El formato del ID es inválido'),
    iata_code: z.string().min(3).max(3, 'El código IATA debe tener 3 caracteres'),
    name: z.string().min(2).max(150, 'El nombre es demasiado largo'),
    city: z.string().min(2).max(100, 'La ciudad es obligatoria'),
    country: z.string().min(2).max(50, 'El país es obligatorio')
}).strict()

export const validateAirport = (airport) => {
    return airportSchema.safeParse(airport)
}

export const validatePartialAirport = (airport) => {
    return airportSchema.partial().safeParse(airport)
}
