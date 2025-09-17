'use server';

/**
 * @fileOverview Generates a preliminary verification report based on the citizen's issue report.
 *
 * - generateIssueVerificationReport - A function that generates the report.
 * - IssueVerificationReportInput - The input type for the generateIssueVerificationReport function.
 * - IssueVerificationReportOutput - The return type for the generateIssueVerificationReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IssueVerificationReportInputSchema = z.object({
  issueReport: z.string().describe('The detailed issue report submitted by the citizen.'),
  issuePhotoDataUri: z
    .string()
    .optional()
    .describe(
      "A photo of the issue, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type IssueVerificationReportInput = z.infer<typeof IssueVerificationReportInputSchema>;

const IssueVerificationReportOutputSchema = z.object({
  report: z.string().describe('The preliminary verification report highlighting key areas for technical review.'),
  confirmationNeeded: z.array(z.string()).describe('Array of fields that need confirmation by the user.'),
});
export type IssueVerificationReportOutput = z.infer<typeof IssueVerificationReportOutputSchema>;

export async function generateIssueVerificationReport(
  input: IssueVerificationReportInput
): Promise<IssueVerificationReportOutput> {
  return issueVerificationReportFlow(input);
}

const issueVerificationReportPrompt = ai.definePrompt({
  name: 'issueVerificationReportPrompt',
  input: {schema: IssueVerificationReportInputSchema},
  output: {schema: IssueVerificationReportOutputSchema},
  prompt: `You are an AI assistant helping engineers to verify citizen issue reports.
  Based on the citizen's issue report, generate a preliminary verification report that highlights key areas that need technical review.
  Also, determine if any fields from the original report need explicit confirmation by the engineer due to ambiguity or potential inaccuracy.

  Issue Report: {{{issueReport}}}
  {{#if issuePhotoDataUri}}
  Photo: {{media url=issuePhotoDataUri}}
  {{/if}}

  Format the verification report clearly and concisely. The report should include sections for:
    - Issue Summary: A brief summary of the reported issue.
    - Key Areas for Review: Specific aspects of the issue that require technical assessment.
    - Preliminary Assessment: Your initial assessment based on the provided information.

  The output should be a JSON object containing:
    - report: The generated verification report.
    - confirmationNeeded: An array of strings listing the fields that need confirmation.
  `,
});

const issueVerificationReportFlow = ai.defineFlow(
  {
    name: 'issueVerificationReportFlow',
    inputSchema: IssueVerificationReportInputSchema,
    outputSchema: IssueVerificationReportOutputSchema,
  },
  async input => {
    const {output} = await issueVerificationReportPrompt(input);
    return output!;
  }
);
