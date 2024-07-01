<template>
  <div v-loading="isView" class="flow-containers" :class="{ 'view-mode': isView }">
    <el-container style="height: 100%">
      <el-header style="border-bottom: 1px solid rgb(218 218 218);height: auto;padding-left:0">
        <div style="display: flex; padding: 10px 0; justify-content: space-between;">
          <div>
            <el-upload action="" :before-upload="openBpmn" style="margin-right: 10px; display:inline-block;">
              <el-tooltip effect="dark" content="加载xml" placement="bottom">
                <el-button icon="FolderOpened" />
              </el-tooltip>
            </el-upload>
            <el-tooltip effect="dark" content="新建" placement="bottom">
              <el-button icon="CirclePlus" @click="newDiagram" />
            </el-tooltip>
            <el-tooltip effect="dark" content="自适应屏幕" placement="bottom">
              <el-button icon="Rank" @click="fitViewport" />
            </el-tooltip>
            <el-tooltip effect="dark" content="放大" placement="bottom">
              <el-button icon="ZoomIn" @click="zoomViewport(true)" />
            </el-tooltip>
            <el-tooltip effect="dark" content="缩小" placement="bottom">
              <el-button icon="ZoomOut" @click="zoomViewport(false)" />
            </el-tooltip>
            <el-tooltip effect="dark" content="后退" placement="bottom">
              <el-button icon="Back" @click="modeler.get('commandStack').undo()" />
            </el-tooltip>
            <el-tooltip effect="dark" content="前进" placement="bottom">
              <el-button icon="Right" @click="modeler.get('commandStack').redo()" />
            </el-tooltip>
          </div>
          <div>
            <el-button icon="View" @click="showXML">查看xml</el-button>
            <el-button icon="Download" @click="saveXML(true)">下载xml</el-button>
            <el-button icon="Picture" @click="saveImg('svg', true)">下载svg</el-button>
            <el-button type="primary" @click="save">保存模型</el-button>
            <el-button type="danger" @click="goBack">关闭</el-button>
          </div>
        </div>
      </el-header>
      <!-- 流程设计页面 -->
      <el-container style="align-items: stretch">
        <!-- 流程画布 -->
        <el-main style="padding: 0;">
          <div ref="canvas" class="canvas" />
        </el-main>

        <!--流程设计器-->
        <designer v-if="loadCanvas"></designer>
      </el-container>
    </el-container>
  </div>
</template>

<script setup name="BpmnModel">
// 汉化
import customTranslate from './customPanel/customTranslate'
import Modeler from 'bpmn-js/lib/Modeler'
import Designer from './designer.vue'
import getInitStr from './flowable/init'
import {StrUtil} from '@/utils/StrUtil'
// 引入flowable的节点文件
import FlowableModule from './flowable/flowable.json'
import customControlsModule from './customPanel'
import useModelerStore from '@/store/modules/modeler'
const modelerStore = useModelerStore()
import {markRaw} from "@vue/reactivity";

const route = useRoute();
const { proxy } = getCurrentInstance();

const modeler = ref(null);
const zoom = ref(1);

// 当前组件渲染然后再加载canvas
const loadCanvas = ref(false);

/** 组件传值  */
const props = defineProps({
  xml: {
    type: String,
    default: ''
  },
  isView: {
    type: Boolean,
    default: false
  },
});

const emit = defineEmits(['showXML','save'])

/** 传值监听 */
watch(() => props.xml, newVal => {
      if (StrUtil.isNotBlank(newVal)) {
        createNewDiagram(newVal)
      } else {
        newDiagram()
      }
    }, {immediate: true}
)

/** 创建bpmn 实例 */
onMounted(() => {
  const modeler = new Modeler({
    container: proxy.$refs.canvas,
    additionalModules: [
      customControlsModule,
      { //汉化
        translate: ['value', customTranslate]
      },
    ],
    moddleExtensions: {
      flowable: FlowableModule
    }
  })
  // 注册 modeler 相关信息
  modelerStore.setModeler(markRaw(modeler));
  modelerStore.setModules('moddle', markRaw(modeler.get('moddle')));
  modelerStore.setModules('modeling', markRaw(modeler.get('modeling')));
  modelerStore.setModules('eventBus', markRaw(modeler.get('eventBus')));
  modelerStore.setModules('bpmnFactory', markRaw(modeler.get('bpmnFactory')));
  modelerStore.setModules('elementFactory', markRaw(modeler.get('elementFactory')));
  modelerStore.setModules('elementRegistry', markRaw(modeler.get('elementRegistry')));
  modelerStore.setModules('selection', markRaw(modeler.get('selection')));
  modelerStore.setModules('canvas', markRaw(modeler.get('canvas')));
  // 直接点击新建按钮时,进行新增流程图
  if (StrUtil.isBlank(props.xml.value)) {
    newDiagram()
  } else {
    createNewDiagram(props.xml.value)
  }
})

// 根据默认文件初始化流程图
function newDiagram() {
  createNewDiagram(getInitStr())
}

