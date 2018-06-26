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
      color="white"
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
        <v-badge left color="amber" overlap>
          <span slot="badge" class="white--text">{{ getWeather(weather/100) }}&deg;</span>
          <v-icon color="info">cloud</v-icon>
        </v-badge>
      </div>

      <div class="text-xs-center">
        <v-menu
          :close-on-content-click="false"
          :nudge-width="200"
          offset-x
          left
          open-on-hover
          transition="scale-transition"
        >
        <v-btn slot="activator" icon large>
          <v-avatar size="32px" tile>
            <img
              src="https://www.jouer-club.cl/images/logos/logo.png"
              alt="JouerCLUB"
            >
          </v-avatar>
        </v-btn>

          <v-card>
            <v-list>
              <v-list-tile avatar>
                <v-list-tile-avatar>
                  <img v-bind:src="'https://www.jouer-club.cl/images/' +user_auth['avatar']">
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title>{{ user_auth['alias'] }}</v-list-tile-title>
                  <v-list-tile-sub-title>Cluber Profile</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
            <v-divider></v-divider>
            <v-card-actions>
              <v-btn color="primary" block flat @click="logout">Cerrar Sesion</v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </div>

    </v-toolbar>

    <v-content>
       <v-container fluid grid-list-lg>
            <router-view></router-view>
       </v-container>
    </v-content>

  </v-app>
</template>

<script>
import axios from 'axios';
  export default {
    data: () => ({
      weather: [],
      errors: [],
      user_auth: JSON.parse(localStorage.getItem('auth_user')),
      dialog: false,
      drawer: null,
      items: [
        { icon: 'dashboard', text: 'Centro Deportivo', href: '#' },
        { icon: 'view_module', text: 'Canchas', href: '#' },
        { icon: 'extension', text: 'Servicios', href: '#' },
        {
          icon: 'keyboard_arrow_up',
          'icon-alt': 'keyboard_arrow_down',
          text: 'Más',
          model: true,
          children: [
            { icon: 'chat_bubble', text: 'Enviar feedback' },
            { icon: 'help', text: 'Ayuda' },
            { icon: 'phonelink', text: 'Descarga la app', href: 'https://www.jouer-club.cl/' }
          ]
        }
      ]
    }),
    props: {
      source: String
    },

    created(){
      this.getTemperature()
    },

    methods: {
      logout(){
        localStorage.removeItem('auth_user')
        this.$store.commit('SET_LAYOUT', 'login-layout')
      },

      getWeather(val){
        return val.toFixed()
      },

      getTemperature(){
        axios.get(`http://dataservice.accuweather.com/locations/v1/cities/geoposition/search`, {
          params: {
            q: '-33.405218,-70.6837653',
            apikey: "uQYPezmxO2wdd02z2GpSpRrhGs5MFICD",
          }
        })
        .then(response => {
          this.weather = response.data.GeoPosition.Elevation.Imperial.Value
        })
        .catch(e => {
          this.errors.push(e)
        })
      }
    }
  }
</script>