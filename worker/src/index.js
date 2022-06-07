import router from './handler'
import server from './server'

// Return the router
addEventListener('fetch', (event) => {
    event.respondWith(router.handle(event.request))
})

// Run Cron Events
addEventListener('scheduled', event => {
    console.log("Cron helllo?")
    event.waitUntil(server.updateServers());
});