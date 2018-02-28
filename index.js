var perPageCount = 10,
	curPage = 1,
	colHeight = [],
	timeId = null;
 loadImg();

$(window).on("scroll",function(){
	clearTimeout(timeId);

	timeId = setTimeout(function(){
		checkShow($("#load"));
	},300);
	
})

function loadImg(){
	$.ajax({
		url: 'http://platform.sina.com.cn/slide/album_tech',
		dataType: 'jsonp',
		jsonp: "jsoncallback",
		data: {
			app_key: '1271687855',
			num: perPageCount,
			page: curPage
		},
		success: function(ret){
			if(ret.status.code == 0){
				console.log(123);
				var $node = renderData(ret.data);				
				render($node); 
				curPage++;
			}
		}
	});
}

function isShow($el){
	var winH = $(window).height(),
		scrollH = $(window).scrollTop(),
		top = $el.offset().top;
	if(top < winH + scrollH){
		return true;
	}else{
		return false;
	}	
}

function checkShow($el){
	if(isShow($el)){
		loadImg();
	}
}

function renderData(data){
	var tpl = "";
	$(data).each(function(){
		tpl += '<li class="item">';
		tpl += '<a class="link" href="'+this.url+'">'; 
		tpl += '<img src="'+this.img_url+'">';
		tpl += '</a>';
		tpl += '<h4 class="header">'+this.short_name+'</h4>';
		tpl += '<p class="desp">'+this.short_intro+'</p>';
		tpl += '</li>';
	});
	var $node = $(tpl);	
	$("#pic-ct").append($node);
	return $node;
}

function render($node){
	var nodeWidth = $(".item").outerWidth(true);
	var colNum = parseInt($("#pic-ct").width()/nodeWidth);
	if(colHeight.length == 0){
		for(var i=0;i<colNum;i++){
			colHeight.push(0);
		}
	}

	$node.each(function(){
		var $cur = $(this);
		$(this).find("img").on("load",function(){
			var idx = 0;
				minSumHeight = colHeight[0];
			for(var i=0;i<colHeight.length;i++){
				if(colHeight[i] < minSumHeight){
					minSumHeight = colHeight[i];
					idx = i;
				}
			}
			$cur.css({
				top: minSumHeight,
				left: nodeWidth * idx,
				opacity: 1
			});
			colHeight[idx] += $cur.outerHeight(true);
		});
	});
}
