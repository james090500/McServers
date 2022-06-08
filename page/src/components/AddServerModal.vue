<template>
    <div class="modal fade" id="add-server-modal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Add Server</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body p-0">
                    <form @submit.prevent="addServer">
                        <div class="p-3 pb-0">
                            <div class="form-floating mb-3">
                                <input type="text" class="form-control" id="name" v-model="name" required>
                                <label for="name">Name</label>
                            </div>
                            <div class="form-floating mb-3">
                                <input type="text" class="form-control" id="ip" v-model="ip" required>
                                <label for="ip">IP</label>
                            </div>
                            <div class="form-floating mb-3">
                                <input type="text" class="form-control" id="port" placeholder="25565" v-model="port" required>
                                <label for="port">Port</label>
                            </div>
                        </div>
                        <hr>
                        <div class="p-3 pt-0 d-grid text-center justify-content-none">
                            <button :disabled="this.loading" class="btn btn-primary"><font-awesome-icon v-if="this.loading" icon="spinner" spin/> Add Server</button>
                            <small>The server will first go through validation checks then you'll be redirected.</small>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { Modal } from "bootstrap";

    export default {
        data() {
            return {
                modal: null,
                name: null,
                ip: null,
                port: 25565
            }
        },
        mounted() {
            this.modal = new Modal(document.getElementById('add-server-modal'))
        },
        methods: {
            addServer() {
                if(this.loading) return;
                this.loading = true;

                this.axios.post('/v1/server/create', {
                    name: this.name,
                    ip: this.ip,
                    port: this.port
                }).then((response) => {
                    this.modal.hide();
                    this.$router.push(`/server/${response.data.hash}`)
                }).catch((error) => {
                    console.log(error)
                }).finally(() => {
                    this.loading = false;
                    this.name = null;
                    this.ip = null;
                    this.port = 25565;
                })
            }
        }
    }
</script>