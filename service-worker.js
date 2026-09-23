/* service-worker.js — وضع التنظيف (v5) */
'use strict';

/* ============================================================
   هذا الملف في وضع التنظيف:
   - يحذف كل الكاشات القديمة
   - يلغي تسجيل نفسه
   - ثم يعيد تحميل الصفحة تلقائياً
   - بعد هذه المرة، المتصفح يعمل بشكل طبيعي
   ============================================================ */

self.addEventListener('install', function(){
  self.skipWaiting();
});

self.addEventListener('activate', function(event){
  event.waitUntil(
    caches.keys()
      .then(function(keys){
        return Promise.all(
          keys.map(function(k){ return caches.delete(k); })
        );
      })
      .then(function(){
        return self.registration.unregister();
      })
      .then(function(){
        return self.clients.matchAll();
      })
      .then(function(clients){
        clients.forEach(function(c){
          try { c.navigate(c.url); } catch(e) {}
        });
      })
      .catch(function(e){
        console.error('[SW] cleanup failed:', e);
      })
  );
});

/* كل الطلبات تمر مباشرة للشبكة بدون كاش */
self.addEventListener('fetch', function(event){
  event.respondWith(fetch(event.request));
});
