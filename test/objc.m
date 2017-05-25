#import <Cocoa/Cocoa.h>
#import <QuartzCore/QuartzCore.h>

@interface DelegateObject : NSObject <CALayerDelegate>
@end

@implementation DelegateObject
- (id<CAAction>)actionForLayer:(CALayer *)layer forKey:(NSString *)key {
	CABasicAnimation *animation = [CABasicAnimation animationWithKeyPath:key];
	animation.fromValue = @1.0;
	animation.toValue = @1.0;
	animation.additive = YES;
	animation.duration = 1.0;
	NSLog(@"animationForKey:%@;",key);
	return animation;
}
@end

int main () {
	@autoreleasepool {

		CGFloat duration = 0.1;

		NSWindow *window = [[[NSWindow alloc] initWithContentRect:NSMakeRect(0, 0, 100, 100) styleMask:NSWindowStyleMaskTitled backing:NSBackingStoreBuffered defer:NO] autorelease];
		NSView *contentView = [window contentView];
		[contentView setWantsLayer:YES];
		CALayer *layer = [CALayer layer];
		layer.opacity = 1.0;
		[contentView.layer addSublayer:layer];
		CALayer *secondLayer = [CALayer layer]; // for transaction test, cannot have layer delegate return no animation
		[contentView.layer addSublayer:secondLayer];

		CGPoint oneDestination = CGPointMake(123.0, 123.0);
		layer.position = oneDestination;
		CGPoint onePre = layer.presentationLayer.position;
		CGPoint oneModelPre = layer.position;
		if (CGPointEqualToPoint(oneModelPre, oneDestination)) NSLog(@"values applied to modelLayer after setting"); // true
		else NSLog(@"values NOT applied to modelLayer after setting"); // false

		if (CGPointEqualToPoint(onePre, oneDestination)) NSLog(@"values applied to presentationLayer after setting"); // false
		else NSLog(@"values NOT applied to presentationLayer after setting"); // true

		[CATransaction flush];
		CGPoint onePost = layer.presentationLayer.position;

		if (CGPointEqualToPoint(onePost, oneDestination)) NSLog(@"values applied to presentationLayer after flushing"); // true
		else NSLog(@"values NOT applied to presentationLayer after flushing"); // false

		CABasicAnimation *two = [CABasicAnimation animationWithKeyPath:@"position"];
		CGPoint twoDestination = CGPointMake(234.0,234.0);
		two.duration = duration;
		two.fromValue = [NSValue valueWithPoint:NSPointFromCGPoint(twoDestination)];
		two.toValue = [NSValue valueWithPoint:NSPointFromCGPoint(twoDestination)];

		[layer addAnimation:two forKey:nil];

		CGPoint twoPre = layer.presentationLayer.position;
		if (CGPointEqualToPoint(twoPre,twoDestination)) NSLog(@"animation apparent in presentationLayer after adding"); // false
		else NSLog(@"animation NOT apparent in presentationLayer after adding"); // true
		
		[CATransaction flush];

		CGPoint twoPost = layer.presentationLayer.position;
		if (CGPointEqualToPoint(twoPost,twoDestination)) NSLog(@"animation apparent in presentationLayer after flushing"); // true
		else NSLog(@"animation NOT apparent in presentationLayer after flushing"); // false

		[CATransaction begin];
		CGPoint threeDestination = CGPointMake(345.0,345.0);
		layer.position = threeDestination;
		[CATransaction flush];
		[CATransaction commit];
		[CATransaction flush];
		CGPoint threePost = layer.presentationLayer.position;
		if (CGPointEqualToPoint(threePost,threeDestination)) NSLog(@"values flushed out of an explicit transaction"); // false
		else NSLog(@"values NOT flushed out of an explicit transaction"); // true

		CABasicAnimation *four = [CABasicAnimation animationWithKeyPath:@"position"];
		CGPoint fourDestination = CGPointMake(456.0,456.0);
		four.duration = duration;
		four.fromValue = [NSValue valueWithPoint:NSPointFromCGPoint(fourDestination)];
		four.toValue = [NSValue valueWithPoint:NSPointFromCGPoint(fourDestination)];
		[CATransaction begin];
		[layer addAnimation:four forKey:@"four"];
		[CATransaction flush];
		[CATransaction commit];
		[CATransaction flush];
		CGPoint fourPost = layer.presentationLayer.position;
		if (CGPointEqualToPoint(fourPost,fourDestination)) NSLog(@"animation flushed out of an explicit transaction"); // false
		else NSLog(@"animation NOT flushed out of an explicit transaction"); // true

		CFTimeInterval fiveStart = CACurrentMediaTime();
		[NSThread sleepForTimeInterval:duration];
		CFTimeInterval fiveMid = CACurrentMediaTime();
		if (fiveStart == fiveMid) NSLog(@"time is the same inside implicit transaction"); // false
		else NSLog(@"time is NOT the same inside implicit transaction"); // true
		[NSThread sleepForTimeInterval:duration];
		[CATransaction begin];
		CFTimeInterval sixMid = CACurrentMediaTime();
		if (fiveMid == sixMid) NSLog(@"time is the same from one transaction to the next"); // false
		else NSLog(@"time is NOT the same from one transaction to the next"); // true
		[CATransaction commit];

		DelegateObject *delegate = [[DelegateObject alloc] init];
		layer.delegate = delegate;
		layer.borderWidth = 0.25;
		[CATransaction flush];
		NSLog(@"layer.borderWidth zero:%f;",layer.presentationLayer.borderWidth); // 1.25
		layer.borderWidth = 0.5;
		[CATransaction flush];
		NSLog(@"layer.borderWidth one:%f;",layer.presentationLayer.borderWidth); // 1.5
		layer.borderWidth = 0.75;
		[CATransaction flush];
		NSLog(@"layer.borderWidth two:%f;",layer.presentationLayer.borderWidth); // 1.75

		layer.opacity = 1.0; // animationKeys should remain @[position, borderWidth]
		[CATransaction flush];
		//NSLog(@"animationKeys:%@;",layer.animationKeys);
		if (layer.animationKeys.count == 2) NSLog(@"Animations are not asked for if value does not change"); // true
		else NSLog(@"Animations are asked for if value does not change"); // false

		layer.opacity = 0.5; // animationKeys should become @[opacity, borderWidth, position]
		[CATransaction flush];
		if (layer.animationKeys.count == 3) NSLog(@"Animations are asked for if value does change"); // true
		else NSLog(@"Animations are not asked for if value does change"); // false

		layer.delegate = nil; // animationForKey:delegate;
		[delegate release];

		__block BOOL run = YES;
		CFTimeInterval lastStart = CACurrentMediaTime();
		CABasicAnimation *last = [CABasicAnimation animationWithKeyPath:@"position"];
		last.fromValue = [NSValue valueWithPoint:NSMakePoint(567.0,567.0)];
		last.toValue = [NSValue valueWithPoint:NSMakePoint(567.0,567.0)];

		secondLayer.opacity = 0.0;
		[secondLayer setValue:@0.0 forKey:@"also"];

		[CATransaction begin];
		[CATransaction setAnimationDuration:duration * 4];

		[CATransaction begin];
		[CATransaction setAnimationDuration:duration * 2];
		[CATransaction setCompletionBlock: ^void {
			
			CALayer *presentationLayer = secondLayer.presentationLayer;
			NSLog(@"presentationLayer opacity post:%f; should be 0.5",presentationLayer.opacity);
			if (presentationLayer.opacity > 0.25 && presentationLayer.opacity < 0.75) {
				NSLog(@"properties animate implicitly with transaction duration alone");
			} else NSLog(@"properties do NOT animate implicitly with transaction duration alone (but I think my test is faulty because it does in an Xcode project, perhaps a fault with the runloop setup. Note that presentationLayer.opacity pre is 0.0 and correct if you comment out all the transaction flushing above.)");

// 			if ([[presentationLayer valueForKey:@"also"] floatValue] > 0.25 && [[presentationLayer valueForKey:@"also"] floatValue] < 0.75) {
// 				NSLog(@"arbitrary properties animate easily");
// 			} else NSLog(@"arbitrary properties do NOT animate easily");

			CFTimeInterval lastEnd = CACurrentMediaTime();
			if (lastEnd - lastStart > duration) NSLog(@"transaction duration used when explicit animations have none"); // true
			else NSLog(@"transaction duration NOT used when explicit animations have none"); // false
			run = NO;
		}];
		[layer addAnimation:last forKey:@"last"];
		[CATransaction commit];

		secondLayer.opacity = 1.0;
		[secondLayer setValue:@1.0 forKey:@"also"];

		[CATransaction commit];

		CALayer *presentationLayer = secondLayer.presentationLayer;
		NSLog(@"presentationLayer opacity pre:%f; should be 0.0",presentationLayer.opacity);
			

		NSRunLoop *loop = [NSRunLoop currentRunLoop];
		[loop addPort:[NSMachPort port] forMode:NSDefaultRunLoopMode];
		while (run) {
			[loop runMode:NSDefaultRunLoopMode beforeDate:[NSDate distantFuture]];
		}

	}
	return 0;
}