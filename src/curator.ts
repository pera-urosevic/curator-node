import fs from 'fs/promises'
import { scanFilesystem } from './filesystem.ts'
import { assignMeta } from './meta.ts'

const curator = async (paths: string[]) => {
	console.log('Curator v1.0')
	for (const p of paths) {
		console.log('Scanning:', p)
		let isDirectory = false
		try {
			const stat = await fs.stat(p)
			isDirectory = stat.isDirectory()
		} catch (err) {
			console.error('Curator error:', p, err)
			continue
		}

		if (isDirectory) {
			await scanFilesystem(p, assignMeta)
		} else {
			await assignMeta(p)
		}
	}
}

await curator(process.argv.slice(2))
