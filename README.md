# Curator

A Node.js/TypeScript CLI that recursively scans a directory for JPEG images,
asks a local Ollama vision model for descriptive tags and a caption, and writes
the result into each image's IPTC metadata using ExifTool.

## Features

- Analyses list of files and/or directories (recursively).
- Processes `.jpg` and `.jpeg` files (case-insensitive).
- Sends each image to the configured Ollama model and parses the returned
  tags and one-sentence description.
- Normalizes generated tags to lowercase.
- Writes IPTC `Keywords` and `Caption-Abstract` metadata in place.
- Logs failures to `errors.log` in the current working directory.
- Prints scan progress and per-image processing time.

## Requirements

- Node.js 20+ (ES2022 target)
- pnpm
- [Ollama](https://ollama.com) running locally with the `gemma4:e4b` model
  pulled:

   ```sh
   ollama pull gemma4:e4b
   ```

- [ExifTool](https://exiftool.org) installed and available on `PATH`

## Installation

```sh
git clone <repository-url>
cd curator-node
pnpm install
```

## Usage

Run directly from TypeScript with `tsx`:

```sh
pnpm exec tsx src/curator.ts /path/to/photos
```

Or compile first and run the built JavaScript:

```sh
pnpm exec tsc
node dist/curator.js /path/to/photos
```

The single positional argument is the root directory to scan.

## How it works

1. `src/filesystem.ts` walks the input directory. JPEG files are passed to the
   metadata callback; unreadable entries are reported through `errors.log`.
2. `src/meta.ts` reads the image, base64-encodes it, and calls Ollama.
3. `src/ollama.ts` requests tags and a description from `gemma4:e4b`, validates
   the JSON response with Zod, lowercases the tags, and returns them.
4. `src/exiftool.ts` invokes ExifTool to set `IPTC:Keywords` and
   `IPTC:Caption-Abstract`, overwriting the original file (`-overwrite_original`).

## Configuration

Settings are currently defined in source:

- `src/ollama.ts`: Ollama model (`gemma4:e4b`), prompt, and response schema.
- `src/filesystem.ts`: accepted image extensions and directory traversal
  behavior.
- `src/exiftool.ts`: IPTC fields written to each image.
- `src/log.ts`: error log destination (`errors.log`).

The Ollama client uses its default local endpoint
(`http://127.0.0.1:11434`) unless constructed with different options.

## Output and side effects

- Image files are modified in place.
- Failed scans and metadata assignments are appended to `errors.log`.
- Progress and timing information is printed to standard output.

## Development

```sh
pnpm install
pnpm exec tsc          # Type-check/compile
pnpm exec prettier .   # Format
```

There is currently no automated test suite.

## Limitations

- Only JPEG files (`.jpg`/`.jpeg`) are processed.
- Directory symlinks are not followed because traversal uses `lstat`.
- The model and Ollama endpoint are not configurable via CLI flags or
  environment variables; change them in `src/ollama.ts`.
- Ollama and ExifTool must be installed separately.
