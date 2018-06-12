<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-form>
              <v-card class="elevation-12">
                <v-toolbar dark color="teal">
                  <v-toolbar-title>Cluber Dashboard</v-toolbar-title>
                  <v-spacer></v-spacer>
                </v-toolbar>
                <v-card-text>
                    <v-text-field v-model="email" prepend-icon="person" label="Correo" type="text"></v-text-field>
                    <v-text-field v-model="password" prepend-icon="lock" label="Contraseña" type="password"></v-text-field>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="teal" flat class="white--text" @click="login">Ingresar</v-btn>
                </v-card-actions>
              </v-card>
            </v-form>
          </v-flex>
        </v-layout>

        <!-- SNACKBAR ERRORS -->
        <v-snackbar v-model="snackbar_errors" :multi-line="true">
          {{ notification }}
          <v-btn dark flat @click.native="snackbar_errors = false" color="error">Cerrar</v-btn>
        </v-snackbar>
        <!-- SNACKBAR -->

      </v-container>
    </v-content>
  </v-app>
</template>

<script>
//@click="setLayout('app-layout')"
import {HTTP} from '@/axios-common'
export default {
  data(){
    return {
      email: null,
      password: null,
    
      drawer: null,
      dialog: false,
      snackbar_errors: false,     
      notification: null
    }
  },
  methods: {
    login(){
      HTTP.post('login', {
        correo: this.email,
        contraseña: this.password
      })
      .then(response => {
        localStorage.setItem('auth_user', JSON.stringify(response.data.data));
        this.$store.commit('SET_LAYOUT', 'app-layout')
      })
      .catch(errorResponse => {
        this.snackbar_errors = true,
        this.notification = errorResponse.response.data.error,
        this.dialog = true
      })
    }

  },

  props: {
    source: String
  }
}
</script>