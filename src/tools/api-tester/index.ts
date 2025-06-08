import { Artboard } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Api Tester',
  path: '/api-tester',
  description: 'Test and debug APIs with ease using this tool. Send requests, view responses, and analyze data.',
  keywords: ['api', 'tester', 'debug', 'request', 'response', 'http', 'rest', 'json'],
  component: () => import('./api-tester.vue'),
  icon: Artboard,
  createdAt: new Date('2025-06-08'),
});
