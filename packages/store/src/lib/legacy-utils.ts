const isPromiseFunction = (func: any) => {
  return typeof func === 'function' && func.then !== undefined;
};

const isCallbackFunction = (func: any) => {
  return typeof func === 'function' && func.length > 0 && func.toString().includes('callback');
};

export function checkFunctionIsPromise<T>(instance: T, methodName: keyof T): boolean {
  const method = instance[methodName];

  if (typeof method !== 'function') {
    return false;
  }

  if (isPromiseFunction(method)) {
    return true;
  }

  if (isCallbackFunction(method)) {
    return false;
  }

  return true;
}

export function isPromise(obj: any): obj is Promise<any> {
  return (
    !!obj &&
    (typeof obj === 'object' || typeof obj === 'function') &&
    typeof obj.then === 'function'
  );
}

export function promisifiedCallbackFunction<T>(
  instance: T,
  methodName: keyof T,
  ...args: any[]
): Promise<any> {
  return new Promise((resolve, reject) => {
    const method = instance[methodName];

    if (typeof method !== 'function') {
      reject(new Error(`${String(methodName)} is not a function on the given instance.`));
      return;
    }

    // Append the callback to the args
    args.push((error: any, result: any) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });

    method.apply(instance, args);
  });
}
