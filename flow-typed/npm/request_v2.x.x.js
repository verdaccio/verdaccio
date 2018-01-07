declare function request(options: any, callback: any): Promise<any>;

declare module 'request' {
	declare module.exports: request
}