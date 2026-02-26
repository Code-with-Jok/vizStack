/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as chapters from "../chapters.js";
import type * as migrations from "../migrations.js";
import type * as seed from "../seed.js";
import type * as seedExtra from "../seedExtra.js";
import type * as vizAI from "../vizAI.js";
import type * as walkthroughs from "../walkthroughs.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  chapters: typeof chapters;
  migrations: typeof migrations;
  seed: typeof seed;
  seedExtra: typeof seedExtra;
  vizAI: typeof vizAI;
  walkthroughs: typeof walkthroughs;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
