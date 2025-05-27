
'use server';
/**
 * @fileOverview An AI flow to analyze the conceptual scaling capacity of selected architectural components.
 *
 * - analyzeCapacityPotential - A function that takes selected components and returns an AI-generated analysis of their scaling potential.
 * - AnalyzeCapacityInput - The input type for the analyzeCapacityPotential function (same as AnalyzeSystemInput).
 * - AnalyzeCapacityOutput - The return type for the analyzeCapacityPotential function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { AnalyzeSystemInput } from './analyze-system-flow'; // Reusing the input type

// Input schema is the same as AnalyzeSystemInput, so we reuse it.
// If it were different, we'd define a new one here.
export type AnalyzeCapacityInput = AnalyzeSystemInput;

const AnalyzeCapacityOutputSchema = z.object({
  analysis: z.string().describe('The AI-generated conceptual analysis of how the selected components contribute to user capacity, highlighting strengths, potential bottlenecks, and general scaling factors. This analysis should be in markdown format.'),
});
export type AnalyzeCapacityOutput = z.infer<typeof AnalyzeCapacityOutputSchema>;

export async function analyzeCapacityPotential(input: AnalyzeCapacityInput): Promise<AnalyzeCapacityOutput> {
  return analyzeCapacityFlow(input);
}

const analyzeCapacityPrompt = ai.definePrompt({
  name: 'analyzeCapacityPrompt',
  input: { schema: z.custom<AnalyzeCapacityInput>() }, // Using z.custom as AnalyzeSystemInputSchema is not directly exported
  output: { schema: AnalyzeCapacityOutputSchema },
  prompt: `You are an expert system architect specializing in hyperscale systems capable of handling millions to billions of users.
A user has selected the following architectural components and their specific types:

{{#if components.length}}
  {{#each components}}
- **{{componentTitle}}**: {{#if selectedTypes.length}}{{#each selectedTypes}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}No specific types selected{{/if}}
  {{/each}}
{{else}}
No components selected. Please describe general principles for building high-capacity systems.
{{/if}}

Provide a conceptual analysis of how this combination of components contributes to handling a large number of users.
Your analysis should:
1.  Discuss the strengths of this combination for achieving high user capacity and scalability.
2.  Identify potential bottlenecks or challenges that might limit the maximum user capacity with this specific selection. Consider how the components interact.
3.  Explain general principles or additional critical considerations (e.g., database performance beyond just selection, efficient application code, network topology, operational maturity, cost at scale) that would be essential to actually reach very high scale, even with these components.
4.  Conclude with a high-level qualitative statement about the system's potential for scale if implemented correctly, without giving specific numbers.
5.  DO NOT attempt to provide a specific number for "max users" or a precise capacity figure. Focus on the qualitative aspects, scaling factors, design trade-offs, and challenges.
6.  Structure your response in a clear, informative, and easy-to-understand manner. Format the output using markdown for readability (e.g., headings, bullet points).
`,
});

const analyzeCapacityFlow = ai.defineFlow(
  {
    name: 'analyzeCapacityFlow',
    inputSchema: z.custom<AnalyzeCapacityInput>(),
    outputSchema: AnalyzeCapacityOutputSchema,
  },
  async (input) => {
    const validatedInput = input.components && input.components.length > 0
      ? input
      : { components: [] };

    const { output } = await analyzeCapacityPrompt(validatedInput);
    if (!output) {
      throw new Error('AI capacity analysis failed to generate an output.');
    }
    return output;
  }
);
