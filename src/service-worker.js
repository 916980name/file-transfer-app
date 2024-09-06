import { clientsClaim } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';

clientsClaim();
/* eslint-disable-next-line no-restricted-globals */
precacheAndRoute(self.__WB_MANIFEST);

const CACHE_NAME = 'file-transfer-cache-v1';
const INITIAL_RESOURCES_TO_CACHE = [
  '/user',
  '/user/file',
  '/user/message',
];

// On install, fill the cache with the initial resources.
/* eslint-disable-next-line no-restricted-globals */
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    cache.addAll(INITIAL_RESOURCES_TO_CACHE);
  })());
});

// On fetch events, do a network-first approach, so we can more easily work on the app for the time being.
/* eslint-disable-next-line no-restricted-globals */
self.addEventListener('fetch', event => {
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);

    try {
      const fetchResponse = await fetch(event.request);

      // And return it.
      return fetchResponse;
    } finally {

      // Nothing in cache, let's go to the error page.
      if (event.request.mode === 'navigate') {
        const errorResponse = await cache.match('error.html');
        return errorResponse;
      }
    }
  })());
});