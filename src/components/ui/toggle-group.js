"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToggleGroup = ToggleGroup;
exports.ToggleGroupItem = ToggleGroupItem;
var React = require("react");
var ToggleGroupPrimitive = require("@radix-ui/react-toggle-group");
var utils_1 = require("@/lib/utils");
var toggle_1 = require("@/components/ui/toggle");
var ToggleGroupContext = React.createContext({
    size: "default",
    variant: "default",
    spacing: 0,
});
function ToggleGroup(_a) {
    var className = _a.className, variant = _a.variant, size = _a.size, _b = _a.spacing, spacing = _b === void 0 ? 0 : _b, children = _a.children, props = __rest(_a, ["className", "variant", "size", "spacing", "children"]);
    return (<ToggleGroupPrimitive.Root data-slot="toggle-group" data-variant={variant} data-size={size} data-spacing={spacing} style={{ "--gap": spacing }} className={(0, utils_1.cn)("group/toggle-group flex w-fit items-center gap-[--spacing(var(--gap))] rounded-md data-[spacing=default]:data-[variant=outline]:shadow-xs", className)} {...props}>
      <ToggleGroupContext.Provider value={{ variant: variant, size: size, spacing: spacing }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>);
}
function ToggleGroupItem(_a) {
    var className = _a.className, children = _a.children, variant = _a.variant, size = _a.size, props = __rest(_a, ["className", "children", "variant", "size"]);
    var context = React.useContext(ToggleGroupContext);
    return (<ToggleGroupPrimitive.Item data-slot="toggle-group-item" data-variant={context.variant || variant} data-size={context.size || size} data-spacing={context.spacing} className={(0, utils_1.cn)((0, toggle_1.toggleVariants)({
            variant: context.variant || variant,
            size: context.size || size,
        }), "w-auto min-w-0 shrink-0 px-3 focus:z-10 focus-visible:z-10", "data-[spacing=0]:rounded-none data-[spacing=0]:shadow-none data-[spacing=0]:first:rounded-l-md data-[spacing=0]:last:rounded-r-md data-[spacing=0]:data-[variant=outline]:border-l-0 data-[spacing=0]:data-[variant=outline]:first:border-l", className)} {...props}>
      {children}
    </ToggleGroupPrimitive.Item>);
}
