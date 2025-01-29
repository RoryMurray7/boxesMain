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
            Authorization: `Bearer ${API_KEY}`, // Replace this with your API key
          },
          body: JSON.stringify({
            model: "gpt-4",
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
