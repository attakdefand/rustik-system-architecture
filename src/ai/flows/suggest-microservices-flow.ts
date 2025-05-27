
'use server';
/**
 * @fileOverview An AI flow to suggest potential microservices based on selected architectural components.
 *
 * - suggestMicroservices - A function that takes selected components and returns a list of suggested microservices.
 * - SuggestMicroservicesInput - The input type (same as AnalyzeSystemInput).
 * - SuggestMicroservicesOutput - The return type, an array of suggested microservices with names and rationales.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { AnalyzeSystemInput } from './analyze-system-flow'; // Reusing the input type

// Input schema is the same as AnalyzeSystemInput, so we reuse it.
export type SuggestMicroservicesInput = AnalyzeSystemInput;

const SuggestedMicroserviceSchema = z.object({
  name: z.string().describe('A concise name for the suggested microservice (e.g., "User Management Service", "Product Catalog Service").'),
  rationale: z.string().describe('A brief (1-2 sentence) explanation of its purpose and how it might relate to the selected infrastructure components or typical application needs.'),
});

const SuggestMicroservicesOutputSchema = z.object({
  suggestedServices: z.array(SuggestedMicroserviceSchema).describe('A list of 3-5 suggested application-level microservices based on the selected architectural components.'),
});

export type SuggestMicroservicesOutput = z.infer<typeof SuggestMicroservicesOutputSchema>;

export async function suggestMicroservices(input: SuggestMicroservicesInput): Promise<SuggestMicroservicesOutput> {
  return suggestMicroservicesFlow(input);
}

const suggestMicroservicesPrompt = ai.definePrompt({
  name: 'suggestMicroservicesPrompt',
  input: { schema: z.custom<SuggestMicroservicesInput>() }, // Using z.custom as AnalyzeSystemInputSchema is not directly exported
  output: { schema: SuggestMicroservicesOutputSchema },
  prompt: `You are an expert system architect specializing in microservice design.
A user is planning a system and has selected the following architectural components and their specific types:

{{#if components.length}}
  {{#each components}}
    {{#unless (eq componentTitle "Microservices Architecture")}}
- **{{componentTitle}}**: {{#if selectedTypes.length}}{{#each selectedTypes}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}No specific types selected{{/if}}
    {{/unless}}
  {{/each}}
{{else}}
No specific infrastructure components selected.
{{/if}}

The user has also indicated they are adopting a 'Microservices Architecture' approach.

Based on their *selected infrastructure components* (listed above, explicitly excluding the 'Microservices Architecture' meta-component itself from consideration as an infrastructure piece for *this* specific task), suggest 3-5 logical, application-level microservices that would typically be built on top of, or interact with, such infrastructure.

For each suggested microservice:
1.  Provide a concise name (e.g., "User Management Service", "Product Catalog Service", "Order Processing Service", "Notification Service", "Inventory Management Service").
2.  Provide a brief (1-2 sentence) rationale explaining its purpose and how it might relate to the selected infrastructure components or typical application needs. For example, if a 'Database Strategy' like 'Relational DB' is chosen, a 'User Management Service' might use it to store user profiles.

**Important Constraints:**
-   Do NOT suggest infrastructure services like "Logging Service," "Monitoring Service," or "Authentication Service" if similar concepts are already covered by the user's selections (e.g., "Observability & Ops," "API Gateway," "Security Architecture Principles"). Focus on distinct business/application capabilities.
-   The output must be an array of objects, each with a 'name' and 'rationale' for the microservice, under a top-level key 'suggestedServices'.

Example of a good suggestion if 'Database Strategies (Relational DB)' and 'Caching Strategies (Distributed Cache)' were selected:
-   Name: "User Profile Service"
-   Rationale: "Manages user data, including profiles and preferences, likely storing primary data in the selected Relational DB and using the Distributed Cache for frequently accessed profiles to improve read performance."

If no relevant infrastructure components are selected (other than "Microservices Architecture" itself), you can state that more context is needed to suggest specific microservices.
`,
});

const suggestMicroservicesFlow = ai.defineFlow(
  {
    name: 'suggestMicroservicesFlow',
    inputSchema: z.custom<SuggestMicroservicesInput>(),
    outputSchema: SuggestMicroservicesOutputSchema,
  },
  async (input) => {
    // Filter out the "Microservices Architecture" component itself from being passed to the prompt's main list,
    // as the prompt is about suggesting services based on *other* infrastructure.
    const infrastructureComponents = input.components.filter(
      c => c.componentTitle !== "Microservices Architecture"
    );

    if (infrastructureComponents.length === 0) {
      return {
        suggestedServices: [
          {
            name: "Context Needed",
            rationale: "Please select some infrastructure components (like Database Strategies, API Gateway, etc.) in addition to 'Microservices Architecture' to get relevant microservice suggestions."
          }
        ]
      };
    }
    
    const { output } = await suggestMicroservicesPrompt({ components: infrastructureComponents });
    if (!output || !output.suggestedServices) {
      // console.error('AI microservice suggestion failed to generate a valid output structure.', output);
      throw new Error('AI microservice suggestion failed to generate a valid output.');
    }
    return output;
  }
);

