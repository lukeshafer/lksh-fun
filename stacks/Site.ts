import { StackContext, AstroSite } from 'sst/constructs';

export function Site({ stack }: StackContext) {
	const site = new AstroSite(stack, 'Site');
	stack.addOutputs({
		SiteEndpoint: site.url,
	});
}
