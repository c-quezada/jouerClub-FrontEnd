<template>
  <v-container fluid>

    <span class="headline font-weight-thin primary--text">Recursos disponibles {{ court.nombre }}</span>
    <br><br>

    <v-alert v-if="errors && errors.length" :value="true" outline color="error" icon="warning">
    {{ errors }}
    </v-alert>
    
    <v-layout row wrap>

      <v-flex d-flex v-for="facility of facilities" :key="facility.identificador" xs12 md3>
        <v-card>

          <v-card-media v-bind:src="'https://www.jouer-club.cl/images/' + facility.avatar" height="200px">
            <v-container fill-height fluid>
              <v-layout fill-height>
                <v-flex xs12 align-end flexbox>
                  <span class="white--text">Nombre: </span>
                  <br><span class="headline white--text" v-text="facility.nombre"></span><br>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-media>

          <v-card-actions>
            <v-icon slot="activator" dark color="black">keyboard_arrow_right</v-icon>Marca:  {{ facility.marca }}
            
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
                    <v-text-field v-model="nombre" label="Nombre" prepend-icon="label" required :counter="20"
                    :rules= "[
                                  val => (val || '').length > 0 || 'Este campo es requerido',
                                  val => val.length >= 3 || 'Minimo 3 caracteres',
                                  val => val.length <= 20 || 'Maximo 20 caracteres'
                                ]"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12>
                    <v-text-field v-model="marca" label="Marca" prepend-icon="shopping_cart" required :counter="20"
                    :rules= "[
                                  val => (val || '').length > 0 || 'Este campo es requerido',
                                  val => val.length >= 3 || 'Minimo 3 caracteres',
                                  val => val.length <= 20 || 'Maximo 20 caracteres'
                                ]"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12>
                      <v-text-field
                        v-model="precio"
                        abel="Precio"
                        color="teal"
                        prepend-icon="attach_money"
                        required
                        type="number"
                        :counter="10"
                        min="3"
                        :rules= "[
                                  val => (val || '').length > 0 || 'Este campo es requerido',
                                  val => val.length >= 3 || 'Minimo 3 caracteres',
                                  val => val.length <= 10 || 'Maximo 10 caracteres'
                                ]"
                        >
                      </v-text-field>                    
                  </v-flex>

                  <v-flex xs12>
                    <v-dialog
                      ref="picker"
                      :close-on-content-click="false"
                      v-model="picker"
                      :return-value.sync="fechaCompra"
                      persistent
                      lazy
                      full-width
                      width="290px" 
                    >
                      <v-text-field
                        slot="activator"
                        v-model="fechaCompra"
                        label="Fecha de Compra"
                        prepend-icon="event"
                      ></v-text-field>
                      <v-date-picker v-model="fechaCompra" @input="$refs.picker.save(fechaCompra)">
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="modal = false">Cancel</v-btn>
                        <v-btn flat color="primary" @click="$refs.dialog.save(date)">OK</v-btn>
                      </v-date-picker>
                    </v-dialog>
                  </v-flex>

                  <br><br>
                  <v-flex xs12>
                    <span class="grey--text">Años de vida, según fabricante</span>
                    <v-slider v-model="vida" hint="Años de vida, segun fabricante" prepend-icon="favorite" required value="2" thumb-label max="10" track-color="amber"></v-slider>
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
    nombre:null,
    marca:null,
    precio:null,
    fechaCompra: null,
    vida: null,
    facilities: [],
    court: [],

    dialog: false,
    picker: false,
    snackbar_success: false,
    snackbar_errors: false,     
    notification: null,
    errors: []  
  }),

  created() {
    this.getCourtName()
    this.getFacilities()
  },

  beforeCreate() {
    if (!'auth_user' in localStorage) {
      this.$store.commit('SET_LAYOUT', 'login-layout')
      this.$router.push('/')
    }
  },
  
  methods: {
    getCourtName() {
      HTTP.get("courts/"+this.$route.params.id)
      .then(successResponse => {
        this.court = successResponse.data.data
        console.log(successResponse.data.data)
      })
      .catch(errorResponse => {
        this.errors = errorResponse.response.data.error
      })
    },
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
        cancha: this.$route.params.id
      })
      .then(successResponse => { //eliminamos
        this.getFacilities(); //listamos
        this.snackbar_success = true,
        this.errors = null,
        this.notification = 'Recurso agregado Correctamente'
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