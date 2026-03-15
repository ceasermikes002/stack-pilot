import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getStackRecommendation, AIRecommendation } from '../src/ai/architect.js';
import { Validator } from '../src/validator/index.js';
import path from 'path';

// Mock config module to bypass file system reading
vi.mock('../src/ai/config.js', () => ({
    getConfig: () => ({ geminiApiKey: 'test-key' })
}));

// Mock GoogleGenAI client
export const mockGenerateContent = vi.fn();
vi.mock('@google/genai', () => ({
    GoogleGenAI: class {
        models = {
            generateContent: mockGenerateContent
        };
    }
}));

describe('AI Architecture Engine', () => {
    let validator: Validator;

    beforeEach(() => {
        validator = new Validator(path.resolve(__dirname, '../config/stacks.config.json'));
        vi.clearAllMocks();
    });

    it('should parse valid AI response into recommendation', async () => {
        const fakeResponseInfo = {
            projectName: 'therapy-app',
            summary: ['Speed is key', 'Relational data'],
            reasoning: 'Good stack',
            stack: {
                frontend: 'nextjs',
                backend: 'none',
                database: 'postgresql',
                orm: 'prisma',
                auth: 'clerk',
                payments: 'stripe',
                styling: 'tailwind-shadcn',
                deployment: 'vercel'
            },
            addons: ['email']
        };

        mockGenerateContent.mockResolvedValueOnce({
            text: JSON.stringify(fakeResponseInfo)
        });

        const recommendation = await getStackRecommendation('I want a therapy app', validator);
        expect(recommendation.projectName).toBe('therapy-app');
        expect(recommendation.stack.frontend).toBe('nextjs');
    });

    it('should throw error when AI selects invalid stack (caught by Validator)', async () => {
        const invalidResponse = {
            projectName: 'bad-app',
            summary: ['Test'],
            reasoning: 'Bad stack',
            stack: {
                frontend: 'nextjs',
                database: 'mongodb',
                orm: 'prisma' // Prisma isn't compatible with mongodb in our config!
            },
            addons: []
        };

        mockGenerateContent.mockResolvedValueOnce({
            text: JSON.stringify(invalidResponse)
        });

        await expect(getStackRecommendation('test', validator))
            .rejects.toThrow(/AI chose an invalid stack combination/);
    });
});
