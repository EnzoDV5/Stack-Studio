// Loaded with `node --import` before the tests run: registers the resolve hook.
import { register } from 'node:module'

register('./test-hooks.mjs', import.meta.url)
