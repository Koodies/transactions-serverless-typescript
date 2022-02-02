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
    const transactions: Array<Transaction> = event.body.transactions;
    let gross_sales = {}, net_sales = {}, average_order_value = {}

    // Find gross sales value & net sales value per merchant
    // Gross Sales Value = Grand Total of all sale transactions
    // Net Sales Value = Gross Sales - sales allowances, returns & discounts
    transactions.forEach((transaction: Transaction): void => {
        if (!gross_sales[transaction.merchantId]) {
            if (transaction.value > 0) gross_sales[transaction.merchantId] = transaction.value;
            net_sales[transaction.merchantId] = transaction.value;
        } else {
            if (transaction.value > 0) gross_sales[transaction.merchantId] = gross_sales[transaction.merchantId] + transaction.value;
            net_sales[transaction.merchantId] = net_sales[transaction.merchantId] + transaction.value;
        }
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