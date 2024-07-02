import { ref } from 'vue';
import { formatMoney, formatPercent } from '@/utils/tool';

export function useConfigList() {
  const basicConfig = ref([
    {
      title: '基本信息',
      type: 'text',
      children: [
        {
          label: '保理申请人',
          prop: 'factoringApplicantName'
        },
        {
          label: '业务产品',
          prop: 'bussProduct',
          type: 'dictType',
          dictType: 'lend_buss_product'
        },
        {
          label: '币种',
          prop: 'loanCurrency',
          type: 'dictType',
          dictType: 'sys_currency_type'
        },
        {
          label: '调整',
          prop: 'adjustRange',
          type: 'dictType',
          dictType: 'postloan_adjust_type'
        }
      ]
    }
  ]);

  const configList = ref([
    {
      title: '放款期限',
      type: 'text',
      children: [
        {
          label: '放款编号',
          prop: 'loanNo'
        },
        {
          label: '放款余额',
          prop: 'loanBalance',
          type: 'custom',
          func: val => {
            return formatMoney(val);
          }
        },
        {
          label: '放款日',
          prop: 'loanExpectDate'
        },
        {
          label: '放款到期日',
          prop: 'loanExpireDate'
        },
        {
          label: '调整后到期日',
          prop: 'expireDateNew'
        },
        {
          label: '放款方式',
          prop: 'loanWay',
          type: 'dictType',
          dictType: 'cont_pay'
        },
        {
          label: '风险敞口',
          prop: 'riskExposure',
          type: 'custom',
          func: val => {
            return formatMoney(val);
          }
        },
        {
          label: '应收账款金额',
          prop: 'financingAmount',
          type: 'custom',
          func: val => {
            return formatMoney(val);
          }
        },
        {
          label: '利息金额',
          prop: 'interestAmount',
          type: 'custom',
          func: val => {
            return formatMoney(val);
          }
        }
      ]
    },
    {
      title: '违约期限',
      type: 'text',
      children: [
        {
          label: '执行方',
          prop: 'factoringApplicantName'
        },
        {
          label: '宽限期利率',
          prop: 'gracePeriodInterestRate',
          type: 'custom',
          func: val => {
            return formatPercent(val);
          }
        },
        {
          label: '宽限期起期',
          prop: 'graceStartDateNew'
        },
        {
          label: '宽限期止期',
          prop: 'graceEndDateNew'
        },
        {
          label: '宽限期金额',
          prop: 'graceAmount',
          type: 'custom',
          func: val => {
            return formatMoney(val);
          }
        }
      ]
    },
    {
      title: '展期期限',
      type: 'text',
      children: [
        {
          label: '执行方',
          prop: 'factoringApplicantName'
        },
        {
          label: '展期利率',
          prop: 'extendRate',
          type: 'custom',
          func: val => {
            return formatPercent(val);
          }
        },
        {
          label: '展期起期',
          prop: 'extendStartDateNew'
        },
        {
          label: '展期止期',
          prop: 'extendEndDateNew'
        },
        {
          label: '展期金额',
          prop: 'extendAmount',
          type: 'custom',
          func: val => {
            return formatMoney(val);
          }
        }
      ]
    },
    {
      title: '违约期限',
      type: 'table',
      prop: 'defaultPeriodList',
      width: '240vw',
      children: [
        {
          label: '执行方',
          prop: 'executeParty'
        },
        {
          label: '调整后违约截止天数',
          prop: 'branchEndDateNew'
        },
        {
          label: '违约利率周期',
          prop: 'cycle',
          type: 'dictType',
          dictType: 'cont_branch_interest_cycle'
        },
        {
          label: '违约罚息方式',
          prop: 'penaltyWay',
          type: 'dictType',
          dictType: 'default_penalty_method'
        },
        {
          label: '违约利率上浮比例(%)',
          prop: 'floatRatio',
          type: 'custom',
          func: val => {
            return formatPercent(val);
          }
        },
        {
          label: '违约罚息率(%)',
          prop: 'penaltyRate',
          type: 'custom',
          func: val => {
            return formatPercent(val);
          }
        },
        {
          label: '违约金额',
          prop: 'branchAmount',
          type: 'custom',
          suffix: '元',
          func: val => {
            return '￥' + formatMoney(val);
          }
        }
      ]
    }
  ]);
  return {
    configList,
    basicConfig
  };
}
