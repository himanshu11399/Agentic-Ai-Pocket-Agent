import { useEffect, useRef, useState } from "react";
import { genAI, MODEL_NAME } from "@/config/geminiconfig";
import { useGenerateImage } from "./generateimage";

// const { generateImage, loading: imageLoading } = useGenerateImage();

interface Message {
    role: "user" | "assistant";
    content: string;
    image?: string | null;
}

export const useGeminiChat = (
    agentName?: string,
    agentInitialText?: string,
    agentPrompt?: string,
    messageList?:[],
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

                // if(messageList?.length>0){
                //     setMessages(messages)
                // }
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

    // Keywords that strongly imply image generation
    const isImageRequest = (text: string): boolean => {
        if (!text) return false;

        const lower = text.toLowerCase().trim();

        // --- Common keywords for image intent ---
        const keywords = [
            "image", "picture", "photo", "art", "drawing", "painting",
            "sketch", "illustration", "render", "visual", "graphic",
            "portrait", "scene", "wallpaper"
        ];

        // --- Common action verbs for creation ---
        const actions = [
            "draw", "create", "generate", "make", "show", "display",
            "build", "design", "produce", "render", "illustrate", "paint"
        ];

        // 1️⃣ Direct pattern detection (verbs + nouns)
        const combinedPattern = new RegExp(
            `\\b(${actions.join("|")})\\b.*\\b(${keywords.join("|")})\\b`
        );

        // 2️⃣ Reverse pattern ("image of", "picture of", etc.)
        const nounFirstPattern = new RegExp(
            `\\b(${keywords.join("|")})\\b.*\\b(of|showing|with|featuring)\\b`
        );

        // 3️⃣ Explicit phrases that strongly imply image creation
        const strongPhrases = [
            "show me", "generate image", "generate art", "create picture",
            "make art", "make me", "draw me", "illustrate", "render", "paint"
        ];

        // ✅ If any trigger matches, return true
        return (
            strongPhrases.some((p) => lower.includes(p)) ||
            combinedPattern.test(lower) ||
            nounFirstPattern.test(lower)
        );
    };


    //   Send message
    const sendMessage = async (input: string, file?: string | null) => {
        // Skip if empty or already loading
        if ((!input?.trim() && !file) || loading) return;
        console.log("started")
        const abc = isImageRequest(input);
        console.log(abc);

        if (isImageRequest(input)) {
            setMessages((prev)=>[
                ...prev,
                {role:'user',content:input},
                {role:'assistant',content:'here is your image is in progress'}
            ]);
            return;
        }
        else {    //If image is not given in prompt

            if ((!input?.trim() && !file) || !chatRef.current || loading) return;

            setLoading(true);

            const userMsg: Message = {
                role: "user",
                content: file ? `${input ? input + "\n\n" : ""}[User uploaded an image 📷]` : input.trim(),
                image: file || null,
            };
            setMessages((prev) => [...prev, userMsg, { role: "assistant", content: "Typing..." }]);

            try {
                const parts: any[] = [];
                if (input?.trim()) parts.push({ text: input.trim() });

                if (file) {
                    const base64 = await fetch(file)
                        .then((r) => r.blob())
                        .then(
                            (blob) =>
                                new Promise<string>((resolve, reject) => {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                        const data = reader.result?.toString().replace(/^data:.+;base64,/, "");
                                        resolve(data || "");
                                    };
                                    reader.onerror = reject;
                                    reader.readAsDataURL(blob);
                                })
                        );
                    parts.push({ inlineData: { data: base64, mimeType: "image/jpeg" } });

                    if (!input?.trim()) {
                        parts.unshift({
                            text: "Describe this image simply and clearly, so a 4-year-old can understand.",
                        });
                    }
                }

                const result = await chatRef.current.sendMessage(parts);
                const responseText = result.response.text();

                setMessages((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1] = { role: "assistant", content: responseText };
                    return updated;
                });
            } catch (error) {
                console.error("AI Error:", error);
                setMessages((prev) => [
                    ...prev,
                    { role: "assistant", content: "⚠️ Sorry, I couldn't process that." },
                ]);
            } finally {
                setLoading(false);
            }

        }
    };

    const resetChat = (initialMsg: Message[]) => {
        setMessages(initialMsg);
    };

    return { messages, sendMessage, loading, resetChat, setMessages };
}