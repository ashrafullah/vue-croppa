/*
 * vue-croppa v0.2.2
 * https://github.com/zhanziyang/vue-croppa
 * 
 * Copyright (c) 2017 zhanziyang
 * Released under the ISC license
 */
  
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Croppa = factory());
}(this, (function () { 'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var index = createCommonjsModule(function (module, exports) {
(function (root, factory) {
    if (typeof undefined === 'function' && undefined.amd) {
        undefined([], factory);
    } else {
        module.exports = factory();
    }
}(commonjsGlobal, function () {
  'use strict';

  function drawImage(img, orientation, x, y, width, height) {
    if (!/^[1-8]$/.test(orientation)) throw new Error('orientation should be [1-8]');

    if (x == null) x = 0;
    if (y == null) y = 0;
    if (width == null) width = img.width;
    if (height == null) height = img.height;

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;

    ctx.save();
    switch (+orientation) {
      // 1 = The 0th row is at the visual top of the image, and the 0th column is the visual left-hand side.
      case 1:
          break;

      // 2 = The 0th row is at the visual top of the image, and the 0th column is the visual right-hand side.
      case 2:
         ctx.translate(width, 0);
         ctx.scale(-1, 1);
         break;

      // 3 = The 0th row is at the visual bottom of the image, and the 0th column is the visual right-hand side.
      case 3:
          ctx.translate(width, height);
          ctx.rotate(180 / 180 * Math.PI);
          break;

      // 4 = The 0th row is at the visual bottom of the image, and the 0th column is the visual left-hand side.
      case 4:
          ctx.translate(0, height);
          ctx.scale(1, -1);
          break;

      // 5 = The 0th row is the visual left-hand side of the image, and the 0th column is the visual top.
      case 5:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(90 / 180 * Math.PI);
          ctx.scale(1, -1);
          break;

      // 6 = The 0th row is the visual right-hand side of the image, and the 0th column is the visual top.
      case 6:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(90 / 180 * Math.PI);
          ctx.translate(0, -height);
          break;

      // 7 = The 0th row is the visual right-hand side of the image, and the 0th column is the visual bottom.
      case 7:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(270 / 180 * Math.PI);
          ctx.translate(-width, height);
          ctx.scale(1, -1);
          break;

      // 8 = The 0th row is the visual left-hand side of the image, and the 0th column is the visual bottom.
      case 8:
          canvas.width = height;
          canvas.height = width;
          ctx.translate(0, width);
          ctx.rotate(270 / 180 * Math.PI);
          break;
    }

    ctx.drawImage(img, x, y, width, height);
    ctx.restore();

    return canvas;
  }

  return {
    drawImage: drawImage
  };
}));
});

var u = {
  onePointCoord: function onePointCoord(point, vm) {
    var canvas = vm.canvas,
        quality = vm.quality;

    var rect = canvas.getBoundingClientRect();
    var clientX = point.clientX;
    var clientY = point.clientY;
    return {
      x: (clientX - rect.left) * quality,
      y: (clientY - rect.top) * quality
    };
  },
  getPointerCoords: function getPointerCoords(evt, vm) {
    var pointer = void 0;
    if (evt.touches && evt.touches[0]) {
      pointer = evt.touches[0];
    } else if (evt.changedTouches && evt.changedTouches[0]) {
      pointer = evt.changedTouches[0];
    } else {
      pointer = evt;
    }
    return this.onePointCoord(pointer, vm);
  },
  getPinchDistance: function getPinchDistance(evt, vm) {
    var pointer1 = evt.touches[0];
    var pointer2 = evt.touches[1];
    var coord1 = this.onePointCoord(pointer1, vm);
    var coord2 = this.onePointCoord(pointer2, vm);

    return Math.sqrt(Math.pow(coord1.x - coord2.x, 2) + Math.pow(coord1.y - coord2.y, 2));
  },
  getPinchCenterCoord: function getPinchCenterCoord(evt, vm) {
    var pointer1 = evt.touches[0];
    var pointer2 = evt.touches[1];
    var coord1 = this.onePointCoord(pointer1, vm);
    var coord2 = this.onePointCoord(pointer2, vm);

    return {
      x: (coord1.x + coord2.x) / 2,
      y: (coord1.y + coord2.y) / 2
    };
  },
  imageLoaded: function imageLoaded(img) {
    return img.complete && img.naturalWidth !== 0;
  },
  rAFPolyfill: function rAFPolyfill() {
    // rAF polyfill
    if (typeof document == 'undefined' || typeof window == 'undefined') return;
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
      window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || // Webkit中此取消方法的名字变了
      window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = function (callback) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
        var id = window.setTimeout(function () {
          var arg = currTime + timeToCall;
          callback(arg);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };
    }
    if (!window.cancelAnimationFrame) {
      window.cancelAnimationFrame = function (id) {
        clearTimeout(id);
      };
    }

    Array.isArray = function (arg) {
      return Object.prototype.toString.call(arg) === '[object Array]';
    };
  },
  toBlobPolyfill: function toBlobPolyfill() {
    if (typeof document == 'undefined' || typeof window == 'undefined' || !HTMLCanvasElement) return;
    var binStr, len, arr;
    if (!HTMLCanvasElement.prototype.toBlob) {
      Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
        value: function value(callback, type, quality) {
          binStr = atob(this.toDataURL(type, quality).split(',')[1]);
          len = binStr.length;
          arr = new Uint8Array(len);

          for (var i = 0; i < len; i++) {
            arr[i] = binStr.charCodeAt(i);
          }

          callback(new Blob([arr], { type: type || 'image/png' }));
        }
      });
    }
  },
  eventHasFile: function eventHasFile(evt) {
    var dt = evt.dataTransfer || evt.originalEvent.dataTransfer;
    if (dt.types) {
      for (var i = 0, len = dt.types.length; i < len; i++) {
        if (dt.types[i] == 'Files') {
          return true;
        }
      }
    }

    return false;
  },
  getFileOrientation: function getFileOrientation(arrayBuffer) {
    var view = new DataView(arrayBuffer);
    if (view.getUint16(0, false) != 0xFFD8) return -2;
    var length = view.byteLength;
    var offset = 2;
    while (offset < length) {
      var marker = view.getUint16(offset, false);
      offset += 2;
      if (marker == 0xFFE1) {
        if (view.getUint32(offset += 2, false) != 0x45786966) return -1;
        var little = view.getUint16(offset += 6, false) == 0x4949;
        offset += view.getUint32(offset + 4, little);
        var tags = view.getUint16(offset, little);
        offset += 2;
        for (var i = 0; i < tags; i++) {
          if (view.getUint16(offset + i * 12, little) == 0x0112) {
            return view.getUint16(offset + i * 12 + 8, little);
          }
        }
      } else if ((marker & 0xFF00) != 0xFF00) break;else offset += view.getUint16(offset, false);
    }
    return -1;
  },
  base64ToArrayBuffer: function base64ToArrayBuffer(base64) {
    base64 = base64.replace(/^data:([^;]+);base64,/gmi, '');
    var binaryString = atob(base64);
    var len = binaryString.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  },
  getRotatedImage: function getRotatedImage(img, orientation) {
    var _canvas = index.drawImage(img, orientation);
    var _img = new Image();
    _img.src = _canvas.toDataURL();
    return _img;
  },
  flipX: function flipX(ori) {
    if (ori % 2 == 0) {
      return ori - 1;
    }

    return ori + 1;
  },
  flipY: function flipY(ori) {
    var map = {
      1: 4,
      4: 1,
      2: 3,
      3: 2,
      5: 8,
      8: 5,
      6: 7,
      7: 6
    };

    return map[ori];
  },
  rotate90: function rotate90(ori) {
    var map = {
      1: 6,
      2: 7,
      3: 8,
      4: 5,
      5: 2,
      6: 3,
      7: 4,
      8: 1
    };

    return map[ori];
  }
};

Number.isInteger = Number.isInteger || function (value) {
  return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
};

var props = {
  value: Object,
  width: {
    type: Number,
    default: 200,
    validator: function validator(val) {
      return val > 0;
    }
  },
  height: {
    type: Number,
    default: 200,
    validator: function validator(val) {
      return val > 0;
    }
  },
  placeholder: {
    type: String,
    default: 'Choose an image'
  },
  placeholderColor: {
    default: '#606060'
  },
  placeholderFontSize: {
    type: Number,
    default: 0,
    validator: function validator(val) {
      return val >= 0;
    }
  },
  canvasColor: {
    default: 'transparent'
  },
  quality: {
    type: Number,
    default: 2,
    validator: function validator(val) {
      return Number.isInteger(val) && val > 0;
    }
  },
  zoomSpeed: {
    default: 3,
    type: Number,
    validator: function validator(val) {
      return val > 0;
    }
  },
  accept: {
    type: String,
    default: '.jpg,.jpeg,.png,.gif,.bmp,.webp,.svg,.tiff'
  },
  fileSizeLimit: {
    type: Number,
    default: 0,
    validator: function validator(val) {
      return val >= 0;
    }
  },
  disabled: Boolean,
  disableDragAndDrop: Boolean,
  disableClickToChoose: Boolean,
  disableDragToMove: Boolean,
  disableScrollToZoom: Boolean,
  disablePinchToZoom: Boolean,
  disableRotation: Boolean,
  reverseScrollToZoom: Boolean,
  preventWhiteSpace: Boolean,
  showRemoveButton: {
    type: Boolean,
    default: true
  },
  removeButtonColor: {
    type: String,
    default: 'red'
  },
  removeButtonSize: {
    type: Number
  },
  initialImage: [String, HTMLImageElement],
  initialSize: {
    type: String,
    default: 'cover',
    validator: function validator(val) {
      return val === 'cover' || val === 'contain' || val === 'natural';
    }
  },
  initialPosition: {
    type: String,
    default: 'center',
    validator: function validator(val) {
      var valids = ['center', 'top', 'bottom', 'left', 'right', 'top left', 'top right', 'bottom left', 'bottom right', 'left top', 'right top', 'left bottom', 'right bottom'];
      return valids.indexOf(val) >= 0 || /^-?\d+% -?\d+%$/.test(val);
    }
  }
};

