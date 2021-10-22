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

  // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details
  // https://gomakethings.com/how-to-build-a-progressively-enhanced-accordion-component-with-vanilla-js/
  var Toggle = function Toggle() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$selector = _ref.selector,
        selector = _ref$selector === void 0 ? '.toggle' : _ref$selector,
        _ref$activeClass = _ref.activeClass,
        activeClass = _ref$activeClass === void 0 ? 'is-active' : _ref$activeClass,
        _ref$animClass = _ref.animClass,
        animClass = _ref$animClass === void 0 ? 'is-anim' : _ref$animClass,
        _ref$toggleHeight = _ref.toggleHeight,
        toggleHeight = _ref$toggleHeight === void 0 ? true : _ref$toggleHeight,
        _ref$textActive = _ref.textActive,
        textActive = _ref$textActive === void 0 ? '' : _ref$textActive,
        _ref$textInactive = _ref.textInactive,
        textInactive = _ref$textInactive === void 0 ? '' : _ref$textInactive,
        _ref$closeAuto = _ref.closeAuto,
        closeAuto = _ref$closeAuto === void 0 ? false : _ref$closeAuto,
        _ref$closeDelay = _ref.closeDelay,
        closeDelay = _ref$closeDelay === void 0 ? 200 : _ref$closeDelay;

    var element;
    var closeTimeout; // let toggleType;
    // let toggleTarget;
    // let toggleActive;
    // Utilities

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
      transitionDuration = transitionDuration.indexOf('ms') > -1 ? transitionDurationNumber : transitionDurationNumber * 1000;
      return transitionDuration;
    }; // Toggles aria attributes on an element based on its state


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
    }; // Toggles elements text


    var toggleText = function toggleText(element) {
      if (!element.textActive || !element.textInactive) return;
      var toggleTextElement = element.querySelector('.toggle-text') !== null ? element.querySelector('.toggle-text') : element;
      toggleTextElement.innerHTML = element.toggleActive ? element.textActive : element.textInactive;
    };

    var closeAfterTimeout = function closeAfterTimeout() {
      closeTimeout = setTimeout(function () {
        // Refactor addEventListeners function so you can use here
        setState('.toggle-outer .toggle-btn', false);
        setState('.toggle-outer .toggle-panel', false);
      }, closeDelay);
    }; // Methods
    // Toggle element height to allow for CSS transition animation


    var toggleElementHeight = function toggleElementHeight(element) {
      if (!element.toggleActive) element.style.height = 'auto';
      requestAnimationFrame(function () {
        element.style.height = "".concat(element.scrollHeight, "px");

        if (!element.toggleActive) {
          element.getBoundingClientRect();
          element.style.height = '';
        }
      });
      element.addEventListener('transitionend', function () {
        if (element.toggleActive) element.style.height = 'auto';
      }, {
        once: true
      });
    }; // Toggle the elements state


    var toggleState = function toggleState(element) {
      setState(element, !element.toggleActive);
    }; // Sets the state of an element


    var setState = function setState(element, state) {
      if (element.toggleActive === state) return;
      fireEvent(element, 'toggle', {
        action: 'start',
        active: state
      });
      element.toggleActive = state;
      element.toggleActive ? element.classList.add(activeClass) : element.classList.remove(activeClass);
      element.classList.add(animClass);
      var transitionDuration;

      if (element.toggleType === 'target') {
        transitionDuration = getTransitionDuration(element);
        if (toggleHeight) toggleElementHeight(element);
      } else {
        transitionDuration = element.toggleTarget[0] !== undefined ? getTransitionDuration(element.toggleTarget[0]) : 0;
      }

      toggleAria(element, element.toggleActive);
      toggleText(element);
      setTimeout(function () {
        fireEvent(element, 'toggle', {
          action: 'end',
          active: state
        });
        element.classList.remove(animClass);
      }, transitionDuration);
    };

    var addEventListeners = function addEventListeners(element) {
      element.addEventListener('click', function (event) {
        event.preventDefault();
        toggleState(element);
        element.toggleTarget.forEach(function (item) {
          // console.log(item);
          toggleState(item);
        }); // NIGEL TO DO - Only do group stuff if at least one item is active

        if (element.toggleGroup.length) {
          element.toggleGroup.forEach(function (item) {
            if (item !== element && item !== element.toggleTarget[0]) {
              // console.log(element.toggleTarget[0] !== item, item);
              setState(item, !element.toggleActive);
            }
          });
        }
      });
      element.addEventListener('mouseover', function (e) {
        clearTimeout(closeTimeout);
      });
      element.toggleTarget.forEach(function (item) {
        item.addEventListener('mouseover', function (e) {
          clearTimeout(closeTimeout);
        });
      });
      element.addEventListener('mouseleave', function (e) {
        closeAfterTimeout();
      });
      element.toggleTarget.forEach(function (item) {
        item.addEventListener('mouseleave', function (e) {
          closeAfterTimeout();
        });
      });
    }; // Finds all the toggle triggers and targets then sets their state


    var setup = function setup() {
      element.toggleTarget = element.dataset['toggleTarget'] !== 'next' ? document.querySelectorAll(element.dataset['toggleTarget']) : [element.nextElementSibling];
      element.toggleGroup = document.querySelectorAll("".concat(element.dataset['toggleGroup'], ", [data-toggle-group='").concat(element.dataset['toggleGroup'], "']"));
      element.toggleType = element.toggleTarget.length ? 'trigger' : 'target';
      element.toggleActive = element.classList.contains(activeClass) ? true : false;
      element.textActive = element.dataset['toggleTextActive'] ? element.dataset['toggleTextActive'] : textActive;
      element.textInactive = element.dataset['toggleTextInactive'] ? element.dataset['toggleTextInactive'] : textInactive;
      if (element.toggleType === 'trigger') addEventListeners(element);
      console.log(element.toggleType, element.toggleActive, element.toggleTarget);
    };

    var init = function init() {
      element = typeof selector === 'string' ? document.querySelector(selector) : selector;
      if (element === null) return;
      setup();
    };

    init(); // Reveal API

    return {
      setState: setState,
      toggleState: toggleState
    };
  };

  _exports.Toggle = Toggle;

  var toggleAutoInit = function toggleAutoInit() {
    var toggleElements = document.querySelectorAll('.toggle');

    var _iterator = _createForOfIteratorHelper(toggleElements),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var item = _step.value;
        Toggle({
          selector: item
        });
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    ;
  };

  _exports.toggleAutoInit = toggleAutoInit;
});