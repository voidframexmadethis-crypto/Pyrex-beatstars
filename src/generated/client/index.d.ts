
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model PyrexSpinnaInfiniteTrack
 * 
 */
export type PyrexSpinnaInfiniteTrack = $Result.DefaultSelection<Prisma.$PyrexSpinnaInfiniteTrackPayload>
/**
 * Model Transaction
 * 
 */
export type Transaction = $Result.DefaultSelection<Prisma.$TransactionPayload>
/**
 * Model RecordPlaque
 * 
 */
export type RecordPlaque = $Result.DefaultSelection<Prisma.$RecordPlaquePayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more PyrexSpinnaInfiniteTracks
 * const pyrexSpinnaInfiniteTracks = await prisma.pyrexSpinnaInfiniteTrack.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more PyrexSpinnaInfiniteTracks
   * const pyrexSpinnaInfiniteTracks = await prisma.pyrexSpinnaInfiniteTrack.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.PrismaClientConstructorArgs<ClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.pyrexSpinnaInfiniteTrack`: Exposes CRUD operations for the **PyrexSpinnaInfiniteTrack** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PyrexSpinnaInfiniteTracks
    * const pyrexSpinnaInfiniteTracks = await prisma.pyrexSpinnaInfiniteTrack.findMany()
    * ```
    */
  get pyrexSpinnaInfiniteTrack(): Prisma.PyrexSpinnaInfiniteTrackDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.transaction`: Exposes CRUD operations for the **Transaction** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Transactions
    * const transactions = await prisma.transaction.findMany()
    * ```
    */
  get transaction(): Prisma.TransactionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.recordPlaque`: Exposes CRUD operations for the **RecordPlaque** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RecordPlaques
    * const recordPlaques = await prisma.recordPlaque.findMany()
    * ```
    */
  get recordPlaque(): Prisma.RecordPlaqueDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.9.1
   * Query Engine version: e922089b7d7502aff4249d5da3420f6fa55fc6ad
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * Resolved type of the argument passed to the `PrismaClient` constructor.
   *
   * When called without a narrower options type (the common case), this resolves
   * to `PrismaClientOptions` directly, which produces a clear TypeScript error
   * message (`not assignable to parameter of type 'PrismaClientOptions'`) when
   * the argument is missing or incomplete. When the user supplies a narrower
   * options type (e.g. via a literal), it falls back to `Subset` to keep
   * filtering out unknown properties.
   */
  export type PrismaClientConstructorArgs<Options extends PrismaClientOptions> =
    [PrismaClientOptions] extends [Options] ? PrismaClientOptions : Subset<Options, PrismaClientOptions>;

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      ((Without<T, U> & U) | (Without<U, T> & T)) & object
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    PyrexSpinnaInfiniteTrack: 'PyrexSpinnaInfiniteTrack',
    Transaction: 'Transaction',
    RecordPlaque: 'RecordPlaque'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "pyrexSpinnaInfiniteTrack" | "transaction" | "recordPlaque"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      PyrexSpinnaInfiniteTrack: {
        payload: Prisma.$PyrexSpinnaInfiniteTrackPayload<ExtArgs>
        fields: Prisma.PyrexSpinnaInfiniteTrackFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PyrexSpinnaInfiniteTrackFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PyrexSpinnaInfiniteTrackPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PyrexSpinnaInfiniteTrackFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PyrexSpinnaInfiniteTrackPayload>
          }
          findFirst: {
            args: Prisma.PyrexSpinnaInfiniteTrackFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PyrexSpinnaInfiniteTrackPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PyrexSpinnaInfiniteTrackFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PyrexSpinnaInfiniteTrackPayload>
          }
          findMany: {
            args: Prisma.PyrexSpinnaInfiniteTrackFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PyrexSpinnaInfiniteTrackPayload>[]
          }
          create: {
            args: Prisma.PyrexSpinnaInfiniteTrackCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PyrexSpinnaInfiniteTrackPayload>
          }
          createMany: {
            args: Prisma.PyrexSpinnaInfiniteTrackCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PyrexSpinnaInfiniteTrackCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PyrexSpinnaInfiniteTrackPayload>[]
          }
          delete: {
            args: Prisma.PyrexSpinnaInfiniteTrackDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PyrexSpinnaInfiniteTrackPayload>
          }
          update: {
            args: Prisma.PyrexSpinnaInfiniteTrackUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PyrexSpinnaInfiniteTrackPayload>
          }
          deleteMany: {
            args: Prisma.PyrexSpinnaInfiniteTrackDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PyrexSpinnaInfiniteTrackUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PyrexSpinnaInfiniteTrackUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PyrexSpinnaInfiniteTrackPayload>[]
          }
          upsert: {
            args: Prisma.PyrexSpinnaInfiniteTrackUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PyrexSpinnaInfiniteTrackPayload>
          }
          aggregate: {
            args: Prisma.PyrexSpinnaInfiniteTrackAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePyrexSpinnaInfiniteTrack>
          }
          groupBy: {
            args: Prisma.PyrexSpinnaInfiniteTrackGroupByArgs<ExtArgs>
            result: $Utils.Optional<PyrexSpinnaInfiniteTrackGroupByOutputType>[]
          }
          count: {
            args: Prisma.PyrexSpinnaInfiniteTrackCountArgs<ExtArgs>
            result: $Utils.Optional<PyrexSpinnaInfiniteTrackCountAggregateOutputType> | number
          }
        }
      }
      Transaction: {
        payload: Prisma.$TransactionPayload<ExtArgs>
        fields: Prisma.TransactionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TransactionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TransactionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          findFirst: {
            args: Prisma.TransactionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TransactionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          findMany: {
            args: Prisma.TransactionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>[]
          }
          create: {
            args: Prisma.TransactionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          createMany: {
            args: Prisma.TransactionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TransactionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>[]
          }
          delete: {
            args: Prisma.TransactionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          update: {
            args: Prisma.TransactionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          deleteMany: {
            args: Prisma.TransactionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TransactionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TransactionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>[]
          }
          upsert: {
            args: Prisma.TransactionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          aggregate: {
            args: Prisma.TransactionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTransaction>
          }
          groupBy: {
            args: Prisma.TransactionGroupByArgs<ExtArgs>
            result: $Utils.Optional<TransactionGroupByOutputType>[]
          }
          count: {
            args: Prisma.TransactionCountArgs<ExtArgs>
            result: $Utils.Optional<TransactionCountAggregateOutputType> | number
          }
        }
      }
      RecordPlaque: {
        payload: Prisma.$RecordPlaquePayload<ExtArgs>
        fields: Prisma.RecordPlaqueFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RecordPlaqueFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecordPlaquePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RecordPlaqueFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecordPlaquePayload>
          }
          findFirst: {
            args: Prisma.RecordPlaqueFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecordPlaquePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RecordPlaqueFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecordPlaquePayload>
          }
          findMany: {
            args: Prisma.RecordPlaqueFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecordPlaquePayload>[]
          }
          create: {
            args: Prisma.RecordPlaqueCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecordPlaquePayload>
          }
          createMany: {
            args: Prisma.RecordPlaqueCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RecordPlaqueCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecordPlaquePayload>[]
          }
          delete: {
            args: Prisma.RecordPlaqueDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecordPlaquePayload>
          }
          update: {
            args: Prisma.RecordPlaqueUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecordPlaquePayload>
          }
          deleteMany: {
            args: Prisma.RecordPlaqueDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RecordPlaqueUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RecordPlaqueUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecordPlaquePayload>[]
          }
          upsert: {
            args: Prisma.RecordPlaqueUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RecordPlaquePayload>
          }
          aggregate: {
            args: Prisma.RecordPlaqueAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRecordPlaque>
          }
          groupBy: {
            args: Prisma.RecordPlaqueGroupByArgs<ExtArgs>
            result: $Utils.Optional<RecordPlaqueGroupByOutputType>[]
          }
          count: {
            args: Prisma.RecordPlaqueCountArgs<ExtArgs>
            result: $Utils.Optional<RecordPlaqueCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * A driver adapter that PrismaClient uses to connect to your database, such as the ones provided by `@prisma/adapter-pg`, `@prisma/adapter-libsql`, `@prisma/adapter-planetscale`, etc.
     * 
     * A driver adapter is **required** unless you connect to your database through Prisma Accelerate (in which case use `accelerateUrl` instead).
     * 
     * Learn more: https://pris.ly/d/driver-adapters
     * 
     * @example
     * ```ts
     * import { PrismaPg } from '@prisma/adapter-pg'
     * import { PrismaClient } from './generated/prisma/client'
     * 
     * const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
     * const prisma = new PrismaClient({ adapter })
     * ```
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * The Prisma Accelerate connection URL. Use this option to connect to your database through Prisma Accelerate instead of using a driver adapter to connect directly.
     * 
     * Learn more: https://pris.ly/d/accelerate
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    pyrexSpinnaInfiniteTrack?: PyrexSpinnaInfiniteTrackOmit
    transaction?: TransactionOmit
    recordPlaque?: RecordPlaqueOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type PyrexSpinnaInfiniteTrackCountOutputType
   */

  export type PyrexSpinnaInfiniteTrackCountOutputType = {
    sales: number
  }

  export type PyrexSpinnaInfiniteTrackCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sales?: boolean | PyrexSpinnaInfiniteTrackCountOutputTypeCountSalesArgs
  }

  // Custom InputTypes
  /**
   * PyrexSpinnaInfiniteTrackCountOutputType without action
   */
  export type PyrexSpinnaInfiniteTrackCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PyrexSpinnaInfiniteTrackCountOutputType
     */
    select?: PyrexSpinnaInfiniteTrackCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PyrexSpinnaInfiniteTrackCountOutputType without action
   */
  export type PyrexSpinnaInfiniteTrackCountOutputTypeCountSalesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransactionWhereInput
  }


  /**
   * Models
   */

  /**
   * Model PyrexSpinnaInfiniteTrack
   */

  export type AggregatePyrexSpinnaInfiniteTrack = {
    _count: PyrexSpinnaInfiniteTrackCountAggregateOutputType | null
    _avg: PyrexSpinnaInfiniteTrackAvgAggregateOutputType | null
    _sum: PyrexSpinnaInfiniteTrackSumAggregateOutputType | null
    _min: PyrexSpinnaInfiniteTrackMinAggregateOutputType | null
    _max: PyrexSpinnaInfiniteTrackMaxAggregateOutputType | null
  }

  export type PyrexSpinnaInfiniteTrackAvgAggregateOutputType = {
    bpm: number | null
    priceMp3: number | null
    priceWav: number | null
    priceStems: number | null
    priceExclusive: number | null
    streamCount: number | null
    downloadCount: number | null
  }

  export type PyrexSpinnaInfiniteTrackSumAggregateOutputType = {
    bpm: number | null
    priceMp3: number | null
    priceWav: number | null
    priceStems: number | null
    priceExclusive: number | null
    streamCount: number | null
    downloadCount: number | null
  }

  export type PyrexSpinnaInfiniteTrackMinAggregateOutputType = {
    id: string | null
    title: string | null
    slug: string | null
    bpm: number | null
    keySignature: string | null
    genre: string | null
    subGenre: string | null
    awsAudioUrl: string | null
    awsArtworkUrl: string | null
    r2AudioUrl: string | null
    r2ArtworkUrl: string | null
    archiveAudioUrl: string | null
    archiveArtworkUrl: string | null
    vercelAudioUrl: string | null
    vercelArtworkUrl: string | null
    watermarkedAudioUrl: string | null
    storageClusterNode: string | null
    priceMp3: number | null
    priceWav: number | null
    priceStems: number | null
    priceExclusive: number | null
    isExclusiveSold: boolean | null
    isVaultLocked: boolean | null
    streamCount: number | null
    downloadCount: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PyrexSpinnaInfiniteTrackMaxAggregateOutputType = {
    id: string | null
    title: string | null
    slug: string | null
    bpm: number | null
    keySignature: string | null
    genre: string | null
    subGenre: string | null
    awsAudioUrl: string | null
    awsArtworkUrl: string | null
    r2AudioUrl: string | null
    r2ArtworkUrl: string | null
    archiveAudioUrl: string | null
    archiveArtworkUrl: string | null
    vercelAudioUrl: string | null
    vercelArtworkUrl: string | null
    watermarkedAudioUrl: string | null
    storageClusterNode: string | null
    priceMp3: number | null
    priceWav: number | null
    priceStems: number | null
    priceExclusive: number | null
    isExclusiveSold: boolean | null
    isVaultLocked: boolean | null
    streamCount: number | null
    downloadCount: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PyrexSpinnaInfiniteTrackCountAggregateOutputType = {
    id: number
    title: number
    slug: number
    bpm: number
    keySignature: number
    genre: number
    subGenre: number
    moodTags: number
    awsAudioUrl: number
    awsArtworkUrl: number
    r2AudioUrl: number
    r2ArtworkUrl: number
    archiveAudioUrl: number
    archiveArtworkUrl: number
    vercelAudioUrl: number
    vercelArtworkUrl: number
    watermarkedAudioUrl: number
    storageClusterNode: number
    priceMp3: number
    priceWav: number
    priceStems: number
    priceExclusive: number
    isExclusiveSold: number
    isVaultLocked: number
    streamCount: number
    downloadCount: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PyrexSpinnaInfiniteTrackAvgAggregateInputType = {
    bpm?: true
    priceMp3?: true
    priceWav?: true
    priceStems?: true
    priceExclusive?: true
    streamCount?: true
    downloadCount?: true
  }

  export type PyrexSpinnaInfiniteTrackSumAggregateInputType = {
    bpm?: true
    priceMp3?: true
    priceWav?: true
    priceStems?: true
    priceExclusive?: true
    streamCount?: true
    downloadCount?: true
  }

  export type PyrexSpinnaInfiniteTrackMinAggregateInputType = {
    id?: true
    title?: true
    slug?: true
    bpm?: true
    keySignature?: true
    genre?: true
    subGenre?: true
    awsAudioUrl?: true
    awsArtworkUrl?: true
    r2AudioUrl?: true
    r2ArtworkUrl?: true
    archiveAudioUrl?: true
    archiveArtworkUrl?: true
    vercelAudioUrl?: true
    vercelArtworkUrl?: true
    watermarkedAudioUrl?: true
    storageClusterNode?: true
    priceMp3?: true
    priceWav?: true
    priceStems?: true
    priceExclusive?: true
    isExclusiveSold?: true
    isVaultLocked?: true
    streamCount?: true
    downloadCount?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PyrexSpinnaInfiniteTrackMaxAggregateInputType = {
    id?: true
    title?: true
    slug?: true
    bpm?: true
    keySignature?: true
    genre?: true
    subGenre?: true
    awsAudioUrl?: true
    awsArtworkUrl?: true
    r2AudioUrl?: true
    r2ArtworkUrl?: true
    archiveAudioUrl?: true
    archiveArtworkUrl?: true
    vercelAudioUrl?: true
    vercelArtworkUrl?: true
    watermarkedAudioUrl?: true
    storageClusterNode?: true
    priceMp3?: true
    priceWav?: true
    priceStems?: true
    priceExclusive?: true
    isExclusiveSold?: true
    isVaultLocked?: true
    streamCount?: true
    downloadCount?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PyrexSpinnaInfiniteTrackCountAggregateInputType = {
    id?: true
    title?: true
    slug?: true
    bpm?: true
    keySignature?: true
    genre?: true
    subGenre?: true
    moodTags?: true
    awsAudioUrl?: true
    awsArtworkUrl?: true
    r2AudioUrl?: true
    r2ArtworkUrl?: true
    archiveAudioUrl?: true
    archiveArtworkUrl?: true
    vercelAudioUrl?: true
    vercelArtworkUrl?: true
    watermarkedAudioUrl?: true
    storageClusterNode?: true
    priceMp3?: true
    priceWav?: true
    priceStems?: true
    priceExclusive?: true
    isExclusiveSold?: true
    isVaultLocked?: true
    streamCount?: true
    downloadCount?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PyrexSpinnaInfiniteTrackAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PyrexSpinnaInfiniteTrack to aggregate.
     */
    where?: PyrexSpinnaInfiniteTrackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PyrexSpinnaInfiniteTracks to fetch.
     */
    orderBy?: PyrexSpinnaInfiniteTrackOrderByWithRelationInput | PyrexSpinnaInfiniteTrackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PyrexSpinnaInfiniteTrackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PyrexSpinnaInfiniteTracks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PyrexSpinnaInfiniteTracks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PyrexSpinnaInfiniteTracks
    **/
    _count?: true | PyrexSpinnaInfiniteTrackCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PyrexSpinnaInfiniteTrackAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PyrexSpinnaInfiniteTrackSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PyrexSpinnaInfiniteTrackMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PyrexSpinnaInfiniteTrackMaxAggregateInputType
  }

  export type GetPyrexSpinnaInfiniteTrackAggregateType<T extends PyrexSpinnaInfiniteTrackAggregateArgs> = {
        [P in keyof T & keyof AggregatePyrexSpinnaInfiniteTrack]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePyrexSpinnaInfiniteTrack[P]>
      : GetScalarType<T[P], AggregatePyrexSpinnaInfiniteTrack[P]>
  }




  export type PyrexSpinnaInfiniteTrackGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PyrexSpinnaInfiniteTrackWhereInput
    orderBy?: PyrexSpinnaInfiniteTrackOrderByWithAggregationInput | PyrexSpinnaInfiniteTrackOrderByWithAggregationInput[]
    by: PyrexSpinnaInfiniteTrackScalarFieldEnum[] | PyrexSpinnaInfiniteTrackScalarFieldEnum
    having?: PyrexSpinnaInfiniteTrackScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PyrexSpinnaInfiniteTrackCountAggregateInputType | true
    _avg?: PyrexSpinnaInfiniteTrackAvgAggregateInputType
    _sum?: PyrexSpinnaInfiniteTrackSumAggregateInputType
    _min?: PyrexSpinnaInfiniteTrackMinAggregateInputType
    _max?: PyrexSpinnaInfiniteTrackMaxAggregateInputType
  }

  export type PyrexSpinnaInfiniteTrackGroupByOutputType = {
    id: string
    title: string
    slug: string
    bpm: number
    keySignature: string
    genre: string
    subGenre: string | null
    moodTags: string[]
    awsAudioUrl: string | null
    awsArtworkUrl: string | null
    r2AudioUrl: string | null
    r2ArtworkUrl: string | null
    archiveAudioUrl: string | null
    archiveArtworkUrl: string | null
    vercelAudioUrl: string | null
    vercelArtworkUrl: string | null
    watermarkedAudioUrl: string | null
    storageClusterNode: string
    priceMp3: number
    priceWav: number
    priceStems: number
    priceExclusive: number
    isExclusiveSold: boolean
    isVaultLocked: boolean
    streamCount: number
    downloadCount: number
    createdAt: Date
    updatedAt: Date
    _count: PyrexSpinnaInfiniteTrackCountAggregateOutputType | null
    _avg: PyrexSpinnaInfiniteTrackAvgAggregateOutputType | null
    _sum: PyrexSpinnaInfiniteTrackSumAggregateOutputType | null
    _min: PyrexSpinnaInfiniteTrackMinAggregateOutputType | null
    _max: PyrexSpinnaInfiniteTrackMaxAggregateOutputType | null
  }

  type GetPyrexSpinnaInfiniteTrackGroupByPayload<T extends PyrexSpinnaInfiniteTrackGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PyrexSpinnaInfiniteTrackGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PyrexSpinnaInfiniteTrackGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PyrexSpinnaInfiniteTrackGroupByOutputType[P]>
            : GetScalarType<T[P], PyrexSpinnaInfiniteTrackGroupByOutputType[P]>
        }
      >
    >


  export type PyrexSpinnaInfiniteTrackSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    slug?: boolean
    bpm?: boolean
    keySignature?: boolean
    genre?: boolean
    subGenre?: boolean
    moodTags?: boolean
    awsAudioUrl?: boolean
    awsArtworkUrl?: boolean
    r2AudioUrl?: boolean
    r2ArtworkUrl?: boolean
    archiveAudioUrl?: boolean
    archiveArtworkUrl?: boolean
    vercelAudioUrl?: boolean
    vercelArtworkUrl?: boolean
    watermarkedAudioUrl?: boolean
    storageClusterNode?: boolean
    priceMp3?: boolean
    priceWav?: boolean
    priceStems?: boolean
    priceExclusive?: boolean
    isExclusiveSold?: boolean
    isVaultLocked?: boolean
    streamCount?: boolean
    downloadCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    sales?: boolean | PyrexSpinnaInfiniteTrack$salesArgs<ExtArgs>
    _count?: boolean | PyrexSpinnaInfiniteTrackCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pyrexSpinnaInfiniteTrack"]>

  export type PyrexSpinnaInfiniteTrackSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    slug?: boolean
    bpm?: boolean
    keySignature?: boolean
    genre?: boolean
    subGenre?: boolean
    moodTags?: boolean
    awsAudioUrl?: boolean
    awsArtworkUrl?: boolean
    r2AudioUrl?: boolean
    r2ArtworkUrl?: boolean
    archiveAudioUrl?: boolean
    archiveArtworkUrl?: boolean
    vercelAudioUrl?: boolean
    vercelArtworkUrl?: boolean
    watermarkedAudioUrl?: boolean
    storageClusterNode?: boolean
    priceMp3?: boolean
    priceWav?: boolean
    priceStems?: boolean
    priceExclusive?: boolean
    isExclusiveSold?: boolean
    isVaultLocked?: boolean
    streamCount?: boolean
    downloadCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["pyrexSpinnaInfiniteTrack"]>

  export type PyrexSpinnaInfiniteTrackSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    slug?: boolean
    bpm?: boolean
    keySignature?: boolean
    genre?: boolean
    subGenre?: boolean
    moodTags?: boolean
    awsAudioUrl?: boolean
    awsArtworkUrl?: boolean
    r2AudioUrl?: boolean
    r2ArtworkUrl?: boolean
    archiveAudioUrl?: boolean
    archiveArtworkUrl?: boolean
    vercelAudioUrl?: boolean
    vercelArtworkUrl?: boolean
    watermarkedAudioUrl?: boolean
    storageClusterNode?: boolean
    priceMp3?: boolean
    priceWav?: boolean
    priceStems?: boolean
    priceExclusive?: boolean
    isExclusiveSold?: boolean
    isVaultLocked?: boolean
    streamCount?: boolean
    downloadCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["pyrexSpinnaInfiniteTrack"]>

  export type PyrexSpinnaInfiniteTrackSelectScalar = {
    id?: boolean
    title?: boolean
    slug?: boolean
    bpm?: boolean
    keySignature?: boolean
    genre?: boolean
    subGenre?: boolean
    moodTags?: boolean
    awsAudioUrl?: boolean
    awsArtworkUrl?: boolean
    r2AudioUrl?: boolean
    r2ArtworkUrl?: boolean
    archiveAudioUrl?: boolean
    archiveArtworkUrl?: boolean
    vercelAudioUrl?: boolean
    vercelArtworkUrl?: boolean
    watermarkedAudioUrl?: boolean
    storageClusterNode?: boolean
    priceMp3?: boolean
    priceWav?: boolean
    priceStems?: boolean
    priceExclusive?: boolean
    isExclusiveSold?: boolean
    isVaultLocked?: boolean
    streamCount?: boolean
    downloadCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PyrexSpinnaInfiniteTrackOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "slug" | "bpm" | "keySignature" | "genre" | "subGenre" | "moodTags" | "awsAudioUrl" | "awsArtworkUrl" | "r2AudioUrl" | "r2ArtworkUrl" | "archiveAudioUrl" | "archiveArtworkUrl" | "vercelAudioUrl" | "vercelArtworkUrl" | "watermarkedAudioUrl" | "storageClusterNode" | "priceMp3" | "priceWav" | "priceStems" | "priceExclusive" | "isExclusiveSold" | "isVaultLocked" | "streamCount" | "downloadCount" | "createdAt" | "updatedAt", ExtArgs["result"]["pyrexSpinnaInfiniteTrack"]>
  export type PyrexSpinnaInfiniteTrackInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sales?: boolean | PyrexSpinnaInfiniteTrack$salesArgs<ExtArgs>
    _count?: boolean | PyrexSpinnaInfiniteTrackCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PyrexSpinnaInfiniteTrackIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type PyrexSpinnaInfiniteTrackIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $PyrexSpinnaInfiniteTrackPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PyrexSpinnaInfiniteTrack"
    objects: {
      sales: Prisma.$TransactionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      slug: string
      bpm: number
      keySignature: string
      genre: string
      subGenre: string | null
      moodTags: string[]
      awsAudioUrl: string | null
      awsArtworkUrl: string | null
      r2AudioUrl: string | null
      r2ArtworkUrl: string | null
      archiveAudioUrl: string | null
      archiveArtworkUrl: string | null
      vercelAudioUrl: string | null
      vercelArtworkUrl: string | null
      watermarkedAudioUrl: string | null
      storageClusterNode: string
      priceMp3: number
      priceWav: number
      priceStems: number
      priceExclusive: number
      isExclusiveSold: boolean
      isVaultLocked: boolean
      streamCount: number
      downloadCount: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["pyrexSpinnaInfiniteTrack"]>
    composites: {}
  }

  type PyrexSpinnaInfiniteTrackGetPayload<S extends boolean | null | undefined | PyrexSpinnaInfiniteTrackDefaultArgs> = $Result.GetResult<Prisma.$PyrexSpinnaInfiniteTrackPayload, S>

  type PyrexSpinnaInfiniteTrackCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PyrexSpinnaInfiniteTrackFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PyrexSpinnaInfiniteTrackCountAggregateInputType | true
    }

  export interface PyrexSpinnaInfiniteTrackDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PyrexSpinnaInfiniteTrack'], meta: { name: 'PyrexSpinnaInfiniteTrack' } }
    /**
     * Find zero or one PyrexSpinnaInfiniteTrack that matches the filter.
     * @param {PyrexSpinnaInfiniteTrackFindUniqueArgs} args - Arguments to find a PyrexSpinnaInfiniteTrack
     * @example
     * // Get one PyrexSpinnaInfiniteTrack
     * const pyrexSpinnaInfiniteTrack = await prisma.pyrexSpinnaInfiniteTrack.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PyrexSpinnaInfiniteTrackFindUniqueArgs>(args: SelectSubset<T, PyrexSpinnaInfiniteTrackFindUniqueArgs<ExtArgs>>): Prisma__PyrexSpinnaInfiniteTrackClient<$Result.GetResult<Prisma.$PyrexSpinnaInfiniteTrackPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PyrexSpinnaInfiniteTrack that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PyrexSpinnaInfiniteTrackFindUniqueOrThrowArgs} args - Arguments to find a PyrexSpinnaInfiniteTrack
     * @example
     * // Get one PyrexSpinnaInfiniteTrack
     * const pyrexSpinnaInfiniteTrack = await prisma.pyrexSpinnaInfiniteTrack.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PyrexSpinnaInfiniteTrackFindUniqueOrThrowArgs>(args: SelectSubset<T, PyrexSpinnaInfiniteTrackFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PyrexSpinnaInfiniteTrackClient<$Result.GetResult<Prisma.$PyrexSpinnaInfiniteTrackPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PyrexSpinnaInfiniteTrack that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PyrexSpinnaInfiniteTrackFindFirstArgs} args - Arguments to find a PyrexSpinnaInfiniteTrack
     * @example
     * // Get one PyrexSpinnaInfiniteTrack
     * const pyrexSpinnaInfiniteTrack = await prisma.pyrexSpinnaInfiniteTrack.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PyrexSpinnaInfiniteTrackFindFirstArgs>(args?: SelectSubset<T, PyrexSpinnaInfiniteTrackFindFirstArgs<ExtArgs>>): Prisma__PyrexSpinnaInfiniteTrackClient<$Result.GetResult<Prisma.$PyrexSpinnaInfiniteTrackPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PyrexSpinnaInfiniteTrack that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PyrexSpinnaInfiniteTrackFindFirstOrThrowArgs} args - Arguments to find a PyrexSpinnaInfiniteTrack
     * @example
     * // Get one PyrexSpinnaInfiniteTrack
     * const pyrexSpinnaInfiniteTrack = await prisma.pyrexSpinnaInfiniteTrack.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PyrexSpinnaInfiniteTrackFindFirstOrThrowArgs>(args?: SelectSubset<T, PyrexSpinnaInfiniteTrackFindFirstOrThrowArgs<ExtArgs>>): Prisma__PyrexSpinnaInfiniteTrackClient<$Result.GetResult<Prisma.$PyrexSpinnaInfiniteTrackPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PyrexSpinnaInfiniteTracks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PyrexSpinnaInfiniteTrackFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PyrexSpinnaInfiniteTracks
     * const pyrexSpinnaInfiniteTracks = await prisma.pyrexSpinnaInfiniteTrack.findMany()
     * 
     * // Get first 10 PyrexSpinnaInfiniteTracks
     * const pyrexSpinnaInfiniteTracks = await prisma.pyrexSpinnaInfiniteTrack.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const pyrexSpinnaInfiniteTrackWithIdOnly = await prisma.pyrexSpinnaInfiniteTrack.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PyrexSpinnaInfiniteTrackFindManyArgs>(args?: SelectSubset<T, PyrexSpinnaInfiniteTrackFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PyrexSpinnaInfiniteTrackPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PyrexSpinnaInfiniteTrack.
     * @param {PyrexSpinnaInfiniteTrackCreateArgs} args - Arguments to create a PyrexSpinnaInfiniteTrack.
     * @example
     * // Create one PyrexSpinnaInfiniteTrack
     * const PyrexSpinnaInfiniteTrack = await prisma.pyrexSpinnaInfiniteTrack.create({
     *   data: {
     *     // ... data to create a PyrexSpinnaInfiniteTrack
     *   }
     * })
     * 
     */
    create<T extends PyrexSpinnaInfiniteTrackCreateArgs>(args: SelectSubset<T, PyrexSpinnaInfiniteTrackCreateArgs<ExtArgs>>): Prisma__PyrexSpinnaInfiniteTrackClient<$Result.GetResult<Prisma.$PyrexSpinnaInfiniteTrackPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PyrexSpinnaInfiniteTracks.
     * @param {PyrexSpinnaInfiniteTrackCreateManyArgs} args - Arguments to create many PyrexSpinnaInfiniteTracks.
     * @example
     * // Create many PyrexSpinnaInfiniteTracks
     * const pyrexSpinnaInfiniteTrack = await prisma.pyrexSpinnaInfiniteTrack.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PyrexSpinnaInfiniteTrackCreateManyArgs>(args?: SelectSubset<T, PyrexSpinnaInfiniteTrackCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PyrexSpinnaInfiniteTracks and returns the data saved in the database.
     * @param {PyrexSpinnaInfiniteTrackCreateManyAndReturnArgs} args - Arguments to create many PyrexSpinnaInfiniteTracks.
     * @example
     * // Create many PyrexSpinnaInfiniteTracks
     * const pyrexSpinnaInfiniteTrack = await prisma.pyrexSpinnaInfiniteTrack.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PyrexSpinnaInfiniteTracks and only return the `id`
     * const pyrexSpinnaInfiniteTrackWithIdOnly = await prisma.pyrexSpinnaInfiniteTrack.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PyrexSpinnaInfiniteTrackCreateManyAndReturnArgs>(args?: SelectSubset<T, PyrexSpinnaInfiniteTrackCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PyrexSpinnaInfiniteTrackPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PyrexSpinnaInfiniteTrack.
     * @param {PyrexSpinnaInfiniteTrackDeleteArgs} args - Arguments to delete one PyrexSpinnaInfiniteTrack.
     * @example
     * // Delete one PyrexSpinnaInfiniteTrack
     * const PyrexSpinnaInfiniteTrack = await prisma.pyrexSpinnaInfiniteTrack.delete({
     *   where: {
     *     // ... filter to delete one PyrexSpinnaInfiniteTrack
     *   }
     * })
     * 
     */
    delete<T extends PyrexSpinnaInfiniteTrackDeleteArgs>(args: SelectSubset<T, PyrexSpinnaInfiniteTrackDeleteArgs<ExtArgs>>): Prisma__PyrexSpinnaInfiniteTrackClient<$Result.GetResult<Prisma.$PyrexSpinnaInfiniteTrackPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PyrexSpinnaInfiniteTrack.
     * @param {PyrexSpinnaInfiniteTrackUpdateArgs} args - Arguments to update one PyrexSpinnaInfiniteTrack.
     * @example
     * // Update one PyrexSpinnaInfiniteTrack
     * const pyrexSpinnaInfiniteTrack = await prisma.pyrexSpinnaInfiniteTrack.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PyrexSpinnaInfiniteTrackUpdateArgs>(args: SelectSubset<T, PyrexSpinnaInfiniteTrackUpdateArgs<ExtArgs>>): Prisma__PyrexSpinnaInfiniteTrackClient<$Result.GetResult<Prisma.$PyrexSpinnaInfiniteTrackPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PyrexSpinnaInfiniteTracks.
     * @param {PyrexSpinnaInfiniteTrackDeleteManyArgs} args - Arguments to filter PyrexSpinnaInfiniteTracks to delete.
     * @example
     * // Delete a few PyrexSpinnaInfiniteTracks
     * const { count } = await prisma.pyrexSpinnaInfiniteTrack.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PyrexSpinnaInfiniteTrackDeleteManyArgs>(args?: SelectSubset<T, PyrexSpinnaInfiniteTrackDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PyrexSpinnaInfiniteTracks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PyrexSpinnaInfiniteTrackUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PyrexSpinnaInfiniteTracks
     * const pyrexSpinnaInfiniteTrack = await prisma.pyrexSpinnaInfiniteTrack.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PyrexSpinnaInfiniteTrackUpdateManyArgs>(args: SelectSubset<T, PyrexSpinnaInfiniteTrackUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PyrexSpinnaInfiniteTracks and returns the data updated in the database.
     * @param {PyrexSpinnaInfiniteTrackUpdateManyAndReturnArgs} args - Arguments to update many PyrexSpinnaInfiniteTracks.
     * @example
     * // Update many PyrexSpinnaInfiniteTracks
     * const pyrexSpinnaInfiniteTrack = await prisma.pyrexSpinnaInfiniteTrack.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PyrexSpinnaInfiniteTracks and only return the `id`
     * const pyrexSpinnaInfiniteTrackWithIdOnly = await prisma.pyrexSpinnaInfiniteTrack.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PyrexSpinnaInfiniteTrackUpdateManyAndReturnArgs>(args: SelectSubset<T, PyrexSpinnaInfiniteTrackUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PyrexSpinnaInfiniteTrackPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PyrexSpinnaInfiniteTrack.
     * @param {PyrexSpinnaInfiniteTrackUpsertArgs} args - Arguments to update or create a PyrexSpinnaInfiniteTrack.
     * @example
     * // Update or create a PyrexSpinnaInfiniteTrack
     * const pyrexSpinnaInfiniteTrack = await prisma.pyrexSpinnaInfiniteTrack.upsert({
     *   create: {
     *     // ... data to create a PyrexSpinnaInfiniteTrack
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PyrexSpinnaInfiniteTrack we want to update
     *   }
     * })
     */
    upsert<T extends PyrexSpinnaInfiniteTrackUpsertArgs>(args: SelectSubset<T, PyrexSpinnaInfiniteTrackUpsertArgs<ExtArgs>>): Prisma__PyrexSpinnaInfiniteTrackClient<$Result.GetResult<Prisma.$PyrexSpinnaInfiniteTrackPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PyrexSpinnaInfiniteTracks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PyrexSpinnaInfiniteTrackCountArgs} args - Arguments to filter PyrexSpinnaInfiniteTracks to count.
     * @example
     * // Count the number of PyrexSpinnaInfiniteTracks
     * const count = await prisma.pyrexSpinnaInfiniteTrack.count({
     *   where: {
     *     // ... the filter for the PyrexSpinnaInfiniteTracks we want to count
     *   }
     * })
    **/
    count<T extends PyrexSpinnaInfiniteTrackCountArgs>(
      args?: Subset<T, PyrexSpinnaInfiniteTrackCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PyrexSpinnaInfiniteTrackCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PyrexSpinnaInfiniteTrack.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PyrexSpinnaInfiniteTrackAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PyrexSpinnaInfiniteTrackAggregateArgs>(args: Subset<T, PyrexSpinnaInfiniteTrackAggregateArgs>): Prisma.PrismaPromise<GetPyrexSpinnaInfiniteTrackAggregateType<T>>

    /**
     * Group by PyrexSpinnaInfiniteTrack.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PyrexSpinnaInfiniteTrackGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PyrexSpinnaInfiniteTrackGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PyrexSpinnaInfiniteTrackGroupByArgs['orderBy'] }
        : { orderBy?: PyrexSpinnaInfiniteTrackGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PyrexSpinnaInfiniteTrackGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPyrexSpinnaInfiniteTrackGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PyrexSpinnaInfiniteTrack model
   */
  readonly fields: PyrexSpinnaInfiniteTrackFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PyrexSpinnaInfiniteTrack.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PyrexSpinnaInfiniteTrackClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sales<T extends PyrexSpinnaInfiniteTrack$salesArgs<ExtArgs> = {}>(args?: Subset<T, PyrexSpinnaInfiniteTrack$salesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PyrexSpinnaInfiniteTrack model
   */
  interface PyrexSpinnaInfiniteTrackFieldRefs {
    readonly id: FieldRef<"PyrexSpinnaInfiniteTrack", 'String'>
    readonly title: FieldRef<"PyrexSpinnaInfiniteTrack", 'String'>
    readonly slug: FieldRef<"PyrexSpinnaInfiniteTrack", 'String'>
    readonly bpm: FieldRef<"PyrexSpinnaInfiniteTrack", 'Int'>
    readonly keySignature: FieldRef<"PyrexSpinnaInfiniteTrack", 'String'>
    readonly genre: FieldRef<"PyrexSpinnaInfiniteTrack", 'String'>
    readonly subGenre: FieldRef<"PyrexSpinnaInfiniteTrack", 'String'>
    readonly moodTags: FieldRef<"PyrexSpinnaInfiniteTrack", 'String[]'>
    readonly awsAudioUrl: FieldRef<"PyrexSpinnaInfiniteTrack", 'String'>
    readonly awsArtworkUrl: FieldRef<"PyrexSpinnaInfiniteTrack", 'String'>
    readonly r2AudioUrl: FieldRef<"PyrexSpinnaInfiniteTrack", 'String'>
    readonly r2ArtworkUrl: FieldRef<"PyrexSpinnaInfiniteTrack", 'String'>
    readonly archiveAudioUrl: FieldRef<"PyrexSpinnaInfiniteTrack", 'String'>
    readonly archiveArtworkUrl: FieldRef<"PyrexSpinnaInfiniteTrack", 'String'>
    readonly vercelAudioUrl: FieldRef<"PyrexSpinnaInfiniteTrack", 'String'>
    readonly vercelArtworkUrl: FieldRef<"PyrexSpinnaInfiniteTrack", 'String'>
    readonly watermarkedAudioUrl: FieldRef<"PyrexSpinnaInfiniteTrack", 'String'>
    readonly storageClusterNode: FieldRef<"PyrexSpinnaInfiniteTrack", 'String'>
    readonly priceMp3: FieldRef<"PyrexSpinnaInfiniteTrack", 'Float'>
    readonly priceWav: FieldRef<"PyrexSpinnaInfiniteTrack", 'Float'>
    readonly priceStems: FieldRef<"PyrexSpinnaInfiniteTrack", 'Float'>
    readonly priceExclusive: FieldRef<"PyrexSpinnaInfiniteTrack", 'Float'>
    readonly isExclusiveSold: FieldRef<"PyrexSpinnaInfiniteTrack", 'Boolean'>
    readonly isVaultLocked: FieldRef<"PyrexSpinnaInfiniteTrack", 'Boolean'>
    readonly streamCount: FieldRef<"PyrexSpinnaInfiniteTrack", 'Int'>
    readonly downloadCount: FieldRef<"PyrexSpinnaInfiniteTrack", 'Int'>
    readonly createdAt: FieldRef<"PyrexSpinnaInfiniteTrack", 'DateTime'>
    readonly updatedAt: FieldRef<"PyrexSpinnaInfiniteTrack", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PyrexSpinnaInfiniteTrack findUnique
   */
  export type PyrexSpinnaInfiniteTrackFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PyrexSpinnaInfiniteTrack
     */
    select?: PyrexSpinnaInfiniteTrackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PyrexSpinnaInfiniteTrack
     */
    omit?: PyrexSpinnaInfiniteTrackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PyrexSpinnaInfiniteTrackInclude<ExtArgs> | null
    /**
     * Filter, which PyrexSpinnaInfiniteTrack to fetch.
     */
    where: PyrexSpinnaInfiniteTrackWhereUniqueInput
  }

  /**
   * PyrexSpinnaInfiniteTrack findUniqueOrThrow
   */
  export type PyrexSpinnaInfiniteTrackFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PyrexSpinnaInfiniteTrack
     */
    select?: PyrexSpinnaInfiniteTrackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PyrexSpinnaInfiniteTrack
     */
    omit?: PyrexSpinnaInfiniteTrackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PyrexSpinnaInfiniteTrackInclude<ExtArgs> | null
    /**
     * Filter, which PyrexSpinnaInfiniteTrack to fetch.
     */
    where: PyrexSpinnaInfiniteTrackWhereUniqueInput
  }

  /**
   * PyrexSpinnaInfiniteTrack findFirst
   */
  export type PyrexSpinnaInfiniteTrackFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PyrexSpinnaInfiniteTrack
     */
    select?: PyrexSpinnaInfiniteTrackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PyrexSpinnaInfiniteTrack
     */
    omit?: PyrexSpinnaInfiniteTrackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PyrexSpinnaInfiniteTrackInclude<ExtArgs> | null
    /**
     * Filter, which PyrexSpinnaInfiniteTrack to fetch.
     */
    where?: PyrexSpinnaInfiniteTrackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PyrexSpinnaInfiniteTracks to fetch.
     */
    orderBy?: PyrexSpinnaInfiniteTrackOrderByWithRelationInput | PyrexSpinnaInfiniteTrackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PyrexSpinnaInfiniteTracks.
     */
    cursor?: PyrexSpinnaInfiniteTrackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PyrexSpinnaInfiniteTracks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PyrexSpinnaInfiniteTracks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PyrexSpinnaInfiniteTracks.
     */
    distinct?: PyrexSpinnaInfiniteTrackScalarFieldEnum | PyrexSpinnaInfiniteTrackScalarFieldEnum[]
  }

  /**
   * PyrexSpinnaInfiniteTrack findFirstOrThrow
   */
  export type PyrexSpinnaInfiniteTrackFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PyrexSpinnaInfiniteTrack
     */
    select?: PyrexSpinnaInfiniteTrackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PyrexSpinnaInfiniteTrack
     */
    omit?: PyrexSpinnaInfiniteTrackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PyrexSpinnaInfiniteTrackInclude<ExtArgs> | null
    /**
     * Filter, which PyrexSpinnaInfiniteTrack to fetch.
     */
    where?: PyrexSpinnaInfiniteTrackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PyrexSpinnaInfiniteTracks to fetch.
     */
    orderBy?: PyrexSpinnaInfiniteTrackOrderByWithRelationInput | PyrexSpinnaInfiniteTrackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PyrexSpinnaInfiniteTracks.
     */
    cursor?: PyrexSpinnaInfiniteTrackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PyrexSpinnaInfiniteTracks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PyrexSpinnaInfiniteTracks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PyrexSpinnaInfiniteTracks.
     */
    distinct?: PyrexSpinnaInfiniteTrackScalarFieldEnum | PyrexSpinnaInfiniteTrackScalarFieldEnum[]
  }

  /**
   * PyrexSpinnaInfiniteTrack findMany
   */
  export type PyrexSpinnaInfiniteTrackFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PyrexSpinnaInfiniteTrack
     */
    select?: PyrexSpinnaInfiniteTrackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PyrexSpinnaInfiniteTrack
     */
    omit?: PyrexSpinnaInfiniteTrackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PyrexSpinnaInfiniteTrackInclude<ExtArgs> | null
    /**
     * Filter, which PyrexSpinnaInfiniteTracks to fetch.
     */
    where?: PyrexSpinnaInfiniteTrackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PyrexSpinnaInfiniteTracks to fetch.
     */
    orderBy?: PyrexSpinnaInfiniteTrackOrderByWithRelationInput | PyrexSpinnaInfiniteTrackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PyrexSpinnaInfiniteTracks.
     */
    cursor?: PyrexSpinnaInfiniteTrackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PyrexSpinnaInfiniteTracks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PyrexSpinnaInfiniteTracks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PyrexSpinnaInfiniteTracks.
     */
    distinct?: PyrexSpinnaInfiniteTrackScalarFieldEnum | PyrexSpinnaInfiniteTrackScalarFieldEnum[]
  }

  /**
   * PyrexSpinnaInfiniteTrack create
   */
  export type PyrexSpinnaInfiniteTrackCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PyrexSpinnaInfiniteTrack
     */
    select?: PyrexSpinnaInfiniteTrackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PyrexSpinnaInfiniteTrack
     */
    omit?: PyrexSpinnaInfiniteTrackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PyrexSpinnaInfiniteTrackInclude<ExtArgs> | null
    /**
     * The data needed to create a PyrexSpinnaInfiniteTrack.
     */
    data: XOR<PyrexSpinnaInfiniteTrackCreateInput, PyrexSpinnaInfiniteTrackUncheckedCreateInput>
  }

  /**
   * PyrexSpinnaInfiniteTrack createMany
   */
  export type PyrexSpinnaInfiniteTrackCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PyrexSpinnaInfiniteTracks.
     */
    data: PyrexSpinnaInfiniteTrackCreateManyInput | PyrexSpinnaInfiniteTrackCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PyrexSpinnaInfiniteTrack createManyAndReturn
   */
  export type PyrexSpinnaInfiniteTrackCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PyrexSpinnaInfiniteTrack
     */
    select?: PyrexSpinnaInfiniteTrackSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PyrexSpinnaInfiniteTrack
     */
    omit?: PyrexSpinnaInfiniteTrackOmit<ExtArgs> | null
    /**
     * The data used to create many PyrexSpinnaInfiniteTracks.
     */
    data: PyrexSpinnaInfiniteTrackCreateManyInput | PyrexSpinnaInfiniteTrackCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PyrexSpinnaInfiniteTrack update
   */
  export type PyrexSpinnaInfiniteTrackUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PyrexSpinnaInfiniteTrack
     */
    select?: PyrexSpinnaInfiniteTrackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PyrexSpinnaInfiniteTrack
     */
    omit?: PyrexSpinnaInfiniteTrackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PyrexSpinnaInfiniteTrackInclude<ExtArgs> | null
    /**
     * The data needed to update a PyrexSpinnaInfiniteTrack.
     */
    data: XOR<PyrexSpinnaInfiniteTrackUpdateInput, PyrexSpinnaInfiniteTrackUncheckedUpdateInput>
    /**
     * Choose, which PyrexSpinnaInfiniteTrack to update.
     */
    where: PyrexSpinnaInfiniteTrackWhereUniqueInput
  }

  /**
   * PyrexSpinnaInfiniteTrack updateMany
   */
  export type PyrexSpinnaInfiniteTrackUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PyrexSpinnaInfiniteTracks.
     */
    data: XOR<PyrexSpinnaInfiniteTrackUpdateManyMutationInput, PyrexSpinnaInfiniteTrackUncheckedUpdateManyInput>
    /**
     * Filter which PyrexSpinnaInfiniteTracks to update
     */
    where?: PyrexSpinnaInfiniteTrackWhereInput
    /**
     * Limit how many PyrexSpinnaInfiniteTracks to update.
     */
    limit?: number
  }

  /**
   * PyrexSpinnaInfiniteTrack updateManyAndReturn
   */
  export type PyrexSpinnaInfiniteTrackUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PyrexSpinnaInfiniteTrack
     */
    select?: PyrexSpinnaInfiniteTrackSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PyrexSpinnaInfiniteTrack
     */
    omit?: PyrexSpinnaInfiniteTrackOmit<ExtArgs> | null
    /**
     * The data used to update PyrexSpinnaInfiniteTracks.
     */
    data: XOR<PyrexSpinnaInfiniteTrackUpdateManyMutationInput, PyrexSpinnaInfiniteTrackUncheckedUpdateManyInput>
    /**
     * Filter which PyrexSpinnaInfiniteTracks to update
     */
    where?: PyrexSpinnaInfiniteTrackWhereInput
    /**
     * Limit how many PyrexSpinnaInfiniteTracks to update.
     */
    limit?: number
  }

  /**
   * PyrexSpinnaInfiniteTrack upsert
   */
  export type PyrexSpinnaInfiniteTrackUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PyrexSpinnaInfiniteTrack
     */
    select?: PyrexSpinnaInfiniteTrackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PyrexSpinnaInfiniteTrack
     */
    omit?: PyrexSpinnaInfiniteTrackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PyrexSpinnaInfiniteTrackInclude<ExtArgs> | null
    /**
     * The filter to search for the PyrexSpinnaInfiniteTrack to update in case it exists.
     */
    where: PyrexSpinnaInfiniteTrackWhereUniqueInput
    /**
     * In case the PyrexSpinnaInfiniteTrack found by the `where` argument doesn't exist, create a new PyrexSpinnaInfiniteTrack with this data.
     */
    create: XOR<PyrexSpinnaInfiniteTrackCreateInput, PyrexSpinnaInfiniteTrackUncheckedCreateInput>
    /**
     * In case the PyrexSpinnaInfiniteTrack was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PyrexSpinnaInfiniteTrackUpdateInput, PyrexSpinnaInfiniteTrackUncheckedUpdateInput>
  }

  /**
   * PyrexSpinnaInfiniteTrack delete
   */
  export type PyrexSpinnaInfiniteTrackDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PyrexSpinnaInfiniteTrack
     */
    select?: PyrexSpinnaInfiniteTrackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PyrexSpinnaInfiniteTrack
     */
    omit?: PyrexSpinnaInfiniteTrackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PyrexSpinnaInfiniteTrackInclude<ExtArgs> | null
    /**
     * Filter which PyrexSpinnaInfiniteTrack to delete.
     */
    where: PyrexSpinnaInfiniteTrackWhereUniqueInput
  }

  /**
   * PyrexSpinnaInfiniteTrack deleteMany
   */
  export type PyrexSpinnaInfiniteTrackDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PyrexSpinnaInfiniteTracks to delete
     */
    where?: PyrexSpinnaInfiniteTrackWhereInput
    /**
     * Limit how many PyrexSpinnaInfiniteTracks to delete.
     */
    limit?: number
  }

  /**
   * PyrexSpinnaInfiniteTrack.sales
   */
  export type PyrexSpinnaInfiniteTrack$salesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    where?: TransactionWhereInput
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    cursor?: TransactionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * PyrexSpinnaInfiniteTrack without action
   */
  export type PyrexSpinnaInfiniteTrackDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PyrexSpinnaInfiniteTrack
     */
    select?: PyrexSpinnaInfiniteTrackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PyrexSpinnaInfiniteTrack
     */
    omit?: PyrexSpinnaInfiniteTrackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PyrexSpinnaInfiniteTrackInclude<ExtArgs> | null
  }


  /**
   * Model Transaction
   */

  export type AggregateTransaction = {
    _count: TransactionCountAggregateOutputType | null
    _avg: TransactionAvgAggregateOutputType | null
    _sum: TransactionSumAggregateOutputType | null
    _min: TransactionMinAggregateOutputType | null
    _max: TransactionMaxAggregateOutputType | null
  }

  export type TransactionAvgAggregateOutputType = {
    amountPaid: number | null
  }

  export type TransactionSumAggregateOutputType = {
    amountPaid: number | null
  }

  export type TransactionMinAggregateOutputType = {
    id: string | null
    trackId: string | null
    buyerEmail: string | null
    licenseType: string | null
    amountPaid: number | null
    paymentGateway: string | null
    licensePdfUrl: string | null
    createdAt: Date | null
  }

  export type TransactionMaxAggregateOutputType = {
    id: string | null
    trackId: string | null
    buyerEmail: string | null
    licenseType: string | null
    amountPaid: number | null
    paymentGateway: string | null
    licensePdfUrl: string | null
    createdAt: Date | null
  }

  export type TransactionCountAggregateOutputType = {
    id: number
    trackId: number
    buyerEmail: number
    licenseType: number
    amountPaid: number
    paymentGateway: number
    licensePdfUrl: number
    createdAt: number
    _all: number
  }


  export type TransactionAvgAggregateInputType = {
    amountPaid?: true
  }

  export type TransactionSumAggregateInputType = {
    amountPaid?: true
  }

  export type TransactionMinAggregateInputType = {
    id?: true
    trackId?: true
    buyerEmail?: true
    licenseType?: true
    amountPaid?: true
    paymentGateway?: true
    licensePdfUrl?: true
    createdAt?: true
  }

  export type TransactionMaxAggregateInputType = {
    id?: true
    trackId?: true
    buyerEmail?: true
    licenseType?: true
    amountPaid?: true
    paymentGateway?: true
    licensePdfUrl?: true
    createdAt?: true
  }

  export type TransactionCountAggregateInputType = {
    id?: true
    trackId?: true
    buyerEmail?: true
    licenseType?: true
    amountPaid?: true
    paymentGateway?: true
    licensePdfUrl?: true
    createdAt?: true
    _all?: true
  }

  export type TransactionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Transaction to aggregate.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Transactions
    **/
    _count?: true | TransactionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TransactionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TransactionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TransactionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TransactionMaxAggregateInputType
  }

  export type GetTransactionAggregateType<T extends TransactionAggregateArgs> = {
        [P in keyof T & keyof AggregateTransaction]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTransaction[P]>
      : GetScalarType<T[P], AggregateTransaction[P]>
  }




  export type TransactionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransactionWhereInput
    orderBy?: TransactionOrderByWithAggregationInput | TransactionOrderByWithAggregationInput[]
    by: TransactionScalarFieldEnum[] | TransactionScalarFieldEnum
    having?: TransactionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TransactionCountAggregateInputType | true
    _avg?: TransactionAvgAggregateInputType
    _sum?: TransactionSumAggregateInputType
    _min?: TransactionMinAggregateInputType
    _max?: TransactionMaxAggregateInputType
  }

  export type TransactionGroupByOutputType = {
    id: string
    trackId: string
    buyerEmail: string
    licenseType: string
    amountPaid: number
    paymentGateway: string
    licensePdfUrl: string
    createdAt: Date
    _count: TransactionCountAggregateOutputType | null
    _avg: TransactionAvgAggregateOutputType | null
    _sum: TransactionSumAggregateOutputType | null
    _min: TransactionMinAggregateOutputType | null
    _max: TransactionMaxAggregateOutputType | null
  }

  type GetTransactionGroupByPayload<T extends TransactionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TransactionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TransactionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TransactionGroupByOutputType[P]>
            : GetScalarType<T[P], TransactionGroupByOutputType[P]>
        }
      >
    >


  export type TransactionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    trackId?: boolean
    buyerEmail?: boolean
    licenseType?: boolean
    amountPaid?: boolean
    paymentGateway?: boolean
    licensePdfUrl?: boolean
    createdAt?: boolean
    track?: boolean | PyrexSpinnaInfiniteTrackDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transaction"]>

  export type TransactionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    trackId?: boolean
    buyerEmail?: boolean
    licenseType?: boolean
    amountPaid?: boolean
    paymentGateway?: boolean
    licensePdfUrl?: boolean
    createdAt?: boolean
    track?: boolean | PyrexSpinnaInfiniteTrackDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transaction"]>

  export type TransactionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    trackId?: boolean
    buyerEmail?: boolean
    licenseType?: boolean
    amountPaid?: boolean
    paymentGateway?: boolean
    licensePdfUrl?: boolean
    createdAt?: boolean
    track?: boolean | PyrexSpinnaInfiniteTrackDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transaction"]>

  export type TransactionSelectScalar = {
    id?: boolean
    trackId?: boolean
    buyerEmail?: boolean
    licenseType?: boolean
    amountPaid?: boolean
    paymentGateway?: boolean
    licensePdfUrl?: boolean
    createdAt?: boolean
  }

  export type TransactionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "trackId" | "buyerEmail" | "licenseType" | "amountPaid" | "paymentGateway" | "licensePdfUrl" | "createdAt", ExtArgs["result"]["transaction"]>
  export type TransactionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    track?: boolean | PyrexSpinnaInfiniteTrackDefaultArgs<ExtArgs>
  }
  export type TransactionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    track?: boolean | PyrexSpinnaInfiniteTrackDefaultArgs<ExtArgs>
  }
  export type TransactionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    track?: boolean | PyrexSpinnaInfiniteTrackDefaultArgs<ExtArgs>
  }

  export type $TransactionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Transaction"
    objects: {
      track: Prisma.$PyrexSpinnaInfiniteTrackPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      trackId: string
      buyerEmail: string
      licenseType: string
      amountPaid: number
      paymentGateway: string
      licensePdfUrl: string
      createdAt: Date
    }, ExtArgs["result"]["transaction"]>
    composites: {}
  }

  type TransactionGetPayload<S extends boolean | null | undefined | TransactionDefaultArgs> = $Result.GetResult<Prisma.$TransactionPayload, S>

  type TransactionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TransactionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TransactionCountAggregateInputType | true
    }

  export interface TransactionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Transaction'], meta: { name: 'Transaction' } }
    /**
     * Find zero or one Transaction that matches the filter.
     * @param {TransactionFindUniqueArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TransactionFindUniqueArgs>(args: SelectSubset<T, TransactionFindUniqueArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Transaction that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TransactionFindUniqueOrThrowArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TransactionFindUniqueOrThrowArgs>(args: SelectSubset<T, TransactionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Transaction that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionFindFirstArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TransactionFindFirstArgs>(args?: SelectSubset<T, TransactionFindFirstArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Transaction that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionFindFirstOrThrowArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TransactionFindFirstOrThrowArgs>(args?: SelectSubset<T, TransactionFindFirstOrThrowArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Transactions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Transactions
     * const transactions = await prisma.transaction.findMany()
     * 
     * // Get first 10 Transactions
     * const transactions = await prisma.transaction.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const transactionWithIdOnly = await prisma.transaction.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TransactionFindManyArgs>(args?: SelectSubset<T, TransactionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Transaction.
     * @param {TransactionCreateArgs} args - Arguments to create a Transaction.
     * @example
     * // Create one Transaction
     * const Transaction = await prisma.transaction.create({
     *   data: {
     *     // ... data to create a Transaction
     *   }
     * })
     * 
     */
    create<T extends TransactionCreateArgs>(args: SelectSubset<T, TransactionCreateArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Transactions.
     * @param {TransactionCreateManyArgs} args - Arguments to create many Transactions.
     * @example
     * // Create many Transactions
     * const transaction = await prisma.transaction.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TransactionCreateManyArgs>(args?: SelectSubset<T, TransactionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Transactions and returns the data saved in the database.
     * @param {TransactionCreateManyAndReturnArgs} args - Arguments to create many Transactions.
     * @example
     * // Create many Transactions
     * const transaction = await prisma.transaction.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Transactions and only return the `id`
     * const transactionWithIdOnly = await prisma.transaction.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TransactionCreateManyAndReturnArgs>(args?: SelectSubset<T, TransactionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Transaction.
     * @param {TransactionDeleteArgs} args - Arguments to delete one Transaction.
     * @example
     * // Delete one Transaction
     * const Transaction = await prisma.transaction.delete({
     *   where: {
     *     // ... filter to delete one Transaction
     *   }
     * })
     * 
     */
    delete<T extends TransactionDeleteArgs>(args: SelectSubset<T, TransactionDeleteArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Transaction.
     * @param {TransactionUpdateArgs} args - Arguments to update one Transaction.
     * @example
     * // Update one Transaction
     * const transaction = await prisma.transaction.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TransactionUpdateArgs>(args: SelectSubset<T, TransactionUpdateArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Transactions.
     * @param {TransactionDeleteManyArgs} args - Arguments to filter Transactions to delete.
     * @example
     * // Delete a few Transactions
     * const { count } = await prisma.transaction.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TransactionDeleteManyArgs>(args?: SelectSubset<T, TransactionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Transactions
     * const transaction = await prisma.transaction.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TransactionUpdateManyArgs>(args: SelectSubset<T, TransactionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Transactions and returns the data updated in the database.
     * @param {TransactionUpdateManyAndReturnArgs} args - Arguments to update many Transactions.
     * @example
     * // Update many Transactions
     * const transaction = await prisma.transaction.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Transactions and only return the `id`
     * const transactionWithIdOnly = await prisma.transaction.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TransactionUpdateManyAndReturnArgs>(args: SelectSubset<T, TransactionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Transaction.
     * @param {TransactionUpsertArgs} args - Arguments to update or create a Transaction.
     * @example
     * // Update or create a Transaction
     * const transaction = await prisma.transaction.upsert({
     *   create: {
     *     // ... data to create a Transaction
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Transaction we want to update
     *   }
     * })
     */
    upsert<T extends TransactionUpsertArgs>(args: SelectSubset<T, TransactionUpsertArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionCountArgs} args - Arguments to filter Transactions to count.
     * @example
     * // Count the number of Transactions
     * const count = await prisma.transaction.count({
     *   where: {
     *     // ... the filter for the Transactions we want to count
     *   }
     * })
    **/
    count<T extends TransactionCountArgs>(
      args?: Subset<T, TransactionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TransactionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Transaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TransactionAggregateArgs>(args: Subset<T, TransactionAggregateArgs>): Prisma.PrismaPromise<GetTransactionAggregateType<T>>

    /**
     * Group by Transaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TransactionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TransactionGroupByArgs['orderBy'] }
        : { orderBy?: TransactionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TransactionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTransactionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Transaction model
   */
  readonly fields: TransactionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Transaction.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TransactionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    track<T extends PyrexSpinnaInfiniteTrackDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PyrexSpinnaInfiniteTrackDefaultArgs<ExtArgs>>): Prisma__PyrexSpinnaInfiniteTrackClient<$Result.GetResult<Prisma.$PyrexSpinnaInfiniteTrackPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Transaction model
   */
  interface TransactionFieldRefs {
    readonly id: FieldRef<"Transaction", 'String'>
    readonly trackId: FieldRef<"Transaction", 'String'>
    readonly buyerEmail: FieldRef<"Transaction", 'String'>
    readonly licenseType: FieldRef<"Transaction", 'String'>
    readonly amountPaid: FieldRef<"Transaction", 'Float'>
    readonly paymentGateway: FieldRef<"Transaction", 'String'>
    readonly licensePdfUrl: FieldRef<"Transaction", 'String'>
    readonly createdAt: FieldRef<"Transaction", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Transaction findUnique
   */
  export type TransactionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction findUniqueOrThrow
   */
  export type TransactionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction findFirst
   */
  export type TransactionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Transactions.
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Transactions.
     */
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Transaction findFirstOrThrow
   */
  export type TransactionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Transactions.
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Transactions.
     */
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Transaction findMany
   */
  export type TransactionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transactions to fetch.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Transactions.
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Transactions.
     */
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Transaction create
   */
  export type TransactionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * The data needed to create a Transaction.
     */
    data: XOR<TransactionCreateInput, TransactionUncheckedCreateInput>
  }

  /**
   * Transaction createMany
   */
  export type TransactionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Transactions.
     */
    data: TransactionCreateManyInput | TransactionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Transaction createManyAndReturn
   */
  export type TransactionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * The data used to create many Transactions.
     */
    data: TransactionCreateManyInput | TransactionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Transaction update
   */
  export type TransactionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * The data needed to update a Transaction.
     */
    data: XOR<TransactionUpdateInput, TransactionUncheckedUpdateInput>
    /**
     * Choose, which Transaction to update.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction updateMany
   */
  export type TransactionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Transactions.
     */
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyInput>
    /**
     * Filter which Transactions to update
     */
    where?: TransactionWhereInput
    /**
     * Limit how many Transactions to update.
     */
    limit?: number
  }

  /**
   * Transaction updateManyAndReturn
   */
  export type TransactionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * The data used to update Transactions.
     */
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyInput>
    /**
     * Filter which Transactions to update
     */
    where?: TransactionWhereInput
    /**
     * Limit how many Transactions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Transaction upsert
   */
  export type TransactionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * The filter to search for the Transaction to update in case it exists.
     */
    where: TransactionWhereUniqueInput
    /**
     * In case the Transaction found by the `where` argument doesn't exist, create a new Transaction with this data.
     */
    create: XOR<TransactionCreateInput, TransactionUncheckedCreateInput>
    /**
     * In case the Transaction was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TransactionUpdateInput, TransactionUncheckedUpdateInput>
  }

  /**
   * Transaction delete
   */
  export type TransactionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter which Transaction to delete.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction deleteMany
   */
  export type TransactionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Transactions to delete
     */
    where?: TransactionWhereInput
    /**
     * Limit how many Transactions to delete.
     */
    limit?: number
  }

  /**
   * Transaction without action
   */
  export type TransactionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
  }


  /**
   * Model RecordPlaque
   */

  export type AggregateRecordPlaque = {
    _count: RecordPlaqueCountAggregateOutputType | null
    _avg: RecordPlaqueAvgAggregateOutputType | null
    _sum: RecordPlaqueSumAggregateOutputType | null
    _min: RecordPlaqueMinAggregateOutputType | null
    _max: RecordPlaqueMaxAggregateOutputType | null
  }

  export type RecordPlaqueAvgAggregateOutputType = {
    price: number | null
  }

  export type RecordPlaqueSumAggregateOutputType = {
    price: number | null
  }

  export type RecordPlaqueMinAggregateOutputType = {
    plaqueId: string | null
    artistName: string | null
    releaseTitle: string | null
    milestoneType: string | null
    frameStyle: string | null
    verificationSourceUrl: string | null
    orderStatus: string | null
    price: number | null
    createdAt: Date | null
  }

  export type RecordPlaqueMaxAggregateOutputType = {
    plaqueId: string | null
    artistName: string | null
    releaseTitle: string | null
    milestoneType: string | null
    frameStyle: string | null
    verificationSourceUrl: string | null
    orderStatus: string | null
    price: number | null
    createdAt: Date | null
  }

  export type RecordPlaqueCountAggregateOutputType = {
    plaqueId: number
    artistName: number
    releaseTitle: number
    milestoneType: number
    frameStyle: number
    verificationSourceUrl: number
    customerShippingAddress: number
    orderStatus: number
    price: number
    createdAt: number
    _all: number
  }


  export type RecordPlaqueAvgAggregateInputType = {
    price?: true
  }

  export type RecordPlaqueSumAggregateInputType = {
    price?: true
  }

  export type RecordPlaqueMinAggregateInputType = {
    plaqueId?: true
    artistName?: true
    releaseTitle?: true
    milestoneType?: true
    frameStyle?: true
    verificationSourceUrl?: true
    orderStatus?: true
    price?: true
    createdAt?: true
  }

  export type RecordPlaqueMaxAggregateInputType = {
    plaqueId?: true
    artistName?: true
    releaseTitle?: true
    milestoneType?: true
    frameStyle?: true
    verificationSourceUrl?: true
    orderStatus?: true
    price?: true
    createdAt?: true
  }

  export type RecordPlaqueCountAggregateInputType = {
    plaqueId?: true
    artistName?: true
    releaseTitle?: true
    milestoneType?: true
    frameStyle?: true
    verificationSourceUrl?: true
    customerShippingAddress?: true
    orderStatus?: true
    price?: true
    createdAt?: true
    _all?: true
  }

  export type RecordPlaqueAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RecordPlaque to aggregate.
     */
    where?: RecordPlaqueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RecordPlaques to fetch.
     */
    orderBy?: RecordPlaqueOrderByWithRelationInput | RecordPlaqueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RecordPlaqueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RecordPlaques from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RecordPlaques.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RecordPlaques
    **/
    _count?: true | RecordPlaqueCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RecordPlaqueAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RecordPlaqueSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RecordPlaqueMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RecordPlaqueMaxAggregateInputType
  }

  export type GetRecordPlaqueAggregateType<T extends RecordPlaqueAggregateArgs> = {
        [P in keyof T & keyof AggregateRecordPlaque]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRecordPlaque[P]>
      : GetScalarType<T[P], AggregateRecordPlaque[P]>
  }




  export type RecordPlaqueGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RecordPlaqueWhereInput
    orderBy?: RecordPlaqueOrderByWithAggregationInput | RecordPlaqueOrderByWithAggregationInput[]
    by: RecordPlaqueScalarFieldEnum[] | RecordPlaqueScalarFieldEnum
    having?: RecordPlaqueScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RecordPlaqueCountAggregateInputType | true
    _avg?: RecordPlaqueAvgAggregateInputType
    _sum?: RecordPlaqueSumAggregateInputType
    _min?: RecordPlaqueMinAggregateInputType
    _max?: RecordPlaqueMaxAggregateInputType
  }

  export type RecordPlaqueGroupByOutputType = {
    plaqueId: string
    artistName: string
    releaseTitle: string
    milestoneType: string
    frameStyle: string
    verificationSourceUrl: string
    customerShippingAddress: JsonValue
    orderStatus: string
    price: number
    createdAt: Date
    _count: RecordPlaqueCountAggregateOutputType | null
    _avg: RecordPlaqueAvgAggregateOutputType | null
    _sum: RecordPlaqueSumAggregateOutputType | null
    _min: RecordPlaqueMinAggregateOutputType | null
    _max: RecordPlaqueMaxAggregateOutputType | null
  }

  type GetRecordPlaqueGroupByPayload<T extends RecordPlaqueGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RecordPlaqueGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RecordPlaqueGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RecordPlaqueGroupByOutputType[P]>
            : GetScalarType<T[P], RecordPlaqueGroupByOutputType[P]>
        }
      >
    >


  export type RecordPlaqueSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    plaqueId?: boolean
    artistName?: boolean
    releaseTitle?: boolean
    milestoneType?: boolean
    frameStyle?: boolean
    verificationSourceUrl?: boolean
    customerShippingAddress?: boolean
    orderStatus?: boolean
    price?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["recordPlaque"]>

  export type RecordPlaqueSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    plaqueId?: boolean
    artistName?: boolean
    releaseTitle?: boolean
    milestoneType?: boolean
    frameStyle?: boolean
    verificationSourceUrl?: boolean
    customerShippingAddress?: boolean
    orderStatus?: boolean
    price?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["recordPlaque"]>

  export type RecordPlaqueSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    plaqueId?: boolean
    artistName?: boolean
    releaseTitle?: boolean
    milestoneType?: boolean
    frameStyle?: boolean
    verificationSourceUrl?: boolean
    customerShippingAddress?: boolean
    orderStatus?: boolean
    price?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["recordPlaque"]>

  export type RecordPlaqueSelectScalar = {
    plaqueId?: boolean
    artistName?: boolean
    releaseTitle?: boolean
    milestoneType?: boolean
    frameStyle?: boolean
    verificationSourceUrl?: boolean
    customerShippingAddress?: boolean
    orderStatus?: boolean
    price?: boolean
    createdAt?: boolean
  }

  export type RecordPlaqueOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"plaqueId" | "artistName" | "releaseTitle" | "milestoneType" | "frameStyle" | "verificationSourceUrl" | "customerShippingAddress" | "orderStatus" | "price" | "createdAt", ExtArgs["result"]["recordPlaque"]>

  export type $RecordPlaquePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RecordPlaque"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      plaqueId: string
      artistName: string
      releaseTitle: string
      milestoneType: string
      frameStyle: string
      verificationSourceUrl: string
      customerShippingAddress: Prisma.JsonValue
      orderStatus: string
      price: number
      createdAt: Date
    }, ExtArgs["result"]["recordPlaque"]>
    composites: {}
  }

  type RecordPlaqueGetPayload<S extends boolean | null | undefined | RecordPlaqueDefaultArgs> = $Result.GetResult<Prisma.$RecordPlaquePayload, S>

  type RecordPlaqueCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RecordPlaqueFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RecordPlaqueCountAggregateInputType | true
    }

  export interface RecordPlaqueDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RecordPlaque'], meta: { name: 'RecordPlaque' } }
    /**
     * Find zero or one RecordPlaque that matches the filter.
     * @param {RecordPlaqueFindUniqueArgs} args - Arguments to find a RecordPlaque
     * @example
     * // Get one RecordPlaque
     * const recordPlaque = await prisma.recordPlaque.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RecordPlaqueFindUniqueArgs>(args: SelectSubset<T, RecordPlaqueFindUniqueArgs<ExtArgs>>): Prisma__RecordPlaqueClient<$Result.GetResult<Prisma.$RecordPlaquePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RecordPlaque that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RecordPlaqueFindUniqueOrThrowArgs} args - Arguments to find a RecordPlaque
     * @example
     * // Get one RecordPlaque
     * const recordPlaque = await prisma.recordPlaque.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RecordPlaqueFindUniqueOrThrowArgs>(args: SelectSubset<T, RecordPlaqueFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RecordPlaqueClient<$Result.GetResult<Prisma.$RecordPlaquePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RecordPlaque that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecordPlaqueFindFirstArgs} args - Arguments to find a RecordPlaque
     * @example
     * // Get one RecordPlaque
     * const recordPlaque = await prisma.recordPlaque.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RecordPlaqueFindFirstArgs>(args?: SelectSubset<T, RecordPlaqueFindFirstArgs<ExtArgs>>): Prisma__RecordPlaqueClient<$Result.GetResult<Prisma.$RecordPlaquePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RecordPlaque that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecordPlaqueFindFirstOrThrowArgs} args - Arguments to find a RecordPlaque
     * @example
     * // Get one RecordPlaque
     * const recordPlaque = await prisma.recordPlaque.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RecordPlaqueFindFirstOrThrowArgs>(args?: SelectSubset<T, RecordPlaqueFindFirstOrThrowArgs<ExtArgs>>): Prisma__RecordPlaqueClient<$Result.GetResult<Prisma.$RecordPlaquePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RecordPlaques that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecordPlaqueFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RecordPlaques
     * const recordPlaques = await prisma.recordPlaque.findMany()
     * 
     * // Get first 10 RecordPlaques
     * const recordPlaques = await prisma.recordPlaque.findMany({ take: 10 })
     * 
     * // Only select the `plaqueId`
     * const recordPlaqueWithPlaqueIdOnly = await prisma.recordPlaque.findMany({ select: { plaqueId: true } })
     * 
     */
    findMany<T extends RecordPlaqueFindManyArgs>(args?: SelectSubset<T, RecordPlaqueFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RecordPlaquePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RecordPlaque.
     * @param {RecordPlaqueCreateArgs} args - Arguments to create a RecordPlaque.
     * @example
     * // Create one RecordPlaque
     * const RecordPlaque = await prisma.recordPlaque.create({
     *   data: {
     *     // ... data to create a RecordPlaque
     *   }
     * })
     * 
     */
    create<T extends RecordPlaqueCreateArgs>(args: SelectSubset<T, RecordPlaqueCreateArgs<ExtArgs>>): Prisma__RecordPlaqueClient<$Result.GetResult<Prisma.$RecordPlaquePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RecordPlaques.
     * @param {RecordPlaqueCreateManyArgs} args - Arguments to create many RecordPlaques.
     * @example
     * // Create many RecordPlaques
     * const recordPlaque = await prisma.recordPlaque.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RecordPlaqueCreateManyArgs>(args?: SelectSubset<T, RecordPlaqueCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RecordPlaques and returns the data saved in the database.
     * @param {RecordPlaqueCreateManyAndReturnArgs} args - Arguments to create many RecordPlaques.
     * @example
     * // Create many RecordPlaques
     * const recordPlaque = await prisma.recordPlaque.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RecordPlaques and only return the `plaqueId`
     * const recordPlaqueWithPlaqueIdOnly = await prisma.recordPlaque.createManyAndReturn({
     *   select: { plaqueId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RecordPlaqueCreateManyAndReturnArgs>(args?: SelectSubset<T, RecordPlaqueCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RecordPlaquePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RecordPlaque.
     * @param {RecordPlaqueDeleteArgs} args - Arguments to delete one RecordPlaque.
     * @example
     * // Delete one RecordPlaque
     * const RecordPlaque = await prisma.recordPlaque.delete({
     *   where: {
     *     // ... filter to delete one RecordPlaque
     *   }
     * })
     * 
     */
    delete<T extends RecordPlaqueDeleteArgs>(args: SelectSubset<T, RecordPlaqueDeleteArgs<ExtArgs>>): Prisma__RecordPlaqueClient<$Result.GetResult<Prisma.$RecordPlaquePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RecordPlaque.
     * @param {RecordPlaqueUpdateArgs} args - Arguments to update one RecordPlaque.
     * @example
     * // Update one RecordPlaque
     * const recordPlaque = await prisma.recordPlaque.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RecordPlaqueUpdateArgs>(args: SelectSubset<T, RecordPlaqueUpdateArgs<ExtArgs>>): Prisma__RecordPlaqueClient<$Result.GetResult<Prisma.$RecordPlaquePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RecordPlaques.
     * @param {RecordPlaqueDeleteManyArgs} args - Arguments to filter RecordPlaques to delete.
     * @example
     * // Delete a few RecordPlaques
     * const { count } = await prisma.recordPlaque.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RecordPlaqueDeleteManyArgs>(args?: SelectSubset<T, RecordPlaqueDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RecordPlaques.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecordPlaqueUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RecordPlaques
     * const recordPlaque = await prisma.recordPlaque.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RecordPlaqueUpdateManyArgs>(args: SelectSubset<T, RecordPlaqueUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RecordPlaques and returns the data updated in the database.
     * @param {RecordPlaqueUpdateManyAndReturnArgs} args - Arguments to update many RecordPlaques.
     * @example
     * // Update many RecordPlaques
     * const recordPlaque = await prisma.recordPlaque.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RecordPlaques and only return the `plaqueId`
     * const recordPlaqueWithPlaqueIdOnly = await prisma.recordPlaque.updateManyAndReturn({
     *   select: { plaqueId: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RecordPlaqueUpdateManyAndReturnArgs>(args: SelectSubset<T, RecordPlaqueUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RecordPlaquePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RecordPlaque.
     * @param {RecordPlaqueUpsertArgs} args - Arguments to update or create a RecordPlaque.
     * @example
     * // Update or create a RecordPlaque
     * const recordPlaque = await prisma.recordPlaque.upsert({
     *   create: {
     *     // ... data to create a RecordPlaque
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RecordPlaque we want to update
     *   }
     * })
     */
    upsert<T extends RecordPlaqueUpsertArgs>(args: SelectSubset<T, RecordPlaqueUpsertArgs<ExtArgs>>): Prisma__RecordPlaqueClient<$Result.GetResult<Prisma.$RecordPlaquePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RecordPlaques.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecordPlaqueCountArgs} args - Arguments to filter RecordPlaques to count.
     * @example
     * // Count the number of RecordPlaques
     * const count = await prisma.recordPlaque.count({
     *   where: {
     *     // ... the filter for the RecordPlaques we want to count
     *   }
     * })
    **/
    count<T extends RecordPlaqueCountArgs>(
      args?: Subset<T, RecordPlaqueCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RecordPlaqueCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RecordPlaque.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecordPlaqueAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RecordPlaqueAggregateArgs>(args: Subset<T, RecordPlaqueAggregateArgs>): Prisma.PrismaPromise<GetRecordPlaqueAggregateType<T>>

    /**
     * Group by RecordPlaque.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RecordPlaqueGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RecordPlaqueGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RecordPlaqueGroupByArgs['orderBy'] }
        : { orderBy?: RecordPlaqueGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RecordPlaqueGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRecordPlaqueGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RecordPlaque model
   */
  readonly fields: RecordPlaqueFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RecordPlaque.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RecordPlaqueClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RecordPlaque model
   */
  interface RecordPlaqueFieldRefs {
    readonly plaqueId: FieldRef<"RecordPlaque", 'String'>
    readonly artistName: FieldRef<"RecordPlaque", 'String'>
    readonly releaseTitle: FieldRef<"RecordPlaque", 'String'>
    readonly milestoneType: FieldRef<"RecordPlaque", 'String'>
    readonly frameStyle: FieldRef<"RecordPlaque", 'String'>
    readonly verificationSourceUrl: FieldRef<"RecordPlaque", 'String'>
    readonly customerShippingAddress: FieldRef<"RecordPlaque", 'Json'>
    readonly orderStatus: FieldRef<"RecordPlaque", 'String'>
    readonly price: FieldRef<"RecordPlaque", 'Float'>
    readonly createdAt: FieldRef<"RecordPlaque", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RecordPlaque findUnique
   */
  export type RecordPlaqueFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecordPlaque
     */
    select?: RecordPlaqueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecordPlaque
     */
    omit?: RecordPlaqueOmit<ExtArgs> | null
    /**
     * Filter, which RecordPlaque to fetch.
     */
    where: RecordPlaqueWhereUniqueInput
  }

  /**
   * RecordPlaque findUniqueOrThrow
   */
  export type RecordPlaqueFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecordPlaque
     */
    select?: RecordPlaqueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecordPlaque
     */
    omit?: RecordPlaqueOmit<ExtArgs> | null
    /**
     * Filter, which RecordPlaque to fetch.
     */
    where: RecordPlaqueWhereUniqueInput
  }

  /**
   * RecordPlaque findFirst
   */
  export type RecordPlaqueFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecordPlaque
     */
    select?: RecordPlaqueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecordPlaque
     */
    omit?: RecordPlaqueOmit<ExtArgs> | null
    /**
     * Filter, which RecordPlaque to fetch.
     */
    where?: RecordPlaqueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RecordPlaques to fetch.
     */
    orderBy?: RecordPlaqueOrderByWithRelationInput | RecordPlaqueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RecordPlaques.
     */
    cursor?: RecordPlaqueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RecordPlaques from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RecordPlaques.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RecordPlaques.
     */
    distinct?: RecordPlaqueScalarFieldEnum | RecordPlaqueScalarFieldEnum[]
  }

  /**
   * RecordPlaque findFirstOrThrow
   */
  export type RecordPlaqueFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecordPlaque
     */
    select?: RecordPlaqueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecordPlaque
     */
    omit?: RecordPlaqueOmit<ExtArgs> | null
    /**
     * Filter, which RecordPlaque to fetch.
     */
    where?: RecordPlaqueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RecordPlaques to fetch.
     */
    orderBy?: RecordPlaqueOrderByWithRelationInput | RecordPlaqueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RecordPlaques.
     */
    cursor?: RecordPlaqueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RecordPlaques from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RecordPlaques.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RecordPlaques.
     */
    distinct?: RecordPlaqueScalarFieldEnum | RecordPlaqueScalarFieldEnum[]
  }

  /**
   * RecordPlaque findMany
   */
  export type RecordPlaqueFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecordPlaque
     */
    select?: RecordPlaqueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecordPlaque
     */
    omit?: RecordPlaqueOmit<ExtArgs> | null
    /**
     * Filter, which RecordPlaques to fetch.
     */
    where?: RecordPlaqueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RecordPlaques to fetch.
     */
    orderBy?: RecordPlaqueOrderByWithRelationInput | RecordPlaqueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RecordPlaques.
     */
    cursor?: RecordPlaqueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RecordPlaques from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RecordPlaques.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RecordPlaques.
     */
    distinct?: RecordPlaqueScalarFieldEnum | RecordPlaqueScalarFieldEnum[]
  }

  /**
   * RecordPlaque create
   */
  export type RecordPlaqueCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecordPlaque
     */
    select?: RecordPlaqueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecordPlaque
     */
    omit?: RecordPlaqueOmit<ExtArgs> | null
    /**
     * The data needed to create a RecordPlaque.
     */
    data: XOR<RecordPlaqueCreateInput, RecordPlaqueUncheckedCreateInput>
  }

  /**
   * RecordPlaque createMany
   */
  export type RecordPlaqueCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RecordPlaques.
     */
    data: RecordPlaqueCreateManyInput | RecordPlaqueCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RecordPlaque createManyAndReturn
   */
  export type RecordPlaqueCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecordPlaque
     */
    select?: RecordPlaqueSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RecordPlaque
     */
    omit?: RecordPlaqueOmit<ExtArgs> | null
    /**
     * The data used to create many RecordPlaques.
     */
    data: RecordPlaqueCreateManyInput | RecordPlaqueCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RecordPlaque update
   */
  export type RecordPlaqueUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecordPlaque
     */
    select?: RecordPlaqueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecordPlaque
     */
    omit?: RecordPlaqueOmit<ExtArgs> | null
    /**
     * The data needed to update a RecordPlaque.
     */
    data: XOR<RecordPlaqueUpdateInput, RecordPlaqueUncheckedUpdateInput>
    /**
     * Choose, which RecordPlaque to update.
     */
    where: RecordPlaqueWhereUniqueInput
  }

  /**
   * RecordPlaque updateMany
   */
  export type RecordPlaqueUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RecordPlaques.
     */
    data: XOR<RecordPlaqueUpdateManyMutationInput, RecordPlaqueUncheckedUpdateManyInput>
    /**
     * Filter which RecordPlaques to update
     */
    where?: RecordPlaqueWhereInput
    /**
     * Limit how many RecordPlaques to update.
     */
    limit?: number
  }

  /**
   * RecordPlaque updateManyAndReturn
   */
  export type RecordPlaqueUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecordPlaque
     */
    select?: RecordPlaqueSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RecordPlaque
     */
    omit?: RecordPlaqueOmit<ExtArgs> | null
    /**
     * The data used to update RecordPlaques.
     */
    data: XOR<RecordPlaqueUpdateManyMutationInput, RecordPlaqueUncheckedUpdateManyInput>
    /**
     * Filter which RecordPlaques to update
     */
    where?: RecordPlaqueWhereInput
    /**
     * Limit how many RecordPlaques to update.
     */
    limit?: number
  }

  /**
   * RecordPlaque upsert
   */
  export type RecordPlaqueUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecordPlaque
     */
    select?: RecordPlaqueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecordPlaque
     */
    omit?: RecordPlaqueOmit<ExtArgs> | null
    /**
     * The filter to search for the RecordPlaque to update in case it exists.
     */
    where: RecordPlaqueWhereUniqueInput
    /**
     * In case the RecordPlaque found by the `where` argument doesn't exist, create a new RecordPlaque with this data.
     */
    create: XOR<RecordPlaqueCreateInput, RecordPlaqueUncheckedCreateInput>
    /**
     * In case the RecordPlaque was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RecordPlaqueUpdateInput, RecordPlaqueUncheckedUpdateInput>
  }

  /**
   * RecordPlaque delete
   */
  export type RecordPlaqueDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecordPlaque
     */
    select?: RecordPlaqueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecordPlaque
     */
    omit?: RecordPlaqueOmit<ExtArgs> | null
    /**
     * Filter which RecordPlaque to delete.
     */
    where: RecordPlaqueWhereUniqueInput
  }

  /**
   * RecordPlaque deleteMany
   */
  export type RecordPlaqueDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RecordPlaques to delete
     */
    where?: RecordPlaqueWhereInput
    /**
     * Limit how many RecordPlaques to delete.
     */
    limit?: number
  }

  /**
   * RecordPlaque without action
   */
  export type RecordPlaqueDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RecordPlaque
     */
    select?: RecordPlaqueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RecordPlaque
     */
    omit?: RecordPlaqueOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const PyrexSpinnaInfiniteTrackScalarFieldEnum: {
    id: 'id',
    title: 'title',
    slug: 'slug',
    bpm: 'bpm',
    keySignature: 'keySignature',
    genre: 'genre',
    subGenre: 'subGenre',
    moodTags: 'moodTags',
    awsAudioUrl: 'awsAudioUrl',
    awsArtworkUrl: 'awsArtworkUrl',
    r2AudioUrl: 'r2AudioUrl',
    r2ArtworkUrl: 'r2ArtworkUrl',
    archiveAudioUrl: 'archiveAudioUrl',
    archiveArtworkUrl: 'archiveArtworkUrl',
    vercelAudioUrl: 'vercelAudioUrl',
    vercelArtworkUrl: 'vercelArtworkUrl',
    watermarkedAudioUrl: 'watermarkedAudioUrl',
    storageClusterNode: 'storageClusterNode',
    priceMp3: 'priceMp3',
    priceWav: 'priceWav',
    priceStems: 'priceStems',
    priceExclusive: 'priceExclusive',
    isExclusiveSold: 'isExclusiveSold',
    isVaultLocked: 'isVaultLocked',
    streamCount: 'streamCount',
    downloadCount: 'downloadCount',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PyrexSpinnaInfiniteTrackScalarFieldEnum = (typeof PyrexSpinnaInfiniteTrackScalarFieldEnum)[keyof typeof PyrexSpinnaInfiniteTrackScalarFieldEnum]


  export const TransactionScalarFieldEnum: {
    id: 'id',
    trackId: 'trackId',
    buyerEmail: 'buyerEmail',
    licenseType: 'licenseType',
    amountPaid: 'amountPaid',
    paymentGateway: 'paymentGateway',
    licensePdfUrl: 'licensePdfUrl',
    createdAt: 'createdAt'
  };

  export type TransactionScalarFieldEnum = (typeof TransactionScalarFieldEnum)[keyof typeof TransactionScalarFieldEnum]


  export const RecordPlaqueScalarFieldEnum: {
    plaqueId: 'plaqueId',
    artistName: 'artistName',
    releaseTitle: 'releaseTitle',
    milestoneType: 'milestoneType',
    frameStyle: 'frameStyle',
    verificationSourceUrl: 'verificationSourceUrl',
    customerShippingAddress: 'customerShippingAddress',
    orderStatus: 'orderStatus',
    price: 'price',
    createdAt: 'createdAt'
  };

  export type RecordPlaqueScalarFieldEnum = (typeof RecordPlaqueScalarFieldEnum)[keyof typeof RecordPlaqueScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    
  /**
   * Deep Input Types
   */


  export type PyrexSpinnaInfiniteTrackWhereInput = {
    AND?: PyrexSpinnaInfiniteTrackWhereInput | PyrexSpinnaInfiniteTrackWhereInput[]
    OR?: PyrexSpinnaInfiniteTrackWhereInput[]
    NOT?: PyrexSpinnaInfiniteTrackWhereInput | PyrexSpinnaInfiniteTrackWhereInput[]
    id?: StringFilter<"PyrexSpinnaInfiniteTrack"> | string
    title?: StringFilter<"PyrexSpinnaInfiniteTrack"> | string
    slug?: StringFilter<"PyrexSpinnaInfiniteTrack"> | string
    bpm?: IntFilter<"PyrexSpinnaInfiniteTrack"> | number
    keySignature?: StringFilter<"PyrexSpinnaInfiniteTrack"> | string
    genre?: StringFilter<"PyrexSpinnaInfiniteTrack"> | string
    subGenre?: StringNullableFilter<"PyrexSpinnaInfiniteTrack"> | string | null
    moodTags?: StringNullableListFilter<"PyrexSpinnaInfiniteTrack">
    awsAudioUrl?: StringNullableFilter<"PyrexSpinnaInfiniteTrack"> | string | null
    awsArtworkUrl?: StringNullableFilter<"PyrexSpinnaInfiniteTrack"> | string | null
    r2AudioUrl?: StringNullableFilter<"PyrexSpinnaInfiniteTrack"> | string | null
    r2ArtworkUrl?: StringNullableFilter<"PyrexSpinnaInfiniteTrack"> | string | null
    archiveAudioUrl?: StringNullableFilter<"PyrexSpinnaInfiniteTrack"> | string | null
    archiveArtworkUrl?: StringNullableFilter<"PyrexSpinnaInfiniteTrack"> | string | null
    vercelAudioUrl?: StringNullableFilter<"PyrexSpinnaInfiniteTrack"> | string | null
    vercelArtworkUrl?: StringNullableFilter<"PyrexSpinnaInfiniteTrack"> | string | null
    watermarkedAudioUrl?: StringNullableFilter<"PyrexSpinnaInfiniteTrack"> | string | null
    storageClusterNode?: StringFilter<"PyrexSpinnaInfiniteTrack"> | string
    priceMp3?: FloatFilter<"PyrexSpinnaInfiniteTrack"> | number
    priceWav?: FloatFilter<"PyrexSpinnaInfiniteTrack"> | number
    priceStems?: FloatFilter<"PyrexSpinnaInfiniteTrack"> | number
    priceExclusive?: FloatFilter<"PyrexSpinnaInfiniteTrack"> | number
    isExclusiveSold?: BoolFilter<"PyrexSpinnaInfiniteTrack"> | boolean
    isVaultLocked?: BoolFilter<"PyrexSpinnaInfiniteTrack"> | boolean
    streamCount?: IntFilter<"PyrexSpinnaInfiniteTrack"> | number
    downloadCount?: IntFilter<"PyrexSpinnaInfiniteTrack"> | number
    createdAt?: DateTimeFilter<"PyrexSpinnaInfiniteTrack"> | Date | string
    updatedAt?: DateTimeFilter<"PyrexSpinnaInfiniteTrack"> | Date | string
    sales?: TransactionListRelationFilter
  }

  export type PyrexSpinnaInfiniteTrackOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    bpm?: SortOrder
    keySignature?: SortOrder
    genre?: SortOrder
    subGenre?: SortOrderInput | SortOrder
    moodTags?: SortOrder
    awsAudioUrl?: SortOrderInput | SortOrder
    awsArtworkUrl?: SortOrderInput | SortOrder
    r2AudioUrl?: SortOrderInput | SortOrder
    r2ArtworkUrl?: SortOrderInput | SortOrder
    archiveAudioUrl?: SortOrderInput | SortOrder
    archiveArtworkUrl?: SortOrderInput | SortOrder
    vercelAudioUrl?: SortOrderInput | SortOrder
    vercelArtworkUrl?: SortOrderInput | SortOrder
    watermarkedAudioUrl?: SortOrderInput | SortOrder
    storageClusterNode?: SortOrder
    priceMp3?: SortOrder
    priceWav?: SortOrder
    priceStems?: SortOrder
    priceExclusive?: SortOrder
    isExclusiveSold?: SortOrder
    isVaultLocked?: SortOrder
    streamCount?: SortOrder
    downloadCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    sales?: TransactionOrderByRelationAggregateInput
  }

  export type PyrexSpinnaInfiniteTrackWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    slug?: string
    AND?: PyrexSpinnaInfiniteTrackWhereInput | PyrexSpinnaInfiniteTrackWhereInput[]
    OR?: PyrexSpinnaInfiniteTrackWhereInput[]
    NOT?: PyrexSpinnaInfiniteTrackWhereInput | PyrexSpinnaInfiniteTrackWhereInput[]
    title?: StringFilter<"PyrexSpinnaInfiniteTrack"> | string
    bpm?: IntFilter<"PyrexSpinnaInfiniteTrack"> | number
    keySignature?: StringFilter<"PyrexSpinnaInfiniteTrack"> | string
    genre?: StringFilter<"PyrexSpinnaInfiniteTrack"> | string
    subGenre?: StringNullableFilter<"PyrexSpinnaInfiniteTrack"> | string | null
    moodTags?: StringNullableListFilter<"PyrexSpinnaInfiniteTrack">
    awsAudioUrl?: StringNullableFilter<"PyrexSpinnaInfiniteTrack"> | string | null
    awsArtworkUrl?: StringNullableFilter<"PyrexSpinnaInfiniteTrack"> | string | null
    r2AudioUrl?: StringNullableFilter<"PyrexSpinnaInfiniteTrack"> | string | null
    r2ArtworkUrl?: StringNullableFilter<"PyrexSpinnaInfiniteTrack"> | string | null
    archiveAudioUrl?: StringNullableFilter<"PyrexSpinnaInfiniteTrack"> | string | null
    archiveArtworkUrl?: StringNullableFilter<"PyrexSpinnaInfiniteTrack"> | string | null
    vercelAudioUrl?: StringNullableFilter<"PyrexSpinnaInfiniteTrack"> | string | null
    vercelArtworkUrl?: StringNullableFilter<"PyrexSpinnaInfiniteTrack"> | string | null
    watermarkedAudioUrl?: StringNullableFilter<"PyrexSpinnaInfiniteTrack"> | string | null
    storageClusterNode?: StringFilter<"PyrexSpinnaInfiniteTrack"> | string
    priceMp3?: FloatFilter<"PyrexSpinnaInfiniteTrack"> | number
    priceWav?: FloatFilter<"PyrexSpinnaInfiniteTrack"> | number
    priceStems?: FloatFilter<"PyrexSpinnaInfiniteTrack"> | number
    priceExclusive?: FloatFilter<"PyrexSpinnaInfiniteTrack"> | number
    isExclusiveSold?: BoolFilter<"PyrexSpinnaInfiniteTrack"> | boolean
    isVaultLocked?: BoolFilter<"PyrexSpinnaInfiniteTrack"> | boolean
    streamCount?: IntFilter<"PyrexSpinnaInfiniteTrack"> | number
    downloadCount?: IntFilter<"PyrexSpinnaInfiniteTrack"> | number
    createdAt?: DateTimeFilter<"PyrexSpinnaInfiniteTrack"> | Date | string
    updatedAt?: DateTimeFilter<"PyrexSpinnaInfiniteTrack"> | Date | string
    sales?: TransactionListRelationFilter
  }, "id" | "slug">

  export type PyrexSpinnaInfiniteTrackOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    bpm?: SortOrder
    keySignature?: SortOrder
    genre?: SortOrder
    subGenre?: SortOrderInput | SortOrder
    moodTags?: SortOrder
    awsAudioUrl?: SortOrderInput | SortOrder
    awsArtworkUrl?: SortOrderInput | SortOrder
    r2AudioUrl?: SortOrderInput | SortOrder
    r2ArtworkUrl?: SortOrderInput | SortOrder
    archiveAudioUrl?: SortOrderInput | SortOrder
    archiveArtworkUrl?: SortOrderInput | SortOrder
    vercelAudioUrl?: SortOrderInput | SortOrder
    vercelArtworkUrl?: SortOrderInput | SortOrder
    watermarkedAudioUrl?: SortOrderInput | SortOrder
    storageClusterNode?: SortOrder
    priceMp3?: SortOrder
    priceWav?: SortOrder
    priceStems?: SortOrder
    priceExclusive?: SortOrder
    isExclusiveSold?: SortOrder
    isVaultLocked?: SortOrder
    streamCount?: SortOrder
    downloadCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PyrexSpinnaInfiniteTrackCountOrderByAggregateInput
    _avg?: PyrexSpinnaInfiniteTrackAvgOrderByAggregateInput
    _max?: PyrexSpinnaInfiniteTrackMaxOrderByAggregateInput
    _min?: PyrexSpinnaInfiniteTrackMinOrderByAggregateInput
    _sum?: PyrexSpinnaInfiniteTrackSumOrderByAggregateInput
  }

  export type PyrexSpinnaInfiniteTrackScalarWhereWithAggregatesInput = {
    AND?: PyrexSpinnaInfiniteTrackScalarWhereWithAggregatesInput | PyrexSpinnaInfiniteTrackScalarWhereWithAggregatesInput[]
    OR?: PyrexSpinnaInfiniteTrackScalarWhereWithAggregatesInput[]
    NOT?: PyrexSpinnaInfiniteTrackScalarWhereWithAggregatesInput | PyrexSpinnaInfiniteTrackScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PyrexSpinnaInfiniteTrack"> | string
    title?: StringWithAggregatesFilter<"PyrexSpinnaInfiniteTrack"> | string
    slug?: StringWithAggregatesFilter<"PyrexSpinnaInfiniteTrack"> | string
    bpm?: IntWithAggregatesFilter<"PyrexSpinnaInfiniteTrack"> | number
    keySignature?: StringWithAggregatesFilter<"PyrexSpinnaInfiniteTrack"> | string
    genre?: StringWithAggregatesFilter<"PyrexSpinnaInfiniteTrack"> | string
    subGenre?: StringNullableWithAggregatesFilter<"PyrexSpinnaInfiniteTrack"> | string | null
    moodTags?: StringNullableListFilter<"PyrexSpinnaInfiniteTrack">
    awsAudioUrl?: StringNullableWithAggregatesFilter<"PyrexSpinnaInfiniteTrack"> | string | null
    awsArtworkUrl?: StringNullableWithAggregatesFilter<"PyrexSpinnaInfiniteTrack"> | string | null
    r2AudioUrl?: StringNullableWithAggregatesFilter<"PyrexSpinnaInfiniteTrack"> | string | null
    r2ArtworkUrl?: StringNullableWithAggregatesFilter<"PyrexSpinnaInfiniteTrack"> | string | null
    archiveAudioUrl?: StringNullableWithAggregatesFilter<"PyrexSpinnaInfiniteTrack"> | string | null
    archiveArtworkUrl?: StringNullableWithAggregatesFilter<"PyrexSpinnaInfiniteTrack"> | string | null
    vercelAudioUrl?: StringNullableWithAggregatesFilter<"PyrexSpinnaInfiniteTrack"> | string | null
    vercelArtworkUrl?: StringNullableWithAggregatesFilter<"PyrexSpinnaInfiniteTrack"> | string | null
    watermarkedAudioUrl?: StringNullableWithAggregatesFilter<"PyrexSpinnaInfiniteTrack"> | string | null
    storageClusterNode?: StringWithAggregatesFilter<"PyrexSpinnaInfiniteTrack"> | string
    priceMp3?: FloatWithAggregatesFilter<"PyrexSpinnaInfiniteTrack"> | number
    priceWav?: FloatWithAggregatesFilter<"PyrexSpinnaInfiniteTrack"> | number
    priceStems?: FloatWithAggregatesFilter<"PyrexSpinnaInfiniteTrack"> | number
    priceExclusive?: FloatWithAggregatesFilter<"PyrexSpinnaInfiniteTrack"> | number
    isExclusiveSold?: BoolWithAggregatesFilter<"PyrexSpinnaInfiniteTrack"> | boolean
    isVaultLocked?: BoolWithAggregatesFilter<"PyrexSpinnaInfiniteTrack"> | boolean
    streamCount?: IntWithAggregatesFilter<"PyrexSpinnaInfiniteTrack"> | number
    downloadCount?: IntWithAggregatesFilter<"PyrexSpinnaInfiniteTrack"> | number
    createdAt?: DateTimeWithAggregatesFilter<"PyrexSpinnaInfiniteTrack"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"PyrexSpinnaInfiniteTrack"> | Date | string
  }

  export type TransactionWhereInput = {
    AND?: TransactionWhereInput | TransactionWhereInput[]
    OR?: TransactionWhereInput[]
    NOT?: TransactionWhereInput | TransactionWhereInput[]
    id?: StringFilter<"Transaction"> | string
    trackId?: StringFilter<"Transaction"> | string
    buyerEmail?: StringFilter<"Transaction"> | string
    licenseType?: StringFilter<"Transaction"> | string
    amountPaid?: FloatFilter<"Transaction"> | number
    paymentGateway?: StringFilter<"Transaction"> | string
    licensePdfUrl?: StringFilter<"Transaction"> | string
    createdAt?: DateTimeFilter<"Transaction"> | Date | string
    track?: XOR<PyrexSpinnaInfiniteTrackScalarRelationFilter, PyrexSpinnaInfiniteTrackWhereInput>
  }

  export type TransactionOrderByWithRelationInput = {
    id?: SortOrder
    trackId?: SortOrder
    buyerEmail?: SortOrder
    licenseType?: SortOrder
    amountPaid?: SortOrder
    paymentGateway?: SortOrder
    licensePdfUrl?: SortOrder
    createdAt?: SortOrder
    track?: PyrexSpinnaInfiniteTrackOrderByWithRelationInput
  }

  export type TransactionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TransactionWhereInput | TransactionWhereInput[]
    OR?: TransactionWhereInput[]
    NOT?: TransactionWhereInput | TransactionWhereInput[]
    trackId?: StringFilter<"Transaction"> | string
    buyerEmail?: StringFilter<"Transaction"> | string
    licenseType?: StringFilter<"Transaction"> | string
    amountPaid?: FloatFilter<"Transaction"> | number
    paymentGateway?: StringFilter<"Transaction"> | string
    licensePdfUrl?: StringFilter<"Transaction"> | string
    createdAt?: DateTimeFilter<"Transaction"> | Date | string
    track?: XOR<PyrexSpinnaInfiniteTrackScalarRelationFilter, PyrexSpinnaInfiniteTrackWhereInput>
  }, "id">

  export type TransactionOrderByWithAggregationInput = {
    id?: SortOrder
    trackId?: SortOrder
    buyerEmail?: SortOrder
    licenseType?: SortOrder
    amountPaid?: SortOrder
    paymentGateway?: SortOrder
    licensePdfUrl?: SortOrder
    createdAt?: SortOrder
    _count?: TransactionCountOrderByAggregateInput
    _avg?: TransactionAvgOrderByAggregateInput
    _max?: TransactionMaxOrderByAggregateInput
    _min?: TransactionMinOrderByAggregateInput
    _sum?: TransactionSumOrderByAggregateInput
  }

  export type TransactionScalarWhereWithAggregatesInput = {
    AND?: TransactionScalarWhereWithAggregatesInput | TransactionScalarWhereWithAggregatesInput[]
    OR?: TransactionScalarWhereWithAggregatesInput[]
    NOT?: TransactionScalarWhereWithAggregatesInput | TransactionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Transaction"> | string
    trackId?: StringWithAggregatesFilter<"Transaction"> | string
    buyerEmail?: StringWithAggregatesFilter<"Transaction"> | string
    licenseType?: StringWithAggregatesFilter<"Transaction"> | string
    amountPaid?: FloatWithAggregatesFilter<"Transaction"> | number
    paymentGateway?: StringWithAggregatesFilter<"Transaction"> | string
    licensePdfUrl?: StringWithAggregatesFilter<"Transaction"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Transaction"> | Date | string
  }

  export type RecordPlaqueWhereInput = {
    AND?: RecordPlaqueWhereInput | RecordPlaqueWhereInput[]
    OR?: RecordPlaqueWhereInput[]
    NOT?: RecordPlaqueWhereInput | RecordPlaqueWhereInput[]
    plaqueId?: StringFilter<"RecordPlaque"> | string
    artistName?: StringFilter<"RecordPlaque"> | string
    releaseTitle?: StringFilter<"RecordPlaque"> | string
    milestoneType?: StringFilter<"RecordPlaque"> | string
    frameStyle?: StringFilter<"RecordPlaque"> | string
    verificationSourceUrl?: StringFilter<"RecordPlaque"> | string
    customerShippingAddress?: JsonFilter<"RecordPlaque">
    orderStatus?: StringFilter<"RecordPlaque"> | string
    price?: FloatFilter<"RecordPlaque"> | number
    createdAt?: DateTimeFilter<"RecordPlaque"> | Date | string
  }

  export type RecordPlaqueOrderByWithRelationInput = {
    plaqueId?: SortOrder
    artistName?: SortOrder
    releaseTitle?: SortOrder
    milestoneType?: SortOrder
    frameStyle?: SortOrder
    verificationSourceUrl?: SortOrder
    customerShippingAddress?: SortOrder
    orderStatus?: SortOrder
    price?: SortOrder
    createdAt?: SortOrder
  }

  export type RecordPlaqueWhereUniqueInput = Prisma.AtLeast<{
    plaqueId?: string
    AND?: RecordPlaqueWhereInput | RecordPlaqueWhereInput[]
    OR?: RecordPlaqueWhereInput[]
    NOT?: RecordPlaqueWhereInput | RecordPlaqueWhereInput[]
    artistName?: StringFilter<"RecordPlaque"> | string
    releaseTitle?: StringFilter<"RecordPlaque"> | string
    milestoneType?: StringFilter<"RecordPlaque"> | string
    frameStyle?: StringFilter<"RecordPlaque"> | string
    verificationSourceUrl?: StringFilter<"RecordPlaque"> | string
    customerShippingAddress?: JsonFilter<"RecordPlaque">
    orderStatus?: StringFilter<"RecordPlaque"> | string
    price?: FloatFilter<"RecordPlaque"> | number
    createdAt?: DateTimeFilter<"RecordPlaque"> | Date | string
  }, "plaqueId">

  export type RecordPlaqueOrderByWithAggregationInput = {
    plaqueId?: SortOrder
    artistName?: SortOrder
    releaseTitle?: SortOrder
    milestoneType?: SortOrder
    frameStyle?: SortOrder
    verificationSourceUrl?: SortOrder
    customerShippingAddress?: SortOrder
    orderStatus?: SortOrder
    price?: SortOrder
    createdAt?: SortOrder
    _count?: RecordPlaqueCountOrderByAggregateInput
    _avg?: RecordPlaqueAvgOrderByAggregateInput
    _max?: RecordPlaqueMaxOrderByAggregateInput
    _min?: RecordPlaqueMinOrderByAggregateInput
    _sum?: RecordPlaqueSumOrderByAggregateInput
  }

  export type RecordPlaqueScalarWhereWithAggregatesInput = {
    AND?: RecordPlaqueScalarWhereWithAggregatesInput | RecordPlaqueScalarWhereWithAggregatesInput[]
    OR?: RecordPlaqueScalarWhereWithAggregatesInput[]
    NOT?: RecordPlaqueScalarWhereWithAggregatesInput | RecordPlaqueScalarWhereWithAggregatesInput[]
    plaqueId?: StringWithAggregatesFilter<"RecordPlaque"> | string
    artistName?: StringWithAggregatesFilter<"RecordPlaque"> | string
    releaseTitle?: StringWithAggregatesFilter<"RecordPlaque"> | string
    milestoneType?: StringWithAggregatesFilter<"RecordPlaque"> | string
    frameStyle?: StringWithAggregatesFilter<"RecordPlaque"> | string
    verificationSourceUrl?: StringWithAggregatesFilter<"RecordPlaque"> | string
    customerShippingAddress?: JsonWithAggregatesFilter<"RecordPlaque">
    orderStatus?: StringWithAggregatesFilter<"RecordPlaque"> | string
    price?: FloatWithAggregatesFilter<"RecordPlaque"> | number
    createdAt?: DateTimeWithAggregatesFilter<"RecordPlaque"> | Date | string
  }

  export type PyrexSpinnaInfiniteTrackCreateInput = {
    id?: string
    title: string
    slug: string
    bpm?: number
    keySignature?: string
    genre?: string
    subGenre?: string | null
    moodTags?: PyrexSpinnaInfiniteTrackCreatemoodTagsInput | string[]
    awsAudioUrl?: string | null
    awsArtworkUrl?: string | null
    r2AudioUrl?: string | null
    r2ArtworkUrl?: string | null
    archiveAudioUrl?: string | null
    archiveArtworkUrl?: string | null
    vercelAudioUrl?: string | null
    vercelArtworkUrl?: string | null
    watermarkedAudioUrl?: string | null
    storageClusterNode: string
    priceMp3?: number
    priceWav?: number
    priceStems?: number
    priceExclusive?: number
    isExclusiveSold?: boolean
    isVaultLocked?: boolean
    streamCount?: number
    downloadCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    sales?: TransactionCreateNestedManyWithoutTrackInput
  }

  export type PyrexSpinnaInfiniteTrackUncheckedCreateInput = {
    id?: string
    title: string
    slug: string
    bpm?: number
    keySignature?: string
    genre?: string
    subGenre?: string | null
    moodTags?: PyrexSpinnaInfiniteTrackCreatemoodTagsInput | string[]
    awsAudioUrl?: string | null
    awsArtworkUrl?: string | null
    r2AudioUrl?: string | null
    r2ArtworkUrl?: string | null
    archiveAudioUrl?: string | null
    archiveArtworkUrl?: string | null
    vercelAudioUrl?: string | null
    vercelArtworkUrl?: string | null
    watermarkedAudioUrl?: string | null
    storageClusterNode: string
    priceMp3?: number
    priceWav?: number
    priceStems?: number
    priceExclusive?: number
    isExclusiveSold?: boolean
    isVaultLocked?: boolean
    streamCount?: number
    downloadCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    sales?: TransactionUncheckedCreateNestedManyWithoutTrackInput
  }

  export type PyrexSpinnaInfiniteTrackUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    bpm?: IntFieldUpdateOperationsInput | number
    keySignature?: StringFieldUpdateOperationsInput | string
    genre?: StringFieldUpdateOperationsInput | string
    subGenre?: NullableStringFieldUpdateOperationsInput | string | null
    moodTags?: PyrexSpinnaInfiniteTrackUpdatemoodTagsInput | string[]
    awsAudioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    awsArtworkUrl?: NullableStringFieldUpdateOperationsInput | string | null
    r2AudioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    r2ArtworkUrl?: NullableStringFieldUpdateOperationsInput | string | null
    archiveAudioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    archiveArtworkUrl?: NullableStringFieldUpdateOperationsInput | string | null
    vercelAudioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    vercelArtworkUrl?: NullableStringFieldUpdateOperationsInput | string | null
    watermarkedAudioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    storageClusterNode?: StringFieldUpdateOperationsInput | string
    priceMp3?: FloatFieldUpdateOperationsInput | number
    priceWav?: FloatFieldUpdateOperationsInput | number
    priceStems?: FloatFieldUpdateOperationsInput | number
    priceExclusive?: FloatFieldUpdateOperationsInput | number
    isExclusiveSold?: BoolFieldUpdateOperationsInput | boolean
    isVaultLocked?: BoolFieldUpdateOperationsInput | boolean
    streamCount?: IntFieldUpdateOperationsInput | number
    downloadCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sales?: TransactionUpdateManyWithoutTrackNestedInput
  }

  export type PyrexSpinnaInfiniteTrackUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    bpm?: IntFieldUpdateOperationsInput | number
    keySignature?: StringFieldUpdateOperationsInput | string
    genre?: StringFieldUpdateOperationsInput | string
    subGenre?: NullableStringFieldUpdateOperationsInput | string | null
    moodTags?: PyrexSpinnaInfiniteTrackUpdatemoodTagsInput | string[]
    awsAudioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    awsArtworkUrl?: NullableStringFieldUpdateOperationsInput | string | null
    r2AudioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    r2ArtworkUrl?: NullableStringFieldUpdateOperationsInput | string | null
    archiveAudioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    archiveArtworkUrl?: NullableStringFieldUpdateOperationsInput | string | null
    vercelAudioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    vercelArtworkUrl?: NullableStringFieldUpdateOperationsInput | string | null
    watermarkedAudioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    storageClusterNode?: StringFieldUpdateOperationsInput | string
    priceMp3?: FloatFieldUpdateOperationsInput | number
    priceWav?: FloatFieldUpdateOperationsInput | number
    priceStems?: FloatFieldUpdateOperationsInput | number
    priceExclusive?: FloatFieldUpdateOperationsInput | number
    isExclusiveSold?: BoolFieldUpdateOperationsInput | boolean
    isVaultLocked?: BoolFieldUpdateOperationsInput | boolean
    streamCount?: IntFieldUpdateOperationsInput | number
    downloadCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sales?: TransactionUncheckedUpdateManyWithoutTrackNestedInput
  }

  export type PyrexSpinnaInfiniteTrackCreateManyInput = {
    id?: string
    title: string
    slug: string
    bpm?: number
    keySignature?: string
    genre?: string
    subGenre?: string | null
    moodTags?: PyrexSpinnaInfiniteTrackCreatemoodTagsInput | string[]
    awsAudioUrl?: string | null
    awsArtworkUrl?: string | null
    r2AudioUrl?: string | null
    r2ArtworkUrl?: string | null
    archiveAudioUrl?: string | null
    archiveArtworkUrl?: string | null
    vercelAudioUrl?: string | null
    vercelArtworkUrl?: string | null
    watermarkedAudioUrl?: string | null
    storageClusterNode: string
    priceMp3?: number
    priceWav?: number
    priceStems?: number
    priceExclusive?: number
    isExclusiveSold?: boolean
    isVaultLocked?: boolean
    streamCount?: number
    downloadCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PyrexSpinnaInfiniteTrackUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    bpm?: IntFieldUpdateOperationsInput | number
    keySignature?: StringFieldUpdateOperationsInput | string
    genre?: StringFieldUpdateOperationsInput | string
    subGenre?: NullableStringFieldUpdateOperationsInput | string | null
    moodTags?: PyrexSpinnaInfiniteTrackUpdatemoodTagsInput | string[]
    awsAudioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    awsArtworkUrl?: NullableStringFieldUpdateOperationsInput | string | null
    r2AudioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    r2ArtworkUrl?: NullableStringFieldUpdateOperationsInput | string | null
    archiveAudioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    archiveArtworkUrl?: NullableStringFieldUpdateOperationsInput | string | null
    vercelAudioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    vercelArtworkUrl?: NullableStringFieldUpdateOperationsInput | string | null
    watermarkedAudioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    storageClusterNode?: StringFieldUpdateOperationsInput | string
    priceMp3?: FloatFieldUpdateOperationsInput | number
    priceWav?: FloatFieldUpdateOperationsInput | number
    priceStems?: FloatFieldUpdateOperationsInput | number
    priceExclusive?: FloatFieldUpdateOperationsInput | number
    isExclusiveSold?: BoolFieldUpdateOperationsInput | boolean
    isVaultLocked?: BoolFieldUpdateOperationsInput | boolean
    streamCount?: IntFieldUpdateOperationsInput | number
    downloadCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PyrexSpinnaInfiniteTrackUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    bpm?: IntFieldUpdateOperationsInput | number
    keySignature?: StringFieldUpdateOperationsInput | string
    genre?: StringFieldUpdateOperationsInput | string
    subGenre?: NullableStringFieldUpdateOperationsInput | string | null
    moodTags?: PyrexSpinnaInfiniteTrackUpdatemoodTagsInput | string[]
    awsAudioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    awsArtworkUrl?: NullableStringFieldUpdateOperationsInput | string | null
    r2AudioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    r2ArtworkUrl?: NullableStringFieldUpdateOperationsInput | string | null
    archiveAudioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    archiveArtworkUrl?: NullableStringFieldUpdateOperationsInput | string | null
    vercelAudioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    vercelArtworkUrl?: NullableStringFieldUpdateOperationsInput | string | null
    watermarkedAudioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    storageClusterNode?: StringFieldUpdateOperationsInput | string
    priceMp3?: FloatFieldUpdateOperationsInput | number
    priceWav?: FloatFieldUpdateOperationsInput | number
    priceStems?: FloatFieldUpdateOperationsInput | number
    priceExclusive?: FloatFieldUpdateOperationsInput | number
    isExclusiveSold?: BoolFieldUpdateOperationsInput | boolean
    isVaultLocked?: BoolFieldUpdateOperationsInput | boolean
    streamCount?: IntFieldUpdateOperationsInput | number
    downloadCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionCreateInput = {
    id?: string
    buyerEmail: string
    licenseType: string
    amountPaid: number
    paymentGateway: string
    licensePdfUrl: string
    createdAt?: Date | string
    track: PyrexSpinnaInfiniteTrackCreateNestedOneWithoutSalesInput
  }

  export type TransactionUncheckedCreateInput = {
    id?: string
    trackId: string
    buyerEmail: string
    licenseType: string
    amountPaid: number
    paymentGateway: string
    licensePdfUrl: string
    createdAt?: Date | string
  }

  export type TransactionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    buyerEmail?: StringFieldUpdateOperationsInput | string
    licenseType?: StringFieldUpdateOperationsInput | string
    amountPaid?: FloatFieldUpdateOperationsInput | number
    paymentGateway?: StringFieldUpdateOperationsInput | string
    licensePdfUrl?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    track?: PyrexSpinnaInfiniteTrackUpdateOneRequiredWithoutSalesNestedInput
  }

  export type TransactionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    trackId?: StringFieldUpdateOperationsInput | string
    buyerEmail?: StringFieldUpdateOperationsInput | string
    licenseType?: StringFieldUpdateOperationsInput | string
    amountPaid?: FloatFieldUpdateOperationsInput | number
    paymentGateway?: StringFieldUpdateOperationsInput | string
    licensePdfUrl?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionCreateManyInput = {
    id?: string
    trackId: string
    buyerEmail: string
    licenseType: string
    amountPaid: number
    paymentGateway: string
    licensePdfUrl: string
    createdAt?: Date | string
  }

  export type TransactionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    buyerEmail?: StringFieldUpdateOperationsInput | string
    licenseType?: StringFieldUpdateOperationsInput | string
    amountPaid?: FloatFieldUpdateOperationsInput | number
    paymentGateway?: StringFieldUpdateOperationsInput | string
    licensePdfUrl?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    trackId?: StringFieldUpdateOperationsInput | string
    buyerEmail?: StringFieldUpdateOperationsInput | string
    licenseType?: StringFieldUpdateOperationsInput | string
    amountPaid?: FloatFieldUpdateOperationsInput | number
    paymentGateway?: StringFieldUpdateOperationsInput | string
    licensePdfUrl?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RecordPlaqueCreateInput = {
    plaqueId?: string
    artistName: string
    releaseTitle: string
    milestoneType: string
    frameStyle: string
    verificationSourceUrl: string
    customerShippingAddress: JsonNullValueInput | InputJsonValue
    orderStatus: string
    price: number
    createdAt?: Date | string
  }

  export type RecordPlaqueUncheckedCreateInput = {
    plaqueId?: string
    artistName: string
    releaseTitle: string
    milestoneType: string
    frameStyle: string
    verificationSourceUrl: string
    customerShippingAddress: JsonNullValueInput | InputJsonValue
    orderStatus: string
    price: number
    createdAt?: Date | string
  }

  export type RecordPlaqueUpdateInput = {
    plaqueId?: StringFieldUpdateOperationsInput | string
    artistName?: StringFieldUpdateOperationsInput | string
    releaseTitle?: StringFieldUpdateOperationsInput | string
    milestoneType?: StringFieldUpdateOperationsInput | string
    frameStyle?: StringFieldUpdateOperationsInput | string
    verificationSourceUrl?: StringFieldUpdateOperationsInput | string
    customerShippingAddress?: JsonNullValueInput | InputJsonValue
    orderStatus?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RecordPlaqueUncheckedUpdateInput = {
    plaqueId?: StringFieldUpdateOperationsInput | string
    artistName?: StringFieldUpdateOperationsInput | string
    releaseTitle?: StringFieldUpdateOperationsInput | string
    milestoneType?: StringFieldUpdateOperationsInput | string
    frameStyle?: StringFieldUpdateOperationsInput | string
    verificationSourceUrl?: StringFieldUpdateOperationsInput | string
    customerShippingAddress?: JsonNullValueInput | InputJsonValue
    orderStatus?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RecordPlaqueCreateManyInput = {
    plaqueId?: string
    artistName: string
    releaseTitle: string
    milestoneType: string
    frameStyle: string
    verificationSourceUrl: string
    customerShippingAddress: JsonNullValueInput | InputJsonValue
    orderStatus: string
    price: number
    createdAt?: Date | string
  }

  export type RecordPlaqueUpdateManyMutationInput = {
    plaqueId?: StringFieldUpdateOperationsInput | string
    artistName?: StringFieldUpdateOperationsInput | string
    releaseTitle?: StringFieldUpdateOperationsInput | string
    milestoneType?: StringFieldUpdateOperationsInput | string
    frameStyle?: StringFieldUpdateOperationsInput | string
    verificationSourceUrl?: StringFieldUpdateOperationsInput | string
    customerShippingAddress?: JsonNullValueInput | InputJsonValue
    orderStatus?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RecordPlaqueUncheckedUpdateManyInput = {
    plaqueId?: StringFieldUpdateOperationsInput | string
    artistName?: StringFieldUpdateOperationsInput | string
    releaseTitle?: StringFieldUpdateOperationsInput | string
    milestoneType?: StringFieldUpdateOperationsInput | string
    frameStyle?: StringFieldUpdateOperationsInput | string
    verificationSourceUrl?: StringFieldUpdateOperationsInput | string
    customerShippingAddress?: JsonNullValueInput | InputJsonValue
    orderStatus?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type TransactionListRelationFilter = {
    every?: TransactionWhereInput
    some?: TransactionWhereInput
    none?: TransactionWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type TransactionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PyrexSpinnaInfiniteTrackCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    bpm?: SortOrder
    keySignature?: SortOrder
    genre?: SortOrder
    subGenre?: SortOrder
    moodTags?: SortOrder
    awsAudioUrl?: SortOrder
    awsArtworkUrl?: SortOrder
    r2AudioUrl?: SortOrder
    r2ArtworkUrl?: SortOrder
    archiveAudioUrl?: SortOrder
    archiveArtworkUrl?: SortOrder
    vercelAudioUrl?: SortOrder
    vercelArtworkUrl?: SortOrder
    watermarkedAudioUrl?: SortOrder
    storageClusterNode?: SortOrder
    priceMp3?: SortOrder
    priceWav?: SortOrder
    priceStems?: SortOrder
    priceExclusive?: SortOrder
    isExclusiveSold?: SortOrder
    isVaultLocked?: SortOrder
    streamCount?: SortOrder
    downloadCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PyrexSpinnaInfiniteTrackAvgOrderByAggregateInput = {
    bpm?: SortOrder
    priceMp3?: SortOrder
    priceWav?: SortOrder
    priceStems?: SortOrder
    priceExclusive?: SortOrder
    streamCount?: SortOrder
    downloadCount?: SortOrder
  }

  export type PyrexSpinnaInfiniteTrackMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    bpm?: SortOrder
    keySignature?: SortOrder
    genre?: SortOrder
    subGenre?: SortOrder
    awsAudioUrl?: SortOrder
    awsArtworkUrl?: SortOrder
    r2AudioUrl?: SortOrder
    r2ArtworkUrl?: SortOrder
    archiveAudioUrl?: SortOrder
    archiveArtworkUrl?: SortOrder
    vercelAudioUrl?: SortOrder
    vercelArtworkUrl?: SortOrder
    watermarkedAudioUrl?: SortOrder
    storageClusterNode?: SortOrder
    priceMp3?: SortOrder
    priceWav?: SortOrder
    priceStems?: SortOrder
    priceExclusive?: SortOrder
    isExclusiveSold?: SortOrder
    isVaultLocked?: SortOrder
    streamCount?: SortOrder
    downloadCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PyrexSpinnaInfiniteTrackMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    bpm?: SortOrder
    keySignature?: SortOrder
    genre?: SortOrder
    subGenre?: SortOrder
    awsAudioUrl?: SortOrder
    awsArtworkUrl?: SortOrder
    r2AudioUrl?: SortOrder
    r2ArtworkUrl?: SortOrder
    archiveAudioUrl?: SortOrder
    archiveArtworkUrl?: SortOrder
    vercelAudioUrl?: SortOrder
    vercelArtworkUrl?: SortOrder
    watermarkedAudioUrl?: SortOrder
    storageClusterNode?: SortOrder
    priceMp3?: SortOrder
    priceWav?: SortOrder
    priceStems?: SortOrder
    priceExclusive?: SortOrder
    isExclusiveSold?: SortOrder
    isVaultLocked?: SortOrder
    streamCount?: SortOrder
    downloadCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PyrexSpinnaInfiniteTrackSumOrderByAggregateInput = {
    bpm?: SortOrder
    priceMp3?: SortOrder
    priceWav?: SortOrder
    priceStems?: SortOrder
    priceExclusive?: SortOrder
    streamCount?: SortOrder
    downloadCount?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type PyrexSpinnaInfiniteTrackScalarRelationFilter = {
    is?: PyrexSpinnaInfiniteTrackWhereInput
    isNot?: PyrexSpinnaInfiniteTrackWhereInput
  }

  export type TransactionCountOrderByAggregateInput = {
    id?: SortOrder
    trackId?: SortOrder
    buyerEmail?: SortOrder
    licenseType?: SortOrder
    amountPaid?: SortOrder
    paymentGateway?: SortOrder
    licensePdfUrl?: SortOrder
    createdAt?: SortOrder
  }

  export type TransactionAvgOrderByAggregateInput = {
    amountPaid?: SortOrder
  }

  export type TransactionMaxOrderByAggregateInput = {
    id?: SortOrder
    trackId?: SortOrder
    buyerEmail?: SortOrder
    licenseType?: SortOrder
    amountPaid?: SortOrder
    paymentGateway?: SortOrder
    licensePdfUrl?: SortOrder
    createdAt?: SortOrder
  }

  export type TransactionMinOrderByAggregateInput = {
    id?: SortOrder
    trackId?: SortOrder
    buyerEmail?: SortOrder
    licenseType?: SortOrder
    amountPaid?: SortOrder
    paymentGateway?: SortOrder
    licensePdfUrl?: SortOrder
    createdAt?: SortOrder
  }

  export type TransactionSumOrderByAggregateInput = {
    amountPaid?: SortOrder
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type RecordPlaqueCountOrderByAggregateInput = {
    plaqueId?: SortOrder
    artistName?: SortOrder
    releaseTitle?: SortOrder
    milestoneType?: SortOrder
    frameStyle?: SortOrder
    verificationSourceUrl?: SortOrder
    customerShippingAddress?: SortOrder
    orderStatus?: SortOrder
    price?: SortOrder
    createdAt?: SortOrder
  }

  export type RecordPlaqueAvgOrderByAggregateInput = {
    price?: SortOrder
  }

  export type RecordPlaqueMaxOrderByAggregateInput = {
    plaqueId?: SortOrder
    artistName?: SortOrder
    releaseTitle?: SortOrder
    milestoneType?: SortOrder
    frameStyle?: SortOrder
    verificationSourceUrl?: SortOrder
    orderStatus?: SortOrder
    price?: SortOrder
    createdAt?: SortOrder
  }

  export type RecordPlaqueMinOrderByAggregateInput = {
    plaqueId?: SortOrder
    artistName?: SortOrder
    releaseTitle?: SortOrder
    milestoneType?: SortOrder
    frameStyle?: SortOrder
    verificationSourceUrl?: SortOrder
    orderStatus?: SortOrder
    price?: SortOrder
    createdAt?: SortOrder
  }

  export type RecordPlaqueSumOrderByAggregateInput = {
    price?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type PyrexSpinnaInfiniteTrackCreatemoodTagsInput = {
    set: string[]
  }

  export type TransactionCreateNestedManyWithoutTrackInput = {
    create?: XOR<TransactionCreateWithoutTrackInput, TransactionUncheckedCreateWithoutTrackInput> | TransactionCreateWithoutTrackInput[] | TransactionUncheckedCreateWithoutTrackInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutTrackInput | TransactionCreateOrConnectWithoutTrackInput[]
    createMany?: TransactionCreateManyTrackInputEnvelope
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
  }

  export type TransactionUncheckedCreateNestedManyWithoutTrackInput = {
    create?: XOR<TransactionCreateWithoutTrackInput, TransactionUncheckedCreateWithoutTrackInput> | TransactionCreateWithoutTrackInput[] | TransactionUncheckedCreateWithoutTrackInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutTrackInput | TransactionCreateOrConnectWithoutTrackInput[]
    createMany?: TransactionCreateManyTrackInputEnvelope
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type PyrexSpinnaInfiniteTrackUpdatemoodTagsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type TransactionUpdateManyWithoutTrackNestedInput = {
    create?: XOR<TransactionCreateWithoutTrackInput, TransactionUncheckedCreateWithoutTrackInput> | TransactionCreateWithoutTrackInput[] | TransactionUncheckedCreateWithoutTrackInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutTrackInput | TransactionCreateOrConnectWithoutTrackInput[]
    upsert?: TransactionUpsertWithWhereUniqueWithoutTrackInput | TransactionUpsertWithWhereUniqueWithoutTrackInput[]
    createMany?: TransactionCreateManyTrackInputEnvelope
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    update?: TransactionUpdateWithWhereUniqueWithoutTrackInput | TransactionUpdateWithWhereUniqueWithoutTrackInput[]
    updateMany?: TransactionUpdateManyWithWhereWithoutTrackInput | TransactionUpdateManyWithWhereWithoutTrackInput[]
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
  }

  export type TransactionUncheckedUpdateManyWithoutTrackNestedInput = {
    create?: XOR<TransactionCreateWithoutTrackInput, TransactionUncheckedCreateWithoutTrackInput> | TransactionCreateWithoutTrackInput[] | TransactionUncheckedCreateWithoutTrackInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutTrackInput | TransactionCreateOrConnectWithoutTrackInput[]
    upsert?: TransactionUpsertWithWhereUniqueWithoutTrackInput | TransactionUpsertWithWhereUniqueWithoutTrackInput[]
    createMany?: TransactionCreateManyTrackInputEnvelope
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    update?: TransactionUpdateWithWhereUniqueWithoutTrackInput | TransactionUpdateWithWhereUniqueWithoutTrackInput[]
    updateMany?: TransactionUpdateManyWithWhereWithoutTrackInput | TransactionUpdateManyWithWhereWithoutTrackInput[]
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
  }

  export type PyrexSpinnaInfiniteTrackCreateNestedOneWithoutSalesInput = {
    create?: XOR<PyrexSpinnaInfiniteTrackCreateWithoutSalesInput, PyrexSpinnaInfiniteTrackUncheckedCreateWithoutSalesInput>
    connectOrCreate?: PyrexSpinnaInfiniteTrackCreateOrConnectWithoutSalesInput
    connect?: PyrexSpinnaInfiniteTrackWhereUniqueInput
  }

  export type PyrexSpinnaInfiniteTrackUpdateOneRequiredWithoutSalesNestedInput = {
    create?: XOR<PyrexSpinnaInfiniteTrackCreateWithoutSalesInput, PyrexSpinnaInfiniteTrackUncheckedCreateWithoutSalesInput>
    connectOrCreate?: PyrexSpinnaInfiniteTrackCreateOrConnectWithoutSalesInput
    upsert?: PyrexSpinnaInfiniteTrackUpsertWithoutSalesInput
    connect?: PyrexSpinnaInfiniteTrackWhereUniqueInput
    update?: XOR<XOR<PyrexSpinnaInfiniteTrackUpdateToOneWithWhereWithoutSalesInput, PyrexSpinnaInfiniteTrackUpdateWithoutSalesInput>, PyrexSpinnaInfiniteTrackUncheckedUpdateWithoutSalesInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type TransactionCreateWithoutTrackInput = {
    id?: string
    buyerEmail: string
    licenseType: string
    amountPaid: number
    paymentGateway: string
    licensePdfUrl: string
    createdAt?: Date | string
  }

  export type TransactionUncheckedCreateWithoutTrackInput = {
    id?: string
    buyerEmail: string
    licenseType: string
    amountPaid: number
    paymentGateway: string
    licensePdfUrl: string
    createdAt?: Date | string
  }

  export type TransactionCreateOrConnectWithoutTrackInput = {
    where: TransactionWhereUniqueInput
    create: XOR<TransactionCreateWithoutTrackInput, TransactionUncheckedCreateWithoutTrackInput>
  }

  export type TransactionCreateManyTrackInputEnvelope = {
    data: TransactionCreateManyTrackInput | TransactionCreateManyTrackInput[]
    skipDuplicates?: boolean
  }

  export type TransactionUpsertWithWhereUniqueWithoutTrackInput = {
    where: TransactionWhereUniqueInput
    update: XOR<TransactionUpdateWithoutTrackInput, TransactionUncheckedUpdateWithoutTrackInput>
    create: XOR<TransactionCreateWithoutTrackInput, TransactionUncheckedCreateWithoutTrackInput>
  }

  export type TransactionUpdateWithWhereUniqueWithoutTrackInput = {
    where: TransactionWhereUniqueInput
    data: XOR<TransactionUpdateWithoutTrackInput, TransactionUncheckedUpdateWithoutTrackInput>
  }

  export type TransactionUpdateManyWithWhereWithoutTrackInput = {
    where: TransactionScalarWhereInput
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyWithoutTrackInput>
  }

  export type TransactionScalarWhereInput = {
    AND?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
    OR?: TransactionScalarWhereInput[]
    NOT?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
    id?: StringFilter<"Transaction"> | string
    trackId?: StringFilter<"Transaction"> | string
    buyerEmail?: StringFilter<"Transaction"> | string
    licenseType?: StringFilter<"Transaction"> | string
    amountPaid?: FloatFilter<"Transaction"> | number
    paymentGateway?: StringFilter<"Transaction"> | string
    licensePdfUrl?: StringFilter<"Transaction"> | string
    createdAt?: DateTimeFilter<"Transaction"> | Date | string
  }

  export type PyrexSpinnaInfiniteTrackCreateWithoutSalesInput = {
    id?: string
    title: string
    slug: string
    bpm?: number
    keySignature?: string
    genre?: string
    subGenre?: string | null
    moodTags?: PyrexSpinnaInfiniteTrackCreatemoodTagsInput | string[]
    awsAudioUrl?: string | null
    awsArtworkUrl?: string | null
    r2AudioUrl?: string | null
    r2ArtworkUrl?: string | null
    archiveAudioUrl?: string | null
    archiveArtworkUrl?: string | null
    vercelAudioUrl?: string | null
    vercelArtworkUrl?: string | null
    watermarkedAudioUrl?: string | null
    storageClusterNode: string
    priceMp3?: number
    priceWav?: number
    priceStems?: number
    priceExclusive?: number
    isExclusiveSold?: boolean
    isVaultLocked?: boolean
    streamCount?: number
    downloadCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PyrexSpinnaInfiniteTrackUncheckedCreateWithoutSalesInput = {
    id?: string
    title: string
    slug: string
    bpm?: number
    keySignature?: string
    genre?: string
    subGenre?: string | null
    moodTags?: PyrexSpinnaInfiniteTrackCreatemoodTagsInput | string[]
    awsAudioUrl?: string | null
    awsArtworkUrl?: string | null
    r2AudioUrl?: string | null
    r2ArtworkUrl?: string | null
    archiveAudioUrl?: string | null
    archiveArtworkUrl?: string | null
    vercelAudioUrl?: string | null
    vercelArtworkUrl?: string | null
    watermarkedAudioUrl?: string | null
    storageClusterNode: string
    priceMp3?: number
    priceWav?: number
    priceStems?: number
    priceExclusive?: number
    isExclusiveSold?: boolean
    isVaultLocked?: boolean
    streamCount?: number
    downloadCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PyrexSpinnaInfiniteTrackCreateOrConnectWithoutSalesInput = {
    where: PyrexSpinnaInfiniteTrackWhereUniqueInput
    create: XOR<PyrexSpinnaInfiniteTrackCreateWithoutSalesInput, PyrexSpinnaInfiniteTrackUncheckedCreateWithoutSalesInput>
  }

  export type PyrexSpinnaInfiniteTrackUpsertWithoutSalesInput = {
    update: XOR<PyrexSpinnaInfiniteTrackUpdateWithoutSalesInput, PyrexSpinnaInfiniteTrackUncheckedUpdateWithoutSalesInput>
    create: XOR<PyrexSpinnaInfiniteTrackCreateWithoutSalesInput, PyrexSpinnaInfiniteTrackUncheckedCreateWithoutSalesInput>
    where?: PyrexSpinnaInfiniteTrackWhereInput
  }

  export type PyrexSpinnaInfiniteTrackUpdateToOneWithWhereWithoutSalesInput = {
    where?: PyrexSpinnaInfiniteTrackWhereInput
    data: XOR<PyrexSpinnaInfiniteTrackUpdateWithoutSalesInput, PyrexSpinnaInfiniteTrackUncheckedUpdateWithoutSalesInput>
  }

  export type PyrexSpinnaInfiniteTrackUpdateWithoutSalesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    bpm?: IntFieldUpdateOperationsInput | number
    keySignature?: StringFieldUpdateOperationsInput | string
    genre?: StringFieldUpdateOperationsInput | string
    subGenre?: NullableStringFieldUpdateOperationsInput | string | null
    moodTags?: PyrexSpinnaInfiniteTrackUpdatemoodTagsInput | string[]
    awsAudioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    awsArtworkUrl?: NullableStringFieldUpdateOperationsInput | string | null
    r2AudioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    r2ArtworkUrl?: NullableStringFieldUpdateOperationsInput | string | null
    archiveAudioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    archiveArtworkUrl?: NullableStringFieldUpdateOperationsInput | string | null
    vercelAudioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    vercelArtworkUrl?: NullableStringFieldUpdateOperationsInput | string | null
    watermarkedAudioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    storageClusterNode?: StringFieldUpdateOperationsInput | string
    priceMp3?: FloatFieldUpdateOperationsInput | number
    priceWav?: FloatFieldUpdateOperationsInput | number
    priceStems?: FloatFieldUpdateOperationsInput | number
    priceExclusive?: FloatFieldUpdateOperationsInput | number
    isExclusiveSold?: BoolFieldUpdateOperationsInput | boolean
    isVaultLocked?: BoolFieldUpdateOperationsInput | boolean
    streamCount?: IntFieldUpdateOperationsInput | number
    downloadCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PyrexSpinnaInfiniteTrackUncheckedUpdateWithoutSalesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    bpm?: IntFieldUpdateOperationsInput | number
    keySignature?: StringFieldUpdateOperationsInput | string
    genre?: StringFieldUpdateOperationsInput | string
    subGenre?: NullableStringFieldUpdateOperationsInput | string | null
    moodTags?: PyrexSpinnaInfiniteTrackUpdatemoodTagsInput | string[]
    awsAudioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    awsArtworkUrl?: NullableStringFieldUpdateOperationsInput | string | null
    r2AudioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    r2ArtworkUrl?: NullableStringFieldUpdateOperationsInput | string | null
    archiveAudioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    archiveArtworkUrl?: NullableStringFieldUpdateOperationsInput | string | null
    vercelAudioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    vercelArtworkUrl?: NullableStringFieldUpdateOperationsInput | string | null
    watermarkedAudioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    storageClusterNode?: StringFieldUpdateOperationsInput | string
    priceMp3?: FloatFieldUpdateOperationsInput | number
    priceWav?: FloatFieldUpdateOperationsInput | number
    priceStems?: FloatFieldUpdateOperationsInput | number
    priceExclusive?: FloatFieldUpdateOperationsInput | number
    isExclusiveSold?: BoolFieldUpdateOperationsInput | boolean
    isVaultLocked?: BoolFieldUpdateOperationsInput | boolean
    streamCount?: IntFieldUpdateOperationsInput | number
    downloadCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionCreateManyTrackInput = {
    id?: string
    buyerEmail: string
    licenseType: string
    amountPaid: number
    paymentGateway: string
    licensePdfUrl: string
    createdAt?: Date | string
  }

  export type TransactionUpdateWithoutTrackInput = {
    id?: StringFieldUpdateOperationsInput | string
    buyerEmail?: StringFieldUpdateOperationsInput | string
    licenseType?: StringFieldUpdateOperationsInput | string
    amountPaid?: FloatFieldUpdateOperationsInput | number
    paymentGateway?: StringFieldUpdateOperationsInput | string
    licensePdfUrl?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionUncheckedUpdateWithoutTrackInput = {
    id?: StringFieldUpdateOperationsInput | string
    buyerEmail?: StringFieldUpdateOperationsInput | string
    licenseType?: StringFieldUpdateOperationsInput | string
    amountPaid?: FloatFieldUpdateOperationsInput | number
    paymentGateway?: StringFieldUpdateOperationsInput | string
    licensePdfUrl?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionUncheckedUpdateManyWithoutTrackInput = {
    id?: StringFieldUpdateOperationsInput | string
    buyerEmail?: StringFieldUpdateOperationsInput | string
    licenseType?: StringFieldUpdateOperationsInput | string
    amountPaid?: FloatFieldUpdateOperationsInput | number
    paymentGateway?: StringFieldUpdateOperationsInput | string
    licensePdfUrl?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}