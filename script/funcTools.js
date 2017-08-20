/**
 **@系统使用方法
 **@字符串转码、特殊字符过滤等方法
 */
var utilsFuncs = {
	//将unicode编码转换为中文
	tranUnicode2Chn : function(str){
		if(arguments.length>0){
//			return unescape(str.replace(/&#x/g, '%u').replace(/;/g, ''));
			return unescape(str.replace(/\\/g,"%"));
		}else{
			return null;
		}
	},

	REGX_HTML_ENCODE : /"|&|'|<|>|[\x00-\x20]|[\x7F-\xFF]|[\u0100-\u2700]/g,
	REGX_HTML_DECODE : /&\w+;|&#(\d+);/g,
	REGX_TRIM : /(^\s*)|(\s*$)/g,
	HTML_DECODE : {
        "&lt;" : "<", 
        "&gt;" : ">", 
        "&amp;" : "&", 
        "&nbsp;": " ", 
        "&quot;": "\"", 
        "©": "",
        "&iexcl;":"?","&laquo;":"?","&not;":"?",
        "&lsquo;":"‘","&rsquo;":"’","&sbquo;":"‚",
        "&ldquo;":"“","&rdquo;":"”"
    },
	encodeHtml : function(s){
        s = (s != undefined) ? s : '';
        return (typeof s != "string") ? s :
            s.replace(this.REGX_HTML_ENCODE, 
                      function($0){
                          var c = $0.charCodeAt(0), r = ["&#"];
                          c = (c == 0x20) ? 0xA0 : c;
                          r.push(c); r.push(";");
                          return r.join("");
                      });
    },
	decodeHtml : function(s){
        var HTML_DECODE = this.HTML_DECODE;

        s = (s != undefined) ? s : '';
        return (typeof s != "string") ? s :
            s.replace(this.REGX_HTML_DECODE,
                      function($0, $1){
                          var c = HTML_DECODE[$0];
                          if(c == undefined){
                              // Maybe is Entity Number
                              if(!isNaN($1)){
                                  c = String.fromCharCode(($1 == 160) ? 32:$1);
                              }else{
                                  c = $0;
                              }
                          }
                          return c;
                      });
    },

    //替换所有的回车换行
	replaceRN : function(content){
		var string = content;
		try{
			string=string.replace(/\r\n/g, "<br />")
	    	string=string.replace(/\n/g, "<br />");
		}catch(e) {
			alert(e.message);
		}
		return string;
	},
	
	trimStr: function(str){
		if(str==null || str==''){
			return '';
		}else{
			return str;
		}
	},
	rand6: function(){ 
		var randStr="";
		for(var i=0;i<6;i++){ 
			randStr+= Math.floor( Math.random()* 10); 
		}

		return randStr;
	},
	toastNetErr: function(errCode){
		var errMsg= '网络连接异常，请稍后再试';
		
		if(errCode!=null && errCode!=""){
			errMsg+= '('+ errCode+ ')';
		}
		api.toast({
		    msg: errMsg,
		    duration: 2000,
		    location: 'middle'
		});
	},
	limitStrLength: function(str, len){
		if(null==str || ""==str || isNaN(parseInt(len))){
			return "";
		}
		var rsStr= str.substr(0, len-3)+ '...';
		return rsStr;
	},
	dateDiff: function(hisTime,nowTime){
        var now =nowTime?nowTime:new Date().getTime(),
            diffValue = now - hisTime,
            result='',
            minute = 1000 * 60,
            hour = minute * 60,
            day = hour * 24,
            halfamonth = day * 15,
            month = day * 30,
            year = month * 12,

            _year = diffValue/year,
            _month =diffValue/month,
            _week =diffValue/(7*day),
            _day =diffValue/day,
            _hour =diffValue/hour,
            _min =diffValue/minute;

            if(_year>=1) result=parseInt(_year) + "年前";
            else if(_month>=1) result=parseInt(_month) + "个月前";
            else if(_week>=1) result=parseInt(_week) + "周前";
            else if(_day>=1) result=parseInt(_day) +"天前";
            else if(_hour>=1) result=parseInt(_hour) +"个小时前";
            else if(_min>=1) result=parseInt(_min) +"分钟前";
            else result="刚刚";
            return result;
    },
    openUrlInBrowser: function(url){
		if(url==null || url==""){
			return ;
		}
	
		if('ios'== api.systemType){
			api.openApp({
				iosUrl: url,
				appParam: {}
			});
		}else if('android'== api.systemType){
			api.openApp({
			    androidPkg: 'android.intent.action.VIEW',
			    mimeType: 'text/html',
			    uri: url
			},function(ret,err){});
		}
    },
    closeTag: 'false',
    closeAppMonitor: function(){
		api.addEventListener({
		    name:'keyback'
		},function(ret,err){
			if(utilsFuncs.closeTag=='false'){
				utilsFuncs.closeTag='true';

				setTimeout("utilsFuncs.closeTag='false'", 2000);
				api.toast({
				    msg: '再次点击退出',
				    duration:2000,
				    location: 'middle'
				});
			}else if(utilsFuncs.closeTag=='true'){
				api.closeWidget({silent:true});
			}
		});
    },
    setNightTime: function(linkTagId, tag){
    	var linkObj= document.getElementById(linkTagId);
    	if(null!= linkObj && ""!=linkObj){
    		if(tag==1){
    			linkObj.setAttribute('href', '../css/nightStyle.css');
    		}else{
	    		linkObj.setAttribute('href', '');
    		}
    	}
    }
};
/**
 **@系统使用前台方法
 */
