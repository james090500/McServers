export default {
    async getHash(ip, port) {
        let serverIpPort = new TextEncoder().encode(`${ip.toLowerCase()}:${port}`);
        let hashBuffer = await crypto.subtle.digest('SHA-256', serverIpPort);
        let hashArray = Array.from(new Uint8Array(hashBuffer));
        let hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    },
    async getServer(serverHash) {
        let { value, metadata } = await SERVERS.getWithMetadata(serverHash);
        let serverQuery = JSON.parse(value);
        serverQuery.likes = metadata.likes;
        return serverQuery;
    },
    async createServer(postData) {
        let serverHash = await this.getHash(postData.ip, postData.port);
        let server = await SERVERS.get(serverHash)
        if(server != null) return server;

        let serverJson = JSON.stringify({
            hash: serverHash,
            name: postData.name,
            ip: postData.ip,
            port: postData.port,
            updated: Date.now(),
            online: true,
            query: await this.doServerQuery(postData.ip, postData.port)
        })

        await SERVERS.put(serverHash, serverJson, {
            metadata: { likes: 0 },
        })

        return serverJson;
    },
    async likeServer(serverHash) {
        let { value, metadata } = await SERVERS.getWithMetadata(serverHash);
        await SERVERS.put(serverHash, value, {
            metadata: { likes: metadata.likes + 1 }
        })
        return true;
    },
    async doServerQuery(ip, port) {
        let response = await fetch(`https://minecraft-api.com/api/ping/${ip}/${port}/json`)
        return (response.headers.get('content-type').includes('application/json')) ? await response.json() : false
    },
    async updateServers() {
        //List all servers
        let allServers = await SERVERS.list();

        //Loop through all servers
        for(let server of allServers.keys) {
            //Get the server hash and data
            let { value, metadata } = await SERVERS.getWithMetadata(server.name);

            //Perform an updated query
            let serverQuery = this.doServerQuery(value.ip, value.port)

            //If the query is offline set "online" to false and otherwise set it to true!
            let serverData = JSON.parse(value);
            serverData.updated = Date.now()
            serverData.online = (serverQuery != false);
            SERVERS.put(serverData.hash, JSON.stringify(serverData), {
                metadata: { likes: metadata.likes }
            })
            console.log(`[CRON] Updated ${serverData.hash} `)
        }
    }
}