# Bench results across versions

### 2.3.1 Results ###

iterations:  700000

* 80ms - calling vanilla function
* 148ms - inlined code
* 454ms - inlined functions
* 485ms - replaced function
* 3465ms - before function noop
* 3553ms - before function
* 3551ms - before function with context
* 3450ms - before function changing context
* 3521ms - before function changing args
* 1060ms - multiple (10) inlined operations
* 2777ms - multiple (10) regular function replacements
* 6237ms - multiple (10) befores
* 5843ms - multiple (10) noop befores

### 3.0.0 Results ###

iterations:  700000

* 78ms - calling vanilla function
* 169ms - inlined code
* 435ms - inlined functions
* 382ms - replaced function
* 4545ms - beforeQueue function noop
* 4690ms - beforeQueue function
* 4718ms - beforeQueue function with context
* 5140ms - beforeQueue function changing context
* 5502ms - beforeQueue function changing args
* 15073ms - beforeInherit function noop
* 14906ms - beforeInherit function
* 14123ms - beforeInherit function with context
* 13354ms - beforeInherit function changing context
* 14284ms - beforeInherit function changing args
* 1424ms - multiple (10) inlined operations
* 4574ms - multiple (10) regular function replacements
* 9139ms - multiple (10) befores
* 9523ms - multiple (10) noop befores
