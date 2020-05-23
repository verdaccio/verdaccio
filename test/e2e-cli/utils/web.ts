import fetch, { RequestInit, Response } from 'node-fetch';


export async function callRegistry(url: string): Promise<string> {
	const options: RequestInit = {
		headers:{ 'Accept': 'application/json' }
	}
	const response: Response = await fetch(url, options);

	if(response.ok){
		return await response.json();
	}

	throw new Error(`Requesting "${url}" returned status code ${response.status}.`);
}
