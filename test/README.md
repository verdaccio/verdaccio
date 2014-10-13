All tests are split in three folders:

 - `unit` - Tests that cover functions that transform data in an non-trivial way. These tests simply `require()` a few files and run code in there, so they are very fast.
 - `functional` - Tests that launch a sinopia instance and perform a series of requests to it over http. They are slower than unit tests.
 - `integration` - Tests that launch a sinopia instance and do requests to it using npm. They are really slow and can hit a real npm registry.

Unit and functional tests are executed automatically by running `npm test` from the project's root directory. Integration tests are supposed to be executed manually from time to time.
