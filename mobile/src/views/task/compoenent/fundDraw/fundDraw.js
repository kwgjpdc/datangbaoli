import { ref } from 'vue';

export function useConfigList() {
  const configList = ref([
    {
      title: '基本信息',
      type: 'text',
      children: [
        {
          label: '资金池编号',
          prop: 'fundNo'
        },
        {
          label: '资金来源',
          prop: 'fundResource',
          type: 'dictType',
          dictType: 'fund_resource'
        },
        {
          label: '资金编号',
          prop: 'drawNo'
        },
        {
          label: '资金池到期日',
          prop: 'poolEndDate'
        },
        {
          label: '资金池总金额(元)',
          prop: 'poolAmount'
        },
        {
          label: '资金池可用余额(元)',
          prop: 'poolRemainAmount'
        }
      ]
    },
    {
      title: '资金来源信息',
      type: 'text',
      children: [
        {
          label: '银行代号',
          prop: 'bankCode'
        },
        {
          label: '银行名称',
          prop: 'bankName'
        }
      ]
    },
    {
      title: '资金合同信息',
      type: 'text',
      children: [
        {
          label: '借款合同号',
          prop: 'contractNo'
        },
        {
          label: '授信品种',
          prop: 'creditType',
          type: 'dictType',
          dictType: 'fund_credit_type'
        },
        {
          label: '结息方式',
          prop: 'interestSettlement',
          type: 'dictType',
          dictType: 'fund_interest_settlement'
        },
        {
          label: '借据号',
          prop: 'receiptCode'
        },
        {
          label: '提款账号',
          prop: 'account'
        }
      ]
    },
    {
      title: '资金池信息',
      type: 'text',
      children: [
        {
          label: '币种',
          prop: 'currencyType',
          type: 'dictType',
          dictType: 'sys_currency_type'
        },
        {
          label: '资金金额 (元)',
          prop: 'amount'
        },
        {
          label: '资金余额 (元)',
          prop: 'remainAmount'
        },
        {
          label: '入账日',
          prop: 'startDate'
        },
        {
          label: '到期日',
          prop: 'endDate'
        },
        {
          label: '期限',
          prop: 'term',
          type: 'dictType',
          dictType: 'fund_term'
        },
        {
          label: '提款品种',
          prop: 'drawType',
          type: 'dictType',
          dictType: 'fund_draw_type'
        }
      ]
    },
    {
      title: '资金成本',
      type: 'text',
      children: [
        {
          label: '综合成本率(%)',
          prop: 'costRate'
        },
        {
          label: '利率(%)',
          prop: 'interestRate'
        },
        {
          label: '起息日',
          prop: 'interestStartDate'
        },
        {
          label: '变更后利率(%)',
          prop: 'interestRateChanged'
        },
        {
          label: '费用成本(元）',
          prop: 'feeCost'
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
