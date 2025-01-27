const fileInput = document.getElementById("fileInput");
const processFileButton = document.getElementById("processFile");
const responseBox = document.getElementById("responseBox");

processFileButton.addEventListener("click", async () => {
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
            Authorization: `Bearer ${API_KEY}`, // Replace with your API key
          },
          body: JSON.stringify({
            model: "gpt-4",
            messages: [{ role: "user", content: fileContent }],
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch response from OpenAI API");
      }

      const data = await response.json();
      const openAiResponse = data.choices[0].message.content;
      responseBox.value = openAiResponse;
    } catch (error) {
      responseBox.value = `Error: ${error.message}`;
    }
  };

  reader.readAsText(file);
});
