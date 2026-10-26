# Third-party components

- Firebase JavaScript SDK 11.10.0, Google LLC. Apache License 2.0. Bundled from the official `firebase` npm package. License notices are preserved in js/vendor/firebase-*.js. The app import in Auth and Database was changed from the official CDN to the identical bundled local firebase-app.js. Source-map comments were removed because maps are not distributed. https://github.com/firebase/firebase-js-sdk/blob/main/LICENSE
- QR Code Generator 1.4.4, Kazuhiko Arase. MIT License. Bundled unchanged from the official `qrcode-generator` npm package; copyright and license notice in js/vendor/qrcode.js. https://github.com/kazuhikoarase/qrcode-generator
- SVG clothing, characters and ornaments are original educational artwork made for this project. No external image API, remote image tracking or emoji clothing is used.
- Development-only dependencies are listed and pinned by package-lock.json. They are not executed by the published website.
