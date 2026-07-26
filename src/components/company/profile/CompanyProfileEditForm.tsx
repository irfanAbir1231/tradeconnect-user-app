"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { loadDistricts, loadDivisions, loadUpazilas } from "@/src/lib/reference-data-client";
import { resetLocationForCountry, resetLocationForDistrict, resetLocationForDivision, type LocationSelection, type ReferenceOption } from "@/src/types/company-onboarding";
import { locationSelectionFromPrimaryLocation, type CompanyEditFormProps } from "@/src/types/company-profile";

type Values = {
  legalName: string;
  displayName: string;
  businessType: string;
  foundedYear: string;
  employeeRange: string;
  description: string;
  primaryProducts: string;
  businessEmail: string;
  businessPhone: string;
  website: string;
  addressLine1: string;
  addressLine2: string;
  registrationNumber: string;
  tradeLicenseNumber: string;
  taxVatNumber: string;
  categoryId: string;
};

type ApiError = { error?: { message?: string; code?: string; fields?: Record<string, string> } };

const inputClass = "mt-1.5 w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2.5 text-sm text-[var(--navy)] outline-none transition focus:border-[var(--accent-deep)] focus:ring-2 focus:ring-[var(--accent-soft)] disabled:cursor-not-allowed disabled:bg-[var(--surface)]";
const businessTypes = ["importer", "exporter", "supplier", "manufacturer", "technology_provider", "service_provider"];
const employeeRanges = ["1-10", "11-50", "51-200", "201-500", "501+"];

function normalized(value: string) {
  return value.trim();
}

function optionalValue(value: string) {
  const next = normalized(value);
  return next || null;
}