// 根据提供的xml创建流程图
async function createNewDiagram(data) {
  // 将字符串转换成图显示出来
  // data = data.replace(/<!\[CDATA\[(.+?)]]>/g, '&lt;![CDATA[$1]]&gt;')
  if (StrUtil.isNotBlank(modelerStore.getModeler)) {
    data = data.replace(/<!\[CDATA\[(.+?)]]>/g, function (match, str) {
      return str.replace(/</g, '&lt;')
    })
    try {
      await modelerStore.getModeler.importXML(data)
      fitViewport()
    } catch (err) {
      console.error(err.message, err.warnings)
    }
  }
}

// 让图能自适应屏幕
function fitViewport() {
  zoom.value = modelerStore.getCanvas.zoom('fit-viewport')
  const bbox = document.querySelector('.flow-containers .viewport').getBBox()
  const currentViewBox = modelerStore.getCanvas.viewbox()
  const elementMid = {
    x: bbox.x + bbox.width / 2 - 65,
    y: bbox.y + bbox.height / 2
  }
  modelerStore.getCanvas.viewbox({
    x: elementMid.x - currentViewBox.width / 2,
    y: elementMid.y - currentViewBox.height / 2,
    width: currentViewBox.width,
    height: currentViewBox.height
  })
  zoom.value = bbox.width / currentViewBox.width * 1.8
  loadCanvas.value = true;
}

// 放大缩小
function zoomViewport(zoomIn = true) {
  zoom.value = modelerStore.getCanvas.zoom()
  zoom.value += (zoomIn ? 0.1 : -0.1)
  modelerStore.getCanvas.zoom(this.zoom)
}

// 获取流程基础信息
function getProcess() {
  const element = getProcessElement()
  return {
    id: element.id,
    name: element.name,
    category: element.processCategory
  }
}

// 获取流程主面板节点
function getProcessElement() {
  const rootElements = modelerStore.getModeler.getDefinitions().rootElements
  for (let i = 0; i < rootElements.length; i++) {
    if (rootElements[i].$type === 'bpmn:Process') return rootElements[i]
  }
}

// 保存xml
async function saveXML(download = false) {
  try {
    const {xml} = await modelerStore.getModeler.saveXML({format: true})
    if (download) {
      downloadFile(`${getProcessElement().name}.bpmn20.xml`, xml, 'application/xml')
    }
    return xml
  } catch (err) {
    console.log(err)
  }
}

// 在线查看xml
async function showXML() {
  try {
    const xmlStr = await saveXML()
    emit('showXML', xmlStr)
  } catch (err) {
    console.log(err)
  }
}

// 保存流程图为svg
async function saveImg(type = 'svg', download = false) {
  try {
    const {svg} = await modelerStore.getModeler.saveSVG({format: true})
    if (download) {
      downloadFile(getProcessElement().name, svg, 'image/svg+xml')
    }
    return svg
  } catch (err) {
    console.log(err)
  }
}

// 保存流程图
async function save() {
  const process = getProcess()
  const xml = await saveXML()
  const svg = await saveImg()
  const result = {process, xml, svg}
  emit('save', result)
  window.parent.postMessage(result, '*')
  goBack();
}

// 打开流程文件
function openBpmn(file) {
  const reader = new FileReader()
  reader.readAsText(file, 'utf-8')
  reader.onload = () => {
    createNewDiagram(reader.result)
  }
  return false
}

// 下载流程文件
function downloadFile(filename, data, type) {
  const a = document.createElement('a');
  const url = window.URL.createObjectURL(new Blob([data], {type: type}));
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
}

/** 关闭当前标签页并返回上个页面 */
function goBack() {
  const obj = {path: "/flowable/definition" , query: { t: Date.now()}};
  proxy.$tab.closeOpenPage(obj);
}
</script>

<style lang="scss">
/*左边工具栏以及编辑节点的样式*/
@import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
@import 'bpmn-js/dist/assets/diagram-js.css'; // 基础样式
@import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'; // 节点基础图标
@import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'; // 节点完整图标
.view-mode {
  .el-header, .el-aside, .djs-palette, .bjs-powered-by {
    display: none;
  }
  .el-loading-mask {
    background-color: initial;
  }
  .el-loading-spinner {
    display: none;
  }
}

.flow-containers {
  width: 100%;
  height: 100%;
  .canvas {
    width: 100%;
    height: 100%;
    background: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgMTBoNDBNMTAgMHY0ME0wIDIwaDQwTTIwIDB2NDBNMCAzMGg0ME0zMCAwdjQwIiBmaWxsPSJub25lIiBzdHJva2U9IiNlMGUwZTAiIG9wYWNpdHk9Ii4yIi8+PHBhdGggZD0iTTQwIDBIMHY0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZTBlMGUwIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+")
  }
  .panel {
    position: absolute;
    right: 0;
    top: 50px;
    width: 300px;
  }
  .load {
    margin-right: 10px;
  }
  //.el-form-item__label{
  //  font-size: 13px;
  //}

  .djs-palette{
    left: 0 !important;
    top: 0;
    border-top: none;
  }

  .djs-container svg {
    min-height: 650px;
  }

  .overlays-div {
    font-size: 10px;
    color: red;
    width: 100px;
    top: -20px !important;
  }
  .right-panel {
    width: 480px;
    min-height: 650px;
    padding: 20px 20px;
  }
}
</style>
