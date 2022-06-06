<template>
  <section class="row justify-content-center">
    <div class="col-10 col-lg-6">
      <div class="text-center">
        <h1>McServers</h1>
      </div>
      <div class="d-inline-flex w-100">
        <button type="submit" class="btn btn-primary me-2">
          <font-awesome-icon icon="home" />
        </button>
        <input
          type="text"
          class="form-control"
          placeholder="Play.CapeCraft.Net"
        />
      </div>
      <router-view v-slot="{ Component }">
        <transition ame="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </section>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>

<script></script>
