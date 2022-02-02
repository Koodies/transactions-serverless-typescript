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

    // Filter by merchantType if pathParameters exists
    const merchantType: string = (event.pathParameters?.merchantType) ? event.pathParameters.merchantType.toString() : null;
    const listOfTransactions = (merchantType) ? event.body.transactions.filter(transaction => transaction.merchantType.toLowerCase() === merchantType.toLowerCase()) : event.body.transactions;

    // Find gross sales value & net sales value per merchant
    // Gross Sales Value = Grand Total of all sale transactions
    // Net Sales Value = Gross Sales - sales allowances, returns & discounts
    // Average Order = Gross sales / number of orders
    const mapByMerchantId = groupBy(listOfTransactions, (transaction: Transaction) => transaction.merchantId)
    mapByMerchantId.forEach((transactions: Array<Transaction>, key )=> {
      let gross_sales_value = 0, net_sales_value = 0;
      transactions.forEach((transaction:Transaction) => {
        if(transaction.value > 0) gross_sales_value += transaction.value;
        net_sales_value += transaction.value;
      });
      gross_sales[key] = gross_sales_value.toFixed(2);
      net_sales[key] = net_sales_value.toFixed(2);
      average_order_value[key] = (gross_sales_value/getNumberOfOrders(transactions)).toFixed(2);
    })

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

/**
 * Map array of transations by orderId and return number of orders
 * @param  {Array<Transaction>} array
 * @returns {number}  Number of orders
 */
function getNumberOfOrders(array:Array<Transaction>): number {
  const mapByOrderId = groupBy(array,(transaction: Transaction) => transaction.orderId)
  return mapByOrderId.size
}