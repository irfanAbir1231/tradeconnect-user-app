import type { BusinessRequestType } from "@/src/types/business-requests";

export type RequestSubmissionCandidate = {
  title: string;
  description: string;
  categoryId: string | null;
  sourceCountryId: string | null;
  destinationCountryId: string | null;
  locationId: string | null;
  quantityValue: string | null;
  quantityUnit: string | null;
  timeline: string | null;
  requestType: BusinessRequestType;
};

/** The minimum reviewable information for the initial four request types. */
export function requestSubmissionErrors(request: RequestSubmissionCandidate) {
  const errors: Record<string, string> = {};
  if (!request.title.trim()) errors.title = "Provide a clear request title before submitting.";
  if (!request.description.trim()) errors.description = "Describe the business need before submitting.";
  if (!request.categoryId) errors.categoryId = "Select a business category before submitting.";
  if (!request.timeline) errors.timeline = "Provide an expected timeline before submitting.";

  if (request.requestType === "import") {
    if (!request.sourceCountryId) errors.sourceCountryId = "Select the intended source country.";
    if (!request.destinationCountryId) errors.destinationCountryId = "Select the destination country.";
  }
  if (request.requestType === "export" && !request.destinationCountryId) {
    errors.destinationCountryId = "Select at least one primary target country.";
  }
  if (request.requestType === "supply" && !request.locationId) {
    errors.locationId = "Select the relevant supply or delivery location.";
  }
  if (request.requestType !== "technology" && (!request.quantityValue || !request.quantityUnit)) {
    errors.quantityValue = "Provide a quantity and unit before submitting.";
  }
  return errors;
}
