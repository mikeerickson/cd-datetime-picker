/*
  * sandbox.attEnterEvent
*/

// ---IMPLEMETATION-----------------
function hitEnterEvent() {
  return {
    restrict: 'A',
    scope: {
      hitEnterEvent: '&'
    },
    link: function (scope, element, attrs) {
      element.bind('keydown keypress', function (event) {
        if (event.which === 13 || event.keyCode === 13) {
          scope.$apply(function () {
            scope.hitEnterEvent();
          });
          event.preventDefault();
        }
      });
    }
  };
}

controller.$inject = ['$scope'];
function controller($scope) {
  $scope.showinputtext = false;
  $scope.enterEvent = function () {
    $scope.showinputtext = true;
  };
}

angular.module('sandbox.attEnterEvent', [])
  .directive('hitEnterEvent', hitEnterEvent)
  .controller('hitEntereventCtrl', controller);

// ---SPECS-------------------------
describe('Unit Test: Enter Event', function () {
  var el,
    scope;

  beforeEach(function () {
    module('sandbox.attEnterEvent');
    inject(function ($compile, $rootScope) {
      scope = $rootScope.$new();
      el = $compile(angular.element('<input type="text" hit-enter-event="enterEvent()">'))(scope);
    });
  });

  it('Enter key should call the method inside controller', function () {
    scope.enterEvent = jasmine.createSpy('enterEvent');

    var enterKey = jQuery.Event('keydown', {keyCode: 13});

    el.trigger(enterKey);

    expect(scope.enterEvent).toHaveBeenCalled();
  });
});
