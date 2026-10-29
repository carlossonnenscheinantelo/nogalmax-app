/* NOGALMAX — service worker: notificaciones en el celular */
self.addEventListener('install', function(e){ self.skipWaiting(); });
self.addEventListener('activate', function(e){ e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function(e){ /* sin caché: la app siempre se carga en línea */ });
self.addEventListener('push', function(e){
  var d = {};
  try { d = e.data ? e.data.json() : {}; } catch(_) { d = {title:'NOGALMAX', body: e.data ? e.data.text() : ''}; }
  e.waitUntil(self.registration.showNotification(d.title || 'NOGALMAX', {
    body: d.body || '',
    tag: d.tag || 'nogalmax',
    renotify: true,
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    data: {tab: d.tab || ''}
  }));
});
self.addEventListener('notificationclick', function(e){
  e.notification.close();
  var tab = (e.notification.data && e.notification.data.tab) || '';
  var url = self.registration.scope + (tab ? '#' + tab : '');
  e.waitUntil(self.clients.matchAll({type:'window', includeUncontrolled:true}).then(function(list){
    for (var i = 0; i < list.length; i++) {
      var c = list[i];
      if (c.url.indexOf(self.registration.scope) === 0 && 'focus' in c) {
        c.postMessage({tab: tab});
        return c.focus();
      }
    }
    return self.clients.openWindow(url);
  }));
});
