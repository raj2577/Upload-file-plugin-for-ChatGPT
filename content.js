// Create button element
const button = document.createElement('button');
button.textContent = 'Submit File';
button.style.backgroundColor = '#343541';
button.style.color = 'white';
button.style.padding = '5px';
button.style.border = 'none';
button.style.borderRadius = '5px';
button.style.margin = '5px';

// Create progress element
const progress = document.createElement('progress');
progress.style.width = '99%';
progress.style.height = '5px';
progress.style.backgroundColor = 'grey';

// Create progress bar element
const progressBar = document.createElement('div');
progressBar.style.width = '0%';
progressBar.style.height = '100%';
progressBar.style.backgroundColor = 'blue';

// Append progress bar to progress element
progress.appendChild(progressBar);

// Find the element to insert before
const targetElement = document.querySelector('.flex.flex-col.w-full.py-2.flex-grow.md\\:py-3.md\\:pl-4');

// Insert button and progress elements before the target element
targetElement.parentNode.insertBefore(button, targetElement);
targetElement.parentNode.insertBefore(progress, targetElement);

// File input event handler
button.addEventListener('click', () => {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.txt, .js, .py, .html, .css, .json, .csv';

  fileInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    const filename = file.name;
    const reader = new FileReader();

    reader.onload = async (e) => {
      const content = e.target.result;
      const chunks = splitTextIntoChunks(content, 15000);
      const numChunks = chunks.length;

      for (let i = 0; i < numChunks; i++) {
        const chunk = chunks[i];
        await submitConversation(chunk, i + 1, filename);
        progressBar.style.width = `${((i + 1) / numChunks) * 100}%`;
      }

      progressBar.style.backgroundColor = 'blue';
    };

    reader.readAsText(file);
  });

  fileInput.click();
});

// Helper function to split text into chunks
function splitTextIntoChunks(text, chunkSize) {
  const chunks = [];
  let start = 0;

  while (start < text.length) {
    chunks.push(text.slice(start, start + chunkSize));
    start += chunkSize;
  }

  return chunks;
}

// Helper function to submit conversation
async function submitConversation(text, part, filename) {
  const textarea = document.querySelector('textarea[tabindex="0"]');
  const enterKeyEvent = new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    keyCode: 13,
  });
  textarea.value = `Part ${part} of ${filename}:\n\n${text}`;
  textarea.dispatchEvent(enterKeyEvent);

  // Check if chatgpt is ready
  let chatgptReady = false;
  while (!chatgptReady) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    chatgptReady = !document.querySelector('.text-2xl > span:not(.invisible)');
  }
}
