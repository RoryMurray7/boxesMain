const fileInput = document.getElementById("fileInput");
const submitButton = document.getElementById("submit");
const responseBox = document.getElementById("responseBox");

const systemMessage = `
Analyze JSON files containing individual survey responses about a product. Summarize the overall consensus of the feedback and provide three actionable insights for product improvement.

# Steps

1. **Identify Key Themes**: Examine the feedback for repetitive comments or common themes to determine the overall sentiment.
2. **Consensus Summary**: Summarize the general consensus in a paragraph.
3. **Actionable Insights**: Identify and list three clear, actionable insights derived from the feedback to improve the product. Ensure each insight is supported by the feedback data.

# Output Format

- A couple of lines of text summarizing the general consensus.
- A list of three to five actionable insights.

# Notes

- Ensure the insights are directly actionable and relevant to product improvement.
- Maintain objectivity and avoid drawing unsupported conclusions based only on a couple of responses.
- Wrap text in * for bold, ** for italic and # for subtitles
- omit any information from the output that could identify a person such as their email or name
`;

// document.addEventListener("DOMContentLoaded", () => {
//   const form = document.getElementById("myForm");
//   const fileSubmitButton = document.getElementById("submit");
//   const responseBox = document.getElementById("responseBox");

//   // If we're on the first page, handle form submission
//   if (form) {
//     form.addEventListener("submit", function (event) {
//       event.preventDefault(); // Prevent form from submitting normally

//       // Get values from form inputs
//       const companyName = document.getElementById("companyName").value;
//       const productService =
//         document.getElementsByName("productService")[0].value;
//       const targetDemographics =
//         document.getElementById("targetDemographics").value;

//       // Store values in localStorage
//       localStorage.setItem("companyName", companyName);
//       localStorage.setItem("productService", productService);
//       localStorage.setItem("targetDemographics", targetDemographics);

//       // Redirect to second page
//       window.location.href = "../HTML/fileupload.html";
//     });
//   }

//   // If we're on the second page, retrieve values and update responseBox
//   if (fileSubmitButton && responseBox) {
//     fileSubmitButton.addEventListener("click", () => {
//       // Retrieve values from localStorage
//       const companyName =
//         localStorage.getItem("companyName") || "No Company Name";
//       const productService =
//         localStorage.getItem("productService") || "No Product/Service";
//       const targetDemographics =
//         localStorage.getItem("targetDemographics") || "No Target Demographics";

//       // Display retrieved values in responseBox
//       responseBox.innerHTML = `
//         <strong>Company Name:</strong> ${companyName} <br>
//         <strong>Product / Service:</strong> ${productService} <br>
//         <strong>Target Demographics:</strong> ${targetDemographics}
//       `;
//     });
//   }
// });

// A basic Markdown parser function
function parseMarkdown(text) {
  // Convert Markdown to HTML:
  text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"); // Bold
  text = text.replace(/\*(.*?)\*/g, "<em>$1</em>"); // Italics
  text = text.replace(/^# (.*?)$/gm, "<h3>$1</h3>"); // Heading (h2)
  text = text.replace(/\n/g, "<br>"); // Line break
  return text;
}

submitButton.addEventListener("click", async () => {
  const file = fileInput.files[0];

  if (!file) {
    alert("Please select a file!");
    return;
  }

  const reader = new FileReader();

  reader.onload = async (event) => {
    const fileContent = event.target.result;

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o",
            temperature: 0.8,
            messages: [
              { role: "user", content: fileContent },
              { role: "system", content: systemMessage },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch response from OpenAI API");
      }

      const data = await response.json();
      const openAiResponse = data.choices[0].message.content;

      // Parse Markdown and render as HTML
      const openAiResponseHtml = parseMarkdown(openAiResponse);
      responseBox.innerHTML = openAiResponseHtml; // Display as HTML
    } catch (error) {
      responseBox.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    }
  };

  reader.readAsText(file);
});
