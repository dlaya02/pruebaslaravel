

window.google = window.google || {};
google.maps = google.maps || {};
(function() {
  
  function getScript(src) {
    document.write('<' + 'script src="' + src + '"><' + '/script>');
  }
  
  var modules = google.maps.modules = {};
  google.maps.__gjsload__ = function(name, text) {
    modules[name] = text;
  };
  
  google.maps.Load = function(apiLoad) {
    delete google.maps.Load;
    apiLoad([0.009999999776482582,[[["https://mts0.googleapis.com/vt?lyrs=m@322000000\u0026src=api\u0026hl=en-US\u0026","https://mts1.googleapis.com/vt?lyrs=m@322000000\u0026src=api\u0026hl=en-US\u0026"],null,null,null,null,"m@322000000",["https://mts0.google.com/vt?lyrs=m@322000000\u0026src=api\u0026hl=en-US\u0026","https://mts1.google.com/vt?lyrs=m@322000000\u0026src=api\u0026hl=en-US\u0026"]],[["https://khms0.googleapis.com/kh?v=184\u0026hl=en-US\u0026","https://khms1.googleapis.com/kh?v=184\u0026hl=en-US\u0026"],null,null,null,1,"184",["https://khms0.google.com/kh?v=184\u0026hl=en-US\u0026","https://khms1.google.com/kh?v=184\u0026hl=en-US\u0026"]],null,[["https://mts0.googleapis.com/vt?lyrs=t@132,r@322000000\u0026src=api\u0026hl=en-US\u0026","https://mts1.googleapis.com/vt?lyrs=t@132,r@322000000\u0026src=api\u0026hl=en-US\u0026"],null,null,null,null,"t@132,r@322000000",["https://mts0.google.com/vt?lyrs=t@132,r@322000000\u0026src=api\u0026hl=en-US\u0026","https://mts1.google.com/vt?lyrs=t@132,r@322000000\u0026src=api\u0026hl=en-US\u0026"]],null,null,[["https://cbks0.googleapis.com/cbk?","https://cbks1.googleapis.com/cbk?"]],[["https://khms0.googleapis.com/kh?v=88\u0026hl=en-US\u0026","https://khms1.googleapis.com/kh?v=88\u0026hl=en-US\u0026"],null,null,null,null,"88",["https://khms0.google.com/kh?v=88\u0026hl=en-US\u0026","https://khms1.google.com/kh?v=88\u0026hl=en-US\u0026"]],[["https://mts0.googleapis.com/mapslt?hl=en-US\u0026","https://mts1.googleapis.com/mapslt?hl=en-US\u0026"]],[["https://mts0.googleapis.com/mapslt/ft?hl=en-US\u0026","https://mts1.googleapis.com/mapslt/ft?hl=en-US\u0026"]],[["https://mts0.googleapis.com/vt?hl=en-US\u0026","https://mts1.googleapis.com/vt?hl=en-US\u0026"]],[["https://mts0.googleapis.com/mapslt/loom?hl=en-US\u0026","https://mts1.googleapis.com/mapslt/loom?hl=en-US\u0026"]],[["https://mts0.googleapis.com/mapslt?hl=en-US\u0026","https://mts1.googleapis.com/mapslt?hl=en-US\u0026"]],[["https://mts0.googleapis.com/mapslt/ft?hl=en-US\u0026","https://mts1.googleapis.com/mapslt/ft?hl=en-US\u0026"]],[["https://mts0.googleapis.com/mapslt/loom?hl=en-US\u0026","https://mts1.googleapis.com/mapslt/loom?hl=en-US\u0026"]]],["en-US","US",null,0,null,null,"https://maps.gstatic.com/mapfiles/","https://csi.gstatic.com","https://maps.googleapis.com","https://maps.googleapis.com",null,"https://maps.google.com","https://gg.google.com","https://maps.gstatic.com/maps-api-v3/api/images/","https://www.google.com/maps",0,"https://www.google.com"],["https://maps.googleapis.com/maps-api-v3/api/js/22/5a","3.22.5a"],[1983132137],1,null,null,null,null,null,"",null,null,1,"https://khms.googleapis.com/mz?v=184\u0026",null,"https://earthbuilder.googleapis.com","https://earthbuilder.googleapis.com",null,"https://mts.googleapis.com/vt/icon",[["https://mts0.googleapis.com/vt","https://mts1.googleapis.com/vt"],["https://mts0.googleapis.com/vt","https://mts1.googleapis.com/vt"],null,null,null,null,null,null,null,null,null,null,["https://mts0.google.com/vt","https://mts1.google.com/vt"],"/maps/vt",322000000,132],2,500,[null,"https://g0.gstatic.com/landmark/tour","https://g0.gstatic.com/landmark/config",null,"https://www.google.com/maps/preview/log204","","https://static.panoramio.com.storage.googleapis.com/photos/",["https://geo0.ggpht.com/cbk","https://geo1.ggpht.com/cbk","https://geo2.ggpht.com/cbk","https://geo3.ggpht.com/cbk"],"https://maps.googleapis.com/maps/api/js/GeoPhotoService.GetMetadata","https://maps.googleapis.com/maps/api/js/GeoPhotoService.SingleImageSearch"],["https://www.google.com/maps/api/js/master?pb=!1m2!1u22!2s5a!2sen-US!3sUS!4s22/5a","https://www.google.com/maps/api/js/widget?pb=!1m2!1u22!2s5a!2sen-US"],null,0,null,"/maps/api/js/ApplicationService.GetEntityDetails",0,null,null,[null,null,null,null,null,null,null,null,null,[0,0],[0,null,1,"0","0","U","0","0","0","0","0","0"]]], loadScriptTime);
  };
  var loadScriptTime = (new Date).getTime();
  getScript("https://maps.googleapis.com/maps-api-v3/api/js/22/5a/main.js");
})();
;
/*
 *  jQuery OwlCarousel v1.3.2
 *
 *  Copyright (c) 2013 Bartosz Wojciechowski
 *  http://www.owlgraphic.com/owlcarousel/
 *
 *  Licensed under MIT
 *
 */

/*JS Lint helpers: */
/*global dragMove: false, dragEnd: false, $, jQuery, alert, window, document */
/*jslint nomen: true, continue:true */

