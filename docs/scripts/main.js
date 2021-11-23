import { Toggle, toggleAutoInit } from './tiny-ui-toggle.js';


// Toggle({ selector: '#demo-btn-single' })
// Toggle({ selector: '#demo-btn-single-copy' })



// Initialize all elements with default options, these can be overridden by reinitializing or by data attributes on the element
toggleAutoInit();

// Initialize all elements manually which allows you to pass in custom options
// const toggleElements = document.querySelectorAll('.toggle');
// for (const item of toggleElements) {
//   Toggle({ selector: item });
// };

// Init with string - default setup for one instance
// const defaultToggle = Toggle({ selector: '#demo-btn-single' });


// Initialize an element with different options
const toggleDropdown = Toggle({ selector: '#demo-btn-dropdown', closeAuto: true, openAuto: true });

// Manually set state - used by the toggle panel only demo
document.querySelector('#demo-btn-self').addEventListener('click', function(event) {
  event.preventDefault();
  Toggle().toggleState(document.querySelector('#demo-panel-self'));
});



// Methods

// setTimeout(() => {
  // // Toggle used for the below examples
  // const defaultToggle = Toggle({ selector: '#demo-btn-single' });

  // // Toggles the state of an element, the trigger element is the default
  // defaultToggle.toggleState(); 
  // defaultToggle.toggleState(document.querySelector('#demo-panel-single')); 

  // Equivalent to the above without initializing
  // Toggle().toggleState(document.querySelector('#demo-btn-single'));
  // Toggle().toggleState(document.querySelector('#demo-panel-single'));


  // // Sets the state of an element, the trigger element is the default
  // defaultToggle.setState(true); 
  // defaultToggle.setState(true, document.querySelector('#demo-panel-single')); 

  // Toggle().setState(true, document.querySelector('#demo-btn-single'));
  // Toggle().setState(true, document.querySelector('#demo-panel-single'));


  // // Toggles the state of the trigger and the target
  // defaultToggle.toggle();

  // Toggle().toggle(document.querySelector('#demo-btn-single'));

//   console.log(defaultToggle['element']);
//   console.log(defaultToggle['props']);
// }, 500);



// Event listener

// document.querySelector('#demo-panel-single').addEventListener('toggle', (event) => { 
//   console.log(`Action: ${event.detail.action}, Active: ${event.detail.active}`);
// });

// document.addEventListener('toggle', (event) => { 
//   console.log(`Action: ${event.detail.action}, Active: ${event.detail.active}`);
// });
