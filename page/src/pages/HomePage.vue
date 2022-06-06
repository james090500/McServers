<template>
    <div>
        <hr />
        <table class="table table-borderless">
            <thead class="px-3 fw-bold server-header">
                <th class="col-1 align-middle">
                    <div>
                        <font-awesome-icon icon="ranking-star" /> Likes</div>
                </th>
                <th class="col-2 align-middle">
                    <div>
                        <font-awesome-icon icon="circle-info" /> Name</div>
                </th>
                <th class="col-6 align-middle">
                    <div>
                        <font-awesome-icon icon="server" /> Server</div>
                </th>
                <th class="col-1 align-middle">
                    <div>
                        <font-awesome-icon icon="users" /> Players</div>
                </th>
                <th class="col-1 align-middle">
                    <div>
                        <font-awesome-icon icon="gamepad" /> Version</div>
                </th>
                <th class="col-1 align-middle">
                    <div>
                        <font-awesome-icon icon="signal" /> Status</div>
                </th>
            </thead>
            <tbody>
                <ServerComponent class="server-component" v-for="server in servers" :key="server.name" :server_id="server.name" />
            </tbody>
        </table>
    </div>
</template>

<style scoped>
    .server-header {
        color: black;
        background: #42b7e6;
    }

    .server-header>div {
        white-space: pre;
    }

    .server-header>div>svg {
        margin-right: 0.5rem;
    }
</style>

<script>
    import ServerComponent from "@/components/ServerComponent.vue";
    export default {
        data() {
            return {
                servers: null,
            };
        },
        created() {
            this.axios.get("https://mcservers-api.james090500.workers.dev/v1/server/list").then((response) => {
                this.servers = response.data;
            });
        },
        components: {
            ServerComponent,
        },
    };
</script>