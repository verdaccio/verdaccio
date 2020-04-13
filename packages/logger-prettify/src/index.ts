import { printMessage } from "./formatter";
import {PrettyOptionsExtended} from "./types";

export type PrettyFactory = (param) => string;

/*
 options eg:
 { messageKey: 'msg', levelFirst: true, prettyStamp: false }
 */

module.exports = function prettyFactory (options: PrettyOptionsExtended): PrettyFactory  {
	// the break line must happens in the prettify component
	const breakLike = '\n';
	return (inputData): string => {
		// FIXME: review colors by default is true
		return printMessage(inputData, options, true) + breakLike;
	};
};
