import { StackContext, AstroSite, use } from 'sst/constructs';
import { FridgeMagnetsStack } from './FridgeMagnets';

export function Site({ stack }: StackContext) {
	const fridgeMagnetsStack = use(FridgeMagnetsStack);

	const site = new AstroSite(stack, 'Site', {
		path: 'packages/site',
		bind: [fridgeMagnetsStack.wsApi],
	});
	stack.addOutputs({
		SiteEndpoint: site.url,
	});
}
