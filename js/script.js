	/*

	Name: SENTENCING ATTITUDES - VISUAL INTERACTIVE NUMBER 3
	Developer: J BAYLISS
	From/to: Nov 2016 to Dec 2016
	Technologies: D3, Javascript, D3, Chosen, Bootstrap

	*/


	console.log("VISUAL INTERACTIVE NUMBER 3 - DEVELOPMENT / LABS PORTAL");
	
	
	
	
	
	
	// http://stackoverflow.com/questions/14167863/how-can-i-bring-a-circle-to-the-front-with-d3
	d3.selection.prototype.moveToFront = function() {
	  return this.each(function(){
		this.parentNode.appendChild(this);
	  });
	};
	d3.selection.prototype.moveToBack = function() { 
		return this.each(function() { 
			var firstChild = this.parentNode.firstChild; 
			if (firstChild) { 
				this.parentNode.insertBefore(this, firstChild); 
			} 
		}); 
	};
	
	
	// initialise global variables.
	var graphic = $('#graphic'); // set variable to DOM element to contain graphic
	var deadspace  = $('#deadspace'); // set variable to DOM element to contain graphic
	var footer = $('#footer'); // set variable to DOM element to contain graphic
	var buttons = $("#buttons"); // global variable to #buttons DOM DIV item
	var vis = {}; // global object variable to contain all variables prefixed with 'vis.'	
	var svg; // svg container          
	var svgBottom; // svg container 
	var circleScale = d3.scale.sqrt().domain([0, 30]).range([0, 15]);
	var callOutHeightArray = [];

	var View1_dots = {};
	var View2_dots = {};
	var View3_dots = {};
	var View4_dots = {};
	var View5_dots = {};
	var View6_dots = {};
	var View7_dots = {};
	var dots = {};
	var dotInfo  = {};
	var View1_articleIndex = {};
	var graphSpace = {};
	var deadSpace= {};

	var pymChild = null; // initial Pym variable
	var height; // height of graphic container. Updated on resizing.
	
	var auto = false;
	
	var screenResolution = {
								'thunderbolt' : { width:2000 , height:1440 } ,
								'node' : { width:1080 , height:1920 } ,
								'supernodeA' : { width:5760 , height:4320 } ,
								'supernodeB' : { width:5760 , height:4320 } ,
								'supernodeC' : { width:7680 , height:4320 } ,
								'supernodeD' : { width:5760 , height:4320 } ,
								'supernodeE' : { width:5760 , height:4320 } ,
								'full' : { width:30270 , height:4320 }
							};	

	var colors = { 0:"#888888", 1:"#387C2B", 2:"#621F95", 3:"#FFE81F", 4:"#FF9B1F" };
		
	var titles = [ 
					"Twitter Analysis : Conviction of Eight Men on Child Abuse Charges" ,
					"Twitter Analysis : @BBCBreaking News Tweet and Retweets" ,
					"Twitter Analysis : Popularity of Tweets and Retweets" ,
					"Twitter Analysis : Race, Religion and Immigration"  
				];
				
