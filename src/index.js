import 'bootstrap';
import jQuery from 'jquery';
import './scss/base.scss'
import 'bootstrap/dist/css/bootstrap.min.css';
let mark = require('./images/mark.png');

jQuery(function() {
	//Задание z-index вкладкам меню при загрузке страницы
	let os=document.getElementsByClassName('nav-item');
	let j = os.length;
    for (let i=0; i<os.length; i++) {
        os[i].style.zIndex = j;
		j--;
    };	
	
	jQuery('#TabMenu .active').parent().find('.bgMenuItem').css({'fill' : '#fff'});
	
	//Задание стилей вкладок меню при их переключении
	jQuery('.nav-link').on( "click", function() {
		jQuery('#TabMenu').find('.bgMenuItem').css({'fill' : '#edeeef'});
		jQuery('.nav-item').removeClass('activeTab');
		jQuery(this).parent().addClass('activeTab');
		jQuery(this).parent().find('.bgMenuItem').css({'fill' : '#fff'});
		
		let prev = jQuery(this).parent().prevAll();
		let j = prev.length;
		//z-index вкладок слева от аткивной задать на понижение (3, 2, 1...)
		for (let i=0; i<prev.length; i++) {
			prev[i].style.zIndex = j;
			j--;
		};	
		let next = jQuery(this).parent().nextAll();
		let k = next.length;
		//z-index вкладок справа от аткивной задать на повышение (1, 2, 3...)
		for (let i=0; i<next.length; i++) {
			next[i].style.zIndex = k;
			k--
		};
	});

	//Функция анимации стрелок при открытии/закрытии вкладок мобильного меню (<768px)
	jQuery('.card-header').on("click", function(e){
		if(jQuery(this).hasClass('active_trig')) {
			jQuery(this).children('.arrow').children().attr('d', 'M 7,7 L 12,12 L 12,12 L 17,7');
			jQuery(this).children('.arrow').children().attr('stroke', '#b8bed8');			
			jQuery(this).removeClass('active_trig');
		}
		else {
			jQuery('.arrow').children().attr('d', 'M 7,7 L 12,12 L 12,12 L 17,7');
			jQuery('.card-header').removeClass('active_trig');
			jQuery('.arrow').children().attr('stroke', '#b8bed8');
			jQuery(this).children('.arrow').children().attr('stroke', '#212bff');
			jQuery(this).children('.arrow').children().attr('d', 'M 8,15 L 13,10 L 13,10 L 18,15');
			jQuery(this).addClass('active_trig');			
		}
	});	
	// задание цвета для label отключённого input-а (disabled)
	jQuery('.form-group input:disabled').parent().css({'color' : '#b8bed8'}); 
	// инициализация Яндекс карты при клике на соответствующую вкладку (т.к. карта на закрытой вкладке, по-другому она правильно не масштабируется)
	jQuery('#heading-map, #pickup-tab').one("click", function(e){ 
		ymaps.ready(init);
	});	
});

//Функция создания маски для поля с номером телефона
window.addEventListener("DOMContentLoaded", function() {
	var keyCode;
 
	function mask(event) {
		event.keyCode && (keyCode = event.keyCode);
		var pos = this.selectionStart;
		if (pos < 3) event.preventDefault();
		var matrix = "+7 (___)___-__-__",
			i = 0,
			def = matrix.replace(/\D/g, ""),
			val = this.value.replace(/\D/g, ""),
			new_value = matrix.replace(/[_\d]/g, function(a) {
				return i < val.length ? val.charAt(i++) || def.charAt(i) : a
			});
		i = new_value.indexOf("_");
		if (i != -1) {
			i < 5 && (i = 3);
			new_value = new_value.slice(0, i)
		}
		var reg = matrix.substr(0, this.value.length).replace(/_+/g,
			function(a) {
				return "\\d{1," + a.length + "}"
			}).replace(/[+()]/g, "\\$&");
		reg = new RegExp("^" + reg + "$");
		if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = new_value;
		if (event.type == "blur" && this.value.length < 5)  this.value = ""
	}
	var input = document.querySelector("#InputPhone");
	input.addEventListener("input", mask, false);
	input.addEventListener("focus", mask, false);
	input.addEventListener("blur", mask, false);
	input.addEventListener("keydown", mask, false)
});

// Скрипт Bootstrap валидации полей форм
(function() {
  'use strict';
  window.addEventListener('load', function() {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function(form) {
      form.addEventListener('submit', function(event) {
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add('was-validated');
      }, false);
    });
  }, false);
})();

function init() {
	let	myMap = new ymaps.Map('Ymap', {
        center: [55.753994, 37.622093],
        zoom: 9,
		controls: ['zoomControl']
    });
	// Массив адресов для выставления меток на карте
	let arrAdress = ['Москва, Песчаная улица, дом 13', 'Москва, Подсосненский переулок, дом 11']; 
	jQuery.each(arrAdress,function(index,value){
		ymaps.geocode(value, {
			results: 1
		}).then(function (res) {
				// Выбираем первый результат геокодирования.
				let firstGeoObject = res.geoObjects.get(0),
					// Координаты геообъекта.
					coords = firstGeoObject.geometry.getCoordinates(),
					// Область видимости геообъекта.
					bounds = firstGeoObject.properties.get('boundedBy');
					
				let myPlacemark = new ymaps.Placemark(coords, {
				}, {
					// Опции.
					// Необходимо указать данный тип макета.
					iconLayout: 'default#image',
					// Своё изображение иконки метки.
					iconImageHref: mark,
					// Размеры метки.
					iconImageSize: [30, 42],
					// Смещение левого верхнего угла иконки относительно
					// её "ножки" (точки привязки).
					iconImageOffset: [-5, -38]
				});
				// Отключение скролла карты для тач-устройств.
				if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
					myMap.behaviors.disable('drag');
				}
				myMap.geoObjects.add(myPlacemark);
				// Масштабируем карту на область видимости геообъекта.				
				myMap.setBounds(myMap.geoObjects.getBounds()) 				 
			});	
	});		
}