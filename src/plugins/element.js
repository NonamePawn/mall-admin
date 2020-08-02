import Vue from 'vue'
//导入按钮组件
import { Button } from 'element-ui'
//导入表单组件
import { Form, FormItem } from "element-ui";
//导入输入框组件
import { Input} from "element-ui";
//导入Message组件
import {Message} from "element-ui";
//导入布局组件
import {Container, Header, Aside, Main} from "element-ui";
//导入菜单组件
import {Menu, MenuItem, Submenu} from "element-ui";
//导入面包屑组件
import {Breadcrumb, BreadcrumbItem} from "element-ui";
//导入卡片组件
import {Card} from "element-ui";
//导入栅格系统组件
import {Row, Col} from "element-ui";
//导入表格模块
import {Table, TableColumn} from "element-ui";
//导入开关组件
import {Switch} from "element-ui";
//导入文字提示组件
import {Tooltip} from "element-ui";
//导入分页组件
import {Pagination} from "element-ui";
//导入对话框组件
import {Dialog} from "element-ui";
//导入弹框组件
import {MessageBox} from "element-ui";
//导入标签组件
import {Tag} from "element-ui";
//导入树形组件
import {Tree} from "element-ui";
//导入选择器组件
import {Select, Option} from "element-ui";
//导入级联选择器
import {Cascader} from "element-ui";
//导入警告组件
import {Alert} from "element-ui";
//导入标签页
import {Tabs, TabPane} from "element-ui";

//注册组件
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Submenu)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)


//将Message组件挂载到Vue原型上
Vue.prototype.$message = Message
//将MessageBox组件挂载到Vue原型上
Vue.prototype.$confirm = MessageBox.confirm
