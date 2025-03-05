var orientacion = "Horizontal";
var no_total_cortes;

$(document).ready(function() {

    $('#orientacion_v').click(function(e) {
        e.preventDefault();
        
        if(validarForma() === 1){
            orientacion = "Vertical";
            var b = Math.max($("#papel_ancho").val(),$("#papel_largo").val());
            var h = Math.min($("#papel_ancho").val(),$("#papel_largo").val());
            var cb = $("#corte_ancho").val();
            var ch = $("#corte_largo").val();
            var escala = 250 / b;
            var cortes, sobrante;
            var totalCortes;
            var cortesV, cortesH = 0;
            
            clearCanvas();
            $("#micanvas").attr({width: h * escala, height: b * escala, style: "background-color: #fff;"});
            
            cortes = acomoda(b, h, "N", "V");
            totalCortes = cortes.cortesT;
            
            dibujaCuadricula(cortes.cortesB, cortes.cortesH, cb, ch, 0, 0, escala);
            
            if (cortes.sobranteB >= ch) {
                sobrante = acomoda(cortes.sobranteB, b, "H", "H");
                totalCortes += sobrante.cortesT;
                dibujaCuadricula(sobrante.cortesH, sobrante.cortesB, ch, cb, cortes.cortesB * cb * escala, 0, escala, "R");
            } else if (cortes.sobranteH >= cb) {
                sobrante = acomoda(cortes.sobranteH, h, "H", "H");
                totalCortes += sobrante.cortesT;
                dibujaCuadricula(sobrante.cortesB, sobrante.cortesH, ch, cb, 0, cortes.cortesH * ch * escala, escala, "R");
            } else {
                sobrante = {
                    cortesT: 0,
                    cortesB: 0,
                    cortesH: 0,
                    sobranteB: 0,
                    sobranteH: 0,
                    areaUtilizada: 0
                };
            }
            
            $(this).addClass('disabled');
            $("#orientacion_h").removeClass('disabled');

            if (parseInt(cb) < parseInt(ch)) {
                cortesV = cortes.cortesT;
                cortesH = sobrante.cortesT;
            } else {
                cortesV = sobrante.cortesT;
                cortesH = cortes.cortesT;
            }
            
            calcularArea(b, h, cb, ch, totalCortes);
            calcular(b, h, cortesV, cortesH, totalCortes, cortes.cortesT, "V");
        }
    });

    $('#orientacion_h').click(function(e) {
        e.preventDefault();
        
        if(validarForma() === 1){
            orientacion = "Horizontal";
            var b = Math.max($("#papel_ancho").val(),$("#papel_largo").val());
            var h = Math.min($("#papel_ancho").val(),$("#papel_largo").val());
            var cb = $("#corte_ancho").val();
            var ch = $("#corte_largo").val();
            var escala = 250 / b;
            var cortes, sobrante;
            var totalCortes;
            var cortesV, cortesH = 0;
            
            clearCanvas();
            $("#micanvas").attr({width: b * escala, height: h * escala, style: "background-color: #fff;"});
            
            cortes = acomoda(b, h, "N", "H");
            totalCortes = cortes.cortesT;
            
            dibujaCuadricula(cortes.cortesB, cortes.cortesH, cb, ch, 0, 0, escala);
            
            if (cortes.sobranteB >= ch) {
                sobrante = acomoda(cortes.sobranteB, h, "H", "H");
                totalCortes += sobrante.cortesT;
                dibujaCuadricula(sobrante.cortesH, sobrante.cortesB, ch, cb, cortes.cortesB * cb * escala, 0, escala, "R");
            } else if (cortes.sobranteH >= cb) {
                sobrante = acomoda(cortes.sobranteH, b, "H", "H");
                totalCortes += sobrante.cortesT;
                dibujaCuadricula(sobrante.cortesB, sobrante.cortesH, ch, cb, 0, cortes.cortesH * ch * escala, escala, "R");
            } else {
                sobrante = {
                    cortesT: 0,
                    cortesB: 0,
                    cortesH: 0,
                    sobranteB: 0,
                    sobranteH: 0,
                    areaUtilizada: 0
                };
            }
             
            $(this).addClass('disabled');
            $("#orientacion_v").removeClass('disabled');
            
            if (parseInt(cb) < parseInt(ch)) {
                cortesV = cortes.cortesT;
                cortesH = sobrante.cortesT;
            } else {
                cortesV = sobrante.cortesT;
                cortesH = cortes.cortesT;
            }
            
            calcularArea(b, h, cb, ch, totalCortes);
            calcular(b, h, cortesV, cortesH, totalCortes, cortes.cortesT, "H");
          
        }
    });
    
    $('#maximo').click(function(e){
        e.preventDefault();
        
        if(validarForma() === 1) {
            orientacion = "Maximo";
            var b = Math.max($("#papel_ancho").val(),$("#papel_largo").val());
            var h = Math.min($("#papel_ancho").val(),$("#papel_largo").val());
            var cb = Math.max($("#corte_ancho").val(),$("#corte_largo").val());
            var ch = Math.min($("#corte_ancho").val(),$("#corte_largo").val());
            var escala = 250 / b;
            var a1h = h;
            var a1b = b;
            var a2h, a2b, sumaCortes = 0;
            var corteA1, corteA2;
            var totalCortes;
            var acomodo1, acomodo2 = {
                a1b: "",
                a2b: "",
                a1h: "",
                a2h: "",
                sumaCortes: "" 
            };
            
            clearCanvas();
            $("#micanvas").attr({width: b * escala, height: h * escala, style: "background-color: #fff;"});
            
            $("#orientacion_v").removeClass('disabled');
            $("#orientacion_h").removeClass('disabled');

            var cortes =acomoda(b, h, "H", "M");
            
            totalCortes = cortes.cortesT;
            acomodo1 = {
                a1b: b, 
                a2b: b, 
                a1h: h, 
                a2h: 0, 
                sumaCortes: totalCortes, 
                cortesH1: cortes.cortesH,
                cortesB1: cortes.cortesB,
                cortesT1: cortes.cortesT,
                cortesH2: 0,
                cortesB2: 0,
                cortesT2: 0
            };
            
            for (x = 0; x <= cortes.cortesH; x++) {
                a2b = b;
                a2h = (ch * x) + cortes.sobranteH;
                a1h = h - a2h;

                corteA1 = acomoda(a1b, a1h, "H", "N");
                corteA2 = acomoda(a2b, a2h, "V", "N");
                
                sumaCortes = corteA1.cortesT + corteA2.cortesT;
                
                if(sumaCortes > totalCortes) {
                    totalCortes = sumaCortes;
                    acomodo1 = {
                        a1b: a1b, 
                        a2b: a2b, 
                        a1h: a1h, 
                        a2h: a2h, 
                        sumaCortes: totalCortes, 
                        cortesH1: corteA1.cortesH, 
                        cortesB1: corteA1.cortesB,
                        cortesT1: corteA1.cortesT,
                        cortesH2: corteA2.cortesH,
                        cortesB2: corteA2.cortesB,
                        cortesT2: corteA2.cortesT
                    };
                }
            }
            
            totalCortes = cortes.cortesT;
            acomodo2 = {a1b: b, a2b: 0, a1h: h, a2h: h, sumaCortes: totalCortes, cortesH: totalCortes, cortesV: 0};
            
            for (x = 0; x <= cortes.cortesB; x++) {
                a2h, a1h = h;
                a2b = (cb * x) + cortes.sobranteB;
                a1b = (b - a2b);               

                corteA1 = acomoda(a1b, a1h, "H", "N");
                corteA2 = acomoda(a2b, a2h, "V", "N");
                
                sumaCortes = corteA1.cortesT + corteA2.cortesT;
                
                if(sumaCortes > totalCortes) {
                    totalCortes = sumaCortes;
                    acomodo2 = {
                        a1b: a1b, 
                        a2b: a2b, 
                        a1h: a1h, 
                        a2h: a2h, 
                        sumaCortes: totalCortes, 
                        cortesH1: corteA1.cortesH, 
                        cortesB1: corteA1.cortesB,
                        cortesT1: corteA1.cortesT,
                        cortesH2: corteA2.cortesH,
                        cortesB2: corteA2.cortesB,
                        cortesT2: corteA2.cortesT
                    };
                }
            }

            if(acomodo2.sumaCortes > acomodo1.sumaCortes) {
                calcularArea(b, h, cb, ch, acomodo2.sumaCortes);
                calcular(b, h, acomodo2.cortesT2, acomodo2.cortesT1, parseInt(acomodo2.sumaCortes), acomodo2.sumaCortes, "M");
                dibujaCuadricula(acomodo2.cortesB1, acomodo2.cortesH1, cb, ch, 0, 0, escala);
                dibujaCuadricula(acomodo2.cortesB2, acomodo2.cortesH2, ch, cb, acomodo2.cortesB1 * cb * escala, 0, escala, "R");
            } else {
                calcularArea(b, h, cb, ch, acomodo1.sumaCortes);
                calcular(b, h, acomodo1.cortesT2, acomodo1.cortesT1, acomodo1.sumaCortes, parseInt(acomodo1.sumaCortes), "M");
                dibujaCuadricula(acomodo1.cortesB1, acomodo1.cortesH1, cb, ch, 0, 0, escala);
                dibujaCuadricula(acomodo1.cortesB2, acomodo1.cortesH2, ch, cb, 0, acomodo1.cortesH1 * ch * escala, escala);
            }
        }
    });

    $('#reset').click(function(e) {
        e.preventDefault();
        clearCanvas();
        reset();
    });

    $("#form_calc input").keypress(function(e) {
        return NumCheck(e, this);
    });

    function NumCheck(e, field) {
        key = e.keyCode ? e.keyCode : e.which;
        if (key === 8 || key === 9)
            return true;
        if (key > 47 && key < 58) {
            if ($(field).attr('id') != 'cortes_deseados') {
                if (field.value === "")
                    return true;
                regexp = /.[0-9]{3}$/;
                return !(regexp.test(field.value));
            }
            else {
                if (field.value === "")
                    return true;
                regexp = /.[0-9]{5}$/;
                return !(regexp.test(field.value));
            }
        }
        if (key === 46) {
            if (field.value === "")
                return false;
            regexp = /^[0-9]+$/;
            return regexp.test(field.value);
        }
        return false;
    }
});

