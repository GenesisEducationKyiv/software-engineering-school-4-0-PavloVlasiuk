export interface IStep<T> {
  execute(params: T): Promise<void>;
  compensate(params: T): Promise<void>;
}
