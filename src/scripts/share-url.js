const ShareUrl = function (args) {
	const defaults = {
		selector: '.share-url',
    action: 'share',
    url: document.location.href,
    title: document.title,
    textSelector: null,
    textLabel: '',
    textSuccess: 'Shared',
    successClass: 'is-active',
    maintainSize: true
	}

	let options = {...defaults, ...args};
  let element;
  let textElement;


  // Utilities
  const checkBoolean = function (string) {
	  if (string.toLowerCase() === 'true') return true;
	  if (string.toLowerCase() === 'false') return false;
		return string;
  };


  // Methods
  const shareEvent = async () => {
    try {
      if (options.action === 'share') {
        await navigator.share({ title: options.title, text: options.title, url: options.url });
      }

      if (options.action === 'clipboard') {
        await navigator.clipboard.writeText(options.url);
      }

      let textWidth = textElement.offsetWidth;
      textElement.innerText = options.textSuccess;
      if (options.maintainSize) textElement.style.width = `${Math.max(textWidth, textElement.offsetWidth)}px`;
      element.classList.add(options.successClass);
    } 
    catch (error) {
      if (error.name !== 'AbortError') console.error(error.name, error.message);
    }
  }

  
  const setup = function() {
    let datasetOptions = {...element.dataset};
    let datasetPrefix = 'share';

		for (const item in datasetOptions) {
			if (!item.startsWith(datasetPrefix)) continue;

			let prop = item.substring(datasetPrefix.length);
			prop = prop.charAt(0).toLowerCase() + prop.substring(1);
      let value = checkBoolean(datasetOptions[item]);

			options[prop] = value;
      // console.log(`${prop}: ${value}`)
		};

    // console.log(options);

    textElement = element.querySelector(options.textSelector);
    if (textElement === null) textElement = element;
    if (options.textLabel) textElement.innerText = options.textLabel;


    if (navigator[options.action]) {
      // element.addEventListener('click', (event) => shareEvent(event, options.action));
      element.addEventListener('click', () => shareEvent());
    }
    else {
      element.style.display = 'none';
    }
  };

  const init = function() {
    element = (typeof options.selector === 'string') ? document.querySelector(options.selector) : options.selector;
    if (!element) return;

    setup();
  };

	init();

};


const ShareUrlAuto = function () {
	const elements = document.querySelectorAll('.share-url');
	for (const item of elements) {
		ShareUrl({ selector: item });
	};
};


export { ShareUrl, ShareUrlAuto };
