const apiResponse = {
  summary:
    "The overall sentiment regarding the product is positive, with users appreciating its sleek design, performance, and portability. However, there are consistent concerns about overheating, limited port selection, and noise from cooling systems during intensive use.",
  total_responses: 10,
  average_rating: 3.7,
  average_age: "18-25",
  actionable_insights: [
    "Enhance the cooling system to address overheating issues and reduce noise during intensive tasks, as multiple users reported the device heating up and being noisy.",
    "Expand the port selection to accommodate more peripherals, as several users found the current selection limited.",
    "Improve the device's performance when running multiple applications simultaneously, as some users experienced lag and underperformance during such tasks.",
  ],
};

function displayApiResponse(response) {
  document.getElementById("summary").textContent = response.summary;
  document.getElementById("total_responses").textContent =
    response.total_responses;
  document.getElementById("average_rating").textContent =
    response.average_rating;
  document.getElementById("average_age").textContent = response.average_age;

  const insightsContainer = document.getElementById("actionable_insights");
  response.actionable_insights.forEach((insight) => {
    const li = document.createElement("li");
    li.textContent = insight;
    insightsContainer.appendChild(li);
  });
}

// runs for testing
document.addEventListener("DOMContentLoaded", function () {
  displayApiResponse(apiResponse);
});

async function getGPTResponse() {
  try {
    summary.textContent = "Loading...";

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

    // Pass the response data to the display function
    displayApiResponse(response);
  } catch (error) {
    console.error("Error:", error);
    summary.textContent = "Error fetching response. Please try again.";
    actionable_insights.textContent =
      "Error fetching response. Please try again.";
  }
}

// Initial load
//document.addEventListener("DOMContentLoaded", getGPTResponse);
