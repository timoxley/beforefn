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
