export const isAuth = async (req, res, next) => {

    // capturar la req y obtener los encabezados
    console.log(req.headers)

    // TODO: obtener el Authorization
    // TODO: validar el token
    // TODO: rechazar o continuar en función de los resultados

    // por ahora puede continuar
    next()
}
