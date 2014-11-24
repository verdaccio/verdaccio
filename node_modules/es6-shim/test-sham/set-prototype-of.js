describe('Object.setPrototypeOf(o, p)', function () {

  it('changes prototype to regular objects', function () {
    var obj = {a: 123};
    expect(obj instanceof Object).to.equal(true);
    // sham requires assignment to work cross browser
    obj = Object.setPrototypeOf(obj, null);
    expect(obj instanceof Object).to.equal(false);
    expect(obj.a).to.equal(123);
  });

  it('changes prototype to null objects', function () {
    var obj = Object.create(null);
    obj.a = 456;
    expect(obj instanceof Object).to.equal(false);
    expect(obj.a).to.equal(456);
    // sham requires assignment to work cross browser
    obj = Object.setPrototypeOf(obj, {});
    expect(obj instanceof Object).to.equal(true);
    expect(obj.a).to.equal(456);
  });

});

