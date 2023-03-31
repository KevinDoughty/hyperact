import { HyperAnimation, HyperKeyframes, HyperGroup, HyperChain, animationFromDescription } from "./actions.js";
import { HyperSet } from "./types.js";

const DELEGATE_DOUBLE_WHAMMY = true; // WET // MUST SYNC with core.js version

export function isFunction(w) { // WET
	return w && {}.toString.call(w) === "[object Function]";
}

// Called after animationFromDescription
export function prepAnimationObjectFromAddAnimation(animation, delegate, defaultAnimations, defaultTypes, registerAnimatable) { // If this is only called from addAnimation, why is it here?
	if (animation instanceof HyperAnimation || animation instanceof HyperKeyframes) {
		const prettyKey = animation.property;
		if (delegate && prettyKey && isFunction(delegate.typeOfProperty)) {
			const type = delegate.typeOfProperty.call(delegate, prettyKey);
			if (type) animation.type = type;
		}
		const uglyKey = DELEGATE_DOUBLE_WHAMMY ? convertedKey(prettyKey,delegate.keyInput,delegate) : prettyKey;
		const defaultAnim = defaultAnimations[uglyKey];
		const defaultType = defaultTypes[uglyKey] || resolveType(defaultAnim);

		if (animation.property && animation.type) registerAnimatable(animation.property, animation.type, true);

		if (animation instanceof HyperAnimation) {
			if (Array.isArray(animation.from) || Array.isArray(animation.to)) {
				if (!animation.type && isFunction(animation.sort)) animation.type = new HyperSet(animation.sort);
			}
			if (!animation.type) {
				animation.type = defaultType;
			}

			if (animation.from || animation.from === 0) animation.from = convertedInputOfProperty(animation.from,uglyKey,delegate,defaultTypes,animation.type);
			if (animation.to || animation.to === 0) animation.to = convertedInputOfProperty(animation.to,uglyKey,delegate,defaultTypes,animation.type);
			if (animation.delta || animation.delta === 0) animation.delta = convertedInputOfProperty(animation.delta,uglyKey,delegate,defaultTypes,animation.type);
		} else { // HyperKeyframes
			if (!animation.type) animation.type = defaultType;
			if (animation.keyframes) animation.keyframes = animation.keyframes.map( item => convertedInputOfProperty(item,uglyKey,delegate,defaultTypes,animation.type));
			if (animation.delta) animation.delta = animation.delta.map( item => convertedInputOfProperty(item,uglyKey,delegate,defaultTypes,animation.type));
		}
	} else if (animation instanceof HyperGroup) { // recursive
		animation.group.forEach( function(childAnimation) {
			prepAnimationObjectFromAddAnimation(childAnimation, delegate, defaultAnimations, defaultTypes, registerAnimatable);
		});
	} else if (animation instanceof HyperChain) { // recursive
		animation.chain.forEach( function(childAnimation) {
			prepAnimationObjectFromAddAnimation(childAnimation, delegate, defaultAnimations, defaultTypes, registerAnimatable);
		});
	} else throw new Error("not an animation");
}

export function convertedKey(property,funky,self) { // DELEGATE_DOUBLE_WHAMMY
	if (isFunction(funky)) return funky.call(self,property);
	return property;
}
export function convertedInputOfProperty(value,property,delegate,defaultTypes,animationType) { // mutates
	if (delegate && isFunction(delegate.input)) {
		return delegate.input.call(delegate,property,value); // completely override
	}
	let result = value;
	const defaultType = defaultTypes[property];
	if (animationType && isFunction(animationType.input)) {
		result = animationType.input.call(animationType,property,value);
	} else if (defaultType && isFunction(defaultType.input)) {
		result = defaultType.input.call(defaultType,property,value);
	}
	return result;
}
export function convertedOutputOfProperty(value,property,delegate,defaultTypes,animationType) { // mutates
	if (delegate && isFunction(delegate.output)) {
		const output = delegate.output.call(delegate,property,value); // completely override
		return output;
	}
	let result = value;
	const defaultType = defaultTypes[property];
	if (animationType && isFunction(animationType.output)) {
		result = animationType.output.call(animationType,property,value);
	} else if (defaultType && isFunction(defaultType.output)) {
		result = defaultType.output.call(defaultType,property,value);
	}
	return result;
}

export function resolveType(descriptionOrType) {
	if (!descriptionOrType) return null;// {};// have to return something, but really this should throw, or better yet be refactored to not happen
	if (descriptionOrType.type) {
		if (isFunction(descriptionOrType.type)) return new descriptionOrType.type();
		return descriptionOrType.type;
	} else {
		if (isFunction(descriptionOrType)) return new descriptionOrType();
		return descriptionOrType;
	}
}

export function isAnimationObject(animation) {
	if (animation && (animation instanceof HyperAnimation || animation instanceof HyperKeyframes || animation instanceof HyperGroup || animation instanceof HyperChain)) return true;
}



export function implicitAnimation(property,prettyValue,prettyPrevious,prettyPresentation,delegate,defaultAnimation,defaultType,transaction) { // TODO: Ensure modelLayer is fully populated before calls to animationForKey so you can use other props conditionally to determine animation
	let description, reply;
	if (isFunction(delegate.animationForKey)) reply = delegate.animationForKey.call(delegate,property,prettyValue,prettyPrevious,prettyPresentation); // TODO: rename action or implicit
	if (reply === null) return null; // null stops, undefined continues

	if (!defaultAnimation) defaultAnimation = { type:defaultType };
	if (defaultAnimation && !isAnimationObject(defaultAnimation)) description = Object.assign({},defaultAnimation); // new merging of defaultAnimation and animationForKey response
	if (description && !isAnimationObject(reply)) description = Object.assign(description, reply); // new merging of defaultAnimation and animationForKey response
	else if (reply || reply === 0) description = reply;

	let animation = animationFromDescription(reply); // pretty description !
	if (!animation) {
		animation = animationFromDescription(defaultAnimation); // default is not converted to ugly in registerAnimatableProperty
		if (animation) {
			if (!animation.duration && animation.duration !== 0) {
				if (transaction.duration) animation.duration = transaction.duration;
			} // Implement transaction tests before refactoring!
			if (!animation.duration) return null; // setting value inside zero duration transaction must not animate, but allow zero duration animations otherwise.
		}
	}
	if (animation && (animation instanceof HyperAnimation || animation instanceof HyperKeyframes)) {
		if (animation.property === null || typeof animation.property === "undefined") animation.property = property;
		if (animation instanceof HyperAnimation) {
			if (animation.from === null || typeof animation.from === "undefined") {
				if (animation.blend === "absolute") animation.from = prettyPresentation;
				else animation.from = prettyPrevious;
			}
			if (animation.to === null || typeof animation.to === "undefined") animation.to = prettyValue;
		}
		if (animation.easing === null || typeof animation.easing === "undefined") animation.easing = transaction.easing;
		if (animation.duration === null || typeof animation.duration === "undefined") animation.duration = transaction.duration;
		if (!animation.duration) animation.duration = 0.0;
	}
	return animation;
}
