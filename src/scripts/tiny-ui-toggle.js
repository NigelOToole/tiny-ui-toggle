		// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details
		// https://gomakethings.com/how-to-build-a-progressively-enhanced-accordion-component-with-vanilla-js/




const Toggle = function({
  selector = '.toggle',
	activeClass = 'is-active',
	animClass = 'is-anim',
	toggleHeight = true,
	textActive = '',
	textInactive = ''
	} = {}) {

	let element;
	// let toggleType;
	// let toggleTarget;
	// let toggleActive;



	// Utilities
  const fireEvent = (item, eventName, eventDetail) => {
    const event = new CustomEvent(eventName, {
      bubbles: true,
      detail: eventDetail,
    });

    item.dispatchEvent(event);
  };

	// const getHeight = function (element) {
	// 	element.style.height = 'auto';
	// 	element.style.display = 'block';

	// 	let height = element.scrollHeight; // scrollHeight instead of offsetHeight it works on hidden elements

	// 	console.log(element.clientHeight, element.scrollHeight, element.offsetHeight)
	// 	element.style = '';

	// 	return height;
	// };

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



	// Methods

	// Toggle element height to allow for CSS transition animation
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
	const toggleState = function (element) {
		setState(element, !element.toggleActive);
	};


	// Sets the state of an element
	const setState = function (element, state) {
		if(element.toggleActive === state) return;
    fireEvent(element, 'toggle', { action: 'start', active: state });

		element.toggleActive = state;
		element.toggleActive ? element.classList.add(activeClass) : element.classList.remove(activeClass);
		element.classList.add(animClass);


		let transitionDuration;

		if(element.toggleType === 'target') {
			transitionDuration = getTransitionDuration(element);
			if (toggleHeight) toggleElementHeight(element);
		}
		else {
			transitionDuration = (element.toggleTarget[0] !== undefined) ? getTransitionDuration(element.toggleTarget[0]) : 0;
		}
		

		toggleAria(element, element.toggleActive);

		toggleText(element);


		setTimeout(() => {
			console.log('Event ended');
      fireEvent(element, 'toggle', { action: 'end', active: state });
			element.classList.remove(animClass);
		}, transitionDuration);
		
	};	


  const addEventListeners = function(element) {
    element.addEventListener('click', function(event) {
      event.preventDefault();

      toggleState(element);

			element.toggleTarget.forEach((item) => {
				// console.log(item);
				toggleState(item);
			});

			// NIGEL TO DO - Only do group stuff if at least one item is active
			if(element.toggleGroup.length) {
				element.toggleGroup.forEach((item) => {
					if(item !== element && item !== element.toggleTarget[0]) {
						// console.log(element.toggleTarget[0] !== item, item);
						setState(item, !element.toggleActive);
					}
				});
			}
    }); 
  };


	// Finds all the toggle triggers and targets then sets their state
  const setup = function() {
		element.toggleTarget = element.dataset['toggleTarget'] !== 'next' ? document.querySelectorAll(element.dataset['toggleTarget']) : [element.nextElementSibling];
		element.toggleGroup = document.querySelectorAll(`${element.dataset['toggleGroup']}, [data-toggle-group='${element.dataset['toggleGroup']}']`);
		element.toggleType = element.toggleTarget.length ? 'trigger' : 'target';
		element.toggleActive = element.classList.contains(activeClass) ? true : false;
		element.textActive = element.dataset['toggleTextActive'] ? element.dataset['toggleTextActive'] : textActive;
		element.textInactive = element.dataset['toggleTextInactive'] ? element.dataset['toggleTextInactive'] : textInactive;

		if(element.toggleType === 'trigger') addEventListeners(element);

		console.log(element.toggleType, element.toggleActive, element.toggleTarget);
  };


  const init = function() {   
    element = (typeof selector === 'string') ? document.querySelector(selector) : selector;
    if (element === null) return;

    setup();
  };

	init();


  // Reveal API
  return {
		setState,
		toggleState
  };

};


const toggleAutoInit = function () {
	// Loops through calling toggle()
};


export { Toggle, toggleAutoInit };
