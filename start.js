// Runs both processes and supervises them — if either one exits for any
// reason (crash or otherwise), this kills the other and exits too, so the
// container as a whole stops and Render restarts it. Written in plain
// Node instead of a shell script because Alpine's default /bin/sh doesn't
// support the "wait for whichever process exits first" behavior a shell
// script would need (that's a Bash-only feature).
const { spawn } = require("node:child_process");

function run(command, args, env) {
  return spawn(command, args, { stdio: "inherit", env: { ...process.env, ...env } });
}

const api = run("node", ["apps/api/src/index.js"], { PORT: "5000" });
const web = run("node", ["apps/web/server.js"]);

let exiting = false;
function shutdown(exitCode) {
  if (exiting) return;
  exiting = true;
  api.kill();
  web.kill();
  process.exit(exitCode ?? 1);
}

api.on("exit", (code) => shutdown(code));
web.on("exit", (code) => shutdown(code));