function acomodaOK(d1, d2, acomodoCorte, acomodoPliego) {
    var corteAncho = $("#corte_ancho").val();
    var corteLargo = $("#corte_largo").val();
    var cb = 1;
    var ch = 1;
    var b = 1;
    var h = 1;
    
    if(acomodoPliego === "V") {
        b = Math.min(d1, d2);
        h = Math.max(d1, d2);
    } else if (acomodoPliego === "H") {
        b = Math.max(d1, d2);
        h = Math.min(d1, d2);        
    } else {
        b = d1;
        h = d2;
    }
    
    if (acomodoCorte === 'H') {
        cb = Math.max(corteAncho, corteLargo);
        ch = Math.min(corteAncho, corteLargo);       
    } else if(acomodoCorte === 'V') {
        cb = Math.min(corteAncho, corteLargo);
        ch = Math.max(corteAncho, corteLargo);   
    } else {
        cb = corteAncho;
        ch = corteLargo;
    }
    
    var cortesT = (parseInt(b / cb)) * (parseInt(h / ch));
    var cortesB = parseInt(b / cb);
    var cortesH = parseInt(h / ch);
    var sobranteB = parseFloat((b - (cortesB * cb)).toFixed(2));
    var sobranteH = parseFloat((h - (cortesH * ch)).toFixed(2));
    var areaUtilizada = parseFloat(((cb * ch) * (parseInt(b / cb)) * (parseInt(h / ch))).toFixed(2));
    
    var cortes = {
        cortesT: cortesT,
        cortesB: cortesB,
        cortesH: cortesH,
        sobranteB: sobranteB,
        sobranteH: sobranteH,
        areaUtilizada: areaUtilizada
    };
    
    return cortes;
}


