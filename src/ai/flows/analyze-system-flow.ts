
'use server';
/**
 * @fileOverview An AI flow to analyze selected architectural components and their interactions.
 *
 * - analyzeSystem - A function that takes selected components and returns an AI-generated analysis.
 * - AnalyzeSystemInput - The input type for the analyzeSystem function.
 * - AnalyzeSystemOutput - The return type for the analyzeSystem function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SelectedComponentSchema = z.object({
  componentTitle: z.string().describe('The title of the architectural component.'),
  selectedTypes: z.array(z.string()).describe('A list of specific types selected for this component.'),
});

const AnalyzeSystemInputSchema = z.object({
  components: z.array(SelectedComponentSchema).describe('A list of selected architectural components and their types.'),
});
export type AnalyzeSystemInput = z.infer<typeof AnalyzeSystemInputSchema>;

const AnalyzeSystemOutputSchema = z.object({
  analysis: z.string().describe('The AI-generated analysis of the system components, explaining interactions, benefits, considerations, and a conceptual sequential flow.'),
});
export type AnalyzeSystemOutput = z.infer<typeof AnalyzeSystemOutputSchema>;

export async function analyzeSystem(input: AnalyzeSystemInput): Promise<AnalyzeSystemOutput> {
  return analyzeSystemFlow(input);
}

const analyzeSystemPrompt = ai.definePrompt({
  name: 'analyzeSystemPrompt',
  input: { schema: AnalyzeSystemInputSchema },
  output: { schema: AnalyzeSystemOutputSchema },
  prompt: `You are an expert system architect. Based on the following selected architectural components and their specific types, provide an analysis.

Your analysis should:
1.  Explain potential positive interactions and synergies between the selected components/types. If only one component is selected, focus on its role and considerations.
2.  Highlight key benefits of using this combination (or single component) for a system.
3.  Mention any important considerations, trade-offs, or potential challenges when implementing these components together (or the single component).
4.  If a logical sequence or data flow can be inferred from the selected components (e.g., from user ingress through to backend processing or data storage), attempt to describe this conceptual flow. For instance, 'User requests might first hit an Anycast IP, then be routed by a Layer-7 Load Balancer to available Rust App Nodes, which then query a sharded Database.' Emphasize this is a conceptual high-level flow.
5.  Structure your response in a clear, informative, and easy-to-understand manner. Keep it concise yet comprehensive. Format the output using markdown for readability (e.g., headings, bullet points).

Selected Components and Types:
{{#if components.length}}
  {{#each components}}
- **{{componentTitle}}**: {{#if selectedTypes.length}}{{#each selectedTypes}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}No specific types selected{{/if}}
  {{/each}}
{{else}}
No components selected. Please describe general good architectural principles.
{{/if}}

For example, if 'Anycast IP (Global Anycast)', 'Load Balancers (Layer-7)', and 'Rust App Nodes (Containerized)' were selected, you might explain how Global Anycast routes users to the nearest regional PoP, where Layer-7 Load Balancers distribute HTTP/S traffic across containerized Rust App Nodes, enabling advanced routing and efficient scaling. Focus on the specific interactions and implications of the *chosen* types.
If no components are selected, provide a general overview of important architectural principles to consider when designing robust systems.
`,
});

const analyzeSystemFlow = ai.defineFlow(
  {
    name: 'analyzeSystemFlow',
    inputSchema: AnalyzeSystemInputSchema,
    outputSchema: AnalyzeSystemOutputSchema,
  },
  async (input) => {
    // If no components are provided, or if the components array is empty,
    // ensure the prompt still gets a valid structure to avoid errors.
    const validatedInput = input.components && input.components.length > 0
      ? input
      : { components: [] };
      
    const { output } = await analyzeSystemPrompt(validatedInput);
    if (!output) {
      throw new Error('AI analysis failed to generate an output.');
    }
    return output;
  }
);