function labelFor(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function primaryLocationId(selection: LocationSelection) {
  return selection.upazilaId || selection.districtId || selection.divisionId || null;
}

function initialValues({ company }: CompanyEditFormProps): Values {
  return {
    legalName: company.legalName,
    displayName: company.displayName,
    businessType: company.businessType,
    foundedYear: company.profile.foundedYear?.toString() ?? "",
    employeeRange: company.profile.employeeRange ?? "",
    description: company.profile.description ?? "",
    primaryProducts: company.profile.primaryProducts ?? "",
    businessEmail: company.contact.businessEmail ?? "",
    businessPhone: company.contact.businessPhone ?? "",
    website: company.profile.website ?? "",
    addressLine1: company.profile.addressLine1 ?? "",
    addressLine2: company.profile.addressLine2 ?? "",
    registrationNumber: company.registration.registrationNumber ?? "",
    tradeLicenseNumber: company.registration.tradeLicenseNumber ?? "",
    taxVatNumber: company.registration.taxVatNumber ?? "",
    categoryId: company.categories.find((category) => category.isPrimary)?.id ?? "",
  };
}

export function CompanyProfileEditForm({ company, categories, countries }: CompanyEditFormProps) {
  const router = useRouter();
  const initial = useMemo(() => initialValues({ company, categories, countries }), [company, categories, countries]);
  const initialLocation = useMemo(() => locationSelectionFromPrimaryLocation(company.primaryLocation, company.registration.country?.id ?? ""), [company]);
  const [values, setValues] = useState<Values>(initial);
  const [location, setLocation] = useState<LocationSelection>(initialLocation);
  const [divisions, setDivisions] = useState<ReferenceOption[]>([]);
  const [districts, setDistricts] = useState<ReferenceOption[]>([]);
  const [upazilas, setUpazilas] = useState<ReferenceOption[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [reloadRequired, setReloadRequired] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const errorSummary = useRef<HTMLDivElement>(null);
  const divisionRequest = useRef(0);
  const districtRequest = useRef(0);
  const upazilaRequest = useRef(0);

  function setValue<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  }

  function validate() {
    const next: Record<string, string> = {};
    if (!normalized(values.legalName)) next.legalName = "Legal company name is required.";
    if (!normalized(values.displayName)) next.displayName = "Trading or display name is required.";
    if (!values.businessType) next.businessType = "Select a company type.";
    if (!normalized(values.businessEmail)) next.businessEmail = "Business email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized(values.businessEmail))) next.businessEmail = "Enter a valid business email.";
    if (!location.countryId) next.registrationCountryId = "Select a registration country.";
    if (values.foundedYear && (!/^\d{4}$/.test(values.foundedYear) || Number(values.foundedYear) < 1800 || Number(values.foundedYear) > new Date().getFullYear())) next.foundedYear = "Enter a valid founding year.";
    setErrors(next);
    if (Object.keys(next).length > 0) {
      requestAnimationFrame(() => errorSummary.current?.focus());
      return false;
    }
    return true;
  }

  useEffect(() => {
    if (!location.countryId) return;
    const controller = new AbortController();
    const requestId = ++divisionRequest.current;
    void loadDivisions(location.countryId, controller.signal).then((items) => {
      if (requestId === divisionRequest.current) setDivisions(items);
    }).catch(() => {
      if (!controller.signal.aborted) setFormError("Locations are temporarily unavailable. Try again shortly.");
    });
    return () => controller.abort();
  }, [location.countryId]);

  useEffect(() => {
    if (!location.divisionId) return;
    const controller = new AbortController();
    const requestId = ++districtRequest.current;
    void loadDistricts(location.divisionId, controller.signal).then((items) => {
      if (requestId === districtRequest.current) setDistricts(items);
    }).catch(() => {
      if (!controller.signal.aborted) setFormError("Districts are temporarily unavailable. Try again shortly.");
    });
    return () => controller.abort();
  }, [location.divisionId]);

  useEffect(() => {
    if (!location.districtId) return;
    const controller = new AbortController();
    const requestId = ++upazilaRequest.current;
    void loadUpazilas(location.districtId, controller.signal).then((items) => {
      if (requestId === upazilaRequest.current) setUpazilas(items);
    }).catch(() => {
      if (!controller.signal.aborted) setFormError("Upazilas are temporarily unavailable. Try again shortly.");
    });
    return () => controller.abort();
  }, [location.districtId]);

  function buildPayload() {
    const payload: Record<string, unknown> = { version: company.version };
    const assignText = (key: keyof Values, allowEmpty = true) => {
      const next = allowEmpty ? optionalValue(values[key]) : normalized(values[key]);
      const previous = allowEmpty ? optionalValue(initial[key]) : normalized(initial[key]);
      if (next !== previous) payload[key] = next;
    };

    assignText("legalName", false);
    assignText("displayName", false);
    if (values.businessType !== initial.businessType) payload.businessType = values.businessType;
    assignText("businessEmail", false);
    assignText("businessPhone");
    assignText("description");
    assignText("website");
    assignText("primaryProducts");
    assignText("addressLine1");
    assignText("addressLine2");
    assignText("registrationNumber");
    assignText("tradeLicenseNumber");
    assignText("taxVatNumber");
    assignText("employeeRange");

    const nextYear = values.foundedYear ? Number(values.foundedYear) : null;
    if (nextYear !== company.profile.foundedYear) payload.foundedYear = nextYear;
    if (location.countryId !== (company.registration.country?.id ?? "")) payload.registrationCountryId = location.countryId;
    if (primaryLocationId(location) !== company.primaryLocation?.id) payload.primaryLocationId = primaryLocationId(location);
    if (values.categoryId !== initial.categoryId) {
      payload.categoryIds = [values.categoryId];
      payload.primaryCategoryId = values.categoryId;
    }

    return payload;
  }

  async function submit() {
    if (isSubmitting || !validate()) return;
    const payload = buildPayload();
    if (Object.keys(payload).length === 1) {
      setFormError("There are no changes to save.");
      requestAnimationFrame(() => errorSummary.current?.focus());
      return;
    }

    setIsSubmitting(true);
    setFormError("");
    setReloadRequired(false);
    try {
      const response = await fetch(`/api/v1/companies/${company.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "X-Request-ID": crypto.randomUUID() },
        body: JSON.stringify(payload),
      });
      const body = await response.json() as ApiError;
      if (!response.ok) {
        if (response.status === 401) {
          router.replace("/login?next=/dashboard/company/edit");
          return;
        }
        const code = body.error?.code;
        setErrors(body.error?.fields ?? {});
        if (code === "FORBIDDEN" || code === "COMPANY_UPDATE_FORBIDDEN") setFormError("You no longer have permission to edit this company profile.");
        else if (code === "NOT_FOUND" || code === "COMPANY_NOT_FOUND") setFormError("This company profile is no longer available. Return to your company workspace.");
        else if (code === "COMPANY_VERSION_CONFLICT") {
          setFormError("This profile was updated somewhere else. Your changes were not saved.");
          setReloadRequired(true);
        } else if (code === "CONFLICT" || code === "COMPANY_REGISTRATION_CONFLICT") setFormError("This profile changed or conflicts with an existing record. Refresh and review the saved details.");
        else if (code === "CATEGORY_NOT_FOUND") setFormError("The selected category is no longer available. Please choose another category.");
        else if (code === "LOCATION_NOT_FOUND" || code === "INVALID_LOCATION_HIERARCHY") {
          setLocation((current) => resetLocationForCountry(current.countryId));
          setFormError("The selected location is no longer available. Please select it again.");
        } else setFormError(body.error?.message ?? "We could not save your company profile. Please try again.");
        requestAnimationFrame(() => errorSummary.current?.focus());
        return;
      }
      router.replace("/dashboard/company?updated=1");
      router.refresh();
    } catch {
      setFormError("We could not save your company profile. Check your connection and try again.");
      requestAnimationFrame(() => errorSummary.current?.focus());
    } finally {
      setIsSubmitting(false);
    }
  }

  const fieldError = (key: string) => errors[key] ? <span className="mt-1 block text-xs font-medium text-[#9e3c32]" id={`${key}-error`}>{errors[key]}</span> : null;
  const describedBy = (key: string, hint?: boolean) => [hint ? `${key}-hint` : "", errors[key] ? `${key}-error` : ""].filter(Boolean).join(" ") || undefined;
  const field = (label: string, key: keyof Values, options?: { type?: string; hint?: string; textarea?: boolean; required?: boolean }) => <label className="block text-sm font-semibold text-[var(--navy)]" htmlFor={key}>{label}{options?.required ? <span aria-hidden="true"> *</span> : null}{options?.textarea ? <textarea aria-describedby={describedBy(key, Boolean(options.hint))} className={`${inputClass} min-h-28`} id={key} maxLength={key === "description" ? 4000 : 2000} onChange={(event) => setValue(key, event.target.value)} value={values[key]} /> : <input aria-describedby={describedBy(key, Boolean(options?.hint))} className={inputClass} id={key} maxLength={key === "description" ? 4000 : 240} onChange={(event) => setValue(key, event.target.value)} type={options?.type ?? "text"} value={values[key]} />}{options?.hint ? <span className="mt-1 block text-xs font-normal text-[var(--muted)]" id={`${key}-hint`}>{options.hint}</span> : null}{fieldError(key)}</label>;

  return <form className="mx-auto max-w-4xl space-y-6" onSubmit={(event) => { event.preventDefault(); void submit(); }}>
    {(formError || Object.values(errors).some(Boolean)) ? <div aria-live="assertive" className="rounded-xl border border-[#edc7c2] bg-[#fff3f1] p-4 text-sm text-[#9e3c32]" ref={errorSummary} tabIndex={-1}><p>{formError || "Please correct the highlighted fields before saving."}</p>{reloadRequired ? <button className="mt-3 rounded-lg border border-[#9e3c32] px-3 py-2 text-sm font-semibold hover:bg-[#fbe3df] focus:outline-none focus:ring-2 focus:ring-[#9e3c32] focus:ring-offset-2" onClick={() => window.location.reload()} type="button">Reload latest profile</button> : null}</div> : null}
    <section className="rounded-2xl border border-[var(--line)] bg-white p-5 sm:p-7"><p className="eyebrow">Basic information</p><h2 className="mt-2 text-xl font-semibold text-[var(--navy)]">Company identity</h2><div className="mt-6 grid gap-5 sm:grid-cols-2">{field("Legal company name", "legalName", { required: true })}{field("Trading or display name", "displayName", { required: true })}<label className="block text-sm font-semibold text-[var(--navy)]" htmlFor="businessType">Company type *<select aria-describedby={describedBy("businessType")} className={inputClass} id="businessType" onChange={(event) => setValue("businessType", event.target.value)} value={values.businessType}><option value="">Select company type</option>{businessTypes.map((type) => <option key={type} value={type}>{labelFor(type)}</option>)}</select>{fieldError("businessType")}</label>{field("Year established", "foundedYear", { type: "number", hint: "Optional. Use a four-digit year." })}<label className="block text-sm font-semibold text-[var(--navy)]" htmlFor="employeeRange">Employee range<select className={inputClass} id="employeeRange" onChange={(event) => setValue("employeeRange", event.target.value)} value={values.employeeRange}><option value="">Not provided</option>{employeeRanges.map((range) => <option key={range} value={range}>{range} employees</option>)}</select></label></div>{field("Business description", "description", { textarea: true, hint: "Describe what your company does. This remains private until a later public-profile phase." })}</section>

    <section className="rounded-2xl border border-[var(--line)] bg-white p-5 sm:p-7"><p className="eyebrow">Business classification</p><h2 className="mt-2 text-xl font-semibold text-[var(--navy)]">Category and products</h2><div className="mt-6 grid gap-5 sm:grid-cols-2"><label className="block text-sm font-semibold text-[var(--navy)]" htmlFor="categoryId">Primary business category<select aria-describedby={describedBy("categoryId")} className={inputClass} id="categoryId" onChange={(event) => setValue("categoryId", event.target.value)} value={values.categoryId}><option value="">Select a category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select>{fieldError("categoryId")}</label>{field("Products or services", "primaryProducts", { hint: "Optional. Add a concise summary of your main offerings." })}</div></section>

    <section className="rounded-2xl border border-[var(--line)] bg-white p-5 sm:p-7"><p className="eyebrow">Contact information</p><h2 className="mt-2 text-xl font-semibold text-[var(--navy)]">Business contact details</h2><div className="mt-6 grid gap-5 sm:grid-cols-2">{field("Business email", "businessEmail", { type: "email", required: true })}{field("Business phone", "businessPhone", { hint: "Optional. Include a country code when possible." })}{field("Website", "website", { type: "url", hint: "Optional. Use an http or https URL." })}</div></section>

    <section className="rounded-2xl border border-[var(--line)] bg-white p-5 sm:p-7"><p className="eyebrow">Location</p><h2 className="mt-2 text-xl font-semibold text-[var(--navy)]">Registered business location</h2><div className="mt-6 grid gap-5 sm:grid-cols-2"><label className="block text-sm font-semibold text-[var(--navy)]" htmlFor="registrationCountryId">Registration country *<select aria-describedby={describedBy("registrationCountryId")} className={inputClass} id="registrationCountryId" onChange={(event) => { setDivisions([]); setDistricts([]); setUpazilas([]); setLocation(resetLocationForCountry(event.target.value)); }} value={location.countryId}><option value="">Select country</option>{countries.map((country) => <option key={country.id} value={country.id}>{country.name}</option>)}</select>{fieldError("registrationCountryId")}</label></div>{location.countryId && countries.find((country) => country.id === location.countryId)?.name === "Bangladesh" ? <div className="mt-5 grid gap-5 sm:grid-cols-3"><label className="block text-sm font-semibold text-[var(--navy)]" htmlFor="divisionId">Division<select className={inputClass} id="divisionId" onChange={(event) => { setDistricts([]); setUpazilas([]); setLocation((current) => resetLocationForDivision(current, event.target.value)); }} value={location.divisionId}><option value="">Select division</option>{divisions.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label className="block text-sm font-semibold text-[var(--navy)]" htmlFor="districtId">District<select className={inputClass} disabled={!location.divisionId} id="districtId" onChange={(event) => { setUpazilas([]); setLocation((current) => resetLocationForDistrict(current, event.target.value)); }} value={location.districtId}><option value="">Select district</option>{districts.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label className="block text-sm font-semibold text-[var(--navy)]" htmlFor="upazilaId">Upazila<select className={inputClass} disabled={!location.districtId} id="upazilaId" onChange={(event) => setLocation((current) => ({ ...current, upazilaId: event.target.value }))} value={location.upazilaId}><option value="">Select upazila</option>{upazilas.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label></div> : null}<div className="mt-5 grid gap-5 sm:grid-cols-2">{field("Business address", "addressLine1", { hint: "Street address or premises. This supports verification readiness." })}{field("Address line 2", "addressLine2", { hint: "Optional suite, floor, or nearby landmark." })}</div></section>

    <section className="rounded-2xl border border-[var(--line)] bg-white p-5 sm:p-7"><p className="eyebrow">Registration details</p><h2 className="mt-2 text-xl font-semibold text-[var(--navy)]">Private company identifiers</h2><p className="mt-2 text-sm leading-6 text-[var(--muted)]">These fields remain visible only to authorized company owners and admins. Documents and verification submission are not part of this phase.</p><div className="mt-6 grid gap-5 sm:grid-cols-3">{field("Registration number", "registrationNumber", { hint: "Optional" })}{field("Trade license number", "tradeLicenseNumber", { hint: "Optional" })}{field("TIN / VAT number", "taxVatNumber", { hint: "Optional" })}</div></section>

    <div aria-live="polite" className="sr-only">{isSubmitting ? "Saving company profile" : ""}</div><div className="flex flex-col-reverse justify-between gap-3 sm:flex-row"><Link className="rounded-xl px-4 py-3 text-center text-sm font-semibold text-[var(--navy)] hover:bg-[var(--surface)]" href="/dashboard/company">Cancel</Link><button className="rounded-xl bg-[var(--navy)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-deep)] disabled:cursor-not-allowed disabled:opacity-60" disabled={isSubmitting} type="submit">{isSubmitting ? "Saving profile…" : "Save changes"}</button></div>
  </form>;
}
