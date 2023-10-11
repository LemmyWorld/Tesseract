// Router
import { router } from './server/router.js'

// Route Handlers
import { fediseer_router }      from './lib/fediseer/server.js'
import { image_proxy }          from './server/image-proxy.js'
import { proxy_pictrs_upload }  from './server/upload-image.js'

// Routes
const api = '/tesseract/api'
const routes = [
    {
        route: '/cors/*',
        handler: proxy_pictrs_upload
    },

    {
        route: '/image_proxy/*',
        handler: image_proxy
    },
    {
        route: `${api}/fediseer*`,
        handler: fediseer_router
    },
    
]

// Svelte Handler
export async function handle({event, resolve }) {
    
    // Send the defined server-side routes to their handlers 
    const routed =  await router(event, resolve, routes)
    if (routed) return routed

    // Other server hooks can go here


    // Resolve the event if it hasn't already
    const response = await resolve(event)
    return response
}



export function handleError({ error, event }) {
    console.error(error)
    return {
        message: 'There was an error during rendering',
    }
}


// Scheduled Tasks

//// Update TTLs in memory cache once per second
import { cache as MemoryCache} from '$lib/cache/memory.js'

const task_memoryCache = setInterval(() => {
    MemoryCache.tick();
}, 1000);


//// Image Proxy Cache
import { cache as imageCache} from './server/filesystem-cache'
import { 
    ENABLE_MEDIA_CACHE,
    MEDIA_CACHE_HOUSEKEEP_INTERVAL,
    MEDIA_CACHE_HOUSEKEEP_STARTUP,
    MEDIA_CACHE_KEEP_HOT_ITEMS,
    MEDIA_CACHE_DURATION,
    MEDIA_CACHE_MAX_SIZE,
} from '$lib/settings'


if (ENABLE_MEDIA_CACHE) {
    const cacheDir = '/app/cache';
    const cacheInit = await imageCache.init(
        cacheDir, MEDIA_CACHE_MAX_SIZE, MEDIA_CACHE_DURATION, MEDIA_CACHE_KEEP_HOT_ITEMS
    );
    
    if (cacheInit) { 
        console.log(`Initialized image proxy cache at ${cacheDir}`) 
        
        // Run housekeeping at startup, if option set, instead of waiting for the first interval run
        if (MEDIA_CACHE_HOUSEKEEP_STARTUP) await imageCache.housekeep();

        const task_imageCache = setInterval(async () => {
            console.log("Housekeeping image proxy cache...");
            await imageCache.housekeep();

        }, (MEDIA_CACHE_HOUSEKEEP_INTERVAL * 60 * 1000))
    }
    else {
        console.log(`Failed to initialize image proxy cache at ${cacheDir}.  Caching is disabled`)
    }
}

console.log("Starting Tesseract server");