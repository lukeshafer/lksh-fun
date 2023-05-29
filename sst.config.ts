import { SSTConfig } from 'sst';
import { API } from './stacks/Api';
import { Site } from './stacks/Site';

export default {
	config(_input) {
		return {
			name: 'lksh-fun',
			region: 'us-east-2',
		};
	},
	stacks(app) {
		app.stack(API).stack(Site);
	},
} satisfies SSTConfig;