//返回上一层
function goBack() {
	api.closeWin();
}
//弹出评论框(剧目、详情等)
function showBox() {
	$(".shadowBg").css('display', 'block');
}
//关闭评论框(剧目、详情等)
function hideBox() {
	$(".shadowBg").css('display', 'none');
}

//计算保留2位小数
function getNumber(number) {
	var bb = number + "";
	var dian = bb.indexOf('.');
	var result = "";
	if (dian == -1) {
		result = number.toFixed(2);
	} else {
		var cc = bb.substring(dian + 1, bb.length);
		if (cc.length >= 3) {
			result = (Number(number.toFixed(2)) + 0.01);
		} else {
					result = number.toFixed(2);
		}
	}
	return result;
}

//剧目详情跳转(获取剧目详情)
function showReper(Id, Name, Pic, isSeatFlag, isSaleFlag, Address, isCollect) {
	api.openWin({
		name : 'commonHomeReper'+Id,
		url : 'win_commonHomeTitle.html',
		pageParam : {
			bannerName : 'reperDetail'+Id,
			bannerTitle : '剧目详情',
			bannerTag : 'reperDetail',
			bannerUrl : 'frm_reperDetail.html',
			reperId : Id,
			reperName : Name,
			reperBgPic : Pic,
			reperAddress : Address,
			isSeatFlag : isSeatFlag,
			isSaleFlag : isSaleFlag,
			isCollect : isCollect
		},
		bounces : false,
		vScrollBarEnabled : false,
		hScrollBarEnabled : false,
		delay : 200,
		reload : true
	});
}

//新闻资讯详情页跳转(获取新闻详情)
function showNew(Id, Num,isCollect) {
	api.openWin({
		name : 'commonHomeNews'+Id,
		url : 'win_commonHomeTitle.html',
		pageParam : {
			bannerName : 'newsDetail'+Id,
			bannerTitle : '新闻详情',
			bannerTag : 'newsDetail',
			bannerUrl : 'frm_newsDateil.html',
			infoId : Id,
			reviewNum : Num,
			isCollect : isCollect
		},
		bounces : false,
		vScrollBarEnabled : false,
		hScrollBarEnabled : false
	});
}

