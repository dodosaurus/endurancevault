import { UserService } from '../services/userService'

const userService = new UserService()

const userId = 28 // User ID from database
const token = userService.generateJWT(userId)

console.log('Test JWT Token:')
console.log(token)
console.log('\nUse this token in Authorization header: Bearer <token>')