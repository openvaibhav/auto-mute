chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'press_m') {
    console.log('Received press_m message');
    const eventOptions = {
      key: 'm',
      code: 'KeyM',
      keyCode: 77,
      which: 77,
      bubbles: true,
      cancelable: true
    };
    const targets = [document, document.body, document.activeElement];
    targets.forEach(target => {
      if (target) {
        target.dispatchEvent(new KeyboardEvent('keydown', eventOptions));
        target.dispatchEvent(new KeyboardEvent('keyup', eventOptions));
      }
    });
  }
}); 