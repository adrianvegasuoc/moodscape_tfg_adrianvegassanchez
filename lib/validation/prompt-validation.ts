/**
 * Utilidades de validación y moderación básica para prompts de Moodscape.
 *
 * Este módulo aplica una primera capa defensiva antes de enviar texto de usuario
 * al backend y a OpenAI: normaliza el prompt, limita su longitud y bloquea
 * lenguaje explícitamente prohibido o patrones técnicos de abuso.
 *
 * Esta validación no sustituye una moderación semántica avanzada ni una revisión
 * contextual del contenido. Debe ejecutarse siempre también en servidor antes de
 * llamar a OpenAI, aunque exista validación previa en la interfaz.
 *
 * @module
 */

/**
 * Longitud máxima aceptada para un prompt de usuario.
 *
 * El límite protege la experiencia de escritura, reduce entradas excesivas y
 * evita enviar textos innecesariamente largos al flujo de generación.
 */
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

/**
 * Resultado normalizado de la validación de un prompt.
 *
 * El contrato lo comparten cliente y servidor para mantener los mismos mensajes
 * de usuario y asegurar que solo se envían prompts saneados a la generación.
 */
export type PromptValidationResult = {
  /** Indica si el prompt puede continuar hacia el flujo de generación. */
  valid: boolean;
  /** Mensaje claro para el usuario cuando la validación falla. */
  reason?: string;
  /** Prompt normalizado y seguro para usar cuando `valid` es `true`. */
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

/**
 * Normaliza un prompt para comparación y uso posterior.
 *
 * Convierte el texto a minúsculas, elimina caracteres de control, normaliza
 * acentos, compacta espacios y aplica el límite máximo de longitud.
 */
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

/**
 * Valida un prompt de usuario antes de permitir la generación de imagen.
 *
 * Comprueba que el texto no esté vacío, no supere la longitud máxima, no contenga
 * palabras prohibidas y no incluya patrones básicos de inyección SQL o HTML/script.
 *
 * La longitud se valida antes del recorte final para detectar prompts demasiado
 * largos en lugar de truncarlos silenciosamente.
 */
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
