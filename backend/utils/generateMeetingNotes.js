const generateMeetingNotes = async (topic) => {
  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/gpt2",
      {
        inputs: `Write meeting notes for a discussion on the topic in brief (less than 100 words): ${topic}`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
        },
      }
    );

    const result = response.data;
    if (Array.isArray(result)) {
      const notes = result[0]?.generated_text || "Notes not available.";
      return cleanGeneratedText(notes);
    } else if (result?.generated_text) {
      return cleanGeneratedText(result.generated_text);
    } else {
      console.error("Unexpected result format:", result);
      return "Notes not available.";
    }
  } catch (error) {
    console.error("HuggingFace Error:", error.response?.data || error.message);
    return "Failed to generate notes.";
  }
};

const cleanGeneratedText = (text) => {
  // Clean the text by removing special characters
  return text.replace(/[^a-zA-Z0-9\s.,!?]/g, '').trim();
};
module.exports = generateMeetingNotes;
    
