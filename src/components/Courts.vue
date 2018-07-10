<template>
  <v-container fluid>

    <v-alert v-if="errors && errors.length" :value="true" outline color="error" icon="warning">
    {{ errors }}
    </v-alert>

    <v-layout row wrap>

      <v-flex v-for="court of courts" :key="court.identificador" xs12 md4>
        <v-card>

          <v-card-media v-bind:src="'https://www.jouer-club.cl/images/' + court.avatar" height="200px">
            <v-container fill-height fluid>
              <v-layout fill-height>
                <v-flex xs12 align-end flexbox>
                  <span class="headline white--text" v-text="court.nombre"></span>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-media>

          <v-card-actions>

          <v-tooltip bottom v-if="court.estado == 'available'">
            <v-btn  slot="activator" outline color="info" @click="changeStatus(court.identificador, court.estado)">Habilitada</v-btn>
            <span>Inhabilitar Cancha</span>
          </v-tooltip>

          <v-tooltip bottom v-else>
            <v-btn  slot="activator" outline color="error" @click="changeStatus(court.identificador, court.estado)">Inhabilitada</v-btn>
            <span>Habilitar Cancha</span>
          </v-tooltip>

          <v-spacer></v-spacer>

          <router-link :to="{ name: 'facilities', params: { id: court.identificador }}">
            <v-tooltip bottom>
              <v-btn slot="activator" icon>
                <v-icon color="primary">extension</v-icon>
              </v-btn>
                <span>Ver Recursos</span>
            </v-tooltip>
          </router-link>

          <router-link :to="{ name: 'meetings', params: { id: court.identificador }}">
            <v-tooltip bottom>
              <v-btn slot="activator" icon>
                <v-icon color="accent">assessment</v-icon>
              </v-btn>
                <span>Ver Disponibilidad</span>
            </v-tooltip>
          </router-link>


          </v-card-actions>
        </v-card>
      </v-flex>

      <!-- MODAL -->
      <v-dialog v-model="dialog" persistent max-width="500px">
        <v-btn slot="activator" fab bottom right color="teal" dark fixed >
          <v-icon>add</v-icon>
        </v-btn>

        <v-form>
          <v-card>
            <v-card-title>
              <span class="headline grey--text">Nueva Cancha</span>
            </v-card-title>

            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12>
                    <v-text-field v-model="nombre" label="Nombre" prepend-icon="label" required></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
              <small>*campos requeridos</small>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error" flat @click.native="dialog = false">Cancelar</v-btn>
              <v-btn color="success" v-on:click="addCourt" flat @click.native="dialog = false">Guardar</v-btn>
            </v-card-actions>

          </v-card>
        </v-form>

      </v-dialog>
      <!-- END MODAL -->

    </v-layout> <!-- Courts End Card -->

    <!-- SNACKBAR SUCCESSFUL -->
    <v-snackbar v-model="snackbar_success" multi-line>
      {{ notification }}
      <v-btn dark flat @click.native="snackbar_success = false" color="success">Ok</v-btn>
    </v-snackbar>
    <!-- SNACKBAR -->

    <!-- SNACKBAR ERRORS -->
    <v-snackbar v-model="snackbar_errors" multi-line>
      <ul>
        <li v-for="error of errors" :key="error">
          {{ error[0] }}
        </li>
      </ul>
      <v-btn dark flat @click.native="snackbar_errors = false" color="error">Cerrar</v-btn>
    </v-snackbar>
    <!-- SNACKBAR -->

  </v-container>
</template>

<script>
import {HTTP} from '@/axios-common'
export default {
  data: () => ({
    nombre: null,
    avatar: null,
    status: null,
    courts: [],

    dialog: false,
    snackbar_success: false,
    snackbar_errors: false,     
    notification: null,
    errors: null  
  }),

  mounted() {
    this.getCourts()
  },

  beforeCreate() {
    if (!'auth_user' in localStorage) {
      this.$store.commit('SET_LAYOUT', 'login-layout')
      this.$router.push('/')
    }
  },

  methods: {
    getCourts() {
      var user = JSON.parse(localStorage.getItem('auth_user'))
      HTTP.get("sportfields/"+user['identificador']+"/courts", {
        params: {
        }
      })
      .then(successResponse => {
        this.courts = successResponse.data.data
      })
      .catch(errorResponse => {
        this.errors = errorResponse.response.data.error
      })
    },

    addCourt() {
      HTTP.post(`courts/`, {
        nombre: this.nombre,
        estado: 'available',
        recinto: 1
      })
      .then(successResponse => {
          this.getCourts();
          this.snackbar_success = true,
          this.notification = 'Cancha agregada correctamente'
      })
      .catch(errorResponse => {
        this.snackbar_errors = true,
        this.errors = errorResponse.response.data.error,
        this.dialog = true
      })
    },

    changeStatus(id, status){
      if (status == 'available') {
        HTTP.put(`courts/`+id, {
          estado: "notAvailable"
        })
        .then(successResponse => {
          this.getCourts();
          this.snackbar_success= true,
          this.notification = "Cancha Deshabilitada Correctamente"
        })
        .catch(errorResponse => {
          this.snackbar_errors = true,
          this.errors = errorResponse.response.data.error,
          this.dialog = true
        })

      } else {
        HTTP.put(`courts/`+id, {
          estado: "available"
        })
        .then(successResponse => {
          this.getCourts();
          this.snackbar_success= true,
          this.notification = "Cancha Habilitada Correctamente"
        })
        .catch(errorResponse => {
          this.snackbar_errors = true,
          this.errors = errorResponse.response.data.error,
          this.dialog = true
        })

      }
    }

  }
}
</script>
