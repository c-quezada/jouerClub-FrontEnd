<template>
  <v-container fluid>    
  
    <v-layout row wrap>
      <v-flex xs12 md6>
        <v-card dark tile flat color="transparent">
          <v-card-text>

            <v-flex xs12>
              <v-alert :value="true" outline color="primary" icon="label_important">
                <span class="primary--text">Nombre: </span> 
                <span class="text-xs-right">{{ facility.nombre }}</span>
              </v-alert>
            </v-flex>

            <v-flex xs12>
              <v-alert :value="true" outline color="primary" icon="loyalty">
                <span class="primary--text">Marca: </span> 
                <span class="text-xs-right">{{ facility.marca }}</span>
              </v-alert>
            </v-flex>

            <v-flex xs12>
              <v-alert :value="true" outline color="primary" icon="attach_money">
                <span class="primary--text">Precio: </span> 
                <span class="text-xs-right">{{ facility.precio }}</span>
              </v-alert>
            </v-flex>

            <v-flex xs12>
              <v-alert :value="true" outline color="primary" icon="shopping_cart">
                <span class="primary--text">Fecha Compra: </span> 
                <span class="text-xs-right">{{ facility.fechaCompra }}</span>
              </v-alert>
            </v-flex>

          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 md6>
        <v-card dark tile flat color="primary">
          <v-card-text>GRAFICO ... PROXIMAMENTE</v-card-text>
        </v-card>
      </v-flex>

    </v-layout>

    <v-layout row wrap>
      <v-flex xs12>
        
      <v-data-table
        :headers="headers"
        :items="maintenances"
        :pagination.sync="pagination"
        :total-items="totalMaintenances"
        :loading="loading"
        class="elevation-1"
      >
        <template slot="items" slot-scope="props">
          <td>{{ props.item.identificador }}</td>
          <td class="text-xs-left">{{ props.item.observaciones }}</td>
          <td class="text-xs-center">{{ props.item.calificacion }}</td>
          <td class="text-xs-center">{{ props.item.fechaCreacion }}</td>
        </template>
      </v-data-table>

      </v-flex>

      
      <!-- MODAL -->
            <v-dialog v-model="dialog" persistent max-width="500px">

              <v-btn slot="activator" fab bottom right color="teal" dark fixed >
                <v-icon>add</v-icon>
              </v-btn>

              <v-form>
                  <v-card>
                    <v-card-title>
                      <span class="headline">Nueva Mantención</span>
                    </v-card-title>
                    <v-card-text>
                      <v-container grid-list-md>
                        <v-layout wrap>

                            <v-flex xs12>
                              <v-text-field
                                v-model="observaciones"
                                color="teal"
                                multi-line
                                required
                                :counter="200"
                                min="8"
                                :rules= "[
                                          val => (val || '').length > 0 || 'Este campo es requerido',
                                          val => val.length >= 10 || 'Min 10 caracteres',
                                          val => val.length <= 200 || 'Max 200 caracteres'
                                        ]"
                                >
                                <div slot="label">
                                  Observaciones <small>requerido *</small>
                                </div>
                              </v-text-field>
                            </v-flex>

                            <v-flex xs12>

                              <v-radio-group v-model="calificacion" :mandatory="false">
                                <v-radio
                                  label="Malas Condiciones"
                                  color="red"
                                  value="1"
                                ></v-radio>
                                <v-radio
                                  label="Regulares Condiciones"
                                  color="purple"
                                  value="2"
                                ></v-radio>
                                <v-radio
                                  label="Aceptables Condiciones"
                                  color="amber"
                                  value="3"
                                ></v-radio>
                                <v-radio
                                  label="Buenas Condiciones"
                                  color="cyan"
                                  value="4"
                                ></v-radio>
                                <v-radio
                                  label="Excelentes Condiciones"
                                  color="teal"
                                  value="5"
                                ></v-radio>
                              </v-radio-group>

                            </v-flex>

                        </v-layout>
                      </v-container>
                      <small>*campos requeridos</small>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="error" flat @click.native="dialog = false">Cancelar</v-btn>
                      <v-btn color="success" v-on:click="addMaintenance()" flat @click.native="dialog = false">Guardar</v-btn>
                    </v-card-actions>
                  </v-card>
              </v-form>
            </v-dialog>
        <!-- END MODAL -->

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

    </v-layout>
  </v-container>
