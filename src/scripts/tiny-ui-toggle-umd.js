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
        closeDelay = _ref$closeDelay === void 0 ? 500 : _ref$closeDelay;

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
      if (!element.toggle.textActive || !element.toggle.textInactive) return;
      var toggleTextElement = element.querySelector('.toggle-text') !== null ? element.querySelector('.toggle-text') : element;
      toggleTextElement.innerHTML = element.toggle.toggleActive ? element.toggle.textActive : element.toggle.textInactive;
    };

    var closeAfterTimeout = function closeAfterTimeout(trigger, target) {
      closeTimeout = setTimeout(function () {
        setState(trigger, false);
        setState(target, false);
      }, closeDelay);
    }; // Methods


    var toggleElementHeight = function toggleElementHeight(element) {
      if (!element.toggle.active) element.style.height = 'auto';
      requestAnimationFrame(function () {
        element.style.height = "".concat(element.scrollHeight, "px");

        if (!element.toggle.active) {
          element.getBoundingClientRect();
          element.style.height = '';
        }
      });
      element.addEventListener('transitionend', function () {
        if (element.toggle.active) element.style.height = 'auto';
      }, {
        once: true
      });
    }; // Toggle the elements state


    var toggleState = function toggleState() {
      var elementCurrent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : element;
      setState(elementCurrent, !elementCurrent.toggle.active);
    }; // Sets the state of an element


    var setState = function setState(element, state) {
      if (element.toggle.active === state) return;
      fireEvent(element, 'toggle', {
        action: 'start',
        active: state
      });
      console.log(element.toggle.activeClass);
      element.toggle.active = state;
      element.toggle.active ? element.classList.add(element.toggle.activeClass) : element.classList.remove(element.toggle.activeClass);
      element.classList.add(element.toggle.animClass);
      var transitionDuration;

      if (element.toggle.type === 'trigger') {
        transitionDuration = element.toggle.target[0] !== undefined ? getTransitionDuration(element.toggle.target[0]) : 0;
      } else {
        transitionDuration = getTransitionDuration(element);
        if (element.toggle.toggleHeight) toggleElementHeight(element);
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

    var toggleStateEvent = function toggleStateEvent(event) {
      event.preventDefault();
      toggleStateBoth();
    };

    var addEventListeners = function addEventListeners() {
      element.addEventListener('click', toggleStateEvent);

      if (element.toggle.closeAuto) {
        element.addEventListener('mouseover', function () {
          clearTimeout(closeTimeout);
        });
        element.addEventListener('mouseleave', function () {
          // closeAfterTimeout(element, element.toggleTarget[0]);
          closeAfterTimeout(element, element.toggle.target[0]);
        });
        element.toggle.target.forEach(function (item) {
          item.addEventListener('mouseover', function () {
            clearTimeout(closeTimeout);
          });
          item.addEventListener('mouseleave', function () {
            closeAfterTimeout(element, item);
          });
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
      element.toggle = {
        activeClass: element.dataset['toggleActiveClass'] || activeClass,
        animClass: element.dataset['toggleAnimClass'] || animClass,
        toggleHeight: element.dataset['toggleHeight'] || toggleHeight,
        textActive: element.dataset['toggleTextActive'] || textActive,
        textInactive: element.dataset['toggleTextInactive'] || textInactive,
        closeAuto: element.dataset['toggleCloseAuto'] || closeAuto,
        closeDelay: element.dataset['toggleCloseDelay'] || closeDelay,
        type: 'toggleTarget' in element.dataset ? 'trigger' : 'target'
      };
      element.toggle.active = element.classList.contains(element.toggle.activeClass);

      if (element.toggle.type === 'trigger') {
        element.toggle.target = getTarget(element, element.dataset['toggleTarget']);
        if ('toggleGroup' in element.dataset) element.toggle.group = document.querySelectorAll("".concat(element.dataset['toggleGroup'], ", [data-toggle-group='").concat(element.dataset['toggleGroup'], "']"));
      }
    }; // TO DO - Put props into its own function so targets can get default values
    // Finds all the toggle triggers and targets then sets their state


    var setup = function setup() {
      // Properties of the toggle
      assignProps(element); // element.toggle = {
      // 	activeClass: element.dataset['toggleActiveClass'] || activeClass,
      // 	animClass: element.dataset['toggleAnimClass'] || animClass,
      // 	toggleHeight: element.dataset['toggleHeight'] || toggleHeight,
      // 	textActive: element.dataset['toggleTextActive'] || textActive,
      // 	textInactive: element.dataset['toggleTextInactive'] || textInactive,
      // 	closeAuto: element.dataset['toggleCloseAuto'] || closeAuto,
      // 	closeDelay: element.dataset['toggleCloseDelay'] || closeDelay,
      // 	type: 'toggleTarget' in element.dataset ? 'trigger' : 'target'
      // };
      // element.toggle.active = element.classList.contains(element.toggle.activeClass);

      if (element.toggle.type === 'trigger') {
        // element.toggle.target = getTarget(element, element.dataset['toggleTarget']);
        // if ('toggleGroup' in element.dataset) element.toggle.group = document.querySelectorAll(`${element.dataset['toggleGroup']}, [data-toggle-group='${element.dataset['toggleGroup']}']`);
        addEventListeners();

        var _iterator3 = _createForOfIteratorHelper(element.toggle.target),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var item = _step3.value;

            if (item.toggle === undefined) {
              // item.toggle = {...element.toggle};
              // item.toggle.target = [];
              // item.toggle.group = [];
              // item.toggle.type = 'target';
              // item.toggle.active = item.classList.contains(item.toggle.activeClass);
              assignProps(item);
            }
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }

        ;
      } // element.toggleType = 'toggleTarget' in element.dataset ? 'trigger' : 'target';
      // element.toggleActive = element.classList.contains(element.activeClass);
      // if(element.toggleType === 'trigger') {
      // 	element.toggleTarget = getTarget(element, element.dataset['toggleTarget']);
      // 	if ('toggleGroup' in element.dataset) element.toggleGroup = document.querySelectorAll(`${element.dataset['toggleGroup']}, [data-toggle-group='${element.dataset['toggleGroup']}']`);
      // 	element.textActive = element.dataset['toggleTextActive'] || textActive;
      // 	element.textInactive = element.dataset['toggleTextInactive'] || textInactive;
      // 	addEventListeners();
      // 	for (const item of element.toggleTarget) {
      // 		if (item.toggleType === undefined) {
      // 			// item.toggleType = 'target';
      // 			item.toggleActive = item.classList.contains(element.activeClass);
      // 		}
      // 	};
      // } 
      // console.log(element.toggleType, element.toggleActive, element.toggleTarget);


      console.log(element, element.toggle.activeClass);
    };

    var init = function init() {
      element = typeof selector === 'string' ? document.querySelector(selector) : selector;
      if (element === null) return;
      setup();
    };

    init(); // Reveal API

    return {
      toggle: toggleStateBoth,
      toggleState: toggleState,
      setState: setState,
      elements: {
        element: element,
        target: element['toggleTarget']
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