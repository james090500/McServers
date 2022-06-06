<template>
    <section>
        <h1 class="text-center">Add Server</h1>
        <div class="row justify-content-center">
            <div class="col-lg-6">
                <div class="form-floating mb-3">
                    <input type="text" class="form-control" id="name" v-model="name">
                    <label for="name">Name</label>
                </div>
                <div class="form-floating mb-3">
                    <input type="text" class="form-control" id="ip" v-model="ip">
                    <label for="ip">IP</label>
                </div>
                <div class="form-floating mb-3">
                    <input type="text" class="form-control" id="port" placeholder="25565" v-model="port">
                    <label for="port">Port</label>
                </div>
                <div class="d-grid col-6 mx-auto">
                    <button class="btn btn-primary btn-block" @click="addServer">Add Server</button>
                    <small>The server will first go through validation checks then you'll be redirected.</small>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    export default {
        data() {
            return {
                name: null,
                ip: null,
                port: 25565
            }
        },
        methods: {
            addServer() {
                this.axios.post('https://mcservers-api.james090500.workers.dev/v1/server/create', {
                    name: this.name,
                    ip: this.ip,
                    port: this.port
                }).then((response) => {
                    this.$router.push(`/server/${response.data.hash}`)
                })
            }
        }
    }
</script>