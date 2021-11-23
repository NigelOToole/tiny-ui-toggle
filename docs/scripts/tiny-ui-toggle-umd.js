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

  /**
    Toggle the state of a UI element
  
    @param {string || element} selector - Element selector.
    @param {string} activeClass - CSS class when element is active.
    @param {string} animClass - CSS class when element is animating.
    @param {string} bodyClass - CSS class added to the body when the element is active.
    @param {boolean} animateHeight - Animate the height of the target element.
    @param {string} textActive - Text of element when it is active.
    @param {string} textInactive - Text of element when it is inactive.
    @param {boolean} closeAuto - Automatically close the target element after a timeout or a click outside the element.
    @param {integer(ms)} closeDelay - Delay in auto closing an element when it is not focused.
    @param {boolean} openAuto - Automatically open the target element on hover.
  */
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
      closeDelay: 500,
      openAuto: false
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
        element.style.height = "".concat(element.scrollHeight, "px"); // Closing

        if (!element.toggle.active) {
          element.getBoundingClientRect();
          element.style.height = element.toggle.isDetails ? "".concat(element.querySelector('summary').scrollHeight, "px") : '';
        }
      });
      setTimeout(function () {
        // Open
        if (element.toggle.active) {
          element.style.height = 'auto';
        } // Closed
        else {
            element.style.height = '';
            if (element.toggle.isDetails) element.removeAttribute('open');
          }
      }, transitionDuration);
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

    var setStateBoth = function setStateBoth(state, trigger, target) {
      setState(state, trigger);
      setState(state, target);
    }; // Toggles the elements state


    var toggleState = function toggleState() {
      var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : elementNode;
      checkProps(element);
      setState(!element.toggle.active, element);
    };

    var toggleStateBoth = function toggleStateBoth() {
      var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : elementNode;
      toggleState(element);
      console.log(element, element.toggle);

      var _iterator = _createForOfIteratorHelper(element.toggle.target),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var target = _step.value;
          toggleState(target);

          var _iterator3 = _createForOfIteratorHelper(target.toggle.trigger),
              _step3;

          try {
            for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
              var trigger = _step3.value;

              if (trigger.toggle.active !== target.toggle.active) {
                setState(target.toggle.active, trigger);
              }
            }
          } catch (err) {
            _iterator3.e(err);
          } finally {
            _iterator3.f();
          }

          ;
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
          var item = _step2.value;

          if (item !== element && item !== element.toggle.target[0]) {
            setState(false, item);
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      ;
    };

    var mouseoverCloseAuto = function mouseoverCloseAuto() {
      clearTimeout(closeTimeout);
    };

    var closeAfterTimeout = function closeAfterTimeout(trigger, target) {
      closeTimeout = setTimeout(function () {
        setStateBoth(false, trigger, target);
      }, trigger.toggle.closeDelay);
    };

    var addMouseEventListeners = function addMouseEventListeners(element, trigger, target) {
      element.toggle.events = _objectSpread(_objectSpread({}, element.toggle.events), {
        mouseoverCloseAuto: mouseoverCloseAuto,
        mouseleaveCloseAuto: function mouseleaveCloseAuto() {
          return closeAfterTimeout(trigger, target);
        }
      });
      element.addEventListener('mouseover', element.toggle.events.mouseoverCloseAuto);
      element.addEventListener('mouseleave', element.toggle.events.mouseleaveCloseAuto);
    };

    var clickTrigger = function clickTrigger(event) {
      event.preventDefault();
      toggleStateBoth(elementNode);
    };

    var addEventListeners = function addEventListeners() {
      elementNode.toggle.events = {
        clickTrigger: clickTrigger
      };
      elementNode.addEventListener('click', elementNode.toggle.events.clickTrigger);

      if (elementNode.toggle.openAuto) {
        elementNode.toggle.events['mouseenterOpenAuto'] = function () {
          return setStateBoth(true, elementNode, elementNode.toggle.target[0]);
        };

        elementNode.addEventListener('mouseenter', elementNode.toggle.events.mouseenterOpenAuto);
      }

      if (elementNode.toggle.closeAuto || elementNode.toggle.openAuto) {
        addMouseEventListeners(elementNode, elementNode, elementNode.toggle.target[0]);

        var _iterator4 = _createForOfIteratorHelper(elementNode.toggle.target),
            _step4;

        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var item = _step4.value;
            addMouseEventListeners(item, elementNode, item);
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }

        ;
        document.addEventListener('click', function (event) {
          var clickInsideTrigger = elementNode.contains(event.target);
          var clickInsideTarget = elementNode.toggle.target[0].contains(event.target);
          if (!clickInsideTrigger && !clickInsideTarget) setStateBoth(false, elementNode, elementNode.toggle.target[0]);
        });
      }
    };

    var removeEventListeners = function removeEventListeners() {
      elementNode.removeEventListener('click', elementNode.toggle.events.clickTrigger);
      if (elementNode.toggle.openAuto) elementNode.removeEventListener('mouseenter', elementNode.toggle.events.mouseenterOpenAuto);

      if (elementNode.toggle.closeAuto || elementNode.toggle.openAuto) {
        elementNode.removeEventListener('mouseover', elementNode.toggle.events.mouseoverCloseAuto);
        elementNode.removeEventListener('mouseleave', elementNode.toggle.events.mouseleaveCloseAuto);

        var _iterator5 = _createForOfIteratorHelper(elementNode.toggle.target),
            _step5;

        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var item = _step5.value;
            item.removeEventListener('mouseover', item.toggle.events.mouseoverCloseAuto);
            item.removeEventListener('mouseleave', item.toggle.events.mouseleaveCloseAuto);
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }

        ;
      }
    };

    var getTarget = function getTarget(element, selector) {
      var targets = {
        'next': [element.nextElementSibling],
        'self': [],
        'default': document.querySelectorAll(selector)
      };
      return targets[selector] || targets['default'];
    };

    var checkProps = function checkProps(element) {
      if (element.toggle === undefined) assignProps(element);
    };

    var assignProps = function assignProps(element) {
      var elementTrigger = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      element.toggle = element.toggle === undefined ? _objectSpread({}, options) : Object.assign(element.toggle, options);

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
        element.toggle.trigger === undefined ? element.toggle.trigger = [elementTrigger] : element.toggle.trigger.push(elementTrigger);
        element.toggle.isDetails = element.tagName === 'DETAILS' && element.querySelector('summary') !== null;
        element.toggle.isDialog = element.tagName === 'DIALOG';
      }
    };

    var setup = function setup() {
      assignProps(elementNode);

      var _iterator6 = _createForOfIteratorHelper(elementNode.toggle.target),
          _step6;

      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var item = _step6.value;
          assignProps(item, elementNode);
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }

      ;
      addEventListeners();
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
      element: _objectSpread({
        element: elementNode
      }, elementNode.toggle)
    };
  };

  _exports.Toggle = Toggle;

  var toggleAutoInit = function toggleAutoInit() {
    var toggleElements = document.querySelectorAll('.toggle');

    var _iterator7 = _createForOfIteratorHelper(toggleElements),
        _step7;

    try {
      for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
        var item = _step7.value;
        Toggle({
          selector: item
        });
      }
    } catch (err) {
      _iterator7.e(err);
    } finally {
      _iterator7.f();
    }

    ;
  };

  _exports.toggleAutoInit = toggleAutoInit;
});