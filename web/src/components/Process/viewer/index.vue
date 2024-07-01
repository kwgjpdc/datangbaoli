<template>
  <div class="containers main-box">
      <!--  按钮区域  -->
      <el-button-group class="ml-4">
        <el-tooltip effect="dark" content="适中" placement="bottom">
          <el-button icon="Rank" @click="fitViewport" />
        </el-tooltip>
        <el-tooltip effect="dark" content="放大" placement="bottom">
          <el-button icon="ZoomIn" @click="zoomViewport(true)" />
        </el-tooltip>
        <el-tooltip effect="dark" content="缩小" placement="bottom">
          <el-button icon="ZoomOut" @click="zoomViewport(false)" />
        </el-tooltip>
      </el-button-group>

      <!-- 流程图显示 -->
      <div v-loading="loading" class="canvas" ref="flowCanvas"></div>
      <!-- 空数据 -->
<!--      <el-empty description="暂无流程数据" />-->
      <!-- 节点信息 -->
<!--      <el-descriptions v-if="flowDetail.taskName" class="flowMsgPopover margin-top" :title="flowDetail.taskName" :column="1" size="small" border>-->
<!--        <el-descriptions-item v-if="flowDetail.assigneeName" >-->
<!--          <template #label>-->
<!--            <div class="cell-item">-->
<!--              <el-icon :style="iconStyle"><User /></el-icon>-->
<!--              办理人-->
<!--            </div>-->
<!--          </template>-->
<!--          {{flowDetail.assigneeName}}-->
<!--          <el-tag type="info" size="small">{{flowDetail.deptName}}</el-tag>-->
<!--        </el-descriptions-item>-->
<!--        <el-descriptions-item v-if="flowDetail.candidate" >-->
<!--          <template #label>-->
<!--            <div class="cell-item">-->
<!--              <el-icon :style="iconStyle"><User /></el-icon>-->
<!--              候选办理-->
<!--            </div>-->
<!--          </template>-->
<!--          {{flowDetail.candidate}}-->
<!--        </el-descriptions-item>-->
<!--        <el-descriptions-item >-->
<!--          <template #label>-->
<!--            <div class="cell-item">-->
<!--              <el-icon :style="iconStyle"><Calendar /></el-icon>-->
<!--              接收时间-->
<!--            </div>-->
<!--          </template>-->
<!--          {{flowDetail.createTime}}-->
<!--        </el-descriptions-item>-->
<!--        <el-descriptions-item v-if="flowDetail.finishTime" >-->
<!--          <template #label>-->
<!--            <div class="cell-item">-->
<!--              <el-icon :style="iconStyle"><Calendar /></el-icon>-->
<!--              处理时间-->
<!--            </div>-->
<!--          </template>-->
<!--          {{flowDetail.finishTime}}-->
<!--        </el-descriptions-item>-->
<!--        <el-descriptions-item v-if="flowDetail.duration"  >-->
<!--          <template #label>-->
<!--            <div class="cell-item">-->
<!--              <el-icon :style="iconStyle"><Timer /></el-icon>-->
<!--              耗时-->
<!--            </div>-->
<!--          </template>-->
<!--          {{flowDetail.duration}}-->
<!--        </el-descriptions-item>-->
<!--        <el-descriptions-item v-if="flowDetail.comment" >-->
<!--          <template #label>-->
<!--            <div class="cell-item">-->
<!--              <el-icon :style="iconStyle"><ChatDotSquare /></el-icon>-->
<!--              处理意见-->
<!--            </div>-->
<!--          </template>-->
<!--          {{flowDetail.comment.comment}}-->
<!--        </el-descriptions-item>-->
<!--    </el-descriptions>-->
  </div>
</template>

<script setup name="BpmnViewer">
import { CustomViewer as BpmnViewer } from "@/components/Process/common";
import {flowTaskInfo} from "@/api/flowable/process";

const { proxy } = getCurrentInstance();

const bpmnViewer = ref(null);
const flowDetail = ref({});
const loading = ref(true);

const iconStyle = computed(() => {
  const marginMap = {
    large: '8px',
    default: '6px',
    small: '4px',
  }
  return {
    marginRight: marginMap.small,
  }
})

/** 组件传值  */
const props = defineProps({
  // 回显数据传值
  flowData: {
    type: Object,
    default: () => {},
    required: false
  },
  procInsId: {
    type: String,
    default: ''
  },
});

// 传值监听
watch(() => props.flowData, newValue => {
      if (Object.keys(newValue).length > 0) {
        // 生成实例
        bpmnViewer.value && bpmnViewer.value.destroy();
        bpmnViewer.value = new BpmnViewer({
          container: proxy.$refs.flowCanvas,
          height: 'calc(100vh - 200px)',
        });
        loadFlowCanvas(newValue);
        // 为节点注册鼠标点击事件
        // if (props.procInsId) {
        //   const eventBus = bpmnViewer.value.get('eventBus');
        //   const overlays = bpmnViewer.value.get('overlays');
        //   eventBus.on('element.click', (e) => {
        //     if (e.element.type === "bpmn:UserTask") {
        //       flowTaskInfo({procInsId: props.procInsId, elementId: e.element.id}).then(res => {
        //         flowDetail.value = res.data;
        //         setTimeout(() => {
        //           if (e.element.type === "bpmn:UserTask") {
        //             if (flowDetail.value) {
        //               genNodeDetailBox(e, overlays);
        //             }
        //           }
        //         }, 10)
        //       })
        //     }
        //   });
        //   eventBus.on('element.out', (e) => {
        //     overlays.clear();
        //   });
        // }
      }
    }
);

