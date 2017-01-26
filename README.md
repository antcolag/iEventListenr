#iEventListener
emulates the eventListener interface in objects that don't support it natively<br>
this script also add the event listener interface to old browser and the ie8 like in new browser by default

####for example:

```javascript
// given an object like
var obj = {}

// you can add the both the event interfaces in this way:
window.iEvent.call(obj, true); // true for emulate the ie event interface, otherwise the argument can be omitted

// and then you can store handler by doing:
obj.addEventListener('goofy', function(e){console.log('addEventListener',arguments)});
obj.attachEvent('ongoofy', function(e){console.log('attachEvent',arguments)});
obj.ongoofy = function(e){console.log('ongoofy',arguments)};

// after that you may want do something else...

// finaly fire the event in the fashon you prefer
obj.dispatchEvent(new Event('goofy'));
obj.fireEvent('ongoofy');
```
will dispaly
```
ongoofy [Event]
addEventListener [Event]
attachEvent [Event]
ongoofy [Event]
addEventListener [Event]
attachEvent [Event]
```
there is a registerEvent function that can be added to the interface by providing another boolean argument after the ie one
registerEvent create a key and associate the key to the handler list then return the key, when dispatchEvent (or fireEvent) is called you need to provide the key after the event
```javascript
var obj = {}

window.iEvent.call(obj, true /* or false */, true ); // the last argument is for registerEvent interface
var k = obj.registerEvent('cabbage'); // generates a key for the 'cabbage' and store it in the k variable

obj.addEventListener('cabbage', function(){console.log(arguments)});

// ...

obj.dispatchEvent(new Event('cabbage')); // will not work...
obj.dispatchEvent(new Event('cabbage'), k); // ...because for dispatch the cabbage event you need to pass the key
```
is also possible to pass other arguments in ( dispatch || fire )Event they will be passed to the handlers

by default add the missing interface to window, document, Element.prototype if you want to avoid this behaviour, then you need to edit the polifil comment (delete the / at the end of the comment at line 47)
