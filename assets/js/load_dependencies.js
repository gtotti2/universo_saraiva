function load_dependencies(params) {

    $ = jQuery
    var string = document.URL.split('/')

    var listOfDependencies = params
    
    var head = document.getElementsByTagName('head')[0];
    var body = document.getElementsByTagName('body')[0];


    for (dependencies in listOfDependencies) {
        console.log(string[2].indexOf('localhost:8080') !== -1)
        
        if (string[2].indexOf('localhost:8080') !== -1) {
            var elementFiltered = listOfDependencies[dependencies].split(listOfDependencies.path_s3)
            elementFiltered.length > 1 ? elementFiltered = `./${elementFiltered[1]}` : elementFiltered = elementFiltered[0]
            addParameterToEachDependencies(elementFiltered.split('.'))
        } else {
            var elementType = listOfDependencies[dependencies].split('.')
            addParameterToEachDependencies(elementType)
        }

        function addParameterToEachDependencies(pattern) {
            if (pattern[pattern.length - 1] == "css") {
                var css = document.createElement('link');
                css.rel = "stylesheet";
                css.href = `${pattern.join('.')}?${new Date().getTime()}`
                head.appendChild(css);
            } else if (pattern[pattern.length - 1] == "js") {
                var js = document.createElement('script');
                js.src = `${pattern.join('.')}?${new Date().getTime()}`
                body.appendChild(js);
            }
        }

    }
}
load_dependencies(params)