/*			
	var calloutIndexes = [
							[ 22 ],
							[ 22 ],
							[ 22 , 495 , 595 , 1099 , 2417 , 2744 ],
							[ 22 , 495 , 595 , 1099 , 2417 , 2744 ]
						];
*/
			
	var calloutIndexes = [
							[ 33 ],
							[ 33 ],
							[ 33 , 547 , 657 , 1236 , 2689 , 3044 ],
							[ 33 , 547 , 657 , 1236 , 2689 , 3044 ]
						];
		
	var callOutHeight = [ 
							[ 1 ],
							[ 1 ],
							[ 1 , -0.8 , 1 , 0.6 , 1 , 0.4 ],
							[ 1 , -0.8 , 1 , 0.6 , 1 , 0.4]
						];
					
		
	var callOutHeightBottom = [ 
								[ 22 ],
								[ 22 ],
								[ 22 , 22 , 19 , 16 , 22 , 22 ],
								[ 22 , 22 , 19 , 16 , 22 , 22 ]
							];
			
	var calloutTexts = [
							[ "@BBCBreaking: Eight men guilty of 16 charges over sexual exploitation of three girls in Rotherham between 1999 and 2003" ],
							[ "@BBCBreaking: Eight men guilty of 16 charges over sexual exploitation of three girls in Rotherham between 1999 and 2003" ],
							[
								"@BBCBreaking: Eight men guilty of 16 charges over sexual exploitation of three girls in Rotherham between 1999 and 2003",
								"Relief at guilty verdict for all 8 in #Rotherham CSE trail Greatest admiration for survivors who fought for justice",
								"Deepest respect to women in #Rotherham child sexual abuse trail, for decades tried to be heard.",
								"...their complaints to the police, social services, their MP and the home secretary went unresolved",
								"The #Police failed these girls by losing/destroying evidence and blaming them for their 'chosen' life style",
								"...victim believed she would never get justice after police failures when she reported rapes at 13"
							],
							[
								"@BBCBreaking: Eight men guilty of 16 charges over sexual exploitation of three girls in Rotherham between 1999 and 2003",
								"Relief at guilty verdict for all 8 in #Rotherham CSE trail Greatest admiration for survivors who fought for justice",
								"Deepest respect to women in #Rotherham child sexual abuse trail, for decades tried to be heard.",
								"...their complaints to the police, social services, their MP and the home secretary went unresolved",
								"The #Police failed these girls by losing/destroying evidence and blaming them for their 'chosen' life style",
								"...victim believed she would never get justice after police failures when she reported rapes at 13"
							]
						];
			
	var marginDeadspace = { top:0, right:0, bottom:0, left:0 };
					
	var yAxisRanges = {
						top : { minimum:-1 , maximum:1 },
						bottom : { minimum:0 , maximum:22 }
					}
					
	var ratios = { topRatio:0.75 , bottomRatio:0.45 }
					
	var margin = { 
				top : { top:25, right:200, bottom:25, left:50 } ,
				bottom : { top:40, right:200, bottom:25, left:50 } 
			}
		
      

	// broswer use checking ... need this to resovle issue with tooltip not locating precisely in FireFox.			
	var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0; // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
	var isFirefox = typeof InstallTrigger !== 'undefined';   // Firefox 1.0+
	var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0; // At least Safari 3+: "[object HTMLElementConstructor]"
	var isChrome = !!window.chrome && !isOpera;              // Chrome 1+
	var isIE = /*@cc_on!@*/false || !!document.documentMode;   // At least IE6		

	var output = 'Detecting browsers by ducktyping:		';
		output += 'isFirefox: ' + isFirefox + '		';
		output += 'isChrome: ' + isChrome + '		';
		output += 'isSafari: ' + isSafari + '		';
		output += 'isOpera: ' + isOpera + '		';
		output += 'isIE: ' + isIE + '		';
	   		
	var dateFormat = "%Y%m%d";     // 01/01/2000
	var view1 = {};
	var view2 = {};
	var view3 = {};
	var view4 = {};
	var view5 = {};
	var view6 = {};
	var view7 = {};
					
	var viewCounter = 0;
	
	/*
		name: 			drawGraphic
		DESCRIPTION:	Main drawing function to draw to DOM initial scarter plot view. 	
		CALLED FROM:	Pym in 	
		CALLS:			
		REQUIRES: 		n/a
		RETURNS: 		n/a
	*/
	function drawGraphic()
	{
			
		var w = window.innerWidth;
		var h = window.innerHeight;	
		
			
		// clear out existing graphics and footer
		graphic.empty();
		deadspace.empty();
		footer.empty();
								
		var requiredResolution = 'thunderbolt';
		/*
		graphSpace = {
						width:screenResolution[requiredResolution].width ,
						height:screenResolution[requiredResolution].height*ratios.topRatio
					}
						
		deadSpace= {
						width:screenResolution[requiredResolution].width ,
						height:screenResolution[requiredResolution].height*ratios.bottomRatio
					}
		*/
		/*
		graphSpace = {
						width:screenResolution[requiredResolution].width ,
						height:screenResolution[requiredResolution].height*0.75
					}
						
		deadSpace= {
						width:screenResolution[requiredResolution].width ,
						height:screenResolution[requiredResolution].height*0.0
					}
					*/
					
					
		var aspectRatio = [ 16, 9 ];

		graphSpace = {
						width : graphic.width() ,
						height : Math.ceil(((graphic.width() - margin.top.left - margin.top.right) * aspectRatio[1]) / aspectRatio[0]) - margin.top.top - margin.top.bottom
					}
						
		deadSpace= {
						width:graphic.width() ,
						height:0.0
					}
					
					
		/* TOP BAR CHART */
		
		d3.select("#graphic").append("h1").attr("id" , "viewCounter").style("text-align" , "center").text(titles[viewCounter]);
		
		
		svg = d3.select("#graphic")
			.append("svg")
			.attr("class" , "svg")
			.attr("id" , "svg")
			.attr("width" , graphSpace.width )
			.attr("height" , graphSpace.height*ratios.topRatio )
			.attr("x" , 0 )
			.attr("y" , 0 ); 			

											 
		// define and construct y axis domain and ranges
		vis.yTop = d3.scale.linear().domain([yAxisRanges.top.minimum , yAxisRanges.top.maximum]).range([ ((graphSpace.height*ratios.topRatio)-margin.top.top-margin.top.bottom) , margin.top.top ]);
		vis.yAxisTop = d3.svg.axis().scale(vis.yTop).orient("left").ticks(10).tickFormat(d3.format(",.1f"));						
		d3.select("#svg")
			.append("g")
			.attr("class", "y axis")
			.attr("id", "topYAxis")
			.attr("transform", "translate(" + margin.top.left + "," + margin.top.top + ")")
			.call(vis.yAxisTop);
			
		vis.yticksTop = svg.selectAll('#topYAxis').selectAll('.tick');					 
		vis.yticksTop.append('svg:line')
			.attr( 'id' , "yAxisTicksTop" )
			.attr( 'y0' , 0 )
			.attr( 'y1' , 0 )
			.attr( 'x1' , 0 )
			.attr( 'x2', graphSpace.width-margin.bottom.left*2)
			.style("opacity" , 0.05);
		
		
						 
		// define and construct y axis domain and ranges				
		vis.xTop = d3.time.scale().range([margin.top.left, (graphSpace.width - margin.top.left/* - margin.top.right*/)]);
		vis.xTop.domain(d3.extent(view2, function(d) { return d.formattedDate; }));
		vis.xAxisTop = d3.svg.axis().scale(vis.xTop).orient("bottom");
		
					
		vis.xAxisTop = d3.svg.axis()
			.scale(vis.xTop)
			.orient("bottom")
			.tickFormat(function(d,i) {
				var fmt = d3.time.format("%I%p");
				str = fmt(d);
				return (str.toString())[0] == '0' ? str = str.slice(1,str.length) : str = str.slice(0,str.length);
			})
			.tickPadding(5);					
	
		d3.select("#svg")
			.append("text")
			.attr( "class" , "yAxisLabels")
			.attr( "id" , function(d,i){ return "yAxisLabel"; })
			.attr("x" , margin.top.left)
			.attr("y" , 25)
			.style("font-size" , "1.0em")
			.style("fill" , "white")
			.text("Sentiment");
				 
		var dots = svg.selectAll(".dots1")
			.data(View1_dots['sentiment'])
			.enter()
			.append("circle");
			 
		var circleAttributes = dots
			.attr("class", function (d,i) {
				var classStr = "dots1 index-" + d.index;
				if ( d.color_1 != 0 ) { classStr = classStr + " view0"; }
				if ( d.color_2 != 0 ) { classStr = classStr + " view1"; }
				if ( d.index == 33 ) { classStr = classStr + " mainTweet pulse"; }
				if ( d.color_3 != 0 ) { classStr = classStr + " view2"; }
				if ( d.color_4 != 0 ) { classStr = classStr + " view3"; }
				
				return classStr;
			})
			.attr("id", function (d,i) { return "dot1-" + d.index; })
			.attr("cx", function (d,i) { return vis.xTop(d.formattedDate); })
			.attr("cy", function (d,i) { return margin.top.top+vis.yTop(d.sentiment); })
			.attr("r", function (d,i) { return 5/*circleScale(d.markersize_1)*/; })
			.style("opacity", function(d,i) { return 1.0; })
			.style("fill" , function(d,i){ return colors[d.color_1]; })
			.style("stroke" , function(d,i){
				if ( d.index == 33 ) { return "#FFFFFF"; }
				else { return colors[d.color_1]; }
			})
			.style("stroke-width" , "2px")
			.style("fill-opacity" , 0.50);
			 
		//create x axis
		d3.select("#svg")
			.append('g')
			.attr('class', 'x axis')
			.attr('id', 'topXAxis')
			.attr('transform', function(d, i){ return "translate(" + (0) + "," + (margin.top.top + vis.yTop(0)) + ")"; })
			.call(vis.xAxisTop);

				
		/* BOTTOM BAR CHART */
			
		svgBottom = d3.select("#graphic")
			.append("svg")
			.attr("class" , "svg")
			.attr("id" , "svgBottom")
			.attr("width" , graphSpace.width )
			.attr("height" , graphSpace.height*ratios.bottomRatio )
			.attr("x" , 0 )
			.attr("y" , 0 ); 
						
		vis.xBottom = d3.time.scale().range([margin.top.left, (graphSpace.width - margin.top.left/* - margin.top.right*/)]);
		vis.xBottom.domain(d3.extent(view1, function(d) {  return d.formattedDate; }));
		vis.xAxisBottom = d3.svg.axis().scale(vis.xBottom).orient("bottom");				
														 
		// define and construct y axis domain and ranges
		vis.yBottom = d3.scale.linear().domain([yAxisRanges.bottom.minimum , yAxisRanges.bottom.maximum]).range([ ((graphSpace.height*ratios.bottomRatio)-margin.bottom.top-margin.bottom.bottom) , margin.bottom.top ]);
		vis.yAxisBottom = d3.svg.axis().scale(vis.yBottom).orient("left").ticks(10).tickFormat(d3.format(",.0f"));	
				
		var dots = svgBottom.selectAll(".dots2")
			.data(View2_dots['number_articles_per_minute'])
			.enter()
			.append("circle"); 
		 
		var circleAttributes = dots
			.attr("class", function (d,i) { return "dots2 index"; })
			.attr("id", function (d,i) { return "dot2-" + d.index; })
			.attr("cx", function (d,i) { return vis.xBottom(d.formattedDate); })
			.attr("cy", function (d,i) { return vis.yBottom(d.number_articles_per_minute); })
			.attr("r", function (d,i) { return 1; })
			.style("opacity", function(d,i) { return 1.0; })
			.style("fill" , "#00497F")
			.style("stroke" , "#00497F")
			.style("stroke-width" , "1px")
			.style("fill-opacity" , 1.00);
						 
					 
					 
		
		
		// define clipPath around scatter plot frame
		svgBottom.append("defs").append("clipPath")
			.attr("id", "clip")
			.append("rect")
			.attr("width", graphSpace.width )
			.attr("height", graphSpace.height*ratios.bottomRatio - margin.bottom.top - margin.bottom.bottom )
			.attr("transform" , "translate(" + margin.bottom.left + "," + 0 + ")");
			
			
		var line = d3.svg.line()
			.x(function(d) { return vis.xBottom(d.formattedDate); })
			.y(function(d) { return vis.yBottom(+d.number_articles_per_minute); })
								
		var area = d3.svg.area()
			.x(function(d) { return vis.xBottom(d.formattedDate); })
			.y0(graphSpace.height*ratios.bottomRatio)
			.y1(function(d) { return vis.yBottom(+d.number_articles_per_minute);; });	
		
		svgBottom.append("path")
			.datum(view2)
			.attr("class", "line")
			.attr("id", "line")
			.style("fill" , "#none")
			.style("stroke" , "#005DA2")
			.style("stroke-width" , "2px")
			.style("fill-opacity" , 0.5)
			.attr("clip-path", "url(#clip)")
			.attr("d", line); 
						
		svgBottom.append("path")
			.datum(view2)
			.attr("class", "area")
			.attr("id", "area")
			.style("fill" , "#005DA2")
			.style("stroke" , "#005DA2")
			.style("stroke-width" , "2px")
			.style("fill-opacity" , 0.5)
			.attr("clip-path", "url(#clip)")	
			.attr("d", area);
			
	/*			
		  svgBottom.append("linearGradient")
			  .attr("id", "temperature-gradient")
			  .attr("gradientUnits", "userSpaceOnUse")
			  .attr("x1", 0)
			  .attr("y1", vis.yBottom(0)  )
			  .attr("x2", 900)
			  .attr("y2", vis.yBottom(4) )
			.selectAll("stop")
			  .data([
				{offset: "0%", color: "steelblue"},
				{offset: "50%", color: "gray"},
				{offset: "100%", color: "red"}
			  ])
			.enter().append("stop")
			  .attr("offset", function(d) { return d.offset; })
			  .attr("stop-color", function(d) { return d.color; });
*/

		d3.select("#svgBottom")
			.append("g")
			.attr("class", "y axis")
			.attr("id", "bottomYAxis")
			.attr("transform", "translate(" + margin.bottom.left + "," + (0)  + ")")
			.call(vis.yAxisBottom);
		
		d3.select("#svgBottom")
			.append("text")
			.attr( "class" , "yAxisLabels")
			.attr( "id" , function(d,i){ return "yAxisLabel"; })
			.attr("x" , margin.bottom.left)
			.attr("y" , 20)
			.style("font-size" , "1.0em")
			.style("fill" , "white")
			.text("Number of tweets per minute");
			
		vis.yticksBottom = svgBottom.selectAll('#bottomYAxis').selectAll('.tick');					 
		vis.yticksBottom.append('svg:line')
			.attr( 'id' , "yAxisTicksBottom" )
			.attr( 'y0' , 0 )
			.attr( 'y1' , 0 )
			.attr( 'x1' , 0 )
			.attr( 'x2', graphSpace.width-margin.bottom.left*2)
			.style("opacity" , 0.05);
		
					
		vis.xAxisBottom = d3.svg.axis()
			.scale(vis.xBottom)
			.orient("bottom")
			.tickFormat(function(d,i) {
				var fmt = d3.time.format("%I%p");
				str = fmt(d);
				return (str.toString())[0] == '0' ? str = str.slice(1,str.length) : str = str.slice(0,str.length);
			})
			.tickPadding(5);	
			
		//create brush x axis
		d3.select("#svgBottom")
			.append('g')
			.attr('class', 'x axis')
			.attr('id', 'bottomXAxis')
			.attr('transform', function(d, i){ return "translate(" + (0) + "," + ( + vis.yBottom(0)) + ")"; })
			.call(vis.xAxisBottom);
			
		svgDeadSpace = d3.select("#deadspace")
			.append("svg")
			.attr("class" , "svg")
			.attr("id" , "svgDeadSpace")
			.attr("width" , deadSpace.width )
			.attr("height" , deadSpace.height )
			.attr("x" , 0 )
			.attr("y" , 0 ); 			
			 
		d3.select("#footer")
			.append("a")
			  .attr("href", "http://innovation.thomsonreuters.com/en/labs.html")
			  .attr("target" , "_blank")
			  .html("</br>Data visualisation by Thomson Reuters Labs");
		
		drawLegend();
		
		if ( auto == true ){
			
		  myInterval = setInterval(function () {
			  
				transitionData();
				viewCounter++;
				if ( viewCounter === 4 ) {
					clearInterval(myInterval);
				}
			}, 6000);
		}
			 
		//use pym to calculate chart dimensions	
		if (pymChild) { pymChild.sendHeight(); }

		return;

	} // end function drawGraphic()






	/*
		NAME: 			buildUI
		DESCRIPTION: 	function to build intitial UI interface.
		CALLED FROM:	Modernizr.inlinesvg
		CALLS:			n/a
		REQUIRES: 		n/a	
		RETURNS: 		n/a		
	*/
	function buildUI(){	
		
		return;
		
	} // end function buildUI()



	/*
	NAME: 			transitionData
	DESCRIPTION: 	
	CALLED FROM:	
					
	CALLS:			
					
	REQUIRES: 		n/a
	RETURNS: 		n/a
	*/
	function transitionData()
	{
		var index = 0;
		d3.select("#viewCounter").text(titles[viewCounter]);
		
		if ( viewCounter == 0 ) {
			 
			// opening page ... 
		}
		else if ( viewCounter == 1 ) {
			 
			d3.selectAll(".dots1")
				.transition()
				.duration(2500)
				.attr("r", function (d,i) { return circleScale(+d.markersize_2); })
			 	.style("fill" , function(d,i){ return colors[d.color_2]; })
				.style("stroke" , function(d,i){
					     if ( d.color_2 == 0 ) { return "none"; }
					else if ( d.color_2 == 1 ) { return colors[d.color_2]; }
					else if ( d.color_2 == 2 ) { return "white"; }
				})
				.style("stroke-width" , function(d,i){ 
					if ( d.color_2 == 0 ){ return "0px"; }
					else { return "2px"; }
				})
				.style("fill-opacity" , function(d,i){ 
					if ( d.color_2 == 0 ){ return 0.25; }
					else { return 0.75; }
				});
				
			 var sel = d3.selectAll(".dots1.view1");
			 sel.moveToFront();
			 var sel = d3.selectAll(".mainTweet");
			 sel.moveToFront();
					
		}// end else if ... 
		
		else if ( viewCounter == 2 ) {
			 
			d3.selectAll(".dots1")
				.transition()
				.duration(2500)
				.attr("r", function (d,i) { return circleScale(+d.markersize_3); })
			 	.style("fill" , function(d,i){ return colors[d.color_3]; })
				.style("stroke" , function(d,i){
					if ( d.index == 33 ) { return "#FFFFFF"; }
					else if ( calloutIndexes[2].indexOf(+d.index) != -1 ) { return "#FFFFFF"; }
					else { return colors[d.color_3]; }
				})
				.style("stroke-width" , function(d,i){ 
					if ( d.color_3 == 0 ){ return "0px"; }
					else { return "2px"; }
				})
				.style("fill-opacity" , function(d,i){ 
					if ( d.color_3 == 0 ){ return 0.25; }
					else { return 0.75; }
				}); 
				
			 var sel = d3.selectAll(".dots1.view2");
			 sel.moveToFront();	
			 var sel = d3.selectAll(".mainTweet");
			 sel.moveToFront();		
	
		}// end else if ... 	
		
		else if ( viewCounter == 3 ) {
			 
			d3.selectAll(".dots1")
				.transition()
				.duration(2500)
				.attr("r", function (d,i) { return circleScale(+d.markersize_4); })
			 	.style("fill" , function(d,i){ return colors[d.color_4]; })
				.style("stroke" , function(d,i){
					if ( d.index == 33 ) { return "#FFFFFF"; }
					else if ( calloutIndexes[3].indexOf(+d.index) != -1 ) { return "#FFFFFF"; }
					else { return colors[d.color_4]; }
				})
				.style("stroke-width" , function(d,i){ 
					if ( d.color_4 == 0 ){ return "0px"; }
					else { return "2px"; }
				})
				.style("fill-opacity" , function(d,i){ 
					if ( d.color_4 == 0 ){ return 0.25; }
					else { return 0.75; }
				});
				
			 var sel = d3.selectAll(".dots1.view3");
			 sel.moveToFront();	
			 var sel = d3.selectAll(".mainTweet");
			 sel.moveToFront();
				
		} // end else if ... 	
		
		drawLegend();
		
		return;
	 
	}// end transitionData()
	
	
	
	
	
	function getDotData(){

		// parse data into columns
		View1_dots = {};
		View2_dots = {};
		
		for (var field in view1[0]) {
		
			View1_dots[field] = view1.map(function(d,i) {
				
				View1_articleIndex[d.index] = { 
							"index" : d["index"],
							"id" : d["id"],
							"datetime" : d["datetime"],
							"formattedDate" : d["formattedDate"],
							"sentiment" : d["sentiment"],
							"rwt_retweet_count" : d["rwt_retweet_count"],
							"markersize_1" : d["markersize_1"],
							"markersize_2" : d["markersize_2"],
							"markersize_3" : d["markersize_3"],
							"markersize_4" : d["markersize_4"],
							"color_1" : d["color_1"],
							"color_2" : d["color_2"],
							"color_3" : d["color_3"],
							"color_4" : d["color_4"],
							"text" : d["text"],
							"user_name" : d["user_name"],
							"single_tweet_history_flag" : d["single_tweet_history_flag"],
							"keyword_tweet_idx" : d["keyword_tweet_idx"],
							"callout_1_flag" : d["callout_1_flag"],
							"callout_1_text" : d["callout_1_text"],
							"callout_2_flag" : d["callout_2_flag"],
							"callout_2_flag" : d["callout_2_text"],
							"callout_3_flag" : d["callout_3_flag"],
							"callout_3_text" : d["callout_3_text"],
							"callout_4_flag" : d["callout_4_flag"],
							"callout_4_text" : d["callout_4_text"]
				};
				
				return { 	
							"index" : d["index"],
							"id" : d["id"],
							"datetime" : d["datetime"],
							"formattedDate" : d["formattedDate"],
							"sentiment" : d["sentiment"],
							"rwt_retweet_count" : d["rwt_retweet_count"],
							"markersize_1" : d["markersize_1"],
							"markersize_2" : d["markersize_2"],
							"markersize_3" : d["markersize_3"],
							"text" : d["text"],
							"user_name" : d["user_name"],
							"single_tweet_history_flag" : d["single_tweet_history_flag"],
							"color_1" : d["color_1"],
							"color_2" : d["color_2"],
							"color_3" : d["color_3"],
							"markersize_4" : d["markersize_4"],
							"keyword_tweet_idx" : d["keyword_tweet_idx"],
							"color_4" : d["color_4"],
							"callout_1_flag" : d["callout_1_flag"],
							"callout_1_text" : d["callout_1_text"],
							"callout_2_flag" : d["callout_2_flag"],
							"callout_2_flag" : d["callout_2_text"],
							"callout_3_flag" : d["callout_3_flag"],
							"callout_3_text" : d["callout_3_text"],
							"callout_4_flag" : d["callout_4_flag"],
							"callout_4_text" : d["callout_4_text"]
						};
			
			});
		}// end for ..
		
		
		
		for (var field in view2[0]) {
		
			View2_dots[field] = view2.map(function(d,i) {
			
				return { 	
							'index': +d["index"],
							'formattedDate': d["formattedDate"],
							'number_articles_per_minute': +d["number_articles_per_minute"],
							'datetime': d["datetime"]
						};
			});
		}// end for ...
		
		
		return;
		
	} // end function getDotData()
	
	
	
	
	function ready(error, data1, data2){
		
		view1 = data1;
		view2 = data2;
		 
		// 2016-10-17 23:29:51
		data1.forEach(function(d) { d.formattedDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse(d.datetime); });
		
		// date format for Sentencing Attitudes ... //20161017T23:17
		data2.forEach(function(d) { d.formattedDate = d3.time.format("%Y%m%dT%H:%M").parse(d.datetime); });
		
		getDotData();	
		pymChild = new pym.Child({renderCallback: drawGraphic});
		
		return;
		
	}// end function ready()

			


				
							

	//then, onload, check to see if the web browser can handle 'inline svg'
	if (Modernizr.inlinesvg)
	{

		// open and load configuration file. 					
		d3.json("data/config.json", function(error, json)
		{	
						
			// store read in json data from config file as as global vis. variable ...	
			vis.config = json;
			
			// call function to draw initial UI on load.
			buildUI();
			readFile();
			

		})// end 


	} // end if ... 
	else {


		//use pym to create iframe containing fallback image (which is set as default)
		pymChild = new pym.Child();
		if (pymChild) { pymChild.sendHeight(); }


	}	
	
	
	
	function readFile(){
		
		queue()
			.defer(d3.csv, "./data/twitter_scatterplot_data.csv")
			.defer(d3.csv, "./data/twitter_lower_bar_data.csv")
			.await(ready);


		
		return;
		
	}// end function readFile()
	
	
	
	// event.type must be keypress
	$(function(){
		$('html').keydown(function(e){
			
			if ( auto == false ){
				
				if ( e.keyCode == 13 /* RETURN */ ) {
					viewCounter++;
					
					if ( viewCounter < 4 ) {
						d3.select("#viewCounter").text(titles[viewCounter])
						transitionData();
					}
				}
			}
		});
	});
	
	
	

	
	
	
	function wrap(text, width , callOutCount , thumbnail) {
		
		var lineCount = 0;
		//var callOutCount = 0;
		//callOutHeightArray = [];
		var lineHeight = 1.25;
		var boxHeight = -1;
			 
		text.each(function(d,i) {
		  
			lineCount = 0;
			var text = d3.select(this),
				words = text.text().split(/\s+/).reverse(),
				word,
				line = [],  
				lineNumber = 0, /*
				lineHeight = 1.5, */  // ems
				y = text.attr("y"),
				dy = parseFloat(text.attr("dy"));
				
			var tspan;
			
			if ( callOutCount == 0 && lineCount == 0 ) {
				tspan = text.text(null).append("tspan").style("fill","#A00000").style("font-weight","bold").style("font-size","14px").attr("x", 5).attr("y", y).attr("dy", dy + "em");
			}
			
			else if ( callOutCount != 0 && lineCount == 0 ) {
				tspan = text.text(null).append("tspan").style("font-size","12px").attr("x", 5).attr("y", y).attr("dy", dy + "em");
			}
			else {
				tspan = text.text(null).append("tspan").style("font-size","12px").attr("x", 5).attr("y", y).attr("dy", dy + "em");
			}
					
			while (word = words.pop()) {
			  line.push(word);
			  tspan.text(line.join(" "));
			  
			  if (tspan.node().getComputedTextLength() > width) {
			  
				line.pop();
				tspan.text(line.join(" "));
				line = [word];
				tspan = text.append("tspan").attr("x", 5).attr("y", y).style("font-size","12px").attr("dy", ++lineNumber * lineHeight + dy + "em").text(" " + word);
				lineCount++;
			  }
			}
		});
			
		//if ( thumbnail === undefined ) {
		//	callOutHeightArray[callOutCount] = ((lineCount+1) * (lineHeight*30));
		//}
		//else {
			callOutHeightArray.push((lineCount+1) * (lineHeight*20)/* + 75*/);
		//}
		callOutCount++;
		//callOutHeightArray.forEach(function(d,i){ d3.select("#callOutRect" + i).attr("height" , callOutHeightArray[i]); })
		
		return;
	
	}// end function wrap()
	

	function callOuts(){
		
		$(".callOutgroups").remove();
		$(".markers").remove();
		
		var all = document.getElementsByTagName("*");
		for (var i=0, max=all.length; i < max; i++) { $(all[i]).removeClass("pulse"); }
		
		if ( calloutIndexes.length != 0 ) {
		
			calloutIndexes[viewCounter].forEach(function(d,i){
				
				var index = i;
			 	dotInfo = View1_articleIndex[d];
				
				var g = svg.append("g") 
					.attr("class" , "callOutgroups")
					.attr("id" , "callOutgroup"+i)
					.attr("transform", function(d,i){ return "translate(" + vis.xTop(dotInfo.formattedDate) + "," + (vis.yTop(1)) + ")" });
					
				g.append("line")
					.attr("class",  "callOutLines")
					.attr("id", "callOutLine" + i)
					.attr("x1", 0)
					.attr("y1", function(d,i){ return vis.yTop(callOutHeight[viewCounter][index]); })
					.attr("x2", 0)
					.attr("y2", function(d,i){ return vis.yTop(dotInfo.sentiment); })
					.style("display" , "inline")
					.style("stroke" ,/*"#FFFFFF"*/ "#FCF8DA")
					.style("stroke-width" , "3px")
					.style("display" , "inline")
					.style("opacity" , 0.0);
				
				g.append("rect")
					.attr("class" , "callOutRects")
					.attr("id" , "callOutRect" + i)
					.attr("x", -2.5)
					.attr("y", function(d,i){ return vis.yTop(callOutHeight[viewCounter][index])-d3.select(this).attr("height"); })
					.attr("width" , 225) 
					.attr("height" , 100) 
					.style("fill" ,  /*"#FFFFFF"*/ "#FCF8DA")
					.style("fill-opacity" , 1.0)
					.style("stroke" , /*"#FFFFFF"*/ "#FCF8DA")
					.style("stroke-width" , "0px")
					.style("display" , "inline")
					.style("opacity" , 0.0);			
									
				g.append("text")
					.attr("class" , "callOutTexts")
					.attr("id" , "callOutText"+i)
					.attr("x", 25)
					.attr("y", function(d,i){ return vis.yTop(callOutHeight[viewCounter][index])+15; })
					.attr("dy", ".35em")
					.attr("font-size", "14px")
					.style("display" , "inline")
					.style("opacity" , 0.0)
					.text(calloutTexts[viewCounter][index]);

				svgBottom.append("line")
					.attr("class" , "markers")
					.attr("id" , "marker" + index)
					.attr("x1", function(d,i){ return vis.xBottom(dotInfo.formattedDate); })
					.attr("y1", function(d,i){ return vis.yBottom(callOutHeightBottom[viewCounter][index]) })
					.attr("x2", function(d,i){ return vis.xBottom(dotInfo.formattedDate); })
					.attr("y2", function(d,i){ return vis.yBottom(0); })
					.style("display" , "inline")
					.style("stroke" , /*"#FFFFFF"*/ "#FCF8DA")
					.style("stroke-width" , "3px")
					.style("display" , "inline")
					.style("opacity" , 0.0);
					
				svgBottom.append("text")
					.attr("class" , "markers")
					.attr("id" , "markerLabel" + index)
					.attr("x", function(d,i){ return vis.xBottom(dotInfo.formattedDate)+10; })
					.attr("y", function(d,i){ return vis.yBottom(callOutHeightBottom[viewCounter][index]-2) })
					.style("display" , "inline")
					.style("stroke" , "none")
					.style("fill" , /*"#FFFFFF"*/ "#FCF8DA")
					.style("stroke-width" , "0px")
					.style("display" , "inline")
					.style("font-size" , "15px")
					.style("opacity" , 0.0)
					.text(dotInfo.datetime);
					
				d3.selectAll("#callOutText"+i).call(wrap, 170 , i);
		
				setTimeout(function(){
					
					d3.selectAll(".callOutRects").transition().duration(1500).style("opacity" , 1.0);
					d3.selectAll(".callOutTexts").transition().duration(1500).style("opacity" , 1.0);
					d3.selectAll(".callOutLines").transition().duration(1500).style("opacity" , 1.0);
					d3.selectAll(".callOutSVG").transition().duration(1500).style("opacity" , 1.0);
					d3.selectAll(".callOutXAxis").transition().duration(1500).style("opacity" , 1.0);
					//d3.selectAll(".thumbnails").transition().duration(1500).style("opacity" , 1.0);
					d3.selectAll(".markers").transition().duration(1500).style("opacity" , 1.0);
					$("#dot1-" + calloutIndexes[viewCounter][index]).addClass("pulse");
					$(".mainTweet").addClass("pulse");
					
					//pulse();
						
				}, 1500);
		
			})
			
		}
		
		return;
		
	}// end function callOuts();
	
	
	
	


	function pulse() {
		
		var circle; 
		
		circle = svg.selectAll(".pulse");
		
		(function repeat() {
			circle = circle.transition()
				.duration(500)
			/*	.style("stroke-width", 20) */
				.style("stroke", "#621F95")/*
				.style("fill", "#6E3AB7") */
			/*	.attr("r", 5) */
				.transition()
				.duration(500) 
			/*	.style('stroke-width', 0.5) */
				.style("stroke",  "#FFFFFF")/*
				.style("fill",  "#FFFFFF") */
			/*	.attr("r", 5) */
				.ease('sine')
				.each("end", repeat);
		})();
	}
	
	
	
	function drawLegend(){
		
		console.log("viewCounter: " + viewCounter);
		
		 var sel = d3.selectAll(".mainTweet");
		 sel.moveToFront();
		
		callOuts();
			
		d3.selectAll(".legend").remove();
	
		var legendArray = [
							 [
								[ "Tweets" , "#888888" , 10 , 0.75, 2  , "#888888" ]
							],
							 [
								[ "@BBCBreaking original tweet" , "#621F95" , 10 , 0.75 , 2 , "white" ] ,
								[ "@BBCBreaking retweets" , "#387C2B" , 10 , 0.75 , 2 , "#387C2B" ] ,
								[ "All other tweets" , "#888888" , 10 , 0.75 , 0 , "none" ]
							],
							 [
								[ "Original tweets" , "#621F95" , 10 , 0.75 , 2 , "#621F95" ], 
								[ "Retweets" , "#888888" , 10 , 0.75 , 0 , "none" ]
							],
							 [
								[ "Original tweets" , "#621F95" , 10 , 0.75 , 2 , "#621F95" ] ,
								[ "Retweets" , "#888888" , 10 , 0.75 , 0 , "none" ],
								[ "Original topic-specific tweets" , "#FF9B1F" , 10 , 0.75 , 0 , "none" ],
								[ "Topic-specific retweets" , "#FFE81F" , 10 , 0.75 , 0 , "none" ]
							]
						];
						
		var legendArrayFooter = [ false , false , false , false ];
		
		var lineCounter = 0;
			
		if ( legendArrayFooter[viewCounter] != false ) {
			
			d3.select("#svg")
				.append("text")
				.attr("class" , "legend legendTextFooters")
				.attr("id" , "legendTextFooter")
				.attr("x" , graphSpace.width-margin.top.left)
				.attr("y" , 50+(30*(lineCounter)))
				.style("fill" ,  "white")
				.style("stroke" , "none")
				.style("dy" , "1.0em")
				.style("stroke-width" , 2)
				.style("font-size" , "2.0em")
				.style("font-weight" , "bold")
				.style("text-anchor" , "end")
				.style("fill-opacity" , 0.75)
				.text(legendArrayFooter[viewCounter]);
		}
		else {
		}
		
		lineCounter++;
		
		if ( legendArray[viewCounter].length != 0 ) {
		
			legendArray[viewCounter].forEach(function(d,i){
				d3.select("#svg")
					.append("circle")
					.attr("class" , "legend legendCircles")
					.attr("id" , "legendCircle"+i)
					.attr("r" , d[2])
					.attr("cx" , graphSpace.width-margin.top.left)
					.attr("cy" , 50+(30*lineCounter))
					.style("fill" , d[1])
					.style("stroke" , d[5])
					.style("stroke-width" , d[4])
					.style("fill-opacity" , d[3]);
				
				d3.select("#svg")
					.append("text")
					.attr("class" , "legend legendTextLabels")
					.attr("id" , "legendTextLabel"+i)
					.attr("x" , graphSpace.width-margin.top.left - 25)
					.attr("y" , 50+(30*lineCounter)+(d[2]/2) ) 
					.style("fill" , "white")
					.style("stroke" , "none")
					.style("stroke-width" , 2)
					.style("font-size" , "1.0em")
					.style("font-weight" , "bold")
					.style("text-anchor" , "end")
					.style("fill-opacity" , 0.75)
					.text(d[0]);
					
					lineCounter++;
			})
		}
		
		return;
		
	}// end function drawLegend()
							
		

		
	