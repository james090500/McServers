export default {
    async getHash(ip, port) {
        //Create a unique hash of a server by its IP and Port
        let serverIpPort = new TextEncoder().encode(`${ip.toLowerCase()}:${port}`);
        let hashBuffer = await crypto.subtle.digest('SHA-256', serverIpPort);
        let hashArray = Array.from(new Uint8Array(hashBuffer));
        let hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    },
    async getServerCountry(ip) {
        //Query an IP api to get the country of a server
        let response = await fetch(`http://ip-api.com/json/${ip}`)
        let data = await response.json();
        return (data.status == "success") ? data.country : false;
    },
    async getServer(serverHash) {
        //Get the server and meta data from KV
        let { value, metadata } = await SERVERS.getWithMetadata(serverHash);

        //Add the metadata likes into the server (we use meta data for list sorting)
        let server = JSON.parse(value);
        server.likes = metadata.likes;

        //If last update was over 10 minutes (600000 milliseconds ago) lets update the cache
        return (server.updated < (Date.now() - 600000)) ? this.updateServer(server, metadata) : server
    },
    async createServer(postData) {
        //Make sure data is submitted
        if(postData == null || postData.ip == null || postData.name == null || postData.port == null) return false;

        //Get the server hash and the data. If a server exists return existing data
        let serverHash = await this.getHash(postData.ip, postData.port);
        let server = await SERVERS.get(serverHash)
        if(server != null) return server;

        //Create a model for the server response
        let serverJson = JSON.stringify({
            hash: serverHash,
            name: postData.name,
            ip: postData.ip,
            port: postData.port,
            updated: Date.now(),
            online: true,
            query: await this.doServerQuery(postData.ip, postData.port),
            country: await this.getServerCountry(postData.ip)
        })

        //Put the data in the KV but lets return it in the meantime
        SERVERS.put(serverHash, serverJson, {
            metadata: { likes: 0 },
        })

        return serverJson;
    },
    async likeServer(serverHash) {
        //Update the likes but lets be speedy with no waiting
        let { value, metadata } = SERVERS.getWithMetadata(serverHash);
        SERVERS.put(serverHash, value, {
            metadata: { likes: metadata.likes + 1 }
        })
        return true;
    },
    async doServerQuery(ip, port) {
        //Pull query data from an API. Can we do this ourselves in the future?
        let response = await fetch(`https://minecraft-api.com/api/ping/${ip}/${port}/json`)
        return (response.headers.get('content-type').includes('application/json')) ? await response.json() : false
    },
    async updateServer(serverData, metadata) {
        //Perform an updated query
        let serverQuery = await this.doServerQuery(serverData.ip, serverData.port)

        //Put the query in response
        serverData.query = serverQuery;

        //If the query is offline set "online" to false and otherwise set it to true!
        serverData.updated = Date.now()
        serverData.online = (serverData != false);
        serverData.country = await this.getServerCountry(serverData.ip)
        SERVERS.put(serverData.hash, JSON.stringify(serverData), {
            metadata: { likes: metadata.likes }
        })

        //Log so we know performance
        console.log(`Cache has been updated for ${serverData.hash}`)

        //Return the data
        return serverData;
    }
}