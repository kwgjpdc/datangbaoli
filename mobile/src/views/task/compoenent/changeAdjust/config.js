import { ref } from 'vue';
import { formatMoney, formatPercent } from '@/utils/tool';

export function useConfigList() {
  const basicConfig = ref([
    {
      title: '基本信息',
      type: 'text',
      children: [
        {
          label: '应收账款金额',
          prop: 'debtReceivableAmount'
        },
        {
          label: '总应收账款总余额',
          prop: 'debtReceivableBalance'
        },
        {
          label: '调整后应收账款金额',
          prop: 'debtReceivableAmountNew'
        },
        {
          label: '调整后总金额',
          prop: 'debtReceivableBalanceNew'
        },
        {
          label: '放款比例(%)',
          prop: 'loanRatio'
        },
        {
          label: '应收账款到期日',
          prop: 'dueDate'
        }
      ]
    },
    {
      title: '应收帐款信息',
      type: 'table',
      prop: 'list',
      width: '300vw',
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
          // type: 'custom',
          // func: (val) => {
          //   return formatMoney(val);
          // }
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
          label: '调整后应收账款金额',
          prop: 'debtReceivableAmountNew'
        },
        {
          label: '调整后应收账款余额',
          prop: 'debtReceivableBalanceNew'
        },
        {
          label: '放款比例',
          prop: 'loanRatio'
        },
        {
          label: '煤炭吨数',
          prop: 'coalTon'
        },
        {
          label: '单价(元/吨)',
          prop: 'price'
        }
      ]
    }
  ]);

  return {
    basicConfig
  };
}
