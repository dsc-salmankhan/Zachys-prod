Ozine.addEventSimple = function (obj, evt, fn) {
  if (obj.addEventListener) {
    obj.addEventListener(evt, fn, false);
  } else if (obj.attachEvent) {
    obj.attachEvent(`on${evt}`, fn);
  }
};

Ozine.removeEventSimple = function (obj, evt, fn) {
  if (obj.removeEventListener) {
    obj.removeEventListener(evt, fn, false);
  } else if (obj.detachEvent) {
    obj.detachEvent(`on${evt}`, fn);
  }
};
Ozine.UI = {};
Ozine.UI.PressButton = function(element){
  var onPressEnd = function() {
    element.classList.remove('pressed');
    document.removeEventListener('mouseup', onPressEnd);
    document.removeEventListener('touchend', onPressEnd);
  };
  var onPress = function() {
    element.classList.add('pressed');
    document.addEventListener('mouseup', onPressEnd);
    document.addEventListener('touchend', onPressEnd);
  };
  Ozine.addEventSimple(element, 'mousedown', onPress);

}
Ozine.UI.popupize = function(button, popup, open_classname)
{
    button.popup = {};
    button.popup.mouseDownFN = function (event)
    {
        var target = event.target;
        while (target)
        {
            if (target == button || target == popup)
            {
                return true;
            }
            target = target.parentNode;
        }
        popup.style.display = 'none';
        open_classname && button.classList.remove(open_classname);
        Ozine.removeEventSimple(document, 'mousedown', button.popup.mouseDownFN);
        button.popup.onClose && button.popup.onClose();
    }
    button.popup.close = function()
    {
        popup.style.display = 'none';
        open_classname && button.classList.remove(open_classname);
        Ozine.removeEventSimple(document, 'mousedown', button.popup.mouseDownFN);
        button.popup.onClose && button.popup.onClose();
    }
    button.popup.toggle = function (event)
    {
        var target = event.target;
        while (target)
        {
            if (target == popup)
            {
                return true;
            }
            target = target.parentNode;
        }
        popup.style.display = ((popup.style.display == 'none') ? '' : 'none');
        if (popup.style.display == '')
        {
            if (open_classname && !button.classList.contains(open_classname))
            {
                open_classname && button.classList.add(open_classname);
            }
            Ozine.addEventSimple(document, 'mousedown', button.popup.mouseDownFN);
            button.popup.onOpen && button.popup.onOpen();
        }
        else {
            open_classname && button.classList.remove(open_classname)
            Ozine.removeEventSimple(document, 'mousedown', button.popup.mouseDownFN);
            button.popup.onClose && button.popup.onClose();
        }
    }
    button.onclick = button.popup.toggle;
}

Ozine.UI.reorder = function (item, event, callback) {
	var holder = item.parentNode;
	var children = item.parentNode.children;
	var bottom = children[children.length - 1].getBoundingClientRect().bottom - item.parentNode.getBoundingClientRect().top - item.getBoundingClientRect().height;

	var clone_item = item.cloneNode(true);
	clone_item.style.position = 'absolute';
	clone_item.style.opacity = 0.7;

	clone_item.style.backgroundColor = '#fff';
	clone_item.style.top = (item.getBoundingClientRect().top - item.parentNode.getBoundingClientRect().top) + 'px';
	item.parentNode.appendChild(clone_item);
	var drag_touch = new Ozine.DragTouch();
	var has_moved = false;
	drag_touch.onChange = function () {
		has_moved = true;
		if (clone_item.style.display == 'none')
		{
			clone_item.style.display = '';
		}
		item.style.opacity = 0;

		var top = clone_item.offsetTop + holder.getBoundingClientRect().top;
		var bottom = clone_item.offsetTop + clone_item.offsetHeight + holder.getBoundingClientRect().top;
		var children = holder.children;

		for (var iChild = 0; iChild < children.length; iChild++) {
			var child = children[iChild];
			var rect = child.getBoundingClientRect();
			if (child == clone_item) {
				break;
			}
			if (top <= rect.top + rect.height / 2 && top >= rect.top) {
				if (child != item) {
					holder.insertBefore(item, child);
					//console.log('a', iChild, top, rect.top, rect.height)
					return true;
				}
			}
			if (bottom <= rect.top + rect.height && bottom >= rect.top + rect.height / 2) {
				if (child != item) {
					holder.insertBefore(child, item);
					//console.log('b', iChild, top, rect.top, rect.height)
					return true;
				}
			}
		}
	};
	drag_touch.onEnd = function () {
		item.style.opacity = '';
		item.parentNode.removeChild(clone_item);
		has_moved && callback(item);
	};
	drag_touch.startDrag(event, clone_item, { top: 0, bottom: bottom });
	clone_item.style.display = 'none';
}




