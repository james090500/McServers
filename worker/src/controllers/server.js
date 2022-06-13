import utils from './utils'

export default {
    async getServerList() {
        let sortingList = await SERVERS.list()
        if(sortingList === null) return false
        let sortedServers = sortingList.keys.sort((a,b) => (a.metadata.likes < b.metadata.likes) ? 1 : -1)
        sortedServers = sortedServers.filter(s => s.name != "92d1f515c258ca2ef1e8e7a3c79f879d8a59d1304051ba0d440c0b59349f600a")
        return sortedServers
    },
    async createServer(postData) {
        //Make sure data is submitted
        if(postData == null || postData.ip == null || postData.name == null || postData.port == null) return false

        //Get the server hash and the data. If a server exists return existing data
        let serverHash = await utils.getHash(postData.ip, postData.port)
        let server = await SERVERS.get(serverHash)
        if(server != null) return server

        //Create a model for the server response
        let serverJson = JSON.stringify({
            hash: serverHash,
            name: postData.name,
            ip: postData.ip,
            port: postData.port,
            updated: Date.now(),
            online: true,
            query: await utils.doServerQuery(postData.ip, postData.port),
            country: await utils.getServerCountry(postData.ip)
        })

        //Put the data in the KV but lets return it in the meantime
        SERVERS.put(serverHash, serverJson, {
            metadata: { likes: 0 },
        })

        return serverJson
    },
    async likeServer(serverHash) {
        //Update the likes but lets be speedy with no waiting
        let { value, metadata } = SERVERS.getWithMetadata(serverHash)
        SERVERS.put(serverHash, value, {
            metadata: { likes: metadata.likes + 1 }
        })
        return true
    },
    async getMotd(serverHash) {
        let serverData = JSON.parse(await SERVERS.get(serverHash));
        let motd = await fetch(`http://status.mclive.eu/${serverData.name}/${serverData.ip}/${serverData.port}/banner.png`)
        if(!motd.ok) return false;
        let motdBlob = await motd.blob()
        return new Response(motdBlob, { headers: { 'Content-type': 'image/png' }});
    },
    async getServer(serverHash) {
        //Get the server and meta data from KV
        let { value, metadata } = await SERVERS.getWithMetadata(serverHash)

        //Add the metadata likes into the server (we use meta data for list sorting)
        let server = JSON.parse(value)
        server.likes = metadata.likes

        //If last update was over 10 minutes (600000 milliseconds ago) lets update the cache
        return (server.updated < (Date.now() - 600000)) ? this.updateServer(server, metadata) : server
    },
    async updateServer(serverData, metadata) {
        //Perform an updated query
        let serverQuery = await utils.doServerQuery(serverData.ip, serverData.port)

        //Put the query in response
        serverData.query = serverQuery

        //If the query is offline set "online" to false and otherwise set it to true!
        serverData.updated = Date.now()
        serverData.online = (serverData != false)
        serverData.country = await utils.getServerCountry(serverData.ip)
        SERVERS.put(serverData.hash, JSON.stringify(serverData), {
            metadata: { likes: metadata.likes }
        })

        //Log so we know performance
        console.log(`Cache has been updated for ${serverData.hash}`)

        //Return the data
        return serverData
    }
}