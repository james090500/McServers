export default {
    async getHash(ip, port) {
        let serverIpPort = new TextEncoder().encode(`${ip}:${port}`);
        let hashBuffer = await crypto.subtle.digest('SHA-256', serverIpPort);
        let hashArray = Array.from(new Uint8Array(hashBuffer));
        let hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    },
    async getServer(serverHash) {
        let serverQuery = await SERVERS.get(serverHash);
        return serverQuery;
    },
    async createServer(postData) {
        postData.port = (postData.port != undefined) ? postData.port : 25565;
        let serverHash = await this.getHash(postData.ip, postData.port);

        let serverJson = JSON.stringify({
            hash: serverHash,
            name: postData.name,
            ip: postData.ip,
            port: postData.port,
            query: await this.doServerQuery(postData.ip, postData.port)
        })

        SERVERS.put(serverHash, serverJson, {
            metadata: { likes: 0 },
        })

        return serverJson;
    },
    async doServerQuery(ip, port) {
        let response = await fetch(`https://minecraft-api.com/api/ping/${ip}/${port}/json`)
        let data = await response.json();
        return data;
    }
}