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
		closeDelay: 500
	}

	options = {...defaults, ...options};

	let elementNode;
	let closeTimeout;



	// Utilities
  const fireEvent = (item, eventName, eventDetail) => {
    const event = new CustomEvent(eventName, {
      bubbles: true,
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
  }



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
			element.style.overflow = 'hidden';
			element.style.height = `${element.scrollHeight}px`;

			// Closing
			if (!element.toggle.active) {
				element.getBoundingClientRect();
				element.style.height = element.toggle.isDetails ? `${element.querySelector('summary').scrollHeight}px` : '';
			}
		});

		setTimeout(() => {
			element.style.overflow = '';

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


	const checkProps = function (element) {
		if (element.toggle === undefined) assignProps(element);
	};


  const closeAfterTimeout = function (trigger, target) {
    closeTimeout = setTimeout(() => {
			setStateBoth(false, trigger, target);
    }, trigger.toggle.closeDelay);
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
		console.log(element, element.toggle.target);

		for (const item of element.toggle.target) {
			toggleState(item);
		};
		
		for (const item of element.toggle.group) {
			if (item.toggle === undefined) assignProps(item);	
			if(item !== element && item !== element.toggle.target[0]) {
				setState(false, item);
			}
		}
	};


	const clickTrigger = function (event) {
		event.preventDefault();
		toggleStateBoth(event.target);
	};


	const mouseoverCloseAuto = function (event) {
		clearTimeout(closeTimeout);
	};


  const addEventListeners = function() {
		elementNode.toggle.events = { clickTrigger };

		elementNode.addEventListener('click', elementNode.toggle.events.clickTrigger);

		if(elementNode.toggle.closeAuto) {
			elementNode.toggle.events = {
				...elementNode.toggle.events,
				...{
					mouseoverCloseAuto,
					mouseleaveCloseAuto: () => closeAfterTimeout(elementNode, elementNode.toggle.target[0])
				}
			};
			
			elementNode.addEventListener('mouseover', elementNode.toggle.events.mouseoverCloseAuto);
			elementNode.addEventListener('mouseleave', elementNode.toggle.events.mouseleaveCloseAuto);

			document.addEventListener('click', function(event) {
				let clickInsideTrigger = elementNode.contains(event.target);
				let clickInsideTarget = elementNode.toggle.target[0].contains(event.target);

				if(!clickInsideTrigger && !clickInsideTarget) setStateBoth(false, elementNode, elementNode.toggle.target[0]);
			});

			elementNode.toggle.target.forEach((item) => {
				item.toggle.events = { 
					mouseoverCloseAuto,
					mouseleaveCloseAuto: () => closeAfterTimeout(elementNode, item)
				};

				item.addEventListener('mouseover', item.toggle.events.mouseoverCloseAuto);
				item.addEventListener('mouseleave', item.toggle.events.mouseleaveCloseAuto);
			});

		}

  };


  const removeEventListeners = function() {
		elementNode.removeEventListener('click', elementNode.toggle.events.clickTrigger);

		if(elementNode.toggle.closeAuto) {
			elementNode.removeEventListener('mouseover', elementNode.toggle.events.mouseoverCloseAuto);
			elementNode.removeEventListener('mouseleave', elementNode.toggle.events.mouseleaveCloseAuto);

			elementNode.toggle.target.forEach((item) => {
				item.removeEventListener('mouseover', item.toggle.events.mouseoverCloseAuto);
				item.removeEventListener('mouseleave', item.toggle.events.mouseleaveCloseAuto);
			});
		}

  };


	const getTarget = function (element, selector) {
		const targets = {
			'next': [element.nextElementSibling],
			'previous': [element.previousElementSibling],
			'self': [],
			'default': document.querySelectorAll(selector)
		};
		return targets[selector] || targets['default'];
	};


	const assignProps = function (element) {
		element.toggle = {...options};

		let datasetOptions = {...element.dataset};

		for (const item in datasetOptions) {
			if (item.startsWith('toggle')) {
				let datasetProp = item.substr(6);
				datasetProp = datasetProp.charAt(0).toLowerCase() + datasetProp.slice(1);
				element.toggle[`${datasetProp}`] = convertBooleanString(datasetOptions[item]);
			} 
		};

		element.toggle.type = 'toggleTarget' in element.dataset ? 'trigger' : 'target'
		element.toggle.active = element.classList.contains(element.toggle.activeClass);

		if(element.toggle.type === 'trigger') {
			element.toggle.target = getTarget(element, element.dataset['toggleTarget']);
			element.toggle.group = document.querySelectorAll(`${element.dataset['toggleGroup']}, [data-toggle-group='${element.dataset['toggleGroup']}']`);
			element.toggle.events = {};
		}

		if(element.toggle.type === 'target') {
			element.toggle.isDetails = (element.tagName === 'DETAILS' && element.querySelector('summary') !== null);
			element.toggle.isDialog = element.tagName === 'DIALOG';
		}
	};


  const setup = function() {
		assignProps(elementNode);

		if (elementNode.toggle.type === 'trigger') {
			for (const item of elementNode.toggle.target) {
				assignProps(item);
			};

			addEventListeners();
		}
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
    element: elementNode,
    props: elementNode.toggle
  };

};


const toggleAutoInit = function () {
	const toggleElements = document.querySelectorAll('.toggle');
	for (const item of toggleElements) {
		Toggle({ selector: item });
	};
};


export { Toggle, toggleAutoInit };
