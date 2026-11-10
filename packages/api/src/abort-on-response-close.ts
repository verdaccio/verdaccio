import type { Readable } from 'node:stream';

type ClosableResponse = {
  writableFinished: boolean;
  on(event: 'close', listener: () => void): unknown;
};

/** Abort storage work and destroy a piped download when the client disconnects mid-response. */
export function abortOnResponseClose(
  res: ClosableResponse,
  abort: AbortController,
  stream: Pick<Readable, 'destroy'>,
  onDisconnect?: () => void
): void {
  res.on('close', () => {
    if (res.writableFinished || abort.signal.aborted) {
      return;
    }
    onDisconnect?.();
    abort.abort();
    stream.destroy();
  });
}
