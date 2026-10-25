import fs from 'fs/promises'

export const logError = async (context: string, error: unknown) => {
	await fs.appendFile('errors.log', `${context}: ${String(error)}\n`)
}
