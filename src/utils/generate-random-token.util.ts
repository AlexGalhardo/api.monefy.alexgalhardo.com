import * as crypto from "node:crypto";

export default function generateRandomToken(tokenLength = 48): string {
    return crypto
        .randomBytes(Math.ceil(tokenLength / 2))
        .toString("hex")
        .slice(0, tokenLength);
}
