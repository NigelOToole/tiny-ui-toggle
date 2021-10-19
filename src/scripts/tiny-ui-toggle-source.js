const Toggle = function({
  selector = '.toggle',
	targetSelector = '.toggle-panel',

  animClass = 'is-anim',
  activeClass = 'is-active',

	bodyClass = '',
	toggleHeight = true,
	textActive = '',
	textInactive = ''
	} = {}) {

  // Elements
	let element;
	let toggleType;
	let toggleActive;

	let toggleTarget;
	let toggleTextActive;
	let toggleTextInactive;



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



	// // Toggles aria attributes on an element based on its state
	// const toggleAria = function (element) {
	// 	const state = element.toggleActive;
	// 	const ariaAttributes = { 'aria-hidden': !state, 'aria-checked': state, 'aria-expanded': state, 'aria-selected': state, 'aria-pressed': state };

	// 	Object.keys(ariaAttributes).forEach(key => element.hasAttribute(key) && element.setAttribute(key, ariaAttributes[key]));
	// };


	// // Toggle element height to allow for CSS transition animation
	// const toggleElementHeight = function (element) {
	// 	let elementHeight = getHeight(element) + 'px';
	// 	let transitionDuration = getTransitionDuration(element);
		
	// 	element.classList.add(animClass);

	// 	if(toggleHeight) {
	// 		element.style.height = elementHeight;

	// 		// Opening / closing (Active: true / Active: false)
	// 		if (element.toggleActive) {
	// 			setTimeout(() => {
	// 				element.style.height = 'auto'
	// 			}, transitionDuration);
	// 		}
	// 		else {
	// 			element.getBoundingClientRect();
	// 			element.style.height = '';
	// 		}
	// 	}

	// 	setTimeout(() => {
	// 		element.classList.remove(animClass);
	// 	}, transitionDuration);

	// };




	// // Toggles elements text
	// const toggleText = function (element) {
	// 	if (!element.toggleTextActive || !element.toggleTextInactive) return;

	// 	let toggleTextElement = (element.querySelector('.toggle-text') !== null) ? element.querySelector('.toggle-text') : element;

	// 	toggleTextElement.innerHTML = element.toggleActive ? element.toggleTextActive : element.toggleTextInactive;
	// };




	// Toggle the elements state
	const toggleState = function (element) {
		setState(!toggleActive);
	};



	// Sets the state of an element
	const setState = function (state) {
		if(toggleActive === state) return;
		
		let transitionDuration;

    fireEvent(element, 'toggleChange', { action: 'start', active: !state });

		toggleActive = state;

		// Find transition duration and toggles height on the toggle target only
		if(toggleType === 'panel') {
			transitionDuration = getTransitionDuration(element);
			toggleElementHeight(element);
		}
		else {
			transitionDuration = (toggleTarget[0] !== undefined) ? getTransitionDuration(toggleTarget[0]) : 0;
		}

		setTimeout(() => {
			toggleActive ? element.classList.add(activeClass) : element.classList.remove(activeClass);
		}, 50);

		// toggleAria(element, toggleActive);


		// NIGEL TO DO - CHANGE EVENT TO 'TOGGLE' - This keeps it in lin with details element. Also test with details element. 
		// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details
		// https://gomakethings.com/how-to-build-a-progressively-enhanced-accordion-component-with-vanilla-js/

		setTimeout(() => {
      fireEvent(element, 'toggleChange', { action: 'end', active: state });
			// if(toggleType === 'trigger') { toggleText(element); }
		}, transitionDuration);
		
	};	
	
	// Sets the state of an element
	// const setState = function (element, state) {
	// 	if(element.toggleActive === state) return;
		
	// 	let transitionDuration;

  //   fireEvent(element, 'toggleChange', { action: 'start', active: !state });

	// 	element.toggleActive = state;

	// 	// Find transition duration and toggles height on the toggle target only
	// 	if(element.toggleType === 'panel') {
	// 		transitionDuration = getTransitionDuration(element);
	// 		toggleElementHeight(element);
	// 	}
	// 	else {
	// 		transitionDuration = (element.toggleTarget[0] !== undefined) ? getTransitionDuration(element.toggleTarget[0]) : 0;
	// 	}

	// 	setTimeout(() => {
	// 		element.toggleActive ? element.classList.add(activeClass) : element.classList.remove(activeClass);
	// 	}, 50);

	// 	toggleAria(element, element.toggleActive);

	// 	setTimeout(() => {
  //     fireEvent(element, 'toggleChange', { action: 'end', active: state });
	// 		if(element.toggleType === 'trigger') { toggleText(element); }
	// 	}, transitionDuration);
		
	// };


	// // Click event on the toggle trigger
	// const triggerClick = function (event) {
	// 	let toggleTrigger = event.currentTarget;
	// 	let toggleTargetTest = toggleTrigger.toggleTarget[0];
	// 	event.preventDefault();
		
	// 	if (toggleTargetTest === undefined) {
	// 		toggleState(toggleTrigger);
	// 	}
	// 	else {
	// 		if(!toggleTargetTest.classList.contains(animClass)) {
	// 			toggleState(toggleTrigger);

	// 			toggleTrigger.toggleTarget.forEach((item) => {
	// 				toggleState(item);
	// 			});
	// 		}
	// 	}
	// };


  const addDocumentEventListener = function(targetSelector, targetElement) {
    document.addEventListener('click', function(event) {

      let target = (event.target.closest(targetSelector) === targetElement);
      if (!target) return;

      event.preventDefault();
      toggleState();

			// NIGEL TO DO - instead of referenceing the element, add an event listener to each element. The panel will listen for the triggerr to fire and when it does it then toggle

			// toggleTarget.forEach((item) => {
			// 	toggleState(item);
			// });
    });
  };


	// Finds all the toggle triggers and targets then sets their state
  const setup = function() {

		if(element.dataset['toggleTarget']) {
			targetSelector = element.dataset['toggleTarget'];
		}

		if(!element.matches(targetSelector)) {
			toggleType = 'trigger';
			toggleTarget = document.querySelectorAll(element.dataset['toggleTarget']);
			toggleTextActive = element.dataset['toggleTextActive'] ? element.dataset['toggleTextActive'] : textActive;
			toggleTextInactive = element.dataset['toggleTextInactive'] ? element.dataset['toggleTextInactive'] : textInactive;

			addDocumentEventListener('.toggle', element);
		}
		else {
			toggleType = 'panel';
		}

		toggleActive = element.classList.contains(activeClass) ? true : false;

		console.log(toggleType, toggleActive, toggleTarget);

		


		// item.toggleType = 'trigger';
		// item.toggleActive = item.classList.contains(activeClass) ? true : false;
		// item.toggleTarget = item.dataset['toggleTarget'] ? document.querySelectorAll(item.dataset['toggleTarget']) : [item.nextElementSibling]
		// item.toggleTextActive = item.dataset['toggleTextActive'] ? item.dataset['toggleTextActive'] : textActive;
		// item.toggleTextInactive = item.dataset['toggleTextInactive'] ? item.dataset['toggleTextInactive'] : textInactive;

		// item.addEventListener('click', triggerClick);

		// item.toggleTarget.forEach((item) => {
		// 	if(item.toggleType === undefined) {
		// 		item.toggleType = 'panel';
		// 		item.toggleActive = item.classList.contains(activeClass) ? true : false;
		// 	}
		// });

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