function acomoda(d1, d2, acomodoCorte, acomodoPliego) {
    var corteAncho = $("#corte_ancho").val();
    var corteLargo = $("#corte_largo").val();
    var cb = 1;
    var ch = 1;
    var b = 1;
    var h = 1;
    
    if(acomodoPliego === "V") {
        b = Math.min(d1, d2);
        h = Math.max(d1, d2);
    } else if (acomodoPliego === "H") {
        b = Math.max(d1, d2);
        h = Math.min(d1, d2);        
    } else {
        b = d1;
        h = d2;
    }
    
    if (acomodoCorte === 'H') {
        cb = Math.max(corteAncho, corteLargo);
        ch = Math.min(corteAncho, corteLargo);       
    } else if(acomodoCorte === 'V') {
        cb = Math.min(corteAncho, corteLargo);
        ch = Math.max(corteAncho, corteLargo);   
    } else {
        cb = corteAncho;
        ch = corteLargo;
    }

    var cortesT = Math.floor(b / cb) * Math.floor(h / ch);
    var cortesB = Math.floor(b / cb);
    var cortesH = Math.floor(h / ch);
    var sobranteB = b - (cortesB * cb);
    var sobranteH = h - (cortesH * ch);
    var areaUtilizada = cb * ch * (Math.floor(b / cb) * Math.floor(h / ch));
    var cortes = {
        cortesT: cortesT,
        cortesB: cortesB,
        cortesH: cortesH,
        sobranteB: sobranteB,
        sobranteH: sobranteH,
        areaUtilizada: areaUtilizada
    };
    
    return cortes;
}



