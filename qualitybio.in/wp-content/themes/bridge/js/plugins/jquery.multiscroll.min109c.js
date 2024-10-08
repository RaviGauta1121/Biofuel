/**
 * multiscroll.js 0.1.5 Beta
 * https://github.com/alvarotrigo/multiscroll.js
 * MIT licensed
 *
 * Copyright (C) 2013 alvarotrigo.com - A project by Alvaro Trigo
 *
 * ADDED: added destroy plugin's events function
 */
(function($){$.fn.multiscroll=function(options){options=$.extend({'verticalCentered':true,'scrollingSpeed':700,'easing':'easeInQuart','menu':false,'sectionsColor':[],'anchors':[],'navigation':false,'navigationPosition':'right','navigationColor':'#000','navigationTooltips':[],'loopBottom':false,'loopTop':false,'css3':false,'paddingTop':0,'paddingBottom':0,'fixedElements':null,'normalScrollElements':null,'keyboardScrolling':true,'touchSensitivity':5,'sectionSelector':'.ms-section','leftSelector':'.ms-left','rightSelector':'.ms-right','afterLoad':null,'onLeave':null,'afterRender':null,'afterResize':null},options);var scrollDelay=600;var isTouch=(('ontouchstart'in window)||(navigator.msMaxTouchPoints>0));if(options.rightSelector!=='.ms-right'){$(options.rightSelector).addClass('ms-right')}if(options.leftSelector!=='.ms-left'){$(options.leftSelector).addClass('ms-left')}var numberSections=$('.ms-left').find('.ms-section').length;var isMoving=false;var nav;var windowHeight=$(window).height();addMouseWheelHandler();addTouchHandler();if(options.css3){options.css3=support3d()}$('html, body').css({'overflow':'hidden','height':'100%'});if(options.sectionSelector!=='.ms-section'){$(options.sectionSelector).each(function(){$(this).addClass('ms-section')})}if(options.navigation){$('body').append('<div id="multiscroll-nav"><ul></ul></div>');nav=$('#multiscroll-nav');nav.css('color',options.navigationColor);nav.addClass(options.navigationPosition)}$('.ms-right, .ms-left').css({'width':'50%','position':'absolute','height':'100%','-ms-touch-action':'none'});$('.ms-right').css({'right':'1px','top':'0','-ms-touch-action':'none','touch-action':'none'});$('.ms-left').css({'left':'0','top':'0','-ms-touch-action':'none','touch-action':'none'});$('.ms-left .ms-section, .ms-right .ms-section').each(function(){var sectionIndex=$(this).index();if(options.paddingTop||options.paddingBottom){$(this).css('padding',options.paddingTop+' 0 '+options.paddingBottom+' 0')}if(typeof options.sectionsColor[sectionIndex]!=='undefined'){$(this).css('background-color',options.sectionsColor[sectionIndex])}if(typeof options.anchors[sectionIndex]!=='undefined'){$(this).attr('data-anchor',options.anchors[sectionIndex])}if(options.verticalCentered){addTableClass($(this))}if($(this).closest('.ms-left').length&&options.navigation){var link='';if(options.anchors.length){link=options.anchors[sectionIndex]}var tooltip=options.navigationTooltips[sectionIndex];if(typeof tooltip==='undefined'){tooltip=''}if(options.navigation){nav.find('ul').append('<li data-tooltip="'+tooltip+'"><a href="#'+link+'"><span></span></a></li>')}}});$('.ms-right').html($('.ms-right').find('.ms-section').get().reverse());$('.ms-left .ms-section, .ms-right .ms-section').each(function(){var sectionIndex=$(this).index();$(this).css({'height':'100%'});if(!sectionIndex&&options.navigation){nav.find('li').eq(sectionIndex).find('a').addClass('active')}}).promise().done(function(){if(!$('.ms-left .ms-section.active').length){$('.ms-right').find('.ms-section').last().addClass('active');$('.ms-left').find('.ms-section').first().addClass('active')}$.isFunction(options.afterRender)&&options.afterRender.call(this);silentScroll();$(window).on('load',function(){scrollToAnchor()})});$(window).on('hashchange',hashChangeHandler);function hashChangeHandler(){var value=window.location.hash.replace('#','');var sectionAnchor=value;if(sectionAnchor.length){var section=$('.ms-left').find('[data-anchor="'+sectionAnchor+'"]');var isFirstScrollMove=(typeof lastScrolledDestiny==='undefined');if(isFirstScrollMove||sectionAnchor!==lastScrolledDestiny){scrollPage(section)}}};$(document).keydown(function(e){if(e.which==40||e.which==38){e.preventDefault()}if(options.keyboardScrolling&&!isMoving){switch(e.which){case 38:case 33:$.fn.multiscroll.moveSectionUp();break;case 40:case 34:$.fn.multiscroll.moveSectionDown();break;case 36:$.fn.multiscroll.moveTo(1);break;case 35:$.fn.multiscroll.moveTo($('.ms-left .ms-section').length);break;default:return}}});$(document).mousedown(function(e){if(e.button==1){e.preventDefault();return false}});$(document).on('click','#multiscroll-nav a',function(e){e.preventDefault();var index=$(this).parent().index();scrollPage($('.ms-left .ms-section').eq(index))});$(document).on({mouseenter:function(){var tooltip=$(this).data('tooltip');$('<div class="multiscroll-tooltip '+options.navigationPosition+'">'+tooltip+'</div>').hide().appendTo($(this)).fadeIn(200)},mouseleave:function(){$(this).find('.multiscroll-tooltip').fadeOut(200,function(){$(this).remove()})}},'#multiscroll-nav li');if(options.normalScrollElements){$(document).on('mouseenter',options.normalScrollElements,function(){$.fn.multiscroll.setMouseWheelScrolling(false)});$(document).on('mouseleave',options.normalScrollElements,function(){$.fn.multiscroll.setMouseWheelScrolling(true)})}$(window).on('resize',doneResizing);function doneResizing(){windowHeight=$(window).height();$('.ms-tableCell').each(function(){$(this).css({height:getTableHeight($(this).parent())})});silentScroll();$.isFunction(options.afterResize)&&options.afterResize.call(this)}function silentScroll(){if(options.css3){transformContainer($('.ms-left'),'translate3d(0px, -'+$('.ms-left').find('.ms-section.active').position().top+'px, 0px)',false);transformContainer($('.ms-right'),'translate3d(0px, -'+$('.ms-right').find('.ms-section.active').position().top+'px, 0px)',false)}else{$('.ms-left').css('top',-$('.ms-left').find('.ms-section.active').position().top);$('.ms-right').css('top',-$('.ms-right').find('.ms-section.active').position().top)}}$.fn.multiscroll.moveSectionUp=function(){var prev=$('.ms-left .ms-section.active').prev('.ms-section');if(!prev.length&&options.loopTop){prev=$('.ms-left .ms-section').last()}if(prev.length){scrollPage(prev)}};$.fn.multiscroll.moveSectionDown=function(){var next=$('.ms-left .ms-section.active').next('.ms-section');if(!next.length&&options.loopBottom){next=$('.ms-left .ms-section').first()}if(next.length){scrollPage(next)}};$.fn.multiscroll.moveTo=function(section){var destiny='';if(isNaN(section)){destiny=$('.ms-left [data-anchor="'+section+'"]')}else{destiny=$('.ms-left .ms-section').eq((section-1))}scrollPage(destiny)};function scrollPage(leftDestination){var leftDestinationIndex=leftDestination.index();var rightDestination=$('.ms-right').find('.ms-section').eq(numberSections-1-leftDestinationIndex);var rightDestinationIndex=numberSections-1-leftDestinationIndex;var anchorLink=leftDestination.data('anchor');var activeSection=$('.ms-left .ms-section.active');var leavingSection=activeSection.index()+1;var yMovement=getYmovement(leftDestination);isMoving=true;setURLHash(anchorLink);var topPos={'left':leftDestination.position().top,'right':rightDestination.position().top};rightDestination.addClass('active').siblings().removeClass('active');leftDestination.addClass('active').siblings().removeClass('active');if(options.css3){$.isFunction(options.onLeave)&&options.onLeave.call(this,leavingSection,(leftDestinationIndex+1),yMovement);var translate3dLeft='translate3d(0px, -'+topPos['left']+'px, 0px)';var translate3dRight='translate3d(0px, -'+topPos['right']+'px, 0px)';transformContainer($('.ms-left'),translate3dLeft,true);transformContainer($('.ms-right'),translate3dRight,true);setTimeout(function(){$.isFunction(options.afterLoad)&&options.afterLoad.call(this,anchorLink,(leftDestinationIndex+1));setTimeout(function(){isMoving=false},scrollDelay)},options.scrollingSpeed)}else{$.isFunction(options.onLeave)&&options.onLeave.call(this,leavingSection,(leftDestinationIndex+1),yMovement);$('.ms-left').animate({'top':-topPos['left']},options.scrollingSpeed,options.easing,function(){$.isFunction(options.afterLoad)&&options.afterLoad.call(this,anchorLink,(leftDestinationIndex+1));setTimeout(function(){isMoving=false},scrollDelay)});$('.ms-right').animate({'top':-topPos['right']},options.scrollingSpeed,options.easing)}lastScrolledDestiny=anchorLink;activateMenuElement(anchorLink);activateNavDots(anchorLink,leftDestinationIndex)}function removeMouseWheelHandler(){if(document.addEventListener){document.removeEventListener('mousewheel',MouseWheelHandler,false);document.removeEventListener('wheel',MouseWheelHandler,false)}else{document.detachEvent("onmousewheel",MouseWheelHandler)}}function addMouseWheelHandler(){if(document.addEventListener){document.addEventListener("mousewheel",MouseWheelHandler,false);document.addEventListener("wheel",MouseWheelHandler,false)}else{document.attachEvent("onmousewheel",MouseWheelHandler)}}function MouseWheelHandler(e){e=window.event||e;var delta=Math.max(-1,Math.min(1,(e.wheelDelta||-e.deltaY||-e.detail)));if(!isMoving){if(delta<0){$.fn.multiscroll.moveSectionDown()}else{$.fn.multiscroll.moveSectionUp()}}return false}function transformContainer(container,translate3d,animated){container.toggleClass('ms-easing',animated);container.css(getTransforms(translate3d))}function getTransforms(translate3d){return{'-webkit-transform':translate3d,'-moz-transform':translate3d,'-ms-transform':translate3d,'transform':translate3d}}function activateNavDots(name,sectionIndex){if(options.navigation){$('#multiscroll-nav').find('.active').removeClass('active');if(name){$('#multiscroll-nav').find('a[href="#'+name+'"]').addClass('active')}else{$('#multiscroll-nav').find('li').eq(sectionIndex).find('a').addClass('active')}}}function activateMenuElement(name){if(options.menu){$(options.menu).find('.active').removeClass('active');$(options.menu).find('[data-menuanchor="'+name+'"]').addClass('active')}}function getYmovement(destiny){var fromIndex=$('.ms-left .ms-section.active').index();var toIndex=destiny.index();if(fromIndex>toIndex){return'up'}return'down'}function setURLHash(anchorLink){if(options.anchors.length){location.hash=anchorLink}}function support3d(){var el=document.createElement('p'),has3d,transforms={'webkitTransform':'-webkit-transform','OTransform':'-o-transform','msTransform':'-ms-transform','MozTransform':'-moz-transform','transform':'transform'};document.body.insertBefore(el,null);for(var t in transforms){if(el.style[t]!==undefined){el.style[t]="translate3d(1px,1px,1px)";has3d=window.getComputedStyle(el).getPropertyValue(transforms[t])}}document.body.removeChild(el);return(has3d!==undefined&&has3d.length>0&&has3d!=="none")}function addTableClass(element){element.addClass('ms-table').wrapInner('<div class="ms-tableCell" style="height: '+getTableHeight(element)+'px" />')}function getTableHeight(section){var sectionHeight=windowHeight;if(options.paddingTop||options.paddingBottom){var paddings=parseInt(section.css('padding-top'))+parseInt(section.css('padding-bottom'));sectionHeight=(windowHeight-paddings)}return sectionHeight}function scrollToAnchor(){var sectionAnchor=window.location.hash.replace('#','');var section=$('.ms-left .ms-section[data-anchor="'+sectionAnchor+'"]');if(sectionAnchor.length){scrollPage(section)}}$.fn.multiscroll.setKeyboardScrolling=function(value){options.keyboardScrolling=value};$.fn.multiscroll.setMouseWheelScrolling=function(value){if(value){addMouseWheelHandler()}else{removeMouseWheelHandler()}};$.fn.multiscroll.setScrollingSpeed=function(value){options.scrollingSpeed=value};var touchStartY=0;var touchStartX=0;var touchEndY=0;var touchEndX=0;function touchMoveHandler(event){var e=event.originalEvent;event.preventDefault();var activeSection=$('.ms-left .ms-section.active');if(!isMoving){var touchEvents=getEventsPage(e);touchEndY=touchEvents['y'];touchEndX=touchEvents['x'];if(Math.abs(touchStartY-touchEndY)>($(window).height()/100*options.touchSensitivity)){if(touchStartY>touchEndY){$.fn.multiscroll.moveSectionDown()}else if(touchEndY>touchStartY){$.fn.multiscroll.moveSectionUp()}}}}function touchStartHandler(event){var e=event.originalEvent;var touchEvents=getEventsPage(e);touchStartY=touchEvents['y'];touchStartX=touchEvents['x']}function addTouchHandler(){if(isTouch){MSPointer=getMSPointer();$(document).off('touchstart '+MSPointer.down).on('touchstart '+MSPointer.down,touchStartHandler);$(document).off('touchmove '+MSPointer.move).on('touchmove '+MSPointer.move,touchMoveHandler)}}function removeTouchHandler(){if(isTouch){MSPointer=getMSPointer();$(document).off('touchstart '+MSPointer.down);$(document).off('touchmove '+MSPointer.move)}}function getMSPointer(){var pointer;if(window.PointerEvent){pointer={down:"pointerdown",move:"pointermove"}}else{pointer={down:"MSPointerDown",move:"MSPointerMove"}}return pointer}function getEventsPage(e){var events=new Array();if(window.navigator.msPointerEnabled){events['y']=e.pageY;events['x']=e.pageX}else{events['y']=e.touches[0].pageY;events['x']=e.touches[0].pageX}return events}$.fn.multiscroll.destroy=function(){$.fn.multiscroll.setKeyboardScrolling(false);$.fn.multiscroll.setMouseWheelScrolling(false);$(window).off('hashchange',hashChangeHandler).off('resize',doneResizing);$(document).off('touchstart').off('touchmove')};$.fn.multiscroll.build=function(){$.fn.multiscroll.setKeyboardScrolling(true);$.fn.multiscroll.setMouseWheelScrolling(true);$(window).on('hashchange',hashChangeHandler).on('resize',doneResizing);$(document).on('touchstart',touchStartHandler).on('touchmove',touchMoveHandler)}}})(jQuery);