import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
} from 'node:fs'
import { dirname, resolve, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const skill = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const targetArgument = process.argv[2]
if (!targetArgument || targetArgument.startsWith('--')) {
  console.error(
    'Usage: node scaffold.mjs <game-project-directory> [--replace-art]',
  )
  process.exit(1)
}
const target = resolve(targetArgument, 'art')
const replace = process.argv.includes('--replace-art')
const files = [
  ...readdirSync(join(skill, 'assets/web')).map((name) => ({
    source: join(skill, 'assets/web', name),
    target: join(target, name),
  })),
  {
    source: join(skill, 'assets/theme.json'),
    target: join(target, 'theme.json'),
  },
  ...readdirSync(join(skill, 'assets/fonts')).map((name) => ({
    source: join(skill, 'assets/fonts', name),
    target: join(target, 'fonts', name),
  })),
]
// Preflight all writes before making changes. Existing game files are outside this scope.
for (const file of files) {
  if (
    !relative(target, file.target) ||
    relative(target, file.target).startsWith('..')
  )
    throw new Error('Copy escaped the art directory')
  if (
    existsSync(file.target) &&
    !replace &&
    !readFileSync(file.source).equals(readFileSync(file.target))
  )
    throw new Error(
      `Art file already differs: ${file.target}. Use --replace-art only when replacing those files is intended.`,
    )
}
let copied = 0,
  identical = 0
for (const file of files) {
  if (
    existsSync(file.target) &&
    readFileSync(file.source).equals(readFileSync(file.target))
  ) {
    identical++
    continue
  }
  mkdirSync(dirname(file.target), { recursive: true })
  cpSync(file.source, file.target)
  copied++
}
console.log(
  JSON.stringify(
    { status: 'ready', artDirectory: target, copied, identical },
    null,
    2,
  ),
)
