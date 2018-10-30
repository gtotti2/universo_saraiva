(function () {
    var string = document.URL.split('/')
    if (string[2] == "localhost:8080") {
        var data_json = `./assets/js/data.json?${new Date().getTime()}`
    } else {
        var data_json = `https://images.livrariasaraiva.com.br/estatico/2018/site/universo-saraiva/assets/js/data.json?${new Date().getTime()}`
    }
    var requestData = () => {
        $.ajax({
            url: data_json,
            dataType: "json"
        }).done(function (data) {
            buildSections(data.section)
            defineSectionsConfigs(data)
        })
    }
    var loadSlicks = (slider) => {
        var options = $(slider).data('options')
        $(slider).slick(options)
    }

    var loadMasonry = (slider) => {
        var options = {
            itemSelector: '.grid-item',
            columnWidth: '.grid-sizer',
            gutter: '.gutter-sizer',
            percentPosition: true
        }
        var $grid = new Masonry(slider[0], options)
        if ($grid._isLayoutInited) {
            $grid.layout()
            $($grid.element).css('max-height', '510px')
        }
        loadMoreButton($($grid.element).next('a.load-more'))

    }

    var buildSections = (sections) => {
        var lastSection = $('section').last()
        for (const section in sections) {
            estruturaFlex(section, sections[section].config.tipo)

            function estruturaFlex(key, tipo) {

                var sectionClass = tipo == key ? key : `${tipo} ${key}`

                let marcas = `<section nav-link="${key}" class="${sectionClass}" style="order:${sections[section].config.position};"><div class="container"><h2>${sections[section].config.nome}</h2><div class="row brands"></div></div></section>`
                let botoes = `<section nav-link="${key}" class="${sectionClass}" style="order:${sections[section].config.position};"><div class="container"><h2>${sections[section].config.nome}</h2><div class="row"><div class="links"></div></div></div></section>`
                //let listas = `<section nav-link="${key}" class="${sectionClass}" style="order:${sections[section].config.position};"><div class="container"><h2>${sections[section].config.nome}</h2><div class="row"><div class="col"><div class="slider" data-options='{"variableWidth":true,"slidesToScroll": 4,"infinite": true}'></div></div></div></div></section>`
                let topo = `<section class="${sectionClass}" nav-link="${key}" style="order:${sections[section].config.position};"><div class="container-fluid"><div class="row"><div class="col-12 col-md-4"><div class="content"><img class="img-fluid" src="${sections[section].config.logo}"alt=""></div></div><div class="col-12 col-md-8"><div class="content"><h2>${sections[section].config.nome}</h2><div class="row sliders"></div></div></div></div></div></section>`
                let masonry = `<section nav-link="${key}" class="${sectionClass}" style="order:${sections[section].config.position};"><div class="container"><h2>${sections[section].config.nome}</h2><div class="row"><div class="col"><div class="grid"><div class="grid-sizer"></div><div class="gutter-sizer"></div></div><a class="load-more" href="#">VER MAIS</a></div></div></div></section>`
                let listas = `<section nav-link="${key}" class="${sectionClass}" style="order:${sections[section].config.position};"><div class="container"><h2>${sections[section].config.nome}</h2><div class="row"><div class="col"><div class="grid"><div class="grid-sizer"></div><div class="gutter-sizer"></div></div><a class="load-more" href="#">VER MAIS</a></div></div></div></section>`


                // if (tipo == "listas") {
                //     $(listas).insertAfter(lastSection)
                //     loadListas(sections, key)
                // } else 
                if (tipo == "listas") {
                    $(listas).insertAfter(lastSection)
                    loadGrids(sections, key)
                } else if (tipo == "marcas") {
                    $(marcas).insertAfter(lastSection)
                    loadBrands(sections, key)
                } else if (tipo == "botoes") {
                    $(botoes).insertAfter(lastSection)
                    loadLinks(sections, key)
                } else if (tipo == "topo") {
                    $(topo).insertAfter(lastSection)
                    loadSliders(sections, key)
                } else if (tipo == "masonry") {
                    $(masonry).insertAfter(lastSection)
                    loadGrids(sections, key)
                }
            }
        }
    }

    var defineSectionsConfigs = (data) => {
        for (const i in data.section) {
            $(`section.${i}`).addClass(data.section[i].config.color)
        }
    }

    var loadSliders = (data, key) => {
        itemsProcessed = 0;
        data[key].sliders.forEach((element, index) => {
            itemsProcessed++
            var slide = (data) => {
                var slideHtml = "";
                data.slides.forEach(slide => {
                    slideHtml += `
                    <div class="slide">
                        <a href="${slide.href}">
                            <div class="slide__content">
                                <img class="img-fluid" src="${slide.img}"
                                alt="star_wars">
                                <p>${slide.titulo}</p>
                            </div>
                        </a>
                    </div>`
                });
                return slideHtml
            }
            var slider = `
            <div class="col col-lg-6">
                <div class="slider" data-options="{}" data-category="${data[key].sliders[index].category}">
                    ${slide(element)}
                </div>
            </div>`
            $(`${slider}`).appendTo(`.${data[key].config.tipo} .row.sliders`)

        });
        if (itemsProcessed === data[key].sliders.length) {
            loadSlicks($(`.${data[key].config.tipo} .row.sliders .slider`))
        }
    }

    var loadSliders = (data, key) => {
        itemsProcessed = 0;
        data[key].sliders.forEach((element, index) => {
            itemsProcessed++
            var slide = (data) => {
                var slideHtml = "";
                data.slides.forEach(slide => {
                    slideHtml += `
                    <div class="slide">
                        <a href="${slide.href}">
                            <div class="slide__content">
                                <img class="img-fluid" src="${slide.img}"
                                alt="star_wars">
                                <p>${slide.titulo}</p>
                            </div>
                        </a>
                    </div>`
                });
                return slideHtml
            }
            var slider = `
            <div class="col col-lg-6">
                <div class="slider" data-options="{}" data-category="${data[key].sliders[index].category}">
                    ${slide(element)}
                </div>
            </div>`
            $(`${slider}`).appendTo(`.${data[key].config.tipo} .row.sliders`)

        });
        if (itemsProcessed === data[key].sliders.length) {
            loadSlicks($(`.${data[key].config.tipo} .row.sliders .slider`))
        }
    }


    var loadLinks = (data, key) => {
        data[key].links.forEach(element => {
            $(`<div class="link"><a href="${element.href}">${element.nome}</a></div>`).appendTo(`.${key} .links`)
        });
    }

    var loadBrands = (data, chave) => {
        var brands = (tipo) => {
            var retorno = ``
            for (const key in tipo.links) {
                if (tipo.links.hasOwnProperty(key)) {
                    const element = tipo.links[key];
                    retorno += `<li><a href="${element.href}">${element.nome}</a></li>`
                }
            }
            return retorno
        }
        var object = data[chave].boxes
        for (const key in object) {
            if (object.hasOwnProperty(key)) {
                var estrutura = `
                    <div class="col-lg-6">
                        <div class="box__marcas">
                            <div class="container">
                                <div class="row">
                                    <div class="marca col-12 col-sm-3">
                                        <span class="${key}"><i></i>${key.charAt(0).toUpperCase()}${key.substring(1)}</span>
                                    </div>
                                    <div class="marcas col-12 col-sm-9">
                                        <ul>
                                            ${brands(object[key])}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`
                $(`${estrutura}`).appendTo(`.${data[chave].config.tipo} .row.brands`)
            }
        }
    }



    var loadListas = (data, chave) => {

        var lista = (array) => {
            var retorno = ``
            array.forEach(element => {
                retorno += `<li><a href="${element.href}">${element.nome}</a></li>`
            });
            return retorno
        }
        for (const key in data[chave].letras) {
            if (data[chave].letras.hasOwnProperty(key)) {
                const element = data[chave].letras[key]
                var estrutura = `<div class="slide"><div class="${key} lista"><ul>${lista(data[chave].letras[key])}</ul><h3>${key}</h3></div></div>`
                if (data[chave].letras[key].length) {
                    $(`.${chave} .slider`).append(estrutura)
                }
            }
        }
        loadSlicks($(`.${chave} .slider`))
    }

    var loadGrids = (data, chave) => {

        var lista = (array) => {
            var retorno = ``
            array.forEach(element => {
                retorno += `<li><a href="${element.href}">${element.nome}</a></li>`
            });
            return retorno
        }

        var letrasProcessadas = 0;
        var letrasLength = Object.keys(data[chave].letras).length
        for (const key in data[chave].letras) {
            letrasProcessadas++;
            var estrutura = `<div class="grid-item"><div class="${key} lista"><ul>${lista(data[chave].letras[key])}</ul><h3>${key}</h3></div></div>`

            //if (data[chave].letras[key].length) {
            $(`.${chave} .grid`).append(estrutura)
            //}

        }
        if (letrasProcessadas == letrasLength) {
            loadMasonry(document.querySelectorAll(`.${chave} .grid`))
        }

    }

    requestData()

    var loadMoreButton = (element) => {
        $(element).on("click", function (e) {
            e.preventDefault()
            $this = $(this)

            var animateWindow = () => {
                $("html, body").animate({ scrollTop: $this.prev('.grid').offset().top - 250 }, 500)
            }

            if (!$this.hasClass('see_more')) {
                $this.text('Ver menos').addClass('see_more').prev('.grid').animate({
                    maxHeight: $this.prev('.grid')[0].scrollHeight
                }, 1500, function () {
                    animateWindow()
                });
            } else {
                $this.text('Ver mais').removeClass('see_more').prev('.grid').animate({
                    maxHeight: '538px'
                }, 1500, function () {
                    animateWindow()
                })
            }

        })
    }




})();