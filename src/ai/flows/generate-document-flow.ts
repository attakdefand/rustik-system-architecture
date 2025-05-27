
'use server';
/**
 * @fileOverview An AI flow to generate a conceptual architectural document based on selected components
 * and their pre-computed AI analyses.
 *
 * - generateDocument - A function that takes analyses data and returns a markdown document.
 * - GenerateDocumentFromAnalysesInput - The input type for the generateDocument function.
 * - GenerateDocumentOutput - The return type, a markdown string.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { AnalyzeSystemInput, AnalyzeSystemOutput } from './analyze-system-flow';
import type { AnalyzeCapacityOutput } from './analyze-capacity-flow';
import type { SuggestCapacityTierOutput } from './suggest-capacity-tier-flow';
import type { AnalyzeSecurityPostureOutput } from './analyze-security-posture-flow';
import type { SuggestMicroservicesOutput } from './suggest-microservices-flow';

const GenerateDocumentFromAnalysesInputSchema = z.object({
  selectedComponents: z.custom<AnalyzeSystemInput>().describe("The user's original component and type selections."),
  interactionAnalysis: z.custom<AnalyzeSystemOutput | null>().optional().describe("The result of the interaction analysis flow."),
  capacityAnalysis: z.custom<AnalyzeCapacityOutput | null>().optional().describe("The result of the capacity potential analysis flow."),
  tierSuggestion: z.custom<SuggestCapacityTierOutput | null>().optional().describe("The result of the capacity tier suggestion flow."),
  securityPostureAnalysis: z.custom<AnalyzeSecurityPostureOutput | null>().optional().describe("The result of the security posture analysis flow."),
  microserviceSuggestions: z.custom<SuggestMicroservicesOutput | null>().optional().describe("The result of the microservice suggestion flow (if applicable).")
});

export type GenerateDocumentFromAnalysesInput = z.infer<typeof GenerateDocumentFromAnalysesInputSchema>;

const GenerateDocumentOutputSchema = z.object({
  markdownDocument: z.string().describe('A comprehensive conceptual architectural document in Markdown format, summarizing the selected components and the results of various AI analyses.'),
});
export type GenerateDocumentOutput = z.infer<typeof GenerateDocumentOutputSchema>;

export async function generateDocument(input: GenerateDocumentFromAnalysesInput): Promise<GenerateDocumentOutput> {
  return generateDocumentFlow(input);
}

const generateDocumentPrompt = ai.definePrompt({
  name: 'generateDocumentSynthesizerPrompt',
  input: { schema: GenerateDocumentFromAnalysesInputSchema },
  output: { schema: GenerateDocumentOutputSchema },
  prompt: `You are an AI technical writer tasked with synthesizing a conceptual architectural overview document in Markdown format.
The document should be based on the user's selected architectural components and various pre-computed AI analyses.

**User's Selected Architectural Blueprint:**
{{#if selectedComponents.components.length}}
  {{#each selectedComponents.components}}
- **{{componentTitle}}**: {{#if selectedTypes.length}}{{#each selectedTypes}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}No specific types selected{{/if}}
  {{/each}}
{{else}}
No components were selected.
{{/if}}

Please structure the Markdown document with the following sections, using the provided analysis data for each. If a particular analysis is not available (null or empty), state that clearly or omit the section gracefully.

1.  **Introduction**:
    *   Briefly introduce the purpose of this conceptual document as an AI-generated overview of a potential system architecture based on user selections.

2.  **Selected Architectural Blueprint**:
    *   List the user-selected components and their chosen types (already shown above, reiterate here for document completeness).

3.  **Conceptual Interactions & Synergies**:
    *   Use the content from \`interactionAnalysis.analysis\`.
    *   Summarize the potential positive interactions, benefits, and key considerations for how these components might work together. Include the conceptual data flow if described.
    {{#if interactionAnalysis.analysis}}
{{{interactionAnalysis.analysis}}}
    {{else}}
_Interaction analysis was not available or did not yield results._
    {{/if}}

4.  **Conceptual Scaling & Capacity Insights**:
    *   Use content from \`capacityAnalysis.analysis\` for general scaling factors and bottlenecks.
    *   Use content from \`tierSuggestion\` for the suggested tier, reasoning, strengths, next-tier considerations, and key assumptions.
    {{#if capacityAnalysis.analysis}}
**General Scaling Factors & Bottlenecks:**
{{{capacityAnalysis.analysis}}}
    {{else}}
_General scaling potential analysis was not available._
    {{/if}}

    {{#if tierSuggestion.suggestedTier}}
**Suggested User Capacity Tier:** {{tierSuggestion.suggestedTier}}

**Reasoning:**
{{{tierSuggestion.reasoning}}}

**Key Strengths Supporting This Tier:**
      {{#each tierSuggestion.keyStrengthsForTier}}
- {{{this}}}
      {{/each}}

**Key Assumptions Made:**
      {{#if tierSuggestion.keyAssumptions.length}}
        {{#each tierSuggestion.keyAssumptions}}
- {{{this}}}
        {{/each}}
      {{else}}
- No specific assumptions listed by the AI.
      {{/if}}

**Considerations for Next Capacity Tier:**
      {{#each tierSuggestion.considerationsForNextTier}}
- {{{this}}}
      {{/each}}
    {{else}}
_Capacity tier suggestion was not available._
    {{/if}}
    *   Emphasize this is a conceptual estimate.

5.  **Conceptual Security Posture**:
    *   Use content from \`securityPostureAnalysis\`.
    *   Present the \`overallConceptualAssessment\`.
    *   List \`positiveSecurityAspects\`, \`potentialVulnerabilitiesOrConcerns\`, and \`keySecurityRecommendations\`.
    {{#if securityPostureAnalysis.overallConceptualAssessment}}
**Overall Conceptual Assessment:** {{securityPostureAnalysis.overallConceptualAssessment}}

**Positive Security Aspects:**
      {{#each securityPostureAnalysis.positiveSecurityAspects}}
- {{{this}}}
      {{/each}}

**Potential Vulnerabilities or Concerns:**
      {{#each securityPostureAnalysis.potentialVulnerabilitiesOrConcerns}}
- {{{this}}}
      {{/each}}

**Key Security Recommendations:**
      {{#each securityPostureAnalysis.keySecurityRecommendations}}
- {{{this}}}
      {{/each}}
    {{else}}
_Security posture analysis was not available._
    {{/if}}

6.  **AI-Suggested Potential Microservices (If Applicable)**:
    *   Use content from \`microserviceSuggestions.suggestedServices\`.
    *   If "Microservices Architecture" was among the selected components and suggestions were generated, list the suggested microservices and their rationales.
    {{#if microserviceSuggestions.suggestedServices.length}}
      {{#if (ne (lookup microserviceSuggestions.suggestedServices 0 'name') "Context Needed")}}
**Suggested Microservices:**
        {{#each microserviceSuggestions.suggestedServices}}
- **{{name}}**: {{rationale}}
        {{/each}}
      {{else}}
_Microservice suggestions were not applicable or required more context for the current selection._
      {{/if}}
    {{else}}
_Microservice suggestion analysis was not attempted or did not yield results._
    {{/if}}

7.  **Concluding Summary**:
    *   Provide a brief wrap-up, reiterating the conceptual nature of the document and its purpose as an aid for architectural exploration and learning. Mention that real-world system design requires deep expertise, rigorous testing, and detailed planning beyond this conceptual overview.

**Important Guidelines:**
-   The entire output must be a single Markdown string.
-   Use appropriate Markdown formatting (headings, subheadings, lists, bold text) for readability.
-   Be clear, concise, and informative.
-   The tone should be that of an expert system architect providing a high-level conceptual overview.
-   If no components were selected initially, the document should reflect this, stating that selections are needed to generate a meaningful architectural overview.

Generate the document now.
`,
});

const generateDocumentFlow = ai.defineFlow(
  {
    name: 'generateDocumentFlow',
    inputSchema: GenerateDocumentFromAnalysesInputSchema,
    outputSchema: GenerateDocumentOutputSchema,
  },
  async (input) => {
    // Basic validation: if no initial selections, return a placeholder.
    if (!input.selectedComponents || !input.selectedComponents.components || input.selectedComponents.components.length === 0) {
      return {
        markdownDocument: `
# Conceptual Architectural Overview

No architectural components were selected. Please make selections in the Master-Flow to generate a document.

This document is intended to provide an AI-generated conceptual overview based on user selections. Since no selections were made, a detailed analysis cannot be provided.
        `,
      };
    }
    
    const { output } = await generateDocumentPrompt(input);
    if (!output) {
      throw new Error('AI document generation failed to produce an output.');
    }
    return output;
  }
);

