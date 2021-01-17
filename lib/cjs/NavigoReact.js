"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRouter = getRouter;
exports.configureRouter = configureRouter;
exports.reset = reset;
exports.Route = Route;
exports.Base = Base;
exports.Switch = Switch;
exports.NotFound = NotFound;
exports.Redirect = Redirect;
exports.useNavigo = useNavigo;
exports.useLocation = useLocation;
exports["default"] = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

var _navigo = _interopRequireDefault(require("navigo"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var router;

var Context = _react["default"].createContext({
  match: false
});

var SwitchContext = _react["default"].createContext({
  isInSwitch: false,
  switchMatch: false
}); // types


function getRouter(root) {
  if (router) {
    return router;
  }

  router = new _navigo["default"](root || "/", {
    strategy: "ALL",
    noMatchWarning: true
  }); // @ts-ignore

  window.router = router;
  return router;
}

function nextTick(callback) {
  setTimeout(function () {
    return callback();
  }, 0);
} // utils


function configureRouter(root) {
  return getRouter(root);
}

function reset() {
  if (router) {
    router.destroy();
    router = undefined;
  }
} // components


function Route(_ref) {
  var path = _ref.path,
      children = _ref.children,
      loose = _ref.loose,
      before = _ref.before,
      after = _ref.after,
      already = _ref.already,
      leave = _ref.leave;

  var _useReducer = (0, _react.useReducer)(function (state, action) {
    return _objectSpread(_objectSpread({}, state), action);
  }, {
    match: false
  }),
      _useReducer2 = (0, _slicedToArray2["default"])(_useReducer, 2),
      context = _useReducer2[0],
      setContext = _useReducer2[1];

  var switchContext = (0, _react.useContext)(SwitchContext);

  var renderChild = function renderChild() {
    return /*#__PURE__*/_react["default"].createElement(Context.Provider, {
      value: context
    }, children);
  };

  var noneBlockingHook = function noneBlockingHook(func) {
    return function (match) {
      func(function (result) {
        if ((0, _typeof2["default"])(result) === "object" && result !== null) {
          setContext(result);
        }
      }, match);
    };
  };

  var blockingHook = function blockingHook(func) {
    return function (done, match) {
      func(function (result) {
        if (typeof result === "boolean") {
          done(result);
        } else if ((0, _typeof2["default"])(result) === "object" && result !== null) {
          setContext(result);
        }
      }, match);
    };
  };

  (0, _react.useEffect)(function () {
    var isMounted = true;
    var router = getRouter();

    var handler = function handler(match) {
      if (isMounted) {
        setContext({
          match: match
        });
      }

      nextTick(function () {
        return getRouter().updatePageLinks();
      });
    }; // creating the route


    router.on(path, handler);
    var navigoRoute = router.getRoute(handler); // hooking

    if (before) {
      router.addBeforeHook(navigoRoute, blockingHook(before));
    }

    if (after) {
      router.addAfterHook(navigoRoute, noneBlockingHook(after));
    }

    if (already) {
      router.addAlreadyHook(navigoRoute, noneBlockingHook(already));
    }

    if (leave) {
      router.addLeaveHook(navigoRoute, blockingHook(leave));
    } // adding the service leave hook


    router.addLeaveHook(navigoRoute, function (done) {
      if (isMounted) {
        setContext({
          match: false
        });
      }

      done();
    }); // initial resolving

    router.resolve(); // initial data-navigo set up

    router.updatePageLinks();
    return function () {
      isMounted = false;
      router.off(handler);
    };
  }, []);

  if (loose) {
    return renderChild();
  } else if (switchContext.isInSwitch && context.match) {
    if (switchContext.switchMatch) {
      if (switchContext.switchMatch.route.path === context.match.route.path) {
        return renderChild();
      }
    } else {
      switchContext.switchMatch = context.match;
      return renderChild();
    }
  } else if (context.match) {
    return renderChild();
  }

  return null;
}

function Base(_ref2) {
  var path = _ref2.path;
  getRouter(path);
  return null;
}

function Switch(_ref3) {
  var children = _ref3.children;

  var _useState = (0, _react.useState)(false),
      _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
      match = _useState2[0],
      setMatch = _useState2[1];

  (0, _react.useEffect)(function () {
    function switchHandler(match) {
      setMatch(match);
    }

    getRouter().on("*", switchHandler);
    return function () {
      getRouter().off(switchHandler);
    };
  }, []);
  return /*#__PURE__*/_react["default"].createElement(SwitchContext.Provider, {
    value: {
      switchMatch: false,
      isInSwitch: true
    },
    key: match ? match.url : "switch".concat(new Date().getTime())
  }, children);
}

function NotFound(_ref4) {
  var children = _ref4.children,
      hooks = _ref4.hooks;
  var match = useNotFound(hooks);

  if (match) {
    return /*#__PURE__*/_react["default"].createElement(Context.Provider, {
      value: {
        match: match
      }
    }, children);
  }

  return null;
}

function Redirect(_ref5) {
  var path = _ref5.path;
  (0, _react.useEffect)(function () {
    getRouter().navigate(path);
  }, []);
  return null;
} // hooks


function useNavigo() {
  return (0, _react.useContext)(Context);
}

function useLocation() {
  return getRouter().getCurrentLocation();
} // internal hooks


function useNotFound(hooks) {
  var _useState3 = (0, _react.useState)(false),
      _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
      match = _useState4[0],
      setMatch = _useState4[1];

  var handler = (0, _react.useRef)(function (match) {
    setMatch(match);
    nextTick(function () {
      return getRouter().updatePageLinks();
    });
  });
  (0, _react.useEffect)(function () {
    // @ts-ignore
    var router = getRouter();
    router.notFound(handler.current, hooks);
    router.addLeaveHook("__NOT_FOUND__", function (done) {
      setMatch(false);
      done();
    });
    router.resolve();
    router.updatePageLinks();
    return function () {
      router.off(handler.current);
    };
  }, []);
  return match;
}

var API = {
  getRouter: getRouter,
  configureRouter: configureRouter,
  reset: reset,
  Route: Route,
  Base: Base,
  Switch: Switch,
  NotFound: NotFound,
  Redirect: Redirect,
  useNavigo: useNavigo,
  useLocation: useLocation
};
var _default = API;
exports["default"] = _default;
//# sourceMappingURL=NavigoReact.js.map