
'use server';
/**
 * @fileOverview An AI flow to generate a conceptual architectural document based on selected components.
 *
 * - generateDocument - A function that takes selected components and returns a markdown document.
 * - GenerateDocumentInput - The input type (same as AnalyzeSystemInput).
 * - GenerateDocumentOutput - The return type, a markdown string.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { AnalyzeSystemInput } from './analyze-system-flow'; // Reusing the input type

export type GenerateDocumentInput = AnalyzeSystemInput;

const GenerateDocumentOutputSchema = z.object({
  markdownDocument: z.string().describe('A comprehensive conceptual architectural document in Markdown format, summarizing the selected components, their interactions, scaling, security, and potential microservices.'),
});
export type GenerateDocumentOutput = z.infer<typeof GenerateDocumentOutputSchema>;

export async function generateDocument(input: GenerateDocumentInput): Promise<GenerateDocumentOutput> {
  return generateDocumentFlow(input);
}

const generateDocumentPrompt = ai.definePrompt({
  name: 'generateDocumentPrompt',
  input: { schema: z.custom<GenerateDocumentInput>() },
  output: { schema: GenerateDocumentOutputSchema },
  prompt: `You are an AI technical writer tasked with generating a conceptual architectural overview document in Markdown format.
The document should be based on the following user-selected architectural components and their specific types:

{{#if components.length}}
  {{#each components}}
- **{{componentTitle}}**: {{#if selectedTypes.length}}{{#each selectedTypes}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}No specific types selected{{/if}}
  {{/each}}
{{else}}
No components were selected.
{{/if}}

Please structure the Markdown document with the following sections:

1.  **Introduction**: Briefly introduce the purpose of this conceptual document.
2.  **Selected Architectural Blueprint**: List the user-selected components and their chosen types.
3.  **Conceptual Interactions & Synergies**: Discuss potential positive interactions, benefits, and key considerations for how these components might work together.
4.  **Scaling & Capacity Insights**: Provide a high-level analysis of the conceptual scaling potential of this combination. Include a suggested qualitative user capacity tier (e.g., "Suitable for X to Y users," "Foundational for Z+ users") and the reasoning. Emphasize this is a conceptual estimate.
5.  **Conceptual Security Posture**: Offer a brief overview of the security aspects, including potential strengths, vulnerabilities to consider (mentioning common web risks like OWASP Top 10 where relevant), and key recommendations.
6.  **Suggested Microservices (If Applicable)**: If "Microservices Architecture" is among the selected components along with other relevant infrastructure (like databases, API gateways), suggest 3-5 logical application-level microservices that would typically be built, explaining their rationale. If not applicable, this section can be omitted or state that it's not applicable.
7.  **Concluding Summary**: Provide a brief wrap-up, reiterating the conceptual nature of the document and its purpose as an aid for architectural exploration.

**Important Guidelines:**
-   The entire output must be a single Markdown string.
-   Use appropriate Markdown formatting (headings, subheadings, lists, bold text) for readability.
-   Be clear, concise, and informative.
-   The tone should be that of an expert system architect providing a high-level conceptual overview.
-   If no components were selected, the document should reflect this, perhaps suggesting the user make selections.

Generate the document now.
`,
});

const generateDocumentFlow = ai.defineFlow(
  {
    name: 'generateDocumentFlow',
    inputSchema: z.custom<GenerateDocumentInput>(),
    outputSchema: GenerateDocumentOutputSchema,
  },
  async (input) => {
    const validatedInput = input.components && input.components.length > 0
      ? input
      : { components: [] };

    const { output } = await generateDocumentPrompt(validatedInput);
    if (!output) {
      throw new Error('AI document generation failed to produce an output.');
    }
    return output;
  }
);
