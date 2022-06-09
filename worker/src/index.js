import router from './handler'

// Return the router
addEventListener('fetch', (event) => {
    event.respondWith(router.handle(event.request))
})