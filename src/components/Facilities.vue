<template>
  <v-container fluid>

    <v-alert v-if="errors && errors.length" :value="true" outline color="error" icon="warning">
    {{ errors }}
    </v-alert>
    
    <v-layout row wrap>

      <v-flex v-for="facility of facilities" :key="facility.identificador" xs12 md3>
        <v-card>

          <v-card-media v-bind:src="'https://www.jouer-club.cl/images/' + facility.avatar" height="200px">
            <v-container fill-height fluid>
              <v-layout fill-height>
                <v-flex xs12 align-end flexbox>
                  <span class="headline white--text" v-text="facility.nombre"></span><br>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-media>

          <v-card-actions>
            <v-icon slot="activator" dark color="black">keyboard_arrow_right</v-icon>  {{ facility.marca }}
            
            <v-spacer></v-spacer>

            <router-link :to="{ name: 'maintenances', params: { id: facility.identificador }}">
              <v-tooltip bottom>
                <v-icon slot="activator" dark color="accent">assessment</v-icon>
                <span>Ver Mantenciones</span>
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
            <span class="headline grey--text">Nuevo Recurso</span>
            </v-card-title>

            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>

                  <v-flex xs12>
                    <v-text-field v-model="nombre" label="Nombre" prepend-icon="label" required></v-text-field>
                  </v-flex>

                  <v-flex xs12>
                    <v-text-field v-model="marca" label="Marca" prepend-icon="shopping_cart" required></v-text-field>
                  </v-flex>

                  <v-flex xs12>
                    <v-text-field v-model="precio" label="Precio" prepend-icon="attach_money" required></v-text-field>
                  </v-flex>

                  <v-flex xs12>
                    <v-menu
                      ref="picker"
                      :close-on-content-click="false"
                      v-model="picker"
                      :nudge-right="40"
                      :return-value.sync="fechaCompra"
                      lazy
                      transition="scale-transition"
                      offset-y
                      full-width
                      min-width="290px"
                      >
                      <v-text-field
                        slot="activator"
                        v-model="fechaCompra"
                        label="Fecha de Compra"
                        prepend-icon="event"
                        readonly
                      ></v-text-field>
                      <v-date-picker v-model="fechaCompra" @input="$refs.picker.save(fechaCompra)"></v-date-picker>
                    </v-menu>
                  </v-flex>

                  <v-flex xs12>
                    <v-slider v-model="vida" prepend-icon="favorite" required value="2" thumb-label max="10" track-color="accent"></v-slider>
                  </v-flex>

                </v-layout>
              </v-container>
              <small>* campos requeridos</small>
            </v-card-text>

            <v-card-actions>
            <v-spacer></v-spacer>
              <v-btn color="error" flat @click.native="dialog = false">Cancelar</v-btn>
              <v-btn color="success" v-on:click="addFacility" flat @click.native="dialog = false">Guardar</v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
      <!-- END MODAL -->

    </v-layout> <!-- Courts End Card -->

    <!-- SNACKBAR SUCCESSFUL -->
    <v-snackbar v-model="snackbar_success">
      {{ notification }}
      <v-btn dark flat @click.native="snackbar_success = false" color="success">Ok</v-btn>
    </v-snackbar>
    <!-- SNACKBAR -->

    <!-- SNACKBAR ERRORS -->
    <v-snackbar v-model="snackbar_errors" :top="true" :multi-line="true" :right="true">
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
    nombre:null,
    marca:null,
    precio:null,
    fechaCompra: null,
    vida: null,
    facilities: [],

    dialog: false,
    picker: false,
    snackbar_success: false,
    snackbar_errors: false,     
    notification: null,
    errors: null  
  }),

  created() {
    this.getFacilities()
  },
  
  methods: {
    getFacilities() {
      HTTP.get("courts/"+this.$route.params.id+"/facilities")
      .then(successResponse => {
        this.facilities = successResponse.data.data
      })
      .catch(errorResponse => {
        this.errors = errorResponse.response.data.error
      })
    },

    addFacility() {
      HTTP.post(`facilities/`, {
        nombre: this.nombre,
        marca: this.marca,
        precio: this.precio,
        fechaCompra: this.fechaCompra,
        vida: this.vida,
        cancha: 1
      })
      .then(response => { //eliminamos
        this.getFacilities(); //listamos
        this.snackbar_success = true,
        this.notification = 'Recurso agregado Correctamente'
      })
      .catch(errorResponse => {
        this.snackbar_errors = true,
        alert(this.fechaCompra),
        this.errors = errorResponse.response.data.error,
        this.dialog = true
      })
    }

  }
}
</script>