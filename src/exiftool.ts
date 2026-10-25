import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

export const writeIPTC = async (path: string, tags: string[], description: string) => {
	const args = ['-overwrite_original']

	if (tags.length === 0) {
		args.push('-IPTC:Keywords=')
	} else {
		for (const tag of tags) {
			args.push(`-IPTC:Keywords=${tag}`)
		}
	}

	args.push(`-IPTC:Caption-Abstract=${description}`)
	args.push(path)

	await execFileAsync('exiftool', args)
}
