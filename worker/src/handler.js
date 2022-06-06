import { Router } from 'itty-router'
import Server from './server'
import { handleCors, wrapCorsHeader } from './corshelper'

// Load the router
const router = Router()
const jsonNotFound = `{"success": false, "reason": "404"}`
const jsonHeader = {
    'Access-Control-Allow-Origin': '*',
    'Content-type': 'application/json'
}

// List the servers
router.get('/v1/server/list', async request => {
    let sortingList = await SERVERS.list();
    if(sortingList === null) return new Response(jsonNotFound, { status: 404, headers: jsonHeader });
    const sortedServers = Object.fromEntries(Object.entries(sortingList.keys).sort(([,a],[,b]) => a.metadata.likes - b.metadata.likes));
    return new Response(JSON.stringify(sortedServers), { headers: jsonHeader });
})

// Create the server
router.options('/v1/server/create', handleCors({ methods: 'POST', maxAge: 86400 }))
router.post('/v1/server/create', async request => {
    let formData = await request.json();
    let response = await Server.createServer(formData)
    if(response === null) return new Response(jsonNotFound, { status: 404, headers: jsonHeader });

    return wrapCorsHeader(
        new Response(response), { status: 201 }
    )
})

//Like a server
router.post('/v1/server/:serverHash/like', async request => {
    let response = await Server.likeServer(request.params.serverHash)
    console.log(response)
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
router.get('*', () => new Response(jsonNotFound, { status: 404, headers: jsonHeader }))

// Return the router
export const handleRequest = request => router.handle(request)