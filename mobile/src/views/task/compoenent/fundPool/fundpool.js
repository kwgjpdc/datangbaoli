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
        }
      ]
    },
    {
      title: '资金池来源信息',
      checkShow: true,
      checkKey: 'fundResource',
      type: 'text',
      checkFunc: val => {
        if (val) {
          return val === '3' || val === '4' || val === '5';
        }
        return false;
      },
      children: [
        {
          label: '资金提供方',
          type: 'dictType',
          prop: 'provider',
          dictType: 'fund_provider'
        },
        {
          label: '客户编号',
          prop: 'providerCode',
          checkShow: true,
          checkKey: 'provider',
          checkValue: '4'
        },
        {
          label: '客户名称',
          prop: 'providerName',
          checkShow: true,
          checkKey: 'provider',
          checkValue: '4'
        },
        {
          label: 'NC供应商编码',
          prop: 'providerNcCode',
          checkShow: true,
          checkKey: 'provider',
          checkValue: '4'
        },
        {
          label: '银行代号',
          prop: 'providerCode',
          checkShow: true,
          checkKey: 'provider',
          checkValue: '1'
        },
        {
          label: '银行名称',
          prop: 'providerName',
          checkShow: true,
          checkKey: 'provider',
          checkValue: '1'
        },
        {
          label: '银行社会信用代码',
          prop: 'providerNcCode',
          checkShow: true,
          checkKey: 'provider',
          checkValue: '1'
        },
        {
          label: '集团内部单位名称',
          prop: 'providerName',
          checkShow: true,
          checkKey: 'provider',
          checkValue: '2'
        },
        {
          label: 'NC供应商编码',
          prop: 'providerNcCode',
          checkShow: true,
          checkKey: 'provider',
          checkValue: '2'
        },
        {
          label: '保理商代号',
          prop: 'providerCode',
          checkShow: true,
          checkKey: 'provider',
          checkValue: '3'
        },
        {
          label: '保理商名称',
          prop: 'providerName',
          checkShow: true,
          checkKey: 'provider',
          checkValue: '3'
        },
        {
          label: 'NC供应商编码',
          prop: 'providerNcCode',
          checkShow: true,
          checkKey: 'provider',
          checkValue: '3'
        },
        {
          label: '资金提供方名称',
          prop: 'providerName',
          checkShow: true,
          checkKey: 'provider',
          checkValue: '5'
        },
        {
          label: 'NC供应商编码',
          prop: 'providerNcCode',
          checkShow: true,
          checkKey: 'provider',
          checkValue: '5'
        },
        {
          label: '委托人名称',
          prop: 'providerName',
          checkShow: true,
          checkKey: 'provider',
          checkValue: '6'
        },
        {
          label: 'NC供应商编码',
          prop: 'providerNcCode',
          checkShow: true,
          checkKey: 'provider',
          checkValue: '6'
        },
        {
          label: '股东名称',
          prop: 'providerName',
          checkShow: true,
          checkKey: 'provider',
          checkValue: '7'
        },
        {
          label: 'NC供应商编码',
          prop: 'providerNcCode',
          checkShow: true,
          checkKey: 'provider',
          checkValue: '7'
        }
      ]
    },
    {
      title: '资金合同信息',
      checkShow: true,
      checkKey: 'fundResource',
      type: 'text',
      checkFunc: val => {
        if (val) {
          return val === '3' || val === '4';
        }
        return false;
      },
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
        }
      ]
    },
    {
      title: '资金池信息',
      type: 'text',
      children: [
        {
          label: '是否可循环使用',
          prop: 'fundIfCycle',
          type: 'dictType',
          dictType: 'fund_if_cycle'
        },
        {
          label: '币种',
          prop: 'currencyType',
          type: 'dictType',
          dictType: 'sys_currency_type'
        },
        {
          label: '资全池总金额(元)',
          prop: 'totalAmount'
        },
        {
          label: '已使用金额 (元)',
          prop: 'usedAmount'
        },
        {
          label: '资金池可用余额 (元)',
          prop: 'availableAmount'
        },
        {
          label: '起始日',
          prop: 'startDate'
        },
        {
          label: '到期日',
          prop: 'endDate'
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
