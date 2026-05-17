import { describe, expect, it } from "vitest";

import { MAX_PROMPT_LENGTH, normalizePrompt, validatePrompt } from "./prompt-validation";

describe("prompt validation", () => {
  it("accepts a valid prompt", () => {
    const result = validatePrompt("Una tarde tranquila en familia");

    expect(result.valid).toBe(true);
    expect(result.sanitizedPrompt).toBeDefined();
    expect(result.sanitizedPrompt).toBe("una tarde tranquila en familia");
  });

  it("rejects an empty prompt", () => {
    expect(validatePrompt("")).toEqual({
      valid: false,
      reason: "El prompt es obligatorio."
    });
  });

  it("rejects a prompt with only spaces", () => {
    expect(validatePrompt("      ")).toEqual({
      valid: false,
      reason: "El prompt es obligatorio."
    });
  });

  it("rejects a prompt longer than the maximum length", () => {
    const longPrompt = "a".repeat(MAX_PROMPT_LENGTH + 1);

    expect(validatePrompt(longPrompt)).toEqual({
      valid: false,
      reason: "El texto es demasiado largo."
    });
  });

  it("rejects forbidden words", () => {
    expect(validatePrompt("Un idiota junto al mar")).toEqual({
      valid: false,
      reason: "El texto contiene lenguaje no permitido. Reformula tu idea."
    });
  });

  it("rejects SQL injection patterns", () => {
    expect(validatePrompt("' OR '1'='1")).toEqual({
      valid: false,
      reason: "El texto contiene caracteres o patrones no permitidos."
    });
  });

  it("rejects HTML or script tags", () => {
    expect(validatePrompt("<script>alert('x')</script>")).toEqual({
      valid: false,
      reason: "El texto contiene caracteres o patrones no permitidos."
    });
  });

  it("normalizes casing, accents and duplicated spaces", () => {
    expect(normalizePrompt("  CÁLMA    EN   MÁLAGA  ")).toBe("calma en malaga");
  });
});
