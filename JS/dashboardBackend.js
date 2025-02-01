const summaryBox = document.getElementById("summaryResponse");
const reloadButton = document.getElementById("buttonN");
const fileContent = "Hello, Who are you";
// Function to call OpenAI API
async function getGPTResponse() {
  try {
    // Show loading state
    summaryBox.textContent = "Loading...";

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        max_tokens: 5000,
        temperature: 0.7,
        messages: [
          { role: "user", content: sampleSurveyData },
          { role: "system", content: systemMessage },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Display the response
    if (data.choices && data.choices[0]) {
      summaryBox.textContent = data.choices[0].message.content;
    } else {
      throw new Error("No response content received");
    }
  } catch (error) {
    console.error("Error:", error);
    summaryBox.textContent = "Error fetching response. Please try again.";
  }
}

// Add click event listener to reload button
reloadButton.addEventListener("click", getGPTResponse);

// Initial load
//document.addEventListener("DOMContentLoaded", getGPTResponse);