if (typeof Object.create !== "function") {
    Object.create = function (obj) {
        function F() {}
        F.prototype = obj;
        return new F();
    };
}
(function ($, window, document) {

    var Carousel = {
        init : function (options, el) {
            var base = this;

            base.$elem = $(el);
            base.options = $.extend({}, $.fn.owlCarousel.options, base.$elem.data(), options);

            base.userOptions = options;
            base.loadContent();
        },

        loadContent : function () {
            var base = this, url;

            function getData(data) {
                var i, content = "";
                if (typeof base.options.jsonSuccess === "function") {
                    base.options.jsonSuccess.apply(this, [data]);
                } else {
                    for (i in data.owl) {
                        if (data.owl.hasOwnProperty(i)) {
                            content += data.owl[i].item;
                        }
                    }
                    base.$elem.html(content);
                }
                base.logIn();
            }

            if (typeof base.options.beforeInit === "function") {
                base.options.beforeInit.apply(this, [base.$elem]);
            }

            if (typeof base.options.jsonPath === "string") {
                url = base.options.jsonPath;
                $.getJSON(url, getData);
            } else {
                base.logIn();
            }
        },

        logIn : function () {
            var base = this;

            base.$elem.data("owl-originalStyles", base.$elem.attr("style"))
                .data("owl-originalClasses", base.$elem.attr("class"));

            base.$elem.css({opacity: 0});
            base.orignalItems = base.options.items;
            base.checkBrowser();
            base.wrapperWidth = 0;
            base.checkVisible = null;
            base.setVars();
        },

        setVars : function () {
            var base = this;
            if (base.$elem.children().length === 0) {return false; }
            base.baseClass();
            base.eventTypes();
            base.$userItems = base.$elem.children();
            base.itemsAmount = base.$userItems.length;
            base.wrapItems();
            base.$owlItems = base.$elem.find(".owl-item");
            base.$owlWrapper = base.$elem.find(".owl-wrapper");
            base.playDirection = "next";
            base.prevItem = 0;
            base.prevArr = [0];
            base.currentItem = 0;
            base.customEvents();
            base.onStartup();
        },

        onStartup : function () {
            var base = this;
            base.updateItems();
            base.calculateAll();
            base.buildControls();
            base.updateControls();
            base.response();
            base.moveEvents();
            base.stopOnHover();
            base.owlStatus();

            if (base.options.transitionStyle !== false) {
                base.transitionTypes(base.options.transitionStyle);
            }
            if (base.options.autoPlay === true) {
                base.options.autoPlay = 5000;
            }
            base.play();

            base.$elem.find(".owl-wrapper").css("display", "block");

            if (!base.$elem.is(":visible")) {
                base.watchVisibility();
            } else {
                base.$elem.css("opacity", 1);
            }
            base.onstartup = false;
            base.eachMoveUpdate();
            if (typeof base.options.afterInit === "function") {
                base.options.afterInit.apply(this, [base.$elem]);
            }
        },

        eachMoveUpdate : function () {
            var base = this;

            if (base.options.lazyLoad === true) {
                base.lazyLoad();
            }
            if (base.options.autoHeight === true) {
                base.autoHeight();
            }
            base.onVisibleItems();

            if (typeof base.options.afterAction === "function") {
                base.options.afterAction.apply(this, [base.$elem]);
            }
        },

        updateVars : function () {
            var base = this;
            if (typeof base.options.beforeUpdate === "function") {
                base.options.beforeUpdate.apply(this, [base.$elem]);
            }
            base.watchVisibility();
            base.updateItems();
            base.calculateAll();
            base.updatePosition();
            base.updateControls();
            base.eachMoveUpdate();
            if (typeof base.options.afterUpdate === "function") {
                base.options.afterUpdate.apply(this, [base.$elem]);
            }
        },

        reload : function () {
            var base = this;
            window.setTimeout(function () {
                base.updateVars();
            }, 0);
        },

        watchVisibility : function () {
            var base = this;

            if (base.$elem.is(":visible") === false) {
                base.$elem.css({opacity: 0});
                window.clearInterval(base.autoPlayInterval);
                window.clearInterval(base.checkVisible);
            } else {
                return false;
            }
            base.checkVisible = window.setInterval(function () {
                if (base.$elem.is(":visible")) {
                    base.reload();
                    base.$elem.animate({opacity: 1}, 200);
                    window.clearInterval(base.checkVisible);
                }
            }, 500);
        },

        wrapItems : function () {
            var base = this;
            base.$userItems.wrapAll("<div class=\"owl-wrapper\">").wrap("<div class=\"owl-item\"></div>");
            base.$elem.find(".owl-wrapper").wrap("<div class=\"owl-wrapper-outer\">");
            base.wrapperOuter = base.$elem.find(".owl-wrapper-outer");
            base.$elem.css("display", "block");
        },

        baseClass : function () {
            var base = this,
                hasBaseClass = base.$elem.hasClass(base.options.baseClass),
                hasThemeClass = base.$elem.hasClass(base.options.theme);

            if (!hasBaseClass) {
                base.$elem.addClass(base.options.baseClass);
            }

            if (!hasThemeClass) {
                base.$elem.addClass(base.options.theme);
            }
        },

        updateItems : function () {
            var base = this, width, i;

            if (base.options.responsive === false) {
                return false;
            }
            if (base.options.singleItem === true) {
                base.options.items = base.orignalItems = 1;
                base.options.itemsCustom = false;
                base.options.itemsDesktop = false;
                base.options.itemsDesktopSmall = false;
                base.options.itemsTablet = false;
                base.options.itemsTabletSmall = false;
                base.options.itemsMobile = false;
                return false;
            }

            width = $(base.options.responsiveBaseWidth).width();

            if (width > (base.options.itemsDesktop[0] || base.orignalItems)) {
                base.options.items = base.orignalItems;
            }
            if (base.options.itemsCustom !== false) {
                //Reorder array by screen size
                base.options.itemsCustom.sort(function (a, b) {return a[0] - b[0]; });

                for (i = 0; i < base.options.itemsCustom.length; i += 1) {
                    if (base.options.itemsCustom[i][0] <= width) {
                        base.options.items = base.options.itemsCustom[i][1];
                    }
                }

            } else {

                if (width <= base.options.itemsDesktop[0] && base.options.itemsDesktop !== false) {
                    base.options.items = base.options.itemsDesktop[1];
                }

                if (width <= base.options.itemsDesktopSmall[0] && base.options.itemsDesktopSmall !== false) {
                    base.options.items = base.options.itemsDesktopSmall[1];
                }

                if (width <= base.options.itemsTablet[0] && base.options.itemsTablet !== false) {
                    base.options.items = base.options.itemsTablet[1];
                }

                if (width <= base.options.itemsTabletSmall[0] && base.options.itemsTabletSmall !== false) {
                    base.options.items = base.options.itemsTabletSmall[1];
                }

                if (width <= base.options.itemsMobile[0] && base.options.itemsMobile !== false) {
                    base.options.items = base.options.itemsMobile[1];
                }
            }

            //if number of items is less than declared
            if (base.options.items > base.itemsAmount && base.options.itemsScaleUp === true) {
                base.options.items = base.itemsAmount;
            }
        },

        response : function () {
            var base = this,
                smallDelay,
                lastWindowWidth;

            if (base.options.responsive !== true) {
                return false;
            }
            lastWindowWidth = $(window).width();

            base.resizer = function () {
                if ($(window).width() !== lastWindowWidth) {
                    if (base.options.autoPlay !== false) {
                        window.clearInterval(base.autoPlayInterval);
                    }
                    window.clearTimeout(smallDelay);
                    smallDelay = window.setTimeout(function () {
                        lastWindowWidth = $(window).width();
                        base.updateVars();
                    }, base.options.responsiveRefreshRate);
                }
            };
            $(window).resize(base.resizer);
        },

        updatePosition : function () {
            var base = this;
            base.jumpTo(base.currentItem);
            if (base.options.autoPlay !== false) {
                base.checkAp();
            }
        },

        appendItemsSizes : function () {
            var base = this,
                roundPages = 0,
                lastItem = base.itemsAmount - base.options.items;

            base.$owlItems.each(function (index) {
                var $this = $(this);
                $this
                    .css({"width": base.itemWidth})
                    .data("owl-item", Number(index));

                if (index % base.options.items === 0 || index === lastItem) {
                    if (!(index > lastItem)) {
                        roundPages += 1;
                    }
                }
                $this.data("owl-roundPages", roundPages);
            });
        },

        appendWrapperSizes : function () {
            var base = this,
                width = base.$owlItems.length * base.itemWidth;

            base.$owlWrapper.css({
                "width": width * 2,
                "left": 0
            });
            base.appendItemsSizes();
        },

        calculateAll : function () {
            var base = this;
            base.calculateWidth();
            base.appendWrapperSizes();
            base.loops();
            base.max();
        },

        calculateWidth : function () {
            var base = this;
            base.itemWidth = Math.round(base.$elem.width() / base.options.items);
        },

        max : function () {
            var base = this,
                maximum = ((base.itemsAmount * base.itemWidth) - base.options.items * base.itemWidth) * -1;
            if (base.options.items > base.itemsAmount) {
                base.maximumItem = 0;
                maximum = 0;
                base.maximumPixels = 0;
            } else {
                base.maximumItem = base.itemsAmount - base.options.items;
                base.maximumPixels = maximum;
            }
            return maximum;
        },

        min : function () {
            return 0;
        },

        loops : function () {
            var base = this,
                prev = 0,
                elWidth = 0,
                i,
                item,
                roundPageNum;

            base.positionsInArray = [0];
            base.pagesInArray = [];

            for (i = 0; i < base.itemsAmount; i += 1) {
                elWidth += base.itemWidth;
                base.positionsInArray.push(-elWidth);

                if (base.options.scrollPerPage === true) {
                    item = $(base.$owlItems[i]);
                    roundPageNum = item.data("owl-roundPages");
                    if (roundPageNum !== prev) {
                        base.pagesInArray[prev] = base.positionsInArray[i];
                        prev = roundPageNum;
                    }
                }
            }
        },

        buildControls : function () {
            var base = this;
            if (base.options.navigation === true || base.options.pagination === true) {
                base.owlControls = $("<div class=\"owl-controls\"/>").toggleClass("clickable", !base.browser.isTouch).appendTo(base.$elem);
            }
            if (base.options.pagination === true) {
                base.buildPagination();
            }
            if (base.options.navigation === true) {
                base.buildButtons();
            }
        },

        buildButtons : function () {
            var base = this,
                buttonsWrapper = $("<div class=\"owl-buttons\"/>");
            base.owlControls.append(buttonsWrapper);

            base.buttonPrev = $("<div/>", {
                "class" : "owl-prev",
                "html" : base.options.navigationText[0] || ""
            });

            base.buttonNext = $("<div/>", {
                "class" : "owl-next",
                "html" : base.options.navigationText[1] || ""
            });

            buttonsWrapper
                .append(base.buttonPrev)
                .append(base.buttonNext);

            buttonsWrapper.on("touchstart.owlControls mousedown.owlControls", "div[class^=\"owl\"]", function (event) {
                event.preventDefault();
            });

            buttonsWrapper.on("touchend.owlControls mouseup.owlControls", "div[class^=\"owl\"]", function (event) {
                event.preventDefault();
                if ($(this).hasClass("owl-next")) {
                    base.next();
                } else {
                    base.prev();
                }
            });
        },

        buildPagination : function () {
            var base = this;

            base.paginationWrapper = $("<div class=\"owl-pagination\"/>");
            base.owlControls.append(base.paginationWrapper);

            base.paginationWrapper.on("touchend.owlControls mouseup.owlControls", ".owl-page", function (event) {
                event.preventDefault();
                if (Number($(this).data("owl-page")) !== base.currentItem) {
                    base.goTo(Number($(this).data("owl-page")), true);
                }
            });
        },

        updatePagination : function () {
            var base = this,
                counter,
                lastPage,
                lastItem,
                i,
                paginationButton,
                paginationButtonInner;

            if (base.options.pagination === false) {
                return false;
            }

            base.paginationWrapper.html("");

            counter = 0;
            lastPage = base.itemsAmount - base.itemsAmount % base.options.items;

            for (i = 0; i < base.itemsAmount; i += 1) {
                if (i % base.options.items === 0) {
                    counter += 1;
                    if (lastPage === i) {
                        lastItem = base.itemsAmount - base.options.items;
                    }
                    paginationButton = $("<div/>", {
                        "class" : "owl-page"
                    });
                    paginationButtonInner = $("<span></span>", {
                        "text": base.options.paginationNumbers === true ? counter : "",
                        "class": base.options.paginationNumbers === true ? "owl-numbers" : ""
                    });
                    paginationButton.append(paginationButtonInner);

                    paginationButton.data("owl-page", lastPage === i ? lastItem : i);
                    paginationButton.data("owl-roundPages", counter);

                    base.paginationWrapper.append(paginationButton);
                }
            }
            base.checkPagination();
        },
        checkPagination : function () {
            var base = this;
            if (base.options.pagination === false) {
                return false;
            }
            base.paginationWrapper.find(".owl-page").each(function () {
                if ($(this).data("owl-roundPages") === $(base.$owlItems[base.currentItem]).data("owl-roundPages")) {
                    base.paginationWrapper
                        .find(".owl-page")
                        .removeClass("active");
                    $(this).addClass("active");
                }
            });
        },

        checkNavigation : function () {
            var base = this;

            if (base.options.navigation === false) {
                return false;
            }
            if (base.options.rewindNav === false) {
                if (base.currentItem === 0 && base.maximumItem === 0) {
                    base.buttonPrev.addClass("disabled");
                    base.buttonNext.addClass("disabled");
                } else if (base.currentItem === 0 && base.maximumItem !== 0) {
                    base.buttonPrev.addClass("disabled");
                    base.buttonNext.removeClass("disabled");
                } else if (base.currentItem === base.maximumItem) {
                    base.buttonPrev.removeClass("disabled");
                    base.buttonNext.addClass("disabled");
                } else if (base.currentItem !== 0 && base.currentItem !== base.maximumItem) {
                    base.buttonPrev.removeClass("disabled");
                    base.buttonNext.removeClass("disabled");
                }
            }
        },

        updateControls : function () {
            var base = this;
            base.updatePagination();
            base.checkNavigation();
            if (base.owlControls) {
                if (base.options.items >= base.itemsAmount) {
                    base.owlControls.hide();
                } else {
                    base.owlControls.show();
                }
            }
        },

        destroyControls : function () {
            var base = this;
            if (base.owlControls) {
                base.owlControls.remove();
            }
        },

        next : function (speed) {
            var base = this;

            if (base.isTransition) {
                return false;
            }

            base.currentItem += base.options.scrollPerPage === true ? base.options.items : 1;
            if (base.currentItem > base.maximumItem + (base.options.scrollPerPage === true ? (base.options.items - 1) : 0)) {
                if (base.options.rewindNav === true) {
                    base.currentItem = 0;
                    speed = "rewind";
                } else {
                    base.currentItem = base.maximumItem;
                    return false;
                }
            }
            base.goTo(base.currentItem, speed);
        },

        prev : function (speed) {
            var base = this;

            if (base.isTransition) {
                return false;
            }

            if (base.options.scrollPerPage === true && base.currentItem > 0 && base.currentItem < base.options.items) {
                base.currentItem = 0;
            } else {
                base.currentItem -= base.options.scrollPerPage === true ? base.options.items : 1;
            }
            if (base.currentItem < 0) {
                if (base.options.rewindNav === true) {
                    base.currentItem = base.maximumItem;
                    speed = "rewind";
                } else {
                    base.currentItem = 0;
                    return false;
                }
            }
            base.goTo(base.currentItem, speed);
        },

        goTo : function (position, speed, drag) {
            var base = this,
                goToPixel;

            if (base.isTransition) {
                return false;
            }
            if (typeof base.options.beforeMove === "function") {
                base.options.beforeMove.apply(this, [base.$elem]);
            }
            if (position >= base.maximumItem) {
                position = base.maximumItem;
            } else if (position <= 0) {
                position = 0;
            }

            base.currentItem = base.owl.currentItem = position;
            if (base.options.transitionStyle !== false && drag !== "drag" && base.options.items === 1 && base.browser.support3d === true) {
                base.swapSpeed(0);
                if (base.browser.support3d === true) {
                    base.transition3d(base.positionsInArray[position]);
                } else {
                    base.css2slide(base.positionsInArray[position], 1);
                }
                base.afterGo();
                base.singleItemTransition();
                return false;
            }
            goToPixel = base.positionsInArray[position];

            if (base.browser.support3d === true) {
                base.isCss3Finish = false;

                if (speed === true) {
                    base.swapSpeed("paginationSpeed");
                    window.setTimeout(function () {
                        base.isCss3Finish = true;
                    }, base.options.paginationSpeed);

                } else if (speed === "rewind") {
                    base.swapSpeed(base.options.rewindSpeed);
                    window.setTimeout(function () {
                        base.isCss3Finish = true;
                    }, base.options.rewindSpeed);

                } else {
                    base.swapSpeed("slideSpeed");
                    window.setTimeout(function () {
                        base.isCss3Finish = true;
                    }, base.options.slideSpeed);
                }
                base.transition3d(goToPixel);
            } else {
                if (speed === true) {
                    base.css2slide(goToPixel, base.options.paginationSpeed);
                } else if (speed === "rewind") {
                    base.css2slide(goToPixel, base.options.rewindSpeed);
                } else {
                    base.css2slide(goToPixel, base.options.slideSpeed);
                }
            }
            base.afterGo();
        },

        jumpTo : function (position) {
            var base = this;
            if (typeof base.options.beforeMove === "function") {
                base.options.beforeMove.apply(this, [base.$elem]);
            }
            if (position >= base.maximumItem || position === -1) {
                position = base.maximumItem;
            } else if (position <= 0) {
                position = 0;
            }
            base.swapSpeed(0);
            if (base.browser.support3d === true) {
                base.transition3d(base.positionsInArray[position]);
            } else {
                base.css2slide(base.positionsInArray[position], 1);
            }
            base.currentItem = base.owl.currentItem = position;
            base.afterGo();
        },

        afterGo : function () {
            var base = this;

            base.prevArr.push(base.currentItem);
            base.prevItem = base.owl.prevItem = base.prevArr[base.prevArr.length - 2];
            base.prevArr.shift(0);

            if (base.prevItem !== base.currentItem) {
                base.checkPagination();
                base.checkNavigation();
                base.eachMoveUpdate();

                if (base.options.autoPlay !== false) {
                    base.checkAp();
                }
            }
            if (typeof base.options.afterMove === "function" && base.prevItem !== base.currentItem) {
                base.options.afterMove.apply(this, [base.$elem]);
            }
        },

        stop : function () {
            var base = this;
            base.apStatus = "stop";
            window.clearInterval(base.autoPlayInterval);
        },

        checkAp : function () {
            var base = this;
            if (base.apStatus !== "stop") {
                base.play();
            }
        },

        play : function () {
            var base = this;
            base.apStatus = "play";
            if (base.options.autoPlay === false) {
                return false;
            }
            window.clearInterval(base.autoPlayInterval);
            base.autoPlayInterval = window.setInterval(function () {
                base.next(true);
            }, base.options.autoPlay);
        },

        swapSpeed : function (action) {
            var base = this;
            if (action === "slideSpeed") {
                base.$owlWrapper.css(base.addCssSpeed(base.options.slideSpeed));
            } else if (action === "paginationSpeed") {
                base.$owlWrapper.css(base.addCssSpeed(base.options.paginationSpeed));
            } else if (typeof action !== "string") {
                base.$owlWrapper.css(base.addCssSpeed(action));
            }
        },

        addCssSpeed : function (speed) {
            return {
                "-webkit-transition": "all " + speed + "ms ease",
                "-moz-transition": "all " + speed + "ms ease",
                "-o-transition": "all " + speed + "ms ease",
                "transition": "all " + speed + "ms ease"
            };
        },

        removeTransition : function () {
            return {
                "-webkit-transition": "",
                "-moz-transition": "",
                "-o-transition": "",
                "transition": ""
            };
        },

        doTranslate : function (pixels) {
            return {
                "-webkit-transform": "translate3d(" + pixels + "px, 0px, 0px)",
                "-moz-transform": "translate3d(" + pixels + "px, 0px, 0px)",
                "-o-transform": "translate3d(" + pixels + "px, 0px, 0px)",
                "-ms-transform": "translate3d(" + pixels + "px, 0px, 0px)",
                "transform": "translate3d(" + pixels + "px, 0px,0px)"
            };
        },

        transition3d : function (value) {
            var base = this;
            base.$owlWrapper.css(base.doTranslate(value));
        },

        css2move : function (value) {
            var base = this;
            base.$owlWrapper.css({"left" : value});
        },

        css2slide : function (value, speed) {
            var base = this;

            base.isCssFinish = false;
            base.$owlWrapper.stop(true, true).animate({
                "left" : value
            }, {
                duration : speed || base.options.slideSpeed,
                complete : function () {
                    base.isCssFinish = true;
                }
            });
        },

        checkBrowser : function () {
            var base = this,
                translate3D = "translate3d(0px, 0px, 0px)",
                tempElem = document.createElement("div"),
                regex,
                asSupport,
                support3d,
                isTouch;

            tempElem.style.cssText = "  -moz-transform:" + translate3D +
                "; -ms-transform:"     + translate3D +
                "; -o-transform:"      + translate3D +
                "; -webkit-transform:" + translate3D +
                "; transform:"         + translate3D;
            regex = /translate3d\(0px, 0px, 0px\)/g;
            asSupport = tempElem.style.cssText.match(regex);
            support3d = (asSupport !== null && asSupport.length >= 1 && asSupport.length <= 2);

            isTouch = "ontouchstart" in window || window.navigator.msMaxTouchPoints;

            base.browser = {
                "support3d" : support3d,
                "isTouch" : isTouch
            };
        },

        moveEvents : function () {
            var base = this;
            if (base.options.mouseDrag !== false || base.options.touchDrag !== false) {
                base.gestures();
                base.disabledEvents();
            }
        },

        eventTypes : function () {
            var base = this,
                types = ["s", "e", "x"];

            base.ev_types = {};

            if (base.options.mouseDrag === true && base.options.touchDrag === true) {
                types = [
                    "touchstart.owl mousedown.owl",
                    "touchmove.owl mousemove.owl",
                    "touchend.owl touchcancel.owl mouseup.owl"
                ];
            } else if (base.options.mouseDrag === false && base.options.touchDrag === true) {
                types = [
                    "touchstart.owl",
                    "touchmove.owl",
                    "touchend.owl touchcancel.owl"
                ];
            } else if (base.options.mouseDrag === true && base.options.touchDrag === false) {
                types = [
                    "mousedown.owl",
                    "mousemove.owl",
                    "mouseup.owl"
                ];
            }

            base.ev_types.start = types[0];
            base.ev_types.move = types[1];
            base.ev_types.end = types[2];
        },

        disabledEvents :  function () {
            var base = this;
            base.$elem.on("dragstart.owl", function (event) { event.preventDefault(); });
            base.$elem.on("mousedown.disableTextSelect", function (e) {
                return $(e.target).is('input, textarea, select, option');
            });
        },

        gestures : function () {
            /*jslint unparam: true*/
            var base = this,
                locals = {
                    offsetX : 0,
                    offsetY : 0,
                    baseElWidth : 0,
                    relativePos : 0,
                    position: null,
                    minSwipe : null,
                    maxSwipe: null,
                    sliding : null,
                    dargging: null,
                    targetElement : null
                };

            base.isCssFinish = true;

            function getTouches(event) {
                if (event.touches !== undefined) {
                    return {
                        x : event.touches[0].pageX,
                        y : event.touches[0].pageY
                    };
                }

                if (event.touches === undefined) {
                    if (event.pageX !== undefined) {
                        return {
                            x : event.pageX,
                            y : event.pageY
                        };
                    }
                    if (event.pageX === undefined) {
                        return {
                            x : event.clientX,
                            y : event.clientY
                        };
                    }
                }
            }

            function swapEvents(type) {
                if (type === "on") {
                    $(document).on(base.ev_types.move, dragMove);
                    $(document).on(base.ev_types.end, dragEnd);
                } else if (type === "off") {
                    $(document).off(base.ev_types.move);
                    $(document).off(base.ev_types.end);
                }
            }

            function dragStart(event) {
                var ev = event.originalEvent || event || window.event,
                    position;

                if (ev.which === 3) {
                    return false;
                }
                if (base.itemsAmount <= base.options.items) {
                    return;
                }
                if (base.isCssFinish === false && !base.options.dragBeforeAnimFinish) {
                    return false;
                }
                if (base.isCss3Finish === false && !base.options.dragBeforeAnimFinish) {
                    return false;
                }

                if (base.options.autoPlay !== false) {
                    window.clearInterval(base.autoPlayInterval);
                }

                if (base.browser.isTouch !== true && !base.$owlWrapper.hasClass("grabbing")) {
                    base.$owlWrapper.addClass("grabbing");
                }

                base.newPosX = 0;
                base.newRelativeX = 0;

                $(this).css(base.removeTransition());

                position = $(this).position();
                locals.relativePos = position.left;

                locals.offsetX = getTouches(ev).x - position.left;
                locals.offsetY = getTouches(ev).y - position.top;

                swapEvents("on");

                locals.sliding = false;
                locals.targetElement = ev.target || ev.srcElement;
            }

            function dragMove(event) {
                var ev = event.originalEvent || event || window.event,
                    minSwipe,
                    maxSwipe;

                base.newPosX = getTouches(ev).x - locals.offsetX;
                base.newPosY = getTouches(ev).y - locals.offsetY;
                base.newRelativeX = base.newPosX - locals.relativePos;

                if (typeof base.options.startDragging === "function" && locals.dragging !== true && base.newRelativeX !== 0) {
                    locals.dragging = true;
                    base.options.startDragging.apply(base, [base.$elem]);
                }

                if ((base.newRelativeX > 8 || base.newRelativeX < -8) && (base.browser.isTouch === true)) {
                    if (ev.preventDefault !== undefined) {
                        ev.preventDefault();
                    } else {
                        ev.returnValue = false;
                    }
                    locals.sliding = true;
                }

                if ((base.newPosY > 10 || base.newPosY < -10) && locals.sliding === false) {
                    $(document).off("touchmove.owl");
                }

                minSwipe = function () {
                    return base.newRelativeX / 5;
                };

                maxSwipe = function () {
                    return base.maximumPixels + base.newRelativeX / 5;
                };

                base.newPosX = Math.max(Math.min(base.newPosX, minSwipe()), maxSwipe());
                if (base.browser.support3d === true) {
                    base.transition3d(base.newPosX);
                } else {
                    base.css2move(base.newPosX);
                }
            }

            function dragEnd(event) {
                var ev = event.originalEvent || event || window.event,
                    newPosition,
                    handlers,
                    owlStopEvent;

                ev.target = ev.target || ev.srcElement;

                locals.dragging = false;

                if (base.browser.isTouch !== true) {
                    base.$owlWrapper.removeClass("grabbing");
                }

                if (base.newRelativeX < 0) {
                    base.dragDirection = base.owl.dragDirection = "left";
                } else {
                    base.dragDirection = base.owl.dragDirection = "right";
                }

                if (base.newRelativeX !== 0) {
                    newPosition = base.getNewPosition();
                    base.goTo(newPosition, false, "drag");
                    if (locals.targetElement === ev.target && base.browser.isTouch !== true) {
                        $(ev.target).on("click.disable", function (ev) {
                            ev.stopImmediatePropagation();
                            ev.stopPropagation();
                            ev.preventDefault();
                            $(ev.target).off("click.disable");
                        });
                        handlers = $._data(ev.target, "events").click;
                        owlStopEvent = handlers.pop();
                        handlers.splice(0, 0, owlStopEvent);
                    }
                }
                swapEvents("off");
            }
            base.$elem.on(base.ev_types.start, ".owl-wrapper", dragStart);
        },

        getNewPosition : function () {
            var base = this,
                newPosition = base.closestItem();

            if (newPosition > base.maximumItem) {
                base.currentItem = base.maximumItem;
                newPosition  = base.maximumItem;
            } else if (base.newPosX >= 0) {
                newPosition = 0;
                base.currentItem = 0;
            }
            return newPosition;
        },
        closestItem : function () {
            var base = this,
                array = base.options.scrollPerPage === true ? base.pagesInArray : base.positionsInArray,
                goal = base.newPosX,
                closest = null;

            $.each(array, function (i, v) {
                if (goal - (base.itemWidth / 20) > array[i + 1] && goal - (base.itemWidth / 20) < v && base.moveDirection() === "left") {
                    closest = v;
                    if (base.options.scrollPerPage === true) {
                        base.currentItem = $.inArray(closest, base.positionsInArray);
                    } else {
                        base.currentItem = i;
                    }
                } else if (goal + (base.itemWidth / 20) < v && goal + (base.itemWidth / 20) > (array[i + 1] || array[i] - base.itemWidth) && base.moveDirection() === "right") {
                    if (base.options.scrollPerPage === true) {
                        closest = array[i + 1] || array[array.length - 1];
                        base.currentItem = $.inArray(closest, base.positionsInArray);
                    } else {
                        closest = array[i + 1];
                        base.currentItem = i + 1;
                    }
                }
            });
            return base.currentItem;
        },

        moveDirection : function () {
            var base = this,
                direction;
            if (base.newRelativeX < 0) {
                direction = "right";
                base.playDirection = "next";
            } else {
                direction = "left";
                base.playDirection = "prev";
            }
            return direction;
        },

        customEvents : function () {
            /*jslint unparam: true*/
            var base = this;
            base.$elem.on("owl.next", function () {
                base.next();
            });
            base.$elem.on("owl.prev", function () {
                base.prev();
            });
            base.$elem.on("owl.play", function (event, speed) {
                base.options.autoPlay = speed;
                base.play();
                base.hoverStatus = "play";
            });
            base.$elem.on("owl.stop", function () {
                base.stop();
                base.hoverStatus = "stop";
            });
            base.$elem.on("owl.goTo", function (event, item) {
                base.goTo(item);
            });
            base.$elem.on("owl.jumpTo", function (event, item) {
                base.jumpTo(item);
            });
        },

        stopOnHover : function () {
            var base = this;
            if (base.options.stopOnHover === true && base.browser.isTouch !== true && base.options.autoPlay !== false) {
                base.$elem.on("mouseover", function () {
                    base.stop();
                });
                base.$elem.on("mouseout", function () {
                    if (base.hoverStatus !== "stop") {
                        base.play();
                    }
                });
            }
        },

        lazyLoad : function () {
            var base = this,
                i,
                $item,
                itemNumber,
                $lazyImg,
                follow;

            if (base.options.lazyLoad === false) {
                return false;
            }
            for (i = 0; i < base.itemsAmount; i += 1) {
                $item = $(base.$owlItems[i]);

                if ($item.data("owl-loaded") === "loaded") {
                    continue;
                }

                itemNumber = $item.data("owl-item");
                $lazyImg = $item.find(".lazyOwl");

                if (typeof $lazyImg.data("src") !== "string") {
                    $item.data("owl-loaded", "loaded");
                    continue;
                }
                if ($item.data("owl-loaded") === undefined) {
                    $lazyImg.hide();
                    $item.addClass("loading").data("owl-loaded", "checked");
                }
                if (base.options.lazyFollow === true) {
                    follow = itemNumber >= base.currentItem;
                } else {
                    follow = true;
                }
                if (follow && itemNumber < base.currentItem + base.options.items && $lazyImg.length) {
                    base.lazyPreload($item, $lazyImg);
                }
            }
        },

        lazyPreload : function ($item, $lazyImg) {
            var base = this,
                iterations = 0,
                isBackgroundImg;

            if ($lazyImg.prop("tagName") === "DIV") {
                $lazyImg.css("background-image", "url(" + $lazyImg.data("src") + ")");
                isBackgroundImg = true;
            } else {
                $lazyImg[0].src = $lazyImg.data("src");
            }

            function showImage() {
                $item.data("owl-loaded", "loaded").removeClass("loading");
                $lazyImg.removeAttr("data-src");
                if (base.options.lazyEffect === "fade") {
                    $lazyImg.fadeIn(400);
                } else {
                    $lazyImg.show();
                }
                if (typeof base.options.afterLazyLoad === "function") {
                    base.options.afterLazyLoad.apply(this, [base.$elem]);
                }
            }

            function checkLazyImage() {
                iterations += 1;
                if (base.completeImg($lazyImg.get(0)) || isBackgroundImg === true) {
                    showImage();
                } else if (iterations <= 100) {//if image loads in less than 10 seconds 
                    window.setTimeout(checkLazyImage, 100);
                } else {
                    showImage();
                }
            }

            checkLazyImage();
        },

        autoHeight : function () {
            var base = this,
                $currentimg = $(base.$owlItems[base.currentItem]).find("img"),
                iterations;

            function addHeight() {
                var $currentItem = $(base.$owlItems[base.currentItem]).height();
                base.wrapperOuter.css("height", $currentItem + "px");
                if (!base.wrapperOuter.hasClass("autoHeight")) {
                    window.setTimeout(function () {
                        base.wrapperOuter.addClass("autoHeight");
                    }, 0);
                }
            }

            function checkImage() {
                iterations += 1;
                if (base.completeImg($currentimg.get(0))) {
                    addHeight();
                } else if (iterations <= 100) { //if image loads in less than 10 seconds 
                    window.setTimeout(checkImage, 100);
                } else {
                    base.wrapperOuter.css("height", ""); //Else remove height attribute
                }
            }

            if ($currentimg.get(0) !== undefined) {
                iterations = 0;
                checkImage();
            } else {
                addHeight();
            }
        },

        completeImg : function (img) {
            var naturalWidthType;

            if (!img.complete) {
                return false;
            }
            naturalWidthType = typeof img.naturalWidth;
            if (naturalWidthType !== "undefined" && img.naturalWidth === 0) {
                return false;
            }
            return true;
        },

        onVisibleItems : function () {
            var base = this,
                i;

            if (base.options.addClassActive === true) {
                base.$owlItems.removeClass("active");
            }
            base.visibleItems = [];
            for (i = base.currentItem; i < base.currentItem + base.options.items; i += 1) {
                base.visibleItems.push(i);

                if (base.options.addClassActive === true) {
                    $(base.$owlItems[i]).addClass("active");
                }
            }
            base.owl.visibleItems = base.visibleItems;
        },

        transitionTypes : function (className) {
            var base = this;
            //Currently available: "fade", "backSlide", "goDown", "fadeUp"
            base.outClass = "owl-" + className + "-out";
            base.inClass = "owl-" + className + "-in";
        },

        singleItemTransition : function () {
            var base = this,
                outClass = base.outClass,
                inClass = base.inClass,
                $currentItem = base.$owlItems.eq(base.currentItem),
                $prevItem = base.$owlItems.eq(base.prevItem),
                prevPos = Math.abs(base.positionsInArray[base.currentItem]) + base.positionsInArray[base.prevItem],
                origin = Math.abs(base.positionsInArray[base.currentItem]) + base.itemWidth / 2,
                animEnd = 'webkitAnimationEnd oAnimationEnd MSAnimationEnd animationend';

            base.isTransition = true;

            base.$owlWrapper
                .addClass('owl-origin')
                .css({
                    "-webkit-transform-origin" : origin + "px",
                    "-moz-perspective-origin" : origin + "px",
                    "perspective-origin" : origin + "px"
                });
            function transStyles(prevPos) {
                return {
                    "position" : "relative",
                    "left" : prevPos + "px"
                };
            }

            $prevItem
                .css(transStyles(prevPos, 10))
                .addClass(outClass)
                .on(animEnd, function () {
                    base.endPrev = true;
                    $prevItem.off(animEnd);
                    base.clearTransStyle($prevItem, outClass);
                });

            $currentItem
                .addClass(inClass)
                .on(animEnd, function () {
                    base.endCurrent = true;
                    $currentItem.off(animEnd);
                    base.clearTransStyle($currentItem, inClass);
                });
        },

        clearTransStyle : function (item, classToRemove) {
            var base = this;
            item.css({
                "position" : "",
                "left" : ""
            }).removeClass(classToRemove);

            if (base.endPrev && base.endCurrent) {
                base.$owlWrapper.removeClass('owl-origin');
                base.endPrev = false;
                base.endCurrent = false;
                base.isTransition = false;
            }
        },

        owlStatus : function () {
            var base = this;
            base.owl = {
                "userOptions"   : base.userOptions,
                "baseElement"   : base.$elem,
                "userItems"     : base.$userItems,
                "owlItems"      : base.$owlItems,
                "currentItem"   : base.currentItem,
                "prevItem"      : base.prevItem,
                "visibleItems"  : base.visibleItems,
                "isTouch"       : base.browser.isTouch,
                "browser"       : base.browser,
                "dragDirection" : base.dragDirection
            };
        },

        clearEvents : function () {
            var base = this;
            base.$elem.off(".owl owl mousedown.disableTextSelect");
            $(document).off(".owl owl");
            $(window).off("resize", base.resizer);
        },

        unWrap : function () {
            var base = this;
            if (base.$elem.children().length !== 0) {
                base.$owlWrapper.unwrap();
                base.$userItems.unwrap().unwrap();
                if (base.owlControls) {
                    base.owlControls.remove();
                }
            }
            base.clearEvents();
            base.$elem
                .attr("style", base.$elem.data("owl-originalStyles") || "")
                .attr("class", base.$elem.data("owl-originalClasses"));
        },

        destroy : function () {
            var base = this;
            base.stop();
            window.clearInterval(base.checkVisible);
            base.unWrap();
            base.$elem.removeData();
        },

        reinit : function (newOptions) {
            var base = this,
                options = $.extend({}, base.userOptions, newOptions);
            base.unWrap();
            base.init(options, base.$elem);
        },

        addItem : function (htmlString, targetPosition) {
            var base = this,
                position;

            if (!htmlString) {return false; }

            if (base.$elem.children().length === 0) {
                base.$elem.append(htmlString);
                base.setVars();
                return false;
            }
            base.unWrap();
            if (targetPosition === undefined || targetPosition === -1) {
                position = -1;
            } else {
                position = targetPosition;
            }
            if (position >= base.$userItems.length || position === -1) {
                base.$userItems.eq(-1).after(htmlString);
            } else {
                base.$userItems.eq(position).before(htmlString);
            }

            base.setVars();
        },

        removeItem : function (targetPosition) {
            var base = this,
                position;

            if (base.$elem.children().length === 0) {
                return false;
            }
            if (targetPosition === undefined || targetPosition === -1) {
                position = -1;
            } else {
                position = targetPosition;
            }

            base.unWrap();
            base.$userItems.eq(position).remove();
            base.setVars();
        }

    };

    $.fn.owlCarousel = function (options) {
        return this.each(function () {
            if ($(this).data("owl-init") === true) {
                return false;
            }
            $(this).data("owl-init", true);
            var carousel = Object.create(Carousel);
            carousel.init(options, this);
            $.data(this, "owlCarousel", carousel);
        });
    };

    $.fn.owlCarousel.options = {

        items : 5,
        itemsCustom : false,
        itemsDesktop : [1199, 4],
        itemsDesktopSmall : [979, 3],
        itemsTablet : [768, 2],
        itemsTabletSmall : false,
        itemsMobile : [479, 1],
        singleItem : false,
        itemsScaleUp : false,

        slideSpeed : 200,
        paginationSpeed : 800,
        rewindSpeed : 1000,

        autoPlay : false,
        stopOnHover : false,

        navigation : false,
        navigationText : ["prev", "next"],
        rewindNav : true,
        scrollPerPage : false,

        pagination : true,
        paginationNumbers : false,

        responsive : true,
        responsiveRefreshRate : 200,
        responsiveBaseWidth : window,

        baseClass : "owl-carousel",
        theme : "owl-theme",

        lazyLoad : false,
        lazyFollow : true,
        lazyEffect : "fade",

        autoHeight : false,

        jsonPath : false,
        jsonSuccess : false,

        dragBeforeAnimFinish : true,
        mouseDrag : true,
        touchDrag : true,

        addClassActive : false,
        transitionStyle : false,

        beforeUpdate : false,
        afterUpdate : false,
        beforeInit : false,
        afterInit : false,
        beforeMove : false,
        afterMove : false,
        afterAction : false,
        startDragging : false,
        afterLazyLoad: false
    };
}(jQuery, window, document));;
/**
 * Created by Ong Chinh on 12/30/14.
 */
