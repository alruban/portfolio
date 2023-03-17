const customEvent = (eventName: string, details: Object) => {
  return document.documentElement.dispatchEvent(
    new CustomEvent(eventName, {
      bubbles: true,
      detail: {
        ...details
      }
    }
  ));
};

export default customEvent;
