<template>
    <section class="row justify-content-center">
        <div class="col-10 col-lg-10">
            <div class="shadow rounded p-3 mt-3">
                <div class="text-center">
                    <h1>McServers</h1>
                </div>
                <div class="d-inline-flex w-100">
                    <button type="submit" class="btn btn-primary me-2" @click="$router.push(`/`)">
                        <font-awesome-icon icon="home" />
                    </button>
                    <input type="text" class="form-control" placeholder="Play.CapeCraft.Net" />
                    <button type="submit" class="btn btn-primary ms-2" data-bs-toggle="modal" data-bs-target="#add-server-modal">
                        <font-awesome-icon icon="plus" />
                    </button>
                </div>
            </div>
            <router-view v-slot="{ Component }">
                <Transition name="fade" mode="out-in">
                    <component :is="Component" />
                </Transition>
            </router-view>
        </div>
        <AddServerModal/>
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

<script>
import AddServerModal from '@/components/AddServerModal.vue'

export default {
    components: {
        AddServerModal
    }
}
</script>