<template>
  <v-container fluid>
    <v-layout row>
      
      <!-- Court and Calendar -->
      <v-flex xs12 lg5>
        
        <!-- Court Card -->
        <v-flex xs12>
          <v-card>
            <v-card-media
              v-bind:src="'https://www.jouer-club.cl/images/' + court.avatar"
              height="200px"
              >
            </v-card-media>

            <v-card-title primary-title>
              <div>
                <div class="headline">CANCHA: {{ court.nombre }}</div>
                <span class="grey--text">PARTIDOS JUGADOS: {{ count_meetings.total }}</span>
              </div>
            </v-card-title>

            <v-card-actions>
              <router-link :to="{ name: 'facilities', params: { id: this.$route.params.id }}">
              <v-btn flat color="accent">Ver Recursos</v-btn>
              </router-link>
            </v-card-actions>

          </v-card>
        </v-flex>

        <!-- Picker -->
        <v-flex xs12>
          <v-date-picker
            ref="picker"
            v-model="date"
            full-width
          ></v-date-picker>
        </v-flex>

      </v-flex>


      <!-- Meetings -->
      <v-flex xs12 l7>
        <v-subheader class="primary--text">Encuentros Registrados</v-subheader>

        <v-alert v-if="errors && errors.length" :value="true" outline color="error" icon="warning">
        {{ errors }}
        </v-alert>

        <v-expansion-panel focusable>
          <v-expansion-panel-content v-for="(meeting, index) in meetings" :key="index">
            <div slot="header" v-on:click="getParticipants(meeting.identificador)">
              <span class="primary--text">Creado por: </span> {{ meeting.creador }}
              <v-divider></v-divider>
              <span class="success--text">Inicio:</span> <span class="grey--text"> {{ meeting.inicio }} </span>
              <span class="error--text">Termino:</span> <span class="grey--text"> {{ meeting.termino }} </span>
            </div>
            <v-card>
                <v-card-text class="grey lighten-3">

                  <div class="text-xs-center" v-for="(user, index) in participants" :key="index">
                    <v-chip outline class="primary" v-on:click="getUser(user.identificador)">
                      <v-avatar>
                      <img src="https://www.jouer-club.cl/images/logos/logo.png" alt="trevor">
                      </v-avatar>
                      <span class="primary--text">{{ user.alias }}</span>
                    </v-chip>
                  </div>

                    
                </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>

      </v-flex>
    </v-layout>

    <v-layout row justify-center>
      <v-dialog v-model="dialog"  max-width="500">
      
        <v-card>
          <v-card-media src="https://www.jouer-club.cl/images/logos/logo.png" height="300px">
            <v-layout column class="media">
              <v-spacer></v-spacer>
              <v-card-title class="white--text pl-5 pt-5">
                <div class="display-1 pl-5 pt-5">{{ userInfo.alias }}</div>
              </v-card-title>
            </v-layout>
          </v-card-media>
          <v-list two-line>

            <v-list-tile>
              <v-list-tile-action>
                <v-icon color="primary">phone</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ userInfo.celular }}</v-list-tile-title>
                <v-list-tile-sub-title>Móvil</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-divider inset></v-divider>

            <v-list-tile>
              <v-list-tile-action>
                <v-icon color="primary">mail</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ userInfo.correo }}</v-list-tile-title>
                <v-list-tile-sub-title>Correo</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-divider inset></v-divider>

            <v-list-tile>
              <v-list-tile-action>
                <v-icon color="primary">input</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ userInfo.fechaCreacion }}</v-list-tile-title>
                <v-list-tile-sub-title>Se unió</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

          </v-list>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click.native="dialog = false">Cerrar</v-btn>
          </v-card-actions>

        </v-card>

      </v-dialog>
    </v-layout>

  </v-container>
</template>

<script>
import {HTTP} from '@/axios-common'
export default {
  data: () => ({
    status: [
      { color: "color='success'", title: 'En Curso' },
      { color: "color='accent'", title: 'Proximo' },
      { color: "color='info'", title: 'Finalizado' }      
    ],
    dialog: false,
    date: null,
    userInfo: [],
    court: [],
    meetings: [],
    participants: [],
    count_meetings: [],
    errors: []
  }),

  created() {
    this.getCourt(),
    this.getMeetings()
  },

  methods: {
    getCourt() {
      HTTP.get(`courts/`+this.$route.params.id, {
      })
      .then(response => {
        this.court = response.data.data
      })
      .catch(errorResponse => {
        this.errors = errorResponse.response.data.error
      })
    },

    getMeetings() {
      HTTP.post("courts/"+this.$route.params.id+"/meetings")
      .then(successResponse => {
        this.meetings = successResponse.data.data
        this.count_meetings = successResponse.data.meta.pagination
      })
      .catch(errorResponse => {
        this.errors = errorResponse.response.data.error
      })
    },

    getParticipants(id) {
      this.participants = null,
      HTTP.get('meetings/'+id+'/participants')
      .then(response => {
        this.participants = response.data.data
      })
      .catch(errorResponse => {
        this.errors = errorResponse.response.data.error
      })
    },

    getUser(id) {
      HTTP.get('users/'+id)
      .then(response => {
        this.userInfo = response.data.data
        this.dialog = true
      })
      .catch(errorResponse => {
        this.errors = errorResponse.response.data.error
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
