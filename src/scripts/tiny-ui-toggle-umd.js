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
      animateHeight: true,
      textActive: '',
      textInactive: '',
      closeAuto: false,
      closeDelay: 500
    };
    options = _objectSpread(_objectSpread({}, defaults), options);
    var element;
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
    }; // Methods


    var toggleText = function toggleText(element) {
      if (!element.toggle.textActive || !element.toggle.textInactive) return;
      var toggleTextElement = element.querySelector('.toggle-text') !== null ? element.querySelector('.toggle-text') : element;
      toggleTextElement.innerHTML = element.toggle.active ? element.toggle.textActive : element.toggle.textInactive;
    };

    var closeAfterTimeout = function closeAfterTimeout(trigger, target) {
      closeTimeout = setTimeout(function () {
        setState(trigger, false);
        setState(target, false);
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
        element.style.height = "".concat(element.scrollHeight, "px"); // Opening

        if (element.toggle.active) {} // Closing
        else {
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
    }; // Toggle the elements state


    var toggleState = function toggleState(element) {
      if (element.toggle === undefined) assignProps(element);
      setState(element, !element.toggle.active);
    }; // Sets the state of an element


    var setState = function setState(element, state) {
      if (element.toggle === undefined) assignProps(element);
      if (element.toggle.active === state) return;
      fireEvent(element, 'toggle', {
        action: 'start',
        active: state
      });
      element.toggle.active = state;
      element.toggle.active ? element.classList.add(element.toggle.activeClass) : element.classList.remove(element.toggle.activeClass);
      element.classList.add(element.toggle.animClass);
      var transitionDuration;

      if (element.toggle.type === 'trigger') {
        transitionDuration = element.toggle.target[0] !== undefined ? getTransitionDuration(element.toggle.target[0]) : 0;
      } else {
        transitionDuration = getTransitionDuration(element);
        if (element.toggle.animateHeight) animateElementHeight(element, transitionDuration);
      }

      console.log(transitionDuration);
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
      toggleState(element);

      var _iterator = _createForOfIteratorHelper(element.toggle.target),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _item = _step.value;
          toggleState(_item);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      ;

      if (element.toggle.group) {
        var _iterator2 = _createForOfIteratorHelper(element.toggle.group),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var item = _step2.value;

            if (item !== element && item !== element.toggle.target[0]) {
              setState(item, false);
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }
    };

    var clickTrigger = function clickTrigger(event) {
      event.preventDefault();
      toggleStateBoth();
    };

    var mouseoverCloseAuto = function mouseoverCloseAuto(event) {
      clearTimeout(closeTimeout);
    };

    var addEventListeners = function addEventListeners() {
      element.toggle.events = {
        clickTrigger: clickTrigger
      };
      element.addEventListener('click', element.toggle.events.clickTrigger);

      if (element.toggle.closeAuto) {
        element.toggle.events = _objectSpread(_objectSpread({}, element.toggle.events), {
          mouseoverCloseAuto: mouseoverCloseAuto,
          mouseleaveCloseAuto: function mouseleaveCloseAuto() {
            return closeAfterTimeout(element, element.toggle.target[0]);
          }
        });
        element.addEventListener('mouseover', element.toggle.events.mouseoverCloseAuto);
        element.addEventListener('mouseleave', element.toggle.events.mouseleaveCloseAuto);
        element.toggle.target.forEach(function (item) {
          item.toggle.events = {
            mouseoverCloseAuto: mouseoverCloseAuto,
            mouseleaveCloseAuto: function mouseleaveCloseAuto() {
              return closeAfterTimeout(element, item);
            }
          };
          item.addEventListener('mouseover', item.toggle.events.mouseoverCloseAuto);
          item.addEventListener('mouseleave', item.toggle.events.mouseleaveCloseAuto);
        });
      }
    };

    var removeEventListeners = function removeEventListeners() {
      element.removeEventListener('click', element.toggle.events.clickTrigger);

      if (element.toggle.closeAuto) {
        element.removeEventListener('mouseover', element.toggle.events.mouseoverCloseAuto);
        element.removeEventListener('mouseleave', element.toggle.events.mouseleaveCloseAuto);
        element.toggle.target.forEach(function (item) {
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

      var datasetObject = _objectSpread({}, element.dataset); // let datasetObject = Object.fromEntries(Object.entries(element.dataset).filter(([key, value]) => key.startsWith('toggle')));


      for (var item in datasetObject) {
        if (item.startsWith('toggle')) {
          var datasetProp = item.substr(6);
          datasetProp = datasetProp.charAt(0).toLowerCase() + datasetProp.slice(1);
          element.toggle["".concat(datasetProp)] = datasetObject[item];
        }
      }

      ;
      element.toggle.type = 'toggleTarget' in element.dataset ? 'trigger' : 'target';
      element.toggle.active = element.classList.contains(element.toggle.activeClass);

      if (element.toggle.type === 'trigger') {
        element.toggle.target = getTarget(element, element.dataset['toggleTarget']); //if ('toggleGroup' in element.dataset) element.toggle.group = document.querySelectorAll(`${element.dataset['toggleGroup']}, [data-toggle-group='${element.dataset['toggleGroup']}']`);

        element.toggle.group = document.querySelectorAll("".concat(element.dataset['toggleGroup'], ", [data-toggle-group='").concat(element.dataset['toggleGroup'], "']"));
      }

      if (element.toggle.type === 'target') {
        element.toggle.isDetails = element.tagName === 'DETAILS' && element.querySelector('summary') !== null;
      }

      element.toggle.events = {}; // console.log(element.toggle)
    };

    var setup = function setup() {
      assignProps(element);

      if (element.toggle.type === 'trigger') {
        var _iterator3 = _createForOfIteratorHelper(element.toggle.target),
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
      element = typeof options.selector === 'string' ? document.querySelector(options.selector) : options.selector;
      if (element === null) return;
      if (element.toggle !== undefined) removeEventListeners();
      setup();
    };

    init(); // Reveal API

    return {
      toggle: toggleStateBoth,
      toggleState: toggleState,
      setState: setState,
      elements: {
        element: element,
        target: element.toggle.target
      }
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