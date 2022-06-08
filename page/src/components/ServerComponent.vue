<template>
    <tr class="mb-3 d-flex align-items-center text-center" v-if="server != null" :class="{ 'premium': server.hash == capecraft }">
        <td class="col-1 col-lg-1">
            <div v-if="server.hash == capecraft">
                <font-awesome-layers class="fa-2xl">
                    <font-awesome-icon icon="circle" />
                    <font-awesome-icon icon="star" transform="left-1 shrink-7" inverse />
                </font-awesome-layers>
            </div>
            <kbd v-else>{{ server.likes }}</kbd>
        </td>
        <td class="col-3 col-lg-2">
            <strong>
                <router-link :to="`/server/${server.hash}`">{{ server.name }}</router-link>
            </strong>
        </td>
        <td class="col-lg-4 d-none d-lg-block">
            <img :src="`${$baseUrl}/v1/server/${server.hash}/motd`" class="w-100"/>
            <div class="server-ip ps-2 text-start bg-info text-white">
                <span class="fw-bold"><font-awesome-icon icon="cube" class="me-2" />{{ server.ip }}</span>
                <button class="btn text-white float-end border-0 rounded-0 m-0" @click="copyIP">
                    <span v-if="!copied" ><font-awesome-icon icon="copy" class="me-1" />Copy</span>
                    <span v-else><font-awesome-icon icon="check" class="me-1" />Copied!</span>
                </button>
            </div>
        </td>
        <td class="col-3 col-lg-2">
            <span class="badge text-bg-warning">{{ server.query.players.online }}/{{ server.query.players.max }}</span>
        </td>
        <td class="col-3 col-lg-2">
            <span class="badge text-bg-primary text-wrap">{{ server.query.version.name }}</span>
        </td>
        <td class="col-2 col-lg-1">
            <span v-if="server.online" class="badge text-bg-success">Online</span>
            <span v-else class="badge text-bg-danger">Offline</span>
        </td>
    </tr>
</template>

<script>
    import useClipboard from 'vue-clipboard3'

    export default {
        data() {
            return {
                capecraft: "92d1f515c258ca2ef1e8e7a3c79f879d8a59d1304051ba0d440c0b59349f600a",
                server: null,
                copied: false,
            };
        },
        methods: {
            copyIP() {
                const { toClipboard } = useClipboard()
                toClipboard(this.server.ip).then(() => {
                    this.copied = true;
                    setTimeout(() => {
                        this.copied = false;
                    }, 2000)
                });
            },
        },
        created() {
            this.axios
                .get(`/v1/server/${this.server_id}`)
                .then((response) => {
                    this.server = response.data;
                });
        },
        props: {
            server_id: {
                type: String,
            },
        }
    };
</script>

<style scoped>
    .premium {
        background: rgb(255, 255, 219);
    }

    .server-ip>button {
        padding: 0 1rem;
        background: #3a9ec5;
    }

    .server-ip>button:hover {
        padding: 0 1rem;
        background: #3b88a7;
    }
</style>