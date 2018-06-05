<template>
  <v-container fluid>
    <v-layout row>

      <v-flex xs12 md6 lg4>

      <v-flex>
        <v-card>
          <v-card-media
            src="/static/doc-images/court.jpg"
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

        <v-flex>
          <v-date-picker
            v-model="date"
            full-width
            :events="getMeetings"
          ></v-date-picker>
        </v-flex>

      </v-flex>

      <v-flex xs12 md6 lg8 order-lg2>

        <v-flex>
          <v-expansion-panel inset>
            <v-expansion-panel-content v-for="meeting in meetings" :key="meeting.identificador">
             
              <div slot="header" v-on:click="getParticipants(meeting.identificador)">
                    <v-chip color="primary" text-color="white">
                      <v-avatar>
                        <v-icon>check_circle</v-icon>
                      </v-avatar>
                      {{ viewStatus(meeting.estado).title }}
                    </v-chip>
                    Desde: {{ meeting.inicio}} / Hasta: {{ meeting.termino}} {{ meeting.identificador }}
              </div>

              <v-card>
                <v-card-text>

                  <v-expansion-panel inset>
                    <v-expansion-panel-content v-for="(participant,i) in participants" :key="i">
                      <div slot="header">

                          <v-chip>
                            <v-avatar>
                              <img src="https://randomuser.me/api/portraits/men/35.jpg" alt="trevor">
                            </v-avatar>
                            {{participant.alias}}
                          </v-chip>
                      </div>
                      <v-card>
                        <v-card-text class="transparent text-xs-center">
                          
                          <!-- EMAIL -->
                            <v-chip outline color="pink">
                              <v-avatar>
                                <v-icon>mail</v-icon>
                              </v-avatar>
                              {{ participant.correo }}
                            </v-chip>
                          <!-- / EMAIL-->

                          <!-- PHONE -->
                            <v-chip outline color="cyan">
                              <v-avatar>
                                <v-icon>phone</v-icon>
                              </v-avatar>
                              +{{ participant.celular }}
                            </v-chip>
                          <!-- / PHONE-->


                          <!-- JOIN US -->
                            <v-chip outline color="orange">
                              <v-avatar>
                                <v-icon>how_to_reg</v-icon>
                              </v-avatar>
                              {{ participant.fechaCreacion }}
                            </v-chip>
                          <!-- / JOIN US-->
                          
                        </v-card-text>
                      </v-card>
                    </v-expansion-panel-content>
                  </v-expansion-panel>

                </v-card-text>
              </v-card>

            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-flex>

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
      meetings: [],
      participants: [],
      court: [],
      count_meetings: [],
      errors: []
    }),

    created() {
        this.getMeetings(),
        this.getCourt()
    },

    methods: {
      getMeetings() {
        HTTP.get("courts/"+this.$route.params.id+"/meetings")
        .then(response => {
          this.meetings = response.data.data
          this.count_meetings = response.data.meta.pagination
          console.log(response.data.data);
        })
        .catch(e => {
          this.errors.push(e)
        })
      },

      getParticipants(id) {
        this.participants = null,
        HTTP.get('meetings/'+id+'/participants')
        .then(response => {
          this.participants = response.data.data
          console.log(response.data.data);
          
        })
        .catch(e => {
          this.errors.push(e)
        })
      },

      getCourt() {
        HTTP.get(`courts/`+this.$route.params.id, {
        })
        .then(response => {
          this.court = response.data.data
          console.log(response.data);
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


    },
  }
</script>
