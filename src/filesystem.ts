import fs from 'fs/promises'
import path from 'path'
import { assignMeta } from './meta.ts'
import { logError } from './log.ts'

export const scanFilesystem = async (folder: string, callback: (path: string) => Promise<void>) => {
	const recurse = async (dir: string) => {
		let entries: string[]
		try {
			entries = await fs.readdir(dir)
		} catch (err: unknown) {
			await logError(dir, err)
			return
		}

		for (const entry of entries) {
			const fullPath = path.join(dir, entry)
			try {
				const stat = await fs.lstat(fullPath)

				if (stat.isDirectory()) {
					console.log('subdirectory:', fullPath)
					await recurse(fullPath)
				} else if (/\.(jpg|jpeg)$/i.test(entry)) {
					const start = performance.now()
					await callback(fullPath)
					const end = performance.now()
					console.log('photo:', fullPath, 'time:', ((end - start) / 1000).toFixed(2))
				}
			} catch (err: unknown) {
				await logError(fullPath, err)
			}
		}
	}

	await recurse(folder)
}
