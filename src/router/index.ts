import { createRouter,createWebHashHistory} from "vue-router"

import cleanJson from '../views/CleanJson.vue'
import cleanXml from '../views/CleanXml.vue'
import portCheck from '../views/PortCheck.vue'
const routes = [
  {
    path: "/format/json",
    name: "json1",
    component: cleanJson
  },
  {
    path: "/format/xml",
    name: "xml1",
    component: cleanXml
  },
  {
    path: "/port/check",
    name: "port",
    component: portCheck
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: routes
})

export default router