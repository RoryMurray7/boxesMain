document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("fileInput");
  const fileNameSpan = document.getElementById("fileName");
  const submitButton = document.querySelector(".submit");

  // Update filename when a file is selected
  fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      fileNameSpan.textContent = file.name;
    } else {
      fileNameSpan.textContent = "No file chosen";
    }
  });

  // Read file when submit is clicked
  submitButton.addEventListener("click", (event) => {
    // Prevent default link navigation
    event.preventDefault();

    // Check if a file is selected
    if (!fileInput.files.length) {
      alert("Please select a file first.");
      return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        // Store the file content in sessionStorage
        const fileContent = e.target.result;

        // Store as a JSON string to handle both text and JSON files
        sessionStorage.setItem(
          "FILE_CONTENT",
          JSON.stringify({
            content: fileContent,
            type: file.type || file.name.split(".").pop(),
          })
        );

        // Optional: Validate and parse JSON if needed
        if (file.name.endsWith(".json")) {
          try {
            const jsonData = JSON.parse(fileContent);
            console.log("Parsed JSON:", jsonData);
          } catch (jsonError) {
            console.error("Invalid JSON:", jsonError);
          }
        }

        // Proceed to dashboard
        window.location.href = "./dashboard.html";
      } catch (error) {
        console.error("Error reading file:", error);
        alert("Error reading file. Please try again.");
      }
    };

    reader.onerror = (error) => {
      console.error("File reading error:", error);
      alert("Error reading file. Please try again.");
    };

    // Read the file as text
    reader.readAsText(file);
  });
});

// Utility function to retrieve file content in other scripts
function getStoredFileContent() {
  const storedContent = sessionStorage.getItem("FILE_CONTENT");
  if (storedContent) {
    const parsedContent = JSON.parse(storedContent);
    return parsedContent.content;
  }
  return null;
}

// Optional: Clear storage when leaving the page if needed
window.addEventListener("beforeunload", () => {
  // Uncomment if you want to clear on every page leave
  // sessionStorage.removeItem('FILE_CONTENT');
});
