/**
  Toggle the state of a UI element
	@param {string || element} selector - Trigger element.	
	@param {string || element} target - Target element.	
	@param {string || element} group - Group element.	
	@param {string || element} wrapper - Wrapper element, used to scope CloseAuto to this element rather than just the trigger and target elements.
  @param {string} activeClass - CSS class when element is active.
  @param {string} animClass - CSS class when element is animating.
  @param {string} bodyClass - CSS class added to the body when the element is active.
  @param {boolean} animateHeight - Animate the height of the target element.
	@param {string} textSelector - Element for toggle text.
  @param {string} textActive - Text of element when it is active.
  @param {string} textInactive - Text of element when it is inactive.
  @param {boolean || string} closeAuto - Automatically close the element when the pointer stops hovering the element or there is a click outside the element. It can be scoped to only trigger for when hover ends with 'hover' or on an outside click with 'click'.
  @param {integer(ms)} closeAutoDelay - Delay in auto closing the element when it is not focused.
  @param {boolean} closeOnEscape - Close the target element when the escape key is pressed.
  @param {boolean} openAuto - Automatically opens the element on hover.
  @param {boolean} focusTrap - Trap the focus in the target element when it is active e.g. modal.
*/

const Toggle = function(options) {

	const defaults = {
		selector: '.toggle',
		target: '',
		group: '',
		wrapper: '',
		activeClass: 'is-active',
		animClass: 'is-anim',
		bodyClass: '',
		animateHeight: true,
		textSelector: '.toggle-text',
		textActive: '',
		textInactive: '',
		closeAuto: false, 
		closeAutoDelay: 500,
		closeOnEscape: false,
		openAuto: false,
		focusTrap: false
	}

	let defaultOptions = {...defaults, ...options};

	let element;
	let closeTimeout;



	// Utilities
	const getElement = (selector, scope = 'single', returnArray = false) => {
		let elements;
		if (selector === '') return returnArray ? [] : null;

		if (typeof selector === 'string') {
			elements = (scope === 'single') ? document.querySelector(selector) : document.querySelectorAll(selector);
			elements = returnArray ? [...elements] : elements;
		}
		else {
			elements = selector;
			elements = returnArray ? [elements] : elements;
		}

		return elements;
	} 

	const getEventName = (active, position) => {
		let eventName;
		if (active && position === 'start') eventName = 'Opening';
		if (active && position === 'end') eventName = 'Opened';
		if (!active && position === 'start') eventName = 'Closing';
		if (!active && position === 'end') eventName = 'Closed';
		return `toggle${eventName}`;
  };	
	
	const fireEvent = (element, eventName, eventDetail) => {
    const event = new CustomEvent(eventName, {
      bubbles: true,
      detail: eventDetail,
    });

    element.dispatchEvent(event);
  };

	const getTransitionDuration = function (element) {
		if (element === undefined) return 0;

		let transitionDuration = getComputedStyle(element)['transitionDuration'];
		let animationDuration = getComputedStyle(element)['animationDuration'];
		
		let transitionDurationNumber = parseFloat(transitionDuration);
		let animationDurationNumber = parseFloat(animationDuration);

		let duration = animationDurationNumber > 0 ? animationDuration : transitionDuration;
		let durationNumber = animationDurationNumber > 0 ? animationDurationNumber : transitionDurationNumber;

		duration = duration.includes('ms') ? durationNumber : durationNumber*1000;
		return duration;
	};

	const checkBoolean = function (string) {
	  if (string.toLowerCase() === 'true') return true;
	  if (string.toLowerCase() === 'false') return false;
		return string;
  };



	// Methods
	
	const toggleAria = function (element) {
		const ariaAttributes = { 'aria-hidden': !element.toggle.active, 'aria-checked': element.toggle.active, 'aria-expanded': element.toggle.active, 'aria-selected': element.toggle.active, 'aria-pressed': element.toggle.active, 'tabindex': element.toggle.active ? 0 : -1 };
		Object.keys(ariaAttributes).forEach(key => element.hasAttribute(key) && element.setAttribute(key, ariaAttributes[key]));
	};

	const toggleText = function (element) {
		if (!element.toggle.textActive || !element.toggle.textInactive) return;

		let toggleTextElement = element.querySelector(element.toggle.textSelector);
		toggleTextElement = (toggleTextElement !== null) ? toggleTextElement : element;

		toggleTextElement.innerHTML = element.toggle.active ? element.toggle.textActive : element.toggle.textInactive;
	};

	// Trap focus for a modal dialog - https://codepen.io/vaskort/pen/LYpwjoj
	const setupFocus = (element, trap = true) => {
		const focusableElements = element.toggle.focusableElements;
		if (focusableElements.length === 0) return;
		
		const firstFocusableElement = focusableElements[0];
		const lastFocusableElement = focusableElements[focusableElements.length - 1];
		const initFocus = document.activeElement;	
		let currentFocus = firstFocusableElement;

		firstFocusableElement.focus();

		if (!trap) return;

		const handleFocus = (event) => {	
			event.preventDefault();

			if (focusableElements.includes(event.target)) {
				currentFocus = event.target;
			} 
			else {
				(currentFocus === firstFocusableElement) ? lastFocusableElement.focus() : firstFocusableElement.focus();
				currentFocus = document.activeElement;
			}
		};

		document.addEventListener('focus', handleFocus, true);

		return {
			releaseFocus: () => {
				document.removeEventListener('focus', handleFocus, true);
				initFocus.focus();
			}
		};
	};
	

	const animateElementHeight = function (element) {
		clearTimeout(element.toggle.heightTimeout);

		if (element.toggle.active && element.toggle.isDetails) {
			element.style.height = `${element.scrollHeight}px`;
		}

		if (!element.toggle.active) element.style.height = 'auto';
		
		requestAnimationFrame(() => {
			element.style.height = `${element.scrollHeight}px`;
			element.getBoundingClientRect();
			
			if (!element.toggle.active) {
				element.style.height = element.toggle.isDetails ? `${element.querySelector('summary').scrollHeight}px` : '';
			}

			element.toggle.heightTimeout = setTimeout(() => {
				element.style.height = element.toggle.active ? 'auto' : '';
			}, element.toggle.transitionDuration);	
		});

	};


	// Sets the state of an element
	const setState = async function (state, element) {
		if (element.toggle.active === state) return;
		clearTimeout(element.toggle.transitionTimeout); 
    fireEvent(element, getEventName(state, 'start'));
		element.toggle.active = state;

		element.classList.add(element.toggle.animClass);

		if (element.toggle.active && element.toggle.isDialog) {
			element.style.display = getComputedStyle(element)['display']; 
			element.getBoundingClientRect();
			element.style.display = '';
		}

		element.classList.toggle(element.toggle.activeClass, element.toggle.active);

		element.toggle.transitionDuration = (element.toggle.type === 'trigger') ? getTransitionDuration(element.toggle.target[0]) : getTransitionDuration(element);

		if (element.toggle.type === 'target' && element.toggle.animateHeight) animateElementHeight(element);

		if (element.toggle.active && (element.toggle.isDetails || element.toggle.isDialog)) {
			element.setAttribute('open', '');
		}

		if (element.toggle.bodyClass) {
			document.body.classList.toggle(element.toggle.bodyClass, element.toggle.active);
		}

		if (element.toggle.type === 'trigger') {
			toggleText(element);
		}
		
		toggleAria(element);


		element.toggle.transitionTimeout = setTimeout(() => {
			fireEvent(element, getEventName(state, 'end'));	
			element.classList.remove(element.toggle.animClass);

			if (!element.toggle.active && (element.toggle.isDetails || element.toggle.isDialog)) {
				element.removeAttribute('open');
			}

			if (element.toggle.type === 'target') {
				if (element.toggle.focusTrap || element.toggle.isModal) {
					element.toggle.active ? element.toggle.events['focus'] = setupFocus(element) : element.toggle.events['focus'].releaseFocus();
				}
				else {
					if (element.toggle.active) setupFocus(element, false);
				}
			}
		}, element.toggle.transitionDuration);
	};

  const setStateBoth = function (state, trigger = element, target = undefined) {
		if (target === undefined) target = trigger.toggle.target[0];
		setState(state, trigger);
		setState(state, target);
  };


	// Toggles the elements state
	const toggleState = function (element) {
		setState(!element.toggle.active, element);
	};

	const toggleStateBoth = function () {

		if (element.toggle.group.length > 1) {
			let groupElements = [...element.toggle.group];

			for (const item of element.toggle.group) {
				groupElements.push(...item.toggle.trigger);
			};

			for (const item of groupElements) {
				if (item !== element && item !== element.toggle.target[0]) setState(false, item);
			};
		}
		
		toggleState(element);

		for (const target of element.toggle.target) {
			toggleState(target);

			for (const trigger of target.toggle.trigger) {
				if (trigger.toggle.active !== target.toggle.active) setState(target.toggle.active, trigger);
			};	
		};

	};


	const resetCloseAuto = function () {
		clearTimeout(closeTimeout);
	};

  const startCloseAuto = function (trigger, target) {
    closeTimeout = setTimeout(() => {
			setStateBoth(false, trigger, target);
    }, trigger.toggle.closeAutoDelay);
  };

  const addMouseEventListeners = function(element, trigger, target) {
		element.toggle.events['resetCloseAuto'] = resetCloseAuto;
		element.addEventListener('mouseover', element.toggle.events.resetCloseAuto);

		element.toggle.events['startCloseAuto'] = () => startCloseAuto(trigger, target);
		element.addEventListener('mouseleave', element.toggle.events.startCloseAuto);
	};

	const handleClick = function (event) {
		event.preventDefault();
		toggleStateBoth();
	};

  const addEventListeners = function() {
		element.toggle.events = { handleClick };
		element.addEventListener('click', element.toggle.events.handleClick);

		let targetFirst = element.toggle.target[0];
		if (targetFirst === undefined) return;
		let triggerFirst = targetFirst.toggle.trigger[0];

		if (element.toggle.openAuto) {
			element.toggle.events['startOpenAuto'] = () => setStateBoth(true, element, targetFirst);
			element.addEventListener('mouseenter', element.toggle.events['startOpenAuto']);
		}

		if (element.toggle.closeAuto === true || element.toggle.closeAuto === 'hover') {
			if (element.toggle.wrapper) {
				element.toggle.wrapper.addEventListener('mouseover', resetCloseAuto);
				element.toggle.wrapper.addEventListener('mouseleave', () => startCloseAuto(element, targetFirst));
			}
			else {
				addMouseEventListeners(element, element, targetFirst);

				for (const item of element.toggle.target) {
					addMouseEventListeners(item, element, item);
				};
			}
		}
		
		if (element.toggle.closeAuto === true || element.toggle.closeAuto === 'click' || (element === triggerFirst && targetFirst.toggle.isModal)) {
			element.toggle.events['handleClickOutside'] = (event) => {
				let clickInsideTrigger, clickInsideTarget, clickInsideWrapper, clickOnModalBackdrop = false;
				clickInsideTrigger = element.contains(event.target);
				clickInsideTarget = targetFirst.contains(event.target);
				if (element.toggle.wrapper) clickInsideWrapper = element.toggle.wrapper.contains(event.target);
				if (event.target.toggle) clickOnModalBackdrop = event.target.toggle.isModal; 
				
				if ((!clickInsideTrigger && !clickInsideTarget && !clickInsideWrapper) || clickOnModalBackdrop) setStateBoth(false, element, targetFirst);
			};

			document.addEventListener('click', element.toggle.events.handleClickOutside);
		}

		for (const item of element.toggle.target) {
			if (item.toggle.closeOnEscape || item.toggle.isDialog) {
				item.toggle.events['handleEscape'] = (event) => {
					if (event.keyCode === 27) setStateBoth(false, element, item);
				};

				item.addEventListener('keydown', item.toggle.events['handleEscape']);
			}
		};
	};

  const removeEventListeners = function(element) {
		element.removeEventListener('click', element.toggle.events.handleClick);
		element.removeEventListener('mouseenter', element.toggle.events.startOpenAuto);
		element.removeEventListener('mouseover', element.toggle.events.resetCloseAuto);
		element.removeEventListener('mouseleave', element.toggle.events.startCloseAuto);
		element.removeEventListener('keydown', element.toggle.events.handleEscape);
		document.removeEventListener('click', element.toggle.events.handleClickOutside);
  };

	const getTarget = function () {
		let target = element.toggle.target;
		if (target === '') target = 'self';

		const targetOptions = {
			'next': [element.nextElementSibling],
			'self': []
		};

		return targetOptions[target] || getElement(target, 'all', true);
	};


	const assignProps = function (element, elementTrigger = undefined) {
		// element.toggle = {...element.toggle, ...options};
		// if (elementTrigger !== undefined) element.toggle = {...element.toggle, ...elementTrigger.toggle};

		if (element.toggle === undefined) {
			element.toggle = defaultOptions;
			if (elementTrigger !== undefined) element.toggle = {...element.toggle, ...elementTrigger.toggle};
		} 
		else {
			element.toggle = {...element.toggle, ...options};
		}

		element.toggle.type = !elementTrigger ? 'trigger' : 'target';
		element.toggle.active = element.classList.contains(element.toggle.activeClass);
		element.toggle.events = {};
		element.toggle.wrapper = getElement(element.toggle.wrapper);


		let datasetOptions = {...element.dataset};

		for (const item in datasetOptions) {
			if (!item.startsWith('toggle')) continue;

			let datasetProp = item.substring(6);
			datasetProp = datasetProp.charAt(0).toLowerCase() + datasetProp.substring(1);
			element.toggle[`${datasetProp}`] = checkBoolean(datasetOptions[item]);
		};

		if (element.toggle.type === 'trigger') {
			element.toggle.target = getTarget();
			element.toggle.isInsideTarget = (element.toggle.target.length === 1) ? element.toggle.target[0].contains(element) : false;
			element.toggle.group = getElement(element.toggle.group, 'all', true);
		}

		if (element.toggle.type === 'target') {
			if (element.toggle.trigger === undefined) element.toggle.trigger = [];
			element.toggle.trigger.push(elementTrigger);
			let uniqueTrigger = [...new Set(element.toggle.trigger)];
			element.toggle.trigger = uniqueTrigger;

			element.toggle.isDetails = (element.tagName === 'DETAILS' && element.querySelector('summary') !== null);
			element.toggle.isDialog = (element.tagName === 'DIALOG' || element.getAttribute('role') === 'dialog');
			element.toggle.isModal = element.getAttribute('aria-modal') === 'true';

			if (element.getAttribute('popover') === '' || element.getAttribute('popover') === 'auto') {
				element.toggle.closeOnEscape = true;
				element.toggle.closeAuto = 'click';
			}

			element.toggle.focusableElements = Array.from(element.querySelectorAll(':is(input, button, select, textarea, details, [href], [tabindex]):not([disabled]):not([tabindex="-1"])'));  
		}

		element.toggle.transitionDuration = (element.toggle.type === 'trigger') ? getTransitionDuration(element.toggle.target[0]) : getTransitionDuration(element);
	};


  const setup = function() {
		if (element.toggle !== undefined) removeEventListeners(element);
    assignProps(element);

		for (const item of element.toggle.target) {
			if (item.toggle !== undefined) removeEventListeners(item);
			assignProps(item, element);
		};

		addEventListeners();
  };


  const init = function() {
		element = getElement(defaultOptions.selector);
    if (element !== null) setup();
  };

	init();


  return {
		toggle: toggleStateBoth,
		set: setStateBoth,
		toggleElement: toggleState,
		setElement: setState,
    getInfo: () => { return { element: element, ...element.toggle } }
  };

};


const toggleAutoInit = function () {
	const toggleElements = document.querySelectorAll('.toggle');
	for (const item of toggleElements) {
		Toggle({ selector: item });
	};
};


export { Toggle, toggleAutoInit };
