<template>
  <div>
    <bpmn-model
        v-if="dataExit"
        :xml="xml"
        :is-view="false"
        @save="save"
        @showXML="showXML"
    ></bpmn-model>
    <!--在线查看xml-->
    <el-drawer direction="rtl" v-model="xmlOpen" size="60%" :show-close="false" :with-header="false">
      <el-link type="primary" :underline="false" icon="DocumentCopy" v-copyText="xmlData" v-copyText:callback="copyTextSuccess">&nbsp;复制</el-link>
      <!-- 设置对话框内容高度 -->
      <el-scrollbar>
        <pre v-highlight="xmlData"><code class="xml"></code></pre>
      </el-scrollbar>
    </el-drawer>
  </div>
</template>

<script setup name="FlowModel">
import { readXml, roleList, saveXml, userList, expList } from "@/api/flowable/definition";
import BpmnModel from '@/components/Process'
import vkBeautify from 'vkbeautify'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'
import useModelerStore from '@/store/modules/modeler'
import {markRaw} from "@vue/reactivity";
import {Base64}  from 'js-base64';

const modelerStore = useModelerStore()
const route = useRoute();

const {proxy} = getCurrentInstance();
// 后端查询到的xml
const xml = ref("");
const xmlOpen = ref(false);
const xmlData = ref('');
const dataExit = ref(false);
const deployId = ref("");

deployId.value = route.query && route.query.deployId;
//  查询流程xml
if (deployId.value) {
  getXmlData(deployId.value);
}

/**
 *  自定义指令, 变量名为驼峰命名(vHighlight = v-highlight)
 *
 * Vue3 指令生命周期
 * created: 在绑定元素的 attribute 或事件监听器被应用之前调用
 * beforeMount: 当指令第一次绑定到元素并且在挂载父组件之前调用
 * mounted: 在绑定元素的父组件被挂载后调用
 * beforeUpdate: 在更新包含组件的 VNode 之前调用
 * updated: 在包含组件的 VNode 及其子组件的 VNode 更新后调用
 * beforeUnmount: 在卸载绑定元素的父组件之前调用
 * unmounted: 当指令与元素解除绑定且父组件已卸载时，只调用一次
 * @type {{mounted(*, *): void, updated(*, *): void}}
 */
const vHighlight = {
  mounted(el, binding) {
    const targets = el.querySelectorAll('code');
    let target;
    let i;
    for (i = 0; i < targets.length; i += 1) {
      target = targets[i];
      if (typeof binding.value === 'string') {
        target.textContent = binding.value;
      }
      hljs.highlightBlock(target);
    }
  },
  updated(el, binding) {
    const targets = el.querySelectorAll('code');
    let target;
    let i;
    for (i = 0; i < targets.length; i += 1) {
      target = targets[i];
      if (typeof binding.value === 'string') {
        target.textContent = binding.value;
        hljs.highlightBlock(target);
      }
    }
  }
}

/** xml 文件 */
function getXmlData(deployId) {
  // 发送请求，获取xml
  readXml(deployId).then(res => {
    xml.value = res.data;
  })
}

/** 保存xml */
function save(data) {
  // Base64.encode(data.xml)
  const params = {
    name: data.process.name,
    category: data.process.category,
    xml: data.xml
  }

  saveXml(params).then(res => {
    proxy.$modal.msgSuccess(res.msg)
    // 关闭当前标签页并返回上个页面
    const obj = {path: "/flowable/definition", query: { t: Date.now()} };
    proxy.$tab.closeOpenPage(obj);
  })
}

/** 指定流程办理人员列表 */
function getDataList() {
  userList().then(res => {
    modelerStore.setDataList("userList", markRaw(res.data));
  })
  roleList().then(res => {
    modelerStore.setDataList("roleList", markRaw(res.data));
  })
  expList().then(res => {
    modelerStore.setDataList("expList", markRaw(res.data));
    dataExit.value = true;
  });
}

/** 展示xml */
function showXML(xmlStr) {
  xmlOpen.value  = true;
  xmlData.value  = vkBeautify.xml(xmlStr);
}

/** 复制代码成功 */
function copyTextSuccess() {
  proxy.$modal.msgSuccess("复制成功");
}

getDataList();
</script>
