		// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details
		// https://gomakethings.com/how-to-build-a-progressively-enhanced-accordion-component-with-vanilla-js/




const Toggle = function({
  selector = '.toggle',
	activeClass = 'is-active',
	animClass = 'is-anim',
	toggleHeight = true,
	textActive = '',
	textInactive = '',
	closeAuto = false,
  closeDelay = 500
	} = {}) {

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
		if (!element.textActive || !element.textInactive) return;

		let toggleTextElement = (element.querySelector('.toggle-text') !== null) ? element.querySelector('.toggle-text') : element;

		toggleTextElement.innerHTML = element.toggleActive ? element.textActive : element.textInactive;
	};


  const closeAfterTimeout = function (trigger, target) {
    closeTimeout = setTimeout(() => {
			setState(trigger, false);		
			setState(target, false);
    }, closeDelay);
  };



	// Methods
	const toggleElementHeight = function (element) {
		if (!element.toggleActive) element.style.height = 'auto';

		requestAnimationFrame(() => {
			element.style.height = `${element.scrollHeight}px`;

			if (!element.toggleActive) {
				element.getBoundingClientRect();
				element.style.height = '';
			}
		});

		element.addEventListener('transitionend', () => {
			if (element.toggleActive) element.style.height = 'auto';
		}, { once: true });
	};


	// Toggle the elements state
	const toggleState = function (elementCurrent = element) {
		setState(elementCurrent, !elementCurrent.toggleActive);
	};


	// Sets the state of an element
	const setState = function (element, state) {
		if(element.toggleActive === state) return;
    fireEvent(element, 'toggle', { action: 'start', active: state });

		// console.log(element, state)

		element.toggleActive = state;
		element.toggleActive ? element.classList.add(activeClass) : element.classList.remove(activeClass);
		element.classList.add(animClass);


		let transitionDuration;

		if(element.toggleType === 'trigger') {
			transitionDuration = (element.toggleTarget[0] !== undefined) ? getTransitionDuration(element.toggleTarget[0]) : 0;
		}
		else {
			transitionDuration = getTransitionDuration(element);
			if (toggleHeight) toggleElementHeight(element);
		}
	

		toggleAria(element, element.toggleActive);

		toggleText(element);


		setTimeout(() => {
      fireEvent(element, 'toggle', { action: 'end', active: state });
			element.classList.remove(animClass);
		}, transitionDuration);
	};	


	const toggleStateBoth = function () {

		toggleState(element);

		for (const item of element.toggleTarget) {
			toggleState(item);
		};

		if (element.toggleGroup) {
			for (const item of element.toggleGroup) {
				if(item !== element && item !== element.toggleTarget[0]) {
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

		if(closeAuto) {
			element.addEventListener('mouseover', () => {
				clearTimeout(closeTimeout);
			});

			element.addEventListener('mouseleave', () => {
				closeAfterTimeout(element, element.toggleTarget[0]);
			});

			element.toggleTarget.forEach((item) => {
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
	}

	// TO DO - Options should be data attributes first then passed js parameters then default parameters

	// Finds all the toggle triggers and targets then sets their state
  const setup = function() {
		element.toggleType = 'toggleTarget' in element.dataset ? 'trigger' : 'target';
		element.toggleActive = element.classList.contains(activeClass) ? true : false;

		if(element.toggleType === 'trigger') {
			element.toggleTarget = getTarget(element, element.dataset['toggleTarget']);
			if ('toggleGroup' in element.dataset) element.toggleGroup = document.querySelectorAll(`${element.dataset['toggleGroup']}, [data-toggle-group='${element.dataset['toggleGroup']}']`);

			element.textActive = element.dataset['toggleTextActive'] ? element.dataset['toggleTextActive'] : textActive;
			element.textInactive = element.dataset['toggleTextInactive'] ? element.dataset['toggleTextInactive'] : textInactive;

			addEventListeners();

			for (const item of element.toggleTarget) {
				if (item.toggleType === undefined) {
					// item.toggleType = 'target';
					item.toggleActive = item.classList.contains(activeClass) ? true : false;
				}
			};
			
		} 


		// console.log(element.toggleType, element.toggleActive, element.toggleTarget);
  };


  const init = function() {   
    element = (typeof selector === 'string') ? document.querySelector(selector) : selector;
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
      target: element['toggleTarget']
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
