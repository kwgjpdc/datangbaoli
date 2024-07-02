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
          label: '调整利息总金额',
          prop: 'interestTotal',
          suffix: '元',
          type: 'custom',
          func: val => {
            if (val) {
              return '￥' + val;
            }
            return '';
          }
        }
      ]
    },
    {
      title: '利息信息',
      type: 'text',
      children: [
        {
          label: '放款编号',
          prop: 'loanNo'
        },
        {
          label: '执行对象',
          prop: 'agreeDebtorName'
        },
        {
          label: '放款余额',
          prop: 'loanAmount'
        },
        {
          label: '放款到期日',
          prop: 'loanExpireDate'
          // suffix: '元',
          // type: 'custom',
          // func: (val) => {
          //   if (val) {
          //     return '￥' + val;
          //   }
          //   return ''
          // }
        },
        {
          label: '已收本金利息',
          prop: 'interestReceived',
          type: 'custom',
          func: val => {
            return formatMoney(val);
          }
        },
        {
          label: '未收本金利息',
          prop: 'interestNotReceived',
          type: 'custom',
          func: val => {
            return formatMoney(val);
          }
        },
        {
          label: '调整利息金额',
          prop: 'adjustAmount',
          type: 'custom',
          func: val => {
            return formatMoney(val);
          }
        }
      ]
    }
  ]);

  const configList = ref([
    {
      title: '正常利率',
      type: 'table',
      prop: 'normalList',
      width: '240vw',
      children: [
        {
          label: '执行方',
          prop: 'executePartyNormal'
        },
        {
          label: '利率类型',
          prop: 'typeNormal',
          type: 'dictType',
          dictType: 'cont_interest_type'
        },
        {
          label: '固定利率(%)',
          prop: 'fixedRateNormal',
          type: 'custom',
          func: val => {
            return formatPercent(val);
          }
        },
        {
          label: '利率种类',
          prop: 'rateCategoryNormal',
          type: 'dictType',
          dictType: 'postloan_rate_type'
        },
        {
          label: '基准利率(%)',
          prop: 'benchmarkRateNormal',
          type: 'custom',
          func: val => {
            return formatPercent(val);
          }
        },
        {
          label: '变动/锁定标志',
          prop: 'changeLockFlagNormal',
          type: 'dictType',
          dictType: 'cont_interest_floating_lock'
        },
        {
          label: '利率周期',
          prop: 'rateCycleNormal',
          type: 'dictType',
          dictType: 'cont_interest_cycle'
        },
        {
          label: '加减码',
          prop: 'isAddOrSubNormal',
          type: 'dictType',
          dictType: 'cont_if_plus_minus'
        },
        {
          label: '加减码浮动方式',
          prop: 'floatMethodNormal',
          type: 'dictType',
          dictType: 'cont_plus_minus_floating'
        },
        {
          label: '执行利率(%)',
          prop: 'executeRateNormal',
          type: 'custom',
          func: val => {
            return formatPercent(val);
          }
        }
      ]
    },
    {
      title: '宽限期利率',
      type: 'table',
      prop: 'feeList',
      width: '240vw',
      children: [
        {
          label: '执行方',
          prop: 'executeParty'
        },
        {
          label: '利率类型',
          prop: 'type',
          type: 'dictType',
          dictType: 'cont_interest_type'
        },
        {
          label: '固定利率(%)',
          prop: 'fixedRate',
          type: 'custom',
          func: val => {
            return formatPercent(val);
          }
        },
        {
          label: '利率种类',
          prop: 'rateCategory',
          type: 'dictType',
          dictType: 'postloan_rate_type'
        },
        {
          label: '基准利率(%)',
          prop: 'benchmarkRate',
          type: 'custom',
          func: val => {
            return formatPercent(val);
          }
        },
        {
          label: '变动/锁定标志',
          prop: 'changeLockFlag',
          type: 'dictType',
          dictType: 'cont_interest_floating_lock'
        },
        {
          label: '利率周期',
          prop: 'rateCycle',
          type: 'dictType',
          dictType: 'cont_interest_cycle'
        },
        {
          label: '加减码',
          prop: 'isAddOrSub',
          type: 'dictType',
          dictType: 'cont_if_plus_minus'
        },
        {
          label: '加减码浮动方式',
          prop: 'floatMethod',
          type: 'dictType',
          dictType: 'cont_plus_minus_floating'
        },
        {
          label: '执行利率(%)',
          prop: 'executeRate',
          type: 'custom',
          func: val => {
            return formatPercent(val);
          }
        }
      ]
    },
    {
      title: '违约利率',
      type: 'table',
      prop: 'subList',
      width: '240vw',
      children: [
        {
          label: '执行方',
          prop: 'executeParty'
        },
        {
          label: '违约起始天数',
          prop: 'startDays'
        },
        {
          label: '违约截止天数',
          prop: 'dueDays'
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
        }
      ]
    }
  ]);
  return {
    configList,
    basicConfig
  };
}
