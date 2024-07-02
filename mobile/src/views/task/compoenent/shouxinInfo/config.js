import { ref } from 'vue';

export function useConfigList() {
  const configList = ref([
    {
      title: '授信信息',
      type: 'text',
      children: [
        {
          label: '审议编号',
          prop: 'creditNo'
        },
        {
          label: '总期',
          prop: 'totalPeriod'
        },
        {
          label: '提交部门',
          prop: 'submitDepartment'
        },
        {
          label: '年期',
          prop: 'currentYear'
        },
        {
          label: '审议日期',
          prop: 'reviewDate'
        },
        {
          label: '主办人',
          prop: 'sponsor'
        },
        {
          label: '授信对象',
          prop: 'creditObject'
        },
        {
          label: '授信额度',
          prop: 'creditLine',
          type: 'custom',
          func: val => {
            if (val) {
              return '￥' + val;
            }
            return '';
          },
          suffix: '万元'
        },
        {
          label: '担保方式',
          prop: 'guarantyWay',
          type: 'dictType',
          dictType: 'credit_guaranty_way'
        },
        {
          label: '授信期限',
          prop: 'creditPeriod',
          suffix: '个月'
        },
        {
          label: '授信到期日',
          prop: 'expireDate'
        },
        {
          label: '额度种类组',
          prop: 'typeGroup',
          type: 'dictType',
          dictType: 'cust_credit_type'
        },
        {
          label: '额度管理方式',
          prop: 'manageMode',
          type: 'dictType',
          dictType: 'lines_manage_mode'
        },
        {
          label: '备注',
          prop: 'remark'
        }
      ]
    }
  ]);
  return {
    configList
  };
}
