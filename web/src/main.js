import { createApp } from 'vue'

import Cookies from 'js-cookie'

import ElementPlus from 'element-plus'
import locale from 'element-plus/lib/locale/lang/zh-cn' // 中文语言
import '@/assets/styles/index.scss' // global css
import '@/assets/styles/iconfont.css' // global css

import App from './App'
import store from './store'
import router from './router'
import directive from './directive' // directive

// 注册指令
import plugins from './plugins' // plugins
import { download } from '@/utils/request'

// svg图标
import 'virtual:svg-icons-register'
import SvgIcon from '@/components/SvgIcon'
import elementIcons from '@/components/SvgIcon/svgicon'

import './permission' // permission control

import { useDict } from '@/utils/dict'
import { parseTime, resetForm, addDateRange, handleTree, selectDictLabel, selectDictLabels } from '@/utils/sinosoft'

// 分页组件
import Pagination from '@/components/Pagination'
// 自定义表格工具组件
import RightToolbar from '@/components/RightToolbar'
// 富文本组件
import Editor from "@/components/Editor"
// 文件上传组件
import FileUpload from "@/components/FileUpload"
// 图片上传组件
import ImageUpload from "@/components/ImageUpload"
// 图片预览组件
import ImagePreview from "@/components/ImagePreview"
// 自定义树选择组件
import TreeSelect from '@/components/TreeSelect'
// 字典标签组件
import DictTag from '@/components/DictTag'
// 弹窗表格组件
import ElPriceInput from "@/components/ElPriceInput"
// 千分位换算输入框

import DialogTable  from "@/components/DialogTable"
import DialogTableMulti  from "@/components/DialogTableMulti"
import PriceInput  from "@/components/PriceInput"
// Vue3表单组件
// import * as  VForm3 from '@/components/vform/designer.umd.js'
// import '@/components/vform/designer.style.css'
import VForm3 from 'vform3-builds'  //引入VForm 3库
import 'vform3-builds/dist/designer.style.css'  //引入VForm3样式

const app = createApp(App)

// 全局方法挂载
app.config.globalProperties.useDict = useDict
app.config.globalProperties.download = download
app.config.globalProperties.parseTime = parseTime
app.config.globalProperties.resetForm = resetForm
app.config.globalProperties.handleTree = handleTree
app.config.globalProperties.addDateRange = addDateRange
app.config.globalProperties.selectDictLabel = selectDictLabel
app.config.globalProperties.selectDictLabels = selectDictLabels

// 全局组件挂载
app.component('DictTag', DictTag)
app.component('Pagination', Pagination)
app.component('TreeSelect', TreeSelect)
app.component('FileUpload', FileUpload)
app.component('ImageUpload', ImageUpload)
app.component('ImagePreview', ImagePreview)
app.component('RightToolbar', RightToolbar)
app.component('Editor', Editor)
app.component('DialogTable', DialogTable)
app.component('DialogTableMulti', DialogTableMulti)
app.component('PriceInput', PriceInput)
app.component('ElPriceInput', ElPriceInput)


app.use(router)
app.use(store)
app.use(plugins)
app.use(elementIcons)

app.use(VForm3)  //全局注册VForm 3(同时注册了v-form-designer和v-form-render组件)
app.component('svg-icon', SvgIcon)
directive(app)

// 使用element-plus 并且设置全局的大小
app.use(ElementPlus, {
  locale: locale,
  // 支持 large、default、small
  size: Cookies.get('size') || 'default'
})


app.mount('#app')
const ElementComponents = app._context.components;
ElementComponents.ElTable.props.border = { type: Boolean, default: true }
ElementComponents.ElTable.props.headerDragend  = {
  type: Function,
  default: ({ nw, ow, col, evt }) => {
    console.log(nw)
  }
};