import re
from typing import Dict

class PromptRouter:
    """Service to classify prompts and route them based on keywords."""

    SUSPICIOUS_KEYWORDS = [
        r"ignore\s+(?:the\s+)?previous\s+instructions",
        r"system\s+prompt",
        r"jailbreak",
        r"bypass\s+rules",
        r"override\s+rules",
        r"developer\s+mode",
        r"dan\s+mode",
        r"hack",
        r"exploit"
    ]

    SENSITIVE_KEYWORDS = [
        r"password",
        r"api[_\s]key",
        r"secret",
        r"private[_\s]key",
        r"credential",
        r"auth[_\s]token",
        r"credit[_\s]card",
        r"social[_\s]security",
        r"ssn",
        r"personal[_\s]identifiable[_\s]information",
        r"pii"
    ]

    LONG_CONTEXT_KEYWORDS = [
        r"context",
        r"analyze\s+(?:this\s+)?(?:document|file|pdf|csv|log)",
        r"read\s+(?:this\s+)?(?:document|file|pdf|csv|log)",
        r"summarize\s+(?:the\s+)?(?:attachment|file|pdf|csv|text)",
        r"long\s+text",
        r"lengthy"
    ]

    CODING_KEYWORDS = [
        r"\bpython\b",
        r"\bjavascript\b",
        r"\btypescript\b",
        r"\bjava\b",
        r"\bcpp\b",
        r"\bc\b",
        r"\bgo\b",
        r"\brust\b",
        r"\bhtml\b",
        r"\bcss\b",
        r"\bsql\b",
        r"\bcode\b",
        r"\bloop\b",
        r"\bfunction\b",
        r"\bcompile\b",
        r"\brun\b",
        r"\bgit\b",
        r"\bnpm\b",
        r"\brefactor\b",
        r"\bbug\b",
        r"\bwrite\s+(?:a\s+)?(?:program|loop|function|script|class|test)\b",
        r"\bdef\s+\w+\b",
        r"\bclass\s+\w+\b",
        r"\bstruct\b",
        r"\bimport\s+\w+\b",
        r"\bconst\s+\w+\b",
        r"\blet\s+\w+\b",
        r"\bvar\s+\w+\b",
        r"\bfunc\s+\w+\b",
        r"\bfn\s+\w+\b",
        r"\bselect\b.*\bfrom\b"
    ]

    WRITING_KEYWORDS = [
        r"\bessay\b",
        r"\bblog\b",
        r"\bsummary\b",
        r"\barticle\b",
        r"\bemail\b",
        r"\bdraft\b",
        r"\bpoem\b",
        r"\bstory\b",
        r"\bparagraph\b",
        r"\bcreative\s+writing\b",
        r"\bnewsletter\b",
        r"\bresume\b",
        r"\bcover\s+letter\b",
        r"\bwrite\s+(?:an|a)\s+(?:essay|article|email|poem|story|blog)\b"
    ]

    def classify_prompt(self, message: str) -> Dict[str, str]:
        """
        Classifies the incoming message into one of the designated categories
        and matches it with a suitable routing strategy and explanation.
        """
        if not message or not message.strip():
            return {
                "category": "Simple",
                "strategy": "Low Cost / Fast",
                "reason": "Empty prompt detected."
            }

        cleaned_message = message.strip()
        lower_message = cleaned_message.lower()

        # 1. Suspicious
        for kw in self.SUSPICIOUS_KEYWORDS:
            if re.search(kw, lower_message):
                return {
                    "category": "Suspicious",
                    "strategy": "Block / Inspect",
                    "reason": f"Potential prompt injection or bypass pattern ('{kw}') detected."
                }

        # 2. Sensitive
        for kw in self.SENSITIVE_KEYWORDS:
            if re.search(kw, lower_message):
                return {
                    "category": "Sensitive",
                    "strategy": "Local / Secure Model",
                    "reason": f"Sensitive credential or privacy keyword ('{kw}') detected."
                }

        # 3. Long Context (By explicit length or keywords)
        if len(cleaned_message) > 1000:
            return {
                "category": "Long Context",
                "strategy": "Large Context Window",
                "reason": f"Prompt length ({len(cleaned_message)} chars) exceeds 1000 character threshold."
            }
            
        for kw in self.LONG_CONTEXT_KEYWORDS:
            if re.search(kw, lower_message):
                return {
                    "category": "Long Context",
                    "strategy": "Large Context Window",
                    "reason": f"Request for large file or document context ('{kw}') detected."
                }

        # 4. Coding
        for kw in self.CODING_KEYWORDS:
            if re.search(kw, lower_message):
                return {
                    "category": "Coding",
                    "strategy": "High Accuracy",
                    "reason": f"Software engineering or programming construct ('{kw}') detected."
                }

        # 5. Writing
        for kw in self.WRITING_KEYWORDS:
            if re.search(kw, lower_message):
                return {
                    "category": "Writing",
                    "strategy": "Creative / Fast",
                    "reason": f"Content generation or creative writing keyword ('{kw}') detected."
                }

        # 6. Simple (Default)
        return {
            "category": "Simple",
            "strategy": "Low Cost / Fast",
            "reason": "Short conversational message or simple query."
        }

# Singleton instance
prompt_router = PromptRouter()
