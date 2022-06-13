import { Router } from 'itty-router'
import {
    withContent,
    json,
    missing,
    error,
  } from 'itty-router-extras'

import server from './controllers/server'

import { handleCors, wrapCorsHeader } from './corshelper'

// Load the router
const router = Router()

// List the servers
router.get('/v1/server/list', async () => {
    let response = await server.getServerList();
    return wrapCorsHeader(response ? json(response) : error(500, 'Something went wrong'));
})

// Create the server
router.post('/v1/server/create', withContent, async ({ content }) => {
    let response = await server.createServer(content)
    return wrapCorsHeader(response ? json(response) : error(500, 'Something went wrong'));
})

//Like a server
router.post('/v1/server/:serverHash/like', async request => {
    let response = await server.likeServer(request.params.serverHash)
    return wrapCorsHeader(response ? json(response) : error(500, 'Something went wrong'));
})

// Get the MOTD
router.get('/v1/server/:serverHash/motd', async request => {
    let response = await server.getMotd(request.params.serverHash)
    return wrapCorsHeader(response ? response : error(500, 'Something went wrong'));
})

// Get the server
router.get('/v1/server/:serverHash', async request => {
    let response = await server.getServer(request.params.serverHash)
    return wrapCorsHeader(response ? json(response) : error(500, 'Something went wrong'));
})

// All other routers
router.options('*', handleCors())
router.all('*', () => missing('Not Found'))

//Export the router;
export default router;