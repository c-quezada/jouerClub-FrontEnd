<template>
  <v-app id="inspire">
    <v-navigation-drawer
      :clipped="$vuetify.breakpoint.lgAndUp"
      v-model="drawer"
      fixed
      app
    >
      <v-list dense>
        <template v-for="item in items">
          <v-layout
            v-if="item.heading"
            :key="item.heading"
            row
            align-center
          >
          </v-layout>
          <v-list-group
            v-else-if="item.children"
            v-model="item.model"
            :key="item.text"
            :prepend-icon="item.model ? item.icon : item['icon-alt']"
            append-icon=""
          >
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ item.text }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile
              v-for="(child, i) in item.children"
              :key="i"
            >
              <v-list-tile-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ child.text }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
          <v-list-tile v-else :key="item.text">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ item.text }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      color="transparent"
      dark
      app
      fixed
    >
      <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
        <v-toolbar-side-icon @click.stop="drawer = !drawer" class="teal--text"></v-toolbar-side-icon>
        <span class="hidden-sm-and-down teal--text">Cluber Dashboard</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>

        <div text-xs-center>
          <v-badge left color="accent" overlap>
            <span slot="badge">10&deg;</span>
            <v-icon large color="grey lighten-2">cloud</v-icon>
          </v-badge>
       </div>

      <v-btn icon large>
        <v-avatar size="32px" tile>
          <img
            src="https://www.jouer-club.cl/images/logos/logo.png"
            alt="JouerCLUB"
          >
        </v-avatar>
      </v-btn>
    </v-toolbar>

    <v-content>
       <v-container fluid grid-list-lg>
            <router-view></router-view>
       </v-container>
    </v-content>

  </v-app>
</template>

<script>
  export default {
    data: () => ({
      dialog: false,
      drawer: null,
      items: [
        { icon: 'dashboard', text: 'Estadisticas', href: '#' },
        { icon: 'view_module', text: 'Canchas', href: '#' },
        {
          icon: 'keyboard_arrow_up',
          'icon-alt': 'keyboard_arrow_down',
          text: 'Más',
          model: true,
          children: [
            { icon: 'settings', text: 'Configuraciones' },
            { icon: 'chat_bubble', text: 'Enviar feedback' },
            { icon: 'help', text: 'Ayuda' },
            { icon: 'phonelink', text: 'Descarga la app', href: 'https://www.jouer-club.cl/' }
          ]
        }
      ]
    }),
    props: {
      source: String
    }
  }
</script>