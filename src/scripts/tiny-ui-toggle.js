		// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details
		// https://gomakethings.com/how-to-build-a-progressively-enhanced-accordion-component-with-vanilla-js/

const Toggle = function(options) {
	const defaults = {
		selector: '.toggle',
		activeClass: 'is-active',
		animClass: 'is-anim',
		animateHeight: true,
		textActive: '',
		textInactive: '',
		closeAuto: false,
		closeDelay: 500
	}
	options = {...defaults, ...(options || {})};

	let element;
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
		transitionDuration = transitionDuration.indexOf('ms')>-1 ? transitionDurationNumber : transitionDurationNumber*1000;
		return transitionDuration;
	};

	// Toggles aria attributes on an element based on its state
	const toggleAria = function (element, state) {
		const ariaAttributes = { 'aria-hidden': !state, 'aria-checked': state, 'aria-expanded': state, 'aria-selected': state, 'aria-pressed': state };
		Object.keys(ariaAttributes).forEach(key => element.hasAttribute(key) && element.setAttribute(key, ariaAttributes[key]));
	};


	// Toggles elements text
	const toggleText = function (element) {
		if (!element.toggle.textActive || !element.toggle.textInactive) return;

		let toggleTextElement = (element.querySelector('.toggle-text') !== null) ? element.querySelector('.toggle-text') : element;

		toggleTextElement.innerHTML = element.toggle.active ? element.toggle.textActive : element.toggle.textInactive;
	};


  const closeAfterTimeout = function (trigger, target) {
    closeTimeout = setTimeout(() => {
			setState(trigger, false);		
			setState(target, false);
    }, trigger.toggle.closeDelay);
  };




	// Methods
	const animateElementHeight = function (element) {
		if (!element.toggle.active) element.style.height = 'auto';

		requestAnimationFrame(() => {
			element.style.height = `${element.scrollHeight}px`;

			if (!element.toggle.active) {
				element.getBoundingClientRect();
				element.style.height = '';
			}
		});

		element.addEventListener('transitionend', () => {
			if (element.toggle.active) element.style.height = 'auto';
		}, { once: true });
	};


	// Toggle the elements state
	const toggleState = function (element) {
		if (element.toggle === undefined)  assignProps(element);
		setState(element, !element.toggle.active);
	};


	// Sets the state of an element
	const setState = function (element, state) {
		if (element.toggle === undefined) assignProps(element);
		if (element.toggle.active === state) return;

    fireEvent(element, 'toggle', { action: 'start', active: state });


		element.toggle.active = state;
		element.toggle.active ? element.classList.add(element.toggle.activeClass) : element.classList.remove(element.toggle.activeClass);
		element.classList.add(element.toggle.animClass);


		let transitionDuration;

		if(element.toggle.type === 'trigger') {
			transitionDuration = (element.toggle.target[0] !== undefined) ? getTransitionDuration(element.toggle.target[0]) : 0;
		}
		else {
			transitionDuration = getTransitionDuration(element);
			if (element.toggle.animateHeight) animateElementHeight(element);
		}
	

		toggleAria(element, element.toggle.active);

		toggleText(element);


		setTimeout(() => {
      fireEvent(element, 'toggle', { action: 'end', active: state });
			element.classList.remove(element.toggle.animClass);
		}, transitionDuration);
	};	


	const toggleStateBoth = function () {
		toggleState(element);

		for (const item of element.toggle.target) {
			toggleState(item);
		};

		if (element.toggle.group) {
			for (const item of element.toggle.group) {
				if(item !== element && item !== element.toggle.target[0]) {
					setState(item, false);
				}
			}
		}	
	};

	const toggleStateEvent = function (event) {
		event.preventDefault();
		toggleStateBoth()	
	};


  const addEventListeners = function() {
		element.addEventListener('click', toggleStateEvent);

		if(element.toggle.closeAuto) {
			element.addEventListener('mouseover', () => {
				clearTimeout(closeTimeout);
			});

			element.addEventListener('mouseleave', () => {
				closeAfterTimeout(element, element.toggle.target[0]);
			});

			element.toggle.target.forEach((item) => {
				item.addEventListener('mouseover', () => {
					clearTimeout(closeTimeout);
				});

				item.addEventListener('mouseleave', () => {
					closeAfterTimeout(element, item);
				});
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
		// Override defaults with data attributes manually

		// element.toggle = {
		// 	activeClass: element.dataset['toggleActiveClass'] || activeClass,
		// 	animClass: element.dataset['toggleAnimClass'] || animClass,
		// 	animateHeight: element.dataset['animateHeight'] || animateHeight,
		// 	closeAuto: element.dataset['toggleCloseAuto'] || closeAuto,
		// 	closeDelay: element.dataset['toggleCloseDelay'] || closeDelay,
		// 	type: 'toggleTarget' in element.dataset ? 'trigger' : 'target'
		// };

		// element.toggle.active = element.classList.contains(element.toggle.activeClass);




		// console.log(options);
		element.toggle = {...options};

		let datasetObject = {...element.dataset};
		// let datasetObject = Object.fromEntries(Object.entries(element.dataset).filter(([key, value]) => key.startsWith('toggle')));

		for (const item in datasetObject) {			
			if (item.startsWith('toggle')) {
				let datasetProp = item.substr(6);
				datasetProp = datasetProp.charAt(0).toLowerCase() + datasetProp.slice(1);
				element.toggle[`${datasetProp}`] = datasetObject[item];
			} 
		};

		element.toggle.type = 'toggleTarget' in element.dataset ? 'trigger' : 'target'
		element.toggle.active = element.classList.contains(element.toggle.activeClass);

		if(element.toggle.type === 'trigger') {
			element.toggle.target = getTarget(element, element.dataset['toggleTarget']);
			//if ('toggleGroup' in element.dataset) element.toggle.group = document.querySelectorAll(`${element.dataset['toggleGroup']}, [data-toggle-group='${element.dataset['toggleGroup']}']`);
			element.toggle.group = document.querySelectorAll(`${element.dataset['toggleGroup']}, [data-toggle-group='${element.dataset['toggleGroup']}']`);
		}
		
	};


	// Finds all the toggle triggers and targets and sets up their properties
  const setup = function() {
		assignProps(element);

		if (element.toggle.type === 'trigger') {
			addEventListeners();

			for (const item of element.toggle.target) {
				if (item.toggle === undefined) assignProps(item);
			};
		}
  };


  const init = function() {   
    element = (typeof options.selector === 'string') ? document.querySelector(options.selector) : options.selector;
    if (element === null) return;

    setup();
  };

	init();


  // Reveal API
  return {
		toggle: toggleStateBoth,
		toggleState,
		setState,
    elements: {
      element,
      target: element.toggle.target
    }
  };

};


const toggleAutoInit = function () {
	const toggleElements = document.querySelectorAll('.toggle');
	for (const item of toggleElements) {
		Toggle({ selector: item });
	};
};


export { Toggle, toggleAutoInit };
