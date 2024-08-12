export interface ISaga<T> {
  start(data: T): Promise<void>;
}
