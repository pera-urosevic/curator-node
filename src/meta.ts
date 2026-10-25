import fs from 'fs/promises'
import { suggestMeta } from './ollama.ts'
import { logError } from './log.ts'
import { writeIPTC } from './exiftool.ts'

export const assignMeta = async (imagePath: string) => {
	try {
		const imageBuffer = await fs.readFile(imagePath)
		const base64Image = imageBuffer.toString('base64')
		const result = await suggestMeta(base64Image)
		await writeIPTC(imagePath, result.tags, result.description)
	} catch (error) {
		await logError(imagePath, error)
	}
}
