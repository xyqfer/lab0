this.addEventListener('fetch', function (event) {
    const { request } = event;
    const fetchResource = () => {
        return fetch(request);
    };
    const cacheList = [
        'ddrk.me',
        'cdn.staticfile.org',
        'vip1.loli.net',
    ];

    if (request.method === 'GET') {
        const url = new URL(request.url);
        const allowCache = cacheList.some((item) => {
            return item === url.hostname;
        });

        if (allowCache) {
            event.respondWith(
                caches.match(request).then(res => {
                  return res ||
                    fetchResource()
                      .then(responese => {
                        const responeseClone = responese.clone();
                        caches.open('ddrk_v1').then(cache => {
                          cache.put(request, responeseClone);
                        })
                        return responese;
                      })
                      .catch(err => {
                        console.log(err);
                      });
                })
            );
        } else {
            event.respondWith(fetchResource());
        }
    } else {
        event.respondWith(fetchResource());
    }
});
  