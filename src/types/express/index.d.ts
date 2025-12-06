import { JwtPayload } from "jsonwebtoken"

declare global{
    namespace Express{
        Windsurf: Refactor | Explain
        interface Request {
            user?: JwtPayload
        }
    }
}