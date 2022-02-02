export default {
  type: "object",
  properties: {
    transactions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          transactionId: { type: 'string' },
          orderId: { type: 'string' },
          merchantId: { type: 'string' },
          merchantType: { type: 'string' },
          value: { type: 'number' }
        }
      }
    }
  },
  required: ['transactions']
} as const;