export default {
    async getHash(ip, port) {
        let serverIpPort = new TextEncoder().encode(`${ip}:${port}`);
        let hashBuffer = await crypto.subtle.digest('SHA-256', serverIpPort);
        let hashArray = Array.from(new Uint8Array(hashBuffer));
        let hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    },
    async getServer(serverHash) {
        let { value, metadata } = await SERVERS.getWithMetadata(serverHash);
        let serverQuery = JSON.parse(value);
        serverQuery.likes = metadata.likes;
        return JSON.stringify(serverQuery);
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
            query: await this.doServerQuery(postData.ip, postData.port)
        })

        await SERVERS.put(serverHash, serverJson, {
            metadata: { likes: 0 },
        })

        return serverJson;
    },
    async likeServer(serverHash) {
        let { value, metadata } = await SERVERS.getWithMetadata(serverHash);
        await SERVERS.delete(serverHash);
        await SERVERS.put(serverHash, value, {
            metadata: { likes: metadata.likes + 1 }
        })
        return JSON.parse(`{"success":true}`)
    },
    async doServerQuery(ip, port) {
        let response = await fetch(`https://minecraft-api.com/api/ping/${ip}/${port}/json`)
        let data = await response.json();
        return data;
    }
}