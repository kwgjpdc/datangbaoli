import { ref } from 'vue';
export function useCustomerList() {
  const customerList = ref([
    {
      title: '客户证照信息',
      type: 'table',
      prop: 'customerCardList',
      width: '100%',
      children: [
        {
          label: '证件类型',
          prop: 'cardType',
          type: 'dictType',
          dictType: 'cont_card_type'
        },
        {
          label: '证件号码',
          prop: 'cardNo'
        },
        {
          label: '永久有效',
          prop: 'cardIfPermanent',
          type: 'custom',
          func: val => {
            if (val == '1') {
              return '是';
            }
            if (val == '2') {
              return '否';
            }
            return '';
          }
        }
      ]
    },
    {
      title: '客户股东信息',
      type: 'table',
      prop: 'customerShareholderList',
      width: '160vw',
      children: [
        {
          label: '股东名称',
          prop: 'shareholderName'
        },
        {
          label: '入股币种',
          prop: 'shareholderCurrencyType',
          type: 'dictType',
          dictType: 'cont_shareholder_currency_type'
        },
        {
          label: '出资额',
          prop: 'shareholderContribution'
        },
        {
          label: '占比 (%)',
          prop: 'shareholderPercentage'
        },
        {
          label: '到位率 (%)',
          prop: 'shareholderContributionAvailable'
        }
      ]
    },
    {
      title: '客户经营住所',
      type: 'table',
      prop: 'customerResidenceList',
      width: '120vw',
      children: [
        {
          label: '行政区划',
          prop: 'residenceAdministrativeDivision'
        },
        {
          label: '联系地址',
          prop: 'residenceAddress'
        },
        {
          label: '联系电话',
          prop: 'residencePhone'
        },
        {
          label: '邮政编码',
          prop: 'residencePostcode'
        }
      ]
    },
    {
      title: '客户高管信息',
      type: 'table',
      prop: 'customerSeniorExecutiveList',
      width: '100vw',
      children: [
        {
          label: '高管名称',
          prop: 'seniorExecutiveName'
        },
        {
          label: '职务',
          prop: 'seniorExecutiveDuty'
        },
        {
          label: 'qq邮箱',
          prop: 'seniorExecutiveMailbox'
        },
        {
          label: '微信账号',
          prop: 'seniorExecutiveWechat'
        }
      ]
    },
    {
      title: '客户税务信息',
      type: 'table',
      prop: 'customerTaxList',
      width: '120vw',
      children: [
        {
          label: '纳税人识别号',
          prop: 'taxpayerIdentificationNumber'
        },
        {
          label: '类型',
          prop: 'taxType',
          type: 'dictType',
          dictType: 'cont_tax_type'
        },
        {
          label: '开户行',
          prop: 'taxBank'
        },
        {
          label: '账号',
          prop: 'taxAccount'
        }
      ]
    }
  ]);
  return {
    customerList
  };
}
