import * as z from 'zod'

const airlineSchema = z.object({
    id: z.uuid('El formato del ID es inválido'),
    name: z.string().min(2).max(100, 'El nombre es demasiado largo'),
    iata_code: z.string().min(2).max(3, 'El código IATA debe tener 2-3 caracteres'),
    country: z.string().min(2).max(50, 'El país es obligatorio'),
    logo_url: z.string().url('La URL del logo no es válida').optional()
}).strict()

export const validateAirline = (airline) => {
    return airlineSchema.safeParse(airline)
}

export const validatePartialAirline = (airline) => {
    return airlineSchema.partial().safeParse(airline)
}
