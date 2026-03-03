const { spawnSync } = require('node:child_process')
const { rmSync, cpSync, existsSync } = require('node:fs')
const path = require('node:path')

const backendRoot = path.resolve(__dirname, '..')
const frontendRoot = path.resolve(__dirname, '..', '..', 'part2', 'phonebook')
const frontendDist = path.join(frontendRoot, 'dist')
const backendDist = path.join(backendRoot, 'dist')

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm'

const install = spawnSync(npmCmd, ['install', '--no-audit', '--no-fund'], {
  cwd: frontendRoot,
  stdio: 'inherit',
})

if (install.status !== 0) {
  throw new Error('Failed to install frontend dependencies')
}

const build = spawnSync(npmCmd, ['run', 'build'], {
  cwd: frontendRoot,
  stdio: 'inherit',
})

if (build.status !== 0) {
  throw new Error('Failed to build frontend')
}

rmSync(backendDist, { recursive: true, force: true })

if (!existsSync(frontendDist)) {
  throw new Error('Frontend dist directory was not created')
}

cpSync(frontendDist, backendDist, { recursive: true })
console.log('Frontend build copied to backend/dist')
