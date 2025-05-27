
'use server';
/**
 * @fileOverview An AI flow to analyze the conceptual security posture of selected architectural components.
 *
 * - analyzeSecurityPosture - A function that takes selected components and returns an AI-generated security analysis.
 * - AnalyzeSecurityPostureInput - The input type for the analyzeSecurityPosture function (same as AnalyzeSystemInput).
 * - AnalyzeSecurityPostureOutput - The return type for the analyzeSecurityPosture function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { AnalyzeSystemInput } from './analyze-system-flow'; // Reusing the input type

// Input schema is the same as AnalyzeSystemInput, so we reuse it.
export type AnalyzeSecurityPostureInput = AnalyzeSystemInput;

const AnalyzeSecurityPostureOutputSchema = z.object({
  positiveSecurityAspects: z.array(z.string()).describe(
    'A list of positive security aspects or strengths derived from the selected components.'
  ),
  potentialVulnerabilitiesOrConcerns: z.array(z.string()).describe(
    'A list of potential vulnerabilities, misconfiguration risks, or security concerns associated with the selected components or their interactions. Consider common web application risks (e.g., OWASP Top 10 categories like Injection, Broken Access Control, etc.) where relevant to the architecture.'
  ),
  keySecurityRecommendations: z.array(z.string()).describe(
    'A list of 2-4 key actionable security recommendations for the selected architectural setup. These should aim to mitigate identified concerns and promote best practices.'
  ),
  overallConceptualAssessment: z.string().describe(
    'A brief, high-level qualitative summary of the conceptual security posture. This is not a formal audit.'
  ),
});
export type AnalyzeSecurityPostureOutput = z.infer<typeof AnalyzeSecurityPostureOutputSchema>;

export async function analyzeSecurityPosture(input: AnalyzeSecurityPostureInput): Promise<AnalyzeSecurityPostureOutput> {
  return analyzeSecurityPostureFlow(input);
}

const analyzeSecurityPosturePrompt = ai.definePrompt({
  name: 'analyzeSecurityPosturePrompt',
  input: { schema: z.custom<AnalyzeSecurityPostureInput>() },
  output: { schema: AnalyzeSecurityPostureOutputSchema },
  prompt: `You are an expert system security architect specializing in reviewing cloud-native and distributed systems.
A user has selected the following architectural components and their specific types:

{{#if components.length}}
  {{#each components}}
- **{{componentTitle}}**: {{#if selectedTypes.length}}{{#each selectedTypes}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}No specific types selected{{/if}}
  {{/each}}
{{else}}
No components selected. Please describe general principles for securing distributed systems.
{{/if}}

Based on this selection, provide a conceptual security posture analysis. Your response MUST include:
1.  **positiveSecurityAspects**: List 2-3 inherent security strengths or positive contributions to security that these components (and their types) offer. For example, "Anycast IP can help mitigate DDoS attacks by distributing traffic."
2.  **potentialVulnerabilitiesOrConcerns**: List 2-4 potential vulnerabilities, common misconfiguration risks, or security concerns specifically related to the chosen components or how they might interact. For example, "If Layer-7 Load Balancer rules are too permissive, they might expose internal services not intended for public access." or "Lack of robust IAM policies for cloud-native LBs could lead to unauthorized administrative access." Consider how the selected architecture might be susceptible to, or help defend against, common web application vulnerabilities like those in the OWASP Top 10 (e.g., Injection, Broken Access Control, Security Misconfiguration, Cryptographic Failures).
3.  **keySecurityRecommendations**: Provide 2-4 high-level, actionable security recommendations pertinent to this architectural setup. Focus on best practices. For example, "Implement strict network segmentation and firewall rules between all component layers." or "Ensure end-to-end encryption for all data in transit, even between internal services."
4.  **overallConceptualAssessment**: A brief (1-2 sentences) qualitative summary of the conceptual security posture. This should clearly state that it's a high-level conceptual analysis and not a formal security audit or penetration test result.

**Output Format Guidance:**
- Ensure the output strictly adheres to the AnalyzeSecurityPostureOutputSchema.
- Provide insights in clear, accessible language. Use markdown where appropriate within string array elements if needed, but the main fields are arrays of strings or a single string.

If no components are selected, the \`overallConceptualAssessment\` should state that selections are needed, and other fields can be empty or provide general advice on securing distributed systems.
`,
});

const analyzeSecurityPostureFlow = ai.defineFlow(
  {
    name: 'analyzeSecurityPostureFlow',
    inputSchema: z.custom<AnalyzeSecurityPostureInput>(),
    outputSchema: AnalyzeSecurityPostureOutputSchema,
  },
  async (input) => {
    const validatedInput = input.components && input.components.length > 0
      ? input
      : { components: [] };

    if (validatedInput.components.length === 0) {
      return {
        positiveSecurityAspects: [
          "General Principle: Implement Defense in Depth by layering multiple security controls.",
          "General Principle: Adhere to the Principle of Least Privilege for all access.",
        ],
        potentialVulnerabilitiesOrConcerns: [
          "General Concern: Insufficient network segmentation can increase blast radius.",
          "General Concern: Lack of regular patching and vulnerability management.",
          "General Consideration: Always be mindful of common web vulnerabilities like the OWASP Top 10.",
        ],
        keySecurityRecommendations: [
          "Recommendation: Implement strong identity and access management (IAM) policies.",
          "Recommendation: Ensure comprehensive logging and monitoring for security events.",
          "Recommendation: Encrypt all sensitive data, both in transit and at rest.",
          "Recommendation: Regularly assess and test for OWASP Top 10 vulnerabilities."
        ],
        overallConceptualAssessment: "No components selected. The above are general security principles. Select components for a specific analysis. This is a high-level conceptual analysis, not a formal security audit.",
      };
    }
    
    const { output } = await analyzeSecurityPosturePrompt(validatedInput);
    if (!output) {
      throw new Error('AI security posture analysis failed to generate an output.');
    }
    return output;
  }
);

