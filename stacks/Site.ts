import { StackContext, AstroSite } from 'sst/constructs';

export function Site({ stack }: StackContext) {
	const site = new AstroSite(stack, 'Site', {
		path: 'packages/site',
	});
	stack.addOutputs({
		SiteEndpoint: site.url,
	});
}
