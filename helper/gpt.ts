import { Configuration,OpenAIApi } from 'openai';



export const generateCompletion=async(input:string)=>{
    try {
      const prompt = input;
      const maxTokens = 2000;
      const n = 1;
  
      const configuration = new Configuration({
        apiKey:process.env.apikey,
      });
  
      const openai = new OpenAIApi(configuration);
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: maxTokens,
        n: n
      });
  
      const { choices } = response.data;
      if (choices && choices.length > 0) {
        const completion:undefined |String = choices[0]?.text?.trim();
        return completion;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }


 