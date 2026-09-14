#!/usr/bin/env node

import { startServer } from '../dist-server/server.js'
import { createServer as createNetServer } from 'node:net'
import { exec } from 'node:child_process'
import { platform } from 'node:os'

const PORT = parseInt(process.env.PORT ?? '4321', 10)

function findFreePort() {
  return new Promise((resolve, reject) => {
    const server = createNetServer()
    server.listen(0, 'localhost', () => {
      const port = server.address().port
      server.close()
      resolve(port)
    })
    server.on('error', reject)
  })
}

function openBrowser(port) {
  const url = `http://localhost:${port}`

  if (platform() === 'darwin') {
    exec(`open "${url}"`)
  } else if (platform() === 'win32') {
    exec(`start "${url}"`)
  } else {
    exec(`xdg-open "${url}"`)
  }
}

function startWithRetry(port) {
  const server = startServer(port)

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      server.close()
      findFreePort().then((newPort) => {
        startWithRetry(newPort)
      }).catch((err) => {
        console.error('Failed to find free port:', err)
        process.exit(1)
      })
    } else {
      console.error('Failed to start server:', err)
      process.exit(1)
    }
  })

  server.on('listening', () => {
    openBrowser(port)
  })
}

startWithRetry(PORT)
