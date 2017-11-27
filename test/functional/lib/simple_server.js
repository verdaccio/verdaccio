// @flow
import express from 'express';
import bodyParser from 'body-parser';

export class ExpressServer {
	static start(): Promise<any> {
		return new Promise(function(resolve, reject) {
			const app = express();

			app.use(bodyParser.json());
			app.use(bodyParser.urlencoded({
				extended: true
			}));

			app.listen(55550, function starExpressServer() {
				resolve();
			});
		});
	}
}
