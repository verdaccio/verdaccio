import { PrettyOptionsExtended, printMessage } from './prettifier';

export type PrettyFactory = (param) => string;

/*
 options eg:
 { messageKey: 'msg', levelFirst: true, prettyStamp: false }
 */

module.exports = function prettyFactory(options: PrettyOptionsExtended): PrettyFactory {
  // the break line must happens in the prettify component
  const breakLike = '\n';
  return (inputData): string => {
    return printMessage(inputData, options, options.colors) + breakLike;
  };
};
