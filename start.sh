#!/bin/sh
# Starts both processes; if either one dies, this script exits, which
# makes the whole container exit — Render then restarts it automatically
# via its health check on the public port. That's the "auto-restart"
# equivalent of what two separate Render services gave you for free.
set -e

# The Dockerfile sets PORT=3000 globally for Next's server.js — override
# it just for this child process so Express binds to 5000 instead of
# fighting Next for the same port.
PORT=5000 node apps/api/src/index.js &
API_PID=$!

node apps/web/server.js &
WEB_PID=$!

wait -n "$API_PID" "$WEB_PID"
exit $?
