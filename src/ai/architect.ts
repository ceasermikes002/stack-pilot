import { GoogleGenAI } from '@google/genai';
import { getConfig } from './config.js';
import { generateSystemPrompt } from './prompts.js';
import { Validator, StackChoice } from '../validator/index.js';

export interface AIRecommendation {
    projectName: string;
    summary: string[];
    reasoning: string;
    stack: StackChoice;
    addons: string[];
}

export async function getStackRecommendation(
    description: string,
    validator: Validator
): Promise<AIRecommendation> {
    const config = getConfig();
    const provider = config.aiProvider || 'gemini';
    const systemPrompt = generateSystemPrompt(validator);

    let text: string | null = null;

    switch (provider) {
        case 'gemini': {
            if (!config.geminiApiKey) {
                throw new Error('Gemini API key is not configured. Please run `stackpilot init` first.');
            }
            const ai = new GoogleGenAI({ apiKey: config.geminiApiKey });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: description,
                config: {
                    systemInstruction: systemPrompt,
                    responseMimeType: 'application/json',
                }
            });
            text = response.text || null;
            break;
        }
        case 'openai': {
            if (!config.openaiApiKey) {
                throw new Error('OpenAI API key is not configured. Please run `stackpilot init` first.');
            }
            throw new Error('OpenAI provider is not yet fully implemented.');
        }
        case 'anthropic': {
            if (!config.anthropicApiKey) {
                throw new Error('Anthropic API key is not configured. Please run `stackpilot init` first.');
            }
            throw new Error('Anthropic provider is not yet fully implemented.');
        }
    }

    if (!text) {
        throw new Error('No response received from AI provider.');
    }

    let parsed: AIRecommendation;
    try {
        parsed = JSON.parse(text);
    } catch (err) {
        throw new Error('Failed to parse the AI response as JSON.');
    }

    // Double check AI made valid choices dynamically
    const validation = validator.validate(parsed.stack);
    if (!validation.isValid) {
        throw new Error('AI chose an invalid stack combination: ' + validation.errors.join(', '));
    }

    return parsed;
}
