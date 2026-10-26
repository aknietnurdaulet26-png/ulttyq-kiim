// Local emulators only: do not route loopback requests through workstation proxies.
import {spawnSync} from 'node:child_process';
const env=Object.fromEntries(Object.entries(process.env).filter(([k])=>!/proxy/i.test(k)));
env.NODE_USE_ENV_PROXY='0';
const run=spawnSync(process.execPath,['--test','tests/rules.test.mjs','tests/auth.test.mjs'],{env,stdio:'inherit'});
process.exit(run.status??1);
