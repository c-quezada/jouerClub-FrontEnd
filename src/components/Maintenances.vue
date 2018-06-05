<template>
  <v-container fluid>    

    <v-layout row wrap>
        
       

          <v-flex xs12 md6 lg3>
            <v-alert :value="true" outline color="indigo" icon="label_important">
              {{ facility.nombre }}
            </v-alert>
          </v-flex>

          <v-flex xs12 md6 lg3>
            <v-alert :value="true" outline color="accent" icon="loyalty">
              {{ facility.marca }}
            </v-alert>
          </v-flex>

          <v-flex xs12 md6 lg3>
            <v-alert :value="true" outline color="primary" icon="attach_money">
              {{ facility.precio }}
            </v-alert>
          </v-flex>

          <v-flex xs12 md6 lg3>
            <v-alert :value="true" outline color="deep-purple" icon="shopping_cart">
              {{ facility.fechaCompra }}
            </v-alert>
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

                              <v-radio-group v-model="calificacion">
                                <v-radio
                                  label="Malas Condiciones"
                                  color="red"
                                  value="1"
                                ></v-radio>
                                <v-radio
                                  label="SHAAA"
                                  color="red darken-3"
                                  value="2"
                                ></v-radio>
                                <v-radio
                                  label="NO SE QUE PONER"
                                  color="indigo"
                                  value="3"
                                ></v-radio>
                                <v-radio
                                  label="EN ESTA HUEA"
                                  color="indigo darken-3"
                                  value="4"
                                ></v-radio>
                                <v-radio
                                  label="HERMANO"
                                  color="orange"
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
      <v-snackbar v-model="snackbar_success" :multi-line="true" :color="primary">
        {{ text }}
        <v-btn dark flat @click.native="snackbar_success = false" color="success">Ok</v-btn>
      </v-snackbar>
      <!-- SNACKBAR -->

      <!-- SNACKBAR ERRORS -->
      <v-snackbar v-model="snackbar_errors" :multi-line="true" :color='error'>
        {{ text }}
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
      errors: [null],
      calificacion: 3,
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
      HTTP.get("facilities/"+this.$route.params.id+"/maintenance")
      .then(response => {
        this.maintenances = response.data.data
        this.totalMaintenances = response.data.meta.pagination.total
        console.log(response.data.meta.pagination);
      })
      .catch(e => {
        this.errors.push(e)
      })
    },

    addMaintenance(){
      HTTP.post(`maintenances/`, {
        observaciones: this.observaciones,
        calificacion: this.calificacion,
        instalacion: this.$route.params.id
      })
      .then(response => {
        this.getMaintenances();
        this.observaciones = null,
        this.snackbar_success = true,
        this.text = 'Mantencion agregada correctamente'
      })
      .catch(errors => {
        this.snackbar_errors = true,
        this.text = errors.response.data.error.observaciones[0],
        this.dialog = true
      })
    },

    getFacility(){
      HTTP.get("facilities/"+this.$route.params.id)
      .then(response => {
        this.facility = response.data.data
        console.log(response.data.data);
      })
      .catch(e => {
        this.errors.push(e)
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