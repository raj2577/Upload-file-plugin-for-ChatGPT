// Optional: You can include any background script logic here
// This script will run as a service worker in the background

// Example background script
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'hello') {
    console.log('Hello from content script!');
  }
});
