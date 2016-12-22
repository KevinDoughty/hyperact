# Hyperact

This is a work in progress, still poorly defined in many areas. 
Documentation does not mean implementation. 
Beware changes like renaming, with semver violations, for just a little while longer.

```javascript
import { decorate } from "Hyperact";

const view = {
	animationForKey: (key, value, previous, presentation) => 1.0,
	display: () => console.log("x:%s;",this.x),
	x: 0
}
decorate(view);
console.log("x:zero;");
view.x = 1;
```


## Core


####`decorate(receiver, delegate, layer)`
  Provides `receiver` with methods and property accessors for animation management.

*Parameters*  
  - `receiver {object}` Required. The object that receives methods and property accessors. Existing properties are automatically registered to animate. 
  - `delegate {object}` Optional. The object that implements also optional delegate methods. Default is `receiver`.  
  - `layer {object}` Optional. The object upon which property value change triggers implicit animation. Default is `receiver`.  

*Returns*  
  `{object}` The same `receiver` with animation management methods and property accessors.

*Discussion*  
  Currently, behavior is undefined if there are any naming collisions, 
  including calling decorate with the same object more than once. 
  The provided receiver methods are 
  `registerAnimatableProperty`, 
  `needsDisplay`, 
  `addAnimation`, 
  `removeAnimation`, 
  `animationNamed`, 
  `allAnimations`, and 
  `removeAllAnimations`.
  The provided receiver property accessors are 
  `layer`,
  `model`,
  `presentation`, and 
  `previous`.
  The optional delegate methods are 
  `animationForKey`, 
  `display`, 
  `input`, and 
  `output`.


## Receiver Methods
  The following methods are added to the `receiver`, the first argument to the `decorate` function.


#### `registerAnimatableProperty(property, default)`
  Enables implicit animation on property value change of the receiver’s layer.

*Parameters*  
  - `property {string}` Required. The name of the animatable property.  
  - `default {object|number}` Optional. The description or duration used to implicitly animate on registered property value change.  

*Returns*  
  `{undefined}`

*Discussion*  
  The default animation may be changed by calling again, but there is currently no way to deregister.


#### `needsDisplay()`
  Schedules a call of the delegate method `display` at the next animation frame.

*Returns*  
  `{undefined}`


#### `addAnimation(description, name)`
  Adds an animation to the receiver.

*Parameters*  
  - `description {object|number}` Required. An animation description. Duration is also allowed but not expected to be useful.  
  - `name {string}` Optional. If provided, becomes the argument needed for `animationNamed` and `removeAnimation`.  

*Returns*  
  `{undefined}`

*Discussion*  
  If not undefined, any previous animation with the same name would get replaced.


#### `removeAnimation(name)`

*Parameters*  
  - `name {string}` Required. The `name` argument that was passed to `addAnimation`.  

*Returns*  
  `{undefined}`


#### `animationNamed(name)`

*Parameters*  
  - `name {string}` Required. The `name` argument that was passed to `addAnimation`.  

*Returns*  
  `{object}` A description of the animation.


#### `allAnimations`

*Returns*  
  `{Array}` An array descriptions of active animations.


#### `removeAllAnimations`
  Removes all animations from the receiver, including those not accessible for lack of a name.

*Returns*  
  `{undefined}`


## Receiver Property Accessors
  The following property accessors are added to the `receiver`, the first argument to the `decorate` function.


#### `get layer`

*Returns*  
  `{object}` The object upon which changes to property values can be made to trigger implicit animation.
  

#### `set layer`
  Perform a merge of properties like React’s `setState` but synchronous. 
  Properties are automatically registered to animate, 
  no call to `registerAnimatableProperty` is needed, 
  unless to specify a default animation.
  Delegate `animationForKey` calls are triggered on value change of respective properties.

*Returns*  
  `{undefined}`

*Discussion*  
  Currently there is no way to deregister properties.


#### `get model`

*Returns*  
  `{object}` A copy of the layer reflecting specified values.


#### `get presentation`

*Returns*  
  `{object}` A copy of the layer reflecting animated values.


