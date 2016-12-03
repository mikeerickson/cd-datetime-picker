describe('A spy, when configured to fake a return value', function () {
  var foo,
    bar,
    fetchedBar;

  beforeEach(function () {
    foo = {
      setBar: function (value) {
        bar = value;
      },
      getBar: function () {
        return bar;
      }
    };

    spyOn(foo, 'getBar').and.returnValue(714);

    foo.setBar(123);
    fetchedBar = foo.getBar();
  });

  it('tracks that the spy was called', function () {
    expect(foo.getBar).toHaveBeenCalled();
  });

  it('should not affect other functions', function () {
    expect(bar).toEqual(123);
  });

  it('when called returns the requested value', function () {
    expect(fetchedBar).toEqual(714);
  });
});
