import { ref } from 'vue';
import { formatMoney, formatPercent } from '@/utils/tool';

export function useConfigList() {
  const basicConfig = ref([
    {
      title: '基本信息',
      type: 'text',
      children: [
        {
          label: '业务合同号',
          prop: 'otherContractNo'
        },
        {
          label: '业务产品',
          prop: 'bussProduct',
          type: 'dictType',
          dictType: 'lend_buss_product'
        },
        {
          label: '保理申请人',
          prop: 'factoringApplicantName'
        },
        {
          label: '币种',
          prop: 'otherCurrencyType',
          type: 'dictType',
          dictType: 'sys_currency_type'
        },
        {
          label: '入账日期',
          prop: 'entryDate'
        },
        {
          label: '入账账号',
          prop: 'entryAccount'
        },
        {
          label: '备注',
          prop: 'remark'
        }
      ]
    },
    {
      title: '扣款账号信息',
      type: 'table',
      prop: 'deductionList',
      width: '100%',
      children: [
        {
          label: '扣款账号',
          prop: 'deductionAccount'
        },
        {
          label: '扣款金额',
          prop: 'deductionAmount',
          type: 'custom',
          func: val => {
            return formatMoney(val);
          }
        }
      ]
    }
  ]);

  return {
    basicConfig
  };
}
