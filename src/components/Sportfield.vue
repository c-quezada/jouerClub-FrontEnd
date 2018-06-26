<template>
  <v-layout row wrap>

    <v-flex xs12 md6>
      <v-alert
        :value="true"
        color="primary"
        icon="brightness_high"
        transition="scale-transition"
      >
        APERTURA: {{ sportfield.apertura }}
      </v-alert>
    </v-flex>

    <v-flex xs12 md6>
      <v-alert
        :value="true"
        color="primary"
        icon="brightness_low"
        transition="scale-transition"
      >
        CIERRE: {{ sportfield.cierre }}
      </v-alert>
    </v-flex>

    <v-flex xs12>

      <v-card class="card--flex-toolbar">
          <v-toolbar dense card prominent>
            <v-toolbar-title>

              <v-chip label color="primary" text-color="white">
                <v-icon left>label</v-icon>{{ sportfield.nombre }}
              </v-chip>              
              
            </v-toolbar-title>

            <v-spacer></v-spacer>

              <v-chip label color="primary" text-color="white">
                <v-icon left>place</v-icon>{{ sportfield.direccion }}
              </v-chip>
            
          </v-toolbar>
          <v-divider></v-divider>
          <v-card-text>

            <GmapMap
            :center="{lat: parseFloat(this.sportfield.latitud), lng: parseFloat(this.sportfield.longitud)}"
            :zoom="17"
            style="width: 100%; height: 400px"
            >
              <GmapMarker
                :position="{lat: parseFloat(this.sportfield.latitud), lng: parseFloat(this.sportfield.longitud)}"
              />
            </GmapMap>

          </v-card-text>
        </v-card>
    </v-flex>

  </v-layout>
</template>

<script>
import {HTTP} from '@/axios-common'
export default {
  data() {
    return {
      sportfield: []
    };
  },

  created() {
    this.getSportfield();
  },

  methods: {
    getSportfield() {
      var user = JSON.parse(localStorage.getItem('auth_user'))
      HTTP.get("clubers/"+user['identificador']+"/sportfields")
      .then(successResponse => {
        this.sportfield = successResponse.data.data[0]
      })
      .catch(errorResponse => {
        this.errors = errorResponse.response.data.error
      })
    }
  }
};
</script>
