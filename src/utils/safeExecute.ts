export async function safeExecute<T>(
  operation: () => Promise<T>,
  fallbackValue: T,
  errorMessage: string
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    console.error(`[CRITICAL ERROR]: ${errorMessage}`, error);
    return fallbackValue;
  }
}