var events = {
  INIT_EVENT: 'init',
  FILE_CHOOSE_EVENT: 'file-choose',
  FILE_SIZE_EXCEED_EVENT: 'file-size-exceed',
  FILE_TYPE_MISMATCH_EVENT: 'file-type-mismatch',
  NEW_IMAGE: 'new-image',
  IMAGE_REMOVE_EVENT: 'image-remove',
  MOVE_EVENT: 'move',
  ZOOM_EVENT: 'zoom',
  DRAW: 'draw'
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var PCT_PER_ZOOM = 1 / 100000; // The amount of zooming everytime it happens, in percentage of image width.
var MIN_MS_PER_CLICK = 500; // If touch duration is shorter than the value, then it is considered as a click.
var CLICK_MOVE_THRESHOLD = 100; // If touch move distance is greater than this value, then it will by no mean be considered as a click.
var MIN_WIDTH = 10; // The minimal width the user can zoom to.
var DEFAULT_PLACEHOLDER_TAKEUP = 2 / 3; // Placeholder text by default takes up this amount of times of canvas width.
var PINCH_ACCELERATION = 2; // The amount of times by which the pinching is more sensitive than the scolling
var DEBUG = false;

var component = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { ref: "wrapper", class: 'croppa-container ' + (_vm.img ? 'croppa--has-target' : '') + ' ' + (_vm.disabled ? 'croppa--disabled' : '') + ' ' + (_vm.disableClickToChoose ? 'croppa--disabled-cc' : '') + ' ' + (_vm.disableDragToMove && _vm.disableScrollToZoom ? 'croppa--disabled-mz' : '') + ' ' + (_vm.fileDraggedOver ? 'croppa--dropzone' : ''), on: { "dragenter": function dragenter($event) {
          $event.stopPropagation();$event.preventDefault();_vm.handleDragEnter($event);
        }, "dragleave": function dragleave($event) {
          $event.stopPropagation();$event.preventDefault();_vm.handleDragLeave($event);
        }, "dragover": function dragover($event) {
          $event.stopPropagation();$event.preventDefault();_vm.handleDragOver($event);
        }, "drop": function drop($event) {
          $event.stopPropagation();$event.preventDefault();_vm.handleDrop($event);
        } } }, [_c('input', { ref: "fileInput", attrs: { "type": "file", "accept": _vm.accept, "disabled": _vm.disabled, "hidden": "" }, on: { "change": _vm.handleInputChange } }), _c('div', { staticClass: "initial", staticStyle: { "width": "0", "height": "0", "visibility": "hidden" } }, [_vm._t("initial")], 2), _c('canvas', { ref: "canvas", on: { "click": function click($event) {
          $event.stopPropagation();$event.preventDefault();_vm.handleClick($event);
        }, "touchstart": function touchstart($event) {
          $event.stopPropagation();_vm.handlePointerStart($event);
        }, "mousedown": function mousedown($event) {
          $event.stopPropagation();$event.preventDefault();_vm.handlePointerStart($event);
        }, "pointerstart": function pointerstart($event) {
          $event.stopPropagation();$event.preventDefault();_vm.handlePointerStart($event);
        }, "touchend": function touchend($event) {
          $event.stopPropagation();$event.preventDefault();_vm.handlePointerEnd($event);
        }, "touchcancel": function touchcancel($event) {
          $event.stopPropagation();$event.preventDefault();_vm.handlePointerEnd($event);
        }, "mouseup": function mouseup($event) {
          $event.stopPropagation();$event.preventDefault();_vm.handlePointerEnd($event);
        }, "pointerend": function pointerend($event) {
          $event.stopPropagation();$event.preventDefault();_vm.handlePointerEnd($event);
        }, "pointercancel": function pointercancel($event) {
          $event.stopPropagation();$event.preventDefault();_vm.handlePointerEnd($event);
        }, "touchmove": function touchmove($event) {
          $event.stopPropagation();_vm.handlePointerMove($event);
        }, "mousemove": function mousemove($event) {
          $event.stopPropagation();$event.preventDefault();_vm.handlePointerMove($event);
        }, "pointermove": function pointermove($event) {
          $event.stopPropagation();$event.preventDefault();_vm.handlePointerMove($event);
        }, "DOMMouseScroll": function DOMMouseScroll($event) {
          $event.stopPropagation();_vm.handleWheel($event);
        }, "wheel": function wheel($event) {
          $event.stopPropagation();_vm.handleWheel($event);
        }, "mousewheel": function mousewheel($event) {
          $event.stopPropagation();_vm.handleWheel($event);
        } } }), _vm.showRemoveButton && _vm.img ? _c('svg', { staticClass: "icon icon-remove", style: 'top: -' + _vm.height / 40 + 'px; right: -' + _vm.width / 40 + 'px', attrs: { "viewBox": "0 0 1024 1024", "version": "1.1", "xmlns": "http://www.w3.org/2000/svg", "xmlns:xlink": "http://www.w3.org/1999/xlink", "width": _vm.removeButtonSize || _vm.width / 10, "height": _vm.removeButtonSize || _vm.width / 10 }, on: { "click": _vm.remove } }, [_c('path', { attrs: { "d": "M511.921231 0C229.179077 0 0 229.257846 0 512 0 794.702769 229.179077 1024 511.921231 1024 794.781538 1024 1024 794.702769 1024 512 1024 229.257846 794.781538 0 511.921231 0ZM732.041846 650.633846 650.515692 732.081231C650.515692 732.081231 521.491692 593.683692 511.881846 593.683692 502.429538 593.683692 373.366154 732.081231 373.366154 732.081231L291.761231 650.633846C291.761231 650.633846 430.316308 523.500308 430.316308 512.196923 430.316308 500.696615 291.761231 373.523692 291.761231 373.523692L373.366154 291.918769C373.366154 291.918769 503.453538 430.395077 511.881846 430.395077 520.349538 430.395077 650.515692 291.918769 650.515692 291.918769L732.041846 373.523692C732.041846 373.523692 593.447385 502.547692 593.447385 512.196923 593.447385 521.412923 732.041846 650.633846 732.041846 650.633846Z", "fill": _vm.removeButtonColor } })]) : _vm._e()]);
  }, staticRenderFns: [],
  model: {
    prop: 'value',
    event: 'init'
  },

  props: props,

  data: function data() {
    return {
      instance: null,
      canvas: null,
      ctx: null,
      originalImage: null,
      img: null,
      dragging: false,
      lastMovingCoord: null,
      imgData: {},
      dataUrl: '',
      fileDraggedOver: false,
      tabStart: 0,
      pinching: false,
      pinchDistance: 0,
      supportTouch: false,
      pointerMoved: false,
      pointerStartCoord: null,
      naturalWidth: 0,
      naturalHeight: 0,
      scaleRatio: 1,
      orientation: 1,
      userMetadata: null
    };
  },


  computed: {
    realWidth: function realWidth() {
      return this.width * this.quality;
    },
    realHeight: function realHeight() {
      return this.height * this.quality;
    },
    realPlaceholderFontSize: function realPlaceholderFontSize() {
      return this.placeholderFontSize * this.quality;
    }
  },

  mounted: function mounted() {
    this.init();
    u.rAFPolyfill();
    u.toBlobPolyfill();

    var supports = this.supportDetection();
    if (!supports.basic) {
      console.warn('Your browser does not support vue-croppa functionality.');
    }
  },


  watch: {
    value: function value(val) {
      this.instance = val;
    },
    realWidth: function realWidth() {
      if (!this.img) {
        this.init();
      } else {
        this.setSize();
        this.imgContentInit();
      }
    },
    realHeight: function realHeight() {
      if (!this.img) {
        this.init();
      } else {
        this.setSize();
        this.imgContentInit();
      }
    },
    canvasColor: function canvasColor() {
      if (!this.img) {
        this.init();
      } else {
        this.draw();
      }
    },
    placeholder: function placeholder() {
      if (!this.img) {
        this.init();
      }
    },
    placeholderColor: function placeholderColor() {
      if (!this.img) {
        this.init();
      }
    },
    realPlaceholderFontSize: function realPlaceholderFontSize() {
      if (!this.img) {
        this.init();
      }
    },
    preventWhiteSpace: function preventWhiteSpace() {
      this.imgContentInit();
    }
  },

  methods: {
    init: function init() {
      var _this = this;

      this.canvas = this.$refs.canvas;
      this.setSize();
      this.canvas.style.backgroundColor = !this.canvasColor || this.canvasColor == 'default' ? 'transparent' : typeof this.canvasColor === 'string' ? this.canvasColor : '';
      this.ctx = this.canvas.getContext('2d');
      this.originalImage = null;
      this.img = null;
      this.setInitial();
      this.$emit(events.INIT_EVENT, {
        getCanvas: function getCanvas() {
          return _this.canvas;
        },
        getContext: function getContext() {
          return _this.ctx;
        },
        getChosenFile: function getChosenFile() {
          return _this.$refs.fileInput.files[0];
        },
        getActualImageSize: function getActualImageSize() {
          return {
            width: _this.realWidth,
            height: _this.realHeight
          };
        },
        moveUpwards: function moveUpwards(amount) {
          _this.move({ x: 0, y: -amount });
        },
        moveDownwards: function moveDownwards(amount) {
          _this.move({ x: 0, y: amount });
        },
        moveLeftwards: function moveLeftwards(amount) {
          _this.move({ x: -amount, y: 0 });
        },
        moveRightwards: function moveRightwards(amount) {
          _this.move({ x: amount, y: 0 });
        },
        zoomIn: function zoomIn() {
          _this.zoom(true);
        },
        zoomOut: function zoomOut() {
          _this.zoom(false);
        },
        rotate: function rotate() {
          var step = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

          if (_this.disableRotation || _this.disabled) return;
          step = parseInt(step);
          if (isNaN(step) || step > 3 || step < -3) {
            console.warn('Invalid argument for rotate() method. It should one of the integers from -3 to 3.');
            step = 1;
          }
          _this.rotateByStep(step);
        },
        flipX: function flipX() {
          if (_this.disableRotation || _this.disabled) return;
          _this.rotate(2);
        },
        flipY: function flipY() {
          if (_this.disableRotation || _this.disabled) return;
          _this.rotate(4);
        },
        refresh: function refresh() {
          _this.$nextTick(_this.init);
        },
        hasImage: function hasImage() {
          return !!_this.img;
        },
        remove: this.remove,
        chooseFile: this.chooseFile,
        generateDataUrl: this.generateDataUrl,
        generateBlob: this.generateBlob,
        promisedBlob: this.promisedBlob,
        supportDetection: this.supportDetection,
        getMetadata: this.getMetadata,
        applyMetadata: function applyMetadata(metadata) {
          if (!metadata) return;
          _this.userMetadata = metadata;
          _this.rotate(metadata.orientation || _this.orientation, true);
        }
      });
    },
    setSize: function setSize() {
      this.canvas.width = this.realWidth;
      this.canvas.height = this.realHeight;
      this.canvas.style.width = this.width + 'px';
      this.canvas.style.height = this.height + 'px';
    },
    rotateByStep: function rotateByStep(step) {
      var orientation = 1;
      switch (step) {
        case 1:
          orientation = 6;
          break;
        case 2:
          orientation = 3;
          break;
        case 3:
          orientation = 8;
          break;
        case -1:
          orientation = 8;
          break;
        case -2:
          orientation = 3;
          break;
        case -3:
          orientation = 6;
          break;
      }
      this.rotate(orientation);
    },
    supportDetection: function supportDetection() {
      var div = document.createElement('div');
      return {
        'basic': window.requestAnimationFrame && window.File && window.FileReader && window.FileList && window.Blob,
        'dnd': 'ondragstart' in div && 'ondrop' in div
      };
    },
    remove: function remove() {
      var ctx = this.ctx;
      this.paintBackground();
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      var defaultFontSize = this.realWidth * DEFAULT_PLACEHOLDER_TAKEUP / this.placeholder.length;
      var fontSize = !this.realPlaceholderFontSize || this.realPlaceholderFontSize == 0 ? defaultFontSize : this.realPlaceholderFontSize;
      ctx.font = fontSize + 'px sans-serif';
      ctx.fillStyle = !this.placeholderColor || this.placeholderColor == 'default' ? '#606060' : this.placeholderColor;
      ctx.fillText(this.placeholder, this.realWidth / 2, this.realHeight / 2);

      var hadImage = this.img != null;
      this.originalImage = null;
      this.img = null;
      this.$refs.fileInput.value = '';
      this.imgData = {};
      this.orientation = 1;
      this.userMetadata = null;

      if (hadImage) {
        this.$emit(events.IMAGE_REMOVE_EVENT);
      }
    },
    setInitial: function setInitial() {
      var _this2 = this;

      var src = void 0,
          img = void 0;
      if (this.$slots.initial && this.$slots.initial[0]) {
        var vNode = this.$slots.initial[0];
        var tag = vNode.tag,
            elm = vNode.elm;

        if (tag == 'img' && elm) {
          img = elm;
        }
      }
      if (!src && this.initialImage && typeof this.initialImage === 'string') {
        src = this.initialImage;
        img = new Image();
        if (!/^data:/.test(src) && !/^blob:/.test(src)) {
          img.setAttribute('crossOrigin', 'anonymous');
        }
        img.src = src;
      } else if (_typeof(this.initialImage) === 'object' && this.initialImage instanceof Image) {
        img = this.initialImage;
      }
      if (!src && !img) {
        this.remove();
        return;
      }
      if (u.imageLoaded(img)) {
        this._onload(img, +img.dataset['exifOrientation']);
      } else {
        img.onload = function () {
          _this2._onload(img, +img.dataset['exifOrientation']);
        };

        img.onerror = function () {
          _this2.remove();
        };
      }
    },
    _onload: function _onload(img) {
      var orientation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

      this.originalImage = img;
      this.img = img;

      this.rotate(orientation);
    },
    chooseFile: function chooseFile() {
      this.$refs.fileInput.click();
    },
    handleClick: function handleClick() {
      if (DEBUG) {
        console.log('click');
      }
      if (!this.img && !this.disableClickToChoose && !this.disabled && !this.supportTouch) {
        this.chooseFile();
        if (DEBUG) {
          console.log('trigger by click');
        }
      }
    },
    handleInputChange: function handleInputChange() {
      var input = this.$refs.fileInput;
      if (!input.files.length) return;

      var file = input.files[0];
      this.onNewFileIn(file);
    },
    onNewFileIn: function onNewFileIn(file) {
      var _this3 = this;

      this.$emit(events.FILE_CHOOSE_EVENT, file);
      if (!this.fileSizeIsValid(file)) {
        this.$emit(events.FILE_SIZE_EXCEED_EVENT, file);
        throw new Error('File size exceeds limit which is ' + this.fileSizeLimit + ' bytes.');
      }
      if (!this.fileTypeIsValid(file)) {
        this.$emit(events.FILE_TYPE_MISMATCH_EVENT, file);
        var type = file.type || file.name.toLowerCase().split('.').pop();
        throw new Error('File type (' + type + ') does not match what you specified (' + this.accept + ').');
      }
      if (typeof window.FileReader !== 'undefined') {
        var fr = new FileReader();
        fr.onload = function (e) {
          var fileData = e.target.result;
          var orientation = u.getFileOrientation(u.base64ToArrayBuffer(fileData));
          if (orientation < 1) orientation = 1;
          var img = new Image();
          img.src = fileData;
          img.onload = function () {
            _this3._onload(img, orientation);
            _this3.$emit(events.NEW_IMAGE);
          };
        };
        fr.readAsDataURL(file);
      }
    },
    fileSizeIsValid: function fileSizeIsValid(file) {
      if (!file) return false;
      if (!this.fileSizeLimit || this.fileSizeLimit == 0) return true;

      return file.size < this.fileSizeLimit;
    },
    fileTypeIsValid: function fileTypeIsValid(file) {
      var accept = this.accept || 'image/*';
      var baseMimetype = accept.replace(/\/.*$/, '');
      var types = accept.split(',');
      for (var i = 0, len = types.length; i < len; i++) {
        var type = types[i];
        var t = type.trim();
        if (t.charAt(0) == '.') {
          if (file.name.toLowerCase().split('.').pop() === t.toLowerCase().slice(1)) return true;
        } else if (/\/\*$/.test(t)) {
          var fileBaseType = file.type.replace(/\/.*$/, '');
          if (fileBaseType === baseMimetype) {
            return true;
          }
        } else if (file.type === type) {
          return true;
        }
      }

      return false;
    },
    imgContentInit: function imgContentInit() {
      this.naturalWidth = this.img.naturalWidth;
      this.naturalHeight = this.img.naturalHeight;

      this.imgData.startX = 0;
      this.imgData.startY = 0;
      if (!this.preventWhiteSpace && this.initialSize == 'contain') {
        this.aspectFit();
      } else if (!this.preventWhiteSpace && this.initialSize == 'natural') {
        this.naturalSize();
      } else {
        this.aspectFill();
      }
      this.scaleRatio = this.imgData.width / this.naturalWidth;

      if (/top/.test(this.initialPosition)) {
        this.imgData.startY = 0;
      } else if (/bottom/.test(this.initialPosition)) {
        this.imgData.startY = this.realHeight - this.imgData.height;
      }

      if (/left/.test(this.initialPosition)) {
        this.imgData.startX = 0;
      } else if (/right/.test(this.initialPosition)) {
        this.imgData.startX = this.realWidth - this.imgData.width;
      }

      if (/^-?\d+% -?\d+%$/.test(this.initialPosition)) {
        var result = /^(-?\d+)% (-?\d+)%$/.exec(this.initialPosition);
        var x = +result[1] / 100;
        var y = +result[2] / 100;
        this.imgData.startX = x * (this.realWidth - this.imgData.width);
        this.imgData.startY = y * (this.realHeight - this.imgData.height);
      }

      this.applyMetadata();

      if (this.preventWhiteSpace) {
        this.preventMovingToWhiteSpace();
      }

      this.draw();
    },
    aspectFill: function aspectFill() {
      var imgWidth = this.naturalWidth;
      var imgHeight = this.naturalHeight;
      var imgRatio = imgHeight / imgWidth;
      var canvasRatio = this.realHeight / this.realWidth;
      var scaleRatio = void 0;
      if (imgRatio < canvasRatio) {
        scaleRatio = imgHeight / this.realHeight;
        this.imgData.width = imgWidth / scaleRatio;
        this.imgData.height = this.realHeight;
        this.imgData.startX = -(this.imgData.width - this.realWidth) / 2;
      } else {
        scaleRatio = imgWidth / this.realWidth;
        this.imgData.height = imgHeight / scaleRatio;
        this.imgData.width = this.realWidth;
        this.imgData.startY = -(this.imgData.height - this.realHeight) / 2;
      }
    },
    aspectFit: function aspectFit() {
      var imgWidth = this.naturalWidth;
      var imgHeight = this.naturalHeight;
      var imgRatio = imgHeight / imgWidth;
      var canvasRatio = this.realHeight / this.realWidth;
      var scaleRatio = void 0;
      if (imgRatio < canvasRatio) {
        scaleRatio = imgWidth / this.realWidth;
        this.imgData.height = imgHeight / scaleRatio;
        this.imgData.width = this.realWidth;
        this.imgData.startY = -(this.imgData.height - this.realHeight) / 2;
      } else {
        scaleRatio = imgHeight / this.realHeight;
        this.imgData.width = imgWidth / scaleRatio;
        this.imgData.height = this.realHeight;
        this.imgData.startX = -(this.imgData.width - this.realWidth) / 2;
      }
    },
    naturalSize: function naturalSize() {
      var imgWidth = this.naturalWidth;
      var imgHeight = this.naturalHeight;
      this.imgData.width = imgWidth;
      this.imgData.height = imgHeight;
      this.imgData.startX = -(this.imgData.width - this.realWidth) / 2;
      this.imgData.startY = -(this.imgData.height - this.realHeight) / 2;
    },
    handlePointerStart: function handlePointerStart(evt) {
      if (DEBUG) {
        console.log('touch start');
      }
      this.supportTouch = true;
      this.pointerMoved = false;
      var pointerCoord = u.getPointerCoords(evt, this);
      this.pointerStartCoord = pointerCoord;

      if (this.disabled) return;
      // simulate click with touch on mobile devices
      if (!this.img && !this.disableClickToChoose) {
        this.tabStart = new Date().valueOf();
        return;
      }
      // ignore mouse right click and middle click
      if (evt.which && evt.which > 1) return;

      if (!evt.touches || evt.touches.length === 1) {
        this.dragging = true;
        this.pinching = false;
        var coord = u.getPointerCoords(evt, this);
        this.lastMovingCoord = coord;
      }

      if (evt.touches && evt.touches.length === 2 && !this.disablePinchToZoom) {
        this.dragging = false;
        this.pinching = true;
        this.pinchDistance = u.getPinchDistance(evt, this);
      }

      var cancelEvents = ['mouseup', 'touchend', 'touchcancel', 'pointerend', 'pointercancel'];
      for (var i = 0, len = cancelEvents.length; i < len; i++) {
        var e = cancelEvents[i];
        document.addEventListener(e, this.handlePointerEnd);
      }
    },
    handlePointerEnd: function handlePointerEnd(evt) {
      if (DEBUG) {
        console.log('touch end');
      }
      var pointerMoveDistance = 0;
      if (this.pointerStartCoord) {
        var pointerCoord = u.getPointerCoords(evt, this);
        pointerMoveDistance = Math.sqrt(Math.pow(pointerCoord.x - this.pointerStartCoord.x, 2) + Math.pow(pointerCoord.y - this.pointerStartCoord.y, 2)) || 0;
      }
      if (this.disabled) return;
      if (!this.img && !this.disableClickToChoose) {
        var tabEnd = new Date().valueOf();
        if (pointerMoveDistance < CLICK_MOVE_THRESHOLD && tabEnd - this.tabStart < MIN_MS_PER_CLICK && this.supportTouch) {
          this.chooseFile();
          if (DEBUG) {
            console.log('trigger by touch');
          }
        }
        this.tabStart = 0;
        return;
      }

      this.dragging = false;
      this.pinching = false;
      this.pinchDistance = 0;
      this.lastMovingCoord = null;
      this.pointerMoved = false;
      this.pointerStartCoord = null;
    },
    handlePointerMove: function handlePointerMove(evt) {
      this.pointerMoved = true;

      if (this.disabled || this.disableDragToMove || !this.img) return;

      evt.preventDefault();
      if (!evt.touches || evt.touches.length === 1) {
        if (!this.dragging) return;
        var coord = u.getPointerCoords(evt, this);
        if (this.lastMovingCoord) {
          this.move({
            x: coord.x - this.lastMovingCoord.x,
            y: coord.y - this.lastMovingCoord.y
          });
        }
        this.lastMovingCoord = coord;
      }

      if (evt.touches && evt.touches.length === 2 && !this.disablePinchToZoom) {
        if (!this.pinching) return;
        var distance = u.getPinchDistance(evt, this);
        var delta = distance - this.pinchDistance;
        this.zoom(delta > 0, null, PINCH_ACCELERATION);
        this.pinchDistance = distance;
      }
    },
    handleWheel: function handleWheel(evt) {
      if (this.disabled || this.disableScrollToZoom || !this.img) return;
      evt.preventDefault();
      var coord = u.getPointerCoords(evt, this);
      if (evt.wheelDelta < 0 || evt.deltaY > 0 || evt.detail > 0) {
        this.zoom(this.reverseScrollToZoom, coord);
      } else if (evt.wheelDelta > 0 || evt.deltaY < 0 || evt.detail < 0) {
        this.zoom(!this.reverseScrollToZoom, coord);
      }
    },
    handleDragEnter: function handleDragEnter(evt) {
      if (this.disabled || this.disableDragAndDrop || this.img || !u.eventHasFile(evt)) return;
      this.fileDraggedOver = true;
    },
    handleDragLeave: function handleDragLeave(evt) {
      if (!this.fileDraggedOver || !u.eventHasFile(evt)) return;
      this.fileDraggedOver = false;
    },
    handleDragOver: function handleDragOver(evt) {},
    handleDrop: function handleDrop(evt) {
      if (!this.fileDraggedOver || !u.eventHasFile(evt)) return;
      this.fileDraggedOver = false;

      var file = void 0;
      var dt = evt.dataTransfer;
      if (!dt) return;
      if (dt.items) {
        for (var i = 0, len = dt.items.length; i < len; i++) {
          var item = dt.items[i];
          if (item.kind == 'file') {
            file = item.getAsFile();
            break;
          }
        }
      } else {
        file = dt.files[0];
      }

      if (file) {
        this.onNewFileIn(file);
      }
    },
    move: function move(offset) {
      if (!offset) return;
      var oldX = this.imgData.startX;
      var oldY = this.imgData.startY;
      this.imgData.startX += offset.x;
      this.imgData.startY += offset.y;
      if (this.preventWhiteSpace) {
        this.preventMovingToWhiteSpace();
      }
      if (this.imgData.startX !== oldX || this.imgData.startY !== oldY) {
        this.$emit(events.MOVE_EVENT);
        this.draw();
      }
    },
    preventMovingToWhiteSpace: function preventMovingToWhiteSpace() {
      if (this.imgData.startX > 0) {
        this.imgData.startX = 0;
      }
      if (this.imgData.startY > 0) {
        this.imgData.startY = 0;
      }
      if (this.realWidth - this.imgData.startX > this.imgData.width) {
        this.imgData.startX = -(this.imgData.width - this.realWidth);
      }
      if (this.realHeight - this.imgData.startY > this.imgData.height) {
        this.imgData.startY = -(this.imgData.height - this.realHeight);
      }
    },
    zoom: function zoom(zoomIn, pos) {
      var innerAcceleration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

      pos = pos || {
        x: this.imgData.startX + this.imgData.width / 2,
        y: this.imgData.startY + this.imgData.height / 2
      };
      var realSpeed = this.zoomSpeed * innerAcceleration;
      var speed = this.realWidth * PCT_PER_ZOOM * realSpeed;
      var x = 1;
      if (zoomIn) {
        x = 1 + speed;
      } else if (this.imgData.width > MIN_WIDTH) {
        x = 1 - speed;
      }

      var oldWidth = this.imgData.width;
      var oldHeight = this.imgData.height;

      this.imgData.width = this.imgData.width * x;
      this.imgData.height = this.imgData.height * x;

      if (this.preventWhiteSpace) {
        if (this.imgData.width < this.realWidth) {
          var _x = this.realWidth / this.imgData.width;
          this.imgData.width = this.realWidth;
          this.imgData.height = this.imgData.height * _x;
        }

        if (this.imgData.height < this.realHeight) {
          var _x5 = this.realHeight / this.imgData.height;
          this.imgData.height = this.realHeight;
          this.imgData.width = this.imgData.width * _x5;
        }
      }
      if (oldWidth.toFixed(2) !== this.imgData.width.toFixed(2) || oldHeight.toFixed(2) !== this.imgData.height.toFixed(2)) {
        var offsetX = (x - 1) * (pos.x - this.imgData.startX);
        var offsetY = (x - 1) * (pos.y - this.imgData.startY);
        this.imgData.startX = this.imgData.startX - offsetX;
        this.imgData.startY = this.imgData.startY - offsetY;

        if (this.preventWhiteSpace) {
          this.preventMovingToWhiteSpace();
        }
        this.$emit(events.ZOOM_EVENT);
        this.draw();
        this.scaleRatio = this.imgData.width / this.naturalWidth;
      }
    },
    rotate: function rotate() {
      var _this4 = this;

      var orientation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 6;
      var useOriginal = arguments[1];

      if (!this.img) return;
      if (orientation > 1) {
        var _img = u.getRotatedImage(useOriginal ? this.originalImage : this.img, orientation);
        _img.onload = function () {
          _this4.img = _img;
          _this4.imgContentInit();
        };
      } else {
        this.imgContentInit();
      }

      if (orientation == 2) {
        // flip x
        this.orientation = u.flipX(this.orientation);
      } else if (orientation == 4) {
        // flip y
        this.orientation = u.flipY(this.orientation);
      } else if (orientation == 6) {
        // 90 deg
        this.orientation = u.rotate90(this.orientation);
      } else if (orientation == 3) {
        // 180 deg
        this.orientation = u.rotate90(u.rotate90(this.orientation));
      } else if (orientation == 8) {
        // 270 deg
        this.orientation = u.rotate90(u.rotate90(u.rotate90(this.orientation)));
      } else {
        this.orientation = orientation;
      }
    },
    paintBackground: function paintBackground() {
      var backgroundColor = !this.canvasColor || this.canvasColor == 'default' ? 'transparent' : this.canvasColor;
      this.ctx.fillStyle = backgroundColor;
      this.ctx.clearRect(0, 0, this.realWidth, this.realHeight);
      this.ctx.fillRect(0, 0, this.realWidth, this.realHeight);
    },
    draw: function draw() {
      if (!this.img) return;
      if (window.requestAnimationFrame) {
        requestAnimationFrame(this._drawFrame);
      } else {
        this._drawFrame();
      }
    },
    _drawFrame: function _drawFrame() {
      var ctx = this.ctx;
      var _imgData = this.imgData,
          startX = _imgData.startX,
          startY = _imgData.startY,
          width = _imgData.width,
          height = _imgData.height;


      this.paintBackground();
      ctx.drawImage(this.img, startX, startY, width, height);
      this.$emit(events.DRAW, ctx);
    },
    generateDataUrl: function generateDataUrl(type, compressionRate) {
      if (!this.img) return '';
      return this.canvas.toDataURL(type, compressionRate);
    },
    generateBlob: function generateBlob(callback, mimeType, qualityArgument) {
      if (!this.img) return null;
      this.canvas.toBlob(callback, mimeType, qualityArgument);
    },
    promisedBlob: function promisedBlob() {
      var _this5 = this;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (typeof Promise == 'undefined') {
        console.warn('No Promise support. Please add Promise polyfill if you want to use this method.');
        return;
      }
      return new Promise(function (resolve, reject) {
        try {
          _this5.generateBlob(function (blob) {
            resolve(blob);
          }, args);
        } catch (err) {
          reject(err);
        }
      });
    },
    getMetadata: function getMetadata() {
      var _imgData2 = this.imgData,
          startX = _imgData2.startX,
          startY = _imgData2.startY;


      return {
        startX: startX,
        startY: startY,
        scale: this.scaleRatio,
        orientation: this.orientation
      };
    },
    applyMetadata: function applyMetadata() {
      if (!this.userMetadata) return;
      var _userMetadata = this.userMetadata,
          startX = _userMetadata.startX,
          startY = _userMetadata.startY,
          scale = _userMetadata.scale;

      startX = +startX;
      startY = +startY;
      scale = +scale;

      if (!isNaN(startX)) {
        this.imgData.startX = startX;
      }

      if (!isNaN(startY)) {
        this.imgData.startY = startY;
      }

      if (!isNaN(scale)) {
        this.imgData.width = this.naturalWidth * scale;
        this.imgData.height = this.naturalHeight * scale;
        this.scaleRatio = scale;
      }
    }
  }
};

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

