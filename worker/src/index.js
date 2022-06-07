import { Router } from 'itty-router'
import {
    json,
    missing,
    error,
  } from 'itty-router-extras'
import Server from './server'
import { handleCors, wrapCorsHeader } from './corshelper'

// Load the router
const router = Router()

// List the servers
router.get('/v1/server/list', async () => {
    let sortingList = await SERVERS.list();
    if(sortingList === null) return missing('Not Found');
    let sortedServers = sortingList.keys.sort((a,b) => (a.metadata.likes < b.metadata.likes) ? 1 : -1);
    sortedServers = sortedServers.filter(server => server.name != "92d1f515c258ca2ef1e8e7a3c79f879d8a59d1304051ba0d440c0b59349f600a");
    return wrapCorsHeader(json(sortedServers));
})

// Create the server
router.post('/v1/server/create', async request => {
    let formData = await request.json();
    let response = await Server.createServer(formData)
    return wrapCorsHeader((response) ? json(response) : error('Something went wrong'));
})

//Like a server
router.post('/v1/server/:serverHash/like', async request => {
    let response = await Server.likeServer(request.params.serverHash)
    return wrapCorsHeader((response) ? json(response) : error('Something went wrong'));
})

// Get the server
router.get('/v1/server/:serverHash', async request => {
    let response = await Server.getServer(request.params.serverHash)
    return wrapCorsHeader((response) ? json(response) : error('Something went wrong'));
})

// All other routers
router.options('*', handleCors())
router.all('*', () => missing('Not Found'))

// Return the router
addEventListener('fetch', (event) => {
    event.respondWith(router.handle(event.request))
})