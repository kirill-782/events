export type Listener = (...args: any[]) => void;

export interface EventMap {
  error: (error: Error) => void;
  newListener: (event: string | number | symbol, listener: Listener) => void;
  removeListener: (event: string | number | symbol, listener: Listener) => void;
}

/**
 * Type-safe event emitter.
 *
 * Use it like this:
 *
 * ```typescript
 * type MyEvents = {
 *   error: (error: Error) => void;
 *   message: (from: string, content: string) => void;
 * }
 *
 * const myEmitter = new EventEmitter() as TypedEmitter<MyEvents>;
 *
 * myEmitter.emit("error", "x")  // <- Will catch this type error;
 * ```
 */

interface AnyEmmiter extends EventMap {
  [key: symbol]: Listener;
  [key: string]: Listener;
  [key: number]: Listener;
}

export class EventEmitter<Events extends EventMap = AnyEmmiter> {
  static listenerCount(emitter: EventEmitter, type: string | number): number;
  static defaultMaxListeners: number;

  addListener<E extends keyof Events>(event: E, listener: Events[E]): this;
  on<E extends keyof Events>(event: E, listener: Events[E]): this;
  once<E extends keyof Events>(event: E, listener: Events[E]): this;
  prependListener<E extends keyof Events>(event: E, listener: Events[E]): this;
  prependOnceListener<E extends keyof Events>(event: E, listener: Events[E]): this;

  off<E extends keyof Events>(event: E, listener: Events[E]): this;
  removeAllListeners<E extends keyof Events>(event?: E): this;
  removeListener<E extends keyof Events>(event: E, listener: Events[E]): this;

  emit<E extends keyof Events>(event: E, ...args: Parameters<(Events & AnyEmmiter)[E]>): boolean;
  // The sloppy `eventNames()` return type is to mitigate type incompatibilities - see #5
  eventNames(): (string | symbol)[];
  rawListeners<E extends keyof Events>(event: E): Events[E][];
  listeners<E extends keyof Events>(event: E): Events[E][];
  listenerCount<E extends keyof Events>(event: E): number;

  getMaxListeners(): number;
  setMaxListeners(maxListeners: number): this;
}

export function once<Event extends EventMap, EE extends EventEmitter<Event> = EventEmitter<Event>, K extends keyof Event = keyof Event>(
  emmiter: EE,
  event: K
): Promise<Parameters<(Event & AnyEmmiter)[K]>>;
