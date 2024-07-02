import { ref } from 'vue';

export function useConfigList() {
  const configList = ref([
    {
      title: '放款信息',
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
          prop: 'dueNo'
        },
        {
          label: '放款币种',
          prop: 'loanCurrency',
          checkShow: true,
          checkKey: 'loanCurrency',
          type: 'dictType',
          dictType: 'cont_pay',
          checkFunc: val => {
            if (val) {
              return true;
            }
            return false;
          }
        },
        {
          label: '放款币种',
          prop: 'otherCurrencyType',
          checkShow: true,
          checkKey: 'loanCurrency',
          type: 'dictType',
          dictType: 'cont_pay',
          checkFunc: val => {
            if (val) {
              return false;
            }
            return true;
          }
        },
        {
          label: '放款编号',
          prop: 'loanNo'
        },
        {
          label: '债务人',
          prop: 'agreeDebtorName'
        },
        {
          label: '应收账款同意书编号',
          prop: 'agreementNo'
        },
        {
          label: '已申请未受理金额',
          prop: 'applyNotAcceptAmount'
        },
        {
          label: '最高可放款金额',
          prop: 'mostLoanAmount'
        },
        {
          label: '放款方式',
          prop: 'loanWay',
          checkShow: true,
          checkKey: 'loanWay',
          type: 'dictType',
          dictType: 'sys_currency_type',
          checkFunc: val => {
            if (val) {
              return true;
            }
            return false;
          }
        },
        {
          label: '放款方式',
          prop: 'agreePay',
          checkShow: true,
          checkKey: 'loanWay',
          type: 'dictType',
          dictType: 'sys_currency_type',
          checkFunc: val => {
            if (val) {
              return false;
            }
            return true;
          }
        },
        {
          label: '利息收取方式',
          prop: 'chargeInterestWay',
          checkShow: true,
          checkKey: 'chargeInterestWay',
          type: 'dictType',
          dictType: 'cont_interest_pay',
          checkFunc: val => {
            if (val) {
              return true;
            }
            return false;
          }
        },
        {
          label: '利息收取方式',
          prop: 'baseChargeInterestWay',
          checkShow: true,
          checkKey: 'chargeInterestWay',
          type: 'dictType',
          dictType: 'cont_interest_pay',
          checkFunc: val => {
            if (val) {
              return false;
            }
            return true;
          }
        },
        {
          label: '结息方式',
          prop: 'settleInterestWay',
          checkShow: true,
          checkKey: 'settleInterestWay',
          type: 'dictType',
          dictType: 'cont_interest_settlement',
          checkFunc: val => {
            if (val) {
              return true;
            }
            return false;
          }
        },
        {
          label: '结息方式',
          prop: 'baseSettleInterestWay',
          checkShow: true,
          checkKey: 'settleInterestWay',
          type: 'dictType',
          dictType: 'cont_interest_settlement',
          checkFunc: val => {
            if (val) {
              return false;
            }
            return true;
          }
        },
        {
          label: '利息扣收',
          prop: 'interestDeduction'
        },
        {
          label: '费用扣收',
          prop: 'feeDeduction'
        },
        {
          label: '单据号/发票号',
          prop: 'invoiceNumber'
        },
        {
          label: '单据类型',
          prop: 'documentType',
          type: 'dictType',
          dictType: 'lend_doc_type'
        },
        {
          label: '执行利率（%）',
          prop: 'strikeRate'
        },
        {
          label: '宽限期利率（%）',
          prop: 'gracePeriodInterestRate'
        },
        {
          label: '保理标的',
          prop: 'factoringTarget',
          checkShow: true,
          checkKey: 'factoringTarget',
          type: 'dictType',
          dictType: 'lend_item',
          checkFunc: val => {
            if (val) {
              return true;
            }
            return false;
          }
        },
        {
          label: '保理标的',
          prop: 'baseItem',
          checkShow: true,
          checkKey: 'factoringTarget',
          type: 'dictType',
          dictType: 'lend_item',
          checkFunc: val => {
            if (val) {
              return false;
            }
            return true;
          }
        },
        {
          label: '预收利息',
          prop: 'interest'
        },
        {
          label: '预计放款日',
          prop: 'loanExpectDate'
        },
        {
          label: '放款到期日',
          prop: 'loanExpireDate'
        },
        {
          label: '宽限期天数',
          prop: 'gracePeriodInterestDay',
          checkShow: true,
          checkKey: 'gracePeriodInterestDay',
          checkFunc: val => {
            if (val) {
              return true;
            }
            return false;
          }
        },
        {
          label: '宽限期天数',
          prop: 'baseGraceDays',
          checkShow: true,
          checkKey: 'gracePeriodInterestDay',
          checkFunc: val => {
            if (val) {
              return false;
            }
            return true;
          }
        },
        {
          label: '转让区间，开始',
          prop: 'transferStart'
        },
        {
          label: '转让区间，结束',
          prop: 'transferEnd'
        },
        {
          label: '是否定向付款',
          prop: 'isDirect',
          type: 'dictType',
          dictType: 'sys_yes_no'
        },
        {
          label: '可转让金额',
          prop: 'transferAmount'
        },
        {
          label: '收款账号',
          prop: 'paymentAccount',
          checkShow: true,
          checkKey: 'isDirect',
          checkValue: 'N'
        },
        {
          label: '定向付款人名称',
          prop: 'directName',
          checkShow: true,
          checkKey: 'isDirect',
          checkValue: 'Y'
        },
        {
          label: '定向付款账号开户行',
          prop: 'directBank',
          checkShow: true,
          checkKey: 'isDirect',
          checkValue: 'Y'
        },
        {
          label: '定向付款账号',
          prop: 'directAccount',
          checkShow: true,
          checkKey: 'isDirect',
          checkValue: 'Y'
        },
        {
          label: '本次申请放款金额',
          prop: 'loanAmountApply'
        },
        {
          label: '综合收益',
          prop: 'comprehensiveIncome'
        },
        {
          label: '备注',
          prop: 'remark'
        }
      ]
    },
    {
      title: '收支信息',
      type: 'table',
      prop: 'accountList',
      width: '180vw',
      children: [
        {
          label: '账号类型',
          prop: 'accountType'
        },
        {
          label: '收支对象名称',
          prop: 'targetName'
          // type: 'dictType',
          // dictType: 'customerId',
          // func: () => {
          //   return new Promise((resolve, reject) => {
          //     listInfo().then(res => {
          //       const list = res.rows.map(p => ({ label: p.customerName, value: p.customerId}))
          //       resolve(list)
          //     })
          //   })
          // }
        },
        {
          label: '收支账号',
          prop: 'account'
          // type: 'dictType',
          // dictType: 'cont_fee_type'
        },
        {
          label: '收支金额',
          prop: 'amount'
        }
      ]
    },
    {
      title: '应收信息',
      type: 'table',
      prop: 'voucherList',
      width: '240vw',
      children: [
        {
          label: '操作',
          prop: 'voucherNo',
          type: 'custom',
          func: () => {
            return '凭证明细 单证查询 发票查询';
          }
        },
        {
          label: '凭证号码',
          prop: 'voucherNo'
        },
        {
          label: '到期日',
          prop: 'dueDate'
        },
        {
          label: '应收账款金额',
          prop: 'debtReceivableAmount'
        },
        {
          label: '应收账款余额',
          prop: 'debtReceivableBalance'
        },
        {
          label: '融资比例',
          prop: 'financingRatio'
        },
        {
          label: '可融资金额',
          prop: 'voucherAmount'
        },
        {
          label: '可融资余额',
          prop: 'coalTon'
        },
        {
          label: '本次融资金额',
          prop: 'financingAmount'
        }
      ]
    },
    {
      title: '费用信息',
      type: 'table',
      prop: 'feeList',
      width: '240vw',
      children: [
        {
          label: '费用名目',
          prop: 'feeName'
        },
        {
          label: '是否本次收取',
          prop: 'isCharge',
          type: 'dictType',
          dictType: 'sys_yes_no'
        },
        {
          label: '收费/支付对象',
          prop: 'customerId'
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
          prop: 'feebilling',
          type: 'dictType',
          dictType: 'cont_fee_billing'
        },
        {
          label: '管理费金额/比例',
          prop: 'feeRate'
        }
      ]
    }
  ]);
  return {
    configList
  };
}