//跳转评论列表
function openReviewList() {
	api.openWin({
		name : 'commonUserReview',
		url : 'win_commonHomeTitle.html',
		pageParam : {
			bannerName : 'review',
			bannerTitle : '评论列表',
			bannerTag : 'reviewList',
			bannerUrl : 'frm_reviewList.html',
			infoId : api.pageParam.infoId,
			isCollect : api.pageParam.isCollect
		},
		bounces : false,
		vScrollBarEnabled : false,
		hScrollBarEnabled : false,
		delay : 200,
		reload : true
	});
}

//获取评论列表(剧目评论列表、新闻资讯评论列表 剧目是10、新闻是3)
function getReview(reviewType) {
	var getReviewUrl = ajaxAgent.serverAction + '/app/index/getReview';
	getReviewUrl += '?currentPage=' + page + '&pageSize=10&rdnum=' + Math.random();
	if(10 == reviewType){
		var infoId = api.pageParam.reperId;
	}else{
		var infoId = api.pageParam.infoId;
	}
	api.showProgress();
	api.ajax({
		url : getReviewUrl,
		method : 'get',
		timeout : 50,
		dataType : 'json',
		returnAll : false,
		data : {
			values : {
				reviewType : reviewType,
				infoId : infoId
			}
		}
	}, function(ret, err) {
		if (ret.hot_list) {
			//暂无数据
			if ((0 == ret.hot_list.length ) && (1 == page)) {
				$(".commentsUL").html('<p style="text-align: center;">暂无数据！</p>');
				return false;
			} else if ((0 == ret.hot_list.length ) && (1 != page)) {
				api.toast({
					msg : '没有更多地数据了',
					duration : 1000,
					location : 'middle'
				});
				return false;
			} else {
				var reviewHtml = '';
				$.each(ret.hot_list, function(i, val) {
					reviewHtml += '<li><div class="commentsTitle"><em><img src="' + val.reviewHead + '"></em><span>' + val.userName + '</span><div class="time">' + val.reviewDate + '</div></div><div class="commentsContent">' + val.reviewContent + '</div></li>';
				});
				if (page == 1) {
					$(".commentsUL").html(reviewHtml);
				} else {
					$(".commentsUL").append(reviewHtml);
				}
			}
		}
	});
	api.parseTapmode();
	api.hideProgress();
}


//提交评论(评论剧目、评论新闻资讯 剧目是10、新闻是3)
function setAddSubmit(reviewType) {
	var page = 1;
	var userEntity = sessionAgent.getLoginInfo();
	var userId = userEntity.userId;
	//判断用户是否登录不登录不能评论
	if (sessionAgent.checkUserId()) {
		var reviewContent = $("#reviewContent").val();
		if(("" == reviewContent) || (200 < reviewContent.length)){
			api.toast({
				msg : '请输入200字以内的评论内容',
				duration : 1000,
				location : 'middle'
			});
			return false;
		}
		//提交评论到服务器
		var setReviewUrl = ajaxAgent.serverAction + '/app/index/addReview';
		if(10 == reviewType){
			var infoId = api.pageParam.reperId;
		}else{
			var infoId = api.pageParam.infoId;
		}
		api.showProgress();
		api.ajax({
			url : setReviewUrl,
			method : 'post',
			timeout : 50,
			dataType : 'json',
			returnAll : false,
			data : {
				values : {
					infoId : infoId,
					userId : userId,
					reviewType : reviewType,
					reviewContent : reviewContent
				}
			}
		}, function(ret, err) {
			//发表成功
			if (1 == ret.result) {
				api.alert({msg : '评论成功'});
				hideBox();
				//发表评论成功后刷新评论列表
				getReview(reviewType);
				/*
				if(3 == reviewType){
					openReviewList();
				}
				*/
				
			//发表失败
			} else if (0 == ret.result) {
				api.alert({
					msg : ret.msg
				});
			} else {
				api.alert({
					msg : '评论失败'
				});
			}
		});
		api.hideProgress();
	}
}

/***@系统个人中心使用方法***/

