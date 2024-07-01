<template>
     <!-- 添加或修改用户配置对话框 -->
     <el-dialog :title="title" :model-value="openChild" width="600px" @closed="selececlientRow(false)">
       <el-form ref="formInput1"  label-width="80px" :model="formInput">
     <el-row>
          <el-col :span="12">
            <el-form-item :label="label[0]" prop="number">
              <el-input  :placeholder="'请输入'+label[0]" maxlength="30"  v-model="formInput.number" @input="selectTableData" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="label[1]" prop="nickName">
              <el-input :placeholder="'请输入'+label[1]" maxlength="30" v-model="formInput.nickName" @input="selectTableData" ></el-input>
            </el-form-item>
          </el-col>

          </el-row>
        </el-form>
       <div class="table-content" >
        <el-row justify="center">
          <el-col :span="24">
         <el-table ref="multipleTable" :data="tableDataShow" tooltip-effect="dark"  style="width: 100%" 
                                 @row-click="selececlientRow" v-show="tableDataShow.length">
                              
                                 <el-table-column prop="userId" :label="label[0]" align="center"> </el-table-column>
                                <el-table-column prop="userName" :label="label[1]" align="center">
                                </el-table-column>
                               
                            </el-table>
                            <div v-show="!tableDataShow.length">未查询到符合条件的数据</div>
                          </el-col>

</el-row>
                          </div>
                            <div class="page">
                                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                                 :page-size="pageSize"  layout="total, prev, pager, next"
                                :total="total">
                            </el-pagination>
                            </div>
        </el-dialog>
</template>
<script setup>
import { reactive, ref, watchEffect } from "vue"
const { proxy } = getCurrentInstance();
const props = defineProps({
  // // 查询项
  // form: {
  //   type: Object,
  //   default: {number:"",name:""},
  // },
//   展示表格列
  tableData: {
    type: Array,
    default: null,
  },
  // 当前的标题
  title: {
    type:String,
    default:"",
  },
  //对话框是否展示
  open: {
    type: Boolean,
    default: false,
  },
  // 当前的页数
  currentPage: {
    type:Number,
    default:1,
  },
  total: {
    type:Number,
    default:1,
  },
  label:{
    type: Array,
    default: ['客户编号','客户名称'],
  },
  pageSize:{
    type:Number,
    default:10,
  },
 
});
const emit = defineEmits();
const data = reactive({
  formInput: {}
});

const { formInput } = toRefs(data);

let tableDataShow = ref(props.tableData);

watch(()=>props.tableData,(newValue,oldValue)=>{
	tableDataShow.value = newValue;
},{immediate:true,deep:true})

let  openChild =  ref(props.open);
watch(()=>props.open,(newValue,oldValue)=>{
  openChild =  props.open;
	formInput.value = {number:"",nickName:""}
  tableDataShow.value = props.tableData;
},{immediate:true,deep:true})
let currentPageShow = ref(1);
watch(()=>props.currentPage,(newValue,oldValue)=>{
  currentPageShow.value = newValue;
},{immediate:true,deep:true})
function selececlientRow(row, column, event){

  emit("update:open", false);
  if(row&&row.userId) {
    emit("selectRow", row);
  }
  // tableDataShow.value = props.tableData;
  formInput.value.number= "";
  formInput.value.nickName="";
  console.log(row);

  
    }
function handleSizeChange(val){
    console.log(`${val} items per page`)
}
function handleCurrentChange(val){
    console.log(`current page: ${val}`)
    emit("pageChange", val);
}
function selectTableData(){
  if(props.tableData) {
    tableDataShow =  props.tableData.filter((item)=>{
    console.log(item)
    console.log(formInput)
        if(formInput && formInput.value.number && formInput.value.nickName) {
          return item.userId.toString().indexOf(formInput.value.number) > -1 && item.userName.indexOf(formInput.value.nickName) > -1
        } else if (formInput && formInput.value.number) {
          return item.userId.toString().indexOf(formInput.value.number) > -1
        } else if (formInput && formInput.value.nickName) {
          return item.userName.indexOf(formInput.value.nickName) > -1
        }else {
          return item
        }
    })
    proxy.$forceUpdate()
    } 
    
}

</script>
<style lang="scss">

.table-content {
  // display:flex;
  // justify-content:center;
}
</style>