import { Ollama } from 'ollama'
import { z } from 'zod'

const ollama = new Ollama()

const ResultSchema = z.object({
	tags: z.array(z.string()),
	description: z.string(),
})

export const suggestMeta = async (base64Image: string) => {
	const response = await ollama.generate({
		model: 'gemma4:e4b',
		prompt: `Analyze this image and output relevant tags and a brief description in one sentence"`,
		images: [base64Image],
		think: false,
		format: {
			type: 'object',
			properties: {
				tags: {
					type: 'array',
					items: { type: 'string' },
				},
				description: {
					type: 'string',
				},
			},
			required: ['tags', 'description'],
		},
	})

	const result = ResultSchema.parse(JSON.parse(response.response ?? ''))
	result.tags = result.tags.map(tag => tag.toLowerCase())
	return result
}
