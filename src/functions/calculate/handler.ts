import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';

interface Transaction {
    transactionId: string,
    orderId: string,
    merchantId: string,
    merchantType: string,
    value: number
}

const calculate: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    let gross_sales = {}, net_sales = {}, average_order_value = {}

    // Find gross sales value & net sales value per merchant
    // Gross Sales Value = Grand Total of all sale transactions
    // Net Sales Value = Gross Sales - sales allowances, returns & discounts
    const mapByMerchantId = groupBy(event.body.transactions, (transaction: Transaction) => transaction.merchantId)
    mapByMerchantId.forEach((transactions: Array<Transaction>, key )=> {
      let gross_sales_value = 0, net_sales_value = 0;
      transactions.forEach((transaction:Transaction) => {
        if(transaction.value > 0) gross_sales_value += transaction.value;
        net_sales_value += transaction.value;
      });
      gross_sales[key] = gross_sales_value.toFixed(2);
      net_sales[key] = net_sales_value.toFixed(2);
    })

    // Find average order value per merchant
    // Average Order = Gross sales / number of orders

    return formatJSONResponse({
        gross_sales,
        net_sales,
        average_order_value
    });
};

export const main = middyfy(calculate);

function groupBy(array, keyGetter) {
  const map = new Map();
  array.forEach((item) => {
       const key = keyGetter(item);
       const collection = map.get(key);
       if (!collection) {
           map.set(key, [item]);
       } else {
           collection.push(item);
       }
  });
  return map;
}