var index$1 = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

var defaultOptions = {
  componentName: 'croppa'
};

var VueCroppa = {
  install: function install(Vue, options) {
    options = index$1({}, defaultOptions, options);
    var version = Number(Vue.version.split('.')[0]);
    if (version < 2) {
      throw new Error('vue-croppa supports vue version 2.0 and above. You are using Vue@' + version + '. Please upgrade to the latest version of Vue.');
    }
    var componentName = options.componentName || 'croppa';

    // registration
    Vue.component(componentName, component);
  },

  component: component
};

return VueCroppa;

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnVlLWNyb3BwYS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NhbnZhcy1leGlmLW9yaWVudGF0aW9uL2luZGV4LmpzIiwiLi4vLi4vLi4vc3JjL3V0aWwuanMiLCIuLi8uLi8uLi9zcmMvcHJvcHMuanMiLCIuLi8uLi8uLi9zcmMvZXZlbnRzLmpzIiwiLi4vLi4vLi4vc3JjL2Nyb3BwZXIudnVlIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL29iamVjdC1hc3NpZ24vaW5kZXguanMiLCIuLi8uLi8uLi9zcmMvbWFpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShbXSwgZmFjdG9yeSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcm9vdC5DYW52YXNFeGlmT3JpZW50YXRpb24gPSBmYWN0b3J5KCk7XG4gIH1cbn0odGhpcywgZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgZnVuY3Rpb24gZHJhd0ltYWdlKGltZywgb3JpZW50YXRpb24sIHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcbiAgICBpZiAoIS9eWzEtOF0kLy50ZXN0KG9yaWVudGF0aW9uKSkgdGhyb3cgbmV3IEVycm9yKCdvcmllbnRhdGlvbiBzaG91bGQgYmUgWzEtOF0nKTtcblxuICAgIGlmICh4ID09IG51bGwpIHggPSAwO1xuICAgIGlmICh5ID09IG51bGwpIHkgPSAwO1xuICAgIGlmICh3aWR0aCA9PSBudWxsKSB3aWR0aCA9IGltZy53aWR0aDtcbiAgICBpZiAoaGVpZ2h0ID09IG51bGwpIGhlaWdodCA9IGltZy5oZWlnaHQ7XG5cbiAgICB2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgdmFyIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGNhbnZhcy53aWR0aCA9IHdpZHRoO1xuICAgIGNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XG5cbiAgICBjdHguc2F2ZSgpO1xuICAgIHN3aXRjaCAoK29yaWVudGF0aW9uKSB7XG4gICAgICAvLyAxID0gVGhlIDB0aCByb3cgaXMgYXQgdGhlIHZpc3VhbCB0b3Agb2YgdGhlIGltYWdlLCBhbmQgdGhlIDB0aCBjb2x1bW4gaXMgdGhlIHZpc3VhbCBsZWZ0LWhhbmQgc2lkZS5cbiAgICAgIGNhc2UgMTpcbiAgICAgICAgICBicmVhaztcblxuICAgICAgLy8gMiA9IFRoZSAwdGggcm93IGlzIGF0IHRoZSB2aXN1YWwgdG9wIG9mIHRoZSBpbWFnZSwgYW5kIHRoZSAwdGggY29sdW1uIGlzIHRoZSB2aXN1YWwgcmlnaHQtaGFuZCBzaWRlLlxuICAgICAgY2FzZSAyOlxuICAgICAgICAgY3R4LnRyYW5zbGF0ZSh3aWR0aCwgMCk7XG4gICAgICAgICBjdHguc2NhbGUoLTEsIDEpO1xuICAgICAgICAgYnJlYWs7XG5cbiAgICAgIC8vIDMgPSBUaGUgMHRoIHJvdyBpcyBhdCB0aGUgdmlzdWFsIGJvdHRvbSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIHJpZ2h0LWhhbmQgc2lkZS5cbiAgICAgIGNhc2UgMzpcbiAgICAgICAgICBjdHgudHJhbnNsYXRlKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICAgIGN0eC5yb3RhdGUoMTgwIC8gMTgwICogTWF0aC5QSSk7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgIC8vIDQgPSBUaGUgMHRoIHJvdyBpcyBhdCB0aGUgdmlzdWFsIGJvdHRvbSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIGxlZnQtaGFuZCBzaWRlLlxuICAgICAgY2FzZSA0OlxuICAgICAgICAgIGN0eC50cmFuc2xhdGUoMCwgaGVpZ2h0KTtcbiAgICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyA1ID0gVGhlIDB0aCByb3cgaXMgdGhlIHZpc3VhbCBsZWZ0LWhhbmQgc2lkZSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIHRvcC5cbiAgICAgIGNhc2UgNTpcbiAgICAgICAgICBjYW52YXMud2lkdGggPSBoZWlnaHQ7XG4gICAgICAgICAgY2FudmFzLmhlaWdodCA9IHdpZHRoO1xuICAgICAgICAgIGN0eC5yb3RhdGUoOTAgLyAxODAgKiBNYXRoLlBJKTtcbiAgICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyA2ID0gVGhlIDB0aCByb3cgaXMgdGhlIHZpc3VhbCByaWdodC1oYW5kIHNpZGUgb2YgdGhlIGltYWdlLCBhbmQgdGhlIDB0aCBjb2x1bW4gaXMgdGhlIHZpc3VhbCB0b3AuXG4gICAgICBjYXNlIDY6XG4gICAgICAgICAgY2FudmFzLndpZHRoID0gaGVpZ2h0O1xuICAgICAgICAgIGNhbnZhcy5oZWlnaHQgPSB3aWR0aDtcbiAgICAgICAgICBjdHgucm90YXRlKDkwIC8gMTgwICogTWF0aC5QSSk7XG4gICAgICAgICAgY3R4LnRyYW5zbGF0ZSgwLCAtaGVpZ2h0KTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgLy8gNyA9IFRoZSAwdGggcm93IGlzIHRoZSB2aXN1YWwgcmlnaHQtaGFuZCBzaWRlIG9mIHRoZSBpbWFnZSwgYW5kIHRoZSAwdGggY29sdW1uIGlzIHRoZSB2aXN1YWwgYm90dG9tLlxuICAgICAgY2FzZSA3OlxuICAgICAgICAgIGNhbnZhcy53aWR0aCA9IGhlaWdodDtcbiAgICAgICAgICBjYW52YXMuaGVpZ2h0ID0gd2lkdGg7XG4gICAgICAgICAgY3R4LnJvdGF0ZSgyNzAgLyAxODAgKiBNYXRoLlBJKTtcbiAgICAgICAgICBjdHgudHJhbnNsYXRlKC13aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyA4ID0gVGhlIDB0aCByb3cgaXMgdGhlIHZpc3VhbCBsZWZ0LWhhbmQgc2lkZSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIGJvdHRvbS5cbiAgICAgIGNhc2UgODpcbiAgICAgICAgICBjYW52YXMud2lkdGggPSBoZWlnaHQ7XG4gICAgICAgICAgY2FudmFzLmhlaWdodCA9IHdpZHRoO1xuICAgICAgICAgIGN0eC50cmFuc2xhdGUoMCwgd2lkdGgpO1xuICAgICAgICAgIGN0eC5yb3RhdGUoMjcwIC8gMTgwICogTWF0aC5QSSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgY3R4LmRyYXdJbWFnZShpbWcsIHgsIHksIHdpZHRoLCBoZWlnaHQpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG5cbiAgICByZXR1cm4gY2FudmFzO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBkcmF3SW1hZ2U6IGRyYXdJbWFnZVxuICB9O1xufSkpO1xuIiwiaW1wb3J0IENhbnZhc0V4aWZPcmllbnRhdGlvbiBmcm9tICdjYW52YXMtZXhpZi1vcmllbnRhdGlvbidcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBvbmVQb2ludENvb3JkIChwb2ludCwgdm0pIHtcclxuICAgIGxldCB7IGNhbnZhcywgcXVhbGl0eSB9ID0gdm1cclxuICAgIGxldCByZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXHJcbiAgICBsZXQgY2xpZW50WCA9IHBvaW50LmNsaWVudFhcclxuICAgIGxldCBjbGllbnRZID0gcG9pbnQuY2xpZW50WVxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgeDogKGNsaWVudFggLSByZWN0LmxlZnQpICogcXVhbGl0eSxcclxuICAgICAgeTogKGNsaWVudFkgLSByZWN0LnRvcCkgKiBxdWFsaXR5XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZ2V0UG9pbnRlckNvb3JkcyAoZXZ0LCB2bSkge1xyXG4gICAgbGV0IHBvaW50ZXJcclxuICAgIGlmIChldnQudG91Y2hlcyAmJiBldnQudG91Y2hlc1swXSkge1xyXG4gICAgICBwb2ludGVyID0gZXZ0LnRvdWNoZXNbMF1cclxuICAgIH0gZWxzZSBpZiAoZXZ0LmNoYW5nZWRUb3VjaGVzICYmIGV2dC5jaGFuZ2VkVG91Y2hlc1swXSkge1xyXG4gICAgICBwb2ludGVyID0gZXZ0LmNoYW5nZWRUb3VjaGVzWzBdXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBwb2ludGVyID0gZXZ0XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIsIHZtKVxyXG4gIH0sXHJcblxyXG4gIGdldFBpbmNoRGlzdGFuY2UgKGV2dCwgdm0pIHtcclxuICAgIGxldCBwb2ludGVyMSA9IGV2dC50b3VjaGVzWzBdXHJcbiAgICBsZXQgcG9pbnRlcjIgPSBldnQudG91Y2hlc1sxXVxyXG4gICAgbGV0IGNvb3JkMSA9IHRoaXMub25lUG9pbnRDb29yZChwb2ludGVyMSwgdm0pXHJcbiAgICBsZXQgY29vcmQyID0gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIyLCB2bSlcclxuXHJcbiAgICByZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KGNvb3JkMS54IC0gY29vcmQyLngsIDIpICsgTWF0aC5wb3coY29vcmQxLnkgLSBjb29yZDIueSwgMikpXHJcbiAgfSxcclxuXHJcbiAgZ2V0UGluY2hDZW50ZXJDb29yZCAoZXZ0LCB2bSkge1xyXG4gICAgbGV0IHBvaW50ZXIxID0gZXZ0LnRvdWNoZXNbMF1cclxuICAgIGxldCBwb2ludGVyMiA9IGV2dC50b3VjaGVzWzFdXHJcbiAgICBsZXQgY29vcmQxID0gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIxLCB2bSlcclxuICAgIGxldCBjb29yZDIgPSB0aGlzLm9uZVBvaW50Q29vcmQocG9pbnRlcjIsIHZtKVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHg6IChjb29yZDEueCArIGNvb3JkMi54KSAvIDIsXHJcbiAgICAgIHk6IChjb29yZDEueSArIGNvb3JkMi55KSAvIDJcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBpbWFnZUxvYWRlZCAoaW1nKSB7XHJcbiAgICByZXR1cm4gaW1nLmNvbXBsZXRlICYmIGltZy5uYXR1cmFsV2lkdGggIT09IDBcclxuICB9LFxyXG5cclxuICByQUZQb2x5ZmlsbCAoKSB7XHJcbiAgICAvLyByQUYgcG9seWZpbGxcclxuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHdpbmRvdyA9PSAndW5kZWZpbmVkJykgcmV0dXJuXHJcbiAgICB2YXIgbGFzdFRpbWUgPSAwXHJcbiAgICB2YXIgdmVuZG9ycyA9IFsnd2Via2l0JywgJ21veiddXHJcbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHZlbmRvcnMubGVuZ3RoICYmICF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lOyArK3gpIHtcclxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ1JlcXVlc3RBbmltYXRpb25GcmFtZSddXHJcbiAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ0NhbmNlbEFuaW1hdGlvbkZyYW1lJ10gfHwgICAgLy8gV2Via2l05Lit5q2k5Y+W5raI5pa55rOV55qE5ZCN5a2X5Y+Y5LqGXHJcbiAgICAgICAgd2luZG93W3ZlbmRvcnNbeF0gKyAnQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ11cclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpIHtcclxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gICAgICAgIHZhciBjdXJyVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpXHJcbiAgICAgICAgdmFyIHRpbWVUb0NhbGwgPSBNYXRoLm1heCgwLCAxNi43IC0gKGN1cnJUaW1lIC0gbGFzdFRpbWUpKVxyXG4gICAgICAgIHZhciBpZCA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIHZhciBhcmcgPSBjdXJyVGltZSArIHRpbWVUb0NhbGxcclxuICAgICAgICAgIGNhbGxiYWNrKGFyZylcclxuICAgICAgICB9LCB0aW1lVG9DYWxsKVxyXG4gICAgICAgIGxhc3RUaW1lID0gY3VyclRpbWUgKyB0aW1lVG9DYWxsXHJcbiAgICAgICAgcmV0dXJuIGlkXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmICghd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKSB7XHJcbiAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgICAgIGNsZWFyVGltZW91dChpZClcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEFycmF5LmlzQXJyYXkgPSBmdW5jdGlvbiAoYXJnKSB7XHJcbiAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJnKSA9PT0gJ1tvYmplY3QgQXJyYXldJ1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHRvQmxvYlBvbHlmaWxsICgpIHtcclxuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHdpbmRvdyA9PSAndW5kZWZpbmVkJyB8fCAhSFRNTENhbnZhc0VsZW1lbnQpIHJldHVyblxyXG4gICAgdmFyIGJpblN0ciwgbGVuLCBhcnJcclxuICAgIGlmICghSFRNTENhbnZhc0VsZW1lbnQucHJvdG90eXBlLnRvQmxvYikge1xyXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoSFRNTENhbnZhc0VsZW1lbnQucHJvdG90eXBlLCAndG9CbG9iJywge1xyXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiAoY2FsbGJhY2ssIHR5cGUsIHF1YWxpdHkpIHtcclxuICAgICAgICAgIGJpblN0ciA9IGF0b2IodGhpcy50b0RhdGFVUkwodHlwZSwgcXVhbGl0eSkuc3BsaXQoJywnKVsxXSlcclxuICAgICAgICAgIGxlbiA9IGJpblN0ci5sZW5ndGhcclxuICAgICAgICAgIGFyciA9IG5ldyBVaW50OEFycmF5KGxlbilcclxuXHJcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGFycltpXSA9IGJpblN0ci5jaGFyQ29kZUF0KGkpXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgY2FsbGJhY2sobmV3IEJsb2IoW2Fycl0sIHsgdHlwZTogdHlwZSB8fCAnaW1hZ2UvcG5nJyB9KSlcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZXZlbnRIYXNGaWxlIChldnQpIHtcclxuICAgIHZhciBkdCA9IGV2dC5kYXRhVHJhbnNmZXIgfHwgZXZ0Lm9yaWdpbmFsRXZlbnQuZGF0YVRyYW5zZmVyXHJcbiAgICBpZiAoZHQudHlwZXMpIHtcclxuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGR0LnR5cGVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGR0LnR5cGVzW2ldID09ICdGaWxlcycpIHtcclxuICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgfSxcclxuXHJcbiAgZ2V0RmlsZU9yaWVudGF0aW9uIChhcnJheUJ1ZmZlcikge1xyXG4gICAgdmFyIHZpZXcgPSBuZXcgRGF0YVZpZXcoYXJyYXlCdWZmZXIpXHJcbiAgICBpZiAodmlldy5nZXRVaW50MTYoMCwgZmFsc2UpICE9IDB4RkZEOCkgcmV0dXJuIC0yXHJcbiAgICB2YXIgbGVuZ3RoID0gdmlldy5ieXRlTGVuZ3RoXHJcbiAgICB2YXIgb2Zmc2V0ID0gMlxyXG4gICAgd2hpbGUgKG9mZnNldCA8IGxlbmd0aCkge1xyXG4gICAgICB2YXIgbWFya2VyID0gdmlldy5nZXRVaW50MTYob2Zmc2V0LCBmYWxzZSlcclxuICAgICAgb2Zmc2V0ICs9IDJcclxuICAgICAgaWYgKG1hcmtlciA9PSAweEZGRTEpIHtcclxuICAgICAgICBpZiAodmlldy5nZXRVaW50MzIob2Zmc2V0ICs9IDIsIGZhbHNlKSAhPSAweDQ1Nzg2OTY2KSByZXR1cm4gLTFcclxuICAgICAgICB2YXIgbGl0dGxlID0gdmlldy5nZXRVaW50MTYob2Zmc2V0ICs9IDYsIGZhbHNlKSA9PSAweDQ5NDlcclxuICAgICAgICBvZmZzZXQgKz0gdmlldy5nZXRVaW50MzIob2Zmc2V0ICsgNCwgbGl0dGxlKVxyXG4gICAgICAgIHZhciB0YWdzID0gdmlldy5nZXRVaW50MTYob2Zmc2V0LCBsaXR0bGUpXHJcbiAgICAgICAgb2Zmc2V0ICs9IDJcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhZ3M7IGkrKykge1xyXG4gICAgICAgICAgaWYgKHZpZXcuZ2V0VWludDE2KG9mZnNldCArIChpICogMTIpLCBsaXR0bGUpID09IDB4MDExMikge1xyXG4gICAgICAgICAgICByZXR1cm4gdmlldy5nZXRVaW50MTYob2Zmc2V0ICsgKGkgKiAxMikgKyA4LCBsaXR0bGUpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKChtYXJrZXIgJiAweEZGMDApICE9IDB4RkYwMCkgYnJlYWtcclxuICAgICAgZWxzZSBvZmZzZXQgKz0gdmlldy5nZXRVaW50MTYob2Zmc2V0LCBmYWxzZSlcclxuICAgIH1cclxuICAgIHJldHVybiAtMVxyXG4gIH0sXHJcblxyXG4gIGJhc2U2NFRvQXJyYXlCdWZmZXIgKGJhc2U2NCkge1xyXG4gICAgYmFzZTY0ID0gYmFzZTY0LnJlcGxhY2UoL15kYXRhOihbXjtdKyk7YmFzZTY0LC9nbWksICcnKVxyXG4gICAgdmFyIGJpbmFyeVN0cmluZyA9IGF0b2IoYmFzZTY0KVxyXG4gICAgdmFyIGxlbiA9IGJpbmFyeVN0cmluZy5sZW5ndGhcclxuICAgIHZhciBieXRlcyA9IG5ldyBVaW50OEFycmF5KGxlbilcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgYnl0ZXNbaV0gPSBiaW5hcnlTdHJpbmcuY2hhckNvZGVBdChpKVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGJ5dGVzLmJ1ZmZlclxyXG4gIH0sXHJcblxyXG4gIGdldFJvdGF0ZWRJbWFnZSAoaW1nLCBvcmllbnRhdGlvbikge1xyXG4gICAgdmFyIF9jYW52YXMgPSBDYW52YXNFeGlmT3JpZW50YXRpb24uZHJhd0ltYWdlKGltZywgb3JpZW50YXRpb24pXHJcbiAgICB2YXIgX2ltZyA9IG5ldyBJbWFnZSgpXHJcbiAgICBfaW1nLnNyYyA9IF9jYW52YXMudG9EYXRhVVJMKClcclxuICAgIHJldHVybiBfaW1nXHJcbiAgfSxcclxuXHJcbiAgZmxpcFggKG9yaSkge1xyXG4gICAgaWYgKG9yaSAlIDIgPT0gMCkge1xyXG4gICAgICByZXR1cm4gb3JpIC0gMVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBvcmkgKyAxXHJcbiAgfSxcclxuXHJcbiAgZmxpcFkgKG9yaSkge1xyXG4gICAgY29uc3QgbWFwID0ge1xyXG4gICAgICAxOiA0LFxyXG4gICAgICA0OiAxLFxyXG4gICAgICAyOiAzLFxyXG4gICAgICAzOiAyLFxyXG4gICAgICA1OiA4LFxyXG4gICAgICA4OiA1LFxyXG4gICAgICA2OiA3LFxyXG4gICAgICA3OiA2XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG1hcFtvcmldXHJcbiAgfSxcclxuXHJcbiAgcm90YXRlOTAgKG9yaSkge1xyXG4gICAgY29uc3QgbWFwID0ge1xyXG4gICAgICAxOiA2LFxyXG4gICAgICAyOiA3LFxyXG4gICAgICAzOiA4LFxyXG4gICAgICA0OiA1LFxyXG4gICAgICA1OiAyLFxyXG4gICAgICA2OiAzLFxyXG4gICAgICA3OiA0LFxyXG4gICAgICA4OiAxXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG1hcFtvcmldXHJcbiAgfVxyXG59IiwiTnVtYmVyLmlzSW50ZWdlciA9IE51bWJlci5pc0ludGVnZXIgfHwgZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgaXNGaW5pdGUodmFsdWUpICYmIE1hdGguZmxvb3IodmFsdWUpID09PSB2YWx1ZVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgdmFsdWU6IE9iamVjdCxcclxuICB3aWR0aDoge1xyXG4gICAgdHlwZTogTnVtYmVyLFxyXG4gICAgZGVmYXVsdDogMjAwLFxyXG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgIHJldHVybiB2YWwgPiAwXHJcbiAgICB9XHJcbiAgfSxcclxuICBoZWlnaHQ6IHtcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIGRlZmF1bHQ6IDIwMCxcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID4gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgcGxhY2Vob2xkZXI6IHtcclxuICAgIHR5cGU6IFN0cmluZyxcclxuICAgIGRlZmF1bHQ6ICdDaG9vc2UgYW4gaW1hZ2UnXHJcbiAgfSxcclxuICBwbGFjZWhvbGRlckNvbG9yOiB7XHJcbiAgICBkZWZhdWx0OiAnIzYwNjA2MCdcclxuICB9LFxyXG4gIHBsYWNlaG9sZGVyRm9udFNpemU6IHtcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIGRlZmF1bHQ6IDAsXHJcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgcmV0dXJuIHZhbCA+PSAwXHJcbiAgICB9XHJcbiAgfSxcclxuICBjYW52YXNDb2xvcjoge1xyXG4gICAgZGVmYXVsdDogJ3RyYW5zcGFyZW50J1xyXG4gIH0sXHJcbiAgcXVhbGl0eToge1xyXG4gICAgdHlwZTogTnVtYmVyLFxyXG4gICAgZGVmYXVsdDogMixcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gTnVtYmVyLmlzSW50ZWdlcih2YWwpICYmIHZhbCA+IDBcclxuICAgIH1cclxuICB9LFxyXG4gIHpvb21TcGVlZDoge1xyXG4gICAgZGVmYXVsdDogMyxcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID4gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgYWNjZXB0OiB7XHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICBkZWZhdWx0OiAnLmpwZywuanBlZywucG5nLC5naWYsLmJtcCwud2VicCwuc3ZnLC50aWZmJ1xyXG4gIH0sXHJcbiAgZmlsZVNpemVMaW1pdDoge1xyXG4gICAgdHlwZTogTnVtYmVyLFxyXG4gICAgZGVmYXVsdDogMCxcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID49IDBcclxuICAgIH1cclxuICB9LFxyXG4gIGRpc2FibGVkOiBCb29sZWFuLFxyXG4gIGRpc2FibGVEcmFnQW5kRHJvcDogQm9vbGVhbixcclxuICBkaXNhYmxlQ2xpY2tUb0Nob29zZTogQm9vbGVhbixcclxuICBkaXNhYmxlRHJhZ1RvTW92ZTogQm9vbGVhbixcclxuICBkaXNhYmxlU2Nyb2xsVG9ab29tOiBCb29sZWFuLFxyXG4gIGRpc2FibGVQaW5jaFRvWm9vbTogQm9vbGVhbixcclxuICBkaXNhYmxlUm90YXRpb246IEJvb2xlYW4sXHJcbiAgcmV2ZXJzZVNjcm9sbFRvWm9vbTogQm9vbGVhbixcclxuICBwcmV2ZW50V2hpdGVTcGFjZTogQm9vbGVhbixcclxuICBzaG93UmVtb3ZlQnV0dG9uOiB7XHJcbiAgICB0eXBlOiBCb29sZWFuLFxyXG4gICAgZGVmYXVsdDogdHJ1ZVxyXG4gIH0sXHJcbiAgcmVtb3ZlQnV0dG9uQ29sb3I6IHtcclxuICAgIHR5cGU6IFN0cmluZyxcclxuICAgIGRlZmF1bHQ6ICdyZWQnXHJcbiAgfSxcclxuICByZW1vdmVCdXR0b25TaXplOiB7XHJcbiAgICB0eXBlOiBOdW1iZXJcclxuICB9LFxyXG4gIGluaXRpYWxJbWFnZTogW1N0cmluZywgSFRNTEltYWdlRWxlbWVudF0sXHJcbiAgaW5pdGlhbFNpemU6IHtcclxuICAgIHR5cGU6IFN0cmluZyxcclxuICAgIGRlZmF1bHQ6ICdjb3ZlcicsXHJcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgcmV0dXJuIHZhbCA9PT0gJ2NvdmVyJyB8fCB2YWwgPT09ICdjb250YWluJyB8fCB2YWwgPT09ICduYXR1cmFsJ1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgaW5pdGlhbFBvc2l0aW9uOiB7XHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICBkZWZhdWx0OiAnY2VudGVyJyxcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICB2YXIgdmFsaWRzID0gW1xyXG4gICAgICAgICdjZW50ZXInLFxyXG4gICAgICAgICd0b3AnLFxyXG4gICAgICAgICdib3R0b20nLFxyXG4gICAgICAgICdsZWZ0JyxcclxuICAgICAgICAncmlnaHQnLFxyXG4gICAgICAgICd0b3AgbGVmdCcsXHJcbiAgICAgICAgJ3RvcCByaWdodCcsXHJcbiAgICAgICAgJ2JvdHRvbSBsZWZ0JyxcclxuICAgICAgICAnYm90dG9tIHJpZ2h0JyxcclxuICAgICAgICAnbGVmdCB0b3AnLFxyXG4gICAgICAgICdyaWdodCB0b3AnLFxyXG4gICAgICAgICdsZWZ0IGJvdHRvbScsXHJcbiAgICAgICAgJ3JpZ2h0IGJvdHRvbSdcclxuICAgICAgXVxyXG4gICAgICByZXR1cm4gdmFsaWRzLmluZGV4T2YodmFsKSA+PSAwIHx8IC9eLT9cXGQrJSAtP1xcZCslJC8udGVzdCh2YWwpXHJcbiAgICB9XHJcbiAgfVxyXG59IiwiZXhwb3J0IGRlZmF1bHQge1xuICBJTklUX0VWRU5UOiAnaW5pdCcsXG4gIEZJTEVfQ0hPT1NFX0VWRU5UOiAnZmlsZS1jaG9vc2UnLFxuICBGSUxFX1NJWkVfRVhDRUVEX0VWRU5UOiAnZmlsZS1zaXplLWV4Y2VlZCcsXG4gIEZJTEVfVFlQRV9NSVNNQVRDSF9FVkVOVDogJ2ZpbGUtdHlwZS1taXNtYXRjaCcsXG4gIE5FV19JTUFHRTogJ25ldy1pbWFnZScsXG4gIElNQUdFX1JFTU9WRV9FVkVOVDogJ2ltYWdlLXJlbW92ZScsXG4gIE1PVkVfRVZFTlQ6ICdtb3ZlJyxcbiAgWk9PTV9FVkVOVDogJ3pvb20nLFxuICBEUkFXOiAnZHJhdydcbn0iLCI8dGVtcGxhdGU+XHJcbiAgPGRpdiByZWY9XCJ3cmFwcGVyXCJcclxuICAgICAgIDpjbGFzcz1cImBjcm9wcGEtY29udGFpbmVyICR7aW1nID8gJ2Nyb3BwYS0taGFzLXRhcmdldCcgOiAnJ30gJHtkaXNhYmxlZCA/ICdjcm9wcGEtLWRpc2FibGVkJyA6ICcnfSAke2Rpc2FibGVDbGlja1RvQ2hvb3NlID8gJ2Nyb3BwYS0tZGlzYWJsZWQtY2MnIDogJyd9ICR7ZGlzYWJsZURyYWdUb01vdmUgJiYgZGlzYWJsZVNjcm9sbFRvWm9vbSA/ICdjcm9wcGEtLWRpc2FibGVkLW16JyA6ICcnfSAke2ZpbGVEcmFnZ2VkT3ZlciA/ICdjcm9wcGEtLWRyb3B6b25lJyA6ICcnfWBcIlxyXG4gICAgICAgQGRyYWdlbnRlci5zdG9wLnByZXZlbnQ9XCJoYW5kbGVEcmFnRW50ZXJcIlxyXG4gICAgICAgQGRyYWdsZWF2ZS5zdG9wLnByZXZlbnQ9XCJoYW5kbGVEcmFnTGVhdmVcIlxyXG4gICAgICAgQGRyYWdvdmVyLnN0b3AucHJldmVudD1cImhhbmRsZURyYWdPdmVyXCJcclxuICAgICAgIEBkcm9wLnN0b3AucHJldmVudD1cImhhbmRsZURyb3BcIj5cclxuICAgIDxpbnB1dCB0eXBlPVwiZmlsZVwiXHJcbiAgICAgICAgICAgOmFjY2VwdD1cImFjY2VwdFwiXHJcbiAgICAgICAgICAgOmRpc2FibGVkPVwiZGlzYWJsZWRcIlxyXG4gICAgICAgICAgIHJlZj1cImZpbGVJbnB1dFwiXHJcbiAgICAgICAgICAgaGlkZGVuXHJcbiAgICAgICAgICAgQGNoYW5nZT1cImhhbmRsZUlucHV0Q2hhbmdlXCIgLz5cclxuICAgIDxkaXYgY2xhc3M9XCJpbml0aWFsXCJcclxuICAgICAgICAgc3R5bGU9XCJ3aWR0aDogMDsgaGVpZ2h0OiAwOyB2aXNpYmlsaXR5OiBoaWRkZW47XCI+XHJcbiAgICAgIDxzbG90IG5hbWU9XCJpbml0aWFsXCI+PC9zbG90PlxyXG4gICAgPC9kaXY+XHJcbiAgICA8Y2FudmFzIHJlZj1cImNhbnZhc1wiXHJcbiAgICAgICAgICAgIEBjbGljay5zdG9wLnByZXZlbnQ9XCJoYW5kbGVDbGlja1wiXHJcbiAgICAgICAgICAgIEB0b3VjaHN0YXJ0LnN0b3A9XCJoYW5kbGVQb2ludGVyU3RhcnRcIlxyXG4gICAgICAgICAgICBAbW91c2Vkb3duLnN0b3AucHJldmVudD1cImhhbmRsZVBvaW50ZXJTdGFydFwiXHJcbiAgICAgICAgICAgIEBwb2ludGVyc3RhcnQuc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlclN0YXJ0XCJcclxuICAgICAgICAgICAgQHRvdWNoZW5kLnN0b3AucHJldmVudD1cImhhbmRsZVBvaW50ZXJFbmRcIlxyXG4gICAgICAgICAgICBAdG91Y2hjYW5jZWwuc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlckVuZFwiXHJcbiAgICAgICAgICAgIEBtb3VzZXVwLnN0b3AucHJldmVudD1cImhhbmRsZVBvaW50ZXJFbmRcIlxyXG4gICAgICAgICAgICBAcG9pbnRlcmVuZC5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyRW5kXCJcclxuICAgICAgICAgICAgQHBvaW50ZXJjYW5jZWwuc3RvcC5wcmV2ZW50PVwiaGFuZGxlUG9pbnRlckVuZFwiXHJcbiAgICAgICAgICAgIEB0b3VjaG1vdmUuc3RvcD1cImhhbmRsZVBvaW50ZXJNb3ZlXCJcclxuICAgICAgICAgICAgQG1vdXNlbW92ZS5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyTW92ZVwiXHJcbiAgICAgICAgICAgIEBwb2ludGVybW92ZS5zdG9wLnByZXZlbnQ9XCJoYW5kbGVQb2ludGVyTW92ZVwiXHJcbiAgICAgICAgICAgIEBET01Nb3VzZVNjcm9sbC5zdG9wPVwiaGFuZGxlV2hlZWxcIlxyXG4gICAgICAgICAgICBAd2hlZWwuc3RvcD1cImhhbmRsZVdoZWVsXCJcclxuICAgICAgICAgICAgQG1vdXNld2hlZWwuc3RvcD1cImhhbmRsZVdoZWVsXCI+PC9jYW52YXM+XHJcbiAgICA8c3ZnIGNsYXNzPVwiaWNvbiBpY29uLXJlbW92ZVwiXHJcbiAgICAgICAgIHYtaWY9XCJzaG93UmVtb3ZlQnV0dG9uICYmIGltZ1wiXHJcbiAgICAgICAgIEBjbGljaz1cInJlbW92ZVwiXHJcbiAgICAgICAgIDpzdHlsZT1cImB0b3A6IC0ke2hlaWdodC80MH1weDsgcmlnaHQ6IC0ke3dpZHRoLzQwfXB4YFwiXHJcbiAgICAgICAgIHZpZXdCb3g9XCIwIDAgMTAyNCAxMDI0XCJcclxuICAgICAgICAgdmVyc2lvbj1cIjEuMVwiXHJcbiAgICAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxyXG4gICAgICAgICB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIlxyXG4gICAgICAgICA6d2lkdGg9XCJyZW1vdmVCdXR0b25TaXplIHx8IHdpZHRoLzEwXCJcclxuICAgICAgICAgOmhlaWdodD1cInJlbW92ZUJ1dHRvblNpemUgfHwgd2lkdGgvMTBcIj5cclxuICAgICAgPHBhdGggZD1cIk01MTEuOTIxMjMxIDBDMjI5LjE3OTA3NyAwIDAgMjI5LjI1Nzg0NiAwIDUxMiAwIDc5NC43MDI3NjkgMjI5LjE3OTA3NyAxMDI0IDUxMS45MjEyMzEgMTAyNCA3OTQuNzgxNTM4IDEwMjQgMTAyNCA3OTQuNzAyNzY5IDEwMjQgNTEyIDEwMjQgMjI5LjI1Nzg0NiA3OTQuNzgxNTM4IDAgNTExLjkyMTIzMSAwWk03MzIuMDQxODQ2IDY1MC42MzM4NDYgNjUwLjUxNTY5MiA3MzIuMDgxMjMxQzY1MC41MTU2OTIgNzMyLjA4MTIzMSA1MjEuNDkxNjkyIDU5My42ODM2OTIgNTExLjg4MTg0NiA1OTMuNjgzNjkyIDUwMi40Mjk1MzggNTkzLjY4MzY5MiAzNzMuMzY2MTU0IDczMi4wODEyMzEgMzczLjM2NjE1NCA3MzIuMDgxMjMxTDI5MS43NjEyMzEgNjUwLjYzMzg0NkMyOTEuNzYxMjMxIDY1MC42MzM4NDYgNDMwLjMxNjMwOCA1MjMuNTAwMzA4IDQzMC4zMTYzMDggNTEyLjE5NjkyMyA0MzAuMzE2MzA4IDUwMC42OTY2MTUgMjkxLjc2MTIzMSAzNzMuNTIzNjkyIDI5MS43NjEyMzEgMzczLjUyMzY5MkwzNzMuMzY2MTU0IDI5MS45MTg3NjlDMzczLjM2NjE1NCAyOTEuOTE4NzY5IDUwMy40NTM1MzggNDMwLjM5NTA3NyA1MTEuODgxODQ2IDQzMC4zOTUwNzcgNTIwLjM0OTUzOCA0MzAuMzk1MDc3IDY1MC41MTU2OTIgMjkxLjkxODc2OSA2NTAuNTE1NjkyIDI5MS45MTg3NjlMNzMyLjA0MTg0NiAzNzMuNTIzNjkyQzczMi4wNDE4NDYgMzczLjUyMzY5MiA1OTMuNDQ3Mzg1IDUwMi41NDc2OTIgNTkzLjQ0NzM4NSA1MTIuMTk2OTIzIDU5My40NDczODUgNTIxLjQxMjkyMyA3MzIuMDQxODQ2IDY1MC42MzM4NDYgNzMyLjA0MTg0NiA2NTAuNjMzODQ2WlwiXHJcbiAgICAgICAgICAgIDpmaWxsPVwicmVtb3ZlQnV0dG9uQ29sb3JcIj48L3BhdGg+XHJcbiAgICA8L3N2Zz5cclxuICA8L2Rpdj5cclxuPC90ZW1wbGF0ZT5cclxuXHJcbjxzY3JpcHQ+XHJcbiAgaW1wb3J0IHUgZnJvbSAnLi91dGlsJ1xyXG4gIGltcG9ydCBwcm9wcyBmcm9tICcuL3Byb3BzJ1xyXG4gIGltcG9ydCBldmVudHMgZnJvbSAnLi9ldmVudHMnXHJcblxyXG4gIGNvbnN0IFBDVF9QRVJfWk9PTSA9IDEgLyAxMDAwMDAgLy8gVGhlIGFtb3VudCBvZiB6b29taW5nIGV2ZXJ5dGltZSBpdCBoYXBwZW5zLCBpbiBwZXJjZW50YWdlIG9mIGltYWdlIHdpZHRoLlxyXG4gIGNvbnN0IE1JTl9NU19QRVJfQ0xJQ0sgPSA1MDAgLy8gSWYgdG91Y2ggZHVyYXRpb24gaXMgc2hvcnRlciB0aGFuIHRoZSB2YWx1ZSwgdGhlbiBpdCBpcyBjb25zaWRlcmVkIGFzIGEgY2xpY2suXHJcbiAgY29uc3QgQ0xJQ0tfTU9WRV9USFJFU0hPTEQgPSAxMDAgLy8gSWYgdG91Y2ggbW92ZSBkaXN0YW5jZSBpcyBncmVhdGVyIHRoYW4gdGhpcyB2YWx1ZSwgdGhlbiBpdCB3aWxsIGJ5IG5vIG1lYW4gYmUgY29uc2lkZXJlZCBhcyBhIGNsaWNrLlxyXG4gIGNvbnN0IE1JTl9XSURUSCA9IDEwIC8vIFRoZSBtaW5pbWFsIHdpZHRoIHRoZSB1c2VyIGNhbiB6b29tIHRvLlxyXG4gIGNvbnN0IERFRkFVTFRfUExBQ0VIT0xERVJfVEFLRVVQID0gMiAvIDMgLy8gUGxhY2Vob2xkZXIgdGV4dCBieSBkZWZhdWx0IHRha2VzIHVwIHRoaXMgYW1vdW50IG9mIHRpbWVzIG9mIGNhbnZhcyB3aWR0aC5cclxuICBjb25zdCBQSU5DSF9BQ0NFTEVSQVRJT04gPSAyIC8vIFRoZSBhbW91bnQgb2YgdGltZXMgYnkgd2hpY2ggdGhlIHBpbmNoaW5nIGlzIG1vcmUgc2Vuc2l0aXZlIHRoYW4gdGhlIHNjb2xsaW5nXHJcbiAgY29uc3QgREVCVUcgPSBmYWxzZVxyXG5cclxuICBleHBvcnQgZGVmYXVsdCB7XHJcbiAgICBtb2RlbDoge1xyXG4gICAgICBwcm9wOiAndmFsdWUnLFxyXG4gICAgICBldmVudDogJ2luaXQnXHJcbiAgICB9LFxyXG5cclxuICAgIHByb3BzOiBwcm9wcyxcclxuXHJcbiAgICBkYXRhICgpIHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBpbnN0YW5jZTogbnVsbCxcclxuICAgICAgICBjYW52YXM6IG51bGwsXHJcbiAgICAgICAgY3R4OiBudWxsLFxyXG4gICAgICAgIG9yaWdpbmFsSW1hZ2U6IG51bGwsXHJcbiAgICAgICAgaW1nOiBudWxsLFxyXG4gICAgICAgIGRyYWdnaW5nOiBmYWxzZSxcclxuICAgICAgICBsYXN0TW92aW5nQ29vcmQ6IG51bGwsXHJcbiAgICAgICAgaW1nRGF0YToge30sXHJcbiAgICAgICAgZGF0YVVybDogJycsXHJcbiAgICAgICAgZmlsZURyYWdnZWRPdmVyOiBmYWxzZSxcclxuICAgICAgICB0YWJTdGFydDogMCxcclxuICAgICAgICBwaW5jaGluZzogZmFsc2UsXHJcbiAgICAgICAgcGluY2hEaXN0YW5jZTogMCxcclxuICAgICAgICBzdXBwb3J0VG91Y2g6IGZhbHNlLFxyXG4gICAgICAgIHBvaW50ZXJNb3ZlZDogZmFsc2UsXHJcbiAgICAgICAgcG9pbnRlclN0YXJ0Q29vcmQ6IG51bGwsXHJcbiAgICAgICAgbmF0dXJhbFdpZHRoOiAwLFxyXG4gICAgICAgIG5hdHVyYWxIZWlnaHQ6IDAsXHJcbiAgICAgICAgc2NhbGVSYXRpbzogMSxcclxuICAgICAgICBvcmllbnRhdGlvbjogMSxcclxuICAgICAgICB1c2VyTWV0YWRhdGE6IG51bGxcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBjb21wdXRlZDoge1xyXG4gICAgICByZWFsV2lkdGggKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLndpZHRoICogdGhpcy5xdWFsaXR5XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICByZWFsSGVpZ2h0ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5oZWlnaHQgKiB0aGlzLnF1YWxpdHlcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHJlYWxQbGFjZWhvbGRlckZvbnRTaXplICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wbGFjZWhvbGRlckZvbnRTaXplICogdGhpcy5xdWFsaXR5XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgbW91bnRlZCAoKSB7XHJcbiAgICAgIHRoaXMuaW5pdCgpXHJcbiAgICAgIHUuckFGUG9seWZpbGwoKVxyXG4gICAgICB1LnRvQmxvYlBvbHlmaWxsKClcclxuXHJcbiAgICAgIGxldCBzdXBwb3J0cyA9IHRoaXMuc3VwcG9ydERldGVjdGlvbigpXHJcbiAgICAgIGlmICghc3VwcG9ydHMuYmFzaWMpIHtcclxuICAgICAgICBjb25zb2xlLndhcm4oJ1lvdXIgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IHZ1ZS1jcm9wcGEgZnVuY3Rpb25hbGl0eS4nKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIHdhdGNoOiB7XHJcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgICAgdGhpcy5pbnN0YW5jZSA9IHZhbFxyXG4gICAgICB9LFxyXG4gICAgICByZWFsV2lkdGg6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaW1nKSB7XHJcbiAgICAgICAgICB0aGlzLmluaXQoKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLnNldFNpemUoKVxyXG4gICAgICAgICAgdGhpcy5pbWdDb250ZW50SW5pdCgpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICByZWFsSGVpZ2h0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmltZykge1xyXG4gICAgICAgICAgdGhpcy5pbml0KClcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5zZXRTaXplKClcclxuICAgICAgICAgIHRoaXMuaW1nQ29udGVudEluaXQoKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgY2FudmFzQ29sb3I6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaW1nKSB7XHJcbiAgICAgICAgICB0aGlzLmluaXQoKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLmRyYXcoKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgcGxhY2Vob2xkZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaW1nKSB7XHJcbiAgICAgICAgICB0aGlzLmluaXQoKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgcGxhY2Vob2xkZXJDb2xvcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5pbWcpIHtcclxuICAgICAgICAgIHRoaXMuaW5pdCgpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICByZWFsUGxhY2Vob2xkZXJGb250U2l6ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5pbWcpIHtcclxuICAgICAgICAgIHRoaXMuaW5pdCgpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBwcmV2ZW50V2hpdGVTcGFjZSAoKSB7XHJcbiAgICAgICAgdGhpcy5pbWdDb250ZW50SW5pdCgpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgbWV0aG9kczoge1xyXG4gICAgICBpbml0ICgpIHtcclxuICAgICAgICB0aGlzLmNhbnZhcyA9IHRoaXMuJHJlZnMuY2FudmFzXHJcbiAgICAgICAgdGhpcy5zZXRTaXplKClcclxuICAgICAgICB0aGlzLmNhbnZhcy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAoIXRoaXMuY2FudmFzQ29sb3IgfHwgdGhpcy5jYW52YXNDb2xvciA9PSAnZGVmYXVsdCcpID8gJ3RyYW5zcGFyZW50JyA6ICh0eXBlb2YgdGhpcy5jYW52YXNDb2xvciA9PT0gJ3N0cmluZycgPyB0aGlzLmNhbnZhc0NvbG9yIDogJycpXHJcbiAgICAgICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXHJcbiAgICAgICAgdGhpcy5vcmlnaW5hbEltYWdlID0gbnVsbFxyXG4gICAgICAgIHRoaXMuaW1nID0gbnVsbFxyXG4gICAgICAgIHRoaXMuc2V0SW5pdGlhbCgpXHJcbiAgICAgICAgdGhpcy4kZW1pdChldmVudHMuSU5JVF9FVkVOVCwge1xyXG4gICAgICAgICAgZ2V0Q2FudmFzOiAoKSA9PiB0aGlzLmNhbnZhcyxcclxuICAgICAgICAgIGdldENvbnRleHQ6ICgpID0+IHRoaXMuY3R4LFxyXG4gICAgICAgICAgZ2V0Q2hvc2VuRmlsZTogKCkgPT4gdGhpcy4kcmVmcy5maWxlSW5wdXQuZmlsZXNbMF0sXHJcbiAgICAgICAgICBnZXRBY3R1YWxJbWFnZVNpemU6ICgpID0+ICh7XHJcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLnJlYWxXaWR0aCxcclxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnJlYWxIZWlnaHRcclxuICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgbW92ZVVwd2FyZHM6IChhbW91bnQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5tb3ZlKHsgeDogMCwgeTogLWFtb3VudCB9KVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIG1vdmVEb3dud2FyZHM6IChhbW91bnQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5tb3ZlKHsgeDogMCwgeTogYW1vdW50IH0pXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgbW92ZUxlZnR3YXJkczogKGFtb3VudCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLm1vdmUoeyB4OiAtYW1vdW50LCB5OiAwIH0pXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgbW92ZVJpZ2h0d2FyZHM6IChhbW91bnQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5tb3ZlKHsgeDogYW1vdW50LCB5OiAwIH0pXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgem9vbUluOiAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuem9vbSh0cnVlKVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHpvb21PdXQ6ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy56b29tKGZhbHNlKVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHJvdGF0ZTogKHN0ZXAgPSAxKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRpc2FibGVSb3RhdGlvbiB8fCB0aGlzLmRpc2FibGVkKSByZXR1cm5cclxuICAgICAgICAgICAgc3RlcCA9IHBhcnNlSW50KHN0ZXApXHJcbiAgICAgICAgICAgIGlmIChpc05hTihzdGVwKSB8fCBzdGVwID4gMyB8fCBzdGVwIDwgLTMpIHtcclxuICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0ludmFsaWQgYXJndW1lbnQgZm9yIHJvdGF0ZSgpIG1ldGhvZC4gSXQgc2hvdWxkIG9uZSBvZiB0aGUgaW50ZWdlcnMgZnJvbSAtMyB0byAzLicpXHJcbiAgICAgICAgICAgICAgc3RlcCA9IDFcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnJvdGF0ZUJ5U3RlcChzdGVwKVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGZsaXBYOiAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRpc2FibGVSb3RhdGlvbiB8fCB0aGlzLmRpc2FibGVkKSByZXR1cm5cclxuICAgICAgICAgICAgdGhpcy5yb3RhdGUoMilcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBmbGlwWTogKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kaXNhYmxlUm90YXRpb24gfHwgdGhpcy5kaXNhYmxlZCkgcmV0dXJuXHJcbiAgICAgICAgICAgIHRoaXMucm90YXRlKDQpXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgcmVmcmVzaDogKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLiRuZXh0VGljayh0aGlzLmluaXQpXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgaGFzSW1hZ2U6ICgpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuICEhdGhpcy5pbWdcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICByZW1vdmU6IHRoaXMucmVtb3ZlLFxyXG4gICAgICAgICAgY2hvb3NlRmlsZTogdGhpcy5jaG9vc2VGaWxlLFxyXG4gICAgICAgICAgZ2VuZXJhdGVEYXRhVXJsOiB0aGlzLmdlbmVyYXRlRGF0YVVybCxcclxuICAgICAgICAgIGdlbmVyYXRlQmxvYjogdGhpcy5nZW5lcmF0ZUJsb2IsXHJcbiAgICAgICAgICBwcm9taXNlZEJsb2I6IHRoaXMucHJvbWlzZWRCbG9iLFxyXG4gICAgICAgICAgc3VwcG9ydERldGVjdGlvbjogdGhpcy5zdXBwb3J0RGV0ZWN0aW9uLFxyXG4gICAgICAgICAgZ2V0TWV0YWRhdGE6IHRoaXMuZ2V0TWV0YWRhdGEsXHJcbiAgICAgICAgICBhcHBseU1ldGFkYXRhOiAobWV0YWRhdGEpID0+IHtcclxuICAgICAgICAgICAgaWYgKCFtZXRhZGF0YSkgcmV0dXJuXHJcbiAgICAgICAgICAgIHRoaXMudXNlck1ldGFkYXRhID0gbWV0YWRhdGFcclxuICAgICAgICAgICAgdGhpcy5yb3RhdGUobWV0YWRhdGEub3JpZW50YXRpb24gfHwgdGhpcy5vcmllbnRhdGlvbiwgdHJ1ZSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgc2V0U2l6ZSAoKSB7XHJcbiAgICAgICAgdGhpcy5jYW52YXMud2lkdGggPSB0aGlzLnJlYWxXaWR0aFxyXG4gICAgICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMucmVhbEhlaWdodFxyXG4gICAgICAgIHRoaXMuY2FudmFzLnN0eWxlLndpZHRoID0gdGhpcy53aWR0aCArICdweCdcclxuICAgICAgICB0aGlzLmNhbnZhcy5zdHlsZS5oZWlnaHQgPSB0aGlzLmhlaWdodCArICdweCdcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHJvdGF0ZUJ5U3RlcCAoc3RlcCkge1xyXG4gICAgICAgIGxldCBvcmllbnRhdGlvbiA9IDFcclxuICAgICAgICBzd2l0Y2ggKHN0ZXApIHtcclxuICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgb3JpZW50YXRpb24gPSA2XHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgIG9yaWVudGF0aW9uID0gM1xyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICBvcmllbnRhdGlvbiA9IDhcclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgIGNhc2UgLTE6XHJcbiAgICAgICAgICAgIG9yaWVudGF0aW9uID0gOFxyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgY2FzZSAtMjpcclxuICAgICAgICAgICAgb3JpZW50YXRpb24gPSAzXHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICBjYXNlIC0zOlxyXG4gICAgICAgICAgICBvcmllbnRhdGlvbiA9IDZcclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5yb3RhdGUob3JpZW50YXRpb24pXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBzdXBwb3J0RGV0ZWN0aW9uICgpIHtcclxuICAgICAgICB2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgJ2Jhc2ljJzogd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSAmJiB3aW5kb3cuRmlsZSAmJiB3aW5kb3cuRmlsZVJlYWRlciAmJiB3aW5kb3cuRmlsZUxpc3QgJiYgd2luZG93LkJsb2IsXHJcbiAgICAgICAgICAnZG5kJzogJ29uZHJhZ3N0YXJ0JyBpbiBkaXYgJiYgJ29uZHJvcCcgaW4gZGl2XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgcmVtb3ZlICgpIHtcclxuICAgICAgICBsZXQgY3R4ID0gdGhpcy5jdHhcclxuICAgICAgICB0aGlzLnBhaW50QmFja2dyb3VuZCgpXHJcbiAgICAgICAgY3R4LnRleHRCYXNlbGluZSA9ICdtaWRkbGUnXHJcbiAgICAgICAgY3R4LnRleHRBbGlnbiA9ICdjZW50ZXInXHJcbiAgICAgICAgbGV0IGRlZmF1bHRGb250U2l6ZSA9IHRoaXMucmVhbFdpZHRoICogREVGQVVMVF9QTEFDRUhPTERFUl9UQUtFVVAgLyB0aGlzLnBsYWNlaG9sZGVyLmxlbmd0aFxyXG4gICAgICAgIGxldCBmb250U2l6ZSA9ICghdGhpcy5yZWFsUGxhY2Vob2xkZXJGb250U2l6ZSB8fCB0aGlzLnJlYWxQbGFjZWhvbGRlckZvbnRTaXplID09IDApID8gZGVmYXVsdEZvbnRTaXplIDogdGhpcy5yZWFsUGxhY2Vob2xkZXJGb250U2l6ZVxyXG4gICAgICAgIGN0eC5mb250ID0gZm9udFNpemUgKyAncHggc2Fucy1zZXJpZidcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gKCF0aGlzLnBsYWNlaG9sZGVyQ29sb3IgfHwgdGhpcy5wbGFjZWhvbGRlckNvbG9yID09ICdkZWZhdWx0JykgPyAnIzYwNjA2MCcgOiB0aGlzLnBsYWNlaG9sZGVyQ29sb3JcclxuICAgICAgICBjdHguZmlsbFRleHQodGhpcy5wbGFjZWhvbGRlciwgdGhpcy5yZWFsV2lkdGggLyAyLCB0aGlzLnJlYWxIZWlnaHQgLyAyKVxyXG5cclxuICAgICAgICBsZXQgaGFkSW1hZ2UgPSB0aGlzLmltZyAhPSBudWxsXHJcbiAgICAgICAgdGhpcy5vcmlnaW5hbEltYWdlID0gbnVsbFxyXG4gICAgICAgIHRoaXMuaW1nID0gbnVsbFxyXG4gICAgICAgIHRoaXMuJHJlZnMuZmlsZUlucHV0LnZhbHVlID0gJydcclxuICAgICAgICB0aGlzLmltZ0RhdGEgPSB7fVxyXG4gICAgICAgIHRoaXMub3JpZW50YXRpb24gPSAxXHJcbiAgICAgICAgdGhpcy51c2VyTWV0YWRhdGEgPSBudWxsXHJcblxyXG4gICAgICAgIGlmIChoYWRJbWFnZSkge1xyXG4gICAgICAgICAgdGhpcy4kZW1pdChldmVudHMuSU1BR0VfUkVNT1ZFX0VWRU5UKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIHNldEluaXRpYWwgKCkge1xyXG4gICAgICAgIGxldCBzcmMsIGltZ1xyXG4gICAgICAgIGlmICh0aGlzLiRzbG90cy5pbml0aWFsICYmIHRoaXMuJHNsb3RzLmluaXRpYWxbMF0pIHtcclxuICAgICAgICAgIGxldCB2Tm9kZSA9IHRoaXMuJHNsb3RzLmluaXRpYWxbMF1cclxuICAgICAgICAgIGxldCB7IHRhZywgZWxtIH0gPSB2Tm9kZVxyXG4gICAgICAgICAgaWYgKHRhZyA9PSAnaW1nJyAmJiBlbG0pIHtcclxuICAgICAgICAgICAgaW1nID0gZWxtXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghc3JjICYmIHRoaXMuaW5pdGlhbEltYWdlICYmIHR5cGVvZiB0aGlzLmluaXRpYWxJbWFnZSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgIHNyYyA9IHRoaXMuaW5pdGlhbEltYWdlXHJcbiAgICAgICAgICBpbWcgPSBuZXcgSW1hZ2UoKVxyXG4gICAgICAgICAgaWYgKCEvXmRhdGE6Ly50ZXN0KHNyYykgJiYgIS9eYmxvYjovLnRlc3Qoc3JjKSkge1xyXG4gICAgICAgICAgICBpbWcuc2V0QXR0cmlidXRlKCdjcm9zc09yaWdpbicsICdhbm9ueW1vdXMnKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaW1nLnNyYyA9IHNyY1xyXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoaXMuaW5pdGlhbEltYWdlID09PSAnb2JqZWN0JyAmJiB0aGlzLmluaXRpYWxJbWFnZSBpbnN0YW5jZW9mIEltYWdlKSB7XHJcbiAgICAgICAgICBpbWcgPSB0aGlzLmluaXRpYWxJbWFnZVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXNyYyAmJiAhaW1nKSB7XHJcbiAgICAgICAgICB0aGlzLnJlbW92ZSgpXHJcbiAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHUuaW1hZ2VMb2FkZWQoaW1nKSkge1xyXG4gICAgICAgICAgdGhpcy5fb25sb2FkKGltZywgK2ltZy5kYXRhc2V0WydleGlmT3JpZW50YXRpb24nXSlcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaW1nLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fb25sb2FkKGltZywgK2ltZy5kYXRhc2V0WydleGlmT3JpZW50YXRpb24nXSlcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpbWcub25lcnJvciA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5yZW1vdmUoKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9vbmxvYWQgKGltZywgb3JpZW50YXRpb24gPSAxKSB7XHJcbiAgICAgICAgdGhpcy5vcmlnaW5hbEltYWdlID0gaW1nXHJcbiAgICAgICAgdGhpcy5pbWcgPSBpbWdcclxuXHJcbiAgICAgICAgdGhpcy5yb3RhdGUob3JpZW50YXRpb24pXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBjaG9vc2VGaWxlICgpIHtcclxuICAgICAgICB0aGlzLiRyZWZzLmZpbGVJbnB1dC5jbGljaygpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBoYW5kbGVDbGljayAoKSB7XHJcbiAgICAgICAgaWYgKERFQlVHKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnY2xpY2snKVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXRoaXMuaW1nICYmICF0aGlzLmRpc2FibGVDbGlja1RvQ2hvb3NlICYmICF0aGlzLmRpc2FibGVkICYmICF0aGlzLnN1cHBvcnRUb3VjaCkge1xyXG4gICAgICAgICAgdGhpcy5jaG9vc2VGaWxlKClcclxuICAgICAgICAgIGlmIChERUJVRykge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygndHJpZ2dlciBieSBjbGljaycpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgaGFuZGxlSW5wdXRDaGFuZ2UgKCkge1xyXG4gICAgICAgIGxldCBpbnB1dCA9IHRoaXMuJHJlZnMuZmlsZUlucHV0XHJcbiAgICAgICAgaWYgKCFpbnB1dC5maWxlcy5sZW5ndGgpIHJldHVyblxyXG5cclxuICAgICAgICBsZXQgZmlsZSA9IGlucHV0LmZpbGVzWzBdXHJcbiAgICAgICAgdGhpcy5vbk5ld0ZpbGVJbihmaWxlKVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgb25OZXdGaWxlSW4gKGZpbGUpIHtcclxuICAgICAgICB0aGlzLiRlbWl0KGV2ZW50cy5GSUxFX0NIT09TRV9FVkVOVCwgZmlsZSlcclxuICAgICAgICBpZiAoIXRoaXMuZmlsZVNpemVJc1ZhbGlkKGZpbGUpKSB7XHJcbiAgICAgICAgICB0aGlzLiRlbWl0KGV2ZW50cy5GSUxFX1NJWkVfRVhDRUVEX0VWRU5ULCBmaWxlKVxyXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdGaWxlIHNpemUgZXhjZWVkcyBsaW1pdCB3aGljaCBpcyAnICsgdGhpcy5maWxlU2l6ZUxpbWl0ICsgJyBieXRlcy4nKVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXRoaXMuZmlsZVR5cGVJc1ZhbGlkKGZpbGUpKSB7XHJcbiAgICAgICAgICB0aGlzLiRlbWl0KGV2ZW50cy5GSUxFX1RZUEVfTUlTTUFUQ0hfRVZFTlQsIGZpbGUpXHJcbiAgICAgICAgICBsZXQgdHlwZSA9IGZpbGUudHlwZSB8fCBmaWxlLm5hbWUudG9Mb3dlckNhc2UoKS5zcGxpdCgnLicpLnBvcCgpXHJcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEZpbGUgdHlwZSAoJHt0eXBlfSkgZG9lcyBub3QgbWF0Y2ggd2hhdCB5b3Ugc3BlY2lmaWVkICgke3RoaXMuYWNjZXB0fSkuYClcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cuRmlsZVJlYWRlciAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgIGxldCBmciA9IG5ldyBGaWxlUmVhZGVyKClcclxuICAgICAgICAgIGZyLm9ubG9hZCA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBmaWxlRGF0YSA9IGUudGFyZ2V0LnJlc3VsdFxyXG4gICAgICAgICAgICBsZXQgb3JpZW50YXRpb24gPSB1LmdldEZpbGVPcmllbnRhdGlvbih1LmJhc2U2NFRvQXJyYXlCdWZmZXIoZmlsZURhdGEpKVxyXG4gICAgICAgICAgICBpZiAob3JpZW50YXRpb24gPCAxKSBvcmllbnRhdGlvbiA9IDFcclxuICAgICAgICAgICAgbGV0IGltZyA9IG5ldyBJbWFnZSgpXHJcbiAgICAgICAgICAgIGltZy5zcmMgPSBmaWxlRGF0YVxyXG4gICAgICAgICAgICBpbWcub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgIHRoaXMuX29ubG9hZChpbWcsIG9yaWVudGF0aW9uKVxyXG4gICAgICAgICAgICAgIHRoaXMuJGVtaXQoZXZlbnRzLk5FV19JTUFHRSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZnIucmVhZEFzRGF0YVVSTChmaWxlKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIGZpbGVTaXplSXNWYWxpZCAoZmlsZSkge1xyXG4gICAgICAgIGlmICghZmlsZSkgcmV0dXJuIGZhbHNlXHJcbiAgICAgICAgaWYgKCF0aGlzLmZpbGVTaXplTGltaXQgfHwgdGhpcy5maWxlU2l6ZUxpbWl0ID09IDApIHJldHVybiB0cnVlXHJcblxyXG4gICAgICAgIHJldHVybiBmaWxlLnNpemUgPCB0aGlzLmZpbGVTaXplTGltaXRcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGZpbGVUeXBlSXNWYWxpZCAoZmlsZSkge1xyXG4gICAgICAgIGxldCBhY2NlcHQgPSB0aGlzLmFjY2VwdCB8fCAnaW1hZ2UvKidcclxuICAgICAgICBsZXQgYmFzZU1pbWV0eXBlID0gYWNjZXB0LnJlcGxhY2UoL1xcLy4qJC8sICcnKVxyXG4gICAgICAgIGxldCB0eXBlcyA9IGFjY2VwdC5zcGxpdCgnLCcpXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHR5cGVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICBsZXQgdHlwZSA9IHR5cGVzW2ldXHJcbiAgICAgICAgICBsZXQgdCA9IHR5cGUudHJpbSgpXHJcbiAgICAgICAgICBpZiAodC5jaGFyQXQoMCkgPT0gJy4nKSB7XHJcbiAgICAgICAgICAgIGlmIChmaWxlLm5hbWUudG9Mb3dlckNhc2UoKS5zcGxpdCgnLicpLnBvcCgpID09PSB0LnRvTG93ZXJDYXNlKCkuc2xpY2UoMSkpIHJldHVybiB0cnVlXHJcbiAgICAgICAgICB9IGVsc2UgaWYgKC9cXC9cXCokLy50ZXN0KHQpKSB7XHJcbiAgICAgICAgICAgIHZhciBmaWxlQmFzZVR5cGUgPSBmaWxlLnR5cGUucmVwbGFjZSgvXFwvLiokLywgJycpXHJcbiAgICAgICAgICAgIGlmIChmaWxlQmFzZVR5cGUgPT09IGJhc2VNaW1ldHlwZSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0gZWxzZSBpZiAoZmlsZS50eXBlID09PSB0eXBlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGltZ0NvbnRlbnRJbml0ICgpIHtcclxuICAgICAgICB0aGlzLm5hdHVyYWxXaWR0aCA9IHRoaXMuaW1nLm5hdHVyYWxXaWR0aFxyXG4gICAgICAgIHRoaXMubmF0dXJhbEhlaWdodCA9IHRoaXMuaW1nLm5hdHVyYWxIZWlnaHRcclxuXHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IDBcclxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gMFxyXG4gICAgICAgIGlmICghdGhpcy5wcmV2ZW50V2hpdGVTcGFjZSAmJiB0aGlzLmluaXRpYWxTaXplID09ICdjb250YWluJykge1xyXG4gICAgICAgICAgdGhpcy5hc3BlY3RGaXQoKVxyXG4gICAgICAgIH0gZWxzZSBpZiAoIXRoaXMucHJldmVudFdoaXRlU3BhY2UgJiYgdGhpcy5pbml0aWFsU2l6ZSA9PSAnbmF0dXJhbCcpIHtcclxuICAgICAgICAgIHRoaXMubmF0dXJhbFNpemUoKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLmFzcGVjdEZpbGwoKVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNjYWxlUmF0aW8gPSB0aGlzLmltZ0RhdGEud2lkdGggLyB0aGlzLm5hdHVyYWxXaWR0aFxyXG5cclxuICAgICAgICBpZiAoL3RvcC8udGVzdCh0aGlzLmluaXRpYWxQb3NpdGlvbikpIHtcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSAwXHJcbiAgICAgICAgfSBlbHNlIGlmICgvYm90dG9tLy50ZXN0KHRoaXMuaW5pdGlhbFBvc2l0aW9uKSkge1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IHRoaXMucmVhbEhlaWdodCAtIHRoaXMuaW1nRGF0YS5oZWlnaHRcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICgvbGVmdC8udGVzdCh0aGlzLmluaXRpYWxQb3NpdGlvbikpIHtcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAwXHJcbiAgICAgICAgfSBlbHNlIGlmICgvcmlnaHQvLnRlc3QodGhpcy5pbml0aWFsUG9zaXRpb24pKSB7XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gdGhpcy5yZWFsV2lkdGggLSB0aGlzLmltZ0RhdGEud2lkdGhcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICgvXi0/XFxkKyUgLT9cXGQrJSQvLnRlc3QodGhpcy5pbml0aWFsUG9zaXRpb24pKSB7XHJcbiAgICAgICAgICB2YXIgcmVzdWx0ID0gL14oLT9cXGQrKSUgKC0/XFxkKyklJC8uZXhlYyh0aGlzLmluaXRpYWxQb3NpdGlvbilcclxuICAgICAgICAgIHZhciB4ID0gK3Jlc3VsdFsxXSAvIDEwMFxyXG4gICAgICAgICAgdmFyIHkgPSArcmVzdWx0WzJdIC8gMTAwXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0geCAqICh0aGlzLnJlYWxXaWR0aCAtIHRoaXMuaW1nRGF0YS53aWR0aClcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSB5ICogKHRoaXMucmVhbEhlaWdodCAtIHRoaXMuaW1nRGF0YS5oZWlnaHQpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmFwcGx5TWV0YWRhdGEoKVxyXG5cclxuICAgICAgICBpZiAodGhpcy5wcmV2ZW50V2hpdGVTcGFjZSkge1xyXG4gICAgICAgICAgdGhpcy5wcmV2ZW50TW92aW5nVG9XaGl0ZVNwYWNlKClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZHJhdygpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBhc3BlY3RGaWxsICgpIHtcclxuICAgICAgICBsZXQgaW1nV2lkdGggPSB0aGlzLm5hdHVyYWxXaWR0aFxyXG4gICAgICAgIGxldCBpbWdIZWlnaHQgPSB0aGlzLm5hdHVyYWxIZWlnaHRcclxuICAgICAgICBsZXQgaW1nUmF0aW8gPSBpbWdIZWlnaHQgLyBpbWdXaWR0aFxyXG4gICAgICAgIGxldCBjYW52YXNSYXRpbyA9IHRoaXMucmVhbEhlaWdodCAvIHRoaXMucmVhbFdpZHRoXHJcbiAgICAgICAgbGV0IHNjYWxlUmF0aW9cclxuICAgICAgICBpZiAoaW1nUmF0aW8gPCBjYW52YXNSYXRpbykge1xyXG4gICAgICAgICAgc2NhbGVSYXRpbyA9IGltZ0hlaWdodCAvIHRoaXMucmVhbEhlaWdodFxyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gaW1nV2lkdGggLyBzY2FsZVJhdGlvXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gdGhpcy5yZWFsSGVpZ2h0XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYID0gLSh0aGlzLmltZ0RhdGEud2lkdGggLSB0aGlzLnJlYWxXaWR0aCkgLyAyXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHNjYWxlUmF0aW8gPSBpbWdXaWR0aCAvIHRoaXMucmVhbFdpZHRoXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gaW1nSGVpZ2h0IC8gc2NhbGVSYXRpb1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gdGhpcy5yZWFsV2lkdGhcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSAtKHRoaXMuaW1nRGF0YS5oZWlnaHQgLSB0aGlzLnJlYWxIZWlnaHQpIC8gMlxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIGFzcGVjdEZpdCAoKSB7XHJcbiAgICAgICAgbGV0IGltZ1dpZHRoID0gdGhpcy5uYXR1cmFsV2lkdGhcclxuICAgICAgICBsZXQgaW1nSGVpZ2h0ID0gdGhpcy5uYXR1cmFsSGVpZ2h0XHJcbiAgICAgICAgbGV0IGltZ1JhdGlvID0gaW1nSGVpZ2h0IC8gaW1nV2lkdGhcclxuICAgICAgICBsZXQgY2FudmFzUmF0aW8gPSB0aGlzLnJlYWxIZWlnaHQgLyB0aGlzLnJlYWxXaWR0aFxyXG4gICAgICAgIGxldCBzY2FsZVJhdGlvXHJcbiAgICAgICAgaWYgKGltZ1JhdGlvIDwgY2FudmFzUmF0aW8pIHtcclxuICAgICAgICAgIHNjYWxlUmF0aW8gPSBpbWdXaWR0aCAvIHRoaXMucmVhbFdpZHRoXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gaW1nSGVpZ2h0IC8gc2NhbGVSYXRpb1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gdGhpcy5yZWFsV2lkdGhcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSAtKHRoaXMuaW1nRGF0YS5oZWlnaHQgLSB0aGlzLnJlYWxIZWlnaHQpIC8gMlxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBzY2FsZVJhdGlvID0gaW1nSGVpZ2h0IC8gdGhpcy5yZWFsSGVpZ2h0XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSBpbWdXaWR0aCAvIHNjYWxlUmF0aW9cclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSB0aGlzLnJlYWxIZWlnaHRcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAtKHRoaXMuaW1nRGF0YS53aWR0aCAtIHRoaXMucmVhbFdpZHRoKSAvIDJcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBuYXR1cmFsU2l6ZSAoKSB7XHJcbiAgICAgICAgbGV0IGltZ1dpZHRoID0gdGhpcy5uYXR1cmFsV2lkdGhcclxuICAgICAgICBsZXQgaW1nSGVpZ2h0ID0gdGhpcy5uYXR1cmFsSGVpZ2h0XHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gaW1nV2lkdGhcclxuICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gaW1nSGVpZ2h0XHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IC0odGhpcy5pbWdEYXRhLndpZHRoIC0gdGhpcy5yZWFsV2lkdGgpIC8gMlxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSAtKHRoaXMuaW1nRGF0YS5oZWlnaHQgLSB0aGlzLnJlYWxIZWlnaHQpIC8gMlxyXG4gICAgICB9LFxyXG5cclxuICAgICAgaGFuZGxlUG9pbnRlclN0YXJ0IChldnQpIHtcclxuICAgICAgICBpZiAoREVCVUcpIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCd0b3VjaCBzdGFydCcpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc3VwcG9ydFRvdWNoID0gdHJ1ZVxyXG4gICAgICAgIHRoaXMucG9pbnRlck1vdmVkID0gZmFsc2VcclxuICAgICAgICBsZXQgcG9pbnRlckNvb3JkID0gdS5nZXRQb2ludGVyQ29vcmRzKGV2dCwgdGhpcylcclxuICAgICAgICB0aGlzLnBvaW50ZXJTdGFydENvb3JkID0gcG9pbnRlckNvb3JkXHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkKSByZXR1cm5cclxuICAgICAgICAvLyBzaW11bGF0ZSBjbGljayB3aXRoIHRvdWNoIG9uIG1vYmlsZSBkZXZpY2VzXHJcbiAgICAgICAgaWYgKCF0aGlzLmltZyAmJiAhdGhpcy5kaXNhYmxlQ2xpY2tUb0Nob29zZSkge1xyXG4gICAgICAgICAgdGhpcy50YWJTdGFydCA9IG5ldyBEYXRlKCkudmFsdWVPZigpXHJcbiAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gaWdub3JlIG1vdXNlIHJpZ2h0IGNsaWNrIGFuZCBtaWRkbGUgY2xpY2tcclxuICAgICAgICBpZiAoZXZ0LndoaWNoICYmIGV2dC53aGljaCA+IDEpIHJldHVyblxyXG5cclxuICAgICAgICBpZiAoIWV2dC50b3VjaGVzIHx8IGV2dC50b3VjaGVzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgdGhpcy5kcmFnZ2luZyA9IHRydWVcclxuICAgICAgICAgIHRoaXMucGluY2hpbmcgPSBmYWxzZVxyXG4gICAgICAgICAgbGV0IGNvb3JkID0gdS5nZXRQb2ludGVyQ29vcmRzKGV2dCwgdGhpcylcclxuICAgICAgICAgIHRoaXMubGFzdE1vdmluZ0Nvb3JkID0gY29vcmRcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChldnQudG91Y2hlcyAmJiBldnQudG91Y2hlcy5sZW5ndGggPT09IDIgJiYgIXRoaXMuZGlzYWJsZVBpbmNoVG9ab29tKSB7XHJcbiAgICAgICAgICB0aGlzLmRyYWdnaW5nID0gZmFsc2VcclxuICAgICAgICAgIHRoaXMucGluY2hpbmcgPSB0cnVlXHJcbiAgICAgICAgICB0aGlzLnBpbmNoRGlzdGFuY2UgPSB1LmdldFBpbmNoRGlzdGFuY2UoZXZ0LCB0aGlzKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGNhbmNlbEV2ZW50cyA9IFsnbW91c2V1cCcsICd0b3VjaGVuZCcsICd0b3VjaGNhbmNlbCcsICdwb2ludGVyZW5kJywgJ3BvaW50ZXJjYW5jZWwnXVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBjYW5jZWxFdmVudHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAgIGxldCBlID0gY2FuY2VsRXZlbnRzW2ldXHJcbiAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGUsIHRoaXMuaGFuZGxlUG9pbnRlckVuZClcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBoYW5kbGVQb2ludGVyRW5kIChldnQpIHtcclxuICAgICAgICBpZiAoREVCVUcpIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCd0b3VjaCBlbmQnKVxyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgcG9pbnRlck1vdmVEaXN0YW5jZSA9IDBcclxuICAgICAgICBpZiAodGhpcy5wb2ludGVyU3RhcnRDb29yZCkge1xyXG4gICAgICAgICAgbGV0IHBvaW50ZXJDb29yZCA9IHUuZ2V0UG9pbnRlckNvb3JkcyhldnQsIHRoaXMpXHJcbiAgICAgICAgICBwb2ludGVyTW92ZURpc3RhbmNlID0gTWF0aC5zcXJ0KE1hdGgucG93KHBvaW50ZXJDb29yZC54IC0gdGhpcy5wb2ludGVyU3RhcnRDb29yZC54LCAyKSArIE1hdGgucG93KHBvaW50ZXJDb29yZC55IC0gdGhpcy5wb2ludGVyU3RhcnRDb29yZC55LCAyKSkgfHwgMFxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCkgcmV0dXJuXHJcbiAgICAgICAgaWYgKCF0aGlzLmltZyAmJiAhdGhpcy5kaXNhYmxlQ2xpY2tUb0Nob29zZSkge1xyXG4gICAgICAgICAgbGV0IHRhYkVuZCA9IG5ldyBEYXRlKCkudmFsdWVPZigpXHJcbiAgICAgICAgICBpZiAoKHBvaW50ZXJNb3ZlRGlzdGFuY2UgPCBDTElDS19NT1ZFX1RIUkVTSE9MRCkgJiYgdGFiRW5kIC0gdGhpcy50YWJTdGFydCA8IE1JTl9NU19QRVJfQ0xJQ0sgJiYgdGhpcy5zdXBwb3J0VG91Y2gpIHtcclxuICAgICAgICAgICAgdGhpcy5jaG9vc2VGaWxlKClcclxuICAgICAgICAgICAgaWYgKERFQlVHKSB7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3RyaWdnZXIgYnkgdG91Y2gnKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0aGlzLnRhYlN0YXJ0ID0gMFxyXG4gICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmRyYWdnaW5nID0gZmFsc2VcclxuICAgICAgICB0aGlzLnBpbmNoaW5nID0gZmFsc2VcclxuICAgICAgICB0aGlzLnBpbmNoRGlzdGFuY2UgPSAwXHJcbiAgICAgICAgdGhpcy5sYXN0TW92aW5nQ29vcmQgPSBudWxsXHJcbiAgICAgICAgdGhpcy5wb2ludGVyTW92ZWQgPSBmYWxzZVxyXG4gICAgICAgIHRoaXMucG9pbnRlclN0YXJ0Q29vcmQgPSBudWxsXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBoYW5kbGVQb2ludGVyTW92ZSAoZXZ0KSB7XHJcbiAgICAgICAgdGhpcy5wb2ludGVyTW92ZWQgPSB0cnVlXHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkIHx8IHRoaXMuZGlzYWJsZURyYWdUb01vdmUgfHwgIXRoaXMuaW1nKSByZXR1cm5cclxuXHJcbiAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICBpZiAoIWV2dC50b3VjaGVzIHx8IGV2dC50b3VjaGVzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgaWYgKCF0aGlzLmRyYWdnaW5nKSByZXR1cm5cclxuICAgICAgICAgIGxldCBjb29yZCA9IHUuZ2V0UG9pbnRlckNvb3JkcyhldnQsIHRoaXMpXHJcbiAgICAgICAgICBpZiAodGhpcy5sYXN0TW92aW5nQ29vcmQpIHtcclxuICAgICAgICAgICAgdGhpcy5tb3ZlKHtcclxuICAgICAgICAgICAgICB4OiBjb29yZC54IC0gdGhpcy5sYXN0TW92aW5nQ29vcmQueCxcclxuICAgICAgICAgICAgICB5OiBjb29yZC55IC0gdGhpcy5sYXN0TW92aW5nQ29vcmQueVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhpcy5sYXN0TW92aW5nQ29vcmQgPSBjb29yZFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGV2dC50b3VjaGVzICYmIGV2dC50b3VjaGVzLmxlbmd0aCA9PT0gMiAmJiAhdGhpcy5kaXNhYmxlUGluY2hUb1pvb20pIHtcclxuICAgICAgICAgIGlmICghdGhpcy5waW5jaGluZykgcmV0dXJuXHJcbiAgICAgICAgICBsZXQgZGlzdGFuY2UgPSB1LmdldFBpbmNoRGlzdGFuY2UoZXZ0LCB0aGlzKVxyXG4gICAgICAgICAgbGV0IGRlbHRhID0gZGlzdGFuY2UgLSB0aGlzLnBpbmNoRGlzdGFuY2VcclxuICAgICAgICAgIHRoaXMuem9vbShkZWx0YSA+IDAsIG51bGwsIFBJTkNIX0FDQ0VMRVJBVElPTilcclxuICAgICAgICAgIHRoaXMucGluY2hEaXN0YW5jZSA9IGRpc3RhbmNlXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgaGFuZGxlV2hlZWwgKGV2dCkge1xyXG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkIHx8IHRoaXMuZGlzYWJsZVNjcm9sbFRvWm9vbSB8fCAhdGhpcy5pbWcpIHJldHVyblxyXG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgbGV0IGNvb3JkID0gdS5nZXRQb2ludGVyQ29vcmRzKGV2dCwgdGhpcylcclxuICAgICAgICBpZiAoZXZ0LndoZWVsRGVsdGEgPCAwIHx8IGV2dC5kZWx0YVkgPiAwIHx8IGV2dC5kZXRhaWwgPiAwKSB7XHJcbiAgICAgICAgICB0aGlzLnpvb20odGhpcy5yZXZlcnNlU2Nyb2xsVG9ab29tLCBjb29yZClcclxuICAgICAgICB9IGVsc2UgaWYgKGV2dC53aGVlbERlbHRhID4gMCB8fCBldnQuZGVsdGFZIDwgMCB8fCBldnQuZGV0YWlsIDwgMCkge1xyXG4gICAgICAgICAgdGhpcy56b29tKCF0aGlzLnJldmVyc2VTY3JvbGxUb1pvb20sIGNvb3JkKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIGhhbmRsZURyYWdFbnRlciAoZXZ0KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5kaXNhYmxlRHJhZ0FuZERyb3AgfHwgdGhpcy5pbWcgfHwgIXUuZXZlbnRIYXNGaWxlKGV2dCkpIHJldHVyblxyXG4gICAgICAgIHRoaXMuZmlsZURyYWdnZWRPdmVyID0gdHJ1ZVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgaGFuZGxlRHJhZ0xlYXZlIChldnQpIHtcclxuICAgICAgICBpZiAoIXRoaXMuZmlsZURyYWdnZWRPdmVyIHx8ICF1LmV2ZW50SGFzRmlsZShldnQpKSByZXR1cm5cclxuICAgICAgICB0aGlzLmZpbGVEcmFnZ2VkT3ZlciA9IGZhbHNlXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBoYW5kbGVEcmFnT3ZlciAoZXZ0KSB7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBoYW5kbGVEcm9wIChldnQpIHtcclxuICAgICAgICBpZiAoIXRoaXMuZmlsZURyYWdnZWRPdmVyIHx8ICF1LmV2ZW50SGFzRmlsZShldnQpKSByZXR1cm5cclxuICAgICAgICB0aGlzLmZpbGVEcmFnZ2VkT3ZlciA9IGZhbHNlXHJcblxyXG4gICAgICAgIGxldCBmaWxlXHJcbiAgICAgICAgbGV0IGR0ID0gZXZ0LmRhdGFUcmFuc2ZlclxyXG4gICAgICAgIGlmICghZHQpIHJldHVyblxyXG4gICAgICAgIGlmIChkdC5pdGVtcykge1xyXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGR0Lml0ZW1zLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBpdGVtID0gZHQuaXRlbXNbaV1cclxuICAgICAgICAgICAgaWYgKGl0ZW0ua2luZCA9PSAnZmlsZScpIHtcclxuICAgICAgICAgICAgICBmaWxlID0gaXRlbS5nZXRBc0ZpbGUoKVxyXG4gICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgZmlsZSA9IGR0LmZpbGVzWzBdXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZmlsZSkge1xyXG4gICAgICAgICAgdGhpcy5vbk5ld0ZpbGVJbihmaWxlKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIG1vdmUgKG9mZnNldCkge1xyXG4gICAgICAgIGlmICghb2Zmc2V0KSByZXR1cm5cclxuICAgICAgICBsZXQgb2xkWCA9IHRoaXMuaW1nRGF0YS5zdGFydFhcclxuICAgICAgICBsZXQgb2xkWSA9IHRoaXMuaW1nRGF0YS5zdGFydFlcclxuICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRYICs9IG9mZnNldC54XHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSArPSBvZmZzZXQueVxyXG4gICAgICAgIGlmICh0aGlzLnByZXZlbnRXaGl0ZVNwYWNlKSB7XHJcbiAgICAgICAgICB0aGlzLnByZXZlbnRNb3ZpbmdUb1doaXRlU3BhY2UoKVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5pbWdEYXRhLnN0YXJ0WCAhPT0gb2xkWCB8fCB0aGlzLmltZ0RhdGEuc3RhcnRZICE9PSBvbGRZKSB7XHJcbiAgICAgICAgICB0aGlzLiRlbWl0KGV2ZW50cy5NT1ZFX0VWRU5UKVxyXG4gICAgICAgICAgdGhpcy5kcmF3KClcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBwcmV2ZW50TW92aW5nVG9XaGl0ZVNwYWNlICgpIHtcclxuICAgICAgICBpZiAodGhpcy5pbWdEYXRhLnN0YXJ0WCA+IDApIHtcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAwXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmltZ0RhdGEuc3RhcnRZID4gMCkge1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IDBcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMucmVhbFdpZHRoIC0gdGhpcy5pbWdEYXRhLnN0YXJ0WCA+IHRoaXMuaW1nRGF0YS53aWR0aCkge1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IC0odGhpcy5pbWdEYXRhLndpZHRoIC0gdGhpcy5yZWFsV2lkdGgpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnJlYWxIZWlnaHQgLSB0aGlzLmltZ0RhdGEuc3RhcnRZID4gdGhpcy5pbWdEYXRhLmhlaWdodCkge1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IC0odGhpcy5pbWdEYXRhLmhlaWdodCAtIHRoaXMucmVhbEhlaWdodClcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICB6b29tICh6b29tSW4sIHBvcywgaW5uZXJBY2NlbGVyYXRpb24gPSAxKSB7XHJcbiAgICAgICAgcG9zID0gcG9zIHx8IHtcclxuICAgICAgICAgIHg6IHRoaXMuaW1nRGF0YS5zdGFydFggKyB0aGlzLmltZ0RhdGEud2lkdGggLyAyLFxyXG4gICAgICAgICAgeTogdGhpcy5pbWdEYXRhLnN0YXJ0WSArIHRoaXMuaW1nRGF0YS5oZWlnaHQgLyAyXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCByZWFsU3BlZWQgPSB0aGlzLnpvb21TcGVlZCAqIGlubmVyQWNjZWxlcmF0aW9uXHJcbiAgICAgICAgbGV0IHNwZWVkID0gKHRoaXMucmVhbFdpZHRoICogUENUX1BFUl9aT09NKSAqIHJlYWxTcGVlZFxyXG4gICAgICAgIGxldCB4ID0gMVxyXG4gICAgICAgIGlmICh6b29tSW4pIHtcclxuICAgICAgICAgIHggPSAxICsgc3BlZWRcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaW1nRGF0YS53aWR0aCA+IE1JTl9XSURUSCkge1xyXG4gICAgICAgICAgeCA9IDEgLSBzcGVlZFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IG9sZFdpZHRoID0gdGhpcy5pbWdEYXRhLndpZHRoXHJcbiAgICAgICAgbGV0IG9sZEhlaWdodCA9IHRoaXMuaW1nRGF0YS5oZWlnaHRcclxuXHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gdGhpcy5pbWdEYXRhLndpZHRoICogeFxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSB0aGlzLmltZ0RhdGEuaGVpZ2h0ICogeFxyXG5cclxuICAgICAgICBpZiAodGhpcy5wcmV2ZW50V2hpdGVTcGFjZSkge1xyXG4gICAgICAgICAgaWYgKHRoaXMuaW1nRGF0YS53aWR0aCA8IHRoaXMucmVhbFdpZHRoKSB7XHJcbiAgICAgICAgICAgIGxldCBfeCA9IHRoaXMucmVhbFdpZHRoIC8gdGhpcy5pbWdEYXRhLndpZHRoXHJcbiAgICAgICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IHRoaXMucmVhbFdpZHRoXHJcbiAgICAgICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSB0aGlzLmltZ0RhdGEuaGVpZ2h0ICogX3hcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAodGhpcy5pbWdEYXRhLmhlaWdodCA8IHRoaXMucmVhbEhlaWdodCkge1xyXG4gICAgICAgICAgICBsZXQgX3ggPSB0aGlzLnJlYWxIZWlnaHQgLyB0aGlzLmltZ0RhdGEuaGVpZ2h0XHJcbiAgICAgICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSB0aGlzLnJlYWxIZWlnaHRcclxuICAgICAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gdGhpcy5pbWdEYXRhLndpZHRoICogX3hcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG9sZFdpZHRoLnRvRml4ZWQoMikgIT09IHRoaXMuaW1nRGF0YS53aWR0aC50b0ZpeGVkKDIpIHx8IG9sZEhlaWdodC50b0ZpeGVkKDIpICE9PSB0aGlzLmltZ0RhdGEuaGVpZ2h0LnRvRml4ZWQoMikpIHtcclxuICAgICAgICAgIGxldCBvZmZzZXRYID0gKHggLSAxKSAqIChwb3MueCAtIHRoaXMuaW1nRGF0YS5zdGFydFgpXHJcbiAgICAgICAgICBsZXQgb2Zmc2V0WSA9ICh4IC0gMSkgKiAocG9zLnkgLSB0aGlzLmltZ0RhdGEuc3RhcnRZKVxyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IHRoaXMuaW1nRGF0YS5zdGFydFggLSBvZmZzZXRYXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gdGhpcy5pbWdEYXRhLnN0YXJ0WSAtIG9mZnNldFlcclxuXHJcbiAgICAgICAgICBpZiAodGhpcy5wcmV2ZW50V2hpdGVTcGFjZSkge1xyXG4gICAgICAgICAgICB0aGlzLnByZXZlbnRNb3ZpbmdUb1doaXRlU3BhY2UoKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhpcy4kZW1pdChldmVudHMuWk9PTV9FVkVOVClcclxuICAgICAgICAgIHRoaXMuZHJhdygpXHJcbiAgICAgICAgICB0aGlzLnNjYWxlUmF0aW8gPSB0aGlzLmltZ0RhdGEud2lkdGggLyB0aGlzLm5hdHVyYWxXaWR0aFxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIHJvdGF0ZSAob3JpZW50YXRpb24gPSA2LCB1c2VPcmlnaW5hbCkge1xyXG4gICAgICAgIGlmICghdGhpcy5pbWcpIHJldHVyblxyXG4gICAgICAgIGlmIChvcmllbnRhdGlvbiA+IDEpIHtcclxuICAgICAgICAgIHZhciBfaW1nID0gdS5nZXRSb3RhdGVkSW1hZ2UodXNlT3JpZ2luYWwgPyB0aGlzLm9yaWdpbmFsSW1hZ2UgOiB0aGlzLmltZywgb3JpZW50YXRpb24pXHJcbiAgICAgICAgICBfaW1nLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5pbWcgPSBfaW1nXHJcbiAgICAgICAgICAgIHRoaXMuaW1nQ29udGVudEluaXQoKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLmltZ0NvbnRlbnRJbml0KClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChvcmllbnRhdGlvbiA9PSAyKSB7XHJcbiAgICAgICAgICAvLyBmbGlwIHhcclxuICAgICAgICAgIHRoaXMub3JpZW50YXRpb24gPSB1LmZsaXBYKHRoaXMub3JpZW50YXRpb24pXHJcbiAgICAgICAgfSBlbHNlIGlmIChvcmllbnRhdGlvbiA9PSA0KSB7XHJcbiAgICAgICAgICAvLyBmbGlwIHlcclxuICAgICAgICAgIHRoaXMub3JpZW50YXRpb24gPSB1LmZsaXBZKHRoaXMub3JpZW50YXRpb24pXHJcbiAgICAgICAgfSBlbHNlIGlmIChvcmllbnRhdGlvbiA9PSA2KSB7XHJcbiAgICAgICAgICAvLyA5MCBkZWdcclxuICAgICAgICAgIHRoaXMub3JpZW50YXRpb24gPSB1LnJvdGF0ZTkwKHRoaXMub3JpZW50YXRpb24pXHJcbiAgICAgICAgfSBlbHNlIGlmIChvcmllbnRhdGlvbiA9PSAzKSB7XHJcbiAgICAgICAgICAvLyAxODAgZGVnXHJcbiAgICAgICAgICB0aGlzLm9yaWVudGF0aW9uID0gdS5yb3RhdGU5MCh1LnJvdGF0ZTkwKHRoaXMub3JpZW50YXRpb24pKVxyXG4gICAgICAgIH0gZWxzZSBpZiAob3JpZW50YXRpb24gPT0gOCkge1xyXG4gICAgICAgICAgLy8gMjcwIGRlZ1xyXG4gICAgICAgICAgdGhpcy5vcmllbnRhdGlvbiA9IHUucm90YXRlOTAodS5yb3RhdGU5MCh1LnJvdGF0ZTkwKHRoaXMub3JpZW50YXRpb24pKSlcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5vcmllbnRhdGlvbiA9IG9yaWVudGF0aW9uXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgcGFpbnRCYWNrZ3JvdW5kICgpIHtcclxuICAgICAgICBsZXQgYmFja2dyb3VuZENvbG9yID0gKCF0aGlzLmNhbnZhc0NvbG9yIHx8IHRoaXMuY2FudmFzQ29sb3IgPT0gJ2RlZmF1bHQnKSA/ICd0cmFuc3BhcmVudCcgOiB0aGlzLmNhbnZhc0NvbG9yXHJcbiAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gYmFja2dyb3VuZENvbG9yXHJcbiAgICAgICAgdGhpcy5jdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMucmVhbFdpZHRoLCB0aGlzLnJlYWxIZWlnaHQpXHJcbiAgICAgICAgdGhpcy5jdHguZmlsbFJlY3QoMCwgMCwgdGhpcy5yZWFsV2lkdGgsIHRoaXMucmVhbEhlaWdodClcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGRyYXcgKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5pbWcpIHJldHVyblxyXG4gICAgICAgIGlmICh3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKSB7XHJcbiAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5fZHJhd0ZyYW1lKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLl9kcmF3RnJhbWUoKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9kcmF3RnJhbWUgKCkge1xyXG4gICAgICAgIGxldCBjdHggPSB0aGlzLmN0eFxyXG4gICAgICAgIGxldCB7IHN0YXJ0WCwgc3RhcnRZLCB3aWR0aCwgaGVpZ2h0IH0gPSB0aGlzLmltZ0RhdGFcclxuXHJcbiAgICAgICAgdGhpcy5wYWludEJhY2tncm91bmQoKVxyXG4gICAgICAgIGN0eC5kcmF3SW1hZ2UodGhpcy5pbWcsIHN0YXJ0WCwgc3RhcnRZLCB3aWR0aCwgaGVpZ2h0KVxyXG4gICAgICAgIHRoaXMuJGVtaXQoZXZlbnRzLkRSQVcsIGN0eClcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGdlbmVyYXRlRGF0YVVybCAodHlwZSwgY29tcHJlc3Npb25SYXRlKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmltZykgcmV0dXJuICcnXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FudmFzLnRvRGF0YVVSTCh0eXBlLCBjb21wcmVzc2lvblJhdGUpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBnZW5lcmF0ZUJsb2IgKGNhbGxiYWNrLCBtaW1lVHlwZSwgcXVhbGl0eUFyZ3VtZW50KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmltZykgcmV0dXJuIG51bGxcclxuICAgICAgICB0aGlzLmNhbnZhcy50b0Jsb2IoY2FsbGJhY2ssIG1pbWVUeXBlLCBxdWFsaXR5QXJndW1lbnQpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBwcm9taXNlZEJsb2IgKC4uLmFyZ3MpIHtcclxuICAgICAgICBpZiAodHlwZW9mIFByb21pc2UgPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgIGNvbnNvbGUud2FybignTm8gUHJvbWlzZSBzdXBwb3J0LiBQbGVhc2UgYWRkIFByb21pc2UgcG9seWZpbGwgaWYgeW91IHdhbnQgdG8gdXNlIHRoaXMgbWV0aG9kLicpXHJcbiAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVCbG9iKChibG9iKSA9PiB7XHJcbiAgICAgICAgICAgICAgcmVzb2x2ZShibG9iKVxyXG4gICAgICAgICAgICB9LCBhcmdzKVxyXG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgIHJlamVjdChlcnIpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGdldE1ldGFkYXRhICgpIHtcclxuICAgICAgICBsZXQgeyBzdGFydFgsIHN0YXJ0WSB9ID0gdGhpcy5pbWdEYXRhXHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICBzdGFydFgsXHJcbiAgICAgICAgICBzdGFydFksXHJcbiAgICAgICAgICBzY2FsZTogdGhpcy5zY2FsZVJhdGlvLFxyXG4gICAgICAgICAgb3JpZW50YXRpb246IHRoaXMub3JpZW50YXRpb25cclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBhcHBseU1ldGFkYXRhICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMudXNlck1ldGFkYXRhKSByZXR1cm5cclxuICAgICAgICB2YXIgeyBzdGFydFgsIHN0YXJ0WSwgc2NhbGUgfSA9IHRoaXMudXNlck1ldGFkYXRhXHJcbiAgICAgICAgc3RhcnRYID0gK3N0YXJ0WFxyXG4gICAgICAgIHN0YXJ0WSA9ICtzdGFydFlcclxuICAgICAgICBzY2FsZSA9ICtzY2FsZVxyXG5cclxuICAgICAgICBpZiAoIWlzTmFOKHN0YXJ0WCkpIHtcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSBzdGFydFhcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghaXNOYU4oc3RhcnRZKSkge1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IHN0YXJ0WVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFpc05hTihzY2FsZSkpIHtcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IHRoaXMubmF0dXJhbFdpZHRoICogc2NhbGVcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5oZWlnaHQgPSB0aGlzLm5hdHVyYWxIZWlnaHQgKiBzY2FsZVxyXG4gICAgICAgICAgdGhpcy5zY2FsZVJhdGlvID0gc2NhbGVcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbjwvc2NyaXB0PlxyXG5cclxuPHN0eWxlIGxhbmc9XCJzdHlsdXNcIj5cclxuICAuY3JvcHBhLWNvbnRhaW5lciBcclxuICAgIGRpc3BsYXk6IGlubGluZS1ibG9ja1xyXG4gICAgY3Vyc29yOiBwb2ludGVyXHJcbiAgICB0cmFuc2l0aW9uOiBhbGwgLjNzXHJcbiAgICBwb3NpdGlvbjogcmVsYXRpdmVcclxuICAgIGZvbnQtc2l6ZTogMFxyXG4gICAgYWxpZ24tc2VsZjogZmxleC1zdGFydFxyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2U2ZTZlNlxyXG4gICAgY2FudmFzXHJcbiAgICAgIHRyYW5zaXRpb246IGFsbCAuM3NcclxuICAgICY6aG92ZXJcclxuICAgICAgb3BhY2l0eTogLjdcclxuICAgICYuY3JvcHBhLS1kcm9wem9uZVxyXG4gICAgICBib3gtc2hhZG93OiBpbnNldCAwIDAgMTBweCBsaWdodG5lc3MoYmxhY2ssIDIwJSlcclxuICAgICAgY2FudmFzXHJcbiAgICAgICAgb3BhY2l0eTogLjVcclxuICAgICYuY3JvcHBhLS1kaXNhYmxlZC1jYyBcclxuICAgICAgY3Vyc29yOiBkZWZhdWx0XHJcbiAgICAgICY6aG92ZXJcclxuICAgICAgICBvcGFjaXR5OiAxXHJcbiAgICAmLmNyb3BwYS0taGFzLXRhcmdldFxyXG4gICAgICBjdXJzb3I6IG1vdmVcclxuICAgICAgJjpob3ZlclxyXG4gICAgICAgIG9wYWNpdHk6IDFcclxuICAgICAgJi5jcm9wcGEtLWRpc2FibGVkLW16XHJcbiAgICAgICAgY3Vyc29yOiBkZWZhdWx0XHJcbiAgICAmLmNyb3BwYS0tZGlzYWJsZWRcclxuICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZFxyXG4gICAgICAmOmhvdmVyXHJcbiAgICAgICAgb3BhY2l0eTogMVxyXG4gICAgc3ZnLmljb24tcmVtb3ZlXHJcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZVxyXG4gICAgICBiYWNrZ3JvdW5kOiB3aGl0ZVxyXG4gICAgICBib3JkZXItcmFkaXVzOiA1MCVcclxuICAgICAgZmlsdGVyOiBkcm9wLXNoYWRvdygtMnB4IDJweCAycHggcmdiYSgwLCAwLCAwLCAwLjcpKVxyXG4gICAgICB6LWluZGV4OiAxMFxyXG4gICAgICBjdXJzb3I6IHBvaW50ZXJcclxuICAgICAgYm9yZGVyOiAycHggc29saWQgd2hpdGVcclxuXHJcbjwvc3R5bGU+XHJcbiIsIi8qXG5vYmplY3QtYXNzaWduXG4oYykgU2luZHJlIFNvcmh1c1xuQGxpY2Vuc2UgTUlUXG4qL1xuXG4ndXNlIHN0cmljdCc7XG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xudmFyIGdldE93blByb3BlcnR5U3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHByb3BJc0VudW1lcmFibGUgPSBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG5mdW5jdGlvbiB0b09iamVjdCh2YWwpIHtcblx0aWYgKHZhbCA9PT0gbnVsbCB8fCB2YWwgPT09IHVuZGVmaW5lZCkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdC5hc3NpZ24gY2Fubm90IGJlIGNhbGxlZCB3aXRoIG51bGwgb3IgdW5kZWZpbmVkJyk7XG5cdH1cblxuXHRyZXR1cm4gT2JqZWN0KHZhbCk7XG59XG5cbmZ1bmN0aW9uIHNob3VsZFVzZU5hdGl2ZSgpIHtcblx0dHJ5IHtcblx0XHRpZiAoIU9iamVjdC5hc3NpZ24pIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBEZXRlY3QgYnVnZ3kgcHJvcGVydHkgZW51bWVyYXRpb24gb3JkZXIgaW4gb2xkZXIgVjggdmVyc2lvbnMuXG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD00MTE4XG5cdFx0dmFyIHRlc3QxID0gbmV3IFN0cmluZygnYWJjJyk7ICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ldy13cmFwcGVyc1xuXHRcdHRlc3QxWzVdID0gJ2RlJztcblx0XHRpZiAoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDEpWzBdID09PSAnNScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QyID0ge307XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG5cdFx0XHR0ZXN0MlsnXycgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGkpXSA9IGk7XG5cdFx0fVxuXHRcdHZhciBvcmRlcjIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MikubWFwKGZ1bmN0aW9uIChuKSB7XG5cdFx0XHRyZXR1cm4gdGVzdDJbbl07XG5cdFx0fSk7XG5cdFx0aWYgKG9yZGVyMi5qb2luKCcnKSAhPT0gJzAxMjM0NTY3ODknKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MyA9IHt9O1xuXHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcuc3BsaXQoJycpLmZvckVhY2goZnVuY3Rpb24gKGxldHRlcikge1xuXHRcdFx0dGVzdDNbbGV0dGVyXSA9IGxldHRlcjtcblx0XHR9KTtcblx0XHRpZiAoT2JqZWN0LmtleXMoT2JqZWN0LmFzc2lnbih7fSwgdGVzdDMpKS5qb2luKCcnKSAhPT1cblx0XHRcdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9IGNhdGNoIChlcnIpIHtcblx0XHQvLyBXZSBkb24ndCBleHBlY3QgYW55IG9mIHRoZSBhYm92ZSB0byB0aHJvdywgYnV0IGJldHRlciB0byBiZSBzYWZlLlxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNob3VsZFVzZU5hdGl2ZSgpID8gT2JqZWN0LmFzc2lnbiA6IGZ1bmN0aW9uICh0YXJnZXQsIHNvdXJjZSkge1xuXHR2YXIgZnJvbTtcblx0dmFyIHRvID0gdG9PYmplY3QodGFyZ2V0KTtcblx0dmFyIHN5bWJvbHM7XG5cblx0Zm9yICh2YXIgcyA9IDE7IHMgPCBhcmd1bWVudHMubGVuZ3RoOyBzKyspIHtcblx0XHRmcm9tID0gT2JqZWN0KGFyZ3VtZW50c1tzXSk7XG5cblx0XHRmb3IgKHZhciBrZXkgaW4gZnJvbSkge1xuXHRcdFx0aWYgKGhhc093blByb3BlcnR5LmNhbGwoZnJvbSwga2V5KSkge1xuXHRcdFx0XHR0b1trZXldID0gZnJvbVtrZXldO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChnZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcblx0XHRcdHN5bWJvbHMgPSBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMoZnJvbSk7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHN5bWJvbHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKHByb3BJc0VudW1lcmFibGUuY2FsbChmcm9tLCBzeW1ib2xzW2ldKSkge1xuXHRcdFx0XHRcdHRvW3N5bWJvbHNbaV1dID0gZnJvbVtzeW1ib2xzW2ldXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiB0bztcbn07XG4iLCJpbXBvcnQgY29tcG9uZW50IGZyb20gJy4vY3JvcHBlci52dWUnXHJcbmltcG9ydCBhc3NpZ24gZnJvbSAnb2JqZWN0LWFzc2lnbidcclxuXHJcbmNvbnN0IGRlZmF1bHRPcHRpb25zID0ge1xyXG4gIGNvbXBvbmVudE5hbWU6ICdjcm9wcGEnXHJcbn1cclxuXHJcbmNvbnN0IFZ1ZUNyb3BwYSA9IHtcclxuICBpbnN0YWxsOiBmdW5jdGlvbiAoVnVlLCBvcHRpb25zKSB7XHJcbiAgICBvcHRpb25zID0gYXNzaWduKHt9LCBkZWZhdWx0T3B0aW9ucywgb3B0aW9ucylcclxuICAgIGxldCB2ZXJzaW9uID0gTnVtYmVyKFZ1ZS52ZXJzaW9uLnNwbGl0KCcuJylbMF0pXHJcbiAgICBpZiAodmVyc2lvbiA8IDIpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGB2dWUtY3JvcHBhIHN1cHBvcnRzIHZ1ZSB2ZXJzaW9uIDIuMCBhbmQgYWJvdmUuIFlvdSBhcmUgdXNpbmcgVnVlQCR7dmVyc2lvbn0uIFBsZWFzZSB1cGdyYWRlIHRvIHRoZSBsYXRlc3QgdmVyc2lvbiBvZiBWdWUuYClcclxuICAgIH1cclxuICAgIGxldCBjb21wb25lbnROYW1lID0gb3B0aW9ucy5jb21wb25lbnROYW1lIHx8ICdjcm9wcGEnXHJcblxyXG4gICAgLy8gcmVnaXN0cmF0aW9uXHJcbiAgICBWdWUuY29tcG9uZW50KGNvbXBvbmVudE5hbWUsIGNvbXBvbmVudClcclxuICB9LFxyXG5cclxuICBjb21wb25lbnRcclxufVxyXG5leHBvcnQgZGVmYXVsdCBWdWVDcm9wcGEiXSwibmFtZXMiOlsiZGVmaW5lIiwidGhpcyIsInBvaW50Iiwidm0iLCJjYW52YXMiLCJxdWFsaXR5IiwicmVjdCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImNsaWVudFgiLCJjbGllbnRZIiwibGVmdCIsInRvcCIsImV2dCIsInBvaW50ZXIiLCJ0b3VjaGVzIiwiY2hhbmdlZFRvdWNoZXMiLCJvbmVQb2ludENvb3JkIiwicG9pbnRlcjEiLCJwb2ludGVyMiIsImNvb3JkMSIsImNvb3JkMiIsIk1hdGgiLCJzcXJ0IiwicG93IiwieCIsInkiLCJpbWciLCJjb21wbGV0ZSIsIm5hdHVyYWxXaWR0aCIsImRvY3VtZW50Iiwid2luZG93IiwibGFzdFRpbWUiLCJ2ZW5kb3JzIiwibGVuZ3RoIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiY2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJjYWxsYmFjayIsImN1cnJUaW1lIiwiRGF0ZSIsImdldFRpbWUiLCJ0aW1lVG9DYWxsIiwibWF4IiwiaWQiLCJzZXRUaW1lb3V0IiwiYXJnIiwiaXNBcnJheSIsIk9iamVjdCIsInByb3RvdHlwZSIsInRvU3RyaW5nIiwiY2FsbCIsIkhUTUxDYW52YXNFbGVtZW50IiwiYmluU3RyIiwibGVuIiwiYXJyIiwidG9CbG9iIiwiZGVmaW5lUHJvcGVydHkiLCJ0eXBlIiwiYXRvYiIsInRvRGF0YVVSTCIsInNwbGl0IiwiVWludDhBcnJheSIsImkiLCJjaGFyQ29kZUF0IiwiQmxvYiIsImR0IiwiZGF0YVRyYW5zZmVyIiwib3JpZ2luYWxFdmVudCIsInR5cGVzIiwiYXJyYXlCdWZmZXIiLCJ2aWV3IiwiRGF0YVZpZXciLCJnZXRVaW50MTYiLCJieXRlTGVuZ3RoIiwib2Zmc2V0IiwibWFya2VyIiwiZ2V0VWludDMyIiwibGl0dGxlIiwidGFncyIsImJhc2U2NCIsInJlcGxhY2UiLCJiaW5hcnlTdHJpbmciLCJieXRlcyIsImJ1ZmZlciIsIm9yaWVudGF0aW9uIiwiX2NhbnZhcyIsIkNhbnZhc0V4aWZPcmllbnRhdGlvbiIsImRyYXdJbWFnZSIsIl9pbWciLCJJbWFnZSIsInNyYyIsIm9yaSIsIm1hcCIsIk51bWJlciIsImlzSW50ZWdlciIsInZhbHVlIiwiaXNGaW5pdGUiLCJmbG9vciIsInZhbCIsIlN0cmluZyIsIkJvb2xlYW4iLCJIVE1MSW1hZ2VFbGVtZW50IiwidmFsaWRzIiwiaW5kZXhPZiIsInRlc3QiLCJQQ1RfUEVSX1pPT00iLCJNSU5fTVNfUEVSX0NMSUNLIiwiQ0xJQ0tfTU9WRV9USFJFU0hPTEQiLCJNSU5fV0lEVEgiLCJERUZBVUxUX1BMQUNFSE9MREVSX1RBS0VVUCIsIlBJTkNIX0FDQ0VMRVJBVElPTiIsIkRFQlVHIiwicmVuZGVyIiwicHJvcHMiLCJ3aWR0aCIsImhlaWdodCIsInBsYWNlaG9sZGVyRm9udFNpemUiLCJpbml0IiwickFGUG9seWZpbGwiLCJ0b0Jsb2JQb2x5ZmlsbCIsInN1cHBvcnRzIiwic3VwcG9ydERldGVjdGlvbiIsImJhc2ljIiwid2FybiIsImluc3RhbmNlIiwic2V0U2l6ZSIsImltZ0NvbnRlbnRJbml0IiwiZHJhdyIsIiRyZWZzIiwic3R5bGUiLCJiYWNrZ3JvdW5kQ29sb3IiLCJjYW52YXNDb2xvciIsImN0eCIsImdldENvbnRleHQiLCJvcmlnaW5hbEltYWdlIiwic2V0SW5pdGlhbCIsIiRlbWl0IiwiZXZlbnRzIiwiSU5JVF9FVkVOVCIsImZpbGVJbnB1dCIsImZpbGVzIiwicmVhbFdpZHRoIiwicmVhbEhlaWdodCIsImFtb3VudCIsIm1vdmUiLCJ6b29tIiwic3RlcCIsImRpc2FibGVSb3RhdGlvbiIsImRpc2FibGVkIiwicGFyc2VJbnQiLCJpc05hTiIsInJvdGF0ZUJ5U3RlcCIsInJvdGF0ZSIsIiRuZXh0VGljayIsInJlbW92ZSIsImNob29zZUZpbGUiLCJnZW5lcmF0ZURhdGFVcmwiLCJnZW5lcmF0ZUJsb2IiLCJwcm9taXNlZEJsb2IiLCJnZXRNZXRhZGF0YSIsIm1ldGFkYXRhIiwidXNlck1ldGFkYXRhIiwiZGl2IiwiY3JlYXRlRWxlbWVudCIsIkZpbGUiLCJGaWxlUmVhZGVyIiwiRmlsZUxpc3QiLCJwYWludEJhY2tncm91bmQiLCJ0ZXh0QmFzZWxpbmUiLCJ0ZXh0QWxpZ24iLCJkZWZhdWx0Rm9udFNpemUiLCJwbGFjZWhvbGRlciIsImZvbnRTaXplIiwicmVhbFBsYWNlaG9sZGVyRm9udFNpemUiLCJmb250IiwiZmlsbFN0eWxlIiwicGxhY2Vob2xkZXJDb2xvciIsImZpbGxUZXh0IiwiaGFkSW1hZ2UiLCJpbWdEYXRhIiwiSU1BR0VfUkVNT1ZFX0VWRU5UIiwiJHNsb3RzIiwiaW5pdGlhbCIsInZOb2RlIiwidGFnIiwiZWxtIiwiaW5pdGlhbEltYWdlIiwic2V0QXR0cmlidXRlIiwiYmFiZWxIZWxwZXJzLnR5cGVvZiIsInUiLCJpbWFnZUxvYWRlZCIsIl9vbmxvYWQiLCJkYXRhc2V0Iiwib25sb2FkIiwib25lcnJvciIsImNsaWNrIiwibG9nIiwiZGlzYWJsZUNsaWNrVG9DaG9vc2UiLCJzdXBwb3J0VG91Y2giLCJpbnB1dCIsImZpbGUiLCJvbk5ld0ZpbGVJbiIsIkZJTEVfQ0hPT1NFX0VWRU5UIiwiZmlsZVNpemVJc1ZhbGlkIiwiRklMRV9TSVpFX0VYQ0VFRF9FVkVOVCIsIkVycm9yIiwiZmlsZVNpemVMaW1pdCIsImZpbGVUeXBlSXNWYWxpZCIsIkZJTEVfVFlQRV9NSVNNQVRDSF9FVkVOVCIsIm5hbWUiLCJ0b0xvd2VyQ2FzZSIsInBvcCIsImFjY2VwdCIsImZyIiwiZSIsImZpbGVEYXRhIiwidGFyZ2V0IiwicmVzdWx0IiwiZ2V0RmlsZU9yaWVudGF0aW9uIiwiYmFzZTY0VG9BcnJheUJ1ZmZlciIsIk5FV19JTUFHRSIsInJlYWRBc0RhdGFVUkwiLCJzaXplIiwiYmFzZU1pbWV0eXBlIiwidCIsInRyaW0iLCJjaGFyQXQiLCJzbGljZSIsImZpbGVCYXNlVHlwZSIsIm5hdHVyYWxIZWlnaHQiLCJzdGFydFgiLCJzdGFydFkiLCJwcmV2ZW50V2hpdGVTcGFjZSIsImluaXRpYWxTaXplIiwiYXNwZWN0Rml0IiwibmF0dXJhbFNpemUiLCJhc3BlY3RGaWxsIiwic2NhbGVSYXRpbyIsImluaXRpYWxQb3NpdGlvbiIsImV4ZWMiLCJhcHBseU1ldGFkYXRhIiwicHJldmVudE1vdmluZ1RvV2hpdGVTcGFjZSIsImltZ1dpZHRoIiwiaW1nSGVpZ2h0IiwiaW1nUmF0aW8iLCJjYW52YXNSYXRpbyIsInBvaW50ZXJNb3ZlZCIsInBvaW50ZXJDb29yZCIsImdldFBvaW50ZXJDb29yZHMiLCJwb2ludGVyU3RhcnRDb29yZCIsInRhYlN0YXJ0IiwidmFsdWVPZiIsIndoaWNoIiwiZHJhZ2dpbmciLCJwaW5jaGluZyIsImNvb3JkIiwibGFzdE1vdmluZ0Nvb3JkIiwiZGlzYWJsZVBpbmNoVG9ab29tIiwicGluY2hEaXN0YW5jZSIsImdldFBpbmNoRGlzdGFuY2UiLCJjYW5jZWxFdmVudHMiLCJhZGRFdmVudExpc3RlbmVyIiwiaGFuZGxlUG9pbnRlckVuZCIsInBvaW50ZXJNb3ZlRGlzdGFuY2UiLCJ0YWJFbmQiLCJkaXNhYmxlRHJhZ1RvTW92ZSIsInByZXZlbnREZWZhdWx0IiwiZGlzdGFuY2UiLCJkZWx0YSIsImRpc2FibGVTY3JvbGxUb1pvb20iLCJ3aGVlbERlbHRhIiwiZGVsdGFZIiwiZGV0YWlsIiwicmV2ZXJzZVNjcm9sbFRvWm9vbSIsImRpc2FibGVEcmFnQW5kRHJvcCIsImV2ZW50SGFzRmlsZSIsImZpbGVEcmFnZ2VkT3ZlciIsIml0ZW1zIiwiaXRlbSIsImtpbmQiLCJnZXRBc0ZpbGUiLCJvbGRYIiwib2xkWSIsIk1PVkVfRVZFTlQiLCJ6b29tSW4iLCJwb3MiLCJpbm5lckFjY2VsZXJhdGlvbiIsInJlYWxTcGVlZCIsInpvb21TcGVlZCIsInNwZWVkIiwib2xkV2lkdGgiLCJvbGRIZWlnaHQiLCJfeCIsInRvRml4ZWQiLCJvZmZzZXRYIiwib2Zmc2V0WSIsIlpPT01fRVZFTlQiLCJ1c2VPcmlnaW5hbCIsImdldFJvdGF0ZWRJbWFnZSIsImZsaXBYIiwiZmxpcFkiLCJyb3RhdGU5MCIsImNsZWFyUmVjdCIsImZpbGxSZWN0IiwiX2RyYXdGcmFtZSIsIkRSQVciLCJjb21wcmVzc2lvblJhdGUiLCJtaW1lVHlwZSIsInF1YWxpdHlBcmd1bWVudCIsImFyZ3MiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImJsb2IiLCJlcnIiLCJzY2FsZSIsImRlZmF1bHRPcHRpb25zIiwiVnVlQ3JvcHBhIiwiVnVlIiwib3B0aW9ucyIsImFzc2lnbiIsInZlcnNpb24iLCJjb21wb25lbnROYW1lIiwiY29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsQ0FBQyxVQUFVLElBQUksRUFBRSxPQUFPLEVBQUU7SUFDdEIsSUFBSSxPQUFPQSxTQUFNLEtBQUssVUFBVSxJQUFJQSxTQUFNLENBQUMsR0FBRyxFQUFFO1FBQzVDQSxTQUFNLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQ3ZCLE1BQU0sQUFBaUM7UUFDcEMsY0FBYyxHQUFHLE9BQU8sRUFBRSxDQUFDO0tBQzlCLEFBRUY7Q0FDRixDQUFDQyxjQUFJLEVBQUUsWUFBWTtFQUNsQixZQUFZLENBQUM7O0VBRWIs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
