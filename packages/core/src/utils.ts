export function safeJSONParse(str: string, fallback?: any): unknown {
	try {
		return JSON.parse(str);
	} catch {
		return fallback;
	}
}
