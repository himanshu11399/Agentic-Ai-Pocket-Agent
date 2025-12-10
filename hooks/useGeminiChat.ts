import { useEffect, useRef, useState } from "react";
import { genAI, MODEL_NAME } from "@/config/geminiconfig";

interface Message {
  role: "user" | "assistant";
  content: string;
  image?: string | null;
}

export const useGeminiChat = (
  agentName?: string,
  agentInitialText?: string,
  agentPrompt?: string,
) => {
  const chatRef = useRef<any>(null);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: agentInitialText || "Hello! How can I help you today?" },
  ]);
  const [loading, setLoading] = useState(false);

  //Initi;aize the Gemini chat
  useEffect(() => {
    try {
      const model = genAI.getGenerativeModel({ model: MODEL_NAME });

      const history: any[] = [];
      if (agentPrompt) {
        history.push({
          role: "user",
          parts: [
            {
              text: `You are a specialized AI named ${agentName}. Your core instruction is: ${agentPrompt}`,
            },
          ],
        });
        history.push({
          role: "model",
          parts: [{ text: agentInitialText ?? "Hello! How can I help you today?" }],
        });
      }

      const chat = model.startChat({
        history: history.length > 0 ? history : undefined,
        generationConfig: { maxOutputTokens: 2048 },
      });

      chatRef.current = chat;
      console.log("✅ Gemini chat session initialized");

    } catch (error) {
      console.error("⚠️ Chat init failed:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error initializing Gemini. Check API key/model." },
      ]);
    }
  }, [agentName, agentInitialText, agentPrompt]);

  const isImageRequest = (text: string) => {
    const lower = text.toLowerCase().trim();

    // Keywords that strongly imply image generation
    const imageKeywords = [
      "draw ",
      "generate an image",
      "create an image",
      "make an image",
      "show me a picture",
      "build an image",
      "draw me",
      "paint",
      "illustrate",
      "sketch",
    ];

    // If any keyword matches, return true
    return imageKeywords.some((kw) => lower.includes(kw));
  };

  //Send message
  // const sendMessage = async (input: string, file?: string | null) => {
  //   // Skip if empty or already loading
  //   if ((!input?.trim() && !file) || loading) return;
  //   console.log("started")
  //   const abc=isImageRequest(input);
  //   console.log(abc);
  //   if (isImageRequest(input)) {
  //     setLoading(true);
  //     console.log("image called")
  //     try {
  //       // Add a temporary "typing" message
  //       setMessages((prev) => [
  //         ...prev,
  //         { role: "user", content: input },
  //         { role: "assistant", content: "🎨 Generating image..." },
  //       ]);

  //       const imageModel = genAI.getGenerativeModel({ model: "imagen-3.0" }); // ✅ Gemini image model
  //       const imgResult = await imageModel.generateContent(input);
  //       const imageData = imgResult.response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

  //       if (imageData) {
  //         const base64Uri = `data:image/png;base64,${imageData}`;
  //         console.log(imageData)
  //         setMessages((prev) => {
  //           const updated = [...prev];
  //           updated[updated.length - 1] = {
  //             role: "assistant",
  //             content: "Here’s the image I generated for you 🎨",
  //             image: base64Uri,
  //           };
  //           return updated;
  //         });
  //       } else {
  //         throw new Error("No image data received");
  //       }
  //     } catch (err) {
  //       console.error("Image generation failed:", err);
  //       setMessages((prev) => [
  //         ...prev,
  //         {
  //           role: "assistant",
  //           content: "⚠️ Sorry, I couldn’t generate that image.",
  //         },
  //       ]);
  //     }
  //     return;
  //   } else {    //If image is not given in prompt

  //   //   if ((!input?.trim() && !file) || !chatRef.current || loading) return;

  //   //   setLoading(true);

  //   //   const userMsg: Message = {
  //   //     role: "user",
  //   //     content: file ? `${input ? input + "\n\n" : ""}[User uploaded an image 📷]` : input.trim(),
  //   //     image: file || null,
  //   //   };
  //   //   setMessages((prev) => [...prev, userMsg, { role: "assistant", content: "Typing..." }]);

  //   //   try {
  //   //     const parts: any[] = [];
  //   //     if (input?.trim()) parts.push({ text: input.trim() });

  //   //     if (file) {
  //   //       const base64 = await fetch(file)
  //   //         .then((r) => r.blob())
  //   //         .then(
  //   //           (blob) =>
  //   //             new Promise<string>((resolve, reject) => {
  //   //               const reader = new FileReader();
  //   //               reader.onloadend = () => {
  //   //                 const data = reader.result?.toString().replace(/^data:.+;base64,/, "");
  //   //                 resolve(data || "");
  //   //               };
  //   //               reader.onerror = reject;
  //   //               reader.readAsDataURL(blob);
  //   //             })
  //   //         );
  //   //       parts.push({ inlineData: { data: base64, mimeType: "image/jpeg" } });

  //   //       if (!input?.trim()) {
  //   //         parts.unshift({
  //   //           text: "Describe this image simply and clearly, so a 4-year-old can understand.",
  //   //         });
  //   //       }
  //   //     }

  //   //     const result = await chatRef.current.sendMessage(parts);
  //   //     const responseText = result.response.text();

  //   //     setMessages((prev) => {
  //   //       const updated = [...prev];
  //   //       updated[updated.length - 1] = { role: "assistant", content: responseText };
  //   //       return updated;
  //   //     });
  //   //   } catch (error) {
  //   //     console.error("AI Error:", error);
  //   //     setMessages((prev) => [
  //   //       ...prev,
  //   //       { role: "assistant", content: "⚠️ Sorry, I couldn't process that." },
  //   //     ]);
  //   //   } finally {
  //   //     setLoading(false);
  //   //   }

  //   }
  // };

  //send Message
  const sendMessage=async(input:string,file?:string|null)=>{
    console.log("send called");
  }
  const resetChat = (initialMsg: Message[]) => {
    setMessages(initialMsg);
  };

  return { messages,sendMessage, loading, resetChat, setMessages };
}