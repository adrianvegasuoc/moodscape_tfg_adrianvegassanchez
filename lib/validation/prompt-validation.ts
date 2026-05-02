export const MAX_PROMPT_LENGTH = 300;

const DISALLOWED_LANGUAGE_MESSAGE =
  "El texto contiene lenguaje no permitido. Reformula tu idea.";
const DISALLOWED_PATTERN_MESSAGE = "El texto contiene caracteres o patrones no permitidos.";
const EMPTY_PROMPT_MESSAGE = "El prompt es obligatorio.";
const TOO_LONG_MESSAGE = "El texto es demasiado largo.";

const FORBIDDEN_WORDS = [
  "idiota",
  "imbecil",
  "gilipollas",
  "subnormal",
  "estupido",
  "puta",
  "puto",
  "mierda",
  "joder",
  "cabron",
  "cabrona",
  "maricon",
  "zorra",
  "asco",
  "matar",
  "suicidio",
  "violar",
  "violacion",
  "terrorista",
  "nazi",
  "racista",
  "idiot",
  "stupid",
  "moron",
  "asshole",
  "bitch",
  "fuck",
  "shit",
  "bastard",
  "cunt",
  "dick",
  "slut",
  "kill",
  "suicide",
  "rape",
  "rapist",
  "terrorist",
  "racist",
  "hate"
];

const SQL_INJECTION_PATTERNS = [
  /'\s*or\s*'1'\s*=\s*'1/i,
  /--/,
  /;\s*drop/i,
  /\bunion\s+select\b/i,
  /\binsert\s+into\b/i,
  /\bdelete\s+from\b/i,
  /\bupdate\s+/i,
  /\balter\s+table\b/i,
  /\bexec\s+/i
];

const HTML_SCRIPT_PATTERNS = [
  /<\s*script\b/i,
  /<\s*\/\s*script\s*>/i,
  /javascript\s*:/i,
  /\bonerror\s*=/i,
  /\bonclick\s*=/i,
  /<[^>]+>/
];

export type PromptValidationResult = {
  valid: boolean;
  reason?: string;
  sanitizedPrompt?: string;
};

function removeAccents(text: string) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function normalizePromptWithoutLimit(text: string) {
  return removeAccents(text)
    .replace(/[\u0000-\u001f\u007f-\u009f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizePrompt(text: string): string {
  return normalizePromptWithoutLimit(text).slice(0, MAX_PROMPT_LENGTH);
}

function containsForbiddenWord(text: string) {
  return FORBIDDEN_WORDS.some((word) => {
    const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`(^|[^a-z0-9])${escapedWord}([^a-z0-9]|$)`, "i").test(text);
  });
}

function containsBlockedPattern(text: string) {
  return [...SQL_INJECTION_PATTERNS, ...HTML_SCRIPT_PATTERNS].some((pattern) =>
    pattern.test(text)
  );
}

export function validatePrompt(text: string): PromptValidationResult {
  const normalizedPrompt = normalizePromptWithoutLimit(text);

  if (!normalizedPrompt) {
    return {
      valid: false,
      reason: EMPTY_PROMPT_MESSAGE
    };
  }

  if (normalizedPrompt.length > MAX_PROMPT_LENGTH) {
    return {
      valid: false,
      reason: TOO_LONG_MESSAGE
    };
  }

  if (containsForbiddenWord(normalizedPrompt)) {
    return {
      valid: false,
      reason: DISALLOWED_LANGUAGE_MESSAGE
    };
  }

  if (containsBlockedPattern(normalizedPrompt)) {
    return {
      valid: false,
      reason: DISALLOWED_PATTERN_MESSAGE
    };
  }

  return {
    valid: true,
    sanitizedPrompt: normalizePrompt(text)
  };
}