Ozine.DragTouch = function()
{
	this.startX = 0;
	this.endY = 0;

	var self = this;
	this.__moveFN = function(event){self.moveFN(event);event.preventDefault();};
	this.__endFN = function(event){self.end(event);event.preventDefault();};
}
Ozine.DragTouch.prototype.start = function (event)
{
	this.startX = (event.touches) ? event.touches[0].clientX : event.clientX;
	this.startY = (event.touches) ? event.touches[0].clientY : event.clientY;
	this.moveX = 0;
	this.moveY = 0;
	this.endX = this.startX;
	this.endY = this.startY;
	this.zoom = null;
	//console.log(this.startX, this.startY, event.touches, this.endX, this.endY);
	this.onStart && this.onStart();

	this.HTML_DIV = null;
	event.preventDefault();

	if (event.type == "touchstart")
	{
		Ozine.addEventSimple(document, "touchmove", this.__moveFN);
		Ozine.addEventSimple(document, "touchend", this.__endFN);
	}
	else if (event.type == "mousedown")
	{
		Ozine.addEventSimple(document, "mousemove", this.__moveFN);
		Ozine.addEventSimple(document, "mouseup", this.__endFN);
	}


	return false;
}
Ozine.DragTouch.prototype.startDrag = function (event, htmlID, limits)
{
	// AVOID FIRING AGAIN ON ZOOM
	if (this.isActive)
	{
		return false;
	}
	this.isActive = true;


	this.hasMove = false;
	this.start(event)
	limits = limits || {};

	if (htmlID)
	{
		this.HTML_DIV = (htmlID);

		this.divX_Start = this.HTML_DIV.offsetLeft;
		this.divY_Start = this.HTML_DIV.offsetTop;

		this.position = {x:this.divX_Start, y:this.divY_Start};
	}
	else
	{
		var x = (event.touches) ? event.touches[0].clientX : event.clientX;
		var y = (event.touches) ? event.touches[0].clientY : event.clientY;
		this.position = {x:x, y:y};
	}

	this.leftLimit = (limits.left != limits.undefined) ? limits.left : null;
	this.topLimit = (limits.top != limits.undefined) ? limits.top : null;
	this.rightLimit = (limits.right != limits.undefined) ? limits.right : null;;
	this.bottomLimit = (limits.bottom != limits.undefined) ? limits.bottom : null;;

	this.moveFree = (this.leftLimit == null) && (this.topLimit == null) && (this.rightLimit == null) && (this.bottomLimit == null);
	this.move = {x:0, y:0};

	return true;
}

Ozine.DragTouch.prototype.moveFN = function (event)
{
	// DETECT A MINIMUM MOVE BEOFRE FIRING THE MOVE EVENT
	if (!this.hasMove) {
		var x = (event.touches) ? event.touches[0].clientX : event.clientX;
		var y = (event.touches) ? event.touches[0].clientY : event.clientY;

		if (event.touches) {
			if ((x - this.startX) * (x - this.startX) + (y - this.startY) * (y - this.startY) > 100) {
				this.startX = x;
				this.startY = y;
				this.moveX = 0;
				this.moveY = 0;
				this.endX = this.startX;
				this.endY = this.startY;
				this.hasMove = true;
			}
		} else if ((x != this.startX) || (y != this.startY)) {
			this.hasMove = true;
		}
	}
	if (!this.hasMove) {
		return false;
	}

	this.endX = (event.touches) ? event.touches[0].clientX : event.clientX;
	this.endY = (event.touches) ? event.touches[0].clientY : event.clientY;
	this.moveX = this.endX - this.startX;
	this.moveY = this.endY - this.startY;

	if (this.HTML_DIV) {
		var tmpX = (this.divX_Start + this.moveX);
		var tmpY = (this.divY_Start + this.moveY);

		if (this.moveFree != true) {
			if ((this.rightLimit != null) && (this.leftLimit != null)) {
				tmpX = Math.min(tmpX, this.rightLimit);
				tmpX = Math.max(tmpX, this.leftLimit);

				this.HTML_DIV.style.left = tmpX + 'px';
			}
			if ((this.bottomLimit != null) && (this.topLimit != null)) {
				tmpY = Math.min(tmpY, this.bottomLimit);
				tmpY = Math.max(tmpY, this.topLimit);

				this.HTML_DIV.style.top = tmpY + 'px';
			}
		} else {
			this.HTML_DIV.style.left = tmpX + 'px';
			this.HTML_DIV.style.top = tmpY + 'px';
		}
		this.position = {x:tmpX, y:tmpY};
		this.move = {x:tmpX - this.divX_Start, y:tmpY - this.divY_Start};
	} else {
		this.move = {x:this.moveX, y:this.moveY};
		if ((this.rightLimit != null) && (this.leftLimit != null)) {
			this.move.x = Math.min(this.move.x, this.rightLimit);
			this.move.x = Math.max(this.move.x, this.leftLimit);
		}
		if ((this.bottomLimit != null) && (this.topLimit != null)) {
			this.move.y = Math.min(this.move.y, this.bottomLimit);
			this.move.y = Math.max(this.move.y, this.topLimit);
		}
		this.position = this.move;
	}
	this.onChange && this.onChange({clientX:this.endX, clientY:this.endY, move:this.move, position:this.position});
}

Ozine.DragTouch.prototype.end = function (event)
{
	this.isActive = false;

	if (event.type == "touchend")
	{
		Ozine.removeEventSimple(document, "touchmove", this.__moveFN);
		Ozine.removeEventSimple(document, "touchend", this.__endFN);
	}
	else if (event.type == "mouseup")
	{
		Ozine.removeEventSimple(document, "mousemove", this.__moveFN);
		Ozine.removeEventSimple(document, "mouseup", this.__endFN);
	}

	var clientX = (event.touches) ? ((event.touches.length > 0) ? event.touches[0].clientX : this.endX) : event.clientX;
	var clientY = (event.touches) ? ((event.touches.length > 0) ? event.touches[0].clientY : this.endY) : event.clientY;
	event = {clientX:clientX, clientY:clientY, move:this.move, position:this.positionY};
	this.onEnd && this.onEnd(event);

	document.getElementsByTagName("body")[0].style.userSelect = "";
	document.getElementsByTagName("body")[0].style.webkitUserSelect = "";
	document.getElementsByTagName("body")[0].style.MozUserSelect = "";
	document.getElementsByTagName("body")[0].setAttribute("unselectable", "off");
}
