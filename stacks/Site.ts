import { StackContext, AstroSite, use } from 'sst/constructs';
import { WebSocketApi } from './WebSocketApi';

export function Site({ stack }: StackContext) {
	const wsApi = use(WebSocketApi);

	const site = new AstroSite(stack, 'Site', {
		path: 'packages/site',
		bind: [wsApi],
	});
	stack.addOutputs({
		SiteEndpoint: site.url,
	});
}
