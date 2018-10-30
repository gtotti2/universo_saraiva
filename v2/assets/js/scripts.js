(function () {

    var $ = jQuery;

    var secoes = []
    var buildCategories = (section, categorias, infoSecao) => {
        var categoriesOutput = []

        categorias.forEach(element => {
            //categorias.sort((a, b) => (a > b) ? 1 : ((b > a) ? -1 : 0)).forEach(element => {
            var divs = `<a class="col-auto" style="border-color: ${infoSecao.tema_cor};" data-color="${infoSecao.tema_cor}" data-category="${element.replace(/\s/g, '').toLowerCase()}" href="#">${element}</a>`
            categoriesOutput.push(divs)
        });
        categoriesOutput.length ? $($(`<div data-filter="categories" data-filter-selected="Todas" class="d-none d-lg-flex categories row"><a class="active col-auto" style="color: ${infoSecao.tema_cor};" data-color="${infoSecao.tema_cor}" data-category="todas" " href="#">Todas</a></div>`)).append(categoriesOutput.join('')).insertBefore($(section).find('.items.row')) : ''
    }
    var buildLetters = (section, infoSecao) => {
        var items = $(section).find('.titulo')
        var letras = []

        items.map(function (index, item) {

            var charIsNumber = !isNaN($(item).find('a').text().charAt(0).toLowerCase())
            var possuiLetraNoArray = $.inArray($(item).find('a').text().charAt(0).toLowerCase(), letras) === -1
            var possuiNumeroNoArray = $.inArray('#', letras) === -1
            possuiLetraNoArray ? charIsNumber ? possuiNumeroNoArray ? letras.push('#') : '' : letras.push($(item).find('a').text().charAt(0).toLowerCase()) : ''
        })

        var divsLetras = letras.map(function (letra) {
            return `<a class="col-auto" data-color="${infoSecao.tema_cor}" data-letter="${letra}" href="#">${letra}</a>`
        })
        $($(`<div data-filter="letters" data-filter-selected="Todas" class="d-none d-lg-flex letters row"><a class="active col-auto" style="color: ${infoSecao.tema_cor};" data-color="${infoSecao.tema_cor}" data-letter="todas" href="#" >Todas</a></div>`)).append(divsLetras.join('')).insertBefore($(section).find('.items.row'))
    }
    var index = 0;
    var buildDivsInto = (section, data, categorias) => {

        var infos = [];
        data.sort((a, b) => (a.gsx$nome.$t > b.gsx$nome.$t) ? 1 : ((b.gsx$nome.$t > a.gsx$nome.$t) ? -1 : 0)).forEach(element => {
            element.categorias = []

            var filtered = Object.keys(element).filter(function (value) {
                var valueFiltered = value.split('gsx$')[1]

                //
                return value.includes('gsx$') ? element.categorias[valueFiltered] = element[value].$t : ''
            })

            var categories = (categories) => {
                var categoriesButton = {}
                for (const chave in categories) {
                    if (categories[chave] == "TRUE") {
                        categoriesButton[chave] = categories[chave]
                    }
                }
                return Object.keys(categoriesButton).length ? JSON.stringify(categoriesButton) : ""
            }
            var info = element.categorias.nome ? `<div class="col-sm-6 col-md-4 col-lg-2 titulo" data-category='${categories(element.categorias)}'><a href="${element.categorias.url}" title="${element.categorias.nome}">${element.categorias.nome}</a></div>` : ''

            element.title.$t ? infos.push(info) : ''
        });
        var joined = $(infos.join(''))
        var wrapped = $($('<div class="items row"></div>')).append(joined).appendTo($(section).find('.container'))

        if (data.length > 24) {
            $('<div class="row box__ver_mais justify-content-center d-flex"><div class="col-auto"><a href="#">Ver mais</a></div></div>').insertAfter(wrapped);
            $('.box__ver_mais a').click((e) => {
                e.preventDefault();
                $(e.target).addClass('disabled').closest('.container').find('.items').css('max-height', '100%')
            })
        }


    }

    var categoriesLettersData = []


    var buildToolsSections = (secao, index, categorias, infoSecao) => {
        if ($(secao).attr('tipo') == "categorias") {
            buildCategories($(secao), categorias, infoSecao)
        } else if ($(secao).attr('tipo') == "letras") {
            buildLetters($(secao), infoSecao)
        }

        var hasFilter = $(secao).find('[data-filter]').length
        var sectionFilter = $(secao).find('[data-filter]')
        var sectionFilterOptions = $(secao).find('[data-filter]')

        var sectionClass = $(secao).hasClass('secao') ? $(secao).attr('class').split(/\s+/)[1] : ''


        var index = 0

        var builSelectObject = (section) => {
            index++;

            categoriesLettersData[sectionClass] = []
            $(sectionFilter).children().each((index, element) => {
                categoriesLettersData[sectionClass][index] = {
                    text: $(element).text().charAt(0).toUpperCase() + $(element).text().substr(1),
                    id: index,
                    value: $(element).text().charAt(0).toUpperCase() + $(element).text().substr(1),
                }
            })

            $('<div class="row select__filter d-block d-lg-none"><div class="col-auto"><select style="width: 100%;" class="col-auto"></select></div></div>').insertAfter(sectionFilter)
            $(secao).find('.select__filter select').select2({ data: categoriesLettersData[sectionClass] })
            $(secao).find('.select__filter select').on("change.select2", function (e) {

                var value = $(e.target).find(`:eq(${$(this).val()})`).text().replace(/\s/g, '').toLowerCase()
                var dataTipo = infoSecao.tipo != "letras" ? "data-category" : "data-letter"
                $(this).closest('.section').find(`[data-filter] a[${dataTipo}="${value}"]`).trigger('click');
            });
            var itemsDiv = $(section).find('.items')


        }
        hasFilter > 0 ? builSelectObject($(secao)) : ''
    }

    var buildSections = (secao, infoSecao) => {

        var sectionsDiv = []
        $.getJSON(secao.url, function (data) {
            info = data.feed.entry
            var classNameWithoutSpaces = secao.nome.replace(/\s/g, '_').toLowerCase()
            var section = `
                <section nav-link="${classNameWithoutSpaces}" style="order:${infoSecao.ordem};background: ${infoSecao.bg_secao};" data-color="${infoSecao.bg_secao}" tipo="${infoSecao.tipo}" class="section section__${classNameWithoutSpaces} section__${infoSecao.tipo_link.toLowerCase()}">
                    <div class="container">
                        <div class="row">
                            <div class="col">
                                <h2 style="border-color: ${infoSecao.tema_cor};">${secao.nome.toLowerCase()}</h2>
                            </div>
                        </div>
                    </div>
                </section>`
            sectionsDiv.push(section)
            $(sectionsDiv.join('')).appendTo('.universo_saraiva');
        }).then(function (info) {
            index++

            var classNameWithoutSpaces = info.feed.title.$t.replace(/\s/g, '_').toLowerCase()
            buildDivsInto($(`.universo_saraiva > .section__${classNameWithoutSpaces}`), info.feed.entry, infoSecao.categorias)
            buildToolsSections($(`.universo_saraiva > .section__${classNameWithoutSpaces}`), index, infoSecao.categorias, infoSecao)

        }).done(function (info) {

            $(`.header__menu [data-nav="${window.location.search.split('?')[1]}"]`).trigger('click')
        })

    }

    var buildTopo = (secao, infoSecao) => {

        var items = []
        var assuntos = []
        var topoEstrutura = $(`<section style="order: ${infoSecao.ordem};" class="section section__topo">
            <div class="container">
                <div class="row">
                    <div class="col-12 col-md-4 d-flex align-items-start justify-content-center">
                        <div class="content"><img class="img-fluid" src="https://images.livrariasaraiva.com.br/estatico/2018/site/universo-saraiva/assets/img/logo_universo.png" alt="Universo Saraiva"></div>
                    </div>
                    <div class="col-12 col-md-8 d-flex align-items-center justify-content-center">
                        <div class="content">
                            <div class="row items"></div>
                            <h2>Veja nossos destaques por assuntos de interesse</h2> 
                            <div class="row assuntos">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>`).insertAfter('.universo_saraiva > .header')

        $.getJSON('https://spreadsheets.google.com/feeds/list/1vFOcYcAm3eSQc-B2aY2cQ9kqWtG4pnAXVjC87xwFCQE/ompyumj/public/values?alt=json', function (data) {
            data.feed.entry.forEach((element, index) => {
                items[index] = {
                    "nome": element.gsx$seção.$t,
                    "tema_cor": element.gsx$cordacategoria.$t
                }
            });
            var itemsVisiveis = items.filter(item => item.nome != "Topo")
            itemsVisiveis.map((item) => $(`<div class="col-6 col col-lg-4 col-xl-3 item"><a href="#" style="background-color :${item.tema_cor};" data-content="${item.nome}" data-link="${item.nome.replace(/\s/g, '_').toLowerCase()}" class="button__${item.nome.replace(/\s/g, '_').toLowerCase()}"></a></div>`).appendTo('.section__topo .items'))
        })


        $.getJSON(secao.url, function (data) {
            data.feed.entry.forEach((element, index) => {
                assuntos[index] = {
                    "nome": element.gsx$título.$t,
                    "img": element.gsx$imagem.$t,
                    "url": element.gsx$url.$t
                }
            })


            assuntos.map((assunto) => $(`<div class="col-6 col col-lg-4 col-xl-3 assunto"><div class="row flex-row align-items-center"><a href="#" class="d-flex align-items-center flex-wrap justify-content-center flex-row"><div class="col-auto"><img class="img-fluid" src="${assunto.img}"/></div><div class="col-auto"><p>${assunto.nome}</p></div></a></div></div>`).appendTo('.section__topo .assuntos'))
            $('.section__topo .item a').click(function (e) {
                e.preventDefault()
                var data_url = $(this).data('link')
                $(`.header__menu [data-nav="${data_url}"] a`).trigger('click')
            })
        })


    }


    $(document).ready(function (e) {


        $('.universo_saraiva').on('click', '[data-filter] a', function (e) {
            e.preventDefault()
            $(this).text() != "Todas" ? $(this).closest('section').find('.box__ver_mais').removeClass('d-flex') : $(this).closest('section').find('.box__ver_mais').addClass('d-flex')

            $(this).addClass('active').css('color', $(this).data('color')).siblings().removeClass('active').css('color', 'initial').closest('[data-filter]').attr('data-filter-selected', $(this).text())
            var items = $(this).closest('.row').siblings('.items'),
                tipoFilter = $(this).closest('[data-filter]').data('filter'),
                filterCategory = $(this).data('category')
            filterLetter = $(this).data('letter')


            var filters = {
                categories: function () {
                    var isAll = filterCategory == "todas";
                    return isAll ? $(items).find(`[data-category]`) : $(items).find(`[data-category*='${filterCategory}']`)
                },
                letters: function () {
                    var itemsShow = $(items).find(`.titulo > a`).filter(function (item, element) {
                        var isAll = filterLetter == "todas";
                        var isLetter = filterLetter != "#"
                        var elementTextIsNumber = !isNaN($(element).text().toLowerCase().charAt(0))
                        return isAll ? $(element) : isLetter ? $(element).text().toLowerCase().charAt(0) == filterLetter ? $(element) : '' : elementTextIsNumber ? $(element) : ''
                    })
                    return $(itemsShow).parent()
                }
            }
            filterValue = filters[tipoFilter];
            items.isotope({ filter: filterValue() });

        })


        $.getJSON("https://spreadsheets.google.com/feeds/worksheets/1vFOcYcAm3eSQc-B2aY2cQ9kqWtG4pnAXVjC87xwFCQE/public/values?alt=json", function (data) {

            data.feed.entry.map((element, index) => {
                secoes[index] = {
                    "nome": element.title.$t,
                    "url": `${element.link[0].href}?alt=json`,
                    "ordem": index
                }
            })
        }).then(function (data) {
            var infoSection = [];

            $.getJSON("https://spreadsheets.google.com/feeds/list/1vFOcYcAm3eSQc-B2aY2cQ9kqWtG4pnAXVjC87xwFCQE/ompyumj/public/values?alt=json", function (data) {
                data.feed.entry.map(function (section, index) {
                    var categories = Object.keys(section).filter(key => {
                        return key.includes('gsx$categorias') && section[key].$t != ""
                    })
                    categoriasFiltradas = categories.map((value) => {
                        return section[value].$t
                    })
                    infoSection[index] = {
                        "nome": section.title.$t,
                        "tipo": section.gsx$tipo.$t,
                        "tipo_link": section.gsx$tipodolink.$t,
                        "bg_secao": section.gsx$bgdaseção.$t,
                        "tema_cor": section.gsx$cordacategoria.$t,
                        "ordem": secoes[index].ordem,
                        "categorias": section.gsx$tipo.$t == "categorias" ? categoriasFiltradas : ''
                    }
                    secoes[index].nome != "Topo" ? buildSections(secoes[index], infoSection[index]) : buildTopo(secoes[index], infoSection[index])

                })

            })


        })

    })

})()