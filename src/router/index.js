import Vue from 'vue'
import Router from 'vue-router'

import Courts from '@/components/Courts'
import Meetings from '@/components/Meetings'
import Facilities from '@/components/Facilities'
import Maintenances from '@/components/Maintenances'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'courts',
      component: Courts
    },
    {
      path: '/courts/:id/facilities',
      name: 'facilities',
      component: Facilities
    },
    {
      path: '/court/:id/meetings',
      name: 'meetings',
      component: Meetings
    },
    {
      path: '/facilities/:id/maintenances',
      name: 'maintenances',
      component: Maintenances
    }
  ]
})