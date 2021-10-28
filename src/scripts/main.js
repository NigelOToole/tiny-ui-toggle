import { Toggle, toggleAutoInit } from './tiny-ui-toggle.js';

// Initialize all elements with defaults
toggleAutoInit();

const dropdownToggle = Toggle({ selector: '.toggle-outer .toggle-btn', closeAuto: true });
// dropdownToggle.setState(document.querySelector('.toggle-outer .toggle-panel'), true);
// Toggle().setState(document.querySelector('.toggle-outer .toggle-panel'), true);
// Toggle({ selector: '.toggle-outer .toggle-panel', closeAuto: true });


// Manually set state
document.querySelector('.demo-self-button').addEventListener('click', function(event) {
  event.preventDefault();
  Toggle().toggleState(document.querySelector('.demo-self'));
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








