<template>
    <div>
        <el-row :gutter="15">
            <el-col :span="24" :xs="24">
                
                        <!-- <el-card class="box-card"> -->
                            <!-- <template #header> -->
                                <!-- <span>批量导入的客户信息文件</span> -->
                                <div class="header-button-operate"><el-upload class="upload-demo" :action="uploadFileUrl"
                                        :headers="headers" :on-preview="handlePreview" :on-remove="handleRemove"
                                        :before-remove="beforeRemove" :on-exceed="handleExceed" :on-success="uploadSuccess"
                                        :show-file-list="false" ref="fileUpload">
                                        <el-button  type="primary" link>上传文件</el-button>
                                    </el-upload>

                                    <el-button type="primary" link
                                        @click="importTemplate()">《客户信息批量导入模板》下载</el-button>
                                   
                                </div>

                            <!-- </template> -->
                            <el-table v-loading="loading" :data="customerList"
                                @selection-change="handleSelectionChange">
                                <!-- <el-table-column type="selection" width="55" align="center" fixed /> -->
                                <!-- <el-table-column label="oss上文件存储地址" align="center" prop="fileUrl" /> -->
                                <el-table-column label="客户名称" align="center" prop="customerName" fixed>
                                </el-table-column>
                               
                                
                                <el-table-column label="客户分类" align="center" prop="customerCategory" >
                                   
                                     <template #default="scope">
                                       <div v-for="item in scope.row.customerCategory.split(',')" :key="item" >
                                        <dict-tag   :options="cust_customer_category" :value="item" />
                                    </div>
                                </template> 
                                </el-table-column>
                                <el-table-column label="注册国家或地区" align="center" prop="customerCategory" width="170">
                                    <template #default="scope">
                                            <dict-tag   :options="cust_register_country" :value="scope.row.customerCategory" />
                                    </template>
                                </el-table-column>
                                <el-table-column label="是否核心企业" align="center" prop="isCoreEnterprise" width="130" >
                                    <template #default="scope">
                                            <dict-tag   :options="sys_true_or_false" :value="scope.row.isCoreEnterprise" />
                                    </template>
                                </el-table-column>
                                <el-table-column label="客户经理" align="center" prop="customerManagerName" />
                                <!-- <el-table-column label="FCI编号" align="center" prop="fciNumber">
                                </el-table-column>
                                <el-table-column label="IFG编号" align="center" prop="ifgNumber">
                                </el-table-column> -->
                                <!-- <el-table-column label="公司类型" align="center" prop="companyInfo.companyType" >
                                    <template #default="scope">
                                        <dict-tag   :options="cust_company_type" :value="scope.row.companyInfo.companyType" />
                                </template>
                                </el-table-column> -->
                                <el-table-column label="统一社会信用代码" align="center" prop="companyInfo.creditCode" width="170" />
                                <el-table-column label="上级公司" align="center" prop="companyInfo.parentCustomerId" />
                                <el-table-column label="法人代表" align="center" prop="companyInfo.corporationName" />
                                <el-table-column label="法人代表证件类型" align="center" prop="companyInfo.corporationIdType" width="170" >
                                    <template #default="scope">
                                        <dict-tag   :options="sys_id_card_type" :value="scope.row.companyInfo.corporationIdType" />
                                    </template>
                                </el-table-column>
                                <el-table-column label="法人代表身份证号码" align="center" prop="companyInfo.corporationIdCard" width="170" />
                                <!-- <el-table-column label="企业性质" align="center" prop="companyInfo.enterpriseNature" >
                                    <template #default="scope">
                                        <dict-tag   :options="cust_enterprise_nature" :value="scope.row.companyInfo.enterpriseNature" />
                                    </template>
                                </el-table-column> -->
                                <el-table-column label="住所" align="center" prop="companyInfo.corporationResidence"  width="170" />
                                <el-table-column label="注册地址" align="center" prop="companyInfo.registerAddr"  width="170" />
                                <el-table-column label="经营地址" align="center" prop="companyInfo.operateAddr"  width="170" />



                                

                                <el-table-column label="纳税人类型" align="center" prop="invoiceInfo.taxpayerType" width="100" >
                                    <template #default="scope">
                                        <dict-tag   :options="cust_taxpayer_type" :value="scope.row.invoiceInfo.taxpayerType" />
                                    </template>
                                </el-table-column>
                                <el-table-column label="发票抬头" align="center" prop="invoiceInfo.invoiceTitle"  width="170" />
                                <el-table-column label="纳税人识别号" align="center" prop="invoiceInfo.taxpayerIdNo"  width="170" />
                                <el-table-column label="纳税人地址" align="center" prop="invoiceInfo.taxpayerAddr"  width="170" />
                                <el-table-column label="纳税人电话" align="center" prop="invoiceInfo.taxpayerPhoneNo"  width="150" />
                                <el-table-column label="开户行名称" align="center" prop="invoiceInfo.bankName" width="130" />
                                <el-table-column label="开户行账号" align="center" prop="invoiceInfo.bankAccountNo"  width="170" />
                                <el-table-column label="纳税人邮箱" align="center" prop="invoiceInfo.taxpayerEmail"  width="170" />
                                


                                <el-table-column label="客户端管理员" align="center" prop="contact.isClientAdmin" width="130" >
                                    <template #default="scope">
                                        <dict-tag :options="sys_true_or_false"
                                            :value="scope.row.contact.isClientAdmin" />
                                    </template>
                                </el-table-column>
                                <el-table-column label="联系人姓名" align="center" prop="contact.contactName" width="100" />
                                <el-table-column label="联系人证件类型" align="center" prop="contact.contactIdType"  width="130" >
                                    <template #default="scope">
                                        <dict-tag   :options="sys_id_card_type" :value="scope.row.contact.contactIdType" />
                                 </template>
                                </el-table-column>
                                <el-table-column label="联系人身份证号码" align="center" prop="contact.contactIdCardNo"  width="170"/>
                                <el-table-column label="职位类别" align="center" prop="contact.contactJobCategory" width="130" >
                                    <template #default="scope">
                                        <dict-tag :options="cust_contact_job_category"
                                            :value="scope.row.contact.contactJobCategory" />
                                    </template>
                                </el-table-column>
                                <el-table-column label="联系人电话" align="center" prop="contact.contactPhoneNo"  width="170" />
                                <el-table-column label="联系人邮箱" align="center" prop="contact.contactEmail"   width="170" />
                                    <!-- <el-table-column label="流水号" align="center" prop="custBankInfoList[0].serialNumber" />
      <el-table-column label="银行账号" align="center" prop="custBankInfoList[0].bankAccount" />
      <el-table-column label="客户中文名称" align="center" prop="custBankInfoList[0].customerName" />
      <el-table-column label="开户行" align="center" prop="custBankInfoList[0].bankBranch" />
      <el-table-column label="分行（省）" align="center" prop="custBankInfoList[0].province" />
      <el-table-column label="分行（市）" align="center" prop="custBankInfoList[0].city" />
      <el-table-column label="账户名称" align="center" prop="custBankInfoList[0].accountName" />
      <el-table-column label="币种" align="center" prop="custBankInfoList[0].currencyType" /> -->
                                <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                                    <template #default="scope">
                                      
                                        <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                                            v-hasPermi="['sys:file:remove']" title="删除"></el-button>
                                        <el-button link type="primary" icon="download" @click="handleExport(scope.row)"
                                            v-hasPermi="['sys:file:export']" title="下载"></el-button>
                                    </template>
                                </el-table-column> -->
                            </el-table>
