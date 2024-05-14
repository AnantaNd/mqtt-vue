<template>
  <a-layout class="min-h-screen" id="layout-dashboard">
    <a-layout-sider
      style="background: #fff; position: fixed"
      width="250px"
      class="shadow-md z-50 fixed lg:block min-h-screen"
      :class="isOpen == true ? 'block' : 'hidden'"
    >
      <section>
        <a-menu class="px-2 flex flex-col gap-y-1">
          <a-menu-item v-for="menuItems in menuItems" :key="menuItems.key">
            <router-link
              :to="{ name: menuItems.redirect }"
              class="flex flex-row items-center gap-5 font-semibold px-2 rounded-md"
            >
              <span>{{ menuItems.name }}</span>
            </router-link>
          </a-menu-item>
        </a-menu>
      </section>
    </a-layout-sider>
    <a-layout>
      <a-layout-content class="pt-12 lg:pl-72 lg:pr-8 px-5 min-h-screen bg-background">
        <router-view />
      </a-layout-content>
      <a-layout-footer class="w-full relative bottom-0">
        <div class="lg:pl-64 lg:pr-8 lg:text-left text-center">
          <p>
            copyright
            <a href="" class="font-semibold">Megalos Cafe</a>
          </p>
        </div>
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<script>
export default {
  data() {
    return {
      menuItems: [
        {
          key: 1,
          name: 'Home',
          redirect: '',
          icon: 'house'
        }
      ],
      localData: null,
      isOpen: false
    }
  }
}
</script>
