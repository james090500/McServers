<template>
    <div class="row" v-if="server">
        <div class="col-4">
            <div class="card my-3 p-3">
                <div class="row">
                    <div class="col-2">
                        <img :src="server.query.favicon" class="w-full"/>
                    </div>
                    <div class="col">
                        <h4>{{server.ip}}<span v-if="server.port != '25565'">:{{server.port}}</span></h4>
                    </div>
                    <div class="col-2 text-right">
                        <button v-if="!liked" @click="likeServer" class="btn btn-outline-primary btn-sm">
                            <font-awesome-icon :icon="['far', 'thumbs-up']" />
                        </button>
                        <button v-else class="btn btn-primary btn-sm">
                            <font-awesome-icon icon="thumbs-up" />
                        </button>
                    </div>
                </div>
                <hr>
                <table class="table table-borderless">
                    <tr>
                        <td>Players</td>
                        <td><span class="badge text-bg-warning">{{ server.query.players.online }}/{{ server.query.players.max }}</span></td>
                    </tr>
                    <tr>
                        <td>Version</td>
                        <td><span class="badge text-bg-primary">{{ server.query.version.name }}</span></td>
                    </tr>
                    <tr>
                        <td>Status</td>
                        <td v-if="server.online"><span class="badge text-bg-success">Online</span></td>
                        <td v-else><span class="badge text-bg-danger">Offline</span></td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="col">
            <h1 class="text-center">{{server.name}}</h1>
            <div class="accordion">
                <div class="accordion-item">
                    <h2 class="accordion-header">
                    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne">
                        How do I join {{server.name}}?
                    </button>
                    </h2>
                    <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                    <div class="accordion-body">
                        Simply open up Minecraft, click "Multiplayer" then click "Direct Connect" and type the IP <kbd>{{server.ip}}<span v-if="server.port != '25565'">:{{server.port}}</span></kbd>
                    </div>
                    </div>
                </div>
                <div class="accordion-item">
                    <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo">
                        What version is {{server.name}}?
                    </button>
                    </h2>
                    <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                    <div class="accordion-body">
                        According to our automated data, the server version is <span class="badge text-bg-primary">{{ server.query.version.name }}</span>.
                        However, this information can be incorrect if the server owners have a plugin.
                    </div>
                    </div>
                </div>
                <div class="accordion-item">
                    <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree">
                        Where is {{server.name}} hosted?
                    </button>
                    </h2>
                    <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                    <div class="accordion-body">
                        {{server.name}} is hosted in COUNTRY //TODO
                    </div>
                    </div>
                </div>
                </div>
        </div>
    </div>
</template>

<style scoped>
    svg {
        font-size: 2rem;
    }
</style>

<script>
export default {
    data() {
        return {
            liked: false,
            server: null,
        };
    },
    methods: {
        copyIP() {
            this.$copyText(this.server.ip).then(() => {
                alert("Copied");
            });
        },
        likeServer() {
            this.axios.post(`/v1/server/${this.$route.params.hash}/like`);
            this.liked = true;
        }
    },
    created() {
        this.axios.get(`/v1/server/${this.$route.params.hash}`).then((response) => {
            this.server = response.data;
        });
    }
}
</script>