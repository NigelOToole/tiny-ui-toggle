import { ShareUrl, ShareUrlAuto } from './share-url.js';
import { Toggle, toggleAutoInit } from './tiny-ui-toggle.js';

window.addEventListener('DOMContentLoaded', (event) => {

  // Initialize all elements with default options, these can be overridden by reinitializing or with data attributes on the element.
  toggleAutoInit();


  // Initialize all elements manually which allows you to pass in custom options.
  // const toggleElements = document.querySelectorAll('.toggle');
  // for (const item of toggleElements) {
  //   Toggle({ selector: item });
  // };


  // Initialize a single instance.
  // const toggleDefault = Toggle({ selector: '.toggle' });


  // Menu example shows passing in custom options to the toggle.
  const menuElements = document.querySelectorAll('.menu .toggle');

  for (const item of menuElements) {
    Toggle({ selector: item, target: 'next', group: '.menu .toggle-panel', wrapper: '.demo--menu', closeAuto: true }); 
  };



  // Examples of how to use toggle methods using the first toggle on the page
  // const defaultToggle = Toggle({ selector: '.toggle' });


  // Returns the properties of the toggle
  // console.log(defaultToggle.getInfo());


  // Toggles the state of the trigger and the target
  // defaultToggle.toggle();


  // Equivalent to the above without initializing
  // Toggle().toggle();


  // Sets the state of the trigger and the target
  // defaultToggle.set(true);


  // Toggles the state of an element, the trigger element is the default
  // defaultToggle.toggleElement(); 
  // defaultToggle.toggleElement(document.querySelector('.toggle')); 
  // defaultToggle.toggleElement(document.querySelector('.toggle-panel')); 


  // Sets the state of an element, the trigger element is the default
  // defaultToggle.setElement(true); 
  // defaultToggle.setElement(true, document.querySelector('.toggle')); 
  // defaultToggle.setElement(true, document.querySelector('.toggle-panel')); 


  // Event listeners - toggleOpening, toggleOpened, toggleClosing, toggleClosed
  // document.querySelector('.toggle').addEventListener('toggleOpening', (event) => { 
  //   console.log('Toggle Opening', event.target);
  // });

  // document.addEventListener('toggleOpening', (event) => { 
  //   console.log('Toggle Opening', event.target);
  // });



  // Share links
  ShareUrlAuto();
  
  // Encoded text
  const encodeElements = document.querySelectorAll('.encode');
  for (const item of encodeElements) {
    let decode = atob(item.dataset['encode']);

    if (item.dataset['encodeAttribute']) {
      item.setAttribute(`${item.dataset['encodeAttribute']}`, `${decode}`);
    }
  }
});