<!-- 
                        </el-card> -->
            </el-col>
        </el-row>
     
    </div>
</template>
<script setup>
const emit = defineEmits();
import { getToken } from "@/utils/auth";
const { proxy } = getCurrentInstance();
const single = ref(true);
const multiple = ref(true);
const ids = ref([]);
const { cust_register_country, cust_customer_type, cust_customer_category, sys_true_or_false,cust_industry_type,cust_company_type,cust_enterprise_type,sys_id_card_type,cust_contact_job_category,cust_taxpayer_type} = proxy.useDict("cust_register_country", "cust_customer_type", "cust_customer_category", "sys_true_or_false","cust_industry_type","cust_company_type","cust_enterprise_type","sys_id_card_type","cust_contact_job_category","cust_taxpayer_type");
const uploadFileUrl = ref(import.meta.env.VITE_APP_BASE_API + "/cust/customer/importData"); // 上传文件服务器地址
const headers = ref({ Authorization: getToken() });
const props = defineProps({
    batchCustomerList: {
        type: Array,
        default: [],
    }
});
let customerList = ref([]);

// 多选框选中数据
function handleSelectionChange(selection) {
    ids.value = selection.map(item => item.fileUrl);
    single.value = selection.length != 1;
    multiple.value = !selection.length;
}
function handleRemove(file, fileList) {
    console.log(file, fileList);
}
function handlePreview(file) {
    console.log(file);
}
function handleExceed(files, fileList) {
    proxy.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
}
function beforeRemove(file, fileList) {
    return proxy.$confirm(`确定移除 ${file.name}？`);
}
function uploadSuccess(response, file, fileList) {
if(response.code==500) {
    proxy.$confirm(response.msg,{dangerouslyUseHTMLString: true});
} else {
    console.log(response);
    response.data.forEach((Element)=>{
        console.log(Element);
        customerList.value.push(Element)
    })

    emit(`update:batchCustomerList`,  customerList.value)
    if(response.msg) {
        proxy.$confirm(response.msg,{dangerouslyUseHTMLString: true});
    }
}
}
function handleDelete(rows) {
    const customerName = rows ? [rows.customerName] : ids.value;
    proxy.$modal.confirm('是否确认删除文件名为"' + customerName + '"的数据项？').then(function () {
        customerName.forEach((names) => {
            customerList.value = customerList.value.filter((item) => {
                return item.customerName != names;
            })
            emit(`update:batchCustomerList`,  customerList.value)
        })
        single.value = false;
        multiple.value = false;

    }).catch((e) => { console.log(e) });
}
function handleExport(rows){
    // todo
    const fileUrl = rows ? [rows.customerName] : ids.value;
    proxy.$download.resource(fileUrl);
    // proxy.download('/common/download/resource',{resource:fileUrl})
    // window.open(import.meta.env.VITE_APP_BASE_API + '/common/download/resource?resource='+ fileUrl,'_blank')
    // downloadFile(fileUrl).then(function () {
    //     proxy.$message('下载完成！')
    // }).catch((e) => { console.log(e) });
}
/** 下载模板操作 */
function importTemplate() {
  proxy.download("/cust/customer/importTemplate", {
  }, `cust_template_${new Date().getTime()}.xlsx`);
};

</script>
<style lang="scss" scoped>
.header-button-operate {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    margin-bottom: 20px;
}
.upload-demo {
    display: flex;
    margin-right: 10px;
}
.table-content {
display:flex;
  justify-content:center;
  
}
.biz-type-button{
    display: flex;
}
</style>