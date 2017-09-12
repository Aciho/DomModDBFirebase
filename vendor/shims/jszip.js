(function() {
  function vendorModule() {
    'use strict';

    return {
      'default': self['jszip'],
      __esModule: true,
    };
  }

  define('jszip', [], vendorModule);
})();
