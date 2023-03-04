import { Readable, Transform } from 'stream';

/**
 * Converts a buffer stream to a string.
 */
const readableToString = async (stream: Readable) => {
  const chunks: Buffer[] = [];
  for await (let chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }
  const buffer = Buffer.concat(chunks);
  const str = buffer.toString('utf-8');
  return str;
};

/**
 * Transform stream object  mode to string
 **/
const transformObjectToString = () => {
  return new Transform({
    objectMode: true,
    transform: (chunk, encoding, callback) => {
      callback(null, JSON.stringify(chunk));
    },
  });
};

export { readableToString, transformObjectToString };
