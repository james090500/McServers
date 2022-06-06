import { Router } from 'itty-router'
import Server from './server'

// Load the router
const router = Router()
const jsonNotFound = `{"success": false, "reason": "404"}`
const jsonHeader = {
    'Access-Control-Allow-Origin': '*',
    'Content-type': 'application/json'
}
const imageHeader = {
    'Access-Control-Allow-Origin': '*',
    'Content-type': 'image/png'
}

// List the servers
router.get('/v1/server/list', async request => {
    let sortingList = await SERVERS.list();
    if(sortingList === null) return new Response(jsonNotFound, { status: 404, headers: jsonHeader });
    const sortedServers = Object.fromEntries(Object.entries(sortingList.keys).sort(([,a],[,b]) => a.metadata.likes - b.metadata.likes));
    return new Response(JSON.stringify(sortedServers), { headers: jsonHeader });
})

// Create the server
router.post('/v1/server/create', async request => {
    let postData = await request.json()
    let response = await Server.createServer(postData)
    if(response === null) return new Response(jsonNotFound, { status: 404, headers: jsonHeader });
    return new Response(response, { headers: jsonHeader });
})

// Get the server
router.get('/v1/server/:serverHash', async request => {
    let response = await Server.getServer(request.params.serverHash)
    if(response === null) return new Response(jsonNotFound, { status: 404, headers: jsonHeader });
    return new Response(response, { headers: jsonHeader });
})

// All other routers
router.all('/*', () => new Response(jsonNotFound, { status: 404, headers: jsonHeader }))

// Return the router
export const handleRequest = request => router.handle(request)