import { Toggle, toggleAutoInit } from './tiny-ui-toggle.js';

// Initialize all elements with defaults
toggleAutoInit();

// Initialize all elements manually which allows you to pass in custom options
// const toggleElements = document.querySelectorAll('.toggle');
// for (const item of toggleElements) {
//   Toggle({ selector: item });
// };



// Initialize an element with different options
const dropdownToggle = Toggle({ selector: '.toggle-dropdown', closeAuto: true });


// Manually set state - used by the toggle panel only demo
document.querySelector('.demo-self-button').addEventListener('click', function(event) {
  event.preventDefault();
  Toggle().toggleState(document.querySelector('.demo-self'));
});


// Methods
setTimeout(() => {
  // Toggle used for the below examples
  const defaultToggle = Toggle({ selector: '.demo-btn-single' });

  // Toggles the state of an element, the trigger element is the default
  // defaultToggle.toggleState(); 
  // defaultToggle.toggleState(document.querySelector('.demo-single')); 

  // Equivalent to the above without initializing
  // Toggle().toggleState(document.querySelector('.demo-btn-single'));
  // Toggle().toggleState(document.querySelector('.demo-single'));


  // Sets the state of an element, the trigger element is the default
  // defaultToggle.setState(true); 
  // defaultToggle.setState(true, document.querySelector('.demo-single')); 


  // Toggles the state of the trigger and the target
  // defaultToggle.toggle();
  Toggle().toggle(document.querySelector('.demo-btn-single'));




  // responsiveVideoPosterDefault.playVideo();
  // console.log(responsiveVideoPosterDefault['elements']);
  // console.log(responsiveVideoPosterDefault['elements']['video']);
}, 500);



// Event listener
document.querySelector('.demo-single').addEventListener('toggle', (event) => { 
  console.log(`Action: ${event.detail.action}, Active: ${event.detail.active}`);
});











// // const toggleElements = document.querySelectorAll('.toggle-btn');

// // for (const item of toggleElements) {
// //   Toggle({ selector: item });
// // };


// // Element with different options
// // Toggle({ selector: '.demo-none', toggleHeight: false });
// const toggleDropdown = Toggle({ selector: '.toggle-dropdown', closeAuto: true });  

// // setTimeout(() => {
// //   toggleDropdown.toggle();
// // }, 2000);





// Toggle({ selector: '[data-toggle-target=\'.demo-text-attributes\']' }); 







// Pass multiple existing elements - string then nodelist
// toggle({ selector: '.toggle' });
// toggle({ toggleTriggerSelector: document.querySelectorAll('.toggle') });

// Pass multiple non existing elements - string then nodelist
// toggle({ selector: '.toggleFALSE' });
// toggle({ selector: document.querySelectorAll('.toggleFALSE') });

// Pass multiple exisiting elements - string then nodelist
// toggle({ selector: '.toggle--demo-single' });
// toggle({ selector: document.querySelector('.toggle--demo-single') });

// Pass multiple non existing elements - string then nodelist
// toggle({ selector: '.toggle--demo-singleFALSE' });
// toggle({ selector: document.querySelector('.toggle--demo-singleFALSE') });










// Init with string
// const responsiveVideoPosterDefault = ResponsiveVideoPoster({ 
//   selector: '#responsive-video-poster--default' 
// });

// // Init with string and options
// const responsiveVideoPosterPicture = ResponsiveVideoPoster({ 
//   selector: '#responsive-video-poster--picture', 
//   hideControls: true 
// });

// // Init with element
// const responsiveVideoPosterIframeElement = document.querySelector('#responsive-video-poster--iframe');
// const responsiveVideoPosterIframe = ResponsiveVideoPoster({ selector: responsiveVideoPosterIframeElement });

// Init with loop - this wont allow access to methods
// const responsiveVideoPosterElements = document.querySelectorAll('.responsive-video-poster');   

// for (const item of responsiveVideoPosterElements) {
//   ResponsiveVideoPoster({ selector: item });
// }  



// Methods
// setTimeout(() => {
  // responsiveVideoPosterDefault.playVideo();
  // console.log(responsiveVideoPosterDefault['elements']);
  // console.log(responsiveVideoPosterDefault['elements']['video']);
// }, 500);



// Event listener - this can be attached to an element or the document
// document.querySelector('#responsive-video-poster--default').addEventListener('playVideo', (event) => { 
//   console.log(`Action: ${event.detail.action}`);
// });

// document.addEventListener('playVideo', (event) => { 
//   console.log(`Target: ${event.target.matches('#responsive-video-poster--default')}`, `Action: ${event.detail.action}`);
// });








