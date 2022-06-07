<template>
  <tr class="mb-3" v-if="server != null" :class="{ premium: server.hash == capecraft }">
    <td class="col-1 text-center align-middle">
      <div v-if="server.hash == capecraft">
        <font-awesome-layers class="fa-2xl">
          <font-awesome-icon icon="circle" />
          <font-awesome-icon icon="star" transform="left-1 shrink-7" inverse />
        </font-awesome-layers>
      </div>
      <kbd v-else>{{ server.likes }}</kbd>
    </td>
    <td class="col-2 align-middle">
      <strong><router-link :to="`/server/${server.hash}`">{{ server.name }}</router-link></strong>
    </td>
    <td class="col-6 align-middle">
      <!-- <img :src="server.banner" class="w-full" /> -->
      <img :src="server.query.favicon" class="w-full"/>
      <img src="https://placeholder.pics/svg/468x60" class="w-full"/>
      <div class="server-ip">
        <span
          ><font-awesome-icon icon="cube" class="me-2" />{{ server.ip }}</span
        >
        <button @click="copyIP">
          <font-awesome-icon icon="copy" class="me-1" />Copy
        </button>
      </div>
    </td>
    <td class="col-1 text-center align-middle">
      <span class="badge text-bg-warning">{{ server.query.players.online }}/{{ server.query.players.max }}</span>
    </td>
    <td class="col-1 text-center align-middle">
      <span class="badge text-bg-primary">{{ server.query.version.name }}</span>
    </td>
    <td class="col-1 text-center align-middle">
      <span v-if="server.online" class="badge text-bg-success">Online</span>
      <span v-else class="badge text-bg-danger">Offline</span>
    </td>
  </tr>
</template>

<script>
export default {
  data() {
    return {
      capecraft: "92d1f515c258ca2ef1e8e7a3c79f879d8a59d1304051ba0d440c0b59349f600a",
      server: null,
    };
  },
  methods: {
    copyIP() {
      this.$copyText(this.server.ip).then(() => {
        alert("Copied");
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
  },
};
</script>

<style>
.premium {
  background: rgb(255, 255, 219);
}

.server-ip {
  padding-left: 0.5rem;
  text-align: left;
  display: block;
  color: #fff;
  background: #42b7e6;
  width: 532px;
}

.server-ip > span {
  font-weight: bold;
}

.server-ip > button {
  color: #fff;
  transition: 0.25s;
  float: right;
  padding: 0 1rem;
  margin: 0;
  border: 0;
  background: #3a9ec5;
}

.server-ip > button:hover {
  background: #3b88a7;
}
</style>
