sis.ajui.windows = sis.ajui.windows || {};

(function (){
sis.ajui.windows.ToolBox = function ToolBox() {
    sis.ajui.windows.Abstract.call(this);
};

sis.ajui.windows.ToolBox.prototype = CloneObject(sis.ajui.windows.Abstract.prototype);

sis.ajui.windows.ToolBox.prototype._prepareRender = function () {
    sis.ajui.windows.Abstract.prototype._prepareRender.call(this);
    
    this._rootNode.parent().addClass('adminjui-window-toolbox');
    console.log('prepareRender', this);

//    this._rootNode.parent().bind('drag', function () {
//        var pos = this.offset();
//        this.parent().css('background-position', pos.left/2.5 + 'px ' + pos.top/2.5 + 'px');
//    }.bind(this._rootNode));
};

})();