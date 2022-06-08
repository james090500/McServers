import { Router } from 'itty-router'
import {
    withContent,
    json,
    missing,
    error,
  } from 'itty-router-extras'
import Server from './server'
import { handleCors, wrapCorsHeader } from './corshelper'

// Load the router
const router = Router()
const imageHeader = {
    'Access-Control-Allow-Origin': '*',
    'Content-type': 'image/png'
}

// List the servers
router.get('/v1/server/list', async () => {
    let sortingList = await SERVERS.list();
    if(sortingList === null) return missing('Not Found');
    let sortedServers = sortingList.keys.sort((a,b) => (a.metadata.likes < b.metadata.likes) ? 1 : -1);
    sortedServers = sortedServers.filter(server => server.name != "92d1f515c258ca2ef1e8e7a3c79f879d8a59d1304051ba0d440c0b59349f600a");
    return wrapCorsHeader(json(sortedServers));
})

// Create the server
router.post('/v1/server/create', withContent, async ({ content }) => {
    let response = await Server.createServer(content)
    return wrapCorsHeader((response) ? json(response) : error(400, 'Invalid request'));
})

//Like a server
router.post('/v1/server/:serverHash/like', async request => {
    let response = await Server.likeServer(request.params.serverHash)
    return wrapCorsHeader((response) ? json(response) : error(500, 'Something went wrong'));
})

// Get the MOTD
router.get('/v1/server/:serverHash/motd', async request => {
    let serverData = JSON.parse(await SERVERS.get(request.params.serverHash));
    let motd = await fetch(`http://status.mclive.eu/${serverData.name}/${serverData.ip}/${serverData.port}/banner.png`)
    if(!motd.ok) return error(500, 'Something went wrong')
    let motdBlob = await motd.blob()
    let response = new Response(motdBlob, { headers: { 'Content-type': 'image/png' }});
    return wrapCorsHeader((response) ? response : error(500, 'Something went wrong'))
})

// Get the server
router.get('/v1/server/:serverHash', async request => {
    let response = await Server.getServer(request.params.serverHash)
    return wrapCorsHeader((response) ? json(response) : error(500, 'Something went wrong'));
})

// Testing CRON on Wrangler
// router.get('/cron', async request => {
//     await Server.updateServers();
//     return json("Done")
// })

// All other routers
router.options('*', handleCors())
router.all('*', () => missing('Not Found'))

//Export the router;
export default router;