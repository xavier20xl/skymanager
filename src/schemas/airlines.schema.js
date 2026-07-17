import * as z from 'zod'

const airlineSchema = z.object({
    id: z.string().min(1, 'El ID es obligatorio'),
    name: z.string().min(2).max(100, 'El nombre es demasiado largo'),
    iata_code: z.string().min(2).max(3, 'El código IATA debe tener 2-3 caracteres'),
    country: z.string().min(2).max(50, 'El país es obligatorio')
}).strict()

export const validateAirline = (airline) => {
    return airlineSchema.safeParse(airline)
}

export const validatePartialAirline = (airline) => {
    return airlineSchema.partial().safeParse(airline)
}
