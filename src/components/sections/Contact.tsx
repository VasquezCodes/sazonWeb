"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";

interface ContactFormState {
  name: string;
  email: string;
  eventType: string;
  eventDate: string;
  message: string;
}

const initialState: ContactFormState = {
  name: "",
  email: "",
  eventType: "",
  eventDate: "",
  message: "",
};

const inputClasses =
  "mt-1 w-full rounded-xl border border-navy/20 bg-white px-4 py-2.5 text-navy transition-colors duration-200 focus:border-red focus:outline-none focus:ring-2 focus:ring-red/25";

function RequiredMark() {
  return (
    <>
      <span aria-hidden="true" className="ml-0.5 text-navy">
        *
      </span>
      <span className="sr-only"> (required)</span>
    </>
  );
}

export function Contact() {
  const [form, setForm] = useState<ContactFormState>(initialState);
  const [submitted, setSubmitted] = useState(false);

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <section id="contact" className="mx-auto max-w-2xl px-6 py-20 text-center sm:py-24">
        <div className="animate-[fade-in-up_0.5s_ease-out]">
          <h2 className="font-heading text-3xl font-extrabold text-navy sm:text-4xl">
            Thanks, {form.name.split(" ")[0] || "there"}!
          </h2>
          <p className="mt-4 text-navy/70">
            We&apos;ve got your message and we&apos;ll get back to you as soon
            as we can.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="mx-auto max-w-2xl px-6 py-20 sm:py-24">
      <div className="text-center">
        <h2 className="font-heading text-3xl font-extrabold text-navy sm:text-4xl">
          Get in touch
        </h2>
        <p className="mt-3 text-navy/70">
          Tell us what you have in mind and we&apos;ll get back to you.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-10 space-y-5">
        <p className="text-sm text-navy/60">
          Fields marked <span className="text-navy">*</span> are required.
        </p>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="text-sm font-semibold text-navy">
              Name
              <RequiredMark />
            </label>
            <input
              id="name"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-semibold text-navy">
              Email
              <RequiredMark />
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>
          <div>
            <label htmlFor="eventType" className="text-sm font-semibold text-navy">
              Event type{" "}
              <span className="font-normal text-navy/50">(optional)</span>
            </label>
            <input
              id="eventType"
              name="eventType"
              placeholder="Wedding, market, office party..."
              value={form.eventType}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>
          <div>
            <label htmlFor="eventDate" className="text-sm font-semibold text-navy">
              Event date{" "}
              <span className="font-normal text-navy/50">(optional)</span>
            </label>
            <input
              id="eventDate"
              name="eventDate"
              type="date"
              value={form.eventDate}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>
        </div>

        <div>
          <label htmlFor="message" className="text-sm font-semibold text-navy">
            Message{" "}
            <span className="font-normal text-navy/50">(optional)</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={form.message}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>

        <Button type="submit" variant="primary" className="w-full sm:w-auto">
          Send message
        </Button>
      </form>
    </section>
  );
}
