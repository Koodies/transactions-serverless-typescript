import schema from './schema';
import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'calculate/{merchantType}',
        request: {
          schemas: {
            'application/json': schema,
          },
        },
      }
    },
    {
      http: {
        method: 'post',
        path: 'calculate',
        request: {
          schemas: {
            'application/json': schema,
          },
        },
      }
    },
  ],
};