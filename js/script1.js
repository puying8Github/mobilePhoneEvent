/**
 * Created by ThinkPad User on 2016/5/24.
 */
//链式的第二种写法
(function(){
    var eventClass={
        //手机端部分事件;
        tap:function(elem,callback){
            var startTx, startTy;

            elem.addEventListener( 'touchstart', function( e ){
                var touches = e.touches[0];

                startTx = touches.clientX;
                startTy = touches.clientY;
            }, false );

            elem.addEventListener( 'touchend', function( e ){
                var touches = e.changedTouches[0],
                    endTx = touches.clientX,
                    endTy = touches.clientY;

                // 在部分设备上 touch 事件比较灵敏，导致按下和松开手指时的事件坐标会出现一点点变化
                if( Math.abs(startTx - endTx) < 6 && Math.abs(startTy - endTy) < 6 ){
                   callback();
                }
            }, false );
        },
        doubletap:function(elem,callback){//手机端双击
            var isTouchEnd = false,
                lastTime = 0,
                lastTx = null,
                lastTy = null,
                firstTouchEnd = true,
                body = document.body,
                dTapTimer, startTx, startTy, startTime;

            elem.addEventListener( 'touchstart', function( e ){
                if( dTapTimer ){
                    clearTimeout( dTapTimer );
                    dTapTimer = null;
                }

                var touches = e.touches[0];

                startTx = touches.clientX;
                startTy = touches.clientY;
            }, false );

            elem.addEventListener( 'touchend', function( e ){
                var touches = e.changedTouches[0],
                    endTx = touches.clientX,
                    endTy = touches.clientY,
                    now = Date.now(),
                    duration = now - lastTime;

                // 首先要确保能触发单次的 tap 事件
                if( Math.abs(startTx - endTx) < 6 && Math.abs(startTx - endTx) < 6 ){
                    // 两次 tap 的间隔确保在 500 毫秒以内
                    if( duration < 301 ){
                        // 本次的 tap 位置和上一次的 tap 的位置允许一定范围内的误差
                        if( lastTx !== null &&
                            Math.abs(lastTx - endTx) < 45 &&
                            Math.abs(lastTy - endTy) < 45 ){

                            firstTouchEnd = true;
                            lastTx = lastTy = null;
                            //console.log( 'fire double tap event' );
                            callback();
                        }
                    }
                    else{
                        lastTx = endTx;
                        lastTy = endTy;
                    }
                }
                else{
                    firstTouchEnd = true;
                    lastTx = lastTy = null;
                }

                lastTime = now;
            }, false );

// 在 iOS 的 safari 上手指敲击屏幕的速度过快，
// 有一定的几率会导致第二次不会响应 touchstart 和 touchend 事件
// 同时手指长时间的touch不会触发click

            if( ~navigator.userAgent.toLowerCase().indexOf('iphone os') ){

                body.addEventListener( 'touchstart', function( e ){
                    startTime = Date.now();
                }, true );

                body.addEventListener( 'touchend', function( e ){
                    var noLongTap = Date.now() - startTime < 501;

                    if( firstTouchEnd ){
                        firstTouchEnd = false;
                        if( noLongTap && e.target === element ){
                            dTapTimer = setTimeout(function(){
                                firstTouchEnd = true;
                                lastTx = lastTy = null;
                                //console.log( 'fire double tap event' );
                                callback();
                            }, 400 );
                        }
                    }
                    else{
                        firstTouchEnd = true;
                    }
                }, true );

// iOS 上手指多次敲击屏幕时的速度过快不会触发 click 事件
                elem.addEventListener( 'click', function( e ){
                    if( dTapTimer ){
                        clearTimeout( dTapTimer );
                        dTapTimer = null;
                        firstTouchEnd = true;
                    }
                }, false );

            }
        },
        longtap:function(elem,callback){
            var startTx, startTy, lTapTimer;

            elem.addEventListener( 'touchstart', function( e ){
                if( lTapTimer ){
                    clearTimeout( lTapTimer );
                    lTapTimer = null;
                }

                var touches = e.touches[0];

                startTx = touches.clientX;
                startTy = touches.clientY;

                lTapTimer = setTimeout(function(){
                    //console.log( 'fire long tap event' );
                    callback();
                }, 1000 );

                e.preventDefault();
            }, false );

            elem.addEventListener( 'touchmove', function( e ){
                var touches = e.touches[0],
                    endTx = touches.clientX,
                    endTy = touches.clientY;

                if( lTapTimer && (Math.abs(endTx - startTx) > 5 || Math.abs(endTy - startTy) > 5) ){
                    clearTimeout( lTapTimer );
                    lTapTimer = null;
                }
            }, false );

            elem.addEventListener( 'touchend', function( e ){
                if( lTapTimer ){
                    clearTimeout( lTapTimer );
                    lTapTimer = null;
                }
            }, false );
        },
        swipeFun:function(elem,direction,callback){
            var isTouchMove, startTx, startTy;

            elem.addEventListener( 'touchstart', function( e ){
                var touches = e.touches[0];

                startTx = touches.clientX;
                startTy = touches.clientY;
                isTouchMove = false;
            }, false );

            elem.addEventListener( 'touchmove', function( e ){
                isTouchMove = true;
                e.preventDefault();
            }, false );

            elem.addEventListener( 'touchend', function( e ){
                if( !isTouchMove ){
                    return;
                }

                var touches = e.changedTouches[0],
                    endTx = touches.clientX,
                    endTy = touches.clientY,
                    distanceX = startTx - endTx,
                    distanceY = startTy - endTy,
                    isSwipe = false;
                if( Math.abs(distanceX) >= Math.abs(distanceY) ){
                    if( distanceX > 20 && direction=='Left'){
                        //console.log( 'fire swipe left event' );
                       callback();
                        isSwipe = true;
                    }
                    else if( distanceX < -20 && direction=='Right'){
                        //console.log( 'fire swipe right event' );
                        callback();
                        isSwipe = true;
                    }
                }
                else{
                    if( distanceY > 20 && direction=='Up'){
                        //console.log( 'fire swipe up event' );
                        callback();
                        isSwipe = true;
                    }
                    else if( distanceY < -20  && direction=='Down'){
                        //console.log( 'fire swipe down event' );
                        callback();
                        isSwipe = true;
                    }
                }
                if( isSwipe && direction=='all'){
                    //console.log( 'fire swipe event' );
                    callback();
                }

            }, false );
        },
        swipe:function(elem,callback){
            this.swipeFun(elem,'all',callback);
        },
        swipeLeft:function(elem,callback){
            this.swipeFun(elem,'Left',callback);
        },
        swipeRight:function(elem,callback){
            this.swipeFun(elem,'Right',callback);
        },
        swipeUp:function(elem,callback){
            this.swipeFun(elem,'Up',callback);
        },
        swipeDown:function(elem,callback){
            this.swipeFun(elem,'Down',callback)
        }

    };

    function _$(els){
        this.elements = [];//把那些元素作为数组保存在一个实例属性中，
        for(var i= 0, len=els.length; i<len; i++){
            var element = els[i];
            if(typeof element==='string'){
                element = document.getElementById(element);
            }
            this.elements.push(element);
        }
    }

    _$.prototype = {
        each: function(fn){
            for(var i= 0,len=this.elements.length; i<len; i++){
                fn.call(this, this.elements[i]);
                return this; //在每个方法的最后return this;
            }
        },
        setStyle: function(prop, val){
            this.each(function(el){
                el.style[prop] = val;
            });
            return this; //在每个方法的最后return this;
        },
        show: function(){
            var that = this;
            this.each(function(el){
                that.setStyle('display', 'block');
            });
            return this; //在每个方法的最后return this;
        },
        on: function(type, fn){
            var add = function(el){
                if(type==='tap'){
                    eventClass.tap(el,fn);
                }else if(type==='doubletap'){
                    el.style.userSelect='none';
                    eventClass.doubletap(el,fn);
                }else if(type==='longtap'){
                    eventClass.longtap(el,fn);
                }else if(type==="swipe"){
                    eventClass.swipe(el,fn);
                }else if(type==="swipeLeft"){
                    eventClass.swipeLeft(el,fn);
                }else if(type==="swipeRight"){
                    eventClass.swipeRight(el,fn);
                }else if(type==="swipeUp"){
                    eventClass.swipe(el,fn);
                }else if(type==="swipeDown"){
                    eventClass.swipe(el,fn);
                }
                else{
                    if(window.addEventListener){
                        el.addEventListener(type, fn, false);
                    }else if(window.attachEvent){
                        el.addEvent('on'+type, fn);
                    }
                }

            };
            this.each(function(el){
                add(el);
            });
            return this; //在每个方法的最后return this;
        }
    };
    window.py = function(){
        return new _$(arguments);
    }
})();