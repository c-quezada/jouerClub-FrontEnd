import Vue from 'vue'
import Router from 'vue-router'

import Courts from '@/components/Courts'
import Services from '@/components/Services'
import Meetings from '@/components/Meetings'
import Facilities from '@/components/Facilities'
import Maintenances from '@/components/Maintenances'
import Sportfield  from '@/components/Sportfield'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'courts',
      component: Courts
    },
    {
      path: '/sporfields/:id/services',
      name: 'services',
      component: Services
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
    },
    {
      path: '/my-sportfield',
      name: 'my-sportfield',
      component: Sportfield
    }
  ]
})