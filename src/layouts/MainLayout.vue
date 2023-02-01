<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-white">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
          class="text-dark"
        />

        <q-toolbar-title class="text-dark"
          ><span class="gt-sm">{{ $route.matched[1].meta.title }}</span></q-toolbar-title
        >

        <!-- <div>Quasar v{{ $q.version }}</div> -->
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-dark">
      <h6 class="no-margin text-center q-pt-md text-white">Travel Admin</h6>
      <q-scroll-area style="height: calc(100% - 64px)">
        <q-list class="text-white menu-items">
          <template v-for="(item, index) in route_list">
            <template v-if="item.children">
              <q-expansion-item
                expand-separator
                :icon="item.icon"
                :label="item.label"
                :key="index"
                group="menu"
                :default-opened="check_open_default(item)"
              >
                <div class="q-pl-md">
                  <q-item
                    v-for="(children, index) in item.children"
                    :key="index"
                    :to="`/${children.route}`"
                    class="menu-item"
                    @click="link = item.route"
                    clickable
                    v-ripple
                    active-class="active-menu-link item-rounded-borders shadow-3"
                    exact
                    :disable="children.disable"
                  >
                    <q-item-section>{{ children.label }}</q-item-section>
                  </q-item>
                </div>
              </q-expansion-item>
            </template>
            <template v-else>
              <q-item
                :key="index"
                clickable
                v-ripple
                :to="`/${item.route}`"
                @click="link = item.route"
                class="menu-item"
                active-class="active-menu-link item-rounded-borders shadow-3"
                exact
              >
                <q-item-section avatar>
                  <q-icon :name="item.icon" />
                </q-item-section>
                <q-item-section> {{ item.label }} </q-item-section>
              </q-item>
            </template>
          </template>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: "MainLayout",
  data() {
    return {
      leftDrawerOpen: false,
      route_list: [
        {
          label: "Aplly Requests",
          icon: "groups",
          route: "",
        },
        // {
        //   label: "Requests",
        //   icon: "add",
        //   route: "test",
        // },
      ],
    };
  },
  created() {},
  methods: {
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },
    check_open_default(item) {
      let find_route = item.children.filter((x) => `/${x.route}` == this.$route.path);
      if (find_route.length > 0) {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>
