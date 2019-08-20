$('body').on('submit', '.sendler', function(){
var form= $(this);
	// Проверка полей формы
		var classError='wrong';
		var checkedGroups=',';

		function checkFullness(handle)
		{
			var error = true;
			var attribute = String($(handle).attr('class').split(' ').filter(function(e){
				return e.indexOf('required') !== -1}));

			if(attribute.indexOf('group')===0){
				attribute=attribute.substring(9);
			}

			var required = true;//флаг обязательности
			if(attribute.indexOf('Y')===-1){
				required=false;
			}
			var format=attribute;//проверка на формат
			if(required)
				format=attribute.substr(2);
			switch($(handle).attr('type'))
			{
				case 'checkbox': if(!$(handle).prop('checked'))
					{ error=false; }
					break;
				case 'radio': if(!$(handle).prop('checked') && $('[name="'+$(handle).attr('name')+'"]:checked').length==0)
					{ error=false; }
					else
					error='radio';
					break;
				default: if($(handle).val().trim().length==0 || $(handle).val()=='0')
					{ if(required) error=false; }
					else
					{
						if(format==='required-num')
						{
							var regCheck = new RegExp('[^0-9\s-]+');
							if(regCheck.test($(handle).val()))
								error='wrong';
						}
						if(format==='required-email')
						{
							var regCheck = new RegExp("^([0-9a-zA-Z]+[-._+&amp;])*[0-9a-zA-Z]+@([-0-9a-zA-Z]+[.])+[a-zA-Z]{2,6}$");
							if(!regCheck.test($(handle).val()))
								error='wrong';
						}
					}
				break;
			}
			if(!error && $(handle).attr('confirmInfo') && $(handle).attr('confirmInfo').indexOf('self')!==-1 && $(handle).attr('checkforconfirm').indexOf('group')!==-1)//выводим хинт для уникального множественного ошибки
			{
				var title = " значение поля";//подпись к пункту
				if(typeof $(handle).attr('title') !== 'undefined' && $(handle).attr('title').length>0)
					title=$(handle).attr('title');
				$($(handle).attr('confirmInfo').substr(4)).after("<div class='wrong-text'>"+title+"</div>");
			}
			if(error==='wrong' && $(handle).attr('confirmInfo') && $(handle).attr('checkforconfirm').indexOf('group')!==-1)//выводим хинт для уникального множественного оказии
			{
				$($(handle).attr('confirmInfo').substr(4)).after("<div class='wrong-text'>Неверное значение поля</div>");
			}
			return error;

		}

		function prepareChecking(handle)// запускает проверку конкретного элемента и маркерует ошибочные
		{
			var error=true;//возвращаемое значение; смысл - просто показать, что есть ошибка принимает значение: true - нет ошибок; false - поле не заполнено; 'wrong' - поле заполнено неправильно; 'radio' - радиокнопка отмечена и нет ошибок
			var title = " значение поля " + $(handle).attr('placeholder');//подпись к пункту
			if(typeof $(handle).attr('title') !== 'undefined' && $(handle).attr('title').length>0) {
				title=$(handle).attr('title');
			}
			var after = handle;//куда лепить
			var attribute = String($(handle).attr('class').split(' ').filter(function(e){
				return e.indexOf('required') !== -1}));

			if(attribute.indexOf('group')!==-1)//группа
			{
				var groupIndex = String(attribute.split('_').filter(function(e){
				return e.indexOf('group') !== -1})).slice(5);
				$("[class*='group" + groupIndex + "']").each(function() {
					error=checkFullness(this);
					switch(error)
					{
						case true : error=checkFullness(this); break;
						case 'radio' : if(checkFullness(this)==='wrong') error = false; break;//???
						case false : if(checkFullness(this)==='radio'){
							error = 'radio';}
							$("[class*='group" + groupIndex + "']").each(function() {
								if($(this).val()!=0){
									error=true;
								}
							});
							if(checkFullness(this)==='radio'){
								error = 'radio';}
							break;
						
						default: checkFullness(this);break;
					}

					if(error!==true && error!=='radio'){
						$("[class*='group" + groupIndex + "']").each(function(){
							if(typeof $(this).attr('title') !== 'undefined'){
								title=$(this).attr('title');
							}
							after=$(this).attr('confirmInfo');
						});
						
						if(error==='wrong')
							$(after).after("<div class='wrong-text'>Неверное значение поля</div>");
						else
							$(after).after("<div class='wrong-text'>"+title+"</div>");//html ошибки
						
						$("[class*='group" + groupIndex + "']").each(function(){
							$(this).addClass(classError);//добавление класса всей группе
						});
						
						error=false;
					}

					if(error==='radio')//Радио значит всё хорошо
							error=true;
					});
				}

			else//одиночное
			{
				error=checkFullness(handle);
				if(error){
				}
				if(!error || error == 'wrong')
				{
					if(typeof $(handle).attr('confirmInfo') !== 'undefined' && $(handle).attr('confirmInfo').length>0)
					{
						after=$(handle).attr('confirmInfo');
					}
					if(typeof $(handle).attr('title') !== 'undefined')
					{
						if(typeof $(handle).attr('confirmInfo') !== 'undefined' && $(handle).attr('confirmInfo').length>0){
							if(error==='wrong')
								$(after).append("<div class='wrong-text'>Неверное значение поля</div>");
							else
								$(after).append("<div class='wrong-text'>"+title+"</div>");//html ошибки в указаном блоке
						}
						else{
							if(error==='wrong')
								$(after).after("<div class='wrong-text'>Неверное значение поля</div>");
							else
								$(after).after("<div class='wrong-text'>"+title+"</div>");//html ошибки под блоком объекта
						}
					}
					$(handle).addClass(classError);//добавление класса
					error=false;
				}
			}
			return error;
		}

		function checktrueAttr(form)//подготавливает данные
		{
			var error=true, classError='wrong';
			checkedGroups=',';
			$('div.wrong-text').remove();//убираем сообщения ошибок если такие есть
			$('.'+classError).each(function(){$(this).removeClass(classError);});//убираем подсветку ошибок
			$(form).find('[class *= "required"]').each(function(){//Перебираем объекты нуждающиеся в обязательном заполнении
				if(error) error=prepareChecking(this);
				else prepareChecking(this);
			}); 
			return error;
			// return false;
		}

	if(checktrueAttr(form)){
		formData = new FormData(form.get(0)); // создаем новый экземпляр объекта и передаем ему нашу форму (*)
		formData.append('template',form.attr('name'));
		var method, action;
		if(form.attr('method') != undefined){ method = form.attr('method'); }
		else{ method = 'POST'; };
		if(form.attr('action') != undefined){ action = form.attr('action'); }
		else{ action = 'php/function-send-form.php'; };
		$.ajax({ // инициaлизируeм ajax зaпрoс
			url: action,
			type: method,
			contentType: false, // важно - убираем форматирование данных по умолчанию
			processData: false, // важно - убираем преобразование строк по умолчанию
			dataType: 'html', // oтвeт ждeм в html фoрмaтe
			data: formData, // дaнныe для oтпрaвки
			beforeSend: function(data) { // сoбытиe дo oтпрaвки
				form.find('input[type="submit"]').attr('disabled', 'disabled'); // нaпримeр, oтключим кнoпку, чтoбы нe жaли пo 100 рaз
			},
			success: function(data){ // сoбытиe пoслe удaчнoгo oбрaщeния к сeрвeру и пoлучeния oтвeтa
				if (data['error']) { // eсли oбрaбoтчик вeрнул oшибку
					form.find('.response').html(data['error']); // пoкaжeм eё тeкст
				} else { // eсли всe прoшлo oк
					// form.find('.response').html(data);
					form[0].reset();
					form.find('[class *= "required"]').removeClass('wrong'); // Очищаем от классов ошибок.
					$.get('ajax/thanks.html', function (response) {
						globalPopup.html(response).show();
					});
					// setTimeout(function(){$('.exit').trigger('click');}, 2500); // Через время имитируем нажатие кнопки закрытия
				}
			},
			error: function (xhr, ajaxOptions, thrownError) { // в случae нeудaчнoгo зaвeршeния зaпрoсa к сeрвeру
				form.find('.response').html(xhr.status); // пoкaжeм oтвeт сeрвeрa
				form.find('.response').html(thrownError); // и тeкст oшибки
			},
			complete: function(data) { // сoбытиe пoслe любoгo исхoдa
				form.find('input[type="submit"]').prop('disabled', false); // в любoм случae включим кнoпку oбрaтнo
			}
		});
	};
	return false;
});