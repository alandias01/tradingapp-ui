/**
 * A promise that resolves or rejects after a delay time and data to return if resolved after that delay
 * @param timeToDelay
 * @param data
 * @param shouldResolve
 */
export const TaskDelay = <T extends {}>(
  timeToDelay: number,
  data: T = {} as T,
  shouldResolve = true,
  error = new Error("Default Error")
): Promise<T> =>
  new Promise((res, rej) =>
    setTimeout(() => (shouldResolve ? res(data) : rej(error)), timeToDelay)
  );
