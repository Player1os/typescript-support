declare const serialAsyncFunctionCallback: (originalAsyncFunction: () => Promise<void>) => () => void

export = serialAsyncFunctionCallback
