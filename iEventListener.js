
/******************************************************************************
 * eventListener interface for objects:
 * Whit this snippet you can emulate the eventListener interface in objects that don't support it natively
 * you can also emulate the ie<9 non standard interface
 * or add the corresponding one if needed;
 *
 * usage:
 * copy the function in a way like this:
 *
 * var myObject = {};
 *
 * iEvent.call(myObject, true);                        	       // add the Event interface in myObject with the ie like method too;
 *
 * var removableHandler = function(){ ... }                    // this function will be removed
 *
 * myObject.addEventListener('myevent', function(e){ ... });   // do something when the dispatchEvent is called
 * myObject.attachEvent('onmyevent', function(e){ ... });      // ie like method are supported if needed
 *
 * myObject.addEventListener('myevent', removableHandler);
 *
 * myObject.onmyevent = function(e){ ... };	                   // do something before fire event listener handlers;
 * 
 * ...
 * 
 * myObject.removeEventListener('myevent', removableHandler);  // of course you can remove event listeners
 * 
 * myObject.dispatchEvent(new Event('myevent'), 'you can add additional arguments');
 ******************************************************************************
 * Autor: Antonio
 * Licence: gpl or something like that;
 ******************************************************************************/


(function(w){
	"use strict"
	var names = [
			['addEventListener','removeEventListener','dispatchEvent'],
			['attachEvent','detachEvent','fireEvent']
		];
		
	/* polyfil, comment to prevent */
	w = w || {document:{},Element:{prototype:{}}};
	iEvent.call(w, true);
	iEvent.call(w.document, true);
	iEvent.call(w.Element.prototype, true);
	/* addEventListener on ie8? attachEvent on chrome?? why not? */
	
	w = w || {}
	return w.iEvent = iEvent;
	
	function iEvent(ieSupport, registeredEventSupport, allEvents, fallbacks){
		allEvents = allEvents || {};
		do{
			ieSupport = !!ieSupport<<0;
			for (var apiset = names[ieSupport], i = apiset.length - 1; i >= 0; i--) {
				this[apiset[i]] = this[apiset[i]] || evtFallwrap.call(this, names[!ieSupport<<0], i, ieSupport, fallbacks);
			}
		}while( (ieSupport = !ieSupport) === false);
		if(registeredEventSupport){
			this.registerEvent = function(event){
				allEvents[event] = allEvents[event] || [];
				return ((!allEvents[event].eventSignature) ? (allEvents[event].eventSignature = new EventSignature()) : undefined);
			}
		}
		return this;
			
		/*
		 * the evtFallwrap function, when invoked, return the corresponding functions in the in the native interface or make an emulation
		 */
		function evtFallwrap(whoe, index, nie , fallbacks){
			fallbacks = fallbacks || [add,remove,dispatch];
			
			return self[whoe[index]] ? function(){evtSelector.apply(this, arguments)} : function(){fallbacks[index].apply(this, arguments)};
			
			function evtSelector(evnt,func,capt){
				if(index == 2){
					arguments[0] = nie ? new Event(arguments[0].replace(/^on/, '')) : "on"+evnt.type;
				}else{
					arguments[0] = nie? evnt.replace(/^on/, '') : "on"+evnt;
					arguments[2] = !nie && capt? (!nie < 0 ? self.setCapture() : self.removeCapture() ) : capt;
				}
				return self[whoe[index]].apply(self, arguments);
			}
					
			function add(event, handler) {
				event = nie? event.replace(/^on/, ''): event;
				allEvents[event] = allEvents[event] || [];
				allEvents[event].push(handler);
			}
			
			function remove(event, handler) {
				event = nie? event.replace(/^on/, '') : event;
				for (var i in allEvents[event]) {
					if(allEvents[event][i] === handler){
						allEvents[event][i] = void(0);
					}
				}
			}
			
			function dispatch() {
				arguments[0] = nie ? new Event(arguments[0].replace(/^on/, '')) : arguments[0];
				var onevt = self['on'+arguments[0].type],
					eventList = allEvents[arguments[0].type || arguments[0].replace(/^on/, '')];
				if((!eventList) || (eventList.eventSignature && eventList.eventSignature != arguments[1])){
					return;
				}
				w.event = arguments[0];
				if(onevt instanceof Function){
					onevt.apply(self, arguments );
				}
				for (var i in eventList){
					if(eventList[i] instanceof Function){
						eventList[i].apply(self, arguments);
					}
				}
				w.event = void(0);
				return true;
			}
		}
		
		function EventSignature(argument) {
			this.timestamp = new Date()*1
		}
	}
})(this || window);
