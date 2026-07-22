import * as z from 'zod'

const passengerSchema = z.object({
    id: z.uuid('El formato del ID es inválido'),
    first_name: z.string().min(2).max(50, 'El nombre es obligatorio'),
    last_name: z.string().min(2).max(50, 'El apellido es obligatorio'),
    passport: z.string().min(6).max(20, 'El pasaporte es obligatorio'),
    nationality: z.string().min(2).max(50, 'La nacionalidad es obligatoria'),
    email: z.email('El correo electrónico es inválido')
}).strict()

export const validatePassenger = (passenger) => {
    return passengerSchema.safeParse(passenger)
}

export const validatePartialPassenger = (passenger) => {
    return passengerSchema.partial().safeParse(passenger)
}
