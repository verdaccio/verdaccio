import { checkFunctionIsPromise, promisifiedCallbackFunction } from '../src/lib/legacy-utils';

describe('utils', () => {
  class MyClass {
    asyncFunction(): Promise<string> {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve('I am a promise');
        }, 1000);
      });
    }

    readPackage(pkgName: string, callback: (error: any, result: string) => void): void {
      setTimeout(() => {
        if (pkgName === 'error') {
          callback(new Error('Package not found'), null);
        } else {
          callback(null, `Package ${pkgName} data`);
        }
      }, 1000);
    }
  }

  describe('checkFunctionIsPromise', () => {
    let myInstance: MyClass;
    beforeEach(() => {
      myInstance = new MyClass();
    });

    test('should identify asyncFunction as "Promise"', () => {
      expect(checkFunctionIsPromise(myInstance, 'asyncFunction')).toBeTruthy();
    });

    test('should throw an error if method is not a function', () => {
      expect(checkFunctionIsPromise(myInstance, 'nonExistentFunction' as any)).toBeFalsy();
    });
  });

  describe('promisifiedCallbackFunction', () => {
    let myInstance: MyClass;

    beforeEach(() => {
      myInstance = new MyClass();
    });

    test('should reject if method is not a function', async () => {
      await expect(
        promisifiedCallbackFunction(myInstance, 'nonExistentFunction' as any)
      ).rejects.toThrow('nonExistentFunction is not a function on the given instance.');
    });

    test('should resolve with the correct value for readPackage when no error', async () => {
      await expect(
        promisifiedCallbackFunction(myInstance, 'readPackage', 'examplePackage')
      ).resolves.toBe('Package examplePackage data');
    });

    test('should reject with an error for readPackage when there is an error', async () => {
      await expect(promisifiedCallbackFunction(myInstance, 'readPackage', 'error')).rejects.toThrow(
        'Package not found'
      );
    });

    // Additional tests to cover other cases can be added here
  });
});
