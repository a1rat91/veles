<?php
include "header.tpl"; 
$subject = "Форма обратной связи";
$return_msg = "Ваша заявка успешно отправлена!";
 ?>

				<h1>Заказ обратного звонка</h1>

				<p style="font-size: 16px;">Имя: <?php echo $name;?></p>
				<p style="font-size: 16px;">Телефон: <?php echo $phone;?></p>

				<p style="font-size: 16px;">Пользователь откликнулся через: <?php echo $message;?></p>

				<p style="font-size: 16px;">Время заявки: <?php $time = date("F j, Y, g:i a"); echo $time;?></p>
				
<?php include "footer.tpl"; ?>