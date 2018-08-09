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
            listasSlides(data)
        })
    }
    var loadSlicks = (slider) => {
        var options = $(slider).data('options')
        $(slider).slick(options)
    }

    var buildSections = (sections) => {
        var lastSection = $('section').last()
        for (const section in sections) {
            estruturaFlex(section, sections[section].config.tipo)
            
            function estruturaFlex(key, tipo) {

                var sectionClass = tipo == key ? key : `${tipo} ${key}`

                let marcas = `<section nav-link="${sectionClass}" class="${sectionClass}" style="order:${sections[section].config.position};"><div class="container-fluid"><h2>${sections[section].config.nome}</h2><div class="row links"></div></div></section>`
                let botoes = `<section nav-link="${sectionClass}" class="${sectionClass}" style="order:${sections[section].config.position};"><div class="container"><h2>${sections[section].config.nome}</h2><div class="row"><div class="links"></div></div></div></section>`
                let listas = `<section nav-link="${sectionClass}" class="${sectionClass}" style="order:${sections[section].config.position};"><div class="container"><h2>${sections[section].config.nome}</h2><div class="row"><div class="col"><div class="slider" data-options='{"variableWidth":true,"slidesToScroll": 4,"infinite": true}'></div></div></div></div></section>`
                let topo = ``

                if (tipo == "listas") {
                    $(listas).insertAfter(lastSection)
                } else if (tipo == "marcas") {
                    $(marcas).insertAfter(lastSection)
                    loadBrands(sections, key)
                } else if (tipo == "botoes") {
                    $(botoes).insertAfter(lastSection)
                    loadLinks(sections, key)
                }
            }
        }
    }

    var defineSectionsConfigs = (data) => {
        for (const i in data.section) {
            $(`section.${i}`).addClass(data.section[i].config.color)
        }
    }


    var loadLinks = (data, key) => {
        console.log(data)
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
                          <div class="container-fluid">
                              <div class="row">
                                  <div class="marca col-3">
                                      <span class="${key}"><i></i>${key.charAt(0).toUpperCase()}${key.substring(1)}</span>
                                  </div>
                                  <div class="marcas col-9">
                                      <ul>
                                        ${brands(object[key])}
                                      </ul>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>`
                $(`${estrutura}`).appendTo(`.${data[chave].config.tipo} .row.links`)
            }
        }
    }


    var listasSlides = (data) => {
        var listOfKeys = []
        for (const key in data.section) {
            if (data.section.hasOwnProperty(key)) {
                const element = data.section[key];
                if (element.config.isSlider) {
                    listOfKeys.push(key)
                }
            }
        }
        loadListas(listOfKeys, data)
    }


    var loadListas = (chave, data) => {
        var itemsProcessed = 0;
        chave.forEach((element, index, array) => {
            itemsProcessed++;
            for (const key in data.section[element].letras) {
                var lista = (array) => {
                    var retorno = ``
                    array.forEach(element => {
                        retorno += `<li><a href="${element.href}">${element.nome}</a></li>`
                    });
                    return retorno
                }
                var estrutura = `<div class="slide"><div class="${key} lista"><ul>${lista(data.section[element].letras[key])}</ul><h3>${key}</h3></div></div>`
                $(`.${element} .slider`).append(estrutura)
            }
            if (itemsProcessed === array.length) {
                loadSlicks($(`.${data.section.editoras.config.tipo} .slider`))
            }
        });
    }

    requestData()
    loadSlicks($('.topo .slider'))


})();