#import <Cocoa/Cocoa.h>
#import <QuartzCore/QuartzCore.h>
int main () {
  @autoreleasepool {

    CGFloat duration = 0.1;

    NSWindow *window = [[[NSWindow alloc] initWithContentRect:NSMakeRect(0, 0, 100, 100) styleMask:NSWindowStyleMaskTitled backing:NSBackingStoreBuffered defer:NO] autorelease];
    NSView *contentView = [window contentView];
    [contentView setWantsLayer:YES];
    CALayer *layer = [CALayer layer];
    [contentView.layer addSublayer:layer];

    CGPoint oneDestination = CGPointMake(123.0, 123.0);
    layer.position = oneDestination;
    CGPoint onePre = layer.presentationLayer.position;

    if (CGPointEqualToPoint(onePre, oneDestination)) NSLog(@"values applied to presentationLayer after setting");
    else NSLog(@"values NOT applied to presentationLayer after setting");

    [CATransaction flush];
    CGPoint onePost = layer.presentationLayer.position;

    if (CGPointEqualToPoint(onePost, oneDestination)) NSLog(@"values applied to presentationLayer after flushing");
    else NSLog(@"values NOT applied to presentationLayer after flushing");

    CABasicAnimation *two = [CABasicAnimation animationWithKeyPath:@"position"];
    CGPoint twoDestination = CGPointMake(234.0,234.0);
    two.duration = duration;
    two.fromValue = [NSValue valueWithPoint:NSPointFromCGPoint(twoDestination)];
    two.toValue = [NSValue valueWithPoint:NSPointFromCGPoint(twoDestination)];

    [layer addAnimation:two forKey:nil];

    CGPoint twoPre = layer.presentationLayer.position;
    if (CGPointEqualToPoint(twoPre,twoDestination)) NSLog(@"animation apparent in presentationLayer after adding");
    else NSLog(@"animation NOT apparent in presentationLayer after adding");
    
    [CATransaction flush];

    CGPoint twoPost = layer.presentationLayer.position;
    if (CGPointEqualToPoint(twoPost,twoDestination)) NSLog(@"animation apparent in presentationLayer after flushing");
    else NSLog(@"animation NOT apparent in presentationLayer after flushing");

    [CATransaction begin];
    CGPoint threeDestination = CGPointMake(345.0,345.0);
    layer.position = threeDestination;
    [CATransaction flush];
    [CATransaction commit];
    [CATransaction flush];
    CGPoint threePost = layer.presentationLayer.position;
    if (CGPointEqualToPoint(threePost,threeDestination)) NSLog(@"values flushed out of an explicit transaction");
    else NSLog(@"values NOT flushed out of an explicit transaction");

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
    if (CGPointEqualToPoint(fourPost,fourDestination)) NSLog(@"animation flushed out of an explicit transaction");
    else NSLog(@"animation NOT flushed out of an explicit transaction");

    CFTimeInterval fiveStart = CACurrentMediaTime();
    [NSThread sleepForTimeInterval:duration];
    CFTimeInterval fiveMid = CACurrentMediaTime();
    if (fiveStart == fiveMid) NSLog(@"time is the same inside implicit transaction");
    else NSLog(@"time is NOT the same inside implicit transaction");
    [NSThread sleepForTimeInterval:duration];
    [CATransaction begin];
    CFTimeInterval sixMid = CACurrentMediaTime();
    if (fiveMid == sixMid) NSLog(@"time is the same from one transaction to the next");
    else NSLog(@"time is NOT the same from one transaction to the next");
    [CATransaction commit];

    __block BOOL run = YES;
    CFTimeInterval sevenStart = CACurrentMediaTime();
    CABasicAnimation *seven = [CABasicAnimation animationWithKeyPath:@"position"];
    seven.fromValue = [NSValue valueWithPoint:NSMakePoint(567.0,567.0)];
    seven.toValue = [NSValue valueWithPoint:NSMakePoint(567.0,567.0)];

    [CATransaction begin];
    [CATransaction setAnimationDuration:duration * 2];
    [CATransaction setCompletionBlock: ^void {
      CFTimeInterval sevenEnd = CACurrentMediaTime();
      if (sevenEnd - sevenStart > duration) NSLog(@"transaction duration used when explicit animations have none");
      else NSLog(@"transaction duration NOT used when explicit animations have none");
      run = NO;
    }];
    [layer addAnimation:seven forKey:@"seven"];
    [CATransaction commit];

    NSRunLoop *loop = [NSRunLoop currentRunLoop];
    [loop addPort:[NSMachPort port] forMode:NSDefaultRunLoopMode];
    while (run) {
      [loop runMode:NSDefaultRunLoopMode beforeDate:[NSDate distantFuture]];
    }

  }
  return 0;
}