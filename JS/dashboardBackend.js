const summaryBox = document.getElementById("summaryResponse");

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

// Example usage
document.addEventListener("DOMContentLoaded", function () {
  displayApiResponse(apiResponse);
});

async function getGPTResponse() {
  try {
    summaryBox.textContent = "Loading...";

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KE}`,
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

// Initial load
//document.addEventListener("DOMContentLoaded", getGPTResponse);
