import type { Readable } from 'node:stream';

type ClosableResponse = {
  writableFinished: boolean;
  destroyed: boolean;
  on(event: 'close', listener: () => void): unknown;
};

/** Abort storage work and destroy a piped download when the client disconnects mid-response. */
export function abortOnResponseClose(
  res: ClosableResponse,
  abort: AbortController,
  stream: Pick<Readable, 'destroy'>,
  onDisconnect?: () => void
): void {
  const onClose = (): void => {
    if (res.writableFinished || abort.signal.aborted) {
      return;
    }
    onDisconnect?.();
    abort.abort();
    stream.destroy();
  };
  if (res.destroyed) {
    onClose();
    return;
  }
  res.on('close', onClose);
}
