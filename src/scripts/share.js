const Share = function (options) {
	const defaults = {
		selector: '.share-action',
    shareSuccess: 'Shared',
    copySuccess: 'Copied'
	}

	options = {...defaults, ...options};
  let elements;

  let shareUrl = document.location.href;
  let shareTitle = document.querySelector('title').innerText;



  const shareEvent = async (event, action) => {
    let successText;

    try {
      if (action === 'share') {
        await navigator.share({ title: shareTitle, url: shareUrl });
        successText = options.shareSuccess;
      }

      if (action === 'clipboard') {
        await navigator.clipboard.writeText(shareUrl);
        successText = options.copySuccess;
      }

      event.target.innerText = successText; 
    } 
    catch (error) {
      console.error(`Failed ${action}: ${error}`);
    }
  }

  
  const setup = function() {
	  for (const item of elements) {
      let action = item.dataset['shareAction'];
  
      if (navigator[action]) {
        item.addEventListener('click', (event) => shareEvent(event, action));
      }
      else {
        item.style.display = 'none';
      }
    };	
  };

  const init = function() {
    elements = document.querySelectorAll(options.selector);
    if (!elements.length) return;

    setup();
  };

	init();


  return {
  };

};

export default Share;