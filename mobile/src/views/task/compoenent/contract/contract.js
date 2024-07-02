import { ref } from 'vue';
import { listInfo } from '@/api/flowable/todo.js';

export function useConfigList() {
  const configList = ref([
    {
      title: '合同信息',
      type: 'text',
      children: [
        {
          label: '业务合同号',
          prop: 'contractNo'
        },
        {
          label: '业务产品',
          prop: 'bussProduct',
          type: 'dictType',
          dictType: 'lend_buss_product'
        },
        {
          label: '项目尽调编号',
          prop: 'projectNo'
        },
        {
          label: '项目名称',
          prop: 'projectName'
        },
        {
          label: '合同生效日',
          prop: 'baseContractStartDate'
        },
        {
          label: '合同到期日',
          prop: 'baseContractEndDate'
        },
        {
          label: '用印时间',
          prop: 'baseSealTime'
        },
        {
          label: '宽限期天数',
          prop: 'baseGraceDays',
          suffix: '天'
        },
        {
          label: '利息收取方式',
          prop: 'baseChargeInterestWay',
          type: 'dictType',
          dictType: 'cont_interest_pay'
        },
        {
          label: '结息方式',
          prop: 'baseSettleInterestWay',
          checkShow: true,
          checkKey: 'baseChargeInterestWay',
          type: 'dictType',
          dictType: 'cont_interest_pay_first',
          checkValue: '1'
        },
        {
          label: '结息方式',
          prop: 'baseSettleInterestWay',
          checkShow: true,
          checkKey: 'baseChargeInterestWay',
          checkValue: '2',
          type: 'dictType',
          dictType: 'cont_interest_settlement'
        },
        {
          label: '本金函证方',
          prop: 'basePrincipalConfirmParty',
          type: 'dictType',
          dictType: 'cont_capital_confirmation'
        },
        {
          label: '省份',
          prop: 'baseProvince',
          type: 'dictType',
          dictType: 'province'
        },
        {
          label: '行业类别',
          prop: 'baseIndustryType',
          type: 'dictType',
          dictType: 'cont_industry_type'
        },
        {
          label: '保理标的',
          prop: 'baseItem',
          type: 'dictType',
          dictType: 'lend_item'
        },
        {
          label: '备注',
          prop: 'baseRemark'
        },
        {
          label: '签约状态',
          prop: 'baseSignStatus'
        },
        {
          label: '签约意见',
          prop: 'baseSignOpinion'
        }
      ]
    },
    {
      title: '约定信息',
      type: 'text',
      children: [
        {
          label: '债务人名称',
          prop: 'agreeDebtorName'
        },
        {
          label: '企业客户号',
          prop: 'agreeCompanyNo'
        },
        {
          label: '结算方式',
          prop: 'agreeSettlement',
          type: 'dictType',
          dictType: 'cont_settlement'
        },
        // {
        //   label: '付款期限',
        //   prop: 'agreePaymentLimit',
        //   checkShow: true,
        //   checkKey: 'agreeSettlement',
        //   checkValue: '1'
        // },
        {
          label: '起日',
          prop: 'agreePaymentStartDate',
          checkShow: true,
          checkKey: 'agreeSettlement',
          checkFunc: val => {
            if (val) {
              return val === '2' || val === '3';
            }
            return false;
          }
        },
        {
          label: '迄日',
          prop: 'agreePaymentEndDate',
          checkShow: true,
          checkKey: 'agreeSettlement',
          checkFunc: val => {
            if (val) {
              return val === '2' || val === '3';
            }
            return false;
          }
        },
        {
          label: '付款期限',
          prop: 'agreePaymentLimit',
          checkShow: true,
          checkKey: 'agreeSettlement',
          checkFunc: val => {
            if (val) {
              return val === '2' || val === '3' || val === '1';
            }
            return false;
          }
        },
        {
          label: '对账期限',
          prop: 'agreePaymentVerify',
          checkShow: true,
          checkKey: 'agreeSettlement',
          checkValue: '4'
        },
        {
          label: '初始日',
          prop: 'agreeStartDate',
          checkShow: true,
          checkKey: 'agreeSettlement',
          checkValue: '4'
        },
        {
          label: '最大付款期限',
          prop: 'agreePaymentMaxLimit',
          checkShow: true,
          checkKey: 'agreeSettlement',
          checkFunc: val => {
            if (val) {
              return val === '4' || val === '5';
            }
            return false;
          }
        },
        {
          label: '是否垫款',
          prop: 'agreeAdvance',
          type: 'dictType',
          dictType: 'cont_advance'
        },
        {
          label: '垫款宽限期',
          prop: 'agreeAdvanceGraceDays',
          checkShow: true,
          checkKey: 'agreeAdvance',
          checkValue: '1',
          suffix: '天'
        },
        {
          label: '垫款比例',
          prop: 'agreeAdvancePercentage',
          checkShow: true,
          checkKey: 'agreeAdvance',
          suffix: '%',
          checkValue: '1'
        },
        {
          label: '担保付款期限',
          prop: 'agreeGuaranteePaymentLimit',
          suffix: '天'
        },
        {
          label: '付款方式',
          prop: 'agreePay',
          type: 'dictType',
          dictType: 'cont_pay'
        },
        {
          label: '买方入池上限金额',
          prop: 'agreeBuyerPoolCeiling',
          suffix: '万元'
        },
        {
          label: '超限处理办法',
          prop: 'agreeOverrun',
          type: 'dictType',
          dictType: 'cont_overrun'
        },
        {
          label: '业务类型',
          prop: 'agreeInform',
          type: 'dictType',
          dictType: 'proj_dd_type',
          checkShow: true,
          checkKey: 'agreeInform',
          checkFunc: val => {
            if (val !== null && val !== '' && val !== undefined) {
              return true;
            }
            return false;
          }
        },
        {
          label: '业务类型',
          prop: 'agreeInformOther',
          checkShow: true,
          checkKey: 'agreeInform',
          checkFunc: val => {
            if (val !== null && val !== '' && val !== undefined) {
              return false;
            }
            return true;
          }
        },
        {
          label: '是否全部转让',
          prop: 'agreeTransferPart',
          type: 'dictType',
          dictType: 'cont_transfer_part'
        }
      ]
    },
    {
      title: '利率信息',
      type: 'table',
      prop: 'interestList',
      width: '240vw',
      children: [
        {
          label: '执行方',
          prop: 'customerId',
          type: 'dictType',
          dictType: 'customerId',
          func: () => {
            return new Promise((resolve, reject) => {
              listInfo().then(res => {
                const list = res.rows.map(p => ({
                  label: p.customerName,
                  value: p.customerId
                }));
                resolve(list);
              });
            });
          }
        },
        {
          label: '执行区间',
          prop: 'interestExecSection',
          type: 'dictType',
          dictType: 'cont_interest_exec_section'
        },
        {
          label: '利率类型',
          prop: 'interestType',
          type: 'dictType',
          dictType: 'cont_interest_type'
        },
        {
          label: '固定利率',
          prop: 'interestSolidRate'
        },
        {
          label: '利率种类',
          prop: 'interestFloatingType',
          type: 'dictType',
          dictType: 'cont_interest_floating_type'
        },
        {
          label: '基准利率',
          prop: 'interestBaseRate'
        },
        {
          label: '变动/锁定标志',
          prop: 'interestFloatingLock',
          type: 'dictType',
          dictType: 'cont_interest_floating_lock'
        },
        {
          label: '利率周期',
          prop: 'interestCycle',
          type: 'dictType',
          dictType: 'cont_interest_cycle'
        },
        {
          label: '加减码',
          prop: 'interestPlusMinus',
          type: 'dictType',
          dictType: 'cont_plus_minus'
        },
        {
          label: '加减码浮动方式',
          prop: 'interestPlusMinusFloating',
          type: 'dictType',
          dictType: 'cont_plus_minus_floating'
        },
        {
          label: '执行利率',
          prop: 'interestExecRate'
        }
      ]
    },
    {
      title: '费用信息',
      type: 'table',
      prop: 'feeList',
      width: '180vw',
      children: [
        {
          label: '收费名目',
          prop: 'feeName'
        },
        {
          label: '收费/支付对象',
          prop: 'customerId',
          type: 'dictType',
          dictType: 'customerId',
          func: () => {
            return new Promise((resolve, reject) => {
              listInfo().then(res => {
                const list = res.rows.map(p => ({
                  label: p.customerName,
                  value: p.customerId
                }));
                resolve(list);
              });
            });
          }
        },
        {
          label: '收/支类型',
          prop: 'feeType',
          type: 'dictType',
          dictType: 'cont_fee_type'
        },
        {
          label: '支付方式',
          prop: 'feePayment',
          type: 'dictType',
          dictType: 'cont_fee_payment'
        },
        {
          label: '其他支付方式',
          prop: 'feePaymentOther'
        },
        {
          label: '计费方式',
          prop: 'feeBilling',
          type: 'dictType',
          dictType: 'cont_fee_billing'
        },
        {
          label: '管理费金额/比例',
          prop: 'feeRate'
        }
      ]
    },
    {
      title: '违约利率信息',
      type: 'text',
      children: [
        {
          label: '利率执行方',
          prop: 'branchCustomerId',
          type: 'dictType',
          dictType: 'cont_branch_customer'
        },
        {
          label: '违约金方式',
          prop: 'branchType',
          type: 'dictType',
          dictType: 'cont_branch_type'
        },
        {
          label: '违约利率周期',
          prop: 'branchInterestCycle',
          type: 'dictType',
          dictType: 'cont_branch_interest_cycle'
        },
        {
          label: '违约罚息率',
          prop: 'branchFineRate',
          suffix: '%'
        }
      ]
    },
    {
      title: '账户信息',
      type: 'text',
      children: [
        {
          label: '账户种类',
          prop: 'accountType',
          type: 'dictType',
          dictType: 'cont_account_type'
        },
        {
          label: '户名',
          prop: 'accountName'
        },
        {
          label: '客户名称',
          prop: 'accountCustomerName'
        },
        {
          label: '违债务人名称',
          prop: 'accountDebtorName'
          //suffix: '%'
        },
        {
          label: '开户行',
          prop: 'accountBankName'
        },
        {
          label: '账号',
          prop: 'accountBankAccount'
        },
        {
          label: '备注',
          prop: 'accountRemark'
          //suffix: '%'
        }
      ]
    },
    {
      title: '还款信息',
      type: 'text',
      children: [
        {
          label: '正常贷款',
          prop: 'accountType',
          type: 'list',
          listType: 'paymentSequenceList',
          key: 'repaymentSequenceName'
        }
      ]
    },
    {
      title: '其他',
      type: 'text',
      children: [
        {
          label: '合同编号',
          prop: 'otherContractNo'
        },
        {
          label: '合同名称',
          prop: 'otherContractName'
        },
        {
          label: '币种',
          prop: 'otherCurrencyType',
          type: 'dictType',
          dictType: 'sys_currency_type'
        },
        {
          label: '合同金额',
          prop: 'otherContractAmount'
          //suffix: '%'
        },
        {
          label: '额度上限',
          prop: 'otherQuotaCeiling'
        },
        {
          label: '额度是否循环',
          prop: 'otherQuotaCircle',
          type: 'dictType',
          dictType: 'cont_quota_circle'
        },
        {
          label: '合同生效日',
          prop: 'otherContractStartDate'
          //suffix: '%'
        },
        {
          label: '合同到期日',
          prop: 'otherContractEndDate'
          //suffix: '%'
        },
        {
          label: '说明',
          prop: 'otherRemark'
          //suffix: '%'
        }
      ]
    }
  ]);
  return {
    configList
  };
}