#### `get previous`

*Returns*  
  `{object}` A copy of the layer reflecting previous values.


## Delegate methods
  The following methods, when implemented on the `delegate` object passed as the second argument to the `decorate` function,
  allow additional configuration.


#### `display`
  Optional. 
  This will be called at every animation frame of a `receiver` with running animations.
  Properties will reflect current animated values. 
  An implementation should apply those values here to produce animated results.

*Returns*  
  `{undefined}` Expects nothing. A return value is ignored.

*Discussion*  
  Currently, neither `decorate` nor `registerAnimatableProperty` result in a call to `display` but this may change in the future.


#### `animationForKey(key, value, previous, presentation)`
  Optional. If this method is implemented, the delegate will be asked to return an animation to run in response to every value change of registered properties.

*Parameters*  
  - `key {string}` The property that changed.  
  - `value {any}` The new value.  
  - `previous {any}` The previous value.  
  - `presentation {any}` The current animated value.  

*Returns*  
  `{object|number|null|undefined}` Expects an animation description or duration to animate. 
  Returning undefined is equivalent to returning the default animation registered by `registerAnimatableProperty`. 
  Returning null will result in no animation, regardless if a default is registered.


#### `input`
  Optional. A value transformer. If this method is implemented, it must return a value.

*Parameters*  
  - `key {string}` The affected property.  
  - `value {any}` The value to be transformed.  

*Returns*  
  `{any}` Expects the transformed value.


#### `output`
  Optional. A value transformer. If this method is implemented, it must return a value.

*Parameters*  
  - `key {string}` The affected property.  
  - `value {any}` The value to be transformed.  

*Returns*  
  `{any}` Expects the transformed value.


## Animation Descriptions
  Currently there are no exposed animation classes but this might change.
  A number, array, or object literal is returned by `animationForKey`, 
  and passed to `addAnimation` and `registerAnimatableProperty`.
  

### Basic Animation


*Parameters*
  - `property {string}`
  - `from {any}` Type specific
  - `to; {any}` Type specific
  - `type {object}` Must implement `zero`, `add`, `subtract` and `interpolate`. Default is `HyperNumber`.
  - `duration {number}` In seconds!
  - `easing {function}` currently callback function only, need cubic bezier and presets. Defaults to linear
  - `delay {number}` In seconds
  - `blend {string}` "relative" (the default) or "absolute" but will probably be changed to `absolute {boolean}` defaulting to `false`.
  - `additive {boolean}` The default is true!
  - `speed {number}` Not finished.
  - `iterations {number}` Default is 1.
  - `autoreverse {boolean}` When iterations > 1. Easing also reversed.
  - `fillMode {string}` Not finished.
  - `index {number}` For a custom compositing order.
  - `finished {number}` Not finished. Should be `finished {boolean}` or better yet private.
  - `startTime {number}` Set automatically when added.
  - `progress {number}` Between zero and one.
  - `onend {function}` Currently fires regardless of fillMode. Should be renamed.
  - `naming {string}` Not finished. "default", "exact", "increment", "nil" but might just be replaced with a "key" property
  - `remove {boolean}` If the animation is removed on completion.


## Group Animation


## Transactions
  Probably could use some work.


## Examples


- [tags](https://kevindoughty.github.io/hyperact/examples/tags/) Hello world using script tags
- [basic](https://kevindoughty.github.io/hyperact/examples/basic/) Hello world using ES6 import
- [rococo](https://kevindoughty.github.io/hyperact/examples/rococo/) Canvas drawing example
- [bohr](https://kevindoughty.github.io/hyperact/examples/bohr/) The not quite Bohr model of the atom
- tree-shaking (a failed attempt)
- chunks (nothing to see here)


## Credits


The API design is heavily influenced by [Core Animation](https://www.google.com/search?q=Core+Animation+Reference).


Files in the [source/style directory](https://github.com/KevinDoughty/hyperact/tree/master/source/style) are 
highly modified derivative works of [web-animations-js-legacy](https://github.com/web-animations/web-animations-js-legacy),
which is released under the same license.


## License

Apache-2.0