// 方法区
//悬浮框设置
function genNodeDetailBox(e, overlays) {
  let tempDiv = document.createElement("div");
  let popoverEl = document.querySelector('.flowMsgPopover');
  tempDiv.innerHTML= popoverEl.innerHTML;
  tempDiv.style.width = '360px';
  tempDiv.className = 'tipBox';
  tempDiv.style.background = 'rgba(255,255,255,0.95)';
  overlays.add(e.element.id, {
    position: {top: e.element.height, left: 0},
    html: tempDiv
  });
}

// 加载流程图片
async function loadFlowCanvas(flowData) {
  try {
      await bpmnViewer.value.importXML(flowData.xmlData);
      await fitViewport();
    // 流程线高亮设置
    if (flowData.nodeData !== undefined && flowData.nodeData.length > 0 && props.procInsId) {
      await fillColor(flowData.nodeData);
    }
  } catch (err) {
    console.error(err.message, err.warnings)
  }
}

// 让图能自适应屏幕
function fitViewport() {
  proxy.zoom = bpmnViewer.value.get('canvas').zoom("fit-viewport", "auto");
  loading.value = false;
}

// 放大缩小
function zoomViewport(zoomIn = true) {
  proxy.zoom = bpmnViewer.value.get('canvas').zoom()
  proxy.zoom += (zoomIn ? 0.1 : -0.1)
  if (proxy.zoom >= 0.2) bpmnViewer.value.get('canvas').zoom(proxy.zoom);
}


// 设置高亮颜色的
function fillColor(nodeData) {
  const canvas = bpmnViewer.value.get('canvas')
  bpmnViewer.value.getDefinitions().rootElements[0].flowElements.forEach(n => {
    const completeTask = nodeData.find(m => m.key === n.id)
    const todoTask = nodeData.find(m => !m.completed)
    const endTask = nodeData[nodeData.length - 1]
    if (n.$type === 'bpmn:UserTask') {
      if (completeTask) {
        canvas.addMarker(n.id, completeTask.completed ? 'highlight' : 'highlight-todo')
        n.outgoing?.forEach(nn => {
          const targetTask = nodeData.find(m => m.key === nn.targetRef.id)
          if (targetTask) {
            if (todoTask && completeTask.key === todoTask.key && !todoTask.completed){
              canvas.addMarker(nn.id, todoTask.completed ? 'highlight' : 'highlight-todo')
              canvas.addMarker(nn.targetRef.id, todoTask.completed ? 'highlight' : 'highlight-todo')
            }else {
              canvas.addMarker(nn.id, targetTask.completed ? 'highlight' : 'highlight-todo')
              canvas.addMarker(nn.targetRef.id, targetTask.completed ? 'highlight' : 'highlight-todo')
            }
          }
        })
      }
    }
    // 排他网关
    else if (n.$type === 'bpmn:ExclusiveGateway') {
      if (completeTask) {
        canvas.addMarker(n.id, completeTask.completed ? 'highlight' : 'highlight-todo')
        n.outgoing?.forEach(nn => {
          const targetTask = nodeData.find(m => m.key === nn.targetRef.id)
          if (targetTask) {

            canvas.addMarker(nn.id, targetTask.completed ? 'highlight' : 'highlight-todo')
            canvas.addMarker(nn.targetRef.id, targetTask.completed ? 'highlight' : 'highlight-todo')
          }
        })
      }
    }
    // 并行网关
    else if (n.$type === 'bpmn:ParallelGateway') {
      if (completeTask) {
        canvas.addMarker(n.id, completeTask.completed ? 'highlight' : 'highlight-todo')
        n.outgoing?.forEach(nn => {
          const targetTask = nodeData.find(m => m.key === nn.targetRef.id)
          if (targetTask) {
            canvas.addMarker(nn.id, targetTask.completed ? 'highlight' : 'highlight-todo')
            canvas.addMarker(nn.targetRef.id, targetTask.completed ? 'highlight' : 'highlight-todo')
          }
        })
      }
    }
    else if (n.$type === 'bpmn:StartEvent') {
      n.outgoing.forEach(nn => {
        const completeTask = nodeData.find(m => m.key === nn.targetRef.id)
        if (completeTask) {
          canvas.addMarker(nn.id, 'highlight')
          canvas.addMarker(n.id, 'highlight')
          return;
        }
      })
    }
    else if (n.$type === 'bpmn:EndEvent') {
      if (endTask.key === n.id && endTask.completed) {
        canvas.addMarker(n.id, 'highlight')
        return;
      }
    }
  })
}

</script>

<style lang="scss">
@import "@/assets/styles/flow-viewer.scss";
</style>