function calcular(b, h, cortesV, cortesH, totalCortes, utilizables, orientacion) {
    var cortesDeseados = $("#cortes_deseados").val();
    var pliegosP = 1;
    var pliegos = 0;
    
    if (orientacion === "H") {
        pliegos = Math.ceil(cortesDeseados / utilizables);
    } else if (orientacion === "V") {
        pliegos = Math.ceil(cortesDeseados / utilizables);
    } else {
        pliegos = Math.ceil(cortesDeseados / totalCortes);
    }

    if(pliegos !== 0 && !isNaN(pliegos)) {
        pliegosP = pliegos;
    } else if (isNaN(pliegos)) {
        pliegos = 0;
    }
    
    no_total_cortes = totalCortes * pliegos;
    imprimirResultados(totalCortes, pliegos, no_total_cortes, cortesH, cortesV, utilizables);
}

function clearCanvas() {
    var canvas = document.getElementById("micanvas");
    var context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);
}

function calcularArea(ancho_papel, largo_papel, ancho_corte, largo_corte, cortes_en_pliego) {
    var area_papel = ancho_papel * largo_papel;
    var area_corte = ancho_corte * largo_corte;

    var area_utilizada_cortes = cortes_en_pliego * area_corte;

    var porcentaje_area_utilizada = ((area_utilizada_cortes * 100) / area_papel).toFixed(2);
    var porcentaje_area_inutilizada = (100 - porcentaje_area_utilizada).toFixed(2);

    $("#area_utilizada").text(porcentaje_area_utilizada);
    $("#area_inutilizada").text(porcentaje_area_inutilizada);
}

function imprimirResultados(cortes_pliego, pliegos, cortes, cortesH, cortesV, utilizables) {
    $("#cortes_pliego").text(cortes_pliego);
    $("#cortes_utilizables").text(utilizables);
    $("#pliegos").text(pliegos);
    $("#numero_cortes").text(cortes);
    $("#numero_cortes_vertical").text(cortesV);
    $("#numero_cortes_horizontal").text(cortesH);
}

function validarForma() {
    var valida = 1;
    if ($("#papel_ancho").val() === '') {
        valida = 0;
    }

    if ($("#papel_largo").val() === '') {
        valida = 0;
    }

    if ($("#corte_largo").val() === '') {
        valida = 0;
    }

    if ($("#corte_ancho").val() === '') {
        valida = 0;
    }
    
    if ($("#papel_ancho").val() > 125 || $("#papel_largo").val() > 125) {
        valida = 0;
        alert("El valor máximo para ancho y/o largo es de 125 cm.")
    }
    
    return valida;
}

function reset() {
    $("#papel_ancho").val('');
    $("#papel_largo").val('');
    $("#corte_ancho").val('');
    $("#corte_largo").val('');
    $("#cortes_deseados").val('');
}

function dibujaCuadricula(cortesX, cortesY, width, height, coorX, coorY, escala, color) {
    
    if(color === "R") {
        color = '#d9534f';
    } else {
        color = '#286090';
    }
    
    var canvas = document.getElementById("micanvas");
    var context = canvas.getContext('2d');
    var coorY1 = coorY;
    var coorX1 = coorX;
    
    width = escala * width;
    height = escala * height;
    
    for (x = 1; x <= cortesX; x++) {
        
        coorY = coorY1;
        
        for (y = 1; y <=cortesY; y++) {
            
            context.beginPath();
            context.fillStyle = color;
            context.rect(coorX, coorY, width, height);
            context.fill();
            context.lineWidth = .5;
            context.strokeStyle = 'white';                      
                       
            context.stroke();
            
            coorY = (height * y) + coorY1;
        }
        
        coorX = (width * x) + coorX1;
    }
}

function isInt(n) {
   return n % 1 === 0;
}