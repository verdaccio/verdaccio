import { PrettyOptions } from "pino";

import { printMessage } from "./formatter";

export type PrettyFactory = (param) => string;

module.exports = function prettyFactory (options: PrettyOptions): PrettyFactory  {
	// the break line must happens in the prettify component
	const breakLike = '\n';
	return (inputData): string => {
		return printMessage(inputData, true) + breakLike;
	};
};
