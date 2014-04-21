(function helloMyLovelyJS(global){
'use strict';
var contentTypes = {
	cssType: 'cssType',
	jsType: 'jsType'
},
Content = function Content(type){
	var me = this;
	me.type = (type in contentTypes) ? type : undefined;
	me.loaded=false;
	me.callback=null;
},
abstractConstructorContent = function abstractConstructorContent(cfg){
	var me = this;
	me.constructor = cfg.constructor;
	me.url = cfg.url;
},
JsContent = function JsContent(url){
	abstractConstructorContent.call(this,{
	url: url,
	constructor: JsContent});
},
CssContent = function CssContent(url){
	abstractConstructorContent.call(this,{
	url: url,
	constructor: CssContent});
},
Pushkarev = {
	timeConstants : {
		RENDER_CONTENT_TIME: 30,
		PSEUDO_LOAD: 1500,
		VISIBLE_DELAY: 100,
		FADE_DELAY: 777,
		CHANCE_LOAD_CONTENT: 50
	},
	animateDelay: {
		calculateTransition: function calculateTransition(target){	
			return 500*target/3500;
		},
		CRITICAL_SCROLL_VALUE: 333
	},
	noCache: (new Date()).getTime(),
	requiredContent: {
			scripts :{},
			styles: {},
			images: {}
	},
	supports:
	{
		isHTML5Supported: function isHTML5Supported(){		
			var testEl;				
			typeof isHTML5Supported.value !== 'undefined' ? (function _cachedVal(){
				console.log('isHTML5Supported: Supported value cached!!!');
			})() : (function _rememberVal(){			
				try
				{
					testEl = global.document.createElement('canvas');
					typeof testEl.getContext !== 'undefined' ? isHTML5Supported.value = true : isHTML5Supported.value = false;
				}
				catch(e)
				{	
					console.error('Something wrong in isHTML5Supported... Error name: '+e.name+' ; Error message: '+e.message);
					isHTML5Supported.value = false;
				};				
			})();	
			return isHTML5Supported.value;
		},
		isCSS3Supported: function isCSS3Supported(){
			var _style;
			if(typeof isCSS3Supported.value !== 'undefined')
			{
				return isCSS3Supported.value;
			}			
			
			_style = document.createElement('p').style,
			isCSS3Supported.value = 'transition' in _style ||
									'WebkitTransition' in _style ||
									'MozTransition' in _style ||
									'msTransition' in _style ||
									'OTransition' in _style;
				
					
			return isCSS3Supported.value;
		},
		isPreserve3DSupported: function()
		{
			 var element = document.createElement('link'),
				body = document.getElementsByTagName('head')[0],
				st,
				transform,
				properties = {
					'webkitTransformStyle':'-webkit-transform-style',
					'MozTransformStyle':'-moz-transform-style',
					'msTransformStyle':'-ms-transform-style',
					'transformStyle':'transform-style'
				};

				body.insertBefore(element, null);
				for (var i in properties) {
					if (element.style[i] !== undefined) {
						element.style[i] = "preserve-3d";
					}
				};

       st = window.getComputedStyle(element, null);
        transform = st.getPropertyValue("-webkit-transform-style") ||
           st.getPropertyValue("-moz-transform-style") ||
           st.getPropertyValue("-ms-transform-style") ||
           st.getPropertyValue("transform-style");

       if(transform!=='preserve-3d'){   
          element.parentNode.removeChild(element);
          return false;
       } 
       element.parentNode.removeChild(element);
        return true;
		}
	},
	detects:
	{
		isIE: function isIE(){
			return /*@cc_on!@*/0;
		}
	}
},
fastAccessContent = Pushkarev.requiredContent,
fastAccessScripts = fastAccessContent.scripts,
fastAccessStyles = fastAccessContent.styles,
fastAccessImages = fastAccessContent.images,
fastAccessTimeConstants = Pushkarev.timeConstants,
fastAccessSupports = Pushkarev.supports,
fastAccessAnimateDelay = Pushkarev.animateDelay,
lazyload = LazyLoad,
createPage = function createPage(){
	var jq = $,
	pushkarev = Pushkarev,
	allContent = jq('#all-content'),
	nav = jq('nav ul'),
	scrollTop = jq('#scroll-top'),
	mainThing = jq('#main-thing'),
	closeMainThing = jq('#pseudo-light-layer>#closeBtn'),
	androidControls = jq('#android > .slider-panel > .controls > .moving-controls'),
	ipadControls = jq('#ipad > .slider-panel > .controls > .moving-controls'),
	animateInterval,
	initScrollPosition = jq(global.document).scrollTop(),
	rootContent = jq('html,body');

	function drawCnv(){
	
	var canvas = global.document.getElementById("canvas"),
	context = canvas.getContext("2d"),
	w=100,
	h=100,
	startX=20,
	deltaY = 10,
	endX = canvas.width-20,
	k = startX+30,
	d = Math.min(w, h),
	startY = k + d / 4-30,
	deltaX=2;
	
	canvas.x = 30;
	canvas.y = 30;

//initContext
	context.clearRect(0,0,canvas.width,canvas.height);
//drawVertical
	context.beginPath();
	context.moveTo(startX+deltaX, startY);
	context.lineTo(startX-deltaX, startY+h);


//drawVerticalEnd
	context.moveTo(endX+deltaX, startY);
	context.lineTo(endX-deltaX, startY+h-deltaY);



//drawHighHorizontal
	context.moveTo(startX-4*deltaX, startY);
	context.lineTo(startX+5*deltaX, startY);


//draw horizontal
	context.moveTo(startX-5*deltaX, startY+h);
	context.lineTo(startX+4*deltaX, startY+h);



//draw heart
	context.moveTo(k, k + d / 4);
	context.quadraticCurveTo(k, k, k + d / 4, k);
	context.quadraticCurveTo(k + d / 2, k, k + d / 2, k + d / 4);
	context.quadraticCurveTo(k + d / 2, k, k + d * 3/4, k);
	context.quadraticCurveTo(k + d, k, k + d, k + d / 4);
	context.quadraticCurveTo(k + d, k + d / 2, k + d * 3/4, k + d * 3/4);
	context.lineTo(k + d / 2, k + d);
	context.lineTo(k + d / 4, k + d * 3/4);
	context.quadraticCurveTo(k, k + d / 2, k, k + d / 4);


context.fillStyle="#ff4040";
context.fill();
context.stroke();
context.closePath();

//draw circle
      context.beginPath();
      context.arc(endX-deltaX, startY+h, 2, 0, 2 * Math.PI, false);
      context.stroke();
	  context.closePath();

	
//draw heart arc
	context.beginPath();
      context.arc( k + d / 2, k + d / 4, 30, -1.2*Math.PI,  -0.9*Math.PI, false);
	   context.stroke();
	  context.closePath();

	
	//draw low arrow
	context.beginPath();
      context.moveTo( k + d / 4-5, k + d * 3/4+5);
	  context.lineTo( k + d / 4-20, k + d * 3/4+20);
	   context.stroke();
	  context.closePath();
	 
	 
	 //draw high arrow
	context.beginPath();
      context.moveTo( k + d / 4+30, k + d * 3/4-30);
	  context.lineTo( k + d / 4+85, k + d * 3/4-85);
	   context.stroke();
	  context.closePath();
	 
	  //draw last arrow part
	context.beginPath();
      context.moveTo(k + d / 4+85, k + d * 3/4-75);
	  context.lineTo( k + d / 4+85, k + d * 3/4-95);
	  context.moveTo(k + d / 4+75, k + d * 3/4-85);
	  context.lineTo( k + d / 4+95, k + d * 3/4-85);
	  context.moveTo(k + d / 4+75, k + d * 3/4-75);
	  context.lineTo( k + d / 4+95, k + d * 3/4-95);
	   context.stroke();
	  context.closePath();
	 
	 //draw triangle
		context.beginPath();
      context.moveTo( k + d / 4-20, k + d * 3/4+20);
	  context.lineTo( k + d / 4-22, k + d * 3/4+5);
	  context.lineTo( k + d / 4-10, k + d * 3/4+20);
	  context.lineTo( k + d / 4-20, k + d * 3/4+20);
	  context.fillStyle="#fff";
	   context.fill();
	  context.closePath();
	
};
	
	
	function sliderControls(evt){
		var targetEl = evt.target,
			sliderEnum = sliderControls.cahcedSliderEnum = typeof sliderControls.cahcedSliderEnum === 'undefined' ? {
				android: 'android',
				ipad: 'ipad'
			} : sliderControls.cahcedSliderEnum,
			targetElDirection =  jq(targetEl).data('direction'),
			lastVal = sliderControls.cahcedLastVal = typeof sliderControls.cahcedLastVal === 'undefined' ? {
				android: 0,
				ipad: 0
			} : sliderControls.cahcedLastVal,
			pentagon = sliderControls.cahedPentagon = typeof sliderControls.cahedPentagon === 'undefined' ? { 
				android: jq('#android > .slider-panel > .viewport > .spinner > .pentagon'),
				ipad: jq('#ipad > .slider-panel > .viewport > .spinner > .pentagon')
			}: sliderControls.cahedPentagon,
			slider=jq(targetEl).data('slider');
		
		evt.preventDefault();
		
		if(!(slider in sliderEnum))
		{
			return;
		}
		
		switch(targetElDirection)
		{
			case 'front':
				sliderControls.cahcedLastVal[slider] = lastVal[slider] = lastVal[slider]+72;
				break;
			case 'back':
				sliderControls.cahcedLastVal[slider] = lastVal[slider] = lastVal[slider]-72;
				break;
			default:
				return;
		}
		
		pentagon[slider].css('-webkit-transform','rotateY('+lastVal[slider]+'deg)');
		pentagon[slider].css('transform','rotateY('+lastVal[slider]+'deg)');
		pentagon[slider].css('-moz-transform','rotateY('+lastVal[slider]+'deg)');
		pentagon[slider].css('-ms-transform','rotateY('+lastVal[slider]+'deg)');
		pentagon[slider].css('-o-transform','rotateY('+lastVal[slider]+'deg)');
		
	};
	
	console.log('all content is loaded... I\'m ready to begin...');

	(function _showContent(content){
		var delay = pushkarev.timeConstants.PSEUDO_LOAD;
		setTimeout( function makeVisible(){
			var darkLayer, loader;
			if(!pushkarev['background'])
			{
				pushkarev['background'] = {};
			};
			darkLayer = pushkarev['background']['darkLayer'] = jq('#dark-layer');
			loader = pushkarev['background']['loader'] = jq('#facebookG');
			loader.hide();
			darkLayer.hide();
			jq(global.document).ready(function(){
					content.addClass('visible-content');
			});
		},delay);
	}).call(pushkarev,allContent);

	androidControls.bind('click', sliderControls);
	ipadControls.bind('click', sliderControls);
	
	nav.bind('click',function navMenuOpen(evt){
			var	me = this,
				rootDoc = navMenuOpen.cachedRootDoc = !navMenuOpen.cachedRootDoc ? jq('html,body') : navMenuOpen.cachedRootDoc,
				targetElHref =  jq(evt.target).attr('href'),
				target;
			
			if(!targetElHref)
			{
				return;
			}
			evt.preventDefault();
			target = jq(targetElHref).offset().top;
			
			rootDoc.animate({
				scrollTop: target
			}, 0);
	});
	
	
	scrollTop.bind('click', function scrollTop(evt){
				var rootDoc = scrollTop.cachedRootDoc = !scrollTop.cachedRootDoc ? rootContent : scrollTop.cachedRootDoc;
				evt.preventDefault();
				rootDoc.animate({
					scrollTop: 0
				}, 0);
			
	});

	
	closeMainThing.bind('click', function closeMain(){
		var lightLayer=closeMain.cachedLightLayer = !closeMain.cachedLightLayer ? jq('#light-layer') : closeMain.cachedLightLayer,
		pseudoLightLayer = closeMain.cachedPseudoLightLayer = !closeMain.cachedPseudoLightLayer ? jq('#pseudo-light-layer') : closeMain.cachedPseudoLightLayer,
		lightContent = closeMain.cachedLightContent = !closeMain.cachedLightContent ? jq('#light-content') : closeMain.cachedLightContent;
		closeMainThing.hide();
		lightContent.removeClass('content-show');
		global.clearTimeout(animateInterval);
		setTimeout(function showMessage(){
			pseudoLightLayer.removeClass('show-layer');
			lightLayer.fadeOut(100);
		},300);
	});
	
	(function initCanvas(){
	var context = global.document.getElementById('canvas').getContext('2d');
		context.strokeStyle = "#fff";
		context.strokeWeight = 2;
		context.shadowOffsetX = 4.0;
		context.shadowOffsetY = 4.0;
		context.lineWidth = 2;
	}).profilingCall();
	
	
	mainThing.bind('click',function openMain(evt){
		var lightLayer = openMain.cachedLightLayer = !openMain.cachedLightLayer ? jq('#light-layer') : openMain.cachedLightLayer,
		pseudoLightLayer = openMain.cachedPseudoLightLayer = !openMain.cachedPseudoLightLayer ? jq('#pseudo-light-layer') : openMain.cachedPseudoLightLayer,
		lightContent = openMain.cachedLightContent = !openMain.cachedLightContent ? jq('#light-content') : openMain.cachedLightContent,
		snd = openMain.cachedSnd = !openMain.cachedSnd ? global.document.getElementById('message-sound') : openMain.cachedSnd;
		
		evt.preventDefault();
		
		lightLayer.fadeIn(100);
		
		setTimeout(function showMessage(){
			closeMainThing.show();
			pseudoLightLayer.addClass('show-layer');
			setTimeout(function(){
				lightContent.addClass('content-show');	
				animateInterval = setTimeout(function openCloseCat(){	
					var movingCat = openCloseCat.cachedCat = !openCloseCat.cachedCat ? jq('#subscription #moving') : openCloseCat.cachedCat;
					movingCat.hasClass('rotated') ? movingCat.removeClass('rotated') : movingCat.addClass('rotated');			
					animateInterval = setTimeout(openCloseCat,1500);
				},1500);
			},200); 
			drawCnv.profilingCall();
			
		},300);
	});
	
	
	function checkScrollPosition(){

		if( typeof checkScrollPosition.backToTopBtn === 'undefined')
		{
			checkScrollPosition.backToTopBtn = jq('#scroll-top');
		};
		
		if(typeof checkScrollPosition.criticalVal === 'undefined')
		{
			checkScrollPosition.criticalVal=fastAccessAnimateDelay['CRITICAL_SCROLL_VALUE'];
		}
		
		if(typeof checkScrollPosition.fadeDelay === 'undefined')
		{
			checkScrollPosition.fadeDelay=fastAccessTimeConstants['FADE_DELAY'];
		}
		
		if (jq(global.document).scrollTop()>checkScrollPosition.criticalVal)
		{
			checkScrollPosition.backToTopBtn.fadeIn(checkScrollPosition.fadeDelay);
		}
		else
		{
			checkScrollPosition.backToTopBtn.fadeOut(checkScrollPosition.fadeDelay);
		}
	};
	
	jq(global).bind('scroll',checkScrollPosition);
	checkScrollPosition();
	
		global.scrollReveal = new scrollReveal({
            after: '0s',
            enter: 'top',
            move: '0px',
            over: '0.5s',
            easing: 'ease-in',
            viewportFactor: 0.33,
            reset: true,
            init: true
          });
	
	
	rootContent.animate({
		scrollTop: ++initScrollPosition
	},0);
	
	global.Pushkarev = pushkarev;
};

if(!fastAccessSupports.isHTML5Supported() || 
	!fastAccessSupports.isCSS3Supported() || 
	!fastAccessSupports.isPreserve3DSupported())
{
	alert('Веб-страница не будет отображена в данном браузере ввиду отстутвия поддержки ряда необходимого пользовательского функционала (((');
	return;
}

if(!!Pushkarev.detects.isIE())
{
	if(!confirm('Работа веб-страницы в данном браузере может быть неоптимальной. Продолжить?'))
	{
		return;
	}
}

global.document.getElementById('facebookG').style.display = 'block';

JsContent.prototype = new Content(contentTypes.jsType); //the simpliest inheritance
CssContent.prototype = new Content(contentTypes.cssType);
Function.prototype.profilingCall = function profilingCall(){
var startTime = (new Date()).getTime(),
args = Array.prototype.slice.call(arguments),
context = args[0],
args = Array.prototype.slice.call(arguments,1),
consoleInfo = function consoleInfo(fname){
		var endTime = (new Date()).getTime(),
		longness = endTime-startTime;		
		!fname ? fname = 'anonymous' : {};
		longness >= fastAccessTimeConstants.VISIBLE_DELAY ? console.warn('Function "'+fname+'" was being performed during '+longness+' ms. Maybe it\'s too long!') : console.info('Function "'+fname+'" was being performed during '+longness+' ms. I think it\'s quite normal');
},
result;
context = context || global;
if((typeof args==='undefined') || (args.length===0))
{
	result = this.call(context);
	consoleInfo(this.name);
	return result;
};

result = this.apply(context, args);
consoleInfo(this.name);
return result;

}

fastAccessScripts['jquery'] = new JsContent('js/jquery-1.10.2.min.js');
fastAccessScripts['scrollReveal'] = new JsContent('js/scrollReveal.js');


(function decorateLazyLoading(functions){
	for(var i=0,length = functions.length; i<length; i++){
		(function refactorFunc(item){
			var source = lazyload[item];
			lazyload[item] = function (content, callback, obj, context) {

				for (var prop in content)
				{
					if(!content.hasOwnProperty(prop))
					{
						continue;
					};
					
					(function _loadItem(req){
					
						source(req.url, function customCallback(){
							if(req['callback'])
							{
								req['callback']();
							}
							req.loaded = true;
						}, obj, context);
					
					})(content[prop]);
				}
			}
		})(functions[i]);
	}
})(['js', 'css']);


lazyload.js.apply(Pushkarev,[fastAccessScripts,,,Pushkarev]);
lazyload.css.apply(Pushkarev,[fastAccessStyles,,,Pushkarev]);

(function createPageWhenEverithingLoaded(){

	if(fastAccessScripts['jquery'].loaded && 
		fastAccessScripts['scrollReveal'].loaded)
	{
		createPage();
	}
	else
	{	
		setTimeout(createPageWhenEverithingLoaded,fastAccessTimeConstants.CHANCE_LOAD_CONTENT);
	}

})();

})(window);