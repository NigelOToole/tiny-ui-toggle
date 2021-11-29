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

const Toggle = function(options) {
	const defaults = {
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
	}

	options = {...defaults, ...options};

	let elementNode;
	let closeTimeout;



	// Utilities
  const fireEvent = (item, eventName, eventDetail) => {
    const event = new CustomEvent(eventName, {
      bubbles: !item.toggle.isInsideTarget,
      detail: eventDetail,
    });

    item.dispatchEvent(event);
  };

	const getTransitionDuration = function (element) {
		let transitionDuration = getComputedStyle(element)['transitionDuration'];
		let transitionDurationNumber = parseFloat(transitionDuration);
		transitionDuration = transitionDuration.includes('ms') ? transitionDurationNumber : transitionDurationNumber*1000;
		return transitionDuration;
	};

	const convertBooleanString = function (string) {
	  if (string.toLowerCase() === 'true') return true;
	  else if (string.toLowerCase() === 'false') return false;
		else return string;
  };



	// Methods
	const toggleAria = function (element, state) {
		const ariaAttributes = { 'aria-hidden': !state, 'aria-checked': state, 'aria-expanded': state, 'aria-selected': state, 'aria-pressed': state };
		Object.keys(ariaAttributes).forEach(key => element.hasAttribute(key) && element.setAttribute(key, ariaAttributes[key]));
	};

	const toggleText = function (element) {
		if (!element.toggle.textActive || !element.toggle.textInactive) return;

		let toggleTextElement = (element.querySelector('.toggle-text') !== null) ? element.querySelector('.toggle-text') : element;

		toggleTextElement.innerHTML = element.toggle.active ? element.toggle.textActive : element.toggle.textInactive;
	};


	const animateElementHeight = function (element, transitionDuration) {
		// Opening
		if (element.toggle.active) {
			element.style.height = `${element.scrollHeight}px`;
			if (element.toggle.isDetails) element.setAttribute('open', '');
		}
		// Closing
		else {
			element.style.height = 'auto';
		}

		requestAnimationFrame(() => {
			element.style.height = `${element.scrollHeight}px`;

			// Closing
			if (!element.toggle.active) {
				element.getBoundingClientRect();
				element.style.height = element.toggle.isDetails ? `${element.querySelector('summary').scrollHeight}px` : '';
			}
		});

		setTimeout(() => {
			// Open
			if (element.toggle.active) {
				element.style.height = 'auto';
			}
			// Closed
			else {
				element.style.height = '';
				if (element.toggle.isDetails) element.removeAttribute('open');
			}
		}, transitionDuration);
	};


	// Sets the state of an element
	const setState = function (state, element = elementNode) {
		checkProps(element);
		if (element.toggle.active === state) return;

    fireEvent(element, 'toggle', { action: 'start', active: state });


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


		let transitionDuration;

		if(element.toggle.type === 'trigger') {
			transitionDuration = (element.toggle.target[0] !== undefined) ? getTransitionDuration(element.toggle.target[0]) : 0;
		}
		else {
			transitionDuration = getTransitionDuration(element);
			if (element.toggle.animateHeight) animateElementHeight(element, transitionDuration);
		}
	

		toggleAria(element, element.toggle.active);

		toggleText(element);


		setTimeout(() => {
      fireEvent(element, 'toggle', { action: 'end', active: state });
			element.classList.remove(element.toggle.animClass);
		}, transitionDuration);
	};

  const setStateBoth = function (state, trigger, target) {
		setState(state, trigger);
		setState(state, target);
  };


	// Toggles the elements state
	const toggleState = function (element = elementNode) {
		checkProps(element);
		setState(!element.toggle.active, element);
	};

	const toggleStateBoth = function (element = elementNode) {
		toggleState(element);

		for (const target of element.toggle.target) {
			toggleState(target);

			for (const trigger of target.toggle.trigger) {
				if(trigger.toggle.active !== target.toggle.active) {
					setState(target.toggle.active, trigger);
				}
			};
		};
		
		for (const item of element.toggle.group) {
			if(item !== element && item !== element.toggle.target[0]) {
				setState(false, item);
			}
		};
	};


	const mouseoverCloseAuto = function () {
		clearTimeout(closeTimeout);
	};

  const closeAfterTimeout = function (trigger, target) {
    closeTimeout = setTimeout(() => {
			setStateBoth(false, trigger, target);
    }, trigger.toggle.closeDelay);
  };

  const addMouseEventListeners = function(element, trigger, target) {
		element.toggle.events = {
			...element.toggle.events,
			...{
				mouseoverCloseAuto,
				mouseleaveCloseAuto: () => closeAfterTimeout(trigger, target)
			}
		};
		
		element.addEventListener('mouseover', element.toggle.events.mouseoverCloseAuto);
		element.addEventListener('mouseleave', element.toggle.events.mouseleaveCloseAuto);
	};

	const clickTrigger = function (event) {
		event.preventDefault();
		toggleStateBoth(elementNode);
	};

  const addEventListeners = function() {
		elementNode.toggle.events = { clickTrigger };
		elementNode.addEventListener('click', elementNode.toggle.events.clickTrigger);

		if (elementNode.toggle.openAuto) {
			elementNode.toggle.events['mouseenterOpenAuto'] = () => setStateBoth(true, elementNode, elementNode.toggle.target[0]);
			elementNode.addEventListener('mouseenter', elementNode.toggle.events.mouseenterOpenAuto);
		}

		if (elementNode.toggle.closeAuto || elementNode.toggle.openAuto) {
			addMouseEventListeners(elementNode, elementNode, elementNode.toggle.target[0]);

			for (const item of elementNode.toggle.target) {
				addMouseEventListeners(item, elementNode, item);
			};

			document.addEventListener('click', function(event) {
				let clickInsideTrigger = elementNode.contains(event.target);
				let clickInsideTarget = elementNode.toggle.target[0].contains(event.target);

				if (!clickInsideTrigger && !clickInsideTarget) setStateBoth(false, elementNode, elementNode.toggle.target[0]);
			});
		}
  };

  const removeEventListeners = function() {
		elementNode.removeEventListener('click', elementNode.toggle.events.clickTrigger);

		if (elementNode.toggle.openAuto) elementNode.removeEventListener('mouseenter', elementNode.toggle.events.mouseenterOpenAuto);

		if (elementNode.toggle.closeAuto || elementNode.toggle.openAuto) {
			elementNode.removeEventListener('mouseover', elementNode.toggle.events.mouseoverCloseAuto);
			elementNode.removeEventListener('mouseleave', elementNode.toggle.events.mouseleaveCloseAuto);

			for (const item of elementNode.toggle.target) {
				item.removeEventListener('mouseover', item.toggle.events.mouseoverCloseAuto);
				item.removeEventListener('mouseleave', item.toggle.events.mouseleaveCloseAuto);
			};
		}
  };


	const getTarget = function (element, selector) {
		const targets = {
			'next': [element.nextElementSibling],
			'self': [],
			'default': document.querySelectorAll(selector)
		};
		return targets[selector] || targets['default'];
	};

	const checkProps = function (element) {
		if (element.toggle === undefined) assignProps(element);
	};

	const assignProps = function (element, elementTrigger = null) {
		element.toggle = (element.toggle === undefined) ? {...options} : Object.assign(element.toggle, options);

		let datasetOptions = {...element.dataset};

		for (const item in datasetOptions) {
			if (item.startsWith('toggle')) {
				let datasetProp = item.substr(6);
				datasetProp = datasetProp.charAt(0).toLowerCase() + datasetProp.slice(1);
				element.toggle[`${datasetProp}`] = convertBooleanString(datasetOptions[item]);
			} 
		};

		element.toggle.type = ('toggleTarget' in element.dataset) ? 'trigger' : 'target'
		element.toggle.active = element.classList.contains(element.toggle.activeClass);

		if (element.toggle.type === 'trigger') {
			element.toggle.target = getTarget(element, element.dataset['toggleTarget']);
			element.toggle.group = document.querySelectorAll(`${element.dataset['toggleGroup']}, [data-toggle-group='${element.dataset['toggleGroup']}']`);
			element.toggle.events = {};
			element.toggle.isInsideTarget = (element.toggle.target.length === 1) ? element.toggle.target[0].contains(element) : false;
		}

		if (element.toggle.type === 'target') {
			element.toggle.trigger === undefined ? element.toggle.trigger = [elementTrigger] : element.toggle.trigger.push(elementTrigger);
			element.toggle.isDetails = (element.tagName === 'DETAILS' && element.querySelector('summary') !== null);
			element.toggle.isDialog = element.tagName === 'DIALOG';
		}
	};


  const setup = function() {
		assignProps(elementNode);

		for (const item of elementNode.toggle.target) {
			assignProps(item, elementNode);
		};

		addEventListeners();
  };

  const init = function() {   
    elementNode = (typeof options.selector === 'string') ? document.querySelector(options.selector) : options.selector;
    if (elementNode === null) return;

		if (elementNode.toggle !== undefined) removeEventListeners();
    setup();
  };

	init();


  // API
  return {
		toggle: toggleStateBoth,
		toggleState,
		setState,
    element: { element: elementNode, ...elementNode.toggle }
  };

};


const toggleAutoInit = function () {
	const toggleElements = document.querySelectorAll('.toggle');
	for (const item of toggleElements) {
		Toggle({ selector: item });
	};
};


export { Toggle, toggleAutoInit };
