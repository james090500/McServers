<template>
    <div>
        <div class="shadow rounded p-3 my-3">
            <p>
                McServers is <a href="https://github.com/james090500" target="_blank">my</a> submission to the <a href="https://challenge.developers.cloudflare.com/" target="_blank">Cloudflare Developer Challenge</a>!
                This website allows you to add a Minecraft Server and see basic information about it. It will be pinged every 10 minutes to ensure up to date information.
                This page is a Vue app running on CloudFlare Pages! It then uses a Worker to pull data from an API! You can view the full source code here: <a href="https://github.com/james090500/mcservers" target="_blank">https://github.com/james090500/mcservers</a>
                Lastly, you can add a new Minecraft server in the top right and also click a servers name and like it to rank it up!
            </p>
            <p>
                <strong>What's still being worked on</strong>
                <ul>
                    <li>Hoping to query using workers but cryptography may be awkward. Due to time limits I am using an API but working on it!</li>
                    <li>I also want these banner images to be using workers but image manipulation looks impossible at the moment.</li>
                    <li>Add a "Sign in with Microsoft" button so users can log in with their minecraft account. Prevents vote abuse and can allow "Owners" to claim "Servers"</li>
                </ul>
            </p>
        </div>
        <div class="table-responsive shadow rounded">
            <table class="table table-borderless">
                <thead class="bg-info">
                    <tr class="text-center d-flex align-items-center">
                        <th class="col-1 col-lg-1">
                            <div>
                                <font-awesome-icon icon="ranking-star" /> Likes
                            </div>
                        </th>
                        <th class="col-3 col-lg-2">
                            <div>
                                <font-awesome-icon icon="circle-info" /> Name
                            </div>
                        </th>
                        <th class="col-lg-4 d-none d-lg-block">
                            <div>
                                <font-awesome-icon icon="server" /> Server
                            </div>
                        </th>
                        <th class="col-3 col-lg-2">
                            <div>
                                <font-awesome-icon icon="users" /> Players
                            </div>
                        </th>
                        <th class="col-3 col-lg-2">
                            <div>
                                <font-awesome-icon icon="gamepad" /> Version
                            </div>
                        </th>
                        <th class="col-2 col-lg-1">
                            <div>
                                <font-awesome-icon icon="signal" /> Status
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <router-view v-slot="{ Component }">
                        <Transition name="fade" mode="out-in">
                            <component :is="Component" />
                        </Transition>
                    </router-view>
                    <!-- Premium Servers -->
                    <ServerComponent class="server-component" :server_id="`92d1f515c258ca2ef1e8e7a3c79f879d8a59d1304051ba0d440c0b59349f600a`" />
                    <!-- Other Servers -->
                    <TransitionGroup name="fade" mode="out-in">
                        <ServerComponent class="server-component" v-for="server in servers" :key="server.name" :server_id="server.name" />
                    </TransitionGroup>
                </tbody>
            </table>
        </div>
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
            this.axios.get("/v1/server/list").then((response) => {
                this.servers = response.data;
            });
        },
        components: {
            ServerComponent,
        },
    };
</script>