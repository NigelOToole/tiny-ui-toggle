
import { Toggle, toggleAutoInit } from './tiny-ui-toggle.js';

toggleAutoInit();


// Menu example

const menuElements = document.querySelectorAll('.menu .toggle');

for (const item of menuElements) {
  Toggle({ selector: item, target: 'next', group: '.menu .toggle-panel', wrapper: '.demo--menu', closeAuto: true }); 
};
 






// //  ----- Initialize ----- 

// // Initialize all elements with default options, these can be overridden by reinitializing or with data attributes on the element.
// toggleAutoInit();


// // Initialize all elements manually which allows you to pass in custom options.
// // const toggleElements = document.querySelectorAll('.toggle');
// // for (const item of toggleElements) {
// //   Toggle({ selector: item });
// // };


// // Init with string - default setup for one instance
// // const defaultToggle = Toggle({ selector: '#demo-btn-single' });


// // Initialize an element with different options
// const toggleDropdown = Toggle({ selector: '#demo-btn-dropdown', closeAuto: true, openAuto: true });


// // Manually set state - used by the toggle panel only demo
// document.querySelector('#demo-btn-self').addEventListener('click', function(event) {
//   event.preventDefault();
//   Toggle().toggleElement(document.querySelector('#demo-panel-self'));
// });



// //  ----- Methods -----
// const defaultToggle = Toggle({ selector: '#demo-btn-single' });
setTimeout(() => {
  // Toggle used for the below examples
  

  // Toggles the state of the trigger and the target
  // defaultToggle.toggle();

  // // Equivalent to the above without initializing
  // Toggle().toggle(document.querySelector('#demo-btn-single'));

  // // Sets the state of the trigger and the target
  // defaultToggle.set(true);


  // // Toggles the state of an element, the trigger element is the default
  // defaultToggle.toggleElement(); 
  // defaultToggle.toggleElement(document.querySelector('#demo-panel-single')); 


  // // Sets the state of an element, the trigger element is the default
  // defaultToggle.setElement(true); 
  // defaultToggle.setElement(true, document.querySelector('#demo-panel-single')); 


}, 500);

// setTimeout(() => {
//   console.log(defaultToggle.getInfo()['active']);
// }, 1000);


// //  ----- Event listener -----

// // document.querySelector('#demo-panel-single').addEventListener('toggle', (event) => { 
// //   if (event.detail) console.log(`Action: ${event.detail.action}, Active: ${event.detail.active}`);
// // });

// document.addEventListener('toggleOpening', (event) => { 
//   console.log(`toggleOpening`);
// });