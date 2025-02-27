import translationResources from './files-loader';

type DeepKeys<T> = T extends object
    ? {
          [K in keyof T]: `${K & string}${T[K] extends object
              ? `.${DeepKeys<T[K]>}`
              : ''}`;
      }[keyof T]
    : never;

type TranslationResources = typeof translationResources;

type Namespaces = keyof TranslationResources;
type EnglishTranslations = { [N in Namespaces]: TranslationResources[N] };

export type TranslationKey = {
    [N in Exclude<Namespaces, symbol>]: `${N}.${DeepKeys<
        EnglishTranslations[N]
    >}`;
}[Exclude<Namespaces, symbol>];

export type TranslateFunction = <T extends string = string>(
    key: TranslationKey,
    options?: Record<string, unknown>,
) => T;
