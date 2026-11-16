"use client";

import { FormEvent, KeyboardEvent, useMemo, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { StatusModal } from "@/components/StatusModal";
import {
  filterNigeriaCities,
  filterNigeriaStates,
} from "@/lib/nigeria-locations";
import { submitWaitlistEntry } from "@/lib/waitlist";
import type { WaitlistCategory, WaitlistEntryPayload } from "@/types/waitlist";

type WaitlistFormProps = {
  category: WaitlistCategory;
};

type WaitlistFormValues = Omit<WaitlistEntryPayload, "category">;

const emptyForm: WaitlistFormValues = {
  firstName: "",
  lastName: "",
  city: "",
  state: "",
  email: "",
  whatsappPhone: "",
};

export function WaitlistForm({ category }: WaitlistFormProps) {
  const [form, setForm] = useState<WaitlistFormValues>(emptyForm);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [showStateSuggestions, setShowStateSuggestions] = useState(false);
  const [status, setStatus] = useState<
    | { message: string; type: "error" | "success" }
    | { message: string; type: "idle" | "loading" }
  >({ message: "", type: "idle" });

  const citySuggestions = useMemo(
    () => filterNigeriaCities(form.city, form.state),
    [form.city, form.state],
  );
  const stateSuggestions = useMemo(
    () => filterNigeriaStates(form.state),
    [form.state],
  );
  const isLoading = status.type === "loading";
  const isFormComplete = Object.values(form).every(
    (value) => value.trim().length > 0,
  );
  const isSubmitDisabled = isLoading || !isFormComplete;
  const isModalOpen = status.type !== "idle";
  const modalStatus = status.type === "idle" ? "loading" : status.type;
  const formId = category.toLowerCase();
  const modalTitleId = `${formId}-waitlist-status-title`;
  const modalDescriptionId = `${formId}-waitlist-status-description`;
  const cityListId = `${formId}-city-suggestions`;
  const stateListId = `${formId}-state-suggestions`;

  function updateField(field: keyof WaitlistFormValues, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSuggestionKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setShowCitySuggestions(false);
      setShowStateSuggestions(false);
    }
  }

  function selectCity(city: string, state: string) {
    setForm((current) => ({ ...current, city, state }));
    setShowCitySuggestions(false);
  }

  function selectState(state: string) {
    setForm((current) => ({ ...current, state }));
    setShowStateSuggestions(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitDisabled) {
      return;
    }

    setStatus({
      message: "Please wait while we save your details.",
      type: "loading",
    });

    try {
      const response = await submitWaitlistEntry({ category, ...form });

      setForm(emptyForm);
      setShowCitySuggestions(false);
      setShowStateSuggestions(false);
      setStatus({
        message:
          response.message ??
          `You're on the ${category.toLowerCase()} waitlist. We'll keep you posted.`,
        type: "success",
      });
    } catch (error) {
      setStatus({
        message:
          error instanceof Error
            ? error.message
            : "We could not submit your details. Please try again.",
        type: "error",
      });
    }
  }

  function closeModal() {
    if (status.type === "loading") {
      return;
    }

    setStatus({ message: "", type: "idle" });
  }

  return (
    <>
      <form className="waitlist-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <input
            aria-label="First name"
            autoComplete="given-name"
            maxLength={60}
            name="firstName"
            onChange={(event) => updateField("firstName", event.target.value)}
            placeholder="First Name"
            required
            type="text"
            value={form.firstName}
          />
          <input
            aria-label="Last name"
            autoComplete="family-name"
            maxLength={60}
            name="lastName"
            onChange={(event) => updateField("lastName", event.target.value)}
            placeholder="Last Name"
            required
            type="text"
            value={form.lastName}
          />
        </div>

        <div className="form-row">
          <div className="waitlist-location-field">
            <input
              aria-autocomplete="list"
              aria-controls={cityListId}
              aria-expanded={showCitySuggestions && citySuggestions.length > 0}
              aria-label="City"
              autoComplete="address-level2"
              maxLength={80}
              name="city"
              onBlur={() => window.setTimeout(() => setShowCitySuggestions(false), 120)}
              onChange={(event) => {
                updateField("city", event.target.value);
                setShowCitySuggestions(true);
              }}
              onFocus={() => setShowCitySuggestions(true)}
              onKeyDown={handleSuggestionKeyDown}
              placeholder="City"
              required
              role="combobox"
              type="text"
              value={form.city}
            />
            {showCitySuggestions && citySuggestions.length > 0 ? (
              <div
                aria-label="City suggestions"
                className="waitlist-suggestions"
                id={cityListId}
                role="listbox"
              >
                {citySuggestions.map((suggestion) => (
                  <button
                    className="waitlist-suggestion"
                    key={`${suggestion.city}-${suggestion.state}`}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => selectCity(suggestion.city, suggestion.state)}
                    role="option"
                    type="button"
                  >
                    <span>{suggestion.city}</span>
                    <small>{suggestion.state}</small>
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="waitlist-location-field">
            <input
              aria-autocomplete="list"
              aria-controls={stateListId}
              aria-expanded={showStateSuggestions && stateSuggestions.length > 0}
              aria-label="State"
              autoComplete="address-level1"
              maxLength={80}
              name="state"
              onBlur={() => window.setTimeout(() => setShowStateSuggestions(false), 120)}
              onChange={(event) => {
                updateField("state", event.target.value);
                setShowStateSuggestions(true);
              }}
              onFocus={() => setShowStateSuggestions(true)}
              onKeyDown={handleSuggestionKeyDown}
              placeholder="State"
              required
              role="combobox"
              type="text"
              value={form.state}
            />
            {showStateSuggestions && stateSuggestions.length > 0 ? (
              <div
                aria-label="State suggestions"
                className="waitlist-suggestions"
                id={stateListId}
                role="listbox"
              >
                {stateSuggestions.map((state) => (
                  <button
                    className="waitlist-suggestion"
                    key={state}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => selectState(state)}
                    role="option"
                    type="button"
                  >
                    <span>{state}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <input
          aria-label="Email address"
          autoComplete="email"
          maxLength={254}
          name="email"
          onChange={(event) => updateField("email", event.target.value)}
          placeholder="Email Address"
          required
          type="email"
          value={form.email}
        />
        <input
          aria-label="WhatsApp phone number"
          autoComplete="tel"
          inputMode="tel"
          maxLength={24}
          name="whatsappPhone"
          onChange={(event) => updateField("whatsappPhone", event.target.value)}
          placeholder="WhatsApp Phone Number"
          required
          type="tel"
          value={form.whatsappPhone}
        />
        <button
          data-loading={isLoading ? "true" : undefined}
          disabled={isSubmitDisabled}
          type="submit"
        >
          <span>Join the Waitlist</span>
          {isLoading ? (
            <Loader2 aria-hidden="true" className="spinner" size={18} />
          ) : (
            <ArrowRight aria-hidden="true" size={18} />
          )}
        </button>
      </form>

      {isModalOpen ? (
        <StatusModal
          descriptionId={modalDescriptionId}
          message={status.message}
          onClose={closeModal}
          status={modalStatus}
          title={
            status.type === "loading"
              ? "Joining the waitlist..."
              : status.type === "success"
                ? "Joined waitlist successfully"
                : "Submission failed"
          }
          titleId={modalTitleId}
        />
      ) : null}
    </>
  );
}