(function ($) {
    $(document).ready(function () {
        $('.awe-flickr').mdFlickr();
        $.each($('.awe-gmap'), function () {
            $(this).mdGMap();
        });
        $('.awe-accordion').mdAccordion();
        $('.awe-video').mdVideo();
        $('.awe-slideshow').mdSlideShow();
        $('.awe-gallery').mdGallery();
        $('.awe-image').mdImage();
        $('[data-animation]').mdProcessAnimation();
        $('.md-parallax').mdParallax();
        $('.awe-media-control').mdEventPlayer();
        $('.awe-tabs').mdTabs();
        $('.awe-section').mdEqualHeight();
        $(window).resize(function () {
            setTimeout(function () {
                $('.frame-embed').mdResizeBgVideo();
            }, 100);
        }).trigger('resize');
        $('.awesection-fullscreen').awesectionFullscreen();
    });

    $.fn.mdGMap = function (options) {
        var self = $(this),
            arrStyle = {
                style1: [{
                    "featureType": "landscape",
                    "stylers": [{"saturation": -100}, {"lightness": 65}, {"visibility": "on"}]
                }, {
                    "featureType": "poi",
                    "stylers": [{"saturation": -100}, {"lightness": 51}, {"visibility": "simplified"}]
                }, {
                    "featureType": "road.highway",
                    "stylers": [{"saturation": -100}, {"visibility": "simplified"}]
                }, {
                    "featureType": "road.arterial",
                    "stylers": [{"saturation": -100}, {"lightness": 30}, {"visibility": "on"}]
                }, {
                    "featureType": "road.local",
                    "stylers": [{"saturation": -100}, {"lightness": 40}, {"visibility": "on"}]
                }, {
                    "featureType": "transit",
                    "stylers": [{"saturation": -100}, {"visibility": "simplified"}]
                }, {"featureType": "administrative.province", "stylers": [{"visibility": "off"}]}, {
                    "featureType": "water",
                    "elementType": "labels",
                    "stylers": [{"visibility": "on"}, {"lightness": -25}, {"saturation": -100}]
                }, {
                    "featureType": "water",
                    "elementType": "geometry",
                    "stylers": [{"hue": "#ffff00"}, {"lightness": -25}, {"saturation": -97}]
                }],
                style2: [{
                    "featureType": "water",
                    "stylers": [{"visibility": "on"}, {"color": "#acbcc9"}]
                }, {"featureType": "landscape", "stylers": [{"color": "#f2e5d4"}]}, {
                    "featureType": "road.highway",
                    "elementType": "geometry",
                    "stylers": [{"color": "#c5c6c6"}]
                }, {
                    "featureType": "road.arterial",
                    "elementType": "geometry",
                    "stylers": [{"color": "#e4d7c6"}]
                }, {
                    "featureType": "road.local",
                    "elementType": "geometry",
                    "stylers": [{"color": "#fbfaf7"}]
                }, {
                    "featureType": "poi.park",
                    "elementType": "geometry",
                    "stylers": [{"color": "#c5dac6"}]
                }, {
                    "featureType": "administrative",
                    "stylers": [{"visibility": "on"}, {"lightness": 33}]
                }, {"featureType": "road"}, {
                    "featureType": "poi.park",
                    "elementType": "labels",
                    "stylers": [{"visibility": "on"}, {"lightness": 20}]
                }, {}, {"featureType": "road", "stylers": [{"lightness": 20}]}],
                style3: [{
                    "featureType": "water",
                    "stylers": [{"color": "#46bcec"}, {"visibility": "on"}]
                }, {"featureType": "landscape", "stylers": [{"color": "#f2f2f2"}]}, {
                    "featureType": "road",
                    "stylers": [{"saturation": -100}, {"lightness": 45}]
                }, {
                    "featureType": "road.highway",
                    "stylers": [{"visibility": "simplified"}]
                }, {
                    "featureType": "road.arterial",
                    "elementType": "labels.icon",
                    "stylers": [{"visibility": "off"}]
                }, {
                    "featureType": "administrative",
                    "elementType": "labels.text.fill",
                    "stylers": [{"color": "#444444"}]
                }, {"featureType": "transit", "stylers": [{"visibility": "off"}]}, {
                    "featureType": "poi",
                    "stylers": [{"visibility": "off"}]
                }],
                style4: [{
                    "featureType": "water",
                    "elementType": "geometry",
                    "stylers": [{"color": "#000000"}, {"lightness": 17}]
                }, {
                    "featureType": "landscape",
                    "elementType": "geometry",
                    "stylers": [{"color": "#000000"}, {"lightness": 20}]
                }, {
                    "featureType": "road.highway",
                    "elementType": "geometry.fill",
                    "stylers": [{"color": "#000000"}, {"lightness": 17}]
                }, {
                    "featureType": "road.highway",
                    "elementType": "geometry.stroke",
                    "stylers": [{"color": "#000000"}, {"lightness": 29}, {"weight": 0.2}]
                }, {
                    "featureType": "road.arterial",
                    "elementType": "geometry",
                    "stylers": [{"color": "#000000"}, {"lightness": 18}]
                }, {
                    "featureType": "road.local",
                    "elementType": "geometry",
                    "stylers": [{"color": "#000000"}, {"lightness": 16}]
                }, {
                    "featureType": "poi",
                    "elementType": "geometry",
                    "stylers": [{"color": "#000000"}, {"lightness": 21}]
                }, {
                    "elementType": "labels.text.stroke",
                    "stylers": [{"visibility": "on"}, {"color": "#000000"}, {"lightness": 16}]
                }, {
                    "elementType": "labels.text.fill",
                    "stylers": [{"saturation": 36}, {"color": "#000000"}, {"lightness": 40}]
                }, {"elementType": "labels.icon", "stylers": [{"visibility": "off"}]}, {
                    "featureType": "transit",
                    "elementType": "geometry",
                    "stylers": [{"color": "#000000"}, {"lightness": 19}]
                }, {
                    "featureType": "administrative",
                    "elementType": "geometry.fill",
                    "stylers": [{"color": "#000000"}, {"lightness": 20}]
                }, {
                    "featureType": "administrative",
                    "elementType": "geometry.stroke",
                    "stylers": [{"color": "#000000"}, {"lightness": 17}, {"weight": 1.2}]
                }]
            },
            data = self.data(),
            zoom = data.zoom,
            style = data.style,
            latLong = data.latlong,
            scrollZomm = parseInt(data.scrollzoom),
            info = data.info,
            iconMarker = data.marker,
            title = data.title,
            descriptions = data.descriptions,
            map, mapOptions, mapMarker, mapInfoWindow;
        if (latLong != '' && latLong.indexOf(',') != -1) {
            latLong = latLong.split(',');
            latLong = new google.maps.LatLng(latLong[0], latLong[1]);
            mapOptions = {
                zoom: zoom,
                styles: arrStyle[style],
                center: latLong,
                scrollwheel: scrollZomm ? false : true
            };
            map = new google.maps.Map(this[0], mapOptions);
            setTimeout(function () {
                google.maps.event.trigger(map, 'resize');
            }, 50);
            if (info) {
                mapMarker = new google.maps.Marker({
                    map: map,
                    title: 'Click to show info',
                    icon: iconMarker,
                    position: latLong
//                    animation: google.maps.Animation.BOUNCE
                });
                mapInfoWindow = new google.maps.InfoWindow({
                    content: (title || descriptions) ? '<h2 style="color: #333;">' + title + '</h2><p style="color: #555;">' + descriptions + '</p>' : ''
                });
                google.maps.event.addListener(mapMarker, 'click', function () {
                    mapInfoWindow.open(map, mapMarker);
                    if (mapMarker.getAnimation() != null) {
                        mapMarker.setAnimation(null);
                    } else {
                        mapMarker.setAnimation(google.maps.Animation.BOUNCE);
                    }
                });
            }
        }
    };

    $.fn.mdAccordion = function () {
        $.each(this, function () {
            var self = $(this);
            self.accordion({
                header: '>.group >h3',
                heightStyle: 'content',
                collapsible: true,
                activate: function (event, ui) {
                },
                create: function (event, ui) {
                    $(ui.header).find('.sign-toggle-accr > i').removeClass('ic ac-icon-add').addClass('ic ac-icon-minus');
                },
                beforeActivate: function (event, ui) {
                    var isToggle = parseInt(self.data('toggle')),
                        $header = ui.newHeader.length ? ui.newHeader : ui.oldHeader;

                    if (isToggle) {
                        var currHeader, currContent, isPanelSelected;

                        if (ui.newHeader[0]) {
                            currHeader = ui.newHeader;
                            currContent = currHeader.next('.ui-accordion-content');
                        }
                        else {
                            currHeader = ui.oldHeader;
                            currContent = currHeader.next('.ui-accordion-content');
                        }
                        isPanelSelected = currHeader.attr('aria-selected') == 'true';
                        currHeader.toggleClass('ui-corner-all', isPanelSelected).toggleClass('accordion-header-active ui-state-active ui-corner-top', !isPanelSelected).attr('aria-selected', ((!isPanelSelected).toString()));
                        currHeader.children('.ui-icon').toggleClass('ui-icon-triangle-1-e', isPanelSelected).toggleClass('ui-icon-triangle-1-s', !isPanelSelected);
                        currContent.toggleClass('accordion-content-active', !isPanelSelected);
                        if (isPanelSelected) {
                            currContent.slideUp();
                            $('.sign-toggle-accr > i', currHeader).removeClass('ac-icon-minus').addClass('ac-icon-add');
                        }
                        else {
                            $('.sign-toggle-accr > i', currHeader).removeClass('ac-icon-add').addClass('ac-icon-minus');
                            currContent.slideDown();
                        }
                        return false;
                    }
                    else {
                        $('.sign-toggle-accr > i', $header.parents('.awe-item:first')).removeClass('ac-icon-minus').addClass('ac-icon-add');
                        $('.sign-toggle-accr > i', ui.newHeader).removeClass('ac-icon-add').addClass('ac-icon-minus');
                    }
                }
            })
        })
    };
    $.fn.mdVideo = function () {
        $.each(this, function () {
            var self = $(this),
                dataOptions = self.data(),
                thumb = dataOptions.thumb ? dataOptions.thumb : false,
                background = dataOptions.background ? dataOptions.background : false,
                heightVideo = dataOptions.heightvideo ? dataOptions.heightvideo : false,
                typePlay = dataOptions.typeplay ? dataOptions.typeplay : false,
                href = dataOptions.href ? dataOptions.href : '',
                $iframe = $('<div class="embed-responsive embed-responsive-16by9"><iframe class="embed-responsive-item"></iframe></div>'),
                $thumb = $('<div class="thumb-video"><div class="image-content"><img src="" alt=""/></div><div class="play-control"><i class="ic ac-icon-play"></i></div></div>'),
                $magnific = $('<a class="video-openlightbox"></a>');

            switch (typePlay) {
                case 'autoInline' :
                    $('iframe', $iframe).attr('src', href);
                    self.append($iframe);
                    break;
                case 'inline':
                    $('img', $thumb).attr('src', thumb);
                    self.append($thumb);
                    // Event for Video
                    $('.play-control', self).click(function () {
                        $('iframe', $iframe).attr('src', href);
                        self.append($iframe);
                        setTimeout(function () {
                            $thumb.hide();
                            $iframe.show();
                        }, 500)
                    });
                    break;
                case 'lightbox':
                    $('img', $thumb).attr('src', thumb);
                    $magnific.attr('href', href).magnificPopup({
                        disableOn: 700,
                        type: 'iframe',
                        mainClass: 'mfp-fade',
                        removalDelay: 160,
                        preloader: false,
                        fixedContentPos: false
                    });
                    self.append($thumb, $magnific);
                    // Event for Video
                    $('.play-control', self).click(function () {
                        $magnific.trigger('click');
                    });

                    break;
            }
        });
    };

    $.fn.mdSlideShow = function () {
        $.each(this, function () {
            var self = $(this),
                defaults = {
                    singleItem: true,
                    autoPlay: false,
                    stopOnHover: false,
                    pagination: true,
                    paginationNumbers: false,
                    navigation: false,
                    addClassActive: true,
                    transitionStyle: 'fade'

                };
            var extend = {}, options = {}, data;
            data = self.data();
            options.autoPlay = data.autoplay ? true : false;
            if (data.effect != undefined)
                options.transitionStyle = data.effect;

            // callback to get default thumbnail width
            (function getDefaultThumbWidth() {
                var thumbURL = $('.md-item-image:first', self).data('thumb'),
                    $image = $('<img src="" alt="" />').attr('src', thumbURL).css({opacity: 0, visibility: 'hidden'});

                if (thumbURL) {
                    $image.load(function() {
                        self.data('thumb-width', this.naturalWidth);
                        $('.awe-test-image').remove();
                    });

                    $('body').append($image);
                }
                else
                    self.data('thumb-width', 150);
            })();

            var getThumbWidthInterval = setInterval(function() {
                var $owlThumb;

                if (self.data('thumb-width') != undefined) {
                    clearInterval(getThumbWidthInterval);

                    // process navigation settings
                    switch (data.navigation) {
                        case 'none' :
                            options.pagination = false;
                            break;

                        case 'button' :
                            options.pagination = true;
                            options.paginationNumbers = false;
                            break;

                        case 'number' :
                            options.pagination = true;
                            options.paginationNumbers = true;
                            break;

                        case 'thumbnail' :

                            function center(number) {
                                var sync2visible = $owlThumb.data("owlCarousel").owl.visibleItems, num = number, found = false;
                                for (var i in sync2visible) {
                                    if (num === sync2visible[i])
                                        found = true;
                                }
                                if (found === false) {
                                    if (num > sync2visible[sync2visible.length - 1])
                                        $owlThumb.trigger("owl.goTo", num - sync2visible.length + 2)
                                    else {
                                        if (num - 1 === -1)
                                            num = 0;
                                        $owlThumb.trigger("owl.goTo", num);
                                    }
                                }
                                else if (num === sync2visible[sync2visible.length - 1])
                                    $owlThumb.trigger("owl.goTo", sync2visible[1])
                                else if (num === sync2visible[0])
                                    $owlThumb.trigger("owl.goTo", num - 1)
                            }
                            function syncPosition(el) {
                                var current = this.currentItem;

                                $owlThumb.find(".owl-item").removeClass("synced").eq(current).addClass("synced");
                                if ($owlThumb.data("owlCarousel") !== undefined)
                                    center(current);
                            }

                            // callback to init for slide thumbnail
                            function initThumbList($thumbList) {
                                var numberItems = Math.floor(self.width()/self.data('thumb-width')),
                                    thumbListWidth, thumbListMargin, owl;

                                if (numberItems > $('.md-item-image', self).length)
                                    numberItems = $('.md-item-image', self).length;

                                if (numberItems < 2) {
                                    numberItems = 2;
                                    thumbListWidth = '';
                                    thumbListMargin = '';
                                }
                                else {
                                    thumbListWidth = numberItems*self.data('thumb-width');
                                    thumbListMargin = (self.width() - thumbListWidth)/2;
                                }

                                if (owl = $('.owl-carousel', $thumbList).data('owlCarousel'))
                                    owl.destroy();

                                $('.list-thumb-content', $thumbList).width(thumbListWidth).css('margin-left', thumbListMargin);

                                $owlThumb = $('.owl-carousel', $thumbList).owlCarousel({
                                    pagination: false,
                                    items: numberItems,
                                    itemsDesktop: false,
                                    itemsDesktopSmall: false,
                                    itemsTablet: false,
                                    itemsMobile: false,
                                    responsiveRefreshRate: 100
                                });
                            }

                            options.pagination = false;
                            options.paginationNumbers = false;
                            options.afterAction = syncPosition;

                            var $thumb = $('<div class="owl-list-thumb"><div class="list-thumb-content owl-carousel"></div></div>');

                            $.each($('.md-item-image ', self), function () {
                                var $template = $('<div class="image-thumb"><img src="" alt=""/></div>'),
                                    srcImage = $('img', this).attr('src');

                                $('img', $template).attr('src', srcImage);
                                $('.list-thumb-content', $thumb).append($template);
                            });

                            initThumbList($thumb);

                            $owlThumb.delegate(".owl-item", "click", function (e) {
                                e.preventDefault();
                                $('.image-slide-show', self).trigger("owl.goTo", $(this).data("owlItem"));
                            });

                            // handle window resize to re-init thumb list
                            var resizeTimeOut;
                            $(window).resize(function() {
                                if (resizeTimeOut)
                                    clearTimeout(resizeTimeOut);

                                resizeTimeOut = setTimeout(function() {
                                    initThumbList($thumb);
                                }, 100);
                            });

                            // add thumb list to document
                            data.positionnav == 'top' ? self.prepend($thumb) : self.append($thumb);
                            break;
                    }

                    if (data.showcontrols)
                        options.navigation = true;

                    if (options.autoPlay) {
                        options.beforeMove = function () {
                            if ($owlThumb)
                                $owlThumb.find('.active').css({duration: ''});
                        };
                        options.afterMove = function () {
                            $('.image-slide-show', self).find('.active').css({'animation-duration': data.transspeed + 'ms'});
                        };
                        options.autoPlay = data.speed;
                    }
                    if (data.stoponhover)
                        options.stopOnHover = true;
                    options = $.extend(defaults, options);
                    $('.image-slide-show', self).owlCarousel(options);
                }
            }, 100);
        });
    };
    $.fn.mdGallery = function () {
        $.each(this, function () {
            var self = $(this);

            if (!$('.md-item-image', self).hasClass('position-over')) {
                var $images = $('li.md-item-image', self),
                    columns = self.data('items-thumb'),
                    start = 0,
                    length = $images.length;

                // reset caption height
                $('.awe-image-caption', $images).css('height', '');

                // process height caption by row
                do {
                    var $rowImages = $images.slice(start, columns),
                        maxHeight = 0;

                    start = start + columns;

                    $rowImages.each(function() {
                        var height = $('.awe-image-caption', this).height();
                        if (height > maxHeight) {
                            maxHeight = height;
                        }
                    });
                    $('.awe-image-caption', $rowImages).height(maxHeight);
                }
                while (start < length-1);
            }

            self.magnificPopup({
                delegate: '.open-lightbox',
                type: 'image',
                removalDelay: 300,
                mainClass: 'mfp-fade',
                callbacks: {
                    open: function (item, data) {
                        var $container = $('.mfp-container'),
                            $content = $('.mfp-content', $container),
                            $listThumb = $('<div class="mdf-list-thumb"><div class="thumb-content"><div class="thumb-control"></div></div></div>'),
                            $thumbContent = $('.thumb-content', $listThumb),
                            $thumbControl = $('.thumb-control', $listThumb),
                            $listImage = $('.mgf-md-popup img', self),
                            itemThumb = parseInt(self.data('items-thumb')),
                            openListThumb = this.ev.data('enable-thumb');

                        // Add Navigation for list thumbnail
                        $thumbControl.append('<i class="ic ac-icon-arrow-left gallery-prev"></i><i class="ic ac-icon-arrow-right gallery-next"></i><input type="hidden" class="gallery-trigger"/>');
                        if (!$container.next('.mdf-list-thumb').length && openListThumb == true) {
                            $.each($listImage, function (index, img) {
                                var temp = $(img).clone();
                                $('.thumb-content', $listThumb).append(temp);
                            });
                            $content.after($listThumb);
                            // Event for thumbnail
                            $thumbContent.click(function (event) {
                                event.stopPropagation();
                            });
                            $thumbContent.change(function (event, data) {
                                if (data != undefined && typeof data.index == 'number') {
                                    var indexStart = data.index;
                                    $('img', $thumbContent).removeClass('img-show');
                                    $('img', $thumbContent).eq(indexStart).addClass('active');
                                    for (var i = 0; i < itemThumb; i++) {
                                        var tempIndex = indexStart + i;
                                        $('img', $thumbContent).eq(tempIndex).addClass('img-show');
                                    }
                                    var countShow = $('img.img-show', $thumbContent).length;
                                    if (countShow < itemThumb) {
                                        for (i = 0; i < itemThumb - countShow; i++) {
                                            tempIndex = indexStart - 1 - i;
                                            $('img', $thumbContent).eq(tempIndex).addClass('img-show');
                                        }
                                    }
                                }
                            });
                            // Click image thumbnail
                            $('img', $thumbContent).click(function () {
                                var index = $(this).index() - 1;
                                $(this).addClass('active');
                                $(this).siblings('img').removeClass('active');
                                $.magnificPopup.instance.goTo(index);
                            });
                            $('.gallery-trigger', $container).change(function (event, data) {
                                event.stopPropagation();
                                if (data != undefined && typeof data.index == 'number') {
                                    var index = data.index,
                                        $target = $('img', $thumbContent).eq(index);
                                    $target.addClass('active');
                                    $target.siblings('img').removeClass('active');
                                    if (!$target.hasClass('img-show')) {
                                        $thumbContent.trigger('change', {index: index});
                                    }
                                }
                            });
                            // Navigation next event image
                            $('.gallery-next', $thumbControl).click(function () {
                                if ($('.img-show:last', $thumbContent).index() == $('img', $thumbContent).length) {
                                    $('.gallery-trigger', $container).trigger('change', {index: 0, isNav: true});
                                    $('img.active', $thumbContent).removeClass('active');
                                }
                                else {
                                    var indexStart = $('img.img-show:last', $thumbContent).index(),
                                        total = $('img', $thumbContent).length;
                                    $('img.img-show', $thumbContent).removeClass('img-show');
                                    for (var i = 0; i < itemThumb; i++) {
                                        var tempIndex = indexStart + i;
                                        $('img', $thumbContent).eq(tempIndex).addClass('img-show');
                                    }
                                    if ($('.img-show', $thumbContent).length < itemThumb) {
                                        var count = $('.img-show', $thumbContent).length,
                                            indexFirst = $('.img-show:first', $thumbContent).index() - 1;
                                        for (i = 0; i < (itemThumb - count); i++) {
                                            var index = indexFirst - i - 1;
                                            $('img', $thumbContent).eq(index).addClass('img-show');
                                        }
                                    }
                                }
                            });
                            // Navigation previous event image
                            $('.gallery-prev', $thumbControl).click(function () {
                                if ($('.img-show:first', $thumbContent).index() == 1) {
                                    var indexNew = $('img', $thumbContent).length - itemThumb;
                                    $('.gallery-trigger', $container).trigger('change', {index: indexNew, isNav: true});
                                    $('img.active', $thumbContent).removeClass('active');
                                }
                                else {
                                    var indexEnd = $('img.img-show:first', $thumbContent).index() - 2;
                                    $('img.img-show', $thumbContent).removeClass('img-show');
                                    for (var i = 0; i < itemThumb; i++) {
                                        var tempIndex = indexEnd - i;
                                        if (tempIndex >= 0 || tempIndex <= $('img', $thumbContent) - 1)
                                            $('img', $thumbContent).eq(tempIndex).addClass('img-show');
                                    }
                                    if ($('.img-show', $thumbContent).length < itemThumb) {
                                        var count = $('.img-show', $thumbContent).length,
                                            indexLast = $('.img-show:last', $thumbContent).index() - 1;
                                        for (i = 0; i < (itemThumb - count); i++) {
                                            var index = indexLast + i + 1;
                                            $('img', $thumbContent).eq(index).addClass('img-show');
                                        }
                                    }
                                }
                            });
                        }
                    },
                    change: function (item) {
                        setTimeout(function () {
                            var $container = $('.mfp-container'),
                                $content = $('.thumb-content', $container),
                                $listThumb = $('.mdf-list-thumb', $container);

                            if (!self.isOpenThumb) {
                                self.isOpenThumb = true;
                                $content.trigger('change', {index: item.index})
                            }
                            $('.gallery-trigger', $container).trigger('change', {index: item.index});
                        }, 50);
                    },
                    markupParse: function (template, values, item) {
                        var $caption = $('.awe-image-caption', item.el),
                            isEnableCaption = this.ev.attr('data-enable-caption-on-lightbox');

                        if (isEnableCaption && isEnableCaption == 'true') {
                            values.description = $('<div />').html($caption.html()).css('color', $caption.css('color'));
                        }
                        else
                            values.description = '';
                    },
                    resize: function () {

                    },
                    close: function () {
                        self.isOpenThumb = false;
                    }
                },
                gallery: {enabled: true},
                image: {
                    headerFit: true,
                    captionFit: true,
                    preserveHeaderAndCaptionWidth: false,
                    markup: '<div class="mfp-figure">\
                            <div class="mfp-img"></div>\
                            <div class="mfp-description"></div>\
                            <div class="mfp-counter"></div>\
                        </div>'
                }
            });
        });
    };
    $.fn.mdImage = function () {
        $.each(this, function () {
            var self = $(this);
            self.magnificPopup({
                delegate: '.open-lightbox',
                type: 'image',
                removalDelay: 300,
                mainClass: 'mfp-fade',
                callbacks: {
                    markupParse: function (template, values, item) {
                        var $caption = $('.awe-image-caption', item.el);

                        if ($caption.attr('data-on-lightbox') == 'true')
                            values.title = $('<div />').html($caption.html()).css('color', $caption.css('color'));
                        else
                            values.title = '';
                    }
                },
                image: {
                    headerFit: true,
                    captionFit: true,
                    preserveHeaderAndCaptionWidth: false
                }
            })
        })
    };
    $.fn.mdFlickr = function () {
        $.each(this, function () {
            var self = $(this);
            self.magnificPopup({
                delegate: '.openlightbox',
                type: 'image',
                removalDelay: 300,
                mainClass: 'mfp-fade',
                gallery: {
                    enabled: true,
                    preload: [0, 2],
                    navigateByImgClick: true
                }
            });
        });
    };
    $.fn.mdProcessAnimation = function () {
        var elements = this,
            wh = $(window).height(),
            playedElements = 0;

        $(window).scroll(function() {
            if (playedElements < elements.length) {
                $.each(elements, function (index, el) {
                    var elTop = el.getBoundingClientRect().top;

                    if (elTop < wh && !$(el).data('awecontent-anim-played')) {
                        var self = $(el),
                            dataAnimation = self.data('animation'),
                            type = dataAnimation.type,
                            duration, delay, advance, className = '', classProperty = '';

                        if (type != 'none') {
                            duration = parseInt(dataAnimation.duration);
                            delay = parseInt(dataAnimation.delay);
                            className = 'ant-' + type;
                            if (dataAnimation.advance != undefined)
                                advance = dataAnimation.advance;
                            classProperty = fnClassProperty(type, advance)
                        }
                        if (type == 'spinin') {
                            var deg = 360 * parseInt(advance.numberOfSpin);
                            deg = advance.direction == 'clockwise' ? (-deg) : deg;
                            deg = 'rotate(' + deg + 'deg)';
                            self.css({
                                '-ms-transform': deg,
                                '-webkit-transform': deg,
                                'transform': deg
                            });
                        }
                        self.css({
                            'animation-duration': duration + 'ms',
                            'animation-delay': delay + 'ms'
                        });
                        self.addClass(className + ' ' + classProperty);

                        // increase number elements played
                        $(el).data('awecontent-anim-played', 1);
                        playedElements++;
                    }
                });
            }
        }).trigger('scroll');

        function fnClassProperty(type, advance) {
            var temp = '';
            switch (type) {
                case 'floatin' :
                    temp = 'proty-dir-' + advance;
                    break;
                case 'flyin' :
                    temp = 'proty-dir-distant-' + advance;
                    break;
                case 'turnin' :
                    temp = 'proty-dir-turn-' + advance;
                    break;
            }
            return temp;
        }
    };
    $.fn.mdParallax = function () {
        $.each(this, function () {
            $(this).parallax();
        });
    };
    $.fn.mdEventPlayer = function () {
        $.each(this, function () {
            var $self = $(this),
                $iframe = $self.prevAll('iframe'),
                id = $iframe.attr('id'),
                src = $iframe.attr('src'),
                $buttonPlay = $('a', $self),
                player, typeVideo, isPlay;
            if (src.indexOf('//www.youtube.com/embed') != -1)
                typeVideo = 'youtube';
            else if (src.indexOf('//player.vimeo.com/video') != -1)
                typeVideo = 'vimeo';
            $iframe[0].onload = function () {
                if (typeVideo == 'youtube') {
                    player = new YT.Player(id, {});
                    $self.click(function () {
                        isPlay = $buttonPlay.hasClass('pause-btn') ? true : false;
                        if (isPlay) {
                            player.pauseVideo();
                            $buttonPlay.removeClass('pause-btn').addClass('play-btn');
                        }
                        else {
                            player.playVideo();
                            $buttonPlay.removeClass('play--btn').addClass('pause-btn');
                        }
                    });
                }
                else if (typeVideo == 'vimeo') {
                    player = Froogaloop($iframe[0]);
                    $self.click(function () {
                        isPlay = $buttonPlay.hasClass('pause-btn') ? true : false;
                        if (isPlay) {
                            player.api('pause');
                            $buttonPlay.removeClass('pause-btn').addClass('play-btn');
                        }
                        else {
                            player.api('play');
                            $buttonPlay.removeClass('play--btn').addClass('pause-btn');
                        }
                    });
                }
            };

        });
    };
    $.fn.mdResizeBgVideo = function () {
        $.each(this, function () {
            var $self = $(this),
                $iframe = $('iframe', $self),
                height = $self.height(),
                width = $self.width(),
                ratio = 16 / 9,
                heightIframe = $iframe.height(),
                widthIframe = $iframe.width(),
                newWidth, newHeight, exp, top = 0, left = 0;
            if (width / height > ratio) {
                newHeight = height * width / widthIframe;
                newWidth = newHeight * ratio + 50;
                top = -(newHeight - height) / 2;
            }
            else {
                newWidth = widthIframe * height / heightIframe;
                newHeight = newWidth / ratio;
                left = -(newWidth - width) / 2
            }
            $iframe.css({
                position: 'absolute',
                width: newWidth + 'px',
                height: newHeight + 'px',
                top: top + 'px',
                left: left + 'px'
            });
        });
    };
    $.fn.mdTabs = function () {
        $.each(this, function () {
            $(this).tabs();
        });
    };
    $.fn.mdEqualHeight = function () {
        $.each(this, function () {
            var equalHeight = $(this).data('equalheight');
            if (equalHeight) {
                if ($('> .container > .row > .awe-col', this).length > 1) {
                    var $listCol = $('> .container > .row > .awe-col', this),
                        maxHeight = $listCol.eq(0).height(),
                        currentHeight;
                    $.each($listCol, function () {
                        currentHeight = $(this).height();
                        if (currentHeight > maxHeight)
                            maxHeight = currentHeight;
                    });
                    $.each($listCol, function () {
                        $(this).height(maxHeight);
                    })
                }
            }
        });
    }
    $.fn.awesectionFullscreen = function () {
        var self = this;
        init();

        $(window).resize(function () {
            init();
        });
        function init() {
            var wh = $(window).height(),
                menuHeight = $('.header-basic .main-header').height() || 0;

            $(self).height(wh-menuHeight);
        }

    }
})(jQuery);
;
/**
 * jQuery Plugin to obtain touch gestures from iPhone, iPod Touch and iPad, should also work with Android mobile phones (not tested yet!)
 * Common usage: wipe images (left and right to show the previous or next image)
 * 
 * @author Andreas Waltl, netCU Internetagentur (http://www.netcu.de)
 * @version 1.1.1 (9th December 2010) - fix bug (older IE's had problems)
 * @version 1.1 (1st September 2010) - support wipe up and wipe down
 * @version 1.0 (15th July 2010)
 */
