export function delay(delayInMilliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, delayInMilliseconds);
  });
}
