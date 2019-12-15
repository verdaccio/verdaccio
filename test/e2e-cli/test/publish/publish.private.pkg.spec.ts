import path from 'path';
// import { npm } from '../../utils/process';

function testExample() {
  console.log('running example');
  return Promise.resolve(true);
}

export default async function() {
  await testExample();
}

describe.skip('test example', ()=> {

  beforeAll(() => {

  });

  test('sub example', async (done) => {
    console.log(`New directory: ${process.cwd()}`, __dirname);
    process.chdir(path.join(__dirname, '../../projects/basic'));
    console.log(`New directory: ${process.cwd()}`);
    // await npm('install', '--registry' ,'http://localhost:4873');
    done();
    // @ts-ignore
    // console.log('--->', global.__namespace.getItem('dir-root'));
    expect(true).toBe(true);
  })
});
