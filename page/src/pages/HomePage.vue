<template>
  <div>
    <hr />
    <div class="table-responsive">
      <table class="table table-borderless">
        <thead class="px-3 fw-bold server-header">
          <th class="col-1 align-middle">
            <div><font-awesome-icon icon="ranking-star" /> Rank</div>
          </th>
          <th class="col-2 align-middle">
            <div><font-awesome-icon icon="circle-info" /> Name</div>
          </th>
          <th class="col-6 align-middle">
            <div><font-awesome-icon icon="server" /> Server</div>
          </th>
          <th class="col-1 align-middle">
            <div><font-awesome-icon icon="users" /> Players</div>
          </th>
          <th class="col-1 align-middle">
            <div><font-awesome-icon icon="gamepad" /> Version</div>
          </th>
          <th class="col-1 align-middle">
            <div><font-awesome-icon icon="signal" /> Status</div>
          </th>
        </thead>
        <tbody>
          <MinecraftServer
            v-for="server in servers"
            :key="server.name"
            :server_id="server.name"
          />
          <tr style="height: 1rem"></tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import MinecraftServer from "@/components/MinecraftServer.vue";
export default {
  data() {
    return {
      servers: null,
    };
  },
  created() {
    this.axios.get("http://localhost:8787/v1/server/list").then((response) => {
      this.servers = response.data;
    });
  },
  components: {
    MinecraftServer,
  },
};
</script>

<style>
.server-header {
  color: black;
  background: #42b7e6;
}

.server-header > div {
  white-space: pre;
}

.server-header > div > svg {
  margin-right: 0.5rem;
}
</style>
