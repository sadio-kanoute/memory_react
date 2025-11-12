(function () {
  'use strict';
  // Runtime shim that rewrites absolute "/assets/..." URLs to relative "./assets/..."
  // so the built bundle works when served from a subfolder (e.g. /memory_react/).
  try {
    // Hook Element.setAttribute to fix src/href set by scripts
    var origSetAttr = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function (name, value) {
      if ((name === 'src' || name === 'href') && typeof value === 'string' && value.indexOf('/assets/') === 0) {
        value = '.' + value;
      }
      return origSetAttr.call(this, name, value);
    };

    // Hook image.src direct assignment
    if (typeof HTMLImageElement !== 'undefined') {
      var imgProto = HTMLImageElement.prototype;
      var imgDesc = Object.getOwnPropertyDescriptor(imgProto, 'src');
      if (imgDesc && imgDesc.set) {
        Object.defineProperty(imgProto, 'src', {
          set: function (v) {
            if (typeof v === 'string' && v.indexOf('/assets/') === 0) v = '.' + v;
            return imgDesc.set.call(this, v);
          },
          get: imgDesc.get,
          configurable: true,
          enumerable: true
        });
      }
    }

    // Hook inline style backgroundImage and setProperty to rewrite urls
    if (typeof CSSStyleDeclaration !== 'undefined') {
      var styleProto = CSSStyleDeclaration.prototype;
      var biDesc = Object.getOwnPropertyDescriptor(styleProto, 'backgroundImage');
      if (biDesc && biDesc.set) {
        Object.defineProperty(styleProto, 'backgroundImage', {
          set: function (v) {
            if (typeof v === 'string' && v.indexOf('/assets/') !== -1) {
              v = v.replace(/url\(['\"]?\/assets\//g, "url('./assets/");
            }
            return biDesc.set.call(this, v);
          },
          get: biDesc.get,
          configurable: true,
          enumerable: true
        });
      }

      var origSetProperty = styleProto.setProperty;
      if (origSetProperty) {
        styleProto.setProperty = function (prop, value, priority) {
          if (typeof value === 'string' && value.indexOf('/assets/') !== -1) {
            value = value.replace(/url\(['\"]?\/assets\//g, "url('./assets/");
          }
          return origSetProperty.call(this, prop, value, priority);
        };
      }
    }
  } catch (e) {
    // fail silently - do not break the page
    try { console && console.error && console.error('asset-path-shim error', e); } catch (ee) {}
  }
})();
