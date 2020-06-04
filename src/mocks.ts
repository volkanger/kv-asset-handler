const makeServiceWorkerEnv = require('service-worker-mock')

const HASH = '123HASHBROWN'

export const getEvent = (request: Request): any => {
  const waitUntil = async (callback: any) => {
    await callback
  }
  return {
    request,
    waitUntil,
  }
}
const store: any = {
  'key1.123HASHBROWN.txt': 'val1',
  'key1.123HASHBROWN.png': 'val1',
  'index.123HASHBROWN.html': 'index.html',
  'cache.123HASHBROWN.html': 'cache me if you can',
  '测试.123HASHBROWN.html': 'My filename is non-ascii',
  'nohash.txt': 'no hash but still got some result',
  'sub/blah.123HASHBROWN.png': 'picturedis',
  'sub/index.123HASHBROWN.html': 'picturedis',
  'client.123HASHBROWN': 'important file',
  'client.123HASHBROWN/index.html': 'Im here but serve my big bro above',
}
export const mockKV = (store: any) => {
  return {
    get: (path: string) => store[path] || null,
  }
}

export const mockManifest = () => {
  return JSON.stringify({
    'key1.txt': `key1.${HASH}.txt`,
    'key1.png': `key1.${HASH}.png`,
    'cache.html': `cache.${HASH}.html`,
    '测试.html': `测试.${HASH}.html`,
    'index.html': `index.${HASH}.html`,
    'sub/blah.png': `sub/blah.${HASH}.png`,
    'sub/index.html': `sub/index.${HASH}.html`,
    'client': `client.${HASH}`,
    'client/index.html': `client.${HASH}`,
  })
}
let cacheStore: any = {}
export const mockCaches = () => {
  return {
    default: {
      match: (key: Request) => {
        const url = key.url
        return cacheStore[url] || null
      },
      put: (key: Request, val: Response) => {
        let headers = new Headers(val.headers)
        let resp = new Response(val.body, { headers })
        const url = key.url
        return (cacheStore[url] = resp)
      },
    },
  }
}

export function mockGlobal() {
  Object.assign(global, makeServiceWorkerEnv())
  Object.assign(global, { __STATIC_CONTENT_MANIFEST: mockManifest() })
  Object.assign(global, { __STATIC_CONTENT: mockKV(store) })
  Object.assign(global, { caches: mockCaches() })
}
export const sleep = (milliseconds: number) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}
