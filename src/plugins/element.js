import Vue from 'vue'
import { Button } from 'element-ui'
import { Form, FormItem } from "element-ui";
import { Input} from "element-ui";
//导入Message组件
import {Message} from "element-ui";

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
//将Message组件挂载到Vue原型上
Vue.prototype.$message = Message
