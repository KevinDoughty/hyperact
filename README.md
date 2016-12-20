# Hyperact

Any resemblance to an animation library is purely coincidental. 
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


### Core


####`decorate(receiver, delegate, layer)`
  Provides `receiver` with methods and property accessors for animation management.

*Parameters*  
  `receiver {object}` Required. The object that receives methods and property accessors. Existing properties are automatically registered to animate by a call to `registerAnimatableProperty` with no default animation.  
  `delegate {object}` Optional. The object that implements also optional delegate methods. Default is `receiver`.  
  `layer {object}` Optional. The object upon which property value changes trigger implicit animation. Default is `receiver`.  

*Returns*  
  `{object}` The same `receiver` with animation management methods and property accessors.

*Discussion*  
  Currently, behavior is undefined if there are any naming collisions. 
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


### Receiver Methods


#### `registerAnimatableProperty(property, default)`
  Enables implicit animation on property value change of the receiver’s layer.

*Parameters*  
  `property {string}` Required. The name of the animatable property.  
  `default {object|number}` Optional. The description or duration used to implicitly animate on registered property value change.  

*Returns*  
  `{object}` The same `receiver` with animation management functions.

*Discussion*  
  The default animation may be changed by calling again, but there is currently no way to deregister.


#### `needsDisplay()`
  Schedules a call of the delegate method `display` at the next animation frame.

*Returns*  
  `{undefined}`


#### `addAnimation(description, name)`
  Adds an animation to the receiver.

*Parameters*  
  `description {object|number}` Required. An animation description. Duration is also allowed but not expected to be useful.  
  `name {string}` Optional. If provided, becomes the argument needed for `animationNamed` and `removeAnimation`.  

*Returns*  
  `{undefined}`

*Discussion*  
  If not undefined, any previous animation with the same name would get replaced.


#### `removeAnimation(name)`

*Parameters*  
  `name {string}` Required. The `name` argument that was passed to `addAnimation`.  

*Returns*  
  `{undefined}`


#### `animationNamed(name)`

*Parameters*  
  `name {string}` Required. The `name` argument that was passed to `addAnimation`.  

*Returns*  
  `{object}` A description of the animation.


#### `allAnimations`

*Returns*  
  `{Array}` An array descriptions of active animations.


#### `removeAllAnimations`
  Removes all animations, including those not accessible for lack of a name.

*Returns*  
  `{undefined}`


### Receiver Property Accessors


#### `get layer`

*Returns*  
  `{object}` The object upon which changes to property values can be made to trigger implicit animation.
  

#### `set layer`
  Perform a merge of properties similar to React’s `setState`. 
  Properties are automatically registered to animate by a call to `registerAnimatableProperty` with no default animation.
  Delegate `animationForKey` calls are triggered on value change of respective properties.

*Returns*  
  `{undefined}`

*Discussion*  
  Currently there is no way to deregister properties.


#### `get model`

*Returns*  
  `{object} A copy of the layer reflecting specified values.


#### `get presentation`

*Returns*  
  `{object} A copy of the layer reflecting animated values.


#### `get previous`

*Returns*  
  `{object} A copy of the layer reflecting previous values.


### Delegate methods


#### `animationForKey(key, value, previous, presentation)`
  Optional. If this method is implemented, the delegate will be asked to return an animation to run in response to every value change of registered properties.

*Parameters*  
  `key {string}` The property that changed.  
  `value {any}` The new value.  
  `previous {any}` The previous value.  
  `presentation {any}` The current animated value.  

*Returns*  
  `{object|number|null|undefined}` Expects an animation description or duration to animate. Returning undefined is equivalent to returning the default animation registered by `registerAnimatableProperty`. Returning null will result in no animation, regardless if a default is registered.


#### `display`
  Optional. If this method is implemented, it will be called on every animation frame to render the results. Layer values reflect animated values.

*Discussion*  
  Currently, neither `decorate` nor `registerAnimatableProperty` result in calls to `display` but this may change in the future.

*Returns*  
  `{undefined}` Expects nothing. A return value is ignored.


#### `input`
  Optional. A value transformer. If this method is implemented, it must return a value.

*Parameters*  
  `key {string}` The affected property.  
  `value {any}` The value to be transformed.  

*Returns*  
  `{any}` Expects the transformed value.


#### `output`
  Optional. A value transformer. If this method is implemented, it must return a value.

*Parameters*  
  `key {string}` The affected property.  
  `value {any}` The value to be transformed.  

*Returns*  
  `{any}` Expects the transformed value.


## Style

Files in the [source/style directory](https://github.com/KevinDoughty/hyperact/tree/master/source/style) are highly modified derivative works of [web-animations-js-legacy](https://github.com/web-animations/web-animations-js-legacy).


## Examples

- [tags](https://kevindoughty.github.io/hyperact/examples/tags/) Hello world using script tags
- [basic](https://kevindoughty.github.io/hyperact/examples/basic/) Hello world using ES6 import
- [rococo](https://kevindoughty.github.io/hyperact/examples/rococo/) Canvas drawing example
- [bohr](https://kevindoughty.github.io/hyperact/examples/bohr/) The not quite Bohr model of the atom


## License

Apache-2.0

