import { Request, Response, NextFunction } from 'express'
import { CatchAsyncError } from './catchAsyncErrors'
import ErrorHandler from '../utils/ErrorHandler'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { redis } from '../utils/redis'

export const isAuthenticated = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token as string

    if (!access_token) {
      return next(new ErrorHandler('Por favor faca o login', 400))
    }

    const decoded = jwt.verify(
      access_token,
      process.env.ACCESS_TOKEN as string
    ) as JwtPayload

    if (!decoded) {
      return next(
        new ErrorHandler('Por favor faca o login para acessar o recurso', 400)
      )
    }

    const user = await redis.get(decoded.id)

    if (!user) {
      return next(new ErrorHandler('please login to access this resource', 400))
    }

    req.user = JSON.parse(user)
    next()
  }
)

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role || '')) {
      return next(
        new ErrorHandler(
          `tipo de usuario: ${req.user?.role} não é permitido para acessar o recurso`,
          403
        )
      )
    }
    next()
  }
}
