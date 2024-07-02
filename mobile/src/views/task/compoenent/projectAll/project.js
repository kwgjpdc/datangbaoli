import { ref } from 'vue';

export function useConfigList() {
  const configList = ref([
    {
      title: '基本信息',
      type: 'text',
      children: [
        {
          label: '客户名称',
          prop: 'customerName'
        },
        {
          label: '审议编号',
          prop: 'dueNo'
        },
        {
          label: '项目名称',
          prop: 'name'
        },
        {
          label: '总期',
          prop: 'totalPeriod'
        },
        {
          label: '审议日期',
          prop: 'reviewDate'
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
          label: '保理融资额度到期日',
          prop: 'financeLimitExpireDate'
        },
        {
          label: '主办人',
          prop: 'sponsor'
        }
      ]
    },
    {
      title: '保理项目方案要素',
      type: 'text',
      children: [
        {
          label: '核心企业',
          prop: 'coreEnterpriseName'
        },
        {
          label: '保理申请人',
          prop: 'factoringApplicantName'
          // type: 'dictType',
          // dictType: 'fund_credit_type',
        },
        {
          label: '债务人',
          prop: 'debtorName'
        },
        {
          label: '保理融资额度金额',
          prop: 'financeLimitAmount',
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
          label: '业务产品',
          prop: 'businessType',
          type: 'dictType',
          dictType: 'proj_dd_type'
        },
        {
          label: '其他业务产品',
          prop: 'businessTypeOther',
          checkShow: true,
          checkKey: 'businessType',
          checkValue: '6'
        },
        {
          label: '保理融资额度期限',
          prop: 'financeLimitPeriod',
          suffix: '个月'
        },
        {
          label: '合同类型',
          prop: 'contractType',
          type: 'dictType',
          dictType: 'proj_dd_contract_type'
        },
        {
          label: '其他合同类型',
          prop: 'contractTypeOther',
          checkShow: true,
          checkKey: 'contractType',
          checkValue: '4'
        },
        {
          label: '保理融资额度类型',
          prop: 'financeLimitType',
          type: 'dictType',
          dictType: 'proj_dd_quota_type'
        },
        {
          label: '增信措施',
          prop: 'creditEnhancementMethod',
          type: 'dictType',
          dictType: 'proj_dd_credit_enhancement'
        },
        {
          label: '其他增信措施',
          prop: 'creditEnhancementMethodOther',
          checkShow: true,
          checkKey: 'creditEnhancementMethod',
          checkValue: '6'
        },
        {
          label: '正常期利率',
          prop: 'normalTermInterestRate',
          suffix: '%/年'
        },
        {
          label: '保理期',
          prop: 'factoringPeriod',
          suffix: '月'
        },
        {
          label: '宽限期利率',
          prop: 'gracePeriodInterestRate',
          suffix: '%/年'
        },
        {
          label: '宽限期',
          prop: 'gracePeriod',
          suffix: '日'
        },
        {
          label: '违约利率',
          prop: 'defaultInterestRate',
          suffix: '%/年'
        },
        {
          label: '本金偿还方式',
          prop: 'principalRepaymentMethod',
          type: 'dictType',
          dictType: 'proj_dd_capital_repay'
        },
        {
          label: '其他本金偿还方式',
          prop: 'principalRepaymentMethodOther',
          checkShow: true,
          checkKey: 'principalRepaymentMethod',
          checkValue: '2'
        },
        {
          label: '付息方式',
          prop: 'interestPaymentMethod',
          type: 'dictType',
          dictType: 'proj_dd_interest_payment'
        },
        {
          label: '其他付息方式',
          prop: 'interestPaymentMethodOther',
          checkShow: true,
          checkKey: 'interestPaymentMethod',
          checkValue: '2'
        },
        {
          label: '付息方',
          prop: 'interestPayer',
          type: 'dictType',
          dictType: 'proj_dd_interest_payer'
        },
        {
          label: '其他付息方',
          prop: 'interestPayerOther',
          checkShow: true,
          checkKey: 'interestPayer',
          checkValue: '4'
        },
        {
          label: '管理费率',
          prop: 'managementRate',
          suffix: '%/年'
        },
        {
          label: '管理费支付方式',
          prop: 'managementPaymentMethod',
          type: 'dictType',
          dictType: 'proj_dd_management_fee'
        },
        {
          label: '其他管理费支付方式',
          prop: 'managementPaymentMethodOther',
          checkShow: true,
          checkKey: 'managementPaymentMethod',
          checkValue: '4'
        },
        {
          label: '付费方',
          prop: 'payingParty',
          type: 'dictType',
          dictType: 'proj_dd_management_fee_payer'
        },
        {
          label: '其他付费方',
          prop: 'payingPartyOther',
          checkShow: true,
          checkKey: 'payingParty',
          checkValue: '4'
        },
        {
          label: '确权方式',
          prop: 'confirmationMethod',
          type: 'dictType',
          dictType: 'proj_dd_confirmation'
        },
        {
          label: '结算账户',
          prop: 'settlementAccount',
          type: 'dictType',
          dictType: 'proj_dd_settlement_account'
        },
        {
          label: '项目方案补充信息',
          prop: 'supplementaryInformation'
        },
        {
          type: 'table',
          prop: 'loanList',
          width: '200vw',
          children: [
            {
              label: '放款节点依据',
              prop: 'loanNodeBasis',
              type: 'dictType',
              dictType: 'proj_dd_loan_basis'
            },
            {
              label: '其他放款节点依据',
              prop: 'loanNodeBasisOther'
            },
            {
              label: '放款比例',
              prop: 'loanRatio'
            },
            {
              label: '确权章',
              prop: 'confirmationSeal',
              type: 'dictType',
              dictType: 'proj_dd_confirmation_seal'
            },
            {
              label: '其他确权章',
              prop: 'confirmationSealOther'
            }
          ]
        }
      ]
    }
  ]);
  return {
    configList
  };
}
