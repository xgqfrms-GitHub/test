

	function get_intro_condition() {
		// mmcguire
		// reads intro-choice and adds 'no_intro' class to body, to hide intro and show colorwheel
		var body = $('body');
		if (localStorage) {
			var condition = localStorage.getItem("introCondition");
			body.addClass(condition);
		}
	}

	function set_intro_condition() {
		// mmcguire
		// saves setting in local storage
		if (localStorage) {
			localStorage.setItem("introCondition", "no_intro");
		}
	}

	// var nID;
	function scroll_intro() {
		// console.log('click');
		// mmcguire
		// uses css to close intro, show scrollwheel, and activate scrolling animations
		var intro 		= $('.section.intro');
		var colorwheel	= $('.section.colorwheel');

		intro.addClass('scroll');
		colorwheel.addClass('show');
		setTimeout(function() {
			new WOW().init();
		},1000);

		// nID = setInterval(autoScroll,2000);
	}
	// function autoScroll(){
	// 	$("body").animate({ scrollTop: $(window).scrollTop() + 150 }, "slow");
	// 	if ($(window).scrollTop()+$(window).height() >= $(document).height())
	// 		clearInterval(nID);
	// }
	// function close_popup() {
	// 	var popup = $(this).closest('.popup');
	// 	if (popup.hasClass('mailing_list_popup')) {
	// 		setTimeout(function() {
	// 			popup.removeClass('show');
	// 		},500);
	// 	} else {
	// 		popup.removeClass('show');
	// 	}
	// }

	function process_email() {
		var button 		= $(this);
		var popup 		= button.closest('.popup');
		var popupContent= popup.find('.popup_content');
		var form		= popup.find('.form');
		var url			= form.attr('action');

		console.log(url);
		$.ajax({
			url: url,
			type:'POST',
			data:form.serialize
		}).done(function(){

		}).fail(function() {

		});
		return false;
	}



	$(document).ready(function() {
		// mmcguire
		var numColors = 2;
		var body = $('body');
		body.addClass('show');	// the browser needs a moment to process the page before showing body, otherwise intro flashes

		get_intro_condition();



		
		$(function() {
			setTimeout(function() {
				// var popup = $('.mailing_list_popup');
				// popup.addClass('show');
				$(".form-overlay").removeClass("form-hide");
				$(".form-overlay").addClass("form-show");
			},4000000); // originally 40000 , after 40 seconds, show mailing list popup
		});
		$(".form-overlay").on("click",function(e){
			if (e.target === this)
			{
				$(".form-overlay").removeClass("form-show");
				$(".form-overlay").addClass("form-hide");
			}
		});
		$(".form_close_button").on("click",function(){
			$(".form-overlay").removeClass("form-show");
			$(".form-overlay").addClass("form-hide");
		})

		// after four seconds, closes intro
		// $(function() {
		// 	setTimeout(function() {
		// 		if (body.hasClass('no_intro') || $('.section.intro').hasClass('scroll')) {
		// 		//console.log('no-scroll');
		// 		} else {
		// 			scroll_intro();
		// 			//console.log('scroll');
		// 		}
		// 	},4000);
		// });




		// end mmcguire


		var s = Snap("#svg_layout");
		var r = Snap.select('#rotate');
		var vSlider = null;
		var drag = false;
		var new_angle = 0;
		var mAngle = 0;
		var cx_cy = 218;
		var hexColor = {
			'c10': ["#EE4035", "#EE7C2E", "#F3A530", "#FAD132", "#F9ED3A", "#88C542", "#56B949", "#4DB4D7", "#377BBF", "#314A9D", "#844D9E", "#EC4A94"], // start at top, red color, range from '1' to '20'
		}
		var Shade = [0, -0.5, -0.45, -0.4, -0.35, -0.3, -0.25, -0.2, -0.15, -0.1, 0, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55]; // 0 = no shade, -1 = black, 1 = white
		var myStep = 0;


		// sets 'hover' effect class to manage other links when 'this' link is hovered-on
		function handle_color_selector_hover() {
			var selector	= $(this);
			var selectors 	= selector.closest('.color_selectors');
			selector.removeClass('fadeout');
			selectors.find('.color_selector').not(selector).addClass('fadeout');
		}
		function handle_color_selector_unhover() {
			var selector	= $(this);
			var selectors 	= selector.closest('.color_selectors');
			selectors.find('.color_selector').removeClass('fadeout');
		}


		function handle_color_selector() {
			var col_1		= $(this).attr('data-col1');
			var col_2		= $(this).attr('data-col2');
			var col_3		= $(this).attr('data-col3');
			var col_4		= $(this).attr('data-col4');
			var colorauthor	= $(this).find('.author').html();

			color_page_elements(col_1,col_2,col_3,col_4,colorauthor);
			return false;
		}


		var smallCicle = s.circle(cx_cy, cx_cy, 2).attr({
			fill: "#00f",
		});
		var bigCircle = Snap.select('#bigcircle');
		var isDragging = false;

		bigCircle.mousedown(function(ev) {
			ev.preventDefault();
			isDragging = true;
			drag = Snap.angle(cx_cy,cx_cy, ev.layerX, ev.layerY);
			//console.log("Current angle:", new_angle, "start @", drag);

			var mySelect = $('input[name=optionsColor]:checked').val();
			new_angle = (mySelect != "analogous") ? 90 : 210;
			var delta = parseInt(drag - new_angle);
			var move_angle = parseInt(delta + 360 ) % 360;
			mAngle = move_angle;
			var step = stepsAngle(move_angle);
			if (myStep != step) { // new segment, update color
				myStep = step;
				changeColor(move_angle, step);
			}
			r.transform("r"+move_angle);
		})
		.mousemove(function(ev) {
			if (isDragging && drag != false) {
				var angle = Snap.angle(cx_cy,cx_cy, ev.layerX, ev.layerY);
				//console.log(ev.offsetX, ev.offsetY, angle);
				var delta = parseInt(angle - new_angle);
				var move_angle = parseInt(delta + 360 ) % 360;
				mAngle = move_angle;
				r.transform("r"+move_angle);
				//console.log("Offset:", ev.offsetX, ev.offsetY, "Moved angle:", move_angle, "delta @", delta);
				var step = stepsAngle(move_angle);
				if (myStep != step) { // new segment, update color
					myStep = step;
					changeColor(move_angle, step);
				}
			}
		})
		.mouseup(function(ev) {
			isDragging = false;
			//var angle = Snap.angle(cx_cy,cx_cy, ev.layerX, ev.layerY);
			//new_angle = parseInt((new_angle + angle -drag + 360) % 360);

			setTimeout(function(){
				move_angle = myStep*30+1;
				r.transform("r"+move_angle);
			}, 100);
			setTimeout(function(){
				move_angle = myStep*30-1;
				r.transform("r"+move_angle);
			}, 200);
			setTimeout(function(){
				move_angle = myStep*30+1;
				r.transform("r"+move_angle);
			}, 300);
			setTimeout(function(){
				move_angle = myStep*30;
				r.transform("r"+move_angle);
			}, 400);

			drag = false;
			new_angle = myStep*30;

			var color_len = 10;
			var colID = 'w_step'+myStep;
			var myShape = $('input[name=optionsColor]:checked').val();
			switch (myShape) {
				case ("split"):
					color_len = split[colID].length;
				break;
				case ("splitc"):
					color_len = splitc[colID].length;
				break;
				case ("analogous"):
					color_len = analogous[colID].length;
				break;
				case ("triad"):
					color_len = triad[colID].length;
				break;
				default: // square shape
					color_len = square[colID].length;
			}

			//console.log("Final angle:", new_angle);
		})
		.mouseout(function(ev){
			isDragging = false;
		});

		$('#bigcircle').bind('tapstart',function(ev){
			ev.preventDefault();

			isDragging = true;
			drag = Snap.angle(cx_cy,cx_cy, ev.originalEvent.layerX, ev.originalEvent.layerY);

			//console.log("Current angle:", new_angle, "start @", drag, "ev.originalEvent.layerX:",ev.originalEvent.layerX);

			var mySelect = $('input[name=optionsColor]:checked').val();
			new_angle = (mySelect != "analogous") ? 90 : 210;
			var delta = parseInt(drag - new_angle);
			var move_angle = parseInt(delta + 360 ) % 360;
			mAngle = move_angle;
			var step = stepsAngle(move_angle);
			if (myStep != step) { // new segment, update color
				myStep = step;
				changeColor(move_angle, step);
			}
			r.transform("r"+move_angle);
		});
		$('#bigcircle').bind('tapmove', function(ev){
			if($.isTouchCapable()) {
				ev.preventDefault();
				if (isDragging && drag != false) {
					var angle = Snap.angle(cx_cy,cx_cy, ev.originalEvent.layerX, ev.originalEvent.layerY);
					//console.log(ev.offsetX, ev.offsetY, angle);
					var delta = parseInt(angle - new_angle);
					var move_angle = parseInt(delta + 360 ) % 360;
					mAngle = move_angle;
					r.transform("r"+move_angle);
					//console.log("Offset:", ev.offsetX, ev.offsetY, "Moved angle:", move_angle, "delta @", delta);
					var step = stepsAngle(move_angle);
					if (myStep != step) { // new segment, update color
						myStep = step;
						changeColor(move_angle, step);
					}
				}
			}
		});
		$('#bigcircle').bind('tapend',function(ev){
			ev.preventDefault();
			isDragging = false;
			//var angle = Snap.angle(cx_cy,cx_cy, ev.layerX, ev.layerY);
			//new_angle = parseInt((new_angle + angle -drag + 360) % 360);

			setTimeout(function(){
				move_angle = myStep*30+1;
				r.transform("r"+move_angle);
			}, 100);
			setTimeout(function(){
				move_angle = myStep*30-1;
				r.transform("r"+move_angle);
			}, 200);
			setTimeout(function(){
				move_angle = myStep*30+1;
				r.transform("r"+move_angle);
			}, 300);
			setTimeout(function(){
				move_angle = myStep*30;
				r.transform("r"+move_angle);
			}, 400);

			drag = false;
			new_angle = myStep*30;
		});

		// make radio buttons interactive
		$('.radio-primary').on('click', function(ev) {
			var radio = $(this).find('input');
			var mySelect = $('input[name=optionsColor]:checked').val();
			numColors = radio.attr('data-numcolors');
			new_angle = 0;
			r.transform("r"+new_angle);
			$('.colortheory').hide();
			$('#'+mySelect).show();
			changeColor(new_angle);
		});

		function stepsAngle(degree) {
			degree = parseInt((degree + 360) % 360);
			if (degree > 345) { return 0 }; // step0 angle is from 346-359, 0-15 degree
			var step = 0;
			for (var i = 15; i < degree; i += 30) {
				step++;
			}
			return step;
		}


		/*	---------------------------------------------------------------------------------
										COLORCHANGE FUNCTION
			---------------------------------------------------------------------------------*/
		function changeColor(degree, step) {
			// originally using a 20-step slider (0-19) for color heues, replaced with a 20-count loop or uses passed value from clicking on selector-link.
			$('.color_selectors').empty();

			var myShape = $('input[name=optionsColor]:checked').val();

			for (var colorLoop = 0; colorLoop<20; colorLoop++) {
				// sets the number of colors as a class name on .colorwheel to style/hide elements for a greater number of colors */
				var colorwheel = $('#colorwheel');
				colorwheel.removeClass('colors_2 colors_3 colors_4');
				colorwheel.addClass('colors_'+numColors);

				step = step || stepsAngle(degree);
				var myHex = "c10"; // default
				//var Slider = parseInt(verticalSlider.noUiSlider.get())-1;
				var Slider = colorLoop;
				var colID = 'w_step'+step;
				var shape = 'split';

				//console.log(degree, step, Slider, Shade[Slider], hexColor[myHex][step], changeColor2(hexColor[myHex][step], Shade[Slider])) ;

				// badges compliment
				// badges compliment
				var color_len = 10;
				switch (myShape) {
					case ("split"):
					var col_1 = split[colID][Slider][0];
					var col_2 = split[colID][Slider][1];
					var col_3 = "";
					var col_4 = "";
					shape = 'split';
					color_len = split[colID][Slider].length;
					//colorBadges(col_1,col_2);
					break;

						// badges split compliment

					case ("splitc"):
					var col_1 = splitc[colID][Slider][0];
					var col_2 = splitc[colID][Slider][1];
					var col_3 = splitc[colID][Slider][2];
					var col_4 = "";
					shape = 'splitc';
					color_len = splitc[colID][Slider].length;
					//colorBadges(col_1,col_2,col_3);
					break;
					case ("analogous"):
					var col_1 = analogous[colID][Slider][0];
					var col_2 = analogous[colID][Slider][1];
					var col_3 = analogous[colID][Slider][2];
					var col_4 = "";
					shape = 'analogous';
					color_len = analogous[colID][Slider].length;
					//colorBadges(col_1,col_2,col_3);
					break;
					case ("triad"):
					var col_1 = triad[colID][Slider][0];
					var col_2 = triad[colID][Slider][1];
					var col_3 = triad[colID][Slider][2];
					var col_4 = "";
					shape = 'triad';
					color_len = triad[colID][Slider].length;
					//colorBadges(col_1,col_2,col_3);
					break;
					default: // square shape
					var col_1 = square[colID][Slider][0];
					var col_2 = square[colID][Slider][1];
					var col_3 = square[colID][Slider][2];
					var col_4 = square[colID][Slider][3];
					shape = 'square';
					color_len = square[colID][Slider].length;
					//colorBadges(col_1,col_2,col_3,col_4);
				}

				if (colorLoop == 9) {	// 9 = center of 0-19 range
					color_page_elements(col_1,col_2,col_3,col_4,colorauthor[shape][colID][Slider] );
				}
				if (colorLoop <20) {
					if (colorauthor[shape][colID][colorLoop]) {
						var colorAuthor = '<span class="author_dot"><span class="dot"></span></span>';
					} else {
						var colorAuthor = '';
					}
					// create 20 color-selector links
					$('.color_selectors').append(
						'<div class="color_selector" data-col1="'+col_1+'" data-col2="'+col_2+'" data-col3="'+col_3+'" data-col4="'+col_4+'">'+
							'<a class="selector_link">'+
								'<span class="cs colors_2" style="background:'+col_1+'" ></span>'+
								'<span class="cs colors_2" style="background:'+col_2+'" ></span>'+
								'<span class="cs colors_3" style="background:'+col_3+'" ></span>'+
								'<span class="cs colors_4" style="background:'+col_4+'" ></span>'+
							'</a>'+colorAuthor+
							'<div class="author">'+colorauthor[shape][colID][colorLoop]+'</div>'+
						'</div>'
					);
				}
			}
		}

		function changeColor2(color, percent) {
			var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
			return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
		}


		// calls function to set colors for each page element
		function color_page_elements(col_1,col_2,col_3,col_4, colorauthor) {
			colorBadges(col_1,col_2,col_3,col_4);
			color_squares(col_1,col_2,col_3,col_4);
			color_gradients(col_1,col_2,col_3,col_4);
			set_main_selection(col_1,col_2,col_3,col_4, colorauthor);
		}

		function set_main_selection(col_1,col_2,col_3,col_4, colorauthor) {
			$('#sq1').text(col_1);
			$('#sq2').text(col_2);
			$('#sq3').text(col_3);
			$('#sq4').text(col_4);
			$('#designer').html(colorauthor);
		}


		function color_squares(col_1,col_2,col_3,col_4) {
			// set colorsquares background colors
			$('.sq1').css('background-color', col_1);
			$('.sq2').css('background-color', col_2);
			$('.sq3').css('background-color', col_3);
			$('.sq4').css('background-color', col_4);
		}

		function color_gradients(col_1,col_2,col_3,col_4) {
			// set gradient circle colors
			$('.gc1').css('background', 'linear-gradient(to bottom,  '+col_1+' 0%,'+col_2+' 95%)');

			if (!col_3) {
				$('.gc2').css('background', 'linear-gradient(to bottom,  '+col_1+' 0%,#fff 75%)');
				$('.gc4').css('background', 'linear-gradient(to bottom,  '+col_2+' 0%,#fff 75%)');
				$('.gc3').css('background', 'linear-gradient(to bottom,  '+col_1+' 0%,#000 75%)');
				$('.gc5').css('background', 'linear-gradient(to bottom,  '+col_2+' 0%,#000 75%)');
				$('.gc6').css('background', '#f3f1f1');
			} else if (!col_4) {
				$('.gc2').css('background', 'linear-gradient(to bottom,  '+col_1+' 0%,'+col_3+' 85%)');
				$('.gc4').css('background', 'linear-gradient(to bottom,  '+col_3+' 0%,'+col_2+' 85%)');
				$('.gc3').css('background', '#f3f1f1');
				$('.gc5').css('background', '#f3f1f1');
				$('.gc6').css('background', '#f3f1f1');
			} else {
				$('.gc2').css('background', 'linear-gradient(to bottom,  '+col_1+' 0%,'+col_3+' 85%)');
				$('.gc4').css('background', 'linear-gradient(to bottom,  '+col_3+' 0%,'+col_2+' 85%)');
				$('.gc3').css('background', 'linear-gradient(to bottom,  '+col_1+' 0%,'+col_4+' 95%)');
				$('.gc5').css('background', 'linear-gradient(to bottom,  '+col_2+' 0%,'+col_4+' 95%)');
				$('.gc6').css('background', 'linear-gradient(to bottom,  '+col_3+' 0%,'+col_4+' 95%)');
			}


			// set gradient square colors
			$('.gs1').css('background', 'linear-gradient(to bottom,  '+col_1+' 0%, #ffffff 90%)');
			$('.gs2').css('background', 'linear-gradient(to bottom,  '+col_2+' 0%, #ffffff 90%)');
			$('.gs3').css('background', 'linear-gradient(to bottom,  '+col_3+' 0%, #ffffff 90%)');
			$('.gs4').css('background', 'linear-gradient(to bottom,  '+col_4+' 0%, #ffffff 90%)');

			$('.gs5').css('background', 'linear-gradient(to bottom,  '+col_1+' 0%, #000000 90%)');
			$('.gs6').css('background', 'linear-gradient(to bottom,  '+col_2+' 0%, #000000 90%)');
			$('.gs7').css('background', 'linear-gradient(to bottom,  '+col_3+' 0%, #000000 90%)');
			$('.gs8').css('background', 'linear-gradient(to bottom,  '+col_4+' 0%, #000000 90%)');

		}


		function colorBadges(c1,c2,c3,c4) {
			var badges =  document.getElementsByTagName('object'); // get all Object
			var argLen = arguments.length;

			var c_def = '#f2f2f2';
			$.each(badges, function(key, badge) {
				var svgdoc =  badge.getSVGDocument(); // <svg>
				if (svgdoc == undefined) { return };
				var myStyle = svgdoc.getElementsByTagName('style'); // <style> array
				var css = myStyle[0].textContent;


                                 // triangles
				if(argLen == 4) {
					css = css.replace(/g2.display....../, "g2{display:none ");
					css = css.replace(/g3.display....../, "g3{display:none ");
					css = css.replace(/g4.display....../, "g4{display:block");
				}
				else if(argLen ==3) {
					css = css.replace(/g2.display....../, "g2{display:none ");
					css = css.replace(/g3.display....../, "g3{display:block");
					css = css.replace(/g4.display....../, "g4{display:none ");
				}
				else {
					css = css.replace(/g2.display....../, "g2{display:block");
					css = css.replace(/g3.display....../, "g3{display:none ");
					css = css.replace(/g4.display....../, "g4{display:none ");
				}

				css = css.replace(/st0.fill......../, "st0{fill:"+c1);
				css = css.replace(/st1.fill......../, "st1{fill:"+c2);
				if (c3) {
					css = css.replace(/st2.fill......../, "st2{fill:"+c3);
				} else {
					css = css.replace(/st2.fill......../, "st2{fill:"+c1);
				}
				if (c4) {
					css = css.replace(/st3.fill......../, "st3{fill:"+c4);
				} else {
					css = css.replace(/st3.fill......../, "st3{fill:"+c2);
				}
				myStyle[0].textContent = css;
			});
		}




		/* -----------------------------------------------------------
							EVENT HANDLERS
			----------------------------------------------------------*/

		body.on('click', '.section_close', 		scroll_intro 				);	// closes intro with either button click
		body.on('click', '.set_condition', 		set_intro_condition 		);	// sets 'don't show intro'
		// body.on('click', '.close_popup', 		close_popup					);	// close the nearest popup

		body.on('click', '.color_selector', 	handle_color_selector		);	// clicking a color-combination link shanges site's examples to follow
		body.on('mouseover', '.color_selector',	handle_color_selector_hover	);	// minor function to handle other link's opacity (css-only solution was flakey)
		body.on('mouseout', '.color_selector',	handle_color_selector_unhover	);	// minor function to handle other link's opacity (css-only solution was flakey)

		// init the canvas
		changeColor(0,0);

	});


	/*
						RESET LOCALSTORAGE FOR INTRO CONDITION TESTING	-- mmcguire
						remove or comment-out for production

	$(function() {
		var body = $('body');
		var resetButton = '<button class="reset_intro" style="position: absolute; top: 1vh; right: 1vw; z-index: 100;" type="button">reset intro condition</button>';
		body.append(resetButton);

		body.on('click', '.reset_intro', function() {localStorage.setItem("introCondition", ""); location.reload();})
	});
	*/