(function ($) {
    $.fn.touchwipe = function (settings) {
        var config = {
            min_move_x: 20,
            min_move_y: 20,
            wipeLeft: function () {},
            wipeRight: function () {},
            wipeUp: function () {},
            wipeDown: function () {},
            preventDefaultEvents: true
        };
        if (settings) $.extend(config, settings);
        this.each(function () {
            var startX;
            var startY;
            var isMoving = false;

            function cancelTouch() {
                this.removeEventListener('touchmove', onTouchMove);
                startX = null;
                isMoving = false
            }
            function onTouchMove(e) {
                if (config.preventDefaultEvents) {
                    e.preventDefault()
                }
                if (isMoving) {
                    var x = e.touches[0].pageX;
                    var y = e.touches[0].pageY;
                    var dx = startX - x;
                    var dy = startY - y;
                    if (Math.abs(dx) >= config.min_move_x) {
                        cancelTouch();
                        if (dx > 0) {
                            config.wipeLeft()
                        } else {
                            config.wipeRight()
                        }
                    } else if (Math.abs(dy) >= config.min_move_y) {
                        cancelTouch();
                        if (dy > 0) {
                            config.wipeDown()
                        } else {
                            config.wipeUp()
                        }
                    }
                }
            }
            function onTouchStart(e) {
                if (e.touches.length == 1) {
                    startX = e.touches[0].pageX;
                    startY = e.touches[0].pageY;
                    isMoving = true;
                    this.addEventListener('touchmove', onTouchMove, false)
                }
            }
            if ('ontouchstart' in document.documentElement) {
                this.addEventListener('touchstart', onTouchStart, false)
            }
        });
        return this
    }
})(jQuery);;
/*
 * QueryLoader v2 - A simple script to create a preloader for images
 *
 * For instructions read the original post:
 * http://www.gayadesign.com/diy/queryloader2-preload-your-images-with-ease/
 *
 * Copyright (c) 2011 - Gaya Kessler
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Version:  2.5
 * Last update: 15-09-2013
 *
 */
(function($){
    $.queryLoader2 = function(el, options){
        var base = this;

        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;

        // Add a reverse reference to the DOM object
        base.$el.data("queryLoader2", base);

        //declare variables
        base.qLimageContainer = "";
        base.qLoverlay = "";
        base.qLbar = "";
        base.qLpercentage = "";
        base.qLimages = [];
        base.qLbgimages = [];
        base.qLimageCounter = 0;
        base.qLdone = 0;
        base.qLdestroyed = false;

        base.init = function(){

            base.options = $.extend({},$.queryLoader2.defaultOptions, options);

            //find images
            base.findImageInElement(base.el);
            if (base.options.deepSearch == true) {
                base.$el.find("*:not(script)").each(function() {
                    base.findImageInElement(this);
                });
            }

            //create containers
            base.createPreloadContainer();
            base.createOverlayLoader();
        };

        //the container where unbindable images will go
        base.createPreloadContainer = function() {
            base.qLimageContainer = $("<div></div>").appendTo("body").css({
                display: "none",
                width: 0,
                height: 0,
                overflow: "hidden"
            });

            //add background images for loading
            for (var i = 0; base.qLbgimages.length > i; i++) {
                $.ajax({
                    url: base.qLbgimages[i],
                    type: 'HEAD',
                    complete: function (data) {
                        if (!base.qLdestroyed) {
                            base.addImageForPreload(this['url']);
                        }
                    }
                });
            }
        };

        base.addImageForPreload = function(url) {
            var image = $("<img />").attr("src", url);
            //binding load before the DOM adding
            base.bindLoadEvent(image);
            image.appendTo(base.qLimageContainer);
        };

        //create the overlay
        base.createOverlayLoader = function () {
            var overlayPosition = "absolute";

            if (base.$el.prop("tagName") == "BODY") {
                overlayPosition = "fixed";
            } else {
                base.$el.css("position", "relative");
            }

            base.qLoverlay = $("<div id='" + base.options.overlayId + "'></div>").css({
                width: "100%",
                height: "100%",
                backgroundColor: base.options.backgroundColor,
                backgroundPosition: "fixed",
                position: overlayPosition,
                zIndex: 666999, //very high!
                top: 0,
                left: 0
            }).appendTo(base.$el);

            if(base.options.loadingBar == false) {
                base.qLoverlay.hide();
            }

            base.qLbar = $("<div id='qLbar'></div>").css({
                height: base.options.barHeight + "px",
                marginTop: "-" + (base.options.barHeight / 2) + "px",
                backgroundColor: base.options.barColor,
                width: "0%",
                position: "absolute",
                top: "50%"
            }).appendTo(base.qLoverlay);

            if (base.options.percentage == true) {
                base.qLpercentage = $("<div id='qLpercentage'></div>").text("0%").css({
                    height: "40px",
                    width: "100px",
                    position: "absolute",
                    fontSize: "3em",
                    top: "50%",
                    left: "50%",
                    marginTop: "-" + (59 + base.options.barHeight) + "px",
                    textAlign: "center",
                    marginLeft: "-50px",
                    color: base.options.barColor
                }).appendTo(base.qLoverlay);
            }

            if (!base.qLimages.length || (base.qLimageCounter == 0 && base.qLbgimages.length == 0)) {
                base.endLoader();
            }
        };

        //destroy all containers created by QueryLoader
        base.destroyContainers = function () {
            base.qLdestroyed = true;
            base.qLimageContainer.remove();
            base.qLoverlay.remove();
        };

        base.findImageInElement = function (element) {
            var url = "";
            var obj = $(element);
            var type = "normal";

            if (obj.css("background-image") != "none") {
                url = obj.css("background-image");
                type = "background";
            } else if (typeof(obj.attr("src")) != "undefined" && element.nodeName.toLowerCase() == "img") {
                url = obj.attr("src");
            }

            if (url.indexOf("gradient") == -1) {
                url = url.replace(/url\(\"/g, "");
                url = url.replace(/url\(/g, "");
                url = url.replace(/\"\)/g, "");
                url = url.replace(/\)/g, "");

                var urls = url.split(", ");

                for (var i = 0; i < urls.length; i++) {
                    if (urls[i].length > 0 && base.qLimages.indexOf(urls[i]) == -1 && !urls[i].match(/^(data:)/i)) {
                        var extra = "";

                        if (base.isIE() || base.isOpera()){
                            //filthy always no cache for IE, sorry peeps!
                            extra = "?rand=" + Math.random();
                            base.qLbgimages.push(urls[i] + extra);
                        } else {
                            if (type == "background") {
                                base.qLbgimages.push(urls[i]);
                            } else {
                                base.bindLoadEvent(obj);
                            }
                        }

                        base.qLimages.push(urls[i]);
                    }
                }
            }
        }

        base.isIE = function () {
            return navigator.userAgent.match(/msie/i);
        };

        base.isOpera = function () {
            return navigator.userAgent.match(/Opera/i);
        };

        base.bindLoadEvent = function (element) {
            if(!element[0].complete) {
                base.qLimageCounter++;
                element.bind("load error", function () {
                    base.completeImageLoading(this);
                });
            }
        }

        base.completeImageLoading = function (el) {
            base.qLdone++;
            var percentage = (base.qLdone / base.qLimageCounter) * 100;
            base.qLbar.stop().animate({
                width: percentage + "%",
                minWidth: percentage + "%"
            }, 200);

            if (base.options.percentage == true) {
                base.qLpercentage.text(Math.ceil(percentage) + "%");
            }

            if (base.qLdone == base.qLimageCounter) {
                base.endLoader();
            }
        };

        base.endLoader = function () {
            base.qLdestroyed = true;
            base.onLoadComplete();
        };

        base.onLoadComplete = function() {
            if (base.options.percentage == true) {
                base.qLpercentage.text("100%");
            }
            if (base.options.completeAnimation == "grow") {
                var animationTime = 500;

                base.qLbar.stop().animate({
                    "width": "100%"
                }, animationTime, function () {
                    $(this).animate({
                        top: "0%",
                        width: "100%",
                        height: "100%"
                    }, 500, function () {
                        $('#' + base.options.overlayId).fadeOut(500, function () {
                            $(this).remove();
                            base.destroyContainers();
                            base.options.onComplete();
                        })
                    });
                });
            } else {
                $('#' + base.options.overlayId).fadeOut(500, function () {
                    $('#' + base.options.overlayId).remove();
                    base.destroyContainers();
                    base.options.onComplete();
                });
            }
        }

        // Run initializer
        base.init();
    };

    //The default options
    $.queryLoader2.defaultOptions = {
        onComplete: function() {},
        backgroundColor: "#000",
        barColor: "#fff",
        overlayId: 'qLoverlay',
        barHeight: 1,
        loadingBar: true,
        percentage: false,
        deepSearch: true,
        completeAnimation: "fade",
        minimumTime: 500
    };

    //function binder
    $.fn.queryLoader2 = function(options){
        return this.each(function(){
            (new $.queryLoader2(this, options));
        });
    };
})(jQuery);

//HERE COMES THE IE SHITSTORM
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (elt /*, from*/) {
        var len = this.length >>> 0;
        var from = Number(arguments[1]) || 0;
        from = (from < 0)
            ? Math.ceil(from)
            : Math.floor(from);
        if (from < 0)
            from += len;

        for (; from < len; from++) {
            if (from in this &&
                this[from] === elt)
                return from;
        }
        return -1;
    };
};
/**
 * File: fullscreen-loader.js
 *
 * Contains code to execute preloader for fullscreen slider. And only run with jQuery from 1.7
 */
(function ($) {
    $.fn.fullScreenLoader = function (fullScreenSlider) {

        $(this).queryLoader2({
            barColor: "#6e6d73",
            backgroundColor: "#fff1b0",
            percentage: true,
            loadingBar: true,
            barHeight: 1,
            completeAnimation: "grow",
            minimumTime: 100,
            onComplete: function () {
                fullScreenSlider.preloadCompete();
            }
        });
    }
})(jQuery)
;
