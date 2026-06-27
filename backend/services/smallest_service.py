import os
import logging
import httpx
from dotenv import load_dotenv

# Setup logger
logger = logging.getLogger("otari.smallest_service")

# Load environment variables from .env
load_dotenv()

class SmallestAPIException(Exception):
    """Base exception for Smallest.ai operations."""
    def __init__(self, message: str, status_code: int = 500):
        super().__init__(message)
        self.message = message
        self.status_code = status_code


class InvalidAPIKeyException(SmallestAPIException):
    """Raised when the API key is invalid or missing."""
    def __init__(self, message: str = "Smallest.ai API key is missing or invalid. Please check your configuration."):
        super().__init__(message, status_code=401)


class SmallestTimeoutException(SmallestAPIException):
    """Raised when the request to Smallest.ai times out."""
    def __init__(self, message: str = "Request to Smallest.ai timed out. Please try again."):
        super().__init__(message, status_code=504)


class SmallestNetworkException(SmallestAPIException):
    """Raised when there is a network-level communication failure."""
    def __init__(self, message: str = "A network error occurred while communicating with Smallest.ai."):
        super().__init__(message, status_code=502)


class SmallestEmptyResponseException(SmallestAPIException):
    """Raised when Smallest.ai returns an empty response."""
    def __init__(self, message: str = "Received an empty response from Smallest.ai."):
        super().__init__(message, status_code=502)


class SmallestClient:
    """Reusable client for Smallest.ai chat completions."""
    
    BASE_URL = "https://api.smallest.ai/waves/v1"
    DEFAULT_MODEL = "electron"
    TIMEOUT = 15.0  # 15 seconds timeout

    def __init__(self, api_key: str = None):
        self.api_key = api_key if api_key is not None else os.getenv("SMALLEST_API_KEY")
        self.client = httpx.AsyncClient(timeout=self.TIMEOUT)

    async def close(self):
        """Close the underlying HTTPX client."""
        await self.client.aclose()

    async def chat_completion(self, message: str) -> str:
        """
        Sends a single user prompt to the Smallest.ai completion endpoint and returns the reply.
        
        Args:
            message: The user's input string.
            
        Returns:
            The AI reply string.
            
        Raises:
            InvalidAPIKeyException: If API key is missing or invalid (401).
            SmallestTimeoutException: If the request times out.
            SmallestNetworkException: For other HTTP/network failures.
            SmallestEmptyResponseException: If the response is empty.
        """
        if not self.api_key:
            logger.error("Smallest.ai API Key is missing.")
            raise InvalidAPIKeyException("Smallest.ai API key is missing from environment. Please add SMALLEST_API_KEY to your .env file.")

        url = f"{self.BASE_URL}/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        # Simple payload matching OpenAI compatibility
        payload = {
            "model": self.DEFAULT_MODEL,
            "messages": [
                {"role": "user", "content": message}
            ]
        }

        try:
            logger.info("Sending request to Smallest.ai chat completions...")
            response = await self.client.post(url, headers=headers, json=payload)
            
            if response.status_code == 401:
                logger.error("Smallest.ai returned 401 Unauthorized.")
                raise InvalidAPIKeyException()
                
            response.raise_for_status()
            
            data = response.json()
            
            # Navigate standard OpenAI response format
            choices = data.get("choices", [])
            if not choices:
                logger.error("No choices returned in response from Smallest.ai.")
                raise SmallestEmptyResponseException()
                
            reply = choices[0].get("message", {}).get("content", "").strip()
            
            if not reply:
                logger.error("Empty content returned from Smallest.ai.")
                raise SmallestEmptyResponseException()
                
            return reply

        except httpx.TimeoutException as te:
            logger.error(f"Timeout communicating with Smallest.ai: {te}")
            raise SmallestTimeoutException()
            
        except httpx.HTTPStatusError as hse:
            logger.error(f"HTTP status error from Smallest.ai: {hse.response.status_code} - {hse.response.text}")
            if hse.response.status_code == 401:
                raise InvalidAPIKeyException()
            raise SmallestNetworkException(f"Smallest.ai returned an error status: {hse.response.status_code}")
            
        except httpx.RequestError as re:
            logger.error(f"Request error communicating with Smallest.ai: {re}")
            raise SmallestNetworkException()
            
        except ValueError as ve:
            # Json parsing error
            logger.error(f"Failed to parse JSON response from Smallest.ai: {ve}")
            raise SmallestEmptyResponseException("Invalid response format received from Smallest.ai.")

# Reusable client instance (singleton pattern)
smallest_client = SmallestClient()
