import { SSTConfig } from 'sst';
import { API } from './stacks/Api';
import { Site } from './stacks/Site';
import { WebSocketApi } from './stacks/WebSocketApi';

export default {
	config(_input) {
		return {
			name: 'lksh-fun',
			region: 'us-east-2',
		};
	},
	stacks(app) {
		app.stack(API).stack(WebSocketApi).stack(Site);
	},
} satisfies SSTConfig;
