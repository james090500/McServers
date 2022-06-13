export default {
    async getHash(ip, port) {
        //Create a unique hash of a server by its IP and Port
        let serverIpPort = new TextEncoder().encode(`${ip.toLowerCase()}:${port}`)
        let hashBuffer = await crypto.subtle.digest('SHA-256', serverIpPort)
        let hashArray = Array.from(new Uint8Array(hashBuffer))
        let hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
        return hashHex
    },
    async getServerCountry(ip) {
        //Query an IP api to get the country of a server
        let response = await fetch(`http://ip-api.com/json/${ip}`)
        let data = await response.json()
        return (data.status == "success") ? data.country : false
    },
    async doServerQuery(ip, port) {
        //Pull query data from an API. Can we do this ourselves in the future?
        let response = await fetch(`https://minecraft-api.com/api/ping/${ip}/${port}/json`)
        return (response.headers.get('content-type').includes('application/json')) ? await response.json() : false
    }
}