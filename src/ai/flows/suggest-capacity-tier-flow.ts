
'use server';
/**
 * @fileOverview An AI flow to suggest a conceptual user capacity tier for selected architectural components.
 *
 * - suggestCapacityTier - A function that takes selected components and returns an AI-generated capacity tier suggestion and reasoning.
 * - SuggestCapacityTierInput - The input type for the suggestCapacityTier function (same as AnalyzeSystemInput).
 * - SuggestCapacityTierOutput - The return type for the suggestCapacityTier function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { AnalyzeSystemInput } from './analyze-system-flow'; // Reusing the input type

// Input schema is the same as AnalyzeSystemInput, so we reuse it.
export type SuggestCapacityTierInput = AnalyzeSystemInput;

const SuggestCapacityTierOutputSchema = z.object({
  suggestedTier: z.string().describe(
    'A qualitative tier describing the conceptual user capacity the selected system might be suitable for (e.g., "Potentially suitable for handling millions of users", "Forms a strong foundation for systems aiming for a billion+ users"). This is a conceptual estimate, not a guarantee.'
  ),
  reasoning: z.string().describe(
    'A markdown-formatted explanation of why the suggested tier is appropriate, based on the selected components. This should highlight strengths, and mention critical co-factors (like database performance, operational maturity, code quality) essential for achieving such scale.'
  ),
  keyStrengthsForTier: z.array(z.string()).describe(
    'A list of 2-3 key architectural strengths from the user\'s selection that most significantly support the suggested capacity tier.'
  ),
  considerationsForNextTier: z.array(z.string()).describe(
    'A list of 2-3 crucial components, strategies, or architectural considerations that would be essential to address if aiming for the *next* higher conceptual tier of user capacity.'
  ),
  keyAssumptions: z.array(z.string()).optional().describe(
    'A list of 2-3 key assumptions the AI made when suggesting this tier (e.g., "Assumes optimal database configuration," "Assumes efficient application code").'
  ),
});
export type SuggestCapacityTierOutput = z.infer<typeof SuggestCapacityTierOutputSchema>;

export async function suggestCapacityTier(input: SuggestCapacityTierInput): Promise<SuggestCapacityTierOutput> {
  return suggestCapacityTierFlow(input);
}

const suggestCapacityTierPrompt = ai.definePrompt({
  name: 'suggestCapacityTierPrompt',
  input: { schema: z.custom<SuggestCapacityTierInput>() }, 
  output: { schema: SuggestCapacityTierOutputSchema },
  prompt: `You are a highly experienced Chief System Architect specializing in designing and evaluating hyperscale systems.
A user has selected the following architectural components and their specific types:

{{#if components.length}}
  {{#each components}}
- **{{componentTitle}}**: {{#if selectedTypes.length}}{{#each selectedTypes}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}No specific types selected{{/if}}
  {{/each}}
{{else}}
No components selected. Please indicate that a selection is needed to suggest a capacity tier.
{{/if}}

Based on this selection, provide a conceptual analysis of the user capacity tier this system might be suitable for. Your response MUST include:
1.  **suggestedTier**: A qualitative tier (e.g., "Tens to Hundreds of Thousands of Users", "Hundreds of Thousands to Low Millions of Users", "Millions to Tens of Millions of Users", "Tens of Millions to Hundreds of Millions of Users", "Potentially Foundational for Systems Aiming for a Billion+ Users").
    *   **IMPORTANT**: This is a conceptual, high-level estimation based on the inherent capabilities of the chosen technologies and architectural patterns if implemented optimally. It is NOT a precise prediction, a guarantee, or a "max user" calculation. State this clearly in your reasoning.
2.  **reasoning**: A detailed markdown-formatted explanation for the suggestedTier.
    *   Discuss how the selected components (and their chosen types) contribute (or don't contribute) to this level of scale.
    *   Highlight specific strengths related to scalability that these components offer in combination.
    *   Emphasize that actually achieving this scale depends critically on factors *not* explicitly selectable here, such as:
        *   The specific design and efficiency of the application code.
        *   The performance and scalability of the database layer (if not explicitly selected as a strategy).
        *   Operational maturity, robust monitoring, and auto-scaling implementations.
        *   Network infrastructure and real-world deployment conditions.
        *   Cost implications and budget.
3.  **keyStrengthsForTier**: Identify the 2-3 most important architectural strengths from the user's selection that directly support the suggested capacity tier.
4.  **considerationsForNextTier**: List 2-3 crucial additional components, strategies, or architectural considerations (not already fully covered by the user's selection) that would be essential to address if the user wanted to aim for the *next* higher conceptual tier of user capacity. If they are already at the highest conceptual tier you model, suggest areas for continuous improvement or extreme optimization.
5.  **keyAssumptions**: List 2-3 key underlying assumptions you made when suggesting this tier. For example: "Assumes application code is highly optimized and efficiently utilizes resources." or "Assumes database queries are well-indexed and the database itself is scaled appropriately for the load." or "Assumes that chosen autoscaling strategies are correctly implemented and tuned."

**Output Format Guidance:**
- Ensure the output strictly adheres to the SuggestCapacityTierOutputSchema.
- Provide reasoning in clear, accessible language, suitable for someone learning about system architecture. Use markdown for formatting (headings, lists).
- Be realistic and balanced. Avoid overstating capabilities.

If no components are selected, the \`suggestedTier\` should state that selections are needed, and other fields can be empty or provide general advice.
`,
});

const suggestCapacityTierFlow = ai.defineFlow(
  {
    name: 'suggestCapacityTierFlow',
    inputSchema: z.custom<SuggestCapacityTierInput>(),
    outputSchema: SuggestCapacityTierOutputSchema,
  },
  async (input) => {
    const validatedInput = input.components && input.components.length > 0
      ? input
      : { components: [] }; 

    if (validatedInput.components.length === 0) {
      return {
        suggestedTier: "Please select architectural components to receive a capacity tier suggestion.",
        reasoning: "No components were selected. To get a conceptual capacity tier analysis, please choose components and their types from the list.",
        keyStrengthsForTier: [],
        considerationsForNextTier: [],
        keyAssumptions: []
      };
    }
    
    const { output } = await suggestCapacityTierPrompt(validatedInput);
    if (!output) {
      throw new Error('AI capacity tier suggestion failed to generate an output.');
    }
    return output;
  }
);

