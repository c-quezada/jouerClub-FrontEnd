<template>
  <v-container fluid>

    <v-alert v-if="errors && errors.length" :value="true" outline color="error" icon="warning">
    {{ errors }}
    </v-alert>
    
    <v-layout row wrap>

      <v-flex d-flex v-for="service of services" :key="service.identificador" xs12 md3>
        <v-card>

          <v-card-media v-bind:src="'https://www.jouer-club.cl/images/' + service.avatar" height="200px">
          </v-card-media>

          <v-card-actions>

            <v-icon slot="activator" dark color="black">keyboard_arrow_right</v-icon>  {{ service.nombre }}

            <v-spacer></v-spacer>

            <v-tooltip bottom>
              <v-btn slot="activator" icon @click="removeService(service.identificador)">
                <v-icon color="error">delete</v-icon>
              </v-btn>
                <span>Remover servicio</span>
            </v-tooltip>
          
          </v-card-actions>

        </v-card>
      </v-flex>

      <!-- MODAL -->
        <template>
          <v-layout row justify-center>
            <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
              <v-btn slot="activator" @click="getAllServices()" round fab bottom fixed right color="primary" dark>
                <v-icon>add</v-icon>
              </v-btn>
              <v-card>
                <v-toolbar dark color="primary">
                  <v-btn icon dark @click.native="dialog = false">
                    <v-icon>close</v-icon>
                  </v-btn>
                  <v-toolbar-title>Vincular Servicios</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-toolbar-items>
                    <v-btn dark flat @click.native="dialog = false">Cerrar</v-btn>
                  </v-toolbar-items>
                </v-toolbar>

                <template>
                  <v-container fluid grid-list-lg>
                  <v-layout row wrap>
                    <v-flex xs12 md3 v-for="generalService of allServices" :key="generalService.identificador">
                      <v-card>
                        <v-card-media v-bind:src="'https://www.jouer-club.cl/images/' + generalService.avatar" height="200px">
                        </v-card-media>

                        <v-card-actions>

                          <v-icon slot="activator" dark color="black">keyboard_arrow_right</v-icon>  {{ generalService.nombre }}

                          <v-spacer></v-spacer>

                          <v-tooltip bottom>
                            <v-btn slot="activator" icon @click="addService(generalService.identificador)">
                              <v-icon color="info">add</v-icon>
                            </v-btn>
                              <span>Vincular servicio</span>
                          </v-tooltip>
                        
                        </v-card-actions>

                      </v-card>
                    </v-flex>
                  </v-layout>
                  </v-container>
                </template>

              </v-card>
            </v-dialog>
          </v-layout>
        </template>
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
    services: [],
    allServices: [],

    dialog: false,
    picker: false,
    snackbar_success: false,
    snackbar_errors: false,     
    notification: null,
    errors: null  
  }),

  created() {
    this.getServices()
  },

  beforeCreate() {
    if (!'auth_user' in localStorage) {
      this.$store.commit('SET_LAYOUT', 'login-layout')
      this.$router.push('/')
    }
  },
  
  methods: {
    getServices() {
      HTTP.get("sportfields/"+this.$route.params.id+"/services")
      .then(successResponse => {
        this.services = successResponse.data.data
      })
      .catch(errorResponse => {
        this.errors = errorResponse.response.data.error
      })
    },

    getAllServices() {
      HTTP.get("services")
      .then(successResponse => {
        this.allServices = successResponse.data.data
      })
      .catch(errorResponse => {
        this.errors = errorResponse.response.data.error
      })
    },

    addService(service_id) {
      HTTP.post("sportfields/"+this.$route.params.id+"/addService/"+service_id)
      .then(successResponse => {
          this.getServices(),
          this.dialog = false,
          this.snackbar_success = true,
          this.notification = 'Servicio vinculado correctamente'
      })
      .catch(errorResponse => {
        this.snackbar_errors = true,
        this.errors = errorResponse.response.data.error,
        this.dialog = true
      })
    }, 

    removeService(service_id) {
      HTTP.post("sportfields/"+this.$route.params.id+"/removeService/"+service_id)
      .then(successResponse => {
          this.dialog = false,
          this.snackbar_success = true,
          this.getServices();
          this.notification = 'Servicio desvinculado correctamente'
      })
      .catch(errorResponse => {
        this.snackbar_errors = true,
        this.errors = errorResponse.response.data.error,
        this.dialog = true
      })
    }    
  }
}
</script>