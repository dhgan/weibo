(function(){
    var emoji=[
        {"title": "呵呵"},
        {"title": "哈哈"},
        {"title": "吐舌"},
        {"title": "啊"},
        {"title": "酷"},
        {"title": "怒"},
        {"title": "开心"},
        {"title": "汗"},
        {"title": "泪"},
        {"title": "黑线"},
        {"title": "鄙视"},
        {"title": "不高兴"},
        {"title": "真棒"},
        {"title": "钱"},
        {"title": "疑问"},
        {"title": "阴险"},
        {"title": "吐"},
        {"title": "咦"},
        {"title": "委屈"},
        {"title": "花心"},
        {"title": "呼~"},
        {"title": "笑眼"},
        {"title": "冷"},
        {"title": "太开心"},
        {"title": "滑稽"},
        {"title": "勉强"},
        {"title": "狂汗"},
        {"title": "乖"},
        {"title": "睡觉"},
        {"title": "惊哭"},
        {"title": "升起"},
        {"title": "惊讶"},
        {"title": "喷"},
        {"title": "爱心"},
        {"title": "心碎"},
        {"title": "玫瑰"},
        {"title": "礼物"},
        {"title": "彩虹"},
        {"title": "星星月亮"},
        {"title": "太阳"},
        {"title": "钱币"},
        {"title": "灯泡"},
        {"title": "茶杯"},
        {"title": "蛋糕"},
        {"title": "音乐"},
        {"title": "haha"},
        {"title": "胜利"},
        {"title": "大拇指"},
        {"title": "弱"},
        {"title": "OK"}
    ];
    for(var i=1;i<=50;i++){
        if(i<10) i="0"+i;
        emoji[i-1].url="./imgs/emoji/i_f"+i+".png";
    }
    function createObjectURL(blob) {
        if(window.URL){
            return window.URL.createObjectURL(blob);
        } else if(window.webkitURL){
            return window.webkitURL.createObjectURL(blob);
        } else {
            return null;
        }
    }

    (function () {
        var $navUserHead=$("#navUserHead");
        var navTimer;
        $navUserHead.on("mouseover", function () {
            if(navTimer) clearTimeout(navTimer);
            $(this).find(".nav_set").show();
        });
        $navUserHead.on("mouseout", function () {
            var _this=$(this);
            navTimer=setTimeout(function () {
                _this.find(".nav_set").hide();
            }, 1000);
        })
    })();

    $.fn.clipImg=function() {
        if(!this[0]) return;
        var imgW=this[0].naturalWidth;
        var imgH=this[0].naturalHeight;
        var constW=this.parent().width();
        var oImg=imgH<=imgW?{"l":imgW, "t": "width", "o": imgH}
            :{"l":imgH, "t": "height", "o": imgW};
        if(oImg["l"]>constW){
            var clip=Math.abs(imgH-imgW)/2*constW/oImg['o'];
            if(oImg['t']=="width"){
                this.css({
                    "width": "auto",
                    "height": constW,
                    "margin-left":  -clip

                });
            } else{
                this.css({
                    "width": constW,
                    "height": "auto",
                    "margin-top":  -clip

                });
            }
        }
    }
    //检测微博字数
    $.fn.msgTxtDetect=function(option){
        if(!this[0]) return;
        var defaults={
            maxLength: 140
        }
        var opts=$.extend({}, defaults, option);
        var $this=$(this);
        function detectLength(){
            var $msgTxt=$this.find(".msgTxt");
            autoHeight.call($msgTxt[0]);
            var val=$msgTxt.val().trim();
            var length=val.length;
            var i, total=0;
            for(i=0;i<length;i++){
                total+=val.charCodeAt(i)>255?1:0.5;
            }
            var left=Math.floor(opts.maxLength-total);
            var btn=$this.find(".msgSend input:submit");
            var msgTips=$this.find(".msgSend strong");
            if(left<0){
                msgTips.addClass("red");
                btn.attr("disabled","disabled")
                    .addClass("disabled");
            }else{
                msgTips.removeClass("red");
                btn.removeAttr("disabled")
                    .removeClass("disabled");
                if(left===defaults.maxLength){
                    btn.attr("disabled","disabled")
                        .addClass("disabled");
                }
            }
            msgTips.text(left).attr("data-msg-length", total);
        };
        $this.delegate(".msgTxt","input", detectLength);
        if(window.VBArray && window.addEventListener){
            $this.delegate(".msgTxt","keyup", function(e){
                var key=e.keyCode;
                (key==8||key==46)&&detectLength();
            })
            $this.delegate(".msgTxt","cut", detectLength);
        }
    }

    $.fn.msgBoxEvent=function(){
        if(!this[0]) return;
        var updatePhoto=[];
        /*var _this=$(this);*/
        var _this=this;
        _this.msgTxtDetect();
        _this.delegate(".emojiSet","click", function (e) {
            var target=e.target;
            if(target.tagName.toLowerCase()==="a"){
                var $msgTxt=_this.find(".msgTxt");
                var msg=$msgTxt.val();
                $msgTxt.val(msg+"["+target.parentNode.title+"]")
                    .trigger("input");
            }
        });
        _this.delegate(".msgPhotoAdd","change",function(){
            var $this=$(this);
            var file=this.files[0];
            var url=createObjectURL(file);
            $this.val("");
            var type=file.type.toLowerCase();
            if (!(type==="image/jpg"||type==="image/gif"||type==="image/jpeg"||type==="image/png")){
                alertMsg("文件格式错误，图片只能为JPG、GIF、JPEG、PNG格式", _this, "error");
                return;
            }else  if(file.size/1024>=10240){
                alertMsg("文件大小不能大于10m");
                return;
            }else if(updatePhoto.length==9){
                alertMsg("图片数量不能超过9张");
                return;
            }
            var imgY=new Image();
            imgY.onload=function(){
                var $img=$("<img />",{"src": url});
                var $div=$("<div></div>");
                $div.append($img);
                var $icon=$("<span></span>",{class: "msgPhotoDel"});
                $div.append($icon);
                _this.find(".msgPhotoShow").append($div);
                $img.clipImg();
                updatePhoto.push(file);
                $this.val("");
                _this.find(".msgPhotoShow").height(Math.ceil(updatePhoto.length/5)*116);
            };
            imgY.src=url;
        });
        _this.delegate(".msgPhotoShow","click",function(e){
            var target=e.target;
            if(target.className==="msgPhotoDel"){
                var $msgPhotoList=$(target.parentNode)[0];
                var i=$(this).find("div").index($msgPhotoList);
                $msgPhotoList.remove();
                updatePhoto.splice(i,1);
                $(this).height(Math.ceil(updatePhoto.length/5)*116);
            }
        });
        _this.delegate(".msgSend input:submit","click",function () {
            var msgLength=_this.find(".msgSend strong").data("msg-length");
            if(msgLength>0&&msgLength<=140){
                var msg=_this.find(".msgTxt").val().trim();
                msg=msg.replace(/\n/g," ");
                var formData=new FormData();
                msg=FilterXSS(msg);
                formData.append("message", msg);
                updatePhoto.forEach(function(value, index){
                    formData.append("photo"+index, value);
                });
                /* ajax上传如果成功则将msgTxt清 */
                $.ajax({
                    type: "post",
                    url: "",
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function (e) {
                        alertMsg("发表成功", _this, "success");
                        var info={
                            type: "msgList",
                            userLink: "#",
                            msgListTime: "18:35",
                            userHead: "./imgs/head.png",
                            userName: "GDH",
                            msgInfo: "2号中午12点开拍，我家货对于挑剔的人都说都有瑕疵，都存在不可以接受的范围。老粉都是看不到瑕疵的那种。所以新粉请一定要看清楚哦！如果你是一丝不苟的人，求放过！小店铺，么有退货服务！还有就是耐克的这款运动鞋，快点买起来再不减肥怎么对得起7,8月",
                            msgTitle: "<h2>每个人都有的白T恤，但我就是穿的比你美！</h2>",
                            msgReply: "柳岩不哭，强烈要求大国文化道歉#大国文化给柳岩道歉#",
                            msgLink: "javascript:",
                            msgPhotoNum: 5,
                            msgPhoto: [
                                e,e,e,e,e,e,e
                            ],
                            msgLike: 55,
                            msgComment: 2
                        };
                        info.msgInfo=msg;
                        updatePhoto=[];
                        _this.find(".msgPhotoShow").empty().height(0);
                        _this.find(".msgTxt").val("").trigger("input");
                    },
                    error: function () {

                    }
                })
            }
        });
    }
    function autoHeight() {
        var $other=$(this).parent().find(".autoHeightClone");
        if($other.length<=0){
            $other=$(this).clone();
            $other.addClass("autoHeightClone")
                .appendTo($(this).parent());
            $other.css({
                "min-height": 0,
                "height": 0,
                "visibility": "hidden",
                "position":"absolute",
                "width": $(this).outerWidth(),
                "top": 0
            });
        }
        $other.val(this.value);
        $(this).innerHeight($other[0].scrollHeight);
    }
    /*create msgBox*/
    function createMsgBox() {
        var $msgBox=$("<div class='msgBox'></div>");
        $("<textarea class='msgTxt' name='msgTxt'></textarea>").appendTo($msgBox);
        var $msgTool=$("<div class='msgTool clearfix'></div>");
        $("<div class='msgPhotoShow clearfix'></div>").appendTo($msgTool);
        var $msgAdd=$("<ul class='msgAdd'></ul>");
        var $msgEmoji=$("<li class='msgEmoji'></li>");
        var $emojiSet=$("<ul class='emojiSet'></ul>");
        $("<i>&nbsp;</i><span>表情</span>").appendTo($msgEmoji);
        emoji.forEach(function (value) {
            $("<li title='"+value['title']+"'><a href='javascript:;'></a></li>")
                .appendTo($emojiSet);
        });
        $emojiSet.appendTo($msgEmoji);
        $msgEmoji.appendTo($msgAdd);
        $("<li class='msgPhoto'>" +
            "<i>&nbsp;</i><span>照片</span>" +
            "<input type='file' name='msgPhoto' class='msgPhotoAdd' accept='image/gif,image/jpeg,image/jpg,image/png'> " +
            "</li>").appendTo($msgAdd);
        $msgAdd.appendTo($msgTool);
        var $msgSend=$("<div class='msgSend'></div>");
        $("<strong>140</strong>" +
            "<input type='submit' value='发表' class='disabled' disabled='disabled'>")
            .appendTo($msgSend);
        $msgSend.appendTo($msgTool);
        $msgTool.appendTo($msgBox);
        $msgBox.msgTxtDetect();
        return $msgBox;

    }
    function createNavMsgBox() {
        var $pop=$("#gdh-msg");
        if($pop.length){
            $pop.show();
        } else{
            $pop=$("<div id='gdh-msg'></div>");
            var $popMsgBox=$("<div class='popMsgBox'></div>");
            var $msgHead=$("<div class='msgHead'>" +
                "<h3>有什么想说的吗</h3>" +
                "<i></i> </div>");
            $msgHead.appendTo($popMsgBox);
            var $newS=createMsgBox();
            $newS.msgBoxEvent();
            $newS.delegate(".msgEmoji", "click", function (e) {;
                e.stopPropagation();
                e.returnValue=false;
                $(this).find(".emojiSet").show();
            });
            $(window).on("click", function () {
                $newS.find(".msgEmoji .emojiSet").hide();
            });
            $newS.appendTo($popMsgBox);
            var $shadowBox=$("<div class='shadowBox'></div>");
            $shadowBox.on("click", function () {
                $pop.hide();
            });
            $popMsgBox.delegate(".msgHead i", "click", function () {
                $pop.hide();
            });
            dragDrop($popMsgBox, $msgHead);
            $shadowBox.appendTo($pop);
            $popMsgBox.appendTo($pop);
            $pop.appendTo($("body"));
        }
    }
    $("#nav-write").bind("click",function () {
        createNavMsgBox();
    });
    function dragDrop($target,$dragUtil) {
        var disX, disY, flag=false;
        $dragUtil.on("mousedown", function (e) {
            e.returnValue=false;
            e.stopPropagation();
            e.preventDefault();
            disX=$target.offset().left-e.pageX;
            disY=$target.offset().top-e.pageY;
            flag=true;
            if($dragUtil.setCapture) {
                $dragUtil.setCapture();
            }
        });
        function mousemove(e) {
            e.returnValue=false;
            e.stopPropagation();
            if(flag){
                $target.offset({
                    "left": (disX+e.pageX),
                    "top": (disY+e.pageY)
                });
            };
        }
        function mouseup(e) {
            e.returnValue=false;
            e.stopPropagation();
            flag=false;
            if(document.releaseCapture){
                document.releaseCapture();
            }
        }
        $(document).on("mousemove", mousemove);
        $(document).on("mouseup", mouseup);
    }

    function alertMsg(tips, $relative, type) {
        var src="./imgs/icon/success.png";
        if(type=="error") src="./imgs/icon/error.png";
        var $tips=$relative.siblings(".tips");
        if($tips.length>0) $tips.remove();
        $tips= $("<div class='tips'></div>");
        $tips.html("<img src='"+src+"'>"+tips)
            .appendTo($relative.parent())
            .ready(function () {
                $tips.css({
                    "top": $relative.offset().top-$(window).scrollTop()+$relative.outerHeight()/2,
                    "left": $relative.offset().left-$(window).scrollLeft()+$relative.outerWidth()/2,
                    "margin-left": -$tips.outerWidth()/2,
                    "margin-top": -$tips.outerHeight()/2,
                    "visibility": "visible"
                });
            });
        setTimeout(function () {
            $tips.remove();
        },1500);
    }
    function loadImg($relative) {
        var src="./imgs/icon/load.png";
        var $tips= $("<div class='imgLoad'></div>");
        $tips.html("<img src='"+src+"'>")
            .appendTo($relative.parent())
            .ready(function () {
                $tips.css({
                    "top": $relative.offset().top-$(window).scrollTop()+$relative.outerHeight()/2,
                    "left": $relative.offset().left-$(window).scrollLeft()+$relative.outerWidth()/2,
                    "margin-left": -$tips.outerWidth()/2,
                    "margin-top": -$tips.outerHeight()/2,
                    "visibility": "visible"
                });
            });
        return $tips;
    }
    $.fn.clipHeadEvent=function () {
        var $clipInput=this.find(".clipInput input"),
            $img=this.find(".clipImg img"),
            $imgDemo=this.find(".imgDemo img"),
            canvas,
            size,
            $jcrop,
            context;
        function imgDemo() {
            var clipSize=this.tellSelect();
            var h=clipSize.h,
                w=clipSize.w,
                x=clipSize.x,
                y=clipSize.y;
            if(canvas.getContext){
                var scale=$img[0].naturalWidth/size[0];
                context.drawImage($img[0],x*scale,y*scale,w*scale,h*scale,0,0,200,200);
                $imgDemo[0].src=canvas.toDataURL("image/png", 0.91);
            }
        }
        $clipInput.on("change", function () {
            var img=this.files[0];
            var type=img.type.toLowerCase();
            if (!(type==="image/jpg"||type==="image/gif"||type==="image/jpeg"||type==="image/png")){
                alertMsg("文件格式错误，图片只能为JPG、GIF、JPEG、PNG格式", $(this).parent().parent(), "error");
                return;
            }else if(img.size/1024>=5120){
                alertMsg("图片大小不能大于5M", $(this).parent().parent(), "error");
                return ;
            }
            $img[0].src=createObjectURL(img);
            $img.on("load", function () {
                var nW=this.naturalWidth,
                    nH=this.naturalHeight;
                if(nW>nH){
                    $(this).css({
                        "width": 360,
                        "height": "auto",
                        'margin-top': (360-nH)/2
                    });
                } else{
                    $(this).css({
                        "width": "auto",
                        "height": 360,
                        'margin-left': (360-nW)/2
                    });
                }
                if($jcrop) $jcrop.destroy();
                $(this).Jcrop({
                    aspectRatio: 1 / 1,
                    minSize: [50,50],
                    onSelect: imgDemo,
                    allowSelect: false
                }, function () {
                    $jcrop=this;
                    this.ui.holder.css({
                        "margin": (360-this.ui.holder.height())/2+"px auto"
                    });
                    canvas=$("<canvas width='200' height='200'></canvas>")[0];
                    context=canvas.getContext("2d");
                    size=this.getWidgetSize();
                    var s=size[0]>size[1]?size[1]:size[0];
                    this.setSelect([(size[0]-s/2)/2,(size[1]-s/2)/2,s/2+(size[0]-s/2)/2,s/2+(size[1]-s/2)/2]);
                });
            })
        })
    }
    function createClip() {
        var $clipHead=$("<div class='clipHead clearfix'></div>");
        $clipHead.html('<div class="clipInput">' +
                '<a href="javascript:;">选择图片</a>' +
                '<input type="file" name="head" accept="image/gif,image/jpeg,image/jpg,image/png">' +
                '<span>预览</span>' +
            '</div>' +
            '<div class="clipImg">' +
                '<img src="">' +
            '</div>' +
            '<div class="imgDemo">' +
                '<img src="./imgs/head.png">' +
            '</div>');
        return $clipHead;
    }
    function createClipHead() {
        var $pop=$("#gdh-head");
        if($pop.length){
            $pop.show();
        } else{
            $pop=$("<div id='gdh-head'></div>");
            var $popMsgBox=$("<div class='popMsgBox'></div>");
            var $msgHead=$("<div class='msgHead'>" +
                "<h3>头像设置</h3>" +
                "<i></i> </div>");
            $msgHead.appendTo($popMsgBox);
            createClip()
                .appendTo($popMsgBox)
                .clipHeadEvent();
            var $msgPublish=$("<a href='javascript:;' class='msgPublish'>确定</a>");
            $("<div class='msgFooter'></div>")
                .append($msgPublish)
                .appendTo($popMsgBox);
            var flag=0;
            $msgPublish.on("click", function () {
                if(flag) return;
                if($popMsgBox.find(".clipImg img").eq(0).attr("src")===""){
                    alertMsg("请选择图片", $popMsgBox, "error");
                    return;
                }
                flag=1;
                var $tips=loadImg($popMsgBox.find('.clipImg').eq(0));
                var formData=new FormData();
                var data=$popMsgBox.find(".imgDemo img").eq(0).attr("src");
                data=data.split(',')[1];
                data=window.atob(data);
                var ia = new Uint8Array(data.length);
                for (var i = 0; i < data.length; i++) {
                    ia[i] = data.charCodeAt(i);
                };
                var blob=new Blob([ia], {type:"image/png"});
                console.log(blob);
                formData.append("img", blob);
                $.ajax({
                    type: "post",
                    url: "test.php",
                    data: formData,
                    processData: false,
                    contentType: false
                }).done(function (e) {
                    $tips.remove();
                    flag=0;
                    console.log(e);
                    alertMsg("修改成功", $popMsgBox, "success");
                }).fail(function () {
                    $tips.remove();
                    flag=0;
                    alertMsg("修改失败", $popMsgBox, "error");
                });
            });
            dragDrop($popMsgBox, $msgHead);
            var $shadowBox=$("<div class='shadowBox'></div>");
            $shadowBox.on("click", function () {
                $pop.hide();
            });
            $popMsgBox.delegate(".msgHead i", "click", function () {
                $pop.hide();
            });
            $shadowBox.appendTo($pop);
            $popMsgBox.appendTo($pop);
            $pop.appendTo($("body"));
        }
    }
    // createClipHead();
})();
