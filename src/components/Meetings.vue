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
        <v-subheader>Encuentros Registrados</v-subheader>

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
                  <v-chip close>
                  <v-avatar>
                  <img src="https://randomuser.me/api/portraits/men/35.jpg" alt="trevor">
                  </v-avatar>
                  {{ participants.nombre }}
                  </v-chip>
                  </div>

                    
                </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>

      </v-flex>

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
    date: null,
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
