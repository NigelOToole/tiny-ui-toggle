(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.tinyUiToggle = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.toggleAutoInit = _exports.Toggle = void 0;

  function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var Toggle = function Toggle(options) {
    var defaults = {
      selector: '.toggle',
      activeClass: 'is-active',
      animClass: 'is-anim',
      bodyClass: '',
      animateHeight: true,
      textActive: '',
      textInactive: '',
      closeAuto: false,
      closeDelay: 500
    };
    options = _objectSpread(_objectSpread({}, defaults), options);
    var elementNode;
    var closeTimeout; // Utilities

    var fireEvent = function fireEvent(item, eventName, eventDetail) {
      var event = new CustomEvent(eventName, {
        bubbles: true,
        detail: eventDetail
      });
      item.dispatchEvent(event);
    };

    var getTransitionDuration = function getTransitionDuration(element) {
      var transitionDuration = getComputedStyle(element)['transitionDuration'];
      var transitionDurationNumber = parseFloat(transitionDuration);
      transitionDuration = transitionDuration.includes('ms') ? transitionDurationNumber : transitionDurationNumber * 1000;
      return transitionDuration;
    };

    var convertBooleanString = function convertBooleanString(string) {
      if (string.toLowerCase() === 'true') return true;else if (string.toLowerCase() === 'false') return false;else return string;
    }; // Methods


    var toggleAria = function toggleAria(element, state) {
      var ariaAttributes = {
        'aria-hidden': !state,
        'aria-checked': state,
        'aria-expanded': state,
        'aria-selected': state,
        'aria-pressed': state
      };
      Object.keys(ariaAttributes).forEach(function (key) {
        return element.hasAttribute(key) && element.setAttribute(key, ariaAttributes[key]);
      });
    };

    var toggleText = function toggleText(element) {
      if (!element.toggle.textActive || !element.toggle.textInactive) return;
      var toggleTextElement = element.querySelector('.toggle-text') !== null ? element.querySelector('.toggle-text') : element;
      toggleTextElement.innerHTML = element.toggle.active ? element.toggle.textActive : element.toggle.textInactive;
    };

    var closeAfterTimeout = function closeAfterTimeout(trigger, target) {
      closeTimeout = setTimeout(function () {
        setState(false, trigger);
        setState(false, target);
      }, trigger.toggle.closeDelay);
    };

    var animateElementHeight = function animateElementHeight(element, transitionDuration) {
      // Opening
      if (element.toggle.active) {
        element.style.height = "".concat(element.scrollHeight, "px");
        if (element.toggle.isDetails) element.setAttribute('open', '');
      } // Closing
      else {
          element.style.height = 'auto';
        }

      requestAnimationFrame(function () {
        element.style.overflow = 'hidden';
        element.style.height = "".concat(element.scrollHeight, "px"); // Closing

        if (!element.toggle.active) {
          element.getBoundingClientRect();
          element.style.height = element.toggle.isDetails ? "".concat(element.querySelector('summary').scrollHeight, "px") : '';
        }
      });
      setTimeout(function () {
        element.style.overflow = ''; // Open

        if (element.toggle.active) {
          element.style.height = 'auto';
        } // Closed
        else {
            element.style.height = '';
            if (element.toggle.isDetails) element.removeAttribute('open');
          }
      }, transitionDuration);
    };

    var checkProps = function checkProps(element) {
      if (element.toggle === undefined) assignProps(element);
    }; // Toggles the elements state


    var toggleState = function toggleState() {
      var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : elementNode;
      checkProps(element);
      setState(!element.toggle.active, element);
    }; // Sets the state of an element


    var setState = function setState(state) {
      var element = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : elementNode;
      checkProps(element);
      if (element.toggle.active === state) return;
      fireEvent(element, 'toggle', {
        action: 'start',
        active: state
      });
      element.classList.add(element.toggle.animClass);
      element.getBoundingClientRect();
      element.toggle.active = state;
      element.toggle.active ? element.classList.add(element.toggle.activeClass) : element.classList.remove(element.toggle.activeClass);

      if (element.toggle.bodyClass) {
        element.toggle.active ? document.body.classList.add(element.toggle.bodyClass) : document.body.classList.remove(element.toggle.bodyClass);
      }

      if (element.toggle.isDialog) {
        element.toggle.active ? element.setAttribute('open', '') : element.removeAttribute('open');
      }

      var transitionDuration;

      if (element.toggle.type === 'trigger') {
        transitionDuration = element.toggle.target[0] !== undefined ? getTransitionDuration(element.toggle.target[0]) : 0;
      } else {
        transitionDuration = getTransitionDuration(element);
        if (element.toggle.animateHeight) animateElementHeight(element, transitionDuration);
      }

      toggleAria(element, element.toggle.active);
      toggleText(element);
      setTimeout(function () {
        fireEvent(element, 'toggle', {
          action: 'end',
          active: state
        });
        element.classList.remove(element.toggle.animClass);
      }, transitionDuration);
    };

    var toggleStateBoth = function toggleStateBoth() {
      var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : elementNode;
      toggleState(element);
      console.log(element, element.toggle.target);

      var _iterator = _createForOfIteratorHelper(element.toggle.target),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var item = _step.value;
          toggleState(item);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      ;

      var _iterator2 = _createForOfIteratorHelper(element.toggle.group),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _item = _step2.value;
          if (_item.toggle === undefined) assignProps(_item);

          if (_item !== element && _item !== element.toggle.target[0]) {
            setState(false, _item);
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    };

    var clickTrigger = function clickTrigger(event) {
      event.preventDefault();
      toggleStateBoth(event.target);
    };

    var mouseoverCloseAuto = function mouseoverCloseAuto(event) {
      clearTimeout(closeTimeout);
    };

    var addEventListeners = function addEventListeners() {
      elementNode.toggle.events = {
        clickTrigger: clickTrigger
      };
      elementNode.addEventListener('click', elementNode.toggle.events.clickTrigger);

      if (elementNode.toggle.closeAuto) {
        elementNode.toggle.events = _objectSpread(_objectSpread({}, elementNode.toggle.events), {
          mouseoverCloseAuto: mouseoverCloseAuto,
          mouseleaveCloseAuto: function mouseleaveCloseAuto() {
            return closeAfterTimeout(elementNode, elementNode.toggle.target[0]);
          }
        });
        elementNode.addEventListener('mouseover', elementNode.toggle.events.mouseoverCloseAuto);
        elementNode.addEventListener('mouseleave', elementNode.toggle.events.mouseleaveCloseAuto);
        elementNode.toggle.target.forEach(function (item) {
          item.toggle.events = {
            mouseoverCloseAuto: mouseoverCloseAuto,
            mouseleaveCloseAuto: function mouseleaveCloseAuto() {
              return closeAfterTimeout(elementNode, item);
            }
          };
          item.addEventListener('mouseover', item.toggle.events.mouseoverCloseAuto);
          item.addEventListener('mouseleave', item.toggle.events.mouseleaveCloseAuto);
        });
      }
    };

    var removeEventListeners = function removeEventListeners() {
      elementNode.removeEventListener('click', elementNode.toggle.events.clickTrigger);

      if (elementNode.toggle.closeAuto) {
        elementNode.removeEventListener('mouseover', elementNode.toggle.events.mouseoverCloseAuto);
        elementNode.removeEventListener('mouseleave', elementNode.toggle.events.mouseleaveCloseAuto);
        elementNode.toggle.target.forEach(function (item) {
          item.removeEventListener('mouseover', item.toggle.events.mouseoverCloseAuto);
          item.removeEventListener('mouseleave', item.toggle.events.mouseleaveCloseAuto);
        });
      }
    };

    var getTarget = function getTarget(element, selector) {
      var targets = {
        'next': [element.nextElementSibling],
        'previous': [element.previousElementSibling],
        'self': [],
        'default': document.querySelectorAll(selector)
      };
      return targets[selector] || targets['default'];
    };

    var assignProps = function assignProps(element) {
      element.toggle = _objectSpread({}, options);

      var datasetOptions = _objectSpread({}, element.dataset);

      for (var item in datasetOptions) {
        if (item.startsWith('toggle')) {
          var datasetProp = item.substr(6);
          datasetProp = datasetProp.charAt(0).toLowerCase() + datasetProp.slice(1);
          element.toggle["".concat(datasetProp)] = convertBooleanString(datasetOptions[item]);
        }
      }

      ;
      element.toggle.type = 'toggleTarget' in element.dataset ? 'trigger' : 'target';
      element.toggle.active = element.classList.contains(element.toggle.activeClass);

      if (element.toggle.type === 'trigger') {
        element.toggle.target = getTarget(element, element.dataset['toggleTarget']);
        element.toggle.group = document.querySelectorAll("".concat(element.dataset['toggleGroup'], ", [data-toggle-group='").concat(element.dataset['toggleGroup'], "']"));
        element.toggle.events = {};
      }

      if (element.toggle.type === 'target') {
        element.toggle.isDetails = element.tagName === 'DETAILS' && element.querySelector('summary') !== null;
        element.toggle.isDialog = element.tagName === 'DIALOG';
      }
    };

    var setup = function setup() {
      assignProps(elementNode);

      if (elementNode.toggle.type === 'trigger') {
        var _iterator3 = _createForOfIteratorHelper(elementNode.toggle.target),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var item = _step3.value;
            assignProps(item);
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }

        ;
        addEventListeners();
      }
    };

    var init = function init() {
      elementNode = typeof options.selector === 'string' ? document.querySelector(options.selector) : options.selector;
      if (elementNode === null) return;
      if (elementNode.toggle !== undefined) removeEventListeners();
      setup();
    };

    init(); // API

    return {
      toggle: toggleStateBoth,
      toggleState: toggleState,
      setState: setState,
      element: elementNode,
      props: elementNode.toggle
    };
  };

  _exports.Toggle = Toggle;

  var toggleAutoInit = function toggleAutoInit() {
    var toggleElements = document.querySelectorAll('.toggle');

    var _iterator4 = _createForOfIteratorHelper(toggleElements),
        _step4;

    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var item = _step4.value;
        Toggle({
          selector: item
        });
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }

    ;
  };

  _exports.toggleAutoInit = toggleAutoInit;
});