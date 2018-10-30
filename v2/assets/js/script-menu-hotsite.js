
var $ = jQuery;
$(document).ready(function (e) {

    function montarMenu() {
        var headerOptions = $('.hotsite__saraiva > .header')
        var isSite = $('.cms-page-view header').length
        console.log(isSite)
        var headerMenu = isSite ? $('.cms-page-view header .header__hotsite_menu') : $('.hotsite__saraiva > .header')
        var headerSite = isSite ? $('.cms-page-view header') : $('.hotsite__saraiva > .header')

        var links = headerOptions.data('links')
        var estrutura = $(`
        <div class="header__hotsite_menu" style="background-color: ${headerOptions.attr('background')};">
            <div class="v--center">
                <div class="header__logo">
                    <h1 style="color: ${headerOptions.attr('font-color')};">${headerOptions.attr('nome')}</h1>
                </div>
                <div class="header__menu">
                    <nav class="menu">
                        <div>
                            <ul>
                            </ul>
                        </div>
                    </nav>
                    <button class="menu-button">
                        <span style="color: ${headerOptions.attr('font-color')};">Menu</span>
                    </button>
                </div>
            </div>
        </div>`)
        headerSite.append(estrutura)
        var ulMenu = headerSite.find('.menu ul')
        var li;
        headerSite.find('.header__logo h1').click(function (e) {
            $("html, body").animate({ scrollTop: 0 }, 500);
        });
        links.forEach(element => {
            li = $(`<li data-nav="${element.href}">
            <a style="color: ${headerOptions.attr('font-color')};" href="#">${element.nome}</a>
        </li>`)
            ulMenu.append(li)
        });

    }
    $('.hotsite__saraiva .header').length ? montarMenu() : ''

    $('.menu-button').click(function () {
        var bodyClosest = $(this).closest('body')
        bodyClosest.hasClass('header__menu--show') && $(this).closest('.header__menu').hasClass('active') ? (bodyClosest.removeClass('header__menu--show'), $(this).closest('.header__menu').removeClass('active')) : (bodyClosest.addClass('header__menu--show'), $(this).closest('.header__menu').addClass('active'))
    })
    $('.menu li > a').click(function (e) {
        e.preventDefault()
        var thisHeaderHeight = $(this).closest('.header').outerHeight(),
            idHeader = $('#header').length ? $('#header').outerHeight() : "",
            secaoTopo = $(`[nav-link="${$(e.target).parent().data('nav')}"]`).offset().top,
            scrollTopAnimate = secaoTopo - (idHeader + thisHeaderHeight)
        $("html, body").animate({ scrollTop: scrollTopAnimate }, 500);
        $(window).width() < 1024 ? $('.menu-button').trigger('click') : ''
    })


    $(window).on('resize scroll', function (e) {

        function getVisible(element) {
            var $el = $(element),
                scrollTop = $(this).scrollTop(),
                scrollBot = scrollTop + $(this).height(),
                elTop = $el.offset().top,
                elBottom = elTop + $el.outerHeight(),
                visibleTop = elTop < scrollTop ? scrollTop : elTop,
                visibleBottom = elBottom > scrollBot ? scrollBot : elBottom;
            return visibleBottom - visibleTop;
        }


        if (e.type == "resize") {
            $(this).width() > 1023 && $('body').hasClass('header__menu--show') ? $('body > div').trigger('click') : null
        }


    })



})