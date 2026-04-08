import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const extractResumeData = async (text: string) => {
  const prompt = `
    You are an expert resume parser. Extract structured information from the following resume text.
    Return ONLY a valid JSON object with the following structure:
    {
      "name": "Full Name",
      "summary": "Brief summary",
      "skills": ["Skill 1", "Skill 2"],
      "experience": [
        {
          "role": "Job Title",
          "company": "Company Name",
          "duration": "Duration",
          "description": "Responsibilities"
        }
      ],
      "education": [
        {
          "degree": "Degree Name",
          "institution": "University/College",
          "year": "Graduation Year"
        }
      ]
    }

    Resume Text:
    ${text}
  `;

  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 2000,
    messages: [{ role: "user", content: prompt }],
  });

  // Extract JSON from response
  const content = response.content[0].text;
  try {
    const jsonStart = content.indexOf("{");
    const jsonEnd = content.lastIndexOf("}") + 1;
    return JSON.parse(content.substring(jsonStart, jsonEnd));
  } catch (error) {
    console.error("Failed to parse AI response:", content);
    return null;
  }
};

export default anthropic;