</template>

<script>
import {HTTP} from '@/axios-common'
export default {
  data(){
    return {
      //  App 
      facility: "",
      date: null,
      errors: null,
      notification: null,
      calificacion: 4,
      observaciones: "",
      dialog: false,
      snackbar_success: false,
      snackbar_errors: false,

      //  Pagination
      totalMaintenances: 0,
      maintenances: [],
      loading: true,
      pagination: {
      rowsPerPage: 10
      },
      headers: [
      {
        text: 'ID',
        align: 'left',
        sortable: false,
        value: 'identificador'
      },
        { text: 'Observaciones', value: 'observaciones' },
        { text: 'Calificacion', value: 'calificacion' },
        { text: 'Fecha Mantencion', value: 'fechaCreacion' }
      ]
    }
  },

  watch: {
    pagination: {
      handler () {
        this.getDataFromApi()
        .then(data => {
          this.maintenances = data.items
          this.totalMaintenances = data.total
        })
      },
      deep: true
    }
  },

  mounted(){
    this.getDataFromApi()
    .then(data => {
      this.maintenances = data.items
      this.totalMaintenances = data.total
    }),
    this.getFacility()
  },

  beforeCreate() {
    if (!'auth_user' in localStorage) {
      this.$store.commit('SET_LAYOUT', 'login-layout')
      this.$router.push('/')
    }
  },

  methods: {
    getDataFromApi(){
      this.loading = true
      return new Promise((resolve, reject) => {
        const { sortBy, descending, page, rowsPerPage } = this.pagination

        let items = this.getMaintenances()
        const total = this.totalMaintenances

        if (this.pagination.sortBy) {
          items = items.sort((a, b) => {
            const sortA = a[sortBy]
            const sortB = b[sortBy]

            if (descending) {
              if (sortA < sortB) return 1
              if (sortA > sortB) return -1
              return 0
            } else {
              if (sortA < sortB) return -1
              if (sortA > sortB) return 1
              return 0
            }
          })
        }

        if (rowsPerPage > 0) {
          items = items.slice((page - 1) * rowsPerPage, page * rowsPerPage)
        }

      },
      setTimeout(() => {
        this.loading = false
        resolve({
          items,
          total
        })
      }, 1000))
    },

    getMaintenances(){
      HTTP.get("facilities/"+this.$route.params.id+"/maintenance", { amount: 50})
      .then(successResponse => {
        this.maintenances = successResponse.data.data
        this.totalMaintenances = successResponse.data.meta.pagination.total
      })
      .catch(errorResponse => {
        this.errors = errorResponse.response.data.error
      })
    },

    addMaintenance(){
      HTTP.post(`maintenances/`, {
        observaciones: this.observaciones,
        calificacion: this.calificacion,
        instalacion: this.$route.params.id
      })
      .then(successResponse => {
        this.getMaintenances();
        this.observaciones = null,
        this.snackbar_success = true,
        this.notification = 'Mantencion agregada correctamente'
      })
      .catch(errorResponse => {
        this.snackbar_errors = true,
        this.errors = errorResponse.response.data.error,
        this.dialog = true
      })
    },

    getFacility(){
      HTTP.get("facilities/"+this.$route.params.id)
      .then(successResponse => {
        this.facility = successResponse.data.data
      })
      .catch(errorResponse => {
        this.snackbar_errors = true,
        this.errors = errorResponse.response.data.error,
        this.dialog = true
      })
    },

    viewStatus(value){
      if (value == 'now') {
        return this.status[0]
      } if (value == 'pending') {
        return this.status[1]
      } else {
        return this.status[2]
      }
    }
  }
}
</script>