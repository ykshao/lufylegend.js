/*
* LEvent.added.js
**/
LEvent.ADDED = "added";
LEvent.ADDED_TO_STAGE = "addedToStage";
LEvent.REMOVED = "removed";
LEvent.REMOVED_FROM_STAGE = "removedFromStage";
LDisplayObjectContainer.prototype._ll_added_addChild = LDisplayObjectContainer.prototype.addChild;
LDisplayObjectContainer.prototype.addChild = function (d) {
	var r = this._ll_added_addChild(d);
	if (r.dispatchEvent) {
		r.dispatchEvent(LEvent.ADDED);
	}
	if (r.dispatchEventAddToStage) {
		r.dispatchEventAddToStage();
	}
	return r;
};
LDisplayObjectContainer.prototype._ll_added_addChildAt = LDisplayObjectContainer.prototype.addChildAt;
LDisplayObjectContainer.prototype.addChildAt = function (d, i) {
	var r = this._ll_added_addChildAt(d, i);
	if (!r) {
		return;
	}
	if (r.dispatchEvent) {
		r.dispatchEvent(LEvent.ADDED);
	}
	if (r.dispatchEventAddToStage) {
		r.dispatchEventAddToStage();
	}
	return r;
};
LInteractiveObject.prototype.dispatchEventAddToStage = function () {
	var s = this, p = s.parent;
	while (p && p != "root") {
		p = p.parent;
	}
	if (p == "root") {
		s._dispatchEventAddToStage();
		/*
		if(s.hasEventListener(LEvent.ADDED_TO_STAGE)){
			console.log("dispatchEventAddToStage",s);
			s.dispatchEvent(LEvent.ADDED_TO_STAGE);
		}*/
	}
};
LInteractiveObject.prototype._dispatchEventAddToStage = function () {
	var s = this, i, l;
	if (!s.dispatchEvent) {
		return;
	}
	if(s.hasEventListener(LEvent.ADDED_TO_STAGE)){
		s.dispatchEvent(LEvent.ADDED_TO_STAGE);
	}
	if (!s.childList) {
		return;
	}
	for (i = 0, l = s.childList.length; i < l; i++) {
		if(!s.childList[i]._dispatchEventAddToStage){
			continue;
		}
		s.childList[i]._dispatchEventAddToStage();
	}
};
LDisplayObjectContainer.prototype._ll_removed_removeChild = LDisplayObjectContainer.prototype.removeChild;
LDisplayObjectContainer.prototype.removeChild = function (d) {
	var s = this, h = d.inStage();
	d.dispatchEvent(LEvent.REMOVED);
	if (h) {
		d._dispatchEventRemovedFromStage();
	}
	s._ll_removed_removeChild(d);
};
LDisplayObjectContainer.prototype._dispatchEventRemovedFromStage = function () {
	var s = this, i, l;
	if (!s.dispatchEvent) {
		return;
	}
	s.dispatchEvent(LEvent.REMOVED_FROM_STAGE);
	for (i = 0, l = s.childList.length; i < l; i++) {
		if(!s.childList[i]._dispatchEventRemovedFromStage){
			continue;
		}
		s.childList[i]._dispatchEventRemovedFromStage();
	}
};
LDisplayObjectContainer.prototype._ll_removed_removeChildAt = LDisplayObjectContainer.prototype.removeChildAt;
LDisplayObjectContainer.prototype.removeChildAt = function (i) {
	var s = this, d = s.getChildAt(i);
	if (!d) {
		return;
	}
	var h = d.inStage();
	d.dispatchEvent(LEvent.REMOVED);
	if (h) {
		d._dispatchEventRemovedFromStage();
	}
	s._ll_removed_removeChild(d);
};
LDisplayObjectContainer.prototype.inStage = function () {
	var s = this, p = s.parent;
	while (p && p != "root") {
		p = p.parent;
	}
	return p == "root";
};
