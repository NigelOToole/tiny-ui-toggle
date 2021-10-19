# Tiny UI Toggle
### Toggle the state of a UI element to easily create components like accordions, dropdowns and overlays.

????????????

### [View demo](http://nigelotoole.github.io/tiny-ui-toggle/)

---
## Installation
```javascript
$ npm install tiny-ui-toggle --save-dev
```

---
## Usage

### Import JS

The script is an ES6(ES2015) module but the compiled version is included in the build as "src/scripts/tiny-ui-toggle-umd.js". You can also copy "src/scripts/tiny-ui-toggle.js" into your own site if your build process can accommodate ES6 modules.

```javascript
import ResponsiveVideoPoster from 'tiny-ui-toggle.js';

// Init with string - default setup for one instance
const responsiveVideoPosterDefault = ResponsiveVideoPoster({ selector: '#tiny-ui-toggle--default' });


// Init by loop - this wont allow access to methods
const responsiveVideoPosterElements = document.querySelectorAll('.tiny-ui-toggle');   

for (const item of responsiveVideoPosterElements) {
  ResponsiveVideoPoster({ selector: item });
}


// Init with all options at default setting
const responsiveVideoPosterDefault = ResponsiveVideoPoster({
  selector: '.tiny-ui-toggle',
  overlaySelector: '.video-overlay',
  posterSelector: '.poster',
  videoSelector: '.video',
  animClass: 'is-anim',
  inactiveClass: 'is-inactive',
  embedPreload: 500,
  hideControls: false
});
```

### Options
| Property                | Default                     | Type       | Description                                                                                       |
| ----------------------- | --------------------------- | ---------- | ------------------------------------------------------------------------------------------------- |
| `selector`              | '.tiny-ui-toggle'         | String     | Container element selector.                                                                       |
| `overlaySelector`          | '.video-overlay' | String     | Overlay element selector.                                                                            |
| `posterSelector`          | '.poster' | String     | Poster element selector.                                                                            |
| `videoSelector`          | '.video' | String     | Video element selector.                                                                            |
| `animClass`          | 'is-anim' | String     | CSS class to transition the video overlay between states.                                                                            |
| `inactiveClass`          | 'is-inactive' | String     | CSS class to hide the video overlay.                                                                            |
| `embedPreload`          | 500 | Integer(ms)     | Amount of time given to preload an embedded video.                                                                            |
| `hideControls`          | false | Boolean     | Hide video controls while transitioning overlay. 

### API
| Property                | Type       | Description                                                                                       |
| ----------------------- | ---------- | ------------------------------------------------------------------------------------------------- |
| `instance.playVideo()`  | Method     | Plays the video.                                         |
| `instance['elements']`  | Object     | Returns the elements used by this                        |


### Import SASS

```scss
@import "node_modules/tiny-ui-toggle/src/styles/tiny-ui-toggle.scss";
```


### Markup

```html
<div class="tiny-ui-toggle tiny-ui-toggle--16by9">
                
  <button class="video-overlay" aria-label="Play video">
    <div class="poster-btn"><svg class="poster-btn-icon"> ... </svg></div>

    <img srcset="images/720/image.jpg 720w, images/1080/image.jpg 1080w" src="images/1080/image.jpg" class="poster">
  </button>

  <video src="videos/video.mp4" preload="metadata" class="video" controls></video>

</div>
```


### Bootstrap Example

```html
<div class="tiny-ui-toggle embed-responsive embed-responsive-16by9">
                
  <button class="video-overlay embed-responsive-item" aria-label="Play video">
    <div class="poster-btn"><svg class="poster-btn-icon"> ... </svg></div>

    <img srcset="images/720/image.jpg 720w, images/1080/image.jpg 1080w" src="images/1080/image.jpg" class="poster img-fluid">
  </button>

  <video src="videos/video.mp4" preload="metadata" class="video embed-responsive-item" controls></video>

</div>
```

---
## Video loading optimizations

The [video element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) includes preload="metadata" and the embedded video includes an [srcdoc=""](https://dev.to/haggen/lazy-load-embedded-youtube-videos-520g) so the video is not loaded until the user interacts with it. This will slow the loading of embedded videos which is partially addressed by the built in embedPreload in the options. This will reduce the initial page load but may increase lag in playback for some users. Both can be removed if not needed. The plugin should also work normally with lazy load plugins.

---
## Events

A 'playVideo' event is started once a user clicks the video overlay. The event is ended once the overlay has become inactive and the video starts playing.

```javascript
document.querySelector('#tiny-ui-toggle--default').addEventListener('playVideo', (event) => { 
  console.log(`Action: ${event.detail.action}`);
});
```

You can also attach this to the document.
```javascript
document.addEventListener('playVideo', (event) => { 
  console.log(`Target: ${event.target.matches('#tiny-ui-toggle--default')}`, `Action: ${event.detail.action}`);
});
```

---
## Compatibility

Supports all modern browsers (Firefox, Chrome, Safari and Edge) released as of April 2020.


---
## Demo site
Clone or download from Github.

```javascript
$ npm install
$ gulp serve
```

---
### Credits

Covverr videos of [Lago di braies](https://coverr.co/videos/lago-di-braies-y1yBShzUTZ) and [Lofoten rocks](https://coverr.co/videos/lofoten-rocks-GPfWh8WOtG). Youtube video of [Tustan Karpaty mountains](https://www.youtube.com/watch?v=FjPvaGt6Pw4). [Lazy loading of an embedded video](https://dev.to/haggen/lazy-load-embedded-youtube-videos-520g) by Arthur Corenzan. 

---
### License
MIT © Nigel O Toole