var ajaxAgent = {
	//用户个人中心
	//serverAction : 'http://192.168.11.58:8080',
	serverAction : 'http://www.wenhuawh.com', 
	androidAppDownloadUrl: 'http://www.baidu.com'
};
//个人中心跳转
function  loadUserIndex(){
	api.openWin({
		name : 'win_userIndex',
		url : 'win_userIndex.html',
		bounces : false,
		vScrollBarEnabled : false,
		hScrollBarEnabled : false,
		reload : true
	});  
} 
//个人中心验证
var validFuncs = {
	checkCellPhone: function(arg){
		var Pattern=/^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/i;
		if(Pattern.test(arg)==false){
			api.toast({
			    msg: '请输入正确的手机号码',
			    duration: 1000,
			    location: 'middle'
			});
			return false;
		}else{
			return true;
		}
	},

	checkNull: function(arg){
		if(arg!=null && arg!=""){
			return true;
		}else{
			api.toast({
			    msg: '请填写完整信息',
			    duration: 1000,
			    location: 'middle'
			});
			return false;
		}
	},

	checkRepwd: function(){
		var pwd1 = $("#password").val();
		var pwd2 = $("#repassword").val();
		if(pwd1==pwd2){
			return true;
		}else{
			api.toast({
			    msg: '请确保两次密码一致',
			    duration: 1000,
			    location: 'middle'
			});
			return false;
		}
	},
	
	checkYZM: function(arg){
		var applyCode = $("#applyCode").val();
		if(applyCode != '' && applyCode == arg){
			return true;
		}else{
			api.toast({
				msg: '验证码不正确',
				duration: 1000,
				location: 'middle'
			});
			return false;
		}
	}	
};

//初始化用户昵称
function setUserNickName(nickName) {
	if (nickName == null || nickName == '')
		$("#userNickName").html('');
	else
		$("#userNickName").html(nickName);
}
//初始化用户头像
function setUserIcon(userIcon,userPoints) {
	if (userIcon == null || userIcon == "")
		userIcon = '../image/portrait.png';
	$("#userIcon").attr('src', userIcon);
	$("#userPoints").text('积分：'+userPoints);
}


/***@系统支付方式***/

//@支付宝支付
function payByAliPay(tradeNO,amount,orderTypeName){
	var aliPay = api.require('aliPay');
	aliPay.pay({
		subject : '会员充值',
		body : '用户账户充值',
		amount : amount,
		tradeNO : tradeNO
	}, function(ret2, err2) {
		if (ret2.code == '9000') {
			api.alert({
				msg : orderTypeName+'成功！'
			});
		} else{ 
			if (ret2.code == '6001') {
				api.alert({
					msg : '取消支付'
				});
			}else { 
				api.alert({
					msg : '商户配置错误'
				});
			}
		}
	});
}

//@微信支付
function payByWeixin(tradeNO,amount,orderTypeName){
		var notifyURL="http://www.wenhuawh.com/business/alipay/toNotify_url"; 
		var wxPay = api.require('wxPay');
		wxPay.config({
			apiKey : 'wx295b94ede1397a7c',
			mchId : '1303257001',
			partnerKey : '1a2b3c4d5e6f7g8h9i10jwenhuawuhan',
			notifyUrl : notifyURL
		}, function(ret, err) {
		   if(ret ){ 
			if (ret.status) { 
				wxPay.pay({
					description : orderTypeName,
					detail : orderTypeName,
					totalFee : (amount) * 100,
					tradeNo : tradeNO
				}, function(ret2, err2) {  
					if (ret2.status) { 
						api.alert({
							msg : orderTypeName+'成功！'

						});
						 
					} else{  
						 if (err2.code =='-2') { 
							api.alert({
								msg : '取消支付'
							});
						}else { 
							api.alert({
								msg : '商户配置错误'
							});
						}
					}  
			});
		}
	  }
	  else{
	    alert('支付失败！'); 
	  }
	  
	});
}
