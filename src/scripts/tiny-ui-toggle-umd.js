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

  var Toggle = function Toggle() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$selector = _ref.selector,
        selector = _ref$selector === void 0 ? '.toggle' : _ref$selector,
        _ref$activeClass = _ref.activeClass,
        activeClass = _ref$activeClass === void 0 ? 'is-active' : _ref$activeClass,
        _ref$animClass = _ref.animClass,
        animClass = _ref$animClass === void 0 ? 'is-anim' : _ref$animClass;

    var element;
    var toggleType;
    var toggleTarget; // let toggleActive;
    // Utilities

    var fireEvent = function fireEvent(item, eventName, eventDetail) {
      var event = new CustomEvent(eventName, {
        bubbles: true,
        detail: eventDetail
      });
      item.dispatchEvent(event);
    };

    var getHeight = function getHeight(element) {
      element.style.height = 'auto';
      element.style.display = 'block';
      var height = element.scrollHeight; // scrollHeight instead of offsetHeight it works on hidden elements

      console.log(element.clientHeight, element.scrollHeight, element.offsetHeight);
      element.style = '';
      return height;
    };

    var getTransitionDuration = function getTransitionDuration(element) {
      var transitionDuration = getComputedStyle(element)['transitionDuration'];
      var transitionDurationNumber = parseFloat(transitionDuration);
      transitionDuration = transitionDuration.indexOf('ms') > -1 ? transitionDurationNumber : transitionDurationNumber * 1000;
      return transitionDuration;
    }; // Methods
    // Toggle element height to allow for CSS transition animation


    var toggleElementHeight = function toggleElementHeight(element) {
      var elementHeight = getHeight(element) + 'px'; // let transitionDuration = getTransitionDuration(element);

      element.classList.add(animClass); // if(toggleHeight) {

      element.style.height = elementHeight; // Opening / closing (Active: true / Active: false)

      if (element.toggleActive) {
        // setTimeout(() => {
        // 	element.style.height = 'auto'
        // }, transitionDuration);
        element.addEventListener('transitionend', function () {
          element.style.height = 'auto';
        }, {
          once: true
        });
      } else {
        element.getBoundingClientRect();
        element.style.height = '';
      } // }
      // setTimeout(() => {
      // 	element.classList.remove(animClass);
      // }, transitionDuration);


      element.addEventListener('transitionend', function () {
        element.classList.remove(animClass);
      }, {
        once: true
      });
    }; // Toggle the elements state


    var toggleState = function toggleState(element) {
      setState(element, !element.toggleActive);
    }; // Sets the state of an element


    var setState = function setState(element, state) {
      if (element.toggleActive === state) return;
      element.toggleActive = state; // let transitionDuration;

      fireEvent(element, 'toggle', {
        action: 'start',
        active: !state
      }); // Find transition duration and toggles height on the toggle target only

      if (element.toggleType === 'target') {
        // 	transitionDuration = getTransitionDuration(element);
        toggleElementHeight(element); // }
        // else {
        // 	transitionDuration = (toggleTarget[0] !== undefined) ? getTransitionDuration(toggleTarget[0]) : 0;
      } // setTimeout(() => {


      element.toggleActive ? element.classList.add(activeClass) : element.classList.remove(activeClass); // }, 50);
      // toggleAria(element, toggleActive);
      // NIGEL TO DO - CHANGE EVENT TO 'TOGGLE' - This keeps it in lin with details element. Also test with details element. 
      // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details
      // https://gomakethings.com/how-to-build-a-progressively-enhanced-accordion-component-with-vanilla-js/

      if (element.toggleTarget[0] !== undefined) {
        element.toggleTarget[0].addEventListener('transitionend', function () {
          console.log('Transition ended');
          fireEvent(element, 'toggle', {
            action: 'end',
            active: state
          });
        }, {
          once: true
        });
      } // setTimeout(() => {
      // fireEvent(element, 'toggle', { action: 'end', active: state });
      // 	// if(toggleType === 'trigger') { toggleText(element); }
      // }, transitionDuration);

    };

    var addEventListeners = function addEventListeners(element) {
      element.addEventListener('click', function (event) {
        event.preventDefault();
        toggleState(element);
        element.toggleTarget.forEach(function (item) {
          console.log(item);
          toggleState(item);
        });
      });
    }; // Finds all the toggle triggers and targets then sets their state


    var setup = function setup() {
      element.toggleTarget = document.querySelectorAll(element.dataset['toggleTarget']);
      element.toggleType = element.toggleTarget.length ? 'trigger' : 'target';
      element.toggleActive = element.classList.contains(activeClass) ? true : false; // textActive = element.dataset['toggleTextActive'] ? element.dataset['toggleTextActive'] : textActive;
      // textInactive = element.dataset['toggleTextInactive'] ? element.dataset['toggleTextInactive'] : textInactive;

      if (element.toggleType === 'trigger') addEventListeners(element);
      console.log(element.toggleType, element.toggleActive, element.toggleTarget);
    };

    var init = function init() {
      element = typeof selector === 'string' ? document.querySelector(selector) : selector;
      if (element === null) return;
      setup();
    };

    init(); // Reveal API

    return {// setState,
      // toggleState
    };
  };

  _exports.Toggle = Toggle;

  var toggleAutoInit = function toggleAutoInit() {// Loops through calling toggle()
  };

  _exports.toggleAutoInit = toggleAutoInit;
});