import { BehaviorSubject, Subject, Observable } from "rxjs";
import { scan } from "rxjs/operators";

export type Mutation<T> = (t: T) => T;

export interface RxStore<T = any> {
  // stream: BehaviorSubject<T>;
  destroy: () => void;
  obs: Observable<T>;
  getValue: () => T;
  next: (m: Mutation<T>) => void;
  dispatch: (action: Action) => void;
}

export interface Action<T = any> {
  type: string;
  payload?: T;
}

export interface Reducer<T> {
  (state: T, action: Action): T;
}

export function createStore<T>(
  defaultState: T,
  reducer: Reducer<T> = s => s,
): RxStore<T> {
  const mutations = new Subject<Mutation<T>>();
  const stream = new BehaviorSubject(defaultState);

  mutations
    .pipe(
      scan<Mutation<T>, T>((state, mutation) => {
        return mutation(state);
      }, defaultState),
    )
    .subscribe(stream);
  return {
    // stream,
    destroy() {
      mutations.complete();
      stream.complete();
    },
    obs: stream.asObservable(),
    getValue() {
      return stream.getValue();
    },
    next(m: Mutation<T>) {
      mutations.next(m);
    },
    dispatch<S>(action: Action<S>) {
      mutations.next(state => reducer(state, action));
    },
  };
}
