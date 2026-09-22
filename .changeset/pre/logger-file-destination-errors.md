---
'@verdaccio/logger': patch
---

Prevent file logging failures from unexpectedly terminating the registry.

In the 9.x asynchronous file logging path, an unsuccessful initial open could leave a
destination registered for process exit and cause `sonic boom is not ready yet`. Setup
now reports the original error and removes only the destination that failed to open;
healthy destinations continue to flush when the process exits.

After a file opens successfully, write and reopen errors are reported as structured
JSON errors on standard error. Error handling remains active for repeated failures,
including synchronous reopen failures during log rotation. Logging can resume after
the destination becomes writable again, and configured redaction also applies to the
error reports. No configuration change is required.